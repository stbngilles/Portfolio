import type { Ressource } from "@/components/home/ressources";
import { BOOKING_URL } from "@/components/home/data";
import { IDENTITE } from "@/components/home/legal";

/**
 * L'e-mail qui porte la checklist. La liste complète est dans le corps : il
 * se lit sans cliquer, et reste dans la boîte de réception. Le bouton ouvre
 * la version à cocher, qui calcule le score.
 *
 * Tableaux et styles en ligne : les clients mail ignorent les feuilles de
 * style et la moitié du CSS moderne.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const INK = "#0F0F14";
const MUTE = "#5C5C66";
const KLEIN = "#1F3FBF";
const MONO = "'JetBrains Mono','Courier New',monospace";

export function ressourceEmail(r: Ressource, prenom: string, link: string) {
  let n = 0;
  const sections = r.sections.map(
    (s) => `
    <h2 style="font-size:20px;line-height:1.25;letter-spacing:-.02em;margin:40px 0 6px;color:${INK}">${esc(s.title)}</h2>
    ${s.intro ? `<p style="margin:0 0 8px;color:${MUTE}">${esc(s.intro)}</p>` : ""}
    ${s.items
      .map((it) => {
        n += 1;
        return `
      <div style="border-top:1px dotted #C9C7C1;padding:18px 0">
        <p style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:.1em;color:${KLEIN}">&#9744; ${String(n).padStart(2, "0")}</p>
        <p style="margin:4px 0 0;font-size:17px;line-height:1.35;font-weight:600;color:${INK}">${esc(it.title)}</p>
        <p style="margin:8px 0 0;color:${MUTE}">${esc(it.why)}</p>
        <p style="margin:8px 0 0;color:${INK}"><span style="font-family:${MONO};font-size:11px;letter-spacing:.12em;color:${KLEIN}">TEST&nbsp;&nbsp;</span>${esc(it.test)}</p>
      </div>`;
      })
      .join("")}`,
  ).join("");

  const bands = r.bands.map(
    (b) => `<p style="margin:12px 0 0"><strong style="color:${INK}">${esc(b.label)}</strong><br><span style="color:${MUTE}">${esc(b.text)}</span></p>`,
  ).join("");

  const button = (label: string, href: string) =>
    `<p style="margin:24px 0 0"><a href="${esc(href)}" style="display:inline-block;background:${KLEIN};color:#FAF9F5;padding:14px 22px;border-radius:8px;text-decoration:none;font-weight:600">${esc(label)} &rarr;</a></p>`;

  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;padding:24px 12px;background:#F2F1EE;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${INK}">
  <div style="max-width:600px;margin:0 auto;background:#FAF9F5;border:1px solid #E5E2DC;border-radius:12px;padding:32px 28px">
    <p style="margin:0 0 16px;font-family:${MONO};font-size:11px;letter-spacing:.14em;color:${KLEIN};text-transform:uppercase">Pixelbrute · Checklist</p>
    <h1 style="margin:0;font-size:26px;line-height:1.2;letter-spacing:-.03em">Salut ${esc(prenom)}, voici ta checklist.</h1>
    <p style="margin:12px 0 0;font-size:17px;color:${INK}">${esc(r.title)} ${esc(r.titleEnd)}</p>
    <p style="margin:16px 0 0;color:${MUTE}">Ouvre ton site sur ton ordinateur et sur ton téléphone. Prends les points dans l'ordre, et coche uniquement si c'est vraiment le cas.</p>
    <p style="margin:12px 0 0;color:${MUTE}">La version en ligne se coche d'un clic, et calcule ton score toute seule.</p>
    ${button("Ouvrir la checklist à cocher", link)}
    ${sections}
    <h2 style="font-size:20px;line-height:1.25;letter-spacing:-.02em;margin:40px 0 0;color:${INK}">Ton score</h2>
    <p style="margin:6px 0 0;color:${MUTE}">Compte tes coches.</p>
    ${bands}
    <div style="margin:40px 0 0;padding:24px;background:${KLEIN};border-radius:10px;color:#FAF9F5">
      <p style="margin:0;font-size:18px;font-weight:600">Tu vois les problèmes, mais pas le temps de les corriger&nbsp;?</p>
      <p style="margin:8px 0 0;color:#DCE1F5">Je regarde ton site avec toi pendant quinze minutes. Ce que je changerais en premier, dans quel ordre, et ce que ça coûterait. Sans engagement.</p>
      <p style="margin:18px 0 0"><a href="${BOOKING_URL}" style="display:inline-block;background:#FAF9F5;color:${INK};padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Réserver 15 minutes avec Esteban &rarr;</a></p>
    </div>
    <p style="margin:32px 0 0;font-size:12px;color:${MUTE}">${esc(IDENTITE.nom)}, ${esc(IDENTITE.enseigne)} · ${esc(IDENTITE.ville)}, province de Liège · <a href="mailto:${IDENTITE.email}" style="color:${MUTE}">${IDENTITE.email}</a><br>Tu reçois cet e-mail parce que tu as demandé cette checklist sur pixelbrute.be. Tu peux la partager, elle est gratuite.</p>
  </div>
</body></html>`;

  return { subject: `${prenom}, ${r.subject}`, html };
}
