import fs from "node:fs/promises";
import path from "node:path";

/**
 * Sert la homepage : on renvoie l'artifact HTML exactement comme dans `deploy/`.
 * Bypass total du layout React — le visiteur reçoit byte-pour-byte le contenu
 * de public/artifact-index.html, identique au site live actuel.
 *
 * La version React est conservée dans page.tsx.react-backup au cas où on
 * voudrait y revenir un jour.
 */
export async function GET() {
  const file = path.join(process.cwd(), "public", "artifact-index.html");
  const html = await fs.readFile(file, "utf8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
