import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";

const poolConnection = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "3306"),
  connectionLimit: 10,
  supportBigNumbers: true,
});

export const db = drizzle({ client: poolConnection });
