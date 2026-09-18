import { countPoints, type Ressource } from "@/components/home/ressources";
import { IDENTITE } from "@/components/home/legal";

/**
 * L'e-mail qui ouvre la ressource. Il ne contient pas la liste : il n'a
 * qu'un rôle, amener la personne sur le site, où elle coche, lit son score
 * et trouve l'appel à réserver. Un e-mail qui livre tout n'a plus de raison
 * d'être cliqué.
 *
 * Styles en ligne : les clients mail ignorent les feuilles de style et la
 * moitié du CSS moderne.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const INK = "#0F0F14";
const MUTE = "#5C5C66";
const KLEIN = "#1F3FBF";
const MONO = "'JetBrains Mono','Courier New',monospace";

export function ressourceEmail(r: Ressource, prenom: string, link: string) {
  const parts = r.sections
    .map(
      (s, i) =>
        `<tr><td style="padding:10px 0;border-top:1px solid #E5E2DC;font-family:${MONO};font-size:12px;color:${KLEIN};width:36px">${String(i + 1).padStart(2, "0")}</td><td style="padding:10px 0;border-top:1px solid #E5E2DC;font-size:15px;color:${INK}">${esc(s.title)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;padding:24px 12px;background:#F2F1EE;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:${INK}">
  <div style="max-width:560px;margin:0 auto;background:#FAF9F5;border:1px solid #E5E2DC;border-radius:14px;padding:36px 30px">
    <p style="margin:0 0 20px;font-family:${MONO};font-size:11px;letter-spacing:.14em;color:${KLEIN};text-transform:uppercase">Pixelbrute · Checklist</p>
    <h1 style="margin:0;font-size:28px;line-height:1.15;letter-spacing:-.03em">Salut ${esc(prenom)}, ta checklist t'attend.</h1>
    <p style="margin:16px 0 0;color:${MUTE}">${esc(r.title)} ${esc(r.titleEnd)}</p>
    <p style="margin:12px 0 0;color:${MUTE}">Tu coches en ligne, ton score se calcule tout seul.</p>
    <p style="margin:28px 0 0"><a href="${esc(link)}" style="display:inline-block;background:${KLEIN};color:#FAF9F5;padding:16px 26px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Ouvrir ma checklist &rarr;</a></p>
    <p style="margin:36px 0 8px;font-family:${MONO};font-size:11px;letter-spacing:.14em;color:${MUTE};text-transform:uppercase">${countPoints(r)} points, ${r.sections.length} parties</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${parts}</table>
    <p style="margin:28px 0 0;color:${MUTE}">Le lien marche sur ton ordinateur comme sur ton téléphone. Garde cet e-mail pour y revenir.</p>
    <p style="margin:32px 0 0;font-size:12px;color:${MUTE}">${esc(IDENTITE.nom)}, ${esc(IDENTITE.enseigne)} · ${esc(IDENTITE.ville)}, province de Liège · <a href="mailto:${IDENTITE.email}" style="color:${MUTE}">${IDENTITE.email}</a><br>Tu reçois cet e-mail parce que tu as demandé cette checklist sur pixelbrute.be.</p>
  </div>
</body></html>`;

  return { subject: `${prenom}, ${r.subject}`, html };
}
