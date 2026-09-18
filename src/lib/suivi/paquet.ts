import { createDecipheriv, scryptSync } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { paquet as azimutGames } from "./paquets/azimut-games";

/**
 * Paquets chiffrés, un par espace de suivi. La clé de la table est le slug
 * de l'URL (`/suivi/<slug>`). Un slug absent d'ici et de la base = 404.
 */
const PAQUETS: Record<string, string> = {
  "azimut-games": azimutGames,
};

export type Tarif = { libelle: string; montant: string; precision: string; detail?: string };

export type Contenu = {
  /** Prénom du client (tutoyé) et de qui lui écrit. */
  contact?: string;
  moi?: string;
  tarifs: Tarif[];
  hebergement?: Tarif & { texte: string; lien: string; bouton: string };
  tva?: string;
  /** Présentation d'accueil, écrite depuis la page par l'admin : jamais dans le paquet ni le code. */
  presentation?: { bonjour?: string; mot?: string; tu?: boolean };
  devis: {
    numero: string;
    titre: string;
    emis: string;
    valide: string;
    total: string;
    fichier: string;
    lignes: string[];
  }[];
};

export type Paquet = {
  nom: string;
  site?: string;
  contenu: Contenu;
  elements: {
    etat: "LIVRE" | "EN_COURS";
    groupe: string;
    titre: string;
    devis?: string;
    detail?: string;
    besoin?: string;
    date?: string;
    statut?: string;
    remarque?: string;
    ordre: number;
  }[];
  demandes: {
    sens?: "CLIENT" | "PIXELBRUTE";
    date?: string;
    texte: string;
    detail?: string;
    priorite?: string;
    dansDevis?: string;
    reponse?: string;
    prix?: string;
    statut?: string;
    traiteLe?: string;
  }[];
  documents: { nom: string; fichier: string; contenu: string }[];
};

export function paquetExiste(slug: string) {
  return slug in PAQUETS;
}

/**
 * Déchiffre le paquet d'un slug avec le mot de passe saisi.
 * Mauvais mot de passe = tag GCM invalide = `null`, jamais d'exception.
 * Mêmes paramètres que `scripts/suivi-chiffrer.mjs`.
 */
export function ouvrirPaquet(slug: string, motDePasse: string): Paquet | null {
  const brut = PAQUETS[slug];
  if (!brut) return null;
  const [version, sel, iv, tag, corps] = brut.split(".");
  if (version !== "v1") return null;
  const b = (s: string) => Buffer.from(s, "base64url");
  try {
    const cle = scryptSync(motDePasse, b(sel), 32, { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    const d = createDecipheriv("aes-256-gcm", cle, b(iv));
    d.setAuthTag(b(tag));
    const clair = Buffer.concat([d.update(b(corps)), d.final()]);
    return JSON.parse(gunzipSync(clair).toString("utf8")) as Paquet;
  } catch {
    return null;
  }
}
