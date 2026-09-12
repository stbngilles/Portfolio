import { ogCard, OG_SIZE, OG_TYPE } from "@/components/home/OgCard";

export const alt = "Sites internet pour agences immobilières et promoteurs";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({
    over: "Immobilier",
    title: ["Le portail vend vos biens.", "Le site vend l'agence."],
    sub: "Demande d'estimation, biens synchronisés avec votre logiciel, pages de commune, programmes neufs.",
    foot: "Agences et promoteurs · province de Liège",
  });
}
