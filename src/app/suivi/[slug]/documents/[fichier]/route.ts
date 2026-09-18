import { prisma } from "@/lib/db";
import { lireAcces } from "@/lib/suivi/acces";

/** Devis et documents d'un espace de suivi, servis seulement à qui y a accès. */
export async function GET(_: Request, { params }: { params: Promise<{ slug: string; fichier: string }> }) {
  const { slug, fichier } = await params;
  const acces = await lireAcces(slug);
  if (!acces?.ouvert) return new Response("Accès refusé", { status: 403 });

  const doc = await prisma.suiviDocument.findFirst({ where: { projetSlug: slug, nom: fichier } });
  if (!doc) return new Response("Introuvable", { status: 404 });

  return new Response(new Uint8Array(doc.fichier), {
    headers: {
      "content-type": doc.type,
      "content-disposition": `inline; filename="${doc.nom}"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
}
