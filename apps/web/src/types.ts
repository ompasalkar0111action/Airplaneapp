// Shared frontend type for cabin names.
export type CabinClass = "economy" | "premium-economy" | "business";

// Airport data shown in search dropdowns.
export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

// Fare and seat count for one cabin.
export interface FlightCabinOffer {
  fare: number;
  seatsLeft: number;
}

// Flight data used in the flight list.
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
  origin?: Airport;
  destination?: Airport;
  stopoverAirport?: Airport;
  amenities: string[];
  reliability: string;
  cabinAvailability: Record<CabinClass, FlightCabinOffer>;
}

// Seat data shown when one flight is selected.
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

// Flight detail = summary + seat map.
export interface FlightDetail extends FlightSummary {
  seatMap: Seat[];
}

// Returned after booking is completed.
export interface BookingRecord {
  id: string;
  pnr: string;
  flightId: string;
  cabin: CabinClass;
  seatId: string;
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
  };
  extras: {
    checkedBags: number;
    priorityBoarding: boolean;
  };
  totalPrice: number;
  createdAt: string;
  status: "confirmed";
}

// Search form shape used by frontend.
export interface SearchRequest {
  origin: string;
  destination: string;
  date: string;
  cabin: CabinClass;
  passengers: number;
}

// Booking request shape sent from frontend to backend.
export interface BookingRequest {
  flightId: string;
  cabin: CabinClass;
  seatId: string;
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
  };
  extras: {
    checkedBags: number;
    priorityBoarding: boolean;
  };
}
