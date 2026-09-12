import { ogCard, OG_SIZE, OG_TYPE } from "@/components/home/OgCard";

export const alt = "Comment je travaille, Pixelbrute";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    over: "Méthode",
    title: ["Comment je travaille,", "du premier appel", "à la mise en ligne."],
    sub: "Sept étapes, et ce que chacune produit de visible : un chiffre, un document, une maquette, un lien.",
  });
}
