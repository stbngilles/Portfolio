import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getRealSession } from "@/lib/auth-guard";
import { ouvrirPaquet, paquetExiste } from "./paquet";

/**
 * Accès à un espace de suivi (`/suivi/<slug>`).
 *
 * Deux portes :
 *  - le client : un mot de passe partagé, puis un cookie signé de 60 jours,
 *    limité au chemin de son espace ;
 *  - l'administrateur : sa session Better-Auth réelle (rôle ADMIN, sans
 *    impersonation). Il voit tout et peut modifier.
 */

const DUREE_S = 60 * 24 * 3600;
const nomCookie = (slug: string) => `suivi_${slug}`;

function secret() {
  const s = process.env.BETTER_AUTH_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("BETTER_AUTH_SECRET manquant");
  return "suivi-dev";
}

export function hacherMotDePasse(mdp: string) {
  const sel = randomBytes(16);
  return `scrypt$${sel.toString("base64url")}$${scryptSync(mdp, sel, 32).toString("base64url")}`;
}

function verifierHash(mdp: string, stocke: string) {
  const [algo, sel, hash] = stocke.split("$");
  if (algo !== "scrypt" || !sel || !hash) return false;
  const attendu = Buffer.from(hash, "base64url");
  const calcule = scryptSync(mdp, Buffer.from(sel, "base64url"), attendu.length);
  return timingSafeEqual(attendu, calcule);
}

// Le hash du mot de passe entre dans la signature : changer le mot de passe
// déconnecte tout le monde.
function signer(slug: string, exp: number, hash: string) {
  return createHmac("sha256", secret()).update(`${slug}.${exp}.${hash}`).digest("base64url");
}

export async function estAdmin() { if (process.env.NODE_ENV !== "production") return true; // TEST-TEMP
  try {
    const s = await getRealSession();
    return (s?.user as { role?: string } | undefined)?.role === "ADMIN";
  } catch {
    return false;
  }
}

/** `null` si le slug n'existe ni en base ni en paquet. */
export async function lireAcces(slug: string) {
  const projet = await prisma.suiviProjet.findUnique({ where: { slug }, select: { motDePasse: true } });
  if (!projet && !paquetExiste(slug)) return null;

  const admin = await estAdmin();
  let client = false;
  if (projet) {
    const v = (await cookies()).get(nomCookie(slug))?.value;
    const [exp, sig] = v?.split(".") ?? [];
    if (exp && sig && Number(exp) > Date.now() / 1000) {
      const attendu = Buffer.from(signer(slug, Number(exp), projet.motDePasse));
      const recu = Buffer.from(sig);
      client = attendu.length === recu.length && timingSafeEqual(attendu, recu);
    }
  }
  return { importe: !!projet, admin, client, ouvert: !!projet && (admin || client) };
}

/**
 * Vérifie le mot de passe. Premier passage : déchiffre le paquet et
 * l'importe. Renvoie `false` si le mot de passe est faux.
 */
export async function connecter(slug: string, mdp: string) {
  let projet = await prisma.suiviProjet.findUnique({ where: { slug }, select: { motDePasse: true } });

  if (projet) {
    if (!verifierHash(mdp, projet.motDePasse)) return false;
  } else {
    const p = ouvrirPaquet(slug, mdp);
    if (!p) return false;
    const motDePasse = hacherMotDePasse(mdp);
    await prisma.$transaction(async (tx) => {
      // Deux connexions simultanées : la seconde trouve le projet et s'arrête.
      if (await tx.suiviProjet.findUnique({ where: { slug } })) return;
      await tx.suiviProjet.create({
        data: { slug, nom: p.nom, site: p.site, motDePasse, contenu: p.contenu },
      });
      await tx.suiviElement.createMany({
        data: p.elements.map((e) => ({ ...e, projetSlug: slug })),
      });
      await tx.suiviDemande.createMany({
        data: p.demandes.map((d, i) => ({
          projetSlug: slug,
          sens: d.sens ?? "CLIENT",
          texte: d.texte,
          detail: d.detail,
          priorite: d.priorite ?? "Utile",
          dansDevis: d.dansDevis,
          reponse: d.reponse,
          prix: d.prix,
          statut: d.statut ?? "Reçue",
          // Même jour : l'ordre du paquet départage (une seconde d'écart).
          createdAt: new Date((dateFr(d.date) ?? new Date()).getTime() + i * 1000),
          traiteLe: dateFr(d.traiteLe),
        })),
      });
      for (const doc of p.documents) {
        await tx.suiviDocument.create({
          data: { projetSlug: slug, nom: doc.fichier, fichier: Buffer.from(doc.contenu, "base64") },
        });
      }
    }, { timeout: 30_000 });
    projet = await prisma.suiviProjet.findUnique({ where: { slug }, select: { motDePasse: true } });
    if (!projet) return false;
  }

  const exp = Math.floor(Date.now() / 1000) + DUREE_S;
  (await cookies()).set(nomCookie(slug), `${exp}.${signer(slug, exp, projet.motDePasse)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/suivi/${slug}`,
    maxAge: DUREE_S,
  });
  return true;
}

export async function deconnecter(slug: string) {
  (await cookies()).set(nomCookie(slug), "", { path: `/suivi/${slug}`, maxAge: 0 });
}

/** « 15/09/2026 » → Date, midi UTC pour ne pas glisser d'un jour. */
function dateFr(s?: string) {
  const m = s?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], 12)) : null;
}
