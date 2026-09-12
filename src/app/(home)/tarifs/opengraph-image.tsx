import { ogCard, OG_SIZE, OG_TYPE } from "@/components/home/OgCard";
import { SITE_FROM, euro } from "@/components/home/data";

export const alt = "Tarifs Pixelbrute, écrits avant l'appel";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    over: "Tarifs",
    title: ["Ce que ça coûte,", "écrit avant l'appel."],
    sub: `Trois offres : Essentiel dès ${euro(SITE_FROM.essentiel)}, Signature dès ${euro(SITE_FROM.signature)}, sur mesure dès ${euro(SITE_FROM.surMesure)}. Hors TVA, hébergement et maintenance compris.`,
  });
}
