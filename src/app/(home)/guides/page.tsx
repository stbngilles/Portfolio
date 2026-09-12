import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import { GUIDES } from "@/components/home/guides";

const SITE_URL = "https://pixelbrute.be";

export const metadata: Metadata = {
  title: { absolute: "Guides, sites web, référencement local et budgets | Pixelbrute" },
  description:
    "Ce qu'il faut savoir avant de faire faire un site : le pack local Google, le prix d'un site en Belgique, Wix, WordPress ou sur mesure, et ce qu'un site d'agence immobilière doit faire.",
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    title: "Guides, sites web et référencement local",
    description:
      "Le pack local Google, les prix réels du marché belge, le choix de la technologie, et le site d'une agence immobilière. Sans discours de vendeur.",
    type: "website",
    locale: "fr_BE",
    url: `${SITE_URL}/guides`,
    siteName: "Pixelbrute",
    images: [{ url: "/home/preuves/zenharmonie-google.png", width: 1500, height: 970, alt: "Résultat Google, pack local" }],
  },
};

export default function GuidesIndexPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Guides Pixelbrute",
    itemListElement: GUIDES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      url: `${SITE_URL}/guides/${g.slug}`,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header variant="page" />

      <main>
        <section className="pb-idx">
          <div className="pb-case-crumb pb-label">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Guides</span>
          </div>

          <h1 className="pb-idx-title">
            Ce qu&apos;il faut savoir
            <br />
            <span className="pb-mute">avant de faire faire un site.</span>
          </h1>

          <p className="pb-idx-lede">
            Cinq pages écrites pour être utiles même si vous ne me confiez rien. Les chiffres sont
            datés et sourcés dans le texte, et quand une solution moins chère que la mienne convient
            mieux, c&apos;est écrit noir sur blanc.
          </p>

          <ol className="pb-gd-list">
            {GUIDES.map((g, i) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="pb-gd-row">
                  <span className="pb-mono pb-case-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pb-gd-row-txt">
                    <span className="pb-d-s pb-gd-row-t">{g.h1}</span>
                    <span className="pb-gd-row-d">{g.description}</span>
                  </span>
                  <span className="pb-gd-row-go pb-label" aria-hidden="true">
                    Lire <Arrow dir="ne" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="pb-case-cta">
            <h2 className="pb-d-s">Votre question n&apos;y est pas&nbsp;?</h2>
            <p>Posez-la directement. Réponse sous 24&nbsp;h ouvrées, sans engagement.</p>
            <Link href="/contact" className="pb-btn-line">
              Poser la question <Arrow dir="ne" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
