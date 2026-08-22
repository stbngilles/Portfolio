import type { Metadata } from "next";
import Header from "@/components/home/Header";
import ContactWays from "@/components/home/ContactWays";
import BriefForm from "@/components/home/BriefForm";
import Faq from "@/components/home/Faq";
import SiteFooter from "@/components/home/SiteFooter";

export const metadata: Metadata = {
  title: { absolute: "Contact — décrire votre projet | Pixelbrute, studio web à Liège" },
  description:
    "Décrivez votre projet en une minute — trois questions — ou appelez le +32 492 20 02 75. Réponse sous 24 h ouvrées par la personne qui dessinera et codera le site. Premier appel de 30 minutes sans engagement.",
  alternates: { canonical: "https://pixelbrute.be/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header variant="page" />
      <main className="pb-cp">
        <div className="pb-over">Contact · réponse sous 24 h ouvrées</div>
        <h1 className="pb-d-l pb-cp-title">Dites-moi ce qui coince.</h1>
        <p className="pb-cp-lede">
          Pas besoin de savoir ce qu&apos;il faut construire : décrivez ce qui vous fait perdre du
          temps ou des clients aujourd&apos;hui, je m&apos;occupe de traduire ça en un site. Trois
          questions, une minute, et rien ici n&apos;est un engagement.
        </p>

        <ContactWays />
        <BriefForm />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
