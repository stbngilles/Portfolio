import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export type Role = "ADMIN" | "COMMERCIAL" | "CLIENT" | "DEV";

/**
 * Garde de session côté serveur. À appeler en haut des pages /app/*.
 * - Sans session → /app/login
 * - Avec session mais mauvais rôle → /app (re-dispatch vers le bon espace)
 */
export async function requireRole(...allowed: Role[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/app/login");

  const role = ((session.user as { role?: string }).role ?? "CLIENT") as Role;
  if (allowed.length > 0 && !allowed.includes(role)) {
    redirect("/app");
  }
  return { session, role };
}

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}
