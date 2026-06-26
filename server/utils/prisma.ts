import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "nitro_starter",
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });
