import assert from "node:assert/strict";
import test from "node:test";

import { AirportsRepository } from "../airports/airports.repository.js";
import { FlightsRepository } from "./flights.repository.js";
import { FlightsService, type SeatInventoryRepository } from "./flights.service.js";

class BrokenInventoryRepository implements SeatInventoryRepository {
  async listBookedSeats(): Promise<Set<string>> {
    throw new Error("database unavailable");
  }

  async isSeatBooked(): Promise<boolean> {
    throw new Error("database unavailable");
  }

  async reserveSeat(): Promise<void> {
    throw new Error("database unavailable");
  }
}

test("returns flights when booked-seat inventory cannot be loaded", async () => {
  const service = new FlightsService(
    new AirportsRepository(),
    new FlightsRepository(),
    new BrokenInventoryRepository(),
  );

  const flights = await service.searchFlights({
    origin: "DEL",
    destination: "DXB",
    date: "2026-06-23",
    cabin: "economy",
    passengers: 1,
  });

  assert.ok(flights.length > 0);
  assert.equal(flights[0]?.origin?.code, "DEL");
  assert.equal(flights[0]?.destination?.code, "DXB");
});
