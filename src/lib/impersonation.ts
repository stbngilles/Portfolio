import { cookies } from "next/headers";

/**
 * Impersonation — seuls ADMIN et DEV peuvent prendre la vue d'un autre user.
 * On stocke l'id de la cible dans un cookie httpOnly. Le user réel
 * reste dans la session Better-Auth ; on superpose juste l'identité effective.
 */
export const IMPERSONATE_COOKIE = "pb_impersonate";

export async function getImpersonatedUserId(): Promise<string | null> {
  const c = await cookies();
  return c.get(IMPERSONATE_COOKIE)?.value ?? null;
}

export async function setImpersonatedUserId(userId: string | null) {
  const c = await cookies();
  if (userId) {
    c.set(IMPERSONATE_COOKIE, userId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8h max — sécurité
    });
  } else {
    c.delete(IMPERSONATE_COOKIE);
  }
}
