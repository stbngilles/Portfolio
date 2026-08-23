// Usage : node scripts/set-role.mjs <email> <ADMIN|COMMERCIAL|CLIENT|DEV|COMPTABLE>
// Promotion (ou rétrogradation) d'un utilisateur par email.
//
// Exemple : node scripts/set-role.mjs gilles.esteban.2004@gmail.com ADMIN
//
// Connexion alignée sur `src/lib/db.ts` : Pool pg + adaptateur PrismaPg.
// (Le script tournait encore sur better-sqlite3, supprimé des dépendances
//  lors du passage à PostgreSQL / Neon — il échouait donc à l'import.)

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const VALID = ["ADMIN", "COMMERCIAL", "CLIENT", "DEV", "COMPTABLE"];

const [, , email, role] = process.argv;

if (!email || !role) {
  console.error(`Usage: node scripts/set-role.mjs <email> <${VALID.join("|")}>`);
  process.exit(1);
}
if (!VALID.includes(role)) {
  console.error(`Rôle invalide. Valeurs autorisées : ${VALID.join(", ")}`);
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL manquante — renseignez-la dans .env avant de lancer le script.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

try {
  const updated = await prisma.user.update({
    where: { email },
    data: { role },
  });
  console.log(`✔ ${updated.email} promu ${updated.role}`);
} catch (err) {
  // Prisma P2025 : aucun utilisateur ne porte cet email.
  if (err?.code === "P2025") {
    console.error(`Aucun utilisateur avec l'email « ${email} ».`);
    process.exit(1);
  }
  throw err;
} finally {
  await prisma.$disconnect();
  await pool.end();
}
