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

export interface BookingsRepository {
  create(booking: BookingRecord): Promise<BookingRecord>;
  findById(bookingId: string): Promise<BookingRecord | undefined>;
}

export class InMemoryBookingsRepository implements BookingsRepository {
  // In-memory storage for bookings.
  private readonly bookings = new Map<string, BookingRecord>();

  async create(booking: BookingRecord): Promise<BookingRecord> {
    // Save booking and return it.
    this.bookings.set(booking.id, booking);

    return booking;
  }

  async findById(bookingId: string): Promise<BookingRecord | undefined> {
    // Find booking by id.
    return this.bookings.get(bookingId);
  }
}
