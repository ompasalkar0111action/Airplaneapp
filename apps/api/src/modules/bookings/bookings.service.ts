/*
INPUT:
- selected flight id
- selected seat id
- passenger details
- extra options like bags and priority boarding

PROCESS:
- checks seat and cabin
- calculates total price
- reserves seat
- saves booking

OUTPUT:
- confirmed booking record with booking id and PNR
*/
import { randomUUID } from "node:crypto";

import { AppError } from "../../lib/app-error.js";
import type { FlightsService } from "../flights/flights.service.js";
import { BookingsRepository, type BookingRecord } from "./bookings.repository.js";
import type { CreateBookingInput } from "./bookings.schemas.js";

export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly flightsService: FlightsService,
  ) {}

  createBooking(input: CreateBookingInput): BookingRecord {
    // Booking checks the seat, calculates total price, then saves the record.
    const flight = this.flightsService.getFlightDetail(input.flightId);
    const seat = this.flightsService.findSeat(input.flightId, input.seatId);

    // Seat must still be available at booking time.
    if (!seat.isAvailable) {
      throw new AppError(409, "SEAT_ALREADY_BOOKED", "The selected seat was just reserved. Please choose another seat.");
    }

    // Seat must belong to the cabin selected in the booking form.
    if (seat.cabin !== input.cabin) {
      throw new AppError(400, "CABIN_MISMATCH", "The selected seat does not belong to the chosen cabin.");
    }

    // Total = base fare + seat charge + optional extras.
    const baseFare = flight.cabinAvailability[input.cabin].fare;
    const extrasTotal = input.extras.checkedBags * 1200 + (input.extras.priorityBoarding ? 600 : 0);
    const totalPrice = baseFare + seat.priceModifier + extrasTotal;

    // Mark seat as reserved before saving the booking.
    this.flightsService.reserveSeat(input.flightId, input.seatId);

    return this.bookingsRepository.create({
      id: randomUUID(),
      pnr: createPnr(),
      flightId: input.flightId,
      cabin: input.cabin,
      seatId: input.seatId,
      passenger: input.passenger,
      extras: input.extras,
      totalPrice,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    });
  }

  getBooking(bookingId: string): BookingRecord {
    // Used if the frontend wants to load an existing booking again.
    const booking = this.bookingsRepository.findById(bookingId);

    if (!booking) {
      throw new AppError(404, "BOOKING_NOT_FOUND", `Booking ${bookingId} does not exist.`);
    }

    return booking;
  }
}

function createPnr(): string {
  // PNR is a short booking code shown after successful booking.
  return randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
}
