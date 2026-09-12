import { ogCard, OG_SIZE, OG_TYPE } from "@/components/home/OgCard";
import { GUIDES } from "@/components/home/guides";

/**
 * Une carte par guide, avec son titre. Le découpage en lignes est fait à la
 * main sur la longueur : `next/og` ne renvoie pas à la ligne tout seul dans
 * un `flex-direction: column`, et un titre sur une seule ligne déborde.
 */
export const alt = "Guide Pixelbrute";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

/** Coupe un titre en lignes d'au plus `max` caractères, sur les espaces. */
function wrap(text: string, max: number): string[] {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max && line) {
      out.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) out.push(line);
  return out;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug);
  const title = g ? wrap(g.h1, 30).slice(0, 3) : ["Guides"];
  return ogCard({
    over: "Guide",
    title,
    sub: g?.description ?? "Ce qu'il faut savoir avant de faire faire un site.",
  });
}
