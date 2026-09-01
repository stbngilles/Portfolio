import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import CaseStudy from "@/components/home/CaseStudy";
import { PROJECTS } from "@/components/home/data";

const SITE_URL = "https://pixelbrute.be";

/**
 * Étude de cas, une page par projet.
 *
 * Ces dossiers existaient déjà dans `data.ts`, contexte, problème, décisions,
 * inventaire, chiffres relevés, mais ils n'étaient lisibles que dans une
 * modale, sans URL. Personne ne pouvait les partager, et aucun moteur ne
 * pouvait les indexer. Ils ont désormais une adresse.
 */

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return {};

  const url = `${SITE_URL}/projets/${p.slug}`;
  // Le `brief` dit la situation de départ, le `answer` la réponse : ensemble
  // ils tiennent dans une méta-description sans la tronquer.
  const description = `${p.brief} ${p.answer}`.slice(0, 158);

  return {
    title: `${p.name}, ${p.sector.split(" · ")[0]}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${p.name}, étude de cas | Pixelbrute`,
      description,
      type: "article",
      locale: "fr_BE",
      url,
      siteName: "Pixelbrute",
      images: p.shot ? [{ url: p.shot, width: 1440, height: 900, alt: `${p.name}, site livré` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name}, étude de cas`,
      description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();

  const p = PROJECTS[index];
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const url = `${SITE_URL}/projets/${p.slug}`;

  /* Deux blocs : le fil d'Ariane, que Google affiche sous le titre dans les
     résultats, et l'étude de cas elle-même. Rendus côté serveur, le balisage
     doit exister dans le HTML source, pas après hydratation. */
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projets", item: `${SITE_URL}/projets` },
      { "@type": "ListItem", position: 3, name: p.name, item: url },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${p.name}, ${p.sector}`,
    description: p.brief,
    about: p.name,
    url,
    inLanguage: "fr-BE",
    image: p.shot ? `${SITE_URL}${p.shot}` : undefined,
    // Rattachement au graphe du layout racine plutôt qu'un doublon
    // d'organisation : l'étude de cas devient une pièce au dossier de
    // l'entité « Pixelbrute », au lieu d'un article signé par un homonyme.
    author: { "@id": `${SITE_URL}/#esteban` },
    publisher: { "@id": `${SITE_URL}/#studio` },
    isPartOf: { "@type": "CollectionPage", name: "Projets", url: `${SITE_URL}/projets` },
    // Le travail décrit, relié au prestataire. C'est ce qui permet de
    // répondre « qui a fait le site de X » sans avoir à le déduire.
    ...(p.url
      ? {
          mentions: {
            "@type": "WebSite",
            name: p.name,
            url: p.url,
            creator: { "@id": `${SITE_URL}/#studio` },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <Header variant="page" />
      <main>
        <CaseStudy project={p} index={index} prev={prev} next={next} />
      </main>
      <SiteFooter />
    </>
  );
}
