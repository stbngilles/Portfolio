/**
 * Chiffre le contenu initial d'un espace de suivi client (`/suivi/<slug>`).
 *
 *   SUIVI_MOT_DE_PASSE='…' node scripts/suivi-chiffrer.mjs <dossier> <slug>
 *
 * `<dossier>` contient `suivi.json` (nom, site, contenu, elements, demandes,
 * documents) et les PDF qu'il cite. Il reste hors du dépôt : le dépôt est
 * public. Seul le paquet chiffré est écrit, dans `src/lib/suivi/paquets/<slug>.ts`.
 *
 * La clé est dérivée du mot de passe du client : le paquet n'est pas plus
 * lisible que l'espace qu'il remplit. À la première connexion, le mot de passe
 * saisi le déchiffre et l'importe en base ; ensuite, seule la base compte.
 */
import { createCipheriv, randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

const [dossier, slug] = process.argv.slice(2);
const motDePasse = process.env.SUIVI_MOT_DE_PASSE;
if (!dossier || !slug || !motDePasse) {
  console.error("Usage : SUIVI_MOT_DE_PASSE='…' node scripts/suivi-chiffrer.mjs <dossier> <slug>");
  process.exit(1);
}

const source = JSON.parse(readFileSync(path.join(dossier, "suivi.json"), "utf8"));
source.documents = (source.documents ?? []).map((d) => ({
  ...d,
  contenu: readFileSync(path.join(dossier, d.fichier)).toString("base64"),
}));

// Mêmes paramètres que `src/lib/suivi/paquet.ts`.
const sel = randomBytes(16);
const cle = scryptSync(motDePasse.trim(), sel, 32, { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
const iv = randomBytes(12);
const chiffre = createCipheriv("aes-256-gcm", cle, iv);
const corps = Buffer.concat([chiffre.update(gzipSync(JSON.stringify(source))), chiffre.final()]);
const b = (x) => x.toString("base64url");
const paquet = ["v1", b(sel), b(iv), b(chiffre.getAuthTag()), b(corps)].join(".");

const sortie = path.join("src", "lib", "suivi", "paquets", `${slug}.ts`);
mkdirSync(path.dirname(sortie), { recursive: true });
writeFileSync(
  sortie,
  `// Généré par scripts/suivi-chiffrer.mjs. Chiffré, ne pas éditer à la main.\nexport const paquet =\n  "${paquet}";\n`,
);
console.log(`${sortie} : ${source.elements?.length ?? 0} éléments, ${source.demandes?.length ?? 0} demandes, ${source.documents.length} documents, ${(paquet.length / 1024).toFixed(0)} ko`);
