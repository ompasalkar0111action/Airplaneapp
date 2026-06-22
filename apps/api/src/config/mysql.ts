import mysql from "mysql2/promise";

import { env } from "./env.js";
import { logger } from "../lib/logger.js";

logger.info("MySQL configuration loaded", {
  databaseUrlConfigured: Boolean(env.DATABASE_URL),
  sslEnabled: env.MYSQL_SSL,
});

export const mysqlPool = env.DATABASE_URL
  ? mysql.createPool({
      uri: env.DATABASE_URL,
      ssl: env.MYSQL_SSL ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: false,
    })
  : undefined;
