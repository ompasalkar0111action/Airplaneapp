import type { RequestHandler } from "express";

// Wrap async route handlers so thrown errors go to Express error middleware.
export const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  async (request, response, next) => {
    try {
      await handler(request, response, next);
    } catch (error) {
      next(error);
    }
  };
