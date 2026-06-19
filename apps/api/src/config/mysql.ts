import mysql from "mysql2/promise";

import { env } from "./env.js";

export const mysqlPool = env.DATABASE_URL
  ? mysql.createPool({
      uri: env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: false,
    })
  : undefined;
