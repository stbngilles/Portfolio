import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Singleton Prisma — évite de spawn N connexions en dev avec le HMR de Next.
 *
 * Prisma 7 utilise désormais des "driver adapters" : le moteur n'est plus
 * intégré au binaire. Pour SQLite, on branche better-sqlite3.
 * Quand on passera à Postgres : remplacer par @prisma/adapter-pg.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const url = (process.env.DATABASE_URL ?? "file:./prisma/dev.db").replace(
    /^file:/,
    "",
  );
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
