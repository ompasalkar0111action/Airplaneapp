import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

import { isAppError } from "../lib/app-error.js";
import { logger } from "../lib/logger.js";

// Handles unknown routes like /abc or wrong HTTP method.
export const notFoundHandler: RequestHandler = (request, response) => {
  response.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `No route matches ${request.method} ${request.originalUrl}`,
    },
  });
};

// Central error handler for validation errors, app errors, and server errors.
export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  // Handle Zod validation errors in a user-friendly format.
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "The request payload is invalid.",
        details: error.flatten(),
      },
    });

    return;
  }

  // Handle known application errors.
  if (isAppError(error)) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });

    return;
  }

  // Log any unexpected error for debugging.
  logger.error("Unhandled request error", {
    path: request.originalUrl,
    method: request.method,
    error: error instanceof Error ? error.message : "Unknown error",
  });

  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "The server encountered an unexpected error.",
    },
  });
};
