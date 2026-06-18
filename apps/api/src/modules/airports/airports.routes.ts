import { Router } from "express";

import { AirportsRepository } from "./airports.repository.js";

const airportsRepository = new AirportsRepository();

export const airportsRouter = Router();

// GET /api/airports
// Returns airport list for frontend dropdowns.
airportsRouter.get("/", (_request, response) => {
  response.json({ data: airportsRepository.list() });
});
