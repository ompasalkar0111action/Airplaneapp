/*
INPUT:
- booking form data
- booking id

PROCESS:
- validates request
- calls bookings service

OUTPUT:
- booking confirmation
- booking lookup result
*/
import { Router } from "express";

import { bookingsService } from "../../container.js";
import { asyncHandler } from "../../lib/http.js";
import { bookingIdSchema, createBookingSchema } from "./bookings.schemas.js";

export const bookingsRouter = Router();

// POST /api/bookings
// Creates a new booking.
bookingsRouter.post(
  "/",
  asyncHandler(async (request, response) => {
    const bookingInput = createBookingSchema.parse(request.body);
    const booking = await bookingsService.createBooking(bookingInput);

    response.status(201).json({ data: booking });
  }),
);

// GET /api/bookings/:bookingId
// Returns one booking record by id.
bookingsRouter.get(
  "/:bookingId",
  asyncHandler(async (request, response) => {
    const { bookingId } = bookingIdSchema.parse(request.params);
    const booking = await bookingsService.getBooking(bookingId);

    response.json({ data: booking });
  }),
);
