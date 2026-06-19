import assert from "node:assert/strict";
import test from "node:test";

import { flightsService } from "../../container.js";
import { InMemoryBookingsRepository } from "./bookings.repository.js";
import { BookingsService } from "./bookings.service.js";

// Test service with in-memory data.
const bookingsService = new BookingsService(new InMemoryBookingsRepository(), flightsService);

test("creates a booking and prevents the same seat from being booked twice", async () => {
  // First search a sample flight from the demo data.
  const flight = flightsService.searchFlights({
    origin: "DEL",
    destination: "DXB",
    date: "2026-06-05",
    cabin: "economy",
    passengers: 1,
  })[0];

  assert.ok(flight, "a seeded flight should be returned");

  // Choose one seat for testing.
  const seatId = "11A";

  // First booking should succeed.
  const booking = await bookingsService.createBooking({
    flightId: flight.id,
    cabin: "economy",
    seatId,
    passenger: {
      firstName: "Ava",
      lastName: "Stone",
      email: "ava.stone@example.com",
    },
    extras: {
      checkedBags: 1,
      priorityBoarding: false,
    },
  });

  assert.equal(booking.seatId, seatId);
  assert.equal(flightsService.findSeat(flight.id, seatId).isAvailable, false);

  // Second booking for the same seat should fail.
  await assert.rejects(async () => {
    await bookingsService.createBooking({
      flightId: flight.id,
      cabin: "economy",
      seatId,
      passenger: {
        firstName: "Liam",
        lastName: "Cole",
        email: "liam.cole@example.com",
      },
      extras: {
        checkedBags: 0,
        priorityBoarding: true,
      },
    });
  });
});
