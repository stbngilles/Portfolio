import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import { PROJECTS } from "@/components/home/data";
import { IDENTITE } from "@/components/home/legal";

const SITE_URL = "https://pixelbrute.be";
const URL = `${SITE_URL}/creation-site-internet-hesbaye`;

/**
 * Page de zone, Hesbaye.
 *
 * Ce n'est pas une page-passerelle : elle ne se décline pas commune par
 * commune avec le nom échangé. Elle n'existe qu'une fois, elle porte des
 * clients réels situés dans la zone, et deux captures datées de résultats
 * obtenus là.
 *
 * L'angle : un indépendant de Hesbaye n'a pas besoin de sortir sur « Liège ».
 * Il a besoin de sortir sur sa commune, où presque personne ne se bat.
 */

const COMMUNES = [
  "Hannut",
  "Waremme",
  "Braives",
  "Hélécine",
  "Landen",
  "Berloz",
  "Geer",
  "Lincent",
  "Wasseiges",
  "Jodoigne",
  "Huy",
];

export const metadata: Metadata = {
  title: { absolute: "Création de site internet en Hesbaye, Hannut, Waremme, Braives" },
  description:
    "Studio web installé à Hannut. Sites internet et référencement local pour indépendants et artisans de Hesbaye. Deux clients de la zone en 1ʳᵉ position du pack local Google.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Création de site internet en Hesbaye | Pixelbrute",
    description:
      "Installé à Hannut. Deux clients de la zone en 1ʳᵉ position du pack local, captures datées à l'appui.",
    type: "website",
    locale: "fr_BE",
    url: URL,
    siteName: "Pixelbrute",
    images: [
      { url: "/home/preuves/zenharmonie-google.png", width: 1500, height: 970, alt: "Résultat Google, pack local, Hélécine" },
    ],
  },
};

/** Les clients réellement situés en Hesbaye, dans l'ordre de la preuve. */
const LOCAUX = ["zen-harmonie", "detail-wave", "motodistri"];

export default function HesbayePage() {
  const locaux = LOCAUX.map((s) => PROJECTS.find((p) => p.slug === s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Création de site internet en Hesbaye", item: URL },
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Création de site internet en Hesbaye",
    serviceType: "Création de site internet et référencement local",
    provider: { "@id": `${SITE_URL}/#studio` },
    url: URL,
    areaServed: COMMUNES.map((c) => ({ "@type": "City", name: c })),
    inLanguage: "fr-BE",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <Header variant="page" />

      <main>
        <article className="pb-gd">
          <div className="pb-case-crumb pb-label">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Hesbaye</span>
          </div>

          <h1 className="pb-gd-title">Création de site internet en Hesbaye</h1>
          <p className="pb-gd-lede">
            Je travaille depuis {IDENTITE.ville}. Deux clients de la zone sont en première position
            du pack local Google. Ici, une commune se gagne.
          </p>

          <div className="pb-gd-body">
            <h2 className="pb-gd-h2">Pourquoi une commune se gagne</h2>
            <p className="pb-gd-p">
              À Liège, vous affrontez des dizaines de concurrents dans les rues voisines du
              chercheur. À Hannut, à Braives ou à Lincent, la plupart ont une fiche Google à moitié
              vide, et la requête «&nbsp;votre métier + votre commune&nbsp;» est souvent libre.
            </p>
            <p className="pb-gd-p">
              Le lot est modeste : quelques recherches par mois. Mais ces personnes cherchent
              exactement votre prestation, dans votre commune, et elles appellent.
            </p>

            <h2 className="pb-gd-h2">Deux résultats obtenus ici</h2>
            <p className="pb-gd-p">
              Zen Harmonie, cabinet de massage à Hélécine. Tapez «&nbsp;massage hélécine&nbsp;».
            </p>
            <figure className="pb-gd-proof">
              <div className="pb-proof-shot">
                <Image
                  src="/home/preuves/zenharmonie-google.png"
                  alt="Résultat Google pour « massage hélécine », Zen Harmonie en première position du pack local"
                  width={1500}
                  height={970}
                  sizes="(max-width: 900px) 100vw, 760px"
                />
              </div>
              <figcaption className="pb-proof-cap pb-cap">
                Google · «&nbsp;massage hélécine&nbsp;» · août 2026
              </figcaption>
            </figure>

            <p className="pb-gd-p">
              Detail Wave, nettoyage à domicile autour de Waremme. Même mécanique sur
              «&nbsp;nettoyage canapé waremme&nbsp;».
            </p>
            <figure className="pb-gd-proof">
              <div className="pb-proof-shot">
                <Image
                  src="/home/preuves/detailwave-google.png"
                  alt="Résultat Google pour « nettoyage canapé waremme », Detail Wave en tête"
                  width={1500}
                  height={935}
                  sizes="(max-width: 900px) 100vw, 760px"
                />
              </div>
              <figcaption className="pb-proof-cap pb-cap">
                Google · «&nbsp;nettoyage canapé waremme&nbsp;» · août 2026
              </figcaption>
            </figure>

            <p className="pb-gd-p">Ni l&apos;un ni l&apos;autre n&apos;a de budget publicitaire.</p>

            <h2 className="pb-gd-h2">Les communes où j&apos;interviens</h2>
            <p className="pb-gd-p">
              Première rencontre autour d&apos;une table dans un rayon de trente minutes. Au-delà,
              en visio.
            </p>
            <ul className="pb-gd-ul pb-gd-inline">
              {COMMUNES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <h2 className="pb-gd-h2">Les projets de la zone</h2>
          </div>

          <ul className="pb-gd-rel-list">
            {locaux.map((p) => (
              <li key={p.slug}>
                <Link href={`/projets/${p.slug}`}>
                  <span className="pb-d-s">{p.name}</span>
                  <span className="pb-cap">{p.sector}</span>
                  <span className="pb-label pb-gd-rel-m">{p.metric}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="pb-case-cta">
            <h2 className="pb-d-s">Vous êtes de la région&nbsp;?</h2>
            <p>Dites-moi votre métier et votre commune. Parfois la réponse est non, et je le dis.</p>
            <Link href="/contact" className="pb-btn-line">
              Parler de votre projet <Arrow dir="ne" />
            </Link>
          </div>

          <nav className="pb-gd-next" aria-label="Pour aller plus loin">
            <span className="pb-label">Pour aller plus loin</span>
            <ul>
              <li>
                <Link href="/guides/etre-trouve-sur-google-maps">
                  Être trouvé sur Google Maps <Arrow dir="e" />
                </Link>
              </li>
              <li>
                <Link href="/creation-site-internet-liege">
                  À Liège, l&apos;autre stratégie <Arrow dir="e" />
                </Link>
              </li>
            </ul>
          </nav>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
