/*
INPUT:
- search query from frontend
- flight id from frontend

PROCESS:
- validates request data
- calls flights service

OUTPUT:
- matching flights
- selected flight details with seat map
*/
import { Router } from "express";

import { flightsService } from "../../container.js";
import { asyncHandler } from "../../lib/http.js";
import { flightIdSchema, searchFlightsSchema } from "./flights.schemas.js";

export const flightsRouter = Router();

// GET /api/flights/search
// Returns flights matching the search form.
flightsRouter.get(
  "/search",
  asyncHandler(async (request, response) => {
    const criteria = searchFlightsSchema.parse(request.query);
    const results = await flightsService.searchFlights(criteria);

    response.json({ data: results });
  }),
);

// GET /api/flights/:flightId
// Returns one selected flight with its seat map.
flightsRouter.get(
  "/:flightId",
  asyncHandler(async (request, response) => {
    const { flightId } = flightIdSchema.parse(request.params);
    const flight = await flightsService.getFlightDetail(flightId);

    response.json({ data: flight });
  }),
);
