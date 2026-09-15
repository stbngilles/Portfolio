import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import { PROJECTS, pad } from "@/components/home/data";

const SITE_URL = "https://pixelbrute.be";

/**
 * Index des études de cas. Reprend le rôle de l'ancienne `/realisations`,
 * mais chaque projet mène désormais à sa propre page plutôt qu'à une modale.
 *
 * La grille de la home reste la vitrine ; celle-ci est la liste, un titre,
 * un secteur, un fait vérifiable, et un lien. Elle sert autant au visiteur
 * qu'au maillage interne, que la réduction du site à deux pages avait
 * entièrement supprimé.
 */

export const metadata: Metadata = {
  title: {
    absolute: "Projets, six études de cas, sites et marque | Pixelbrute",
  },
  description:
    "Six études de cas : cinq sites livrés en province de Liège et en Belgique, et une marque immobilière dessinée de bout en bout. Le problème, les arbitrages, ce qui a été construit, le résultat vérifiable.",
  alternates: { canonical: `${SITE_URL}/projets` },
  openGraph: {
    title: "Projets, six dossiers | Pixelbrute",
    description:
      "Le problème, les arbitrages, ce qui a été construit, le résultat vérifiable. Six dossiers complets.",
    type: "website",
    locale: "fr_BE",
    url: `${SITE_URL}/projets`,
    siteName: "Pixelbrute",
    // Sans `images` explicite, un bloc `openGraph` de page masque l'image
    // générée par `app/opengraph-image.tsx` : la carte repartait vide.
    images: [{ url: "/home/mockups/maison.jpg", width: 1200, height: 900, alt: "Projets Pixelbrute, Maison en tête" }],
  },
};

export default function ProjectsIndexPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projets Pixelbrute",
    itemListElement: PROJECTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/projets/${p.slug}`,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projets", item: `${SITE_URL}/projets` },
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
            <span aria-current="page">Projets</span>
          </div>

          <h1 className="pb-idx-title">
            Six projets,
            <br />
            <span className="pb-mute">et le dossier de chacun.</span>
          </h1>

          <p className="pb-idx-lede">
            Ce qui coinçait, ce qui a été tranché, ce qui est en ligne, ce que ça a produit.
            Cinq sites livrés, et une marque dessinée sans client.
          </p>

          <ol className="pb-idx-list">
            {PROJECTS.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/projets/${p.slug}`} className="pb-idx-row">
                  <span className="pb-idx-shot">
                    {p.mockup ? (
                      <Image
                        src={p.mockup}
                        alt={`${p.name}, site livré, présenté sur ordinateur portable`}
                        fill
                        sizes="(max-width: 560px) 100vw, (max-width: 860px) 150px, 260px"
                      />
                    ) : p.shot ? (
                      <Image
                        src={p.shot}
                        alt={`Page d'accueil de ${p.name}, capture du site livré`}
                        fill
                        sizes="(max-width: 560px) 100vw, (max-width: 860px) 150px, 260px"
                      />
                    ) : (
                      <span className="pb-idx-missing pb-label">Capture à venir</span>
                    )}
                  </span>

                  <span className="pb-idx-txt">
                    <span className="pb-idx-top pb-mono">
                      <span className="pb-case-num">{pad(i)}</span>
                      <span>{p.sector}</span>
                    </span>
                    <span className="pb-d-s pb-idx-name">{p.name}</span>
                    <span className="pb-idx-brief">{p.brief}</span>
                    <span className="pb-label pb-idx-metric">{p.metric}</span>
                  </span>

                  <span className="pb-idx-go pb-label" aria-hidden="true">
                    Lire l&apos;étude de cas <Arrow dir="ne" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="pb-case-cta">
            <h2 className="pb-d-s">Le vôtre ressemble à l&apos;un de ceux-là&nbsp;?</h2>
            <p>Décrivez ce qui coince. Réponse sous 24&nbsp;h ouvrées.</p>
            <Link href="/contact" className="pb-btn-line">
              Parler de votre projet <Arrow dir="ne" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
