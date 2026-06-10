import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./db";
import { getImpersonatedUserId } from "./impersonation";

export type Role = "ADMIN" | "COMMERCIAL" | "CLIENT" | "DEV" | "COMPTABLE";

type EffectiveUser = {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
};

/**
 * Récupère la session "réelle" Better-Auth.
 * Pas utilisé directement par les pages ; sert au système d'impersonation.
 */
export async function getRealSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Renvoie la session effective :
 *  - si un cookie d'impersonation est posé ET que le user réel est ADMIN ou DEV
 *    ET que la cible existe, la session "ressemble" à celle de la cible.
 *  - sinon, retour direct de la session réelle.
 *
 * Aussi : `isImpersonating` permet au layout d'afficher la bannière.
 */
export async function getEffectiveSession() {
  const real = await getRealSession();
  if (!real) return null;

  const realRole = ((real.user as { role?: string }).role ?? "CLIENT") as Role;
  let effective: EffectiveUser = {
    id: real.user.id,
    email: real.user.email,
    name: real.user.name,
    role: realRole,
  };
  let isImpersonating = false;
  let realUser: EffectiveUser = effective;

  if (realRole === "ADMIN" || realRole === "DEV") {
    const targetId = await getImpersonatedUserId();
    if (targetId && targetId !== real.user.id) {
      const target = await prisma.user.findUnique({
        where: { id: targetId },
        select: { id: true, email: true, name: true, role: true },
      });
      if (target) {
        effective = {
          id: target.id,
          email: target.email,
          name: target.name,
          role: (target.role as Role) ?? "CLIENT",
        };
        isImpersonating = true;
      }
    }
  }

  return { user: effective, realUser, isImpersonating };
}

/**
 * Garde de session pour les pages /app/*. Redirige vers /login si pas connecté,
 * vers /app si rôle non autorisé. Tient compte de l'impersonation.
 */
export async function requireRole(...allowed: Role[]) {
  const session = await getEffectiveSession();
  if (!session) redirect("/app/login");
  if (allowed.length > 0 && !allowed.includes(session.user.role)) {
    redirect("/app");
  }
  return {
    session: { user: session.user },
    role: session.user.role,
    isImpersonating: session.isImpersonating,
    realUser: session.realUser,
  };
}

/** Alias historique — utilisé ailleurs. */
export async function getCurrentSession() {
  return getEffectiveSession();
}
