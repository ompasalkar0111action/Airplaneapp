/*
INPUT:
- no direct user input

PROCESS:
- creates repository objects
- creates service objects
- connects services with repositories

OUTPUT:
- shared flightsService and bookingsService used by routes
*/
import { AirportsRepository } from "./modules/airports/airports.repository.js";
import { BookingsRepository } from "./modules/bookings/bookings.repository.js";
import { BookingsService } from "./modules/bookings/bookings.service.js";
import { FlightsRepository } from "./modules/flights/flights.repository.js";
import { FlightsService, InventoryRepository } from "./modules/flights/flights.service.js";

// This file creates shared objects once and reuses them across the app.
const airportsRepository = new AirportsRepository();
const flightsRepository = new FlightsRepository();
const inventoryRepository = new InventoryRepository();
const bookingsRepository = new BookingsRepository();

// Flights service handles flight search and seat availability.
export const flightsService = new FlightsService(airportsRepository, flightsRepository, inventoryRepository);
// Bookings service handles booking creation and booking lookup.
export const bookingsService = new BookingsService(bookingsRepository, flightsService);
