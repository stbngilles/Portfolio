import { ogCard, OG_SIZE, OG_TYPE } from "@/components/home/OgCard";

export const alt = "Création de site internet à Liège";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    over: "Liège",
    title: ["Création de site", "internet à Liège."],
    sub: "Ce que la concurrence de la ville change pour un site, et ce qui y fonctionne : pages précises, avis, ciblage serré.",
  });
}
