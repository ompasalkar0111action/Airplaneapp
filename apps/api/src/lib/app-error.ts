// Custom error class used for expected application errors like
// "seat already booked" or "flight not found".
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Helper function to check whether an error is AppError or not.
export const isAppError = (value: unknown): value is AppError => value instanceof AppError;
