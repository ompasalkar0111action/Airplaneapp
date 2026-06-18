import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { createApp } from "./app.js";

// Build the Express app.
const app = createApp();

// Start listening on the configured port.
app.listen(env.PORT, () => {
  logger.info("Booking API started", {
    port: env.PORT,
    webOrigin: env.WEB_ORIGIN,
  });
});
