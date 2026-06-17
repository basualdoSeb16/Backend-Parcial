import "dotenv/config";

console.log("USER:", process.env.DATABASE_USER);
console.log("DB:", process.env.DATABASE_NAME);

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "127.0.0.1",
  port: 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export const prisma = new PrismaClient({ adapter });