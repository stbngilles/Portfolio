import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Promotion ADMIN du premier utilisateur. Sécurisé par double contrôle :
 *  1. Une session valide est requise.
 *  2. L'opération ne s'applique que si l'appelant est l'unique user existant.
 * Impossible donc d'élever un compte par la suite via cet endpoint.
 */
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const count = await prisma.user.count();
  if (count !== 1) {
    return new Response("Bootstrap déjà effectué.", { status: 409 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: "ADMIN" },
  });

  return Response.json({ ok: true, role: "ADMIN" });
}
