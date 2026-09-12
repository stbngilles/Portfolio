import type { Metadata } from "next";
import Landing from "@/components/home/Landing";
import { SITE_FROM, euro } from "@/components/home/data";

/**
 * Landing de la campagne « Immobilier B2B » : groupes « site agence immo »,
 * « site promoteur ». Même gabarit que la campagne locale, message du secteur.
 */
export const metadata: Metadata = {
  title: { absolute: "Site internet pour agence immobilière, Liège | Pixelbrute" },
  description:
    "Demande d'estimation en trois champs, biens synchronisés avec votre logiciel, une page par commune. Construit en province de Liège, par une seule personne. Tarifs publiés.",
  robots: { index: false, follow: true },
};

export default function SiteAgenceImmobilierePage() {
  return (
    <Landing
      over="Agences immobilières et promoteurs"
      title={["Le portail vend vos biens.", "Le site vend l'agence."]}
      lede="Un site d'agence immobilière qui rentre des mandats : demande d'estimation en trois champs, biens à jour depuis votre logiciel, une page par commune où vous vendez. Construit en province de Liège, par une seule personne."
      points={[
        {
          title: "Le vendeur, pas l'acheteur",
          text: "L'acheteur est sur le portail. Le vendeur tape « agence immobilière + sa commune » et compare. C'est cette recherche que le site doit gagner, et la demande d'estimation qui doit la conclure.",
        },
        {
          title: "Vos biens, sans ressaisie",
          text: "Le site se branche sur Whise, Omnicasa, Skarabee ou l'outil que vous avez. Statut, prix, photos et PEB suivent. Un bien vendu disparaît sans qu'on y pense.",
        },
        {
          title: "Le prix avant l'appel",
          text: `Un site d'agence, c'est l'offre Signature : dès ${euro(SITE_FROM.signature)} hors TVA, hébergement et maintenance compris, avec la recherche de biens ou la page programme. Espace client ou configurateur : sur mesure dès ${euro(SITE_FROM.surMesure)}.`,
        },
      ]}
      bullets={{
        label: "Ce que le site construit",
        items: [
          "La demande d'estimation : trois champs, accessible depuis chaque page, avec qui rappelle et quand.",
          "Une fiche par bien, à sa propre adresse, avec sa commune dans le titre, que Google peut classer.",
          "Une page par commune où vous vendez, avec ce que vous y avez vendu.",
          "Une page par programme neuf, avec le plan des lots et leur disponibilité.",
          "L'alerte acheteur : ses critères, vos nouveaux biens avant le portail.",
        ],
      }}
      price={`Signature dès ${euro(SITE_FROM.signature)}, sur mesure dès ${euro(SITE_FROM.surMesure)}. Hors TVA, socle mensuel compris. Paiement en tranches, échéancier écrit dans le devis.`}
      faq={[
        {
          q: "Est-ce que je garde Immoweb ?",
          a: "Oui. Le portail vend vos biens aux acheteurs, et il continuera de le faire. Le site fait l'autre moitié du travail : convaincre un vendeur de vous confier le sien. Les deux ne se remplacent pas.",
        },
        {
          q: "Comment les biens se mettent à jour ?",
          a: "Depuis le logiciel que vous utilisez déjà, quand il expose ses données par un flux ou une interface. Sinon, depuis une administration simple sur le site. Dans les deux cas, vous saisissez une fois.",
        },
        {
          q: "Avez-vous déjà fait un site d'agence ?",
          a: "Pas encore, et je préfère l'écrire. Deux projets en ligne montrent les pièces les plus lourdes d'un site immobilier : un catalogue de soixante mille références avec filtres et fiches indexées, et un produit avec espace client et paiement. Je vous les montre pendant l'appel.",
        },
      ]}
      cta="Réserver 15 minutes"
    />
  );
}
