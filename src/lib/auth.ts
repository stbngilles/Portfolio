import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

/**
 * Better-Auth — config plateforme Pixel Brut.
 *
 * 4 rôles : ADMIN | COMMERCIAL | CLIENT | DEV
 * Le rôle est stocké sur User.role (default CLIENT) et lu côté serveur
 * pour le routing et l'autorisation.
 *
 * Pour démarrer : email + mot de passe uniquement.
 * Plus tard : magic links, OAuth Google si utile.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // simplifié pour le dev, à activer en prod
    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CLIENT",
        required: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Auto-promotion ADMIN du tout premier user de l'instance.
        // Robuste : tourne côté serveur dans la même transaction, pas de race.
        after: async (user) => {
          const count = await prisma.user.count();
          if (count === 1) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: "ADMIN" },
            });
          }
        },
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 jours
    updateAge: 60 * 60 * 24,      // refresh token toutes les 24h
  },
});

export type Session = typeof auth.$Infer.Session;
