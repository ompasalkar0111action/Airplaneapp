import { z } from "zod";

// Validates booking form data coming from frontend.
export const createBookingSchema = z.object({
  flightId: z.string().min(1),
  cabin: z.enum(["economy", "premium-economy", "business"]),
  seatId: z
    .string()
    .regex(/^\d{1,2}[A-Z]$/, "Seat id must look like 12A"),
  passenger: z.object({
    firstName: z.string().trim().min(2).max(40),
    lastName: z.string().trim().min(2).max(40),
    email: z.string().trim().email(),
  }),
  extras: z
    .object({
      checkedBags: z.coerce.number().int().min(0).max(2).default(0),
      priorityBoarding: z.boolean().default(false),
    })
    .default({
      checkedBags: 0,
      priorityBoarding: false,
    }),
});

// Validates booking id in the URL.
export const bookingIdSchema = z.object({
  bookingId: z.string().uuid(),
});

// Reusable TypeScript type created from booking schema.
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
