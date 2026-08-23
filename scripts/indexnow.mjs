/**
 * IndexNow — signale à Bing (et Yandex, Seznam, Naver) les URLs à recrawler.
 *
 * Bing ne repasse pas spontanément sur un site neuf et peu lié : le protocole
 * IndexNow remplace l'attente par une notification poussée, prise en compte
 * en quelques minutes au lieu de quelques semaines.
 *
 *   node scripts/indexnow.mjs                       → toutes les URLs du sitemap
 *   node scripts/indexnow.mjs /guides /projets/foo  → seulement celles-là
 *   node scripts/indexnow.mjs --dry-run             → affiche sans envoyer
 *
 * La clé n'est pas un secret : IndexNow vérifie la propriété du domaine en
 * allant lire `https://pixelbrute.be/<clé>.txt`. Elle est donc déduite du nom
 * du fichier posé dans `public/`, pour qu'aucune copie ne puisse dériver.
 */
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SITE_URL = "https://pixelbrute.be";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readKey() {
  const match = readdirSync(path.join(root, "public")).find((f) =>
    /^[a-f0-9]{8,128}\.txt$/.test(f),
  );
  if (!match) {
    throw new Error(
      "Aucune clé IndexNow dans public/ (fichier <clé>.txt attendu, contenant la clé).",
    );
  }
  return match.replace(/\.txt$/, "");
}

async function urlsFromSitemap() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml : HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const paths = args.filter((a) => !a.startsWith("--"));

const key = readKey();
const urlList = paths.length
  ? paths.map((p) => new URL(p, SITE_URL).toString())
  : await urlsFromSitemap();

// Le endpoint refuse un lot dont une URL sort du domaine déclaré : mieux vaut
// s'en apercevoir ici que dans une réponse 422 opaque.
const foreign = urlList.filter((u) => !u.startsWith(`${SITE_URL}/`) && u !== SITE_URL);
if (foreign.length) {
  throw new Error(`URLs hors domaine : ${foreign.join(", ")}`);
}

console.log(`${urlList.length} URL(s) pour ${SITE_URL} :`);
for (const u of urlList) console.log(`  ${u}`);

if (dryRun) {
  console.log("\n--dry-run : rien n'a été envoyé.");
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key,
    keyLocation: `${SITE_URL}/${key}.txt`,
    urlList,
  }),
});

// 200 = accepté, 202 = accepté mais clé pas encore vérifiée (elle le sera au
// premier passage du robot sur le fichier .txt).
if (res.status === 200 || res.status === 202) {
  console.log(`\nIndexNow : ${res.status} — soumis.`);
} else {
  console.error(`\nIndexNow : ${res.status} ${res.statusText}\n${await res.text()}`);
  process.exit(1);
}
