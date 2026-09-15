import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import { PROJECTS } from "@/components/home/data";
import { IDENTITE } from "@/components/home/legal";

const SITE_URL = "https://pixelbrute.be";
const URL = `${SITE_URL}/creation-site-internet-liege`;

/**
 * Page de zone, Liège ville et son agglomération.
 *
 * Elle n'est pas la page Hesbaye avec le toponyme changé : l'argument est
 * inverse. En Hesbaye, une commune se gagne parce que personne ne s'y bat.
 * À Liège, la concurrence est réelle, le pack local se joue au quartier, et
 * ce sont les pages précises, les avis et, parfois, la publicité à ciblage
 * serré qui font la différence. Deux pages, deux stratégies, deux URL.
 *
 * Ancrages réels, et eux seuls : un client dont le site nomme dix communes de
 * l'agglomération, et le studio incubé au VentureLab, à Liège.
 */

const COMMUNES = [
  "Liège",
  "Ans",
  "Seraing",
  "Herstal",
  "Saint-Nicolas",
  "Grâce-Hollogne",
  "Chaudfontaine",
  "Flémalle",
  "Awans",
  "Esneux",
  "Oupeye",
  "Visé",
];

export const metadata: Metadata = {
  title: { absolute: "Création de site internet à Liège, pour PME, agences et indépendants" },
  description:
    "Studio web en province de Liège, incubé au VentureLab. Ce que la concurrence de la ville change pour un site, ce qui y fonctionne, et les tarifs publiés. Première rencontre à Liège possible.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Création de site internet à Liège | Pixelbrute",
    description:
      "À Liège, la concurrence est réelle. Ce que ça change pour un site, et ce qui marche : pages précises, avis, ciblage serré.",
    type: "website",
    locale: "fr_BE",
    url: URL,
    siteName: "Pixelbrute",
    // Pas d'`images` ici : la carte vient de `opengraph-image.tsx` à côté.
  },
};

/** Le client dont le site nomme les communes de l'agglomération. */
const LOCAUX = ["detail-wave", "motodistri"];

export default function LiegePage() {
  const locaux = LOCAUX.map((s) => PROJECTS.find((p) => p.slug === s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Création de site internet à Liège", item: URL },
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Création de site internet à Liège",
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
            <span aria-current="page">Liège</span>
          </div>

          <h1 className="pb-gd-title">Création de site internet à Liège</h1>
          <p className="pb-gd-lede">
            Liège est la seule commune de la province où la concurrence est réelle. Voici ce que
            ça change pour un site.
          </p>

          <div className="pb-gd-body">
            <h2 className="pb-gd-h2">Ce que la ville change</h2>
            <p className="pb-gd-p">
              Dans le pack local, la distance pèse lourd. Un chercheur en Outremeuse voit
              d&apos;abord Outremeuse, et vous, à Sclessin, n&apos;y êtes pas.
            </p>
            <p className="pb-gd-p">
              Le pack se joue donc au quartier. Le reste de la page de résultats se gagne avec des
              pages précises, sur lesquelles la plupart des concurrents n&apos;ont rien écrit.
            </p>

            <h2 className="pb-gd-h2">Ce qui fonctionne à Liège</h2>
            <ul className="pb-gd-ul">
              <li>Une page par commune de l&apos;agglomération où vous intervenez vraiment.</li>
              <li>Une page par prestation, avec les mots que les gens tapent.</li>
              <li>Des avis récents, demandés à chaque fin de mission.</li>
              <li>Une campagne à ciblage serré, quand la requête est trop disputée.</li>
            </ul>

            <h2 className="pb-gd-h2">Un client dans l&apos;agglomération</h2>
            <p className="pb-gd-p">
              Detail Wave nomme dix communes de l&apos;agglomération, parce qu&apos;une intervention
              à domicile se choisit sur la distance. Le résultat vérifiable est sur «&nbsp;nettoyage
              canapé waremme&nbsp;», en première position du pack local.
            </p>
            <p className="pb-gd-p">
              Sur Liège même, la requête est disputée. Je préfère le dire que de promettre une
              position en ville.
            </p>

            <h2 className="pb-gd-h2">Les communes où j&apos;interviens</h2>
            <p className="pb-gd-p">
              La première rencontre se fait à Liège, au VentureLab ou chez vous. Je travaille
              depuis {IDENTITE.ville}, à quarante minutes.
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
            <h2 className="pb-d-s">Vous êtes à Liège&nbsp;?</h2>
            <p>Dites-moi votre métier et votre quartier. Je regarde ce que donne la recherche.</p>
            <Link href="/contact" className="pb-btn-line">
              Parler de votre projet <Arrow dir="ne" />
            </Link>
          </div>

          <nav className="pb-gd-next" aria-label="Pour aller plus loin">
            <span className="pb-label">Pour aller plus loin</span>
            <ul>
              <li>
                <Link href="/creation-site-internet-hesbaye">
                  En Hesbaye, l&apos;autre stratégie <Arrow dir="e" />
                </Link>
              </li>
              <li>
                <Link href="/tarifs">
                  Les tarifs, écrits avant l&apos;appel <Arrow dir="e" />
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
