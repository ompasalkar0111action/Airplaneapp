import mysql from "mysql2/promise";

import { env } from "./env.js";

console.log("DATABASE_URL =", env.DATABASE_URL);
console.log("MYSQL_SSL =", env.MYSQL_SSL);

export const mysqlPool = env.DATABASE_URL
  ? mysql.createPool({
      uri: env.DATABASE_URL,
      ssl: env.MYSQL_SSL ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: false,
    })
  : undefined;
