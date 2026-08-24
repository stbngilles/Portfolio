import type { Metadata } from "next";
import Header from "@/components/home/Header";
import ContactWays from "@/components/home/ContactWays";
import BriefForm from "@/components/home/BriefForm";
import Faq from "@/components/home/Faq";
import SiteFooter from "@/components/home/SiteFooter";
import { FAQS } from "@/components/home/data";

export const metadata: Metadata = {
  title: { absolute: "Contact — décrire votre projet | Pixelbrute, studio web à Liège" },
  description:
    "Décrivez votre projet en trois questions, ou appelez le +32 492 20 02 75. Réponse sous 24 h ouvrées par la personne qui codera le site.",
  alternates: { canonical: "https://pixelbrute.be/contact" },
};

const SITE_URL = "https://pixelbrute.be";

/**
 * Les huit questions de la page, en `FAQPage`.
 *
 * Google n'affiche plus les résultats enrichis FAQ depuis 2023, sauf pour une
 * poignée de sites institutionnels — donc aucune promesse de ce côté-là. Le
 * balisage reste posé pour l'autre lecteur : une paire question/réponse
 * explicitement marquée est la forme la plus directement reprenable qui
 * existe pour un modèle qui doit répondre « est-ce qu'ils sous-traitent ? »
 * ou « qu'est-ce qui fait varier le prix ? ».
 *
 * Les réponses sont celles de `data.ts`, à l'identique — le texte à l'écran
 * et le texte balisé ne peuvent pas diverger, sous peine d'être traités comme
 * du contenu masqué.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/contact#faq`,
  inLanguage: "fr-BE",
  about: { "@id": `${SITE_URL}/#studio` },
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header variant="page" />
      <main className="pb-cp">
        <div className="pb-over">Contact · réponse sous 24 h ouvrées</div>
        <h1 className="pb-d-l pb-cp-title">Dites-moi ce qui coince.</h1>
        <p className="pb-cp-lede">
          Pas besoin de savoir ce qu&apos;il faut construire : décrivez ce qui vous fait perdre du
          temps ou des clients aujourd&apos;hui. Trois questions, une minute, et rien ici
          n&apos;est un engagement.
        </p>

        <BriefForm />
        <ContactWays />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
