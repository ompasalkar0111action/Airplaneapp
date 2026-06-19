import { z } from "zod";

// This schema defines which environment variables the backend can use.
const envSchema = z.object({
  PORT: z.coerce.number().int().min(1000).max(65535).default(8080),
  WEB_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().optional(),
});

// Parse and validate environment values once when the server starts.
export const env = envSchema.parse(process.env);
