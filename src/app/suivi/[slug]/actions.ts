"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { connecter, deconnecter, lireAcces } from "@/lib/suivi/acces";
import { sendSuiviNotif } from "@/lib/email";

export type Retour = { erreur?: string; ok?: boolean };

const txt = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);
const opt = (f: FormData, k: string, max = 2000) => txt(f, k, max) || null;
const slugDe = (f: FormData) => txt(f, "slug", 80);
const PRIORITES = ["Bloquant", "Utile", "Plus tard"];

async function exiger(slug: string, qui: "client" | "admin") {
  const a = await lireAcces(slug);
  if (!a?.ouvert || (qui === "admin" && !a.admin)) throw new Error("Accès refusé");
  return a;
}

/** Les deux interfaces lisent les mêmes lignes : on les rafraîchit ensemble. */
function rafraichir(slug: string) {
  revalidatePath(`/suivi/${slug}`);
  revalidatePath(`/suivi/${slug}/admin`);
}

async function contact(slug: string) {
  const p = await prisma.suiviProjet.findUniqueOrThrow({ where: { slug }, select: { nom: true, contenu: true } });
  return { projet: p.nom, prenom: (p.contenu as { contact?: string }).contact ?? p.nom };
}

// ---------------------------------------------------------------- connexion

export async function seConnecter(_: Retour, f: FormData): Promise<Retour> {
  const slug = slugDe(f);
  const mdp = txt(f, "motdepasse", 200);
  if (!mdp) return { erreur: "Entre le mot de passe." };
  if (!(await connecter(slug, mdp))) {
    // Freine les essais en série.
    await new Promise((r) => setTimeout(r, 800));
    return { erreur: "Mot de passe incorrect. Vérifie les majuscules." };
  }
  redirect(`/suivi/${slug}`);
}

export async function seDeconnecter(f: FormData) {
  const slug = slugDe(f);
  await deconnecter(slug);
  redirect(`/suivi/${slug}`);
}

// ---------------------------------------------------------------- le client écrit

export async function creerDemande(_: Retour, f: FormData): Promise<Retour> {
  const slug = slugDe(f);
  await exiger(slug, "client");
  const texte = txt(f, "texte", 4000);
  if (texte.length < 3) return { erreur: "Décris ta demande en quelques mots." };
  const priorite = PRIORITES.includes(txt(f, "priorite")) ? txt(f, "priorite") : "Utile";

  await prisma.suiviDemande.create({ data: { projetSlug: slug, sens: "CLIENT", texte, priorite } });
  const c = await contact(slug);
  await sendSuiviNotif({
    slug,
    sujet: `${c.prenom} t'a écrit (${priorite}), ${c.projet}`,
    titre: `Nouvelle demande de ${c.prenom}.`,
    lignes: [`Priorité : ${priorite}`, texte],
  });
  rafraichir(slug);
  return { ok: true };
}

/**
 * Le client répond à ce qui l'attend : une demande de Pixelbrute
 * (« En attente »), ou un prix proposé sur l'une des siennes
 * (« Attente confirmation »). Une action par bouton : la valeur du bouton
 * cliqué n'arrive pas dans le FormData d'une action serveur.
 */
async function repondre(f: FormData, geste: "Validée" | "Refusée" | "Fait" | "Réponse") {
  const slug = slugDe(f);
  await exiger(slug, "client");
  const d = await prisma.suiviDemande.findFirst({
    where: { id: txt(f, "id"), projetSlug: slug, statut: { in: ["En attente", "Attente confirmation"] } },
  });
  if (!d) return;
  const mot = opt(f, "mot", 2000);
  await prisma.suiviDemande.update({
    where: { id: d.id },
    data: {
      ...(geste === "Réponse" ? {} : { statut: geste, traiteLe: new Date() }),
      ...(mot ? { reponseClient: mot } : {}),
    },
  });
  const c = await contact(slug);
  const verbe = { Validée: "a validé", Refusée: "a refusé", Fait: "a fait", Réponse: "a répondu à" }[geste];
  await sendSuiviNotif({
    slug,
    sujet: `${c.prenom} ${verbe} : ${d.texte}`,
    titre: `${c.prenom} ${verbe} ta demande.`,
    lignes: [`${d.texte}${d.prix ? ` (${d.prix} HTVA)` : ""}`, mot ? `Son mot : ${mot}` : null],
  });
  rafraichir(slug);
}

export async function valider(f: FormData) {
  await repondre(f, "Validée");
}
export async function refuser(f: FormData) {
  await repondre(f, "Refusée");
}
export async function marquerFait(f: FormData) {
  await repondre(f, "Fait");
}
export async function envoyerMot(f: FormData) {
  await repondre(f, "Réponse");
}

// ---------------------------------------------------------------- admin : demandes

/** Pixelbrute demande quelque chose au client. Avec un prix, c'est une validation. */
export async function demanderAuClient(f: FormData) {
  const slug = slugDe(f);
  await exiger(slug, "admin");
  const texte = txt(f, "texte", 400);
  if (!texte) return;
  const prix = opt(f, "prix", 40);
  await prisma.suiviDemande.create({
    data: {
      projetSlug: slug,
      sens: "PIXELBRUTE",
      texte,
      detail: opt(f, "detail", 4000),
      prix,
      dansDevis: prix ? "Non" : null,
      priorite: PRIORITES.includes(txt(f, "priorite")) ? txt(f, "priorite") : "Utile",
      statut: "En attente",
    },
  });
  rafraichir(slug);
}

export async function majDemande(f: FormData) {
  const slug = slugDe(f);
  await exiger(slug, "admin");
  const statut = txt(f, "statut");
  await prisma.suiviDemande.update({
    where: { id: txt(f, "id"), projetSlug: slug },
    data: {
      ...(f.has("texte") && txt(f, "texte") ? { texte: txt(f, "texte", 4000) } : {}),
      ...(f.has("detail") ? { detail: opt(f, "detail", 4000) } : {}),
      ...(f.has("reponse") ? { reponse: opt(f, "reponse", 4000) } : {}),
      ...(f.has("dansDevis") ? { dansDevis: opt(f, "dansDevis") } : {}),
      prix: opt(f, "prix", 40),
      ...(statut ? { statut } : {}),
      priorite: PRIORITES.includes(txt(f, "priorite")) ? txt(f, "priorite") : "Utile",
      traiteLe: new Date(),
    },
  });
  rafraichir(slug);
}

export async function supprimerDemande(f: FormData) {
  const slug = slugDe(f);
  await exiger(slug, "admin");
  await prisma.suiviDemande.delete({ where: { id: txt(f, "id"), projetSlug: slug } });
  rafraichir(slug);
}

// ---------------------------------------------------------------- admin : éléments

function champsElement(f: FormData) {
  return {
    groupe: txt(f, "groupe", 120) || "Divers",
    titre: txt(f, "titre", 300),
    devis: opt(f, "devis", 300),
    detail: opt(f, "detail"),
    besoin: opt(f, "besoin"),
    date: opt(f, "date", 80),
    statut: opt(f, "statut", 60),
    remarque: opt(f, "remarque"),
  };
}

export async function majElement(f: FormData) {
  const slug = slugDe(f);
  await exiger(slug, "admin");
  const data = champsElement(f);
  if (!data.titre) return;
  await prisma.suiviElement.update({ where: { id: txt(f, "id"), projetSlug: slug }, data });
  rafraichir(slug);
}

export async function ajouterElement(f: FormData) {
  const slug = slugDe(f);
  await exiger(slug, "admin");
  const data = champsElement(f);
  if (!data.titre) return;
  const etat = txt(f, "etat") === "LIVRE" ? "LIVRE" : "EN_COURS";
  const dernier = await prisma.suiviElement.aggregate({ where: { projetSlug: slug }, _max: { ordre: true } });
  await prisma.suiviElement.create({
    data: { ...data, etat, projetSlug: slug, ordre: (dernier._max.ordre ?? 0) + 1 },
  });
  rafraichir(slug);
}

/** Passe un élément « en cours » dans « livré », vérifié aujourd'hui. */
export async function marquerLivre(f: FormData) {
  const slug = slugDe(f);
  await exiger(slug, "admin");
  const e = await prisma.suiviElement.findFirst({ where: { id: txt(f, "id"), projetSlug: slug } });
  if (!e) return;
  await prisma.suiviElement.update({
    where: { id: e.id },
    data: {
      etat: "LIVRE",
      statut: "Fait",
      date: new Date().toLocaleDateString("fr-BE", { timeZone: "Europe/Brussels" }),
      // « Ce qui manque » n'a plus de sens une fois livré : le champ devient « Où le voir ».
      detail: null,
      besoin: null,
    },
  });
  rafraichir(slug);
}

export async function supprimerElement(f: FormData) {
  const slug = slugDe(f);
  await exiger(slug, "admin");
  await prisma.suiviElement.delete({ where: { id: txt(f, "id"), projetSlug: slug } });
  rafraichir(slug);
}

// ---------------------------------------------------------------- présentation

/**
 * Le client ferme la présentation d'accueil : elle ne s'ouvrira plus seule.
 * L'admin qui la prévisualise ne la marque pas comme vue.
 */
export async function presentationVue(slug: string) {
  const a = await lireAcces(slug);
  if (!a?.ouvert || a.admin) return;
  await prisma.suiviProjet.updateMany({
    where: { slug, presentationVueLe: null },
    data: { presentationVueLe: new Date() },
  });
}

/** Salutation et mot de la fin, écrits depuis la page : ils ne passent jamais par le dépôt public. */
export async function majPresentation(f: FormData) {
  const slug = slugDe(f);
  await exiger(slug, "admin");
  const p = await prisma.suiviProjet.findUniqueOrThrow({ where: { slug }, select: { contenu: true } });
  const contenu = p.contenu as Record<string, unknown>;
  await prisma.suiviProjet.update({
    where: { slug },
    data: {
      contenu: { ...contenu, presentation: { bonjour: txt(f, "bonjour", 120), mot: txt(f, "mot", 3000), tu: f.get("tu") === "on" } },
      // Remettre à zéro : la présentation se rouvrira à la prochaine visite du client.
      ...(f.get("rouvrir") === "on" ? { presentationVueLe: null } : {}),
    },
  });
  rafraichir(slug);
}
