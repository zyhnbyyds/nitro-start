import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

const db = drizzle({ client: connection });
await migrate(db, { migrationsFolder: "./server/db/migrations" });
await connection.end();
