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
import { mysqlPool } from "./config/mysql.js";
import { InMemoryBookingsRepository } from "./modules/bookings/bookings.repository.js";
import { MysqlBookingsRepository } from "./modules/bookings/mysql-bookings.repository.js";
import { BookingsService } from "./modules/bookings/bookings.service.js";
import { FlightsRepository } from "./modules/flights/flights.repository.js";
import { FlightsService, InventoryRepository, type SeatInventoryRepository } from "./modules/flights/flights.service.js";

// This file creates shared objects once and reuses them across the app.
const airportsRepository = new AirportsRepository();
const flightsRepository = new FlightsRepository();
const mysqlBookingsRepository = mysqlPool ? new MysqlBookingsRepository(mysqlPool) : undefined;
const bookingsRepository = mysqlBookingsRepository ?? new InMemoryBookingsRepository();
const inventoryRepository: SeatInventoryRepository = mysqlBookingsRepository ?? new InventoryRepository();

// Flights service handles flight search and seat availability.
export const flightsService = new FlightsService(airportsRepository, flightsRepository, inventoryRepository);
// Bookings service handles booking creation and booking lookup.
export const bookingsService = new BookingsService(bookingsRepository, flightsService);
