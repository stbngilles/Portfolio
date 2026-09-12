import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import { PROJECTS, SITE_FROM, euro } from "@/components/home/data";

const SITE_URL = "https://pixelbrute.be";
const URL = `${SITE_URL}/creation-site-agence-immobiliere`;

/**
 * Page de secteur, immobilier.
 *
 * C'est la page de vente du secteur visé en priorité par le studio : agences
 * de courtage et promoteurs de la province de Liège. Elle est écrite pour
 * quelqu'un qui dirige une agence, pas pour un acheteur de bien, et son
 * argument tient en une phrase : le portail vend vos biens, le site vend
 * votre agence.
 *
 * Pas d'étude de cas inventée. Le studio n'a pas encore livré de site
 * d'agence, et la page le dit : elle montre à la place les deux pièces les
 * plus lourdes d'un site immobilier déjà construites ailleurs, un catalogue
 * à filtres indexé (Motodistri) et un espace client avec paiement (Lokigen).
 * Un décideur immobilier vérifie ; une référence fictive coûterait la seule
 * chose que ce site a à vendre, la preuve.
 */

const LOGICIELS = ["Whise", "Omnicasa", "Skarabee"];

/** Ce que la page construit, en regard de ce que le portail fait déjà. */
const BUILT = [
  {
    label: "La demande d'estimation",
    text: "Trois champs, accessible depuis chaque page, avec une phrase qui dit qui rappelle et dans quel délai. C'est la page qui rentre les mandats.",
  },
  {
    label: "Les biens, depuis votre logiciel",
    text: `Le site se branche sur ${LOGICIELS.join(", ")} ou l'outil que vous utilisez déjà. Vous saisissez une fois, le site suit : statut, prix, photos, PEB.`,
  },
  {
    label: "Une fiche par bien, indexable",
    text: "Chaque bien a sa propre adresse, ses photos, son plan et sa commune dans le titre. Google peut la classer, un portail ne vous laisse pas ça.",
  },
  {
    label: "Une page par programme neuf",
    text: "Pour le promoteur : le plan des lots, leur disponibilité, les finitions, le calendrier. Mise à jour au fil des ventes, elle remplace la brochure.",
  },
  {
    label: "Les pages de commune",
    text: "Une page par commune où vous vendez réellement, avec ce que vous y avez vendu. C'est ce qui sort sur « agence immobilière + commune ».",
  },
  {
    label: "L'alerte acheteur",
    text: "L'acheteur qui n'a rien trouvé aujourd'hui laisse ses critères. Il reçoit vos nouveaux biens avant qu'ils ne soient sur le portail.",
  },
];

/** Les questions propres au secteur. Rendu et balisage partent du même tableau. */
const QUESTIONS = [
  {
    q: "Est-ce que je garde Immoweb ?",
    a: "Oui. Le portail vend vos biens aux acheteurs, et il continuera de le faire. Le site fait l'autre moitié du travail : convaincre un vendeur de vous confier le sien, et présenter l'agence avec vos mots et vos photos. Les deux ne se remplacent pas.",
  },
  {
    q: "Comment les biens se mettent à jour ?",
    a: "Depuis le logiciel que vous utilisez déjà, quand il expose ses données par un flux ou une interface, ce que font les logiciels du marché belge. Sinon, depuis une administration simple sur le site. Dans les deux cas, un bien vendu disparaît sans qu'on y pense.",
  },
  {
    q: "Combien ça coûte ?",
    a: `Un site d'agence, c'est l'offre Signature : dès ${euro(SITE_FROM.signature)} hors TVA, avec la recherche de biens ou la page programme, le contenu par commune et le suivi des conversions. Sans fonctionnalité métier, l'Essentiel dès ${euro(SITE_FROM.essentiel)}. Espace client, configurateur, intégrations lourdes : sur mesure dès ${euro(SITE_FROM.surMesure)}. Chaque offre comprend son socle mensuel, hébergement et maintenance, annoncé dès le devis. Les trois sont sur la page tarifs.`,
  },
  {
    q: "Avez-vous déjà fait un site d'agence ?",
    a: "Pas encore, et je préfère l'écrire que de le laisser deviner. Deux projets en ligne montrent les pièces les plus lourdes d'un site immobilier : un catalogue de plus de soixante mille références avec filtres et fiches indexées, et un produit avec espace client et paiement. Les deux se vérifient en bas de cette page.",
  },
  {
    q: "Combien de temps ?",
    a: "Une durée se donne après avoir compris le périmètre, pas avant. Un site d'agence sans flux se livre nettement plus vite qu'un site branché sur un logiciel, où le temps dépend surtout de la qualité de l'export.",
  },
];

export const metadata: Metadata = {
  title: { absolute: "Création de site internet pour agence immobilière et promoteur, Liège" },
  description:
    "Sites pour agences immobilières et promoteurs en province de Liège : biens synchronisés avec votre logiciel, demande d'estimation, pages programmes neufs, référencement par commune. Tarifs publiés.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Sites pour agences immobilières et promoteurs | Pixelbrute",
    description:
      "Le portail vend vos biens. Le site vend votre agence : estimation, biens à jour, pages de commune, programmes neufs.",
    type: "website",
    locale: "fr_BE",
    url: URL,
    siteName: "Pixelbrute",
    // Pas d'`images` ici : la carte vient de `opengraph-image.tsx` à côté.
  },
};

/** Les deux projets qui prouvent les pièces d'un site immobilier. */
const PROOFS = ["motodistri", "lokigen"];

export default function ImmobilierPage() {
  const proofs = PROOFS.map((s) => PROJECTS.find((p) => p.slug === s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Sites pour agences immobilières", item: URL },
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Création de site internet pour agence immobilière et promoteur",
    serviceType: "Création de site internet immobilier",
    description:
      "Sites pour agences de courtage et promoteurs : biens synchronisés avec le logiciel de l'agence, demande d'estimation, fiches de biens indexables, pages programmes neufs, référencement par commune.",
    provider: { "@id": `${SITE_URL}/#studio` },
    url: URL,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Agences immobilières et promoteurs",
    },
    areaServed: [
      { "@type": "City", name: "Liège" },
      { "@type": "City", name: "Huy" },
      { "@type": "City", name: "Waremme" },
      { "@type": "City", name: "Hannut" },
      { "@type": "AdministrativeArea", name: "Province de Liège" },
      { "@type": "AdministrativeArea", name: "Wallonie" },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: SITE_FROM.signature / 100,
        priceCurrency: "EUR",
        valueAddedTaxIncluded: false,
      },
      url: `${SITE_URL}/tarifs`,
    },
    inLanguage: "fr-BE",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${URL}#faq`,
    inLanguage: "fr-BE",
    about: { "@id": `${URL}#service` },
    mainEntity: QUESTIONS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <Header variant="page" />

      <main>
        <article className="pb-gd">
          <div className="pb-case-crumb pb-label">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Immobilier</span>
          </div>

          <h1 className="pb-gd-title">Sites internet pour agences immobilières et promoteurs</h1>
          <p className="pb-gd-lede">
            Le portail vend vos biens à des acheteurs. Personne d&apos;autre que vous ne vend votre
            agence à des vendeurs. C&apos;est le travail du site, et c&apos;est à cette aune que je
            le construis : rentrer le mandat suivant, en province de Liège.
          </p>

          <div className="pb-gd-body">
            <h2 className="pb-gd-h2">Le vendeur, pas l&apos;acheteur</h2>
            <p className="pb-gd-p">
              Un acheteur cherche un bien. Il tape «&nbsp;maison 3 chambres Waremme&nbsp;» et tombe
              sur un portail. Un vendeur cherche une agence. Il tape «&nbsp;agence immobilière
              Waremme&nbsp;» ou «&nbsp;estimation maison Hannut&nbsp;», et là, c&apos;est votre site
              ou celui du concurrent. Le mandat se joue sur cette recherche-là, et sur les dix
              secondes qui suivent.
            </p>
            <p className="pb-gd-p">
              Un site d&apos;agence a donc trois choses à faire que le portail ne fait pas&nbsp;:
              convaincre un propriétaire de confier son bien, présenter les biens avec vos données et
              vos photos, et sortir sur les recherches qui nomment votre commune.
            </p>

            <h2 className="pb-gd-h2">Ce que je construis</h2>
            <ol className="pb-gd-steps">
              {BUILT.map((b, j) => (
                <li key={b.label}>
                  <span className="pb-mono pb-gd-step-n">{String(j + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="pb-gd-step-t">{b.label}</h3>
                    <p className="pb-gd-step-p">{b.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <aside className="pb-gd-note">
              <span className="pb-label pb-gd-note-l">À retenir</span>
              <p>
                Un site où les biens sont à jour sans qu&apos;on y pense, où la demande
                d&apos;estimation tient en trois champs, et dont chaque page nomme une commune
                réelle, fait plus pour le mandat suivant qu&apos;une refonte graphique.
              </p>
            </aside>

            <h2 className="pb-gd-h2">La commune avant la ville</h2>
            <p className="pb-gd-p">
              Le bloc de trois établissements en haut d&apos;une recherche locale se décide sur la
              pertinence, la distance et la notoriété. Une agence a une adresse, une catégorie nette
              et des avis&nbsp;: elle a tout ce qu&apos;il faut pour y figurer sur «&nbsp;agence
              immobilière + sa commune&nbsp;». Le site doit nommer cette commune, et celles où vous
              vendez, dans ses titres et ses pages, pas seulement dans le pied de page. Deux clients
              du studio sortent aujourd&apos;hui en première position du pack local sur leur commune,
              sans budget publicitaire&nbsp;; la mécanique est la même.
            </p>

            <h2 className="pb-gd-h2">Ce que j&apos;ai déjà construit qui s&apos;en rapproche</h2>
            <p className="pb-gd-p">
              Aucun des projets en ligne n&apos;est un site d&apos;agence, et je préfère
              l&apos;écrire. Deux d&apos;entre eux montrent les pièces les plus lourdes d&apos;un
              site immobilier&nbsp;: un catalogue de plus de soixante mille références, filtré et
              indexé fiche par fiche, et un produit avec espace client, tableau de bord et paiement.
              Les deux dossiers sont en bas de page, avec ce qui se vérifie.
            </p>

            <h2 className="pb-gd-h2">Questions</h2>
            {QUESTIONS.map((f) => (
              <div key={f.q}>
                <h3 className="pb-gd-q">{f.q}</h3>
                <p className="pb-gd-p">{f.a}</p>
              </div>
            ))}

            <h2 className="pb-gd-h2">Les deux dossiers</h2>
          </div>

          <ul className="pb-gd-rel-list">
            {proofs.map((p) => (
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
            <h2 className="pb-d-s">Vous dirigez une agence, ou un programme&nbsp;?</h2>
            <p>
              Dites-moi votre commune et le logiciel que vous utilisez. Je regarde ce que donne la
              recherche aujourd&apos;hui, et ce que l&apos;export de vos biens permet, avant de
              parler de site.
            </p>
            <Link href="/contact" className="pb-btn-line">
              Parler de votre agence <Arrow dir="ne" />
            </Link>
          </div>

          <nav className="pb-gd-next" aria-label="Pour aller plus loin">
            <span className="pb-label">Pour aller plus loin</span>
            <ul>
              <li>
                <Link href="/guides/site-internet-agence-immobiliere">
                  Le site d&apos;une agence immobilière ne vend pas des biens. Il vend l&apos;agence.{" "}
                  <Arrow dir="e" />
                </Link>
              </li>
              <li>
                <Link href="/guides/rentrer-des-mandats-avec-son-site">
                  Rentrer des mandats avec son site, sans dépendre des portails <Arrow dir="e" />
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
