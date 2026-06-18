/*
INPUT:
- incoming HTTP requests from frontend

PROCESS:
- runs middleware
- sends request to correct route
- handles errors

OUTPUT:
- JSON responses for airports, flights, bookings, and health check
*/
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { airportsRouter } from "./modules/airports/airports.routes.js";
import { bookingsRouter } from "./modules/bookings/bookings.routes.js";
import { flightsRouter } from "./modules/flights/flights.routes.js";


export const createApp = () => {
  // Create Express application.
  const app = express();

  // Security and request middlewares. // origin: env.WEB_ORIGIN.split(",").map((origin) => origin.trim()), - previously used

  app.use(helmet());
  app.use(
    cors({
        origin: env.WEB_ORIGIN.split(",").map(o => o.trim()),
    credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    }),
  );

  // Simple health route to check whether server is running.
  app.get("/health", (_request, response) => {
    response.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Main API routes.
  app.use("/api/airports", airportsRouter);
  app.use("/api/flights", flightsRouter);
  app.use("/api/bookings", bookingsRouter);

  // Error handlers must come after the routes.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
