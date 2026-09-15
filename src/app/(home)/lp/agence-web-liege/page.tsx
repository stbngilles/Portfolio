import type { Metadata } from "next";
import Landing from "@/components/home/Landing";
import { SITE_FROM, euro } from "@/components/home/data";

/**
 * Landing de la campagne « Web local » : groupes « agence web », « création
 * site », « SEO ». Voir `Landing` pour ce qu'elle n'a pas, et pourquoi.
 */
export const metadata: Metadata = {
  title: { absolute: "Agence web à Liège, un site qui trouve des clients | Pixelbrute" },
  description:
    "Conception, design et code par la même personne, en province de Liège. Deux clients en première position du pack local Google. Tarifs publiés, appel de quinze minutes.",
  robots: { index: false, follow: true },
};

export default function AgenceWebLiegePage() {
  return (
    <Landing
      over="Agence web · Liège et province"
      title={["Agence web à Liège.", "Un site qui trouve des clients."]}
      lede="Conception, design et code par la même personne, en province de Liège. Deux clients en première position du pack local Google."
      points={[
        {
          title: "Un seul interlocuteur",
          text: "Vous parlez à la personne qui conçoit, dessine et code. Rien à retraduire entre les étapes, rien de sous-traité.",
        },
        {
          title: "Une preuve, pas une promesse",
          text: "Deux clients en première position du pack local sur leur commune, sans budget publicitaire. Les captures sont datées, la requête se tape en dix secondes.",
        },
        {
          title: "Le prix avant l'appel",
          text: `Essentiel dès ${euro(SITE_FROM.essentiel)}, Signature dès ${euro(SITE_FROM.signature)}, hors TVA, hébergement et maintenance compris chaque mois. Le devis est chiffré pendant l'appel, poste par poste.`,
        },
      ]}
      proofs={[
        {
          src: "/home/preuves/zenharmonie-google.png",
          w: 1500,
          h: 970,
          alt: "Résultat Google pour « massage hélécine », Zen Harmonie en première position du pack local",
          caption: "Google · « massage hélécine » · août 2026",
        },
        {
          src: "/home/preuves/detailwave-google.png",
          w: 1500,
          h: 935,
          alt: "Résultat Google pour « nettoyage canapé waremme », Detail Wave en tête",
          caption: "Google · « nettoyage canapé waremme » · août 2026",
        },
      ]}
      price={`Trois offres : Essentiel dès ${euro(SITE_FROM.essentiel)}, Signature dès ${euro(SITE_FROM.signature)}, sur mesure dès ${euro(SITE_FROM.surMesure)}. Hors TVA, socle mensuel compris. Moitié à la commande, moitié à la livraison jusqu'à 6 000 €.`}
      faq={[
        {
          q: "Que se passe-t-il pendant l'appel ?",
          a: "Vous expliquez votre métier et ce qui coince aujourd'hui. Je vous dis ce que je ferais, ce que je ne ferais pas, et ce que ça coûte. Vous raccrochez avec un chiffre. Rien à signer, ni pendant, ni après.",
        },
        {
          q: "Je dois préparer quelque chose ?",
          a: "Non. Si vous avez déjà un site ou une fiche Google, je les regarde avant l'appel. Sinon, votre métier et votre commune suffisent.",
        },
        {
          q: "Et si mon besoin ne demande pas de sur mesure ?",
          a: "Je vous le dis, et je vous dis quoi prendre à la place. Un site à 500 € que personne ne trouve coûte plus cher qu'un conseil franc.",
        },
      ]}
      cta="Réserver 15 minutes"
    />
  );
}
