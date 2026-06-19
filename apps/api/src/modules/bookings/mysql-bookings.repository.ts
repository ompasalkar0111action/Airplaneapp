import type { Pool, RowDataPacket } from "mysql2/promise";

import type { BookingRecord, BookingsRepository } from "./bookings.repository.js";

interface BookingRow extends RowDataPacket {
  id: string;
  pnr: string;
  flight_id: string;
  cabin: BookingRecord["cabin"];
  seat_id: string;
  passenger_first_name: string;
  passenger_last_name: string;
  passenger_email: string;
  checked_bags: number;
  priority_boarding: 0 | 1;
  total_price: number;
  created_at: Date;
  status: BookingRecord["status"];
}

export class MysqlBookingsRepository implements BookingsRepository {
  private ready?: Promise<unknown>;

  constructor(private readonly pool: Pool) {}

  async create(booking: BookingRecord): Promise<BookingRecord> {
    await this.ensureTable();

    await this.pool.execute(
      `INSERT INTO bookings (
        id,
        pnr,
        flight_id,
        cabin,
        seat_id,
        passenger_first_name,
        passenger_last_name,
        passenger_email,
        checked_bags,
        priority_boarding,
        total_price,
        created_at,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking.id,
        booking.pnr,
        booking.flightId,
        booking.cabin,
        booking.seatId,
        booking.passenger.firstName,
        booking.passenger.lastName,
        booking.passenger.email,
        booking.extras.checkedBags,
        booking.extras.priorityBoarding,
        booking.totalPrice,
        new Date(booking.createdAt),
        booking.status,
      ],
    );

    return booking;
  }

  async findById(bookingId: string): Promise<BookingRecord | undefined> {
    await this.ensureTable();

    const [rows] = await this.pool.execute<BookingRow[]>("SELECT * FROM bookings WHERE id = ? LIMIT 1", [bookingId]);
    const row = rows[0];

    if (!row) {
      return undefined;
    }

    return {
      id: row.id,
      pnr: row.pnr,
      flightId: row.flight_id,
      cabin: row.cabin,
      seatId: row.seat_id,
      passenger: {
        firstName: row.passenger_first_name,
        lastName: row.passenger_last_name,
        email: row.passenger_email,
      },
      extras: {
        checkedBags: row.checked_bags,
        priorityBoarding: Boolean(row.priority_boarding),
      },
      totalPrice: Number(row.total_price),
      createdAt: row.created_at.toISOString(),
      status: row.status,
    };
  }

  private ensureTable(): Promise<unknown> {
    return (this.ready ??= this.pool.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(36) PRIMARY KEY,
        pnr VARCHAR(6) NOT NULL UNIQUE,
        flight_id VARCHAR(120) NOT NULL,
        cabin ENUM('economy', 'premium-economy', 'business') NOT NULL,
        seat_id VARCHAR(8) NOT NULL,
        passenger_first_name VARCHAR(100) NOT NULL,
        passenger_last_name VARCHAR(100) NOT NULL,
        passenger_email VARCHAR(255) NOT NULL,
        checked_bags INT NOT NULL DEFAULT 0,
        priority_boarding BOOLEAN NOT NULL DEFAULT FALSE,
        total_price INT NOT NULL,
        created_at DATETIME NOT NULL,
        status ENUM('confirmed') NOT NULL DEFAULT 'confirmed',
        UNIQUE KEY bookings_flight_seat_unique (flight_id, seat_id),
        KEY bookings_pnr_index (pnr),
        KEY bookings_email_index (passenger_email)
      )
    `));
  }
}
