import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Le lien d'accès envoyé par e-mail : `/ressources/<slug>?t=<id>.<signature>`.
 *
 * Un identifiant aléatoire signé, rien d'autre. Pas d'adresse dedans, même
 * encodée : l'URL finit dans l'historique, et peut-être dans les statistiques.
 * La signature suffit à prouver que le lien est sorti d'un e-mail envoyé par
 * le site. Un lien partagé ouvre la liste à celui qui le reçoit, c'est voulu.
 *
 * La signature couvre le slug : le lien d'une ressource n'ouvre pas les
 * autres. Changer le secret invalide tous les liens déjà envoyés.
 */
function secret() {
  const s = process.env.CHECKLIST_SECRET ?? process.env.BETTER_AUTH_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("CHECKLIST_SECRET manquant");
  return "pixelbrute-dev";
}

const sign = (slug: string, id: string) =>
  createHmac("sha256", secret()).update(`ressource:${slug}:${id}`).digest("base64url").slice(0, 22);

export function createToken(slug: string) {
  const id = randomBytes(9).toString("base64url");
  return `${id}.${sign(slug, id)}`;
}

export function isValidToken(slug: string, t: string | undefined): t is string {
  if (!t || t.length > 64) return false;
  const [id, sig] = t.split(".");
  if (!id || !sig) return false;
  const want = Buffer.from(sign(slug, id));
  const got = Buffer.from(sig);
  return got.length === want.length && timingSafeEqual(got, want);
}
