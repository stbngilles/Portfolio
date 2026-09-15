import type { Metadata } from "next";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Manifesto from "@/components/home/Manifesto";
import SelectedWork from "@/components/home/SelectedWork";
import Expertise from "@/components/home/Expertise";
import Principles from "@/components/home/Principles";
import Quotes from "@/components/home/Quotes";
import Studio from "@/components/home/Studio";
import FinalCta from "@/components/home/FinalCta";
import SiteFooter from "@/components/home/SiteFooter";

export const metadata: Metadata = {
  // `absolute` : sinon le template du layout racine ajoute « | Pixelbrute, Studio web Liège ».
  title: {
    absolute: "Création de sites internet à Liège, Pixelbrute",
  },
  description:
    "Studio web en province de Liège. Sites internet pour PME, agences immobilières et indépendants, conçus et codés par la même personne. Tarifs publiés, résultats vérifiables.",
  alternates: { canonical: "https://pixelbrute.be" },
};

/**
 * Homepage « agency » : le travail d'abord, en grand, puis l'argument.
 * promesse → le travail → ce que je crois → ce que je fais → comment →
 * ce qu'en disent les clients → qui je suis → comment me joindre.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee items={["Sites vitrine", "Sites immobiliers", "SEO local", "Réservation en ligne", "Liège & Hesbaye"]} />
        <SelectedWork />
        <Manifesto />
        <Expertise />
        <Principles />
        <Quotes />
        <Studio />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
