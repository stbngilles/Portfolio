import { ogCard, OG_SIZE, OG_TYPE } from "@/components/home/OgCard";

/**
 * Carte de partage par défaut du site. Sans elle, `twitter:card` valait
 * `summary_large_image` sans image : tout partage rendait un cadre vide.
 * Les pages qui comptent ont la leur, même gabarit, voir `OgCard`.
 */
export const alt = "Pixelbrute · création de sites internet à Liège";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function OpengraphImage() {
  return ogCard({
    title: ["Création de sites internet", "à Liège."],
    sub: "Pour PME, agences immobilières et indépendants. Conception, design et code par la même personne.",
  });
}
