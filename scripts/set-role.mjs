// Usage : node scripts/set-role.mjs <email> <ADMIN|COMMERCIAL|CLIENT|DEV>
// Promotion (ou rétrogradation) d'un utilisateur par email.
//
// Exemple : node scripts/set-role.mjs gilles.esteban.2004@gmail.com ADMIN

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const VALID = ["ADMIN", "COMMERCIAL", "CLIENT", "DEV"];

const [, , email, role] = process.argv;

if (!email || !role) {
  console.error("Usage: node scripts/set-role.mjs <email> <ADMIN|COMMERCIAL|CLIENT|DEV>");
  process.exit(1);
}
if (!VALID.includes(role)) {
  console.error(`Rôle invalide. Valeurs autorisées : ${VALID.join(", ")}`);
  process.exit(1);
}

const url = (process.env.DATABASE_URL ?? "file:./dev.db").replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

const updated = await prisma.user.update({
  where: { email },
  data: { role },
});

console.log(`✔ ${updated.email} promu ${updated.role}`);
await prisma.$disconnect();
