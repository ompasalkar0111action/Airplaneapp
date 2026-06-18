import { z } from "zod";

// Simple date format used in requests.
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

// Validates the frontend flight search query.
export const searchFlightsSchema = z
  .object({
    origin: z.string().trim().toUpperCase().length(3),
    destination: z.string().trim().toUpperCase().length(3),
    date: z.string().regex(datePattern, "Date must be in YYYY-MM-DD format"),
    cabin: z.enum(["economy", "premium-economy", "business"]).default("economy"),
    passengers: z.coerce.number().int().min(1).max(9).default(1),
  })
  .superRefine((value, context) => {
    // Extra check: origin and destination should not be the same.
    if (value.origin === value.destination) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Origin and destination must be different",
        path: ["destination"],
      });
    }
  });

// Validates flight id in route parameters.
export const flightIdSchema = z.object({
  flightId: z.string().min(1),
});

// Reusable TypeScript type created from the Zod schema.
export type SearchFlightsInput = z.infer<typeof searchFlightsSchema>;
