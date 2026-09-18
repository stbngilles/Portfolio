"use server";

import { headers } from "next/headers";
import { getRessource, type Ressource } from "@/components/home/ressources";
import { ressourceEmail } from "./email";
import { createToken } from "./token";

/**
 * Demande d'une ressource (`ressources.ts`) : elle part par e-mail, jamais
 * à l'écran.
 *
 * C'est tout l'intérêt : une fausse adresse ne reçoit rien, donc la liste
 * d'envoi ne se remplit que d'adresses réelles. L'e-mail porte la liste
 * complète et un lien signé vers la version à cocher (`token.ts`).
 *
 * Ensuite, le contact entre dans la liste Brevo n° 1 (`BREVO_NEWSLETTER_LIST_ID`),
 * avec la même clé que les e-mails de la plateforme. La clé doit avoir les
 * droits « Contacts » et « E-mails transactionnels ».
 *
 * Un contact perdu en silence, c'est exactement le point 27 de la checklist.
 * Si l'ajout à la liste échoue, la demande part par le Formspree du
 * formulaire de contact : elle arrive au moins dans la boîte mail, à
 * reporter à la main dans Brevo.
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
// Liste « Newsletter » du compte Brevo, et expéditeur sur le domaine
// vérifié. Des valeurs, pas des secrets : seule la clé vit dans Vercel.
const LIST_ID = Number(process.env.BREVO_NEWSLETTER_LIST_ID ?? 1);
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? "contact@pixelbrute.be";
const FROM_NAME = process.env.BREVO_FROM_NAME ?? "Esteban, Pixelbrute";
const SITE_URL = "https://pixelbrute.be";
const FORMSPREE = "https://formspree.io/f/xdaawkyd";

export type SubscribeState = { ok: boolean; error?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function toBrevo(email: string, prenom: string, nom: string) {
  if (!BREVO_API_KEY || !Number.isInteger(LIST_ID) || LIST_ID <= 0) return false;

  const post = (attributes?: Record<string, string>) =>
    fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ email, attributes, listIds: [LIST_ID], updateEnabled: true }),
    });

  try {
    // PRENOM et NOM sont les attributs par défaut d'un compte Brevo en
    // français. Si le compte les nomme autrement, Brevo refuse tout l'appel :
    // on réessaie sans eux plutôt que de perdre l'adresse.
    let res = await post({ PRENOM: prenom, NOM: nom });
    if (res.status === 400) {
      console.error("[ressource:brevo:attributes]", await res.text());
      res = await post();
    }
    if (res.ok) {
      console.log("[ressource:brevo:ok]", res.status);
      return true;
    }
    console.error("[ressource:brevo:error]", res.status, await res.text());
  } catch (err) {
    console.error("[ressource:brevo:throw]", err);
  }
  return false;
}

async function toFormspree(r: Ressource, email: string, prenom: string, nom: string, provenance: string) {
  try {
    const res = await fetch(FORMSPREE, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        _subject: `Ressource « ${r.slug} », inscription newsletter à reporter dans Brevo`,
        ressource: r.slug,
        prenom,
        nom,
        email,
        newsletter: "oui, case cochée",
        provenance,
      }),
    });
    if (!res.ok) console.error("[ressource:formspree:error]", res.status, await res.text());
  } catch (err) {
    console.error("[ressource:formspree:throw]", err);
  }
}

/** Envoie la checklist. Sans clé Brevo (en local), le lien s'affiche dans la console. */
async function sendRessource(r: Ressource, email: string, prenom: string, nom: string) {
  const base = process.env.NODE_ENV === "production" ? SITE_URL : `http://${(await headers()).get("host")}`;
  const link = `${base}/ressources/${r.slug}?t=${createToken(r.slug)}`;
  const { subject, html } = ressourceEmail(r, prenom, link);

  if (!BREVO_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      console.error("[ressource:send:no-key] BREVO_API_KEY absente de cet environnement");
      return false;
    }
    console.log("[ressource:noop]", email, link);
    return true;
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email, name: `${prenom} ${nom}` }],
        replyTo: { email: "contact@pixelbrute.be" },
        subject,
        htmlContent: html,
        tags: ["ressource", r.slug],
      }),
    });
    if (res.ok) {
      console.log("[ressource:send:ok]", r.slug, await res.text());
      return true;
    }
    console.error("[ressource:send:error]", res.status, await res.text());
  } catch (err) {
    console.error("[ressource:send:throw]", err);
  }
  return false;
}

export async function requestRessource(form: FormData): Promise<SubscribeState> {
  const text = (k: string) => String(form.get(k) ?? "").trim().slice(0, 200);

  // Piège à robots : on fait comme si tout allait bien, sans rien envoyer.
  if (text("_gotcha")) {
    console.warn("[ressource:gotcha] champ piège rempli, rien n'est envoyé");
    return { ok: true };
  }

  const r = getRessource(text("ressource"));
  if (!r) return { ok: false, error: "Cette ressource n'existe plus." };

  const prenom = text("prenom");
  const nom = text("nom");
  const email = text("email").toLowerCase();

  if (!prenom || !nom) return { ok: false, error: "Il manque ton prénom ou ton nom." };
  if (!EMAIL.test(email)) return { ok: false, error: "Cette adresse e-mail ne semble pas valide." };
  if (form.get("newsletter") !== "oui") {
    return { ok: false, error: "Coche la case newsletter pour recevoir la checklist." };
  }

  if (!(await sendRessource(r, email, prenom, nom))) {
    return { ok: false, error: "L'e-mail n'est pas parti. Vérifie ton adresse, ou réessaie dans un instant." };
  }
  if (!(await toBrevo(email, prenom, nom))) {
    await toFormspree(r, email, prenom, nom, text("provenance"));
  }
  return { ok: true };
}
