import { prisma } from "@/lib/db";

/**
 * Indique si la DB est vide d'utilisateurs.
 * Utilisé par /app/signup pour savoir si l'inscrivant deviendra ADMIN.
 */
export async function GET() {
  const count = await prisma.user.count();
  return Response.json({ empty: count === 0, count });
}
