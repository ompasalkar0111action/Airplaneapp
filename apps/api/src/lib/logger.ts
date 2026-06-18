type LogLevel = "info" | "warn" | "error";

// Small logger function that prints JSON logs to the console.
const log = (level: LogLevel, message: string, metadata?: Record<string, unknown>) => {
  const payload = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...(metadata ? { metadata } : {}),
  };

  console[level](JSON.stringify(payload));
};

// Export simple logger methods used in server startup and error handling.
export const logger = {
  info: (message: string, metadata?: Record<string, unknown>) => log("info", message, metadata),
  warn: (message: string, metadata?: Record<string, unknown>) => log("warn", message, metadata),
  error: (message: string, metadata?: Record<string, unknown>) => log("error", message, metadata),
};
