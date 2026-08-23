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
 * La grille de la home reste la vitrine ; celle-ci est la liste — un titre,
 * un secteur, un fait vérifiable, et un lien. Elle sert autant au visiteur
 * qu'au maillage interne, que la réduction du site à deux pages avait
 * entièrement supprimé.
 */

export const metadata: Metadata = {
  title: {
    absolute: "Projets — six sites livrés à Liège et en Belgique | Pixelbrute",
  },
  description:
    "Six études de cas détaillées : le problème du client, les arbitrages, ce qui a été construit, et le résultat vérifiable. Sites livrés pour des indépendants et artisans.",
  alternates: { canonical: `${SITE_URL}/projets` },
  openGraph: {
    title: "Projets — six sites livrés | Pixelbrute",
    description:
      "Le problème, les arbitrages, ce qui a été construit, le résultat vérifiable. Six dossiers complets.",
    type: "website",
    locale: "fr_BE",
    url: `${SITE_URL}/projets`,
    siteName: "Pixelbrute",
    // Sans `images` explicite, un bloc `openGraph` de page masque l'image
    // générée par `app/opengraph-image.tsx` : la carte repartait vide.
    images: [{ url: "/home/mockups/motodistri.jpg", width: 1200, height: 900, alt: "Sites livrés par Pixelbrute" }],
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
            Six sites livrés,
            <br />
            <span className="pb-mute">et le dossier de chacun.</span>
          </h1>

          <p className="pb-idx-lede">
            Chaque étude de cas dit la même chose dans le même ordre : ce qui coinçait chez le
            client, ce que j&apos;ai tranché et pourquoi, ce qui est en ligne aujourd&apos;hui, et ce
            que ça a produit. Les chiffres sont relevés sur les sites eux-mêmes — ils sont là pour
            être recomptés.
          </p>

          <ol className="pb-idx-list">
            {PROJECTS.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/projets/${p.slug}`} className="pb-idx-row">
                  <span className="pb-idx-shot">
                    {p.mockup ? (
                      <Image
                        src={p.mockup}
                        alt={`${p.name} — site livré, présenté sur ordinateur portable`}
                        fill
                        sizes="(max-width: 560px) 100vw, (max-width: 860px) 150px, 260px"
                      />
                    ) : p.shot ? (
                      <Image
                        src={p.shot}
                        alt={`Page d'accueil de ${p.name} — capture du site livré`}
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
            <p>
              Décrivez ce qui coince en trois questions. Réponse sous 24&nbsp;h ouvrées, sans devis
              expédié dans l&apos;heure.
            </p>
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
