import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Config Prisma 7+ — la connexion DB vit ici, plus dans schema.prisma.
 * En dev : SQLite local. En prod : on échangera l'URL pour Postgres.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
