// Crée ou remet à niveau un compte ADMIN de la plateforme (connexion email + mot de passe).
//
//   ADMIN_MDP='…' node scripts/admin-compte.mjs <email> [nom]
//
// Compte absent : il est créé. Compte présent : son mot de passe est remplacé
// et il passe ADMIN. Le mot de passe ne vient que de la variable d'environnement,
// jamais d'un fichier : le dépôt est public.
//
// Haché par Better-Auth lui-même (`better-auth/crypto`) : c'est le format que
// la page de connexion vérifie.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { Pool } from "pg";
import "dotenv/config";

const [, , email, nom] = process.argv;
const mdp = process.env.ADMIN_MDP;

if (!email || !mdp) {
  console.error("Usage : ADMIN_MDP='…' node scripts/admin-compte.mjs <email> [nom]");
  process.exit(1);
}
if (mdp.length < 8) {
  console.error("Mot de passe trop court : 8 caractères au moins (minPasswordLength de src/lib/auth.ts).");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL manquante : renseignez-la dans .env avant de lancer le script.");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

try {
  const password = await hashPassword(mdp);
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, name: nom ?? null, role: "ADMIN", emailVerified: true },
    update: { role: "ADMIN", ...(nom ? { name: nom } : {}) },
  });
  // Better-Auth range le mot de passe sur le compte « credential », accountId = id du user.
  const compte = await prisma.account.findFirst({ where: { userId: user.id, providerId: "credential" } });
  if (compte) {
    await prisma.account.update({ where: { id: compte.id }, data: { password } });
  } else {
    await prisma.account.create({ data: { userId: user.id, accountId: user.id, providerId: "credential", password } });
  }
  console.log(`✔ ${user.email} : ADMIN, mot de passe ${compte ? "remplacé" : "créé"}.`);
} finally {
  await prisma.$disconnect();
  await pool.end();
}
