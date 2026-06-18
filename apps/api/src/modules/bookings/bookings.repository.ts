import type { CabinClass } from "../../data/catalog.js";

// Shape of one saved booking.
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

export class BookingsRepository {
  // In-memory storage for bookings.
  private readonly bookings = new Map<string, BookingRecord>();

  create(booking: BookingRecord): BookingRecord {
    // Save booking and return it.
    this.bookings.set(booking.id, booking);

    return booking;
  }

  findById(bookingId: string): BookingRecord | undefined {
    // Find booking by id.
    return this.bookings.get(bookingId);
  }
}
