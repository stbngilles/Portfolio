import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import GuideBody from "@/components/home/GuideBody";
import Arrow from "@/components/home/Arrow";
import { GUIDES } from "@/components/home/guides";
import { PROJECTS } from "@/components/home/data";

const SITE_URL = "https://pixelbrute.be";

/**
 * Un guide. Ces pages visent les questions que se posent les gens avant de
 * chercher un prestataire — ce que les études de cas ne peuvent pas faire :
 * un dossier client se positionne sur le nom du client.
 */

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) return {};
  const url = `${SITE_URL}/guides/${g.slug}`;

  return {
    title: { absolute: `${g.title} | Pixelbrute` },
    description: g.description,
    alternates: { canonical: url },
    openGraph: {
      title: g.title,
      description: g.description,
      type: "article",
      locale: "fr_BE",
      url,
      siteName: "Pixelbrute",
      publishedTime: g.date,
    },
    twitter: { card: "summary_large_image", title: g.title, description: g.description },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = GUIDES.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();

  const g = GUIDES[i];
  const url = `${SITE_URL}/guides/${g.slug}`;
  const related = g.related
    .map((s) => PROJECTS.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const others = GUIDES.filter((x) => x.slug !== g.slug);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: g.title, item: url },
    ],
  };

  /* L'auteur est une personne nommée, pas « l'équipe éditoriale ». C'est ce
     que cherche un moteur — et un assistant — pour décider si un texte a une
     autorité derrière lui : un `@id` qui renvoie à quelqu'un dont on sait le
     métier, la localisation et les compétences (voir le graphe du layout
     racine), plutôt qu'un nom d'organisation répété deux fois.
     `about` dit de quoi parle la page ; `mentions` cite les entités
     réellement évoquées — ici les études de cas mises en regard. */
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: g.title,
    description: g.description,
    abstract: g.lede,
    url,
    mainEntityOfPage: url,
    inLanguage: "fr-BE",
    datePublished: g.date,
    dateModified: g.date,
    author: { "@id": `${SITE_URL}/#esteban` },
    publisher: { "@id": `${SITE_URL}/#studio` },
    isPartOf: { "@type": "CollectionPage", name: "Guides", url: `${SITE_URL}/guides` },
    about: g.intent.split(" / ").map((t) => ({ "@type": "Thing", name: t.trim() })),
    ...(related.length > 0
      ? {
          mentions: related.map((p) => ({
            "@type": "CreativeWork",
            name: p.name,
            url: `${SITE_URL}/projets/${p.slug}`,
          })),
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <Header variant="page" />

      <main>
        <article className="pb-gd">
          <div className="pb-case-crumb pb-label">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link href="/guides">Guides</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{g.h1}</span>
          </div>

          <time className="pb-gd-date pb-mono" dateTime={g.date}>
            {new Date(g.date).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
          </time>

          <h1 className="pb-gd-title">{g.h1}</h1>
          <p className="pb-gd-lede">{g.lede}</p>

          <GuideBody blocks={g.blocks} />

          {related.length > 0 && (
            <section className="pb-gd-rel">
              <h2 className="pb-gd-h2">Les cas dont il est question</h2>
              <ul className="pb-gd-rel-list">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projets/${p.slug}`}>
                      <span className="pb-d-s">{p.name}</span>
                      <span className="pb-cap">{p.sector}</span>
                      <span className="pb-label pb-gd-rel-m">{p.metric}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="pb-case-cta">
            <h2 className="pb-d-s">Une question que cette page ne règle pas&nbsp;?</h2>
            <p>
              Décrivez votre situation en trois questions. Je réponds sous 24&nbsp;h ouvrées — et si
              votre besoin ne demande pas de sur mesure, je vous le dirai aussi.
            </p>
            <Link href="/contact" className="pb-btn-line">
              Poser la question <Arrow dir="ne" />
            </Link>
          </div>

          <nav className="pb-gd-next" aria-label="Autres guides">
            <span className="pb-label">Autres guides</span>
            <ul>
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/guides/${o.slug}`}>
                    {o.h1} <Arrow dir="e" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
