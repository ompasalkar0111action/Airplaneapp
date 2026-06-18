/*
INPUT:
- search values like origin, destination, date, cabin
- one flight id
- one seat id

PROCESS:
- filters flight data
- builds flight summaries
- builds seat maps
- checks and reserves seats

OUTPUT:
- flight list
- flight details
- seat availability information
*/
import type { CabinClass, FlightTemplate } from "../../data/catalog.js";
import { AppError } from "../../lib/app-error.js";
import { AirportsRepository } from "../airports/airports.repository.js";
import { FlightsRepository } from "./flights.repository.js";
import type { SearchFlightsInput } from "./flights.schemas.js";

export interface Seat {
  id: string;
  row: number;
  letter: string;
  cabin: CabinClass;
  isAvailable: boolean;
  priceModifier: number;
  isExtraLegroom: boolean;
  zoneLabel: string;
}

export interface FlightCabinOffer {
  fare: number;
  seatsLeft: number;
}

export interface FlightSummary {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  departureDate: string;
  arrivalDate: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  durationLabel: string;
  stops: number;
  origin: ReturnType<AirportsRepository["findByCode"]>;
  destination: ReturnType<AirportsRepository["findByCode"]>;
  stopoverAirport?: ReturnType<AirportsRepository["findByCode"]>;
  amenities: string[];
  reliability: string;
  cabinAvailability: Record<CabinClass, FlightCabinOffer>;
}

export interface FlightDetail extends FlightSummary {
  seatMap: Seat[];
}

export class InventoryRepository {
  // This stores booked seats in memory using:
  // flightId -> set of booked seat ids
  private readonly bookedSeatsByFlightId = new Map<string, Set<string>>();

  listBookedSeats(flightId: string): Set<string> {
    return new Set(this.bookedSeatsByFlightId.get(flightId) ?? []);
  }

  isSeatBooked(flightId: string, seatId: string): boolean {
    return this.bookedSeatsByFlightId.get(flightId)?.has(seatId) ?? false;
  }

  reserveSeat(flightId: string, seatId: string): void {
    const next = this.bookedSeatsByFlightId.get(flightId) ?? new Set<string>();
    next.add(seatId);
    this.bookedSeatsByFlightId.set(flightId, next);
  }
}

const narrowBodyLayout = [
  { cabin: "business" as const, startRow: 1, endRow: 4, letters: ["A", "C", "D", "F"], extraLegroomRows: [1, 2], modifier: 1800 },
  {
    cabin: "premium-economy" as const,
    startRow: 5,
    endRow: 7,
    letters: ["A", "B", "C", "D", "E", "F"],
    extraLegroomRows: [5],
    modifier: 900,
  },
  {
    cabin: "economy" as const,
    startRow: 8,
    endRow: 28,
    letters: ["A", "B", "C", "D", "E", "F"],
    extraLegroomRows: [8, 14],
    modifier: 450,
  },
];

const wideBodyLayout = [
  { cabin: "business" as const, startRow: 1, endRow: 6, letters: ["A", "C", "D", "F"], extraLegroomRows: [1, 2], modifier: 2200 },
  {
    cabin: "premium-economy" as const,
    startRow: 7,
    endRow: 10,
    letters: ["A", "B", "D", "E", "F", "G"],
    extraLegroomRows: [7],
    modifier: 1100,
  },
  {
    cabin: "economy" as const,
    startRow: 11,
    endRow: 34,
    letters: ["A", "B", "C", "D", "E", "F", "G", "H"],
    extraLegroomRows: [11, 16, 24],
    modifier: 550,
  },
];

export class FlightsService {
  constructor(
    private readonly airportsRepository: AirportsRepository,
    private readonly flightsRepository: FlightsRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  searchFlights(criteria: SearchFlightsInput): FlightSummary[] {
    // Find flights for the selected route and keep only ones with enough seats.
    return this.flightsRepository
      .listTemplates()
      .filter((template) => template.originCode === criteria.origin && template.destinationCode === criteria.destination)
      .map((template) => this.buildFlightSummary(template, criteria.date))
      .filter((flight) => flight.cabinAvailability[criteria.cabin].seatsLeft >= criteria.passengers)
      .sort((left, right) => left.departureTime.localeCompare(right.departureTime));
  }

  getFlightDetail(flightId: string): FlightDetail {
    // This returns one flight with its seat map for the booking screen.
    const { template, travelDate } = this.parseFlightId(flightId);

    return this.buildFlightDetail(template, travelDate);
  }

  findSeat(flightId: string, seatId: string): Seat {
    // Used during booking to check whether the chosen seat exists.
    const detail = this.getFlightDetail(flightId);
    const seat = detail.seatMap.find((candidate) => candidate.id === seatId);

    if (!seat) {
      throw new AppError(404, "SEAT_NOT_FOUND", `Seat ${seatId} does not exist for this flight.`);
    }

    return seat;
  }

  reserveSeat(flightId: string, seatId: string): void {
    // Prevent the same seat from being booked twice.
    if (this.inventoryRepository.isSeatBooked(flightId, seatId)) {
      throw new AppError(409, "SEAT_ALREADY_BOOKED", `Seat ${seatId} has already been reserved.`);
    }

    this.inventoryRepository.reserveSeat(flightId, seatId);
  }

  private buildFlightSummary(template: FlightTemplate, date: string): FlightSummary {
    // Build one frontend-friendly flight object from raw template data.
    const bookedSeats = this.inventoryRepository.listBookedSeats(this.composeFlightId(template.id, date));
    const seatMap = this.buildSeatMap(template, bookedSeats);
    const [arrivalDate, arrivalTime] = addMinutesToSchedule(date, template.departureTime, template.durationMinutes);

    return {
      id: this.composeFlightId(template.id, date),
      airline: template.airline,
      flightNumber: template.flightNumber,
      aircraft: template.aircraft,
      departureDate: date,
      arrivalDate,
      departureTime: template.departureTime,
      arrivalTime,
      durationMinutes: template.durationMinutes,
      durationLabel: formatDuration(template.durationMinutes),
      stops: template.stops,
      origin: this.airportsRepository.findByCode(template.originCode),
      destination: this.airportsRepository.findByCode(template.destinationCode),
      stopoverAirport: template.stopoverAirportCode
        ? this.airportsRepository.findByCode(template.stopoverAirportCode)
        : undefined,
      amenities: template.amenities,
      reliability: template.reliability,
      cabinAvailability: {
        economy: this.buildCabinOffer(template, seatMap, "economy"),
        "premium-economy": this.buildCabinOffer(template, seatMap, "premium-economy"),
        business: this.buildCabinOffer(template, seatMap, "business"),
      },
    };
  }

  private buildFlightDetail(template: FlightTemplate, date: string): FlightDetail {
    // Flight detail = summary + full seat map.
    const summary = this.buildFlightSummary(template, date);
    const bookedSeats = this.inventoryRepository.listBookedSeats(summary.id);

    return {
      ...summary,
      seatMap: this.buildSeatMap(template, bookedSeats),
    };
  }

  private buildCabinOffer(
    template: FlightTemplate,
    seatMap: Seat[],
    cabin: CabinClass,
  ): FlightCabinOffer {
    // Each cabin shows fare and remaining seat count.
    return {
      fare: template.baseFares[cabin],
      seatsLeft: seatMap.filter((seat) => seat.cabin === cabin && seat.isAvailable).length,
    };
  }

  private buildSeatMap(template: FlightTemplate, bookedSeats: Set<string>): Seat[] {
    // Seat map is generated from simple row/seat layouts instead of a database.
    const layout = template.seatProfile === "wide-body" ? wideBodyLayout : narrowBodyLayout;

    return layout.flatMap((zone) => {
      const zoneLabel =
        zone.cabin === "business" ? "Business" : zone.cabin === "premium-economy" ? "Premium Economy" : "Economy";

      return Array.from({ length: zone.endRow - zone.startRow + 1 }, (_, rowOffset) => {
        const row = zone.startRow + rowOffset;

        return zone.letters.map((letter, index) => {
          // Example seat ids: 11A, 11B, 12C
          const seatId = `${row}${letter}`;
          const isExtraLegroom = zone.extraLegroomRows.includes(row);
          const isWindow = index === 0 || index === zone.letters.length - 1;
          const isAisle =
            index === Math.floor(zone.letters.length / 2) - 1 ||
            index === Math.floor(zone.letters.length / 2) ||
            index === 1 ||
            index === zone.letters.length - 2;
          const positionModifier = isExtraLegroom ? zone.modifier : isWindow || isAisle ? Math.round(zone.modifier / 2) : 0;

          return {
            id: seatId,
            row,
            letter,
            cabin: zone.cabin,
            isAvailable: !bookedSeats.has(seatId),
            priceModifier: positionModifier,
            isExtraLegroom,
            zoneLabel,
          };
        });
      }).flat();
    });
  }

  private parseFlightId(flightId: string): { template: FlightTemplate; travelDate: string } {
    // The app uses flight ids in this form:
    // templateId:YYYY-MM-DD
    const [templateId, travelDate] = flightId.split(":");

    if (!templateId || !travelDate) {
      throw new AppError(400, "INVALID_FLIGHT_ID", "Flight id must be in the format templateId:YYYY-MM-DD.");
    }

    const template = this.flightsRepository.findTemplateById(templateId);

    if (!template) {
      throw new AppError(404, "FLIGHT_NOT_FOUND", `No flight template exists for id ${templateId}.`);
    }

    return { template, travelDate };
  }

  private composeFlightId(templateId: string, date: string): string {
    // Creates one unique id for a flight on a specific date.
    return `${templateId}:${date}`;
  }
}

function formatDuration(durationMinutes: number): string {
  // Example: 220 -> 3h 40m
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

function addMinutesToSchedule(date: string, departureTime: string, durationMinutes: number): [string, string] {
  // Calculates arrival date/time from departure date/time + duration.
  const departure = new Date(`${date}T${departureTime}:00`);
  departure.setMinutes(departure.getMinutes() + durationMinutes);

  const arrivalDate = [
    departure.getFullYear(),
    (departure.getMonth() + 1).toString().padStart(2, "0"),
    departure.getDate().toString().padStart(2, "0"),
  ].join("-");
  const arrivalTime = `${departure.getHours().toString().padStart(2, "0")}:${departure.getMinutes().toString().padStart(2, "0")}`;

  return [arrivalDate, arrivalTime];
}
