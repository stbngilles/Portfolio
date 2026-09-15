import type { Metadata } from "next";
import Image from "next/image";
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
 * d'agence à un client, et la page le dit. Elle montre Maison, un chasseur
 * de biens conceptuel dessiné de bout en bout, présenté comme tel, puis les
 * deux pièces les plus lourdes d'un site immobilier déjà construites
 * ailleurs (Motodistri, Lokigen). Un décideur immobilier vérifie.
 */

const LOGICIELS = ["Whise", "Omnicasa", "Skarabee"];

/** Ce que la page construit, en regard de ce que le portail fait déjà. */
const BUILT = [
  {
    label: "La demande d'estimation",
    text: "Trois champs, depuis chaque page, avec qui rappelle et quand.",
  },
  {
    label: "Les biens, depuis votre logiciel",
    text: `Branché sur ${LOGICIELS.join(", ")} ou votre outil. Vous saisissez une fois, le site suit.`,
  },
  {
    label: "Une fiche par bien, indexable",
    text: "Sa propre adresse, ses photos, sa commune dans le titre.",
  },
  {
    label: "Une page par programme neuf",
    text: "Lots, disponibilité, finitions, calendrier. Elle remplace la brochure.",
  },
  {
    label: "Les pages de commune",
    text: "Une par commune où vous vendez, avec ce que vous y avez vendu.",
  },
  {
    label: "L'alerte acheteur",
    text: "Ses critères, vos nouveaux biens avant le portail.",
  },
];

/** Les questions propres au secteur. Rendu et balisage partent du même tableau. */
const QUESTIONS = [
  {
    q: "Est-ce que je garde Immoweb ?",
    a: "Oui. Le portail vend vos biens aux acheteurs. Le site convainc un vendeur de vous confier le sien. Les deux ne se remplacent pas.",
  },
  {
    q: "Comment les biens se mettent à jour ?",
    a: "Depuis le logiciel que vous utilisez déjà, quand il expose ses données. Sinon, depuis une administration simple sur le site. Un bien vendu disparaît sans qu'on y pense.",
  },
  {
    q: "Combien ça coûte ?",
    a: `Un site d'agence, c'est l'offre Signature : dès ${euro(SITE_FROM.signature)} hors TVA, socle mensuel compris. Sans fonction métier, l'Essentiel dès ${euro(SITE_FROM.essentiel)}. Espace client ou intégrations lourdes : sur mesure dès ${euro(SITE_FROM.surMesure)}.`,
  },
  {
    q: "Avez-vous déjà fait un site d'agence ?",
    a: "Pas pour un client, et je préfère l'écrire. J'en ai dessiné un de bout en bout, Maison, un chasseur de biens conceptuel. Les trois dossiers sont en bas de cette page.",
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

/** Maison d'abord, le site d'agence dessiné en entier ; puis les deux
 *  projets livrés qui prouvent les pièces lourdes d'un site immobilier. */
const PROOFS = ["maison", "motodistri", "lokigen"];

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
            Le portail vend vos biens. Le site vend votre agence : c&apos;est lui qui rentre le
            mandat suivant.
          </p>

          <div className="pb-gd-body">
            <h2 className="pb-gd-h2">Le vendeur, pas l&apos;acheteur</h2>
            <p className="pb-gd-p">
              Un acheteur tape «&nbsp;maison 3 chambres Waremme&nbsp;» et tombe sur un portail. Un
              vendeur tape «&nbsp;agence immobilière Waremme&nbsp;», et là, c&apos;est votre site ou
              celui du concurrent.
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

            <h2 className="pb-gd-h2">La commune avant la ville</h2>
            <p className="pb-gd-p">
              Le pack local se gagne sur «&nbsp;agence immobilière + commune&nbsp;». Le site doit
              nommer cette commune dans ses titres, pas seulement en pied de page. Deux clients du
              studio y sont en première position, sans publicité.
            </p>

            <h2 className="pb-gd-h2">Ce que j&apos;ai déjà construit qui s&apos;en rapproche</h2>
            <p className="pb-gd-p">
              Aucun site d&apos;agence livré à un client, et je préfère l&apos;écrire. Maison, un
              chasseur de biens inventé pour l&apos;exercice, en est la démonstration la plus
              proche : marque, site, fiches, supports.
            </p>

            <figure className="pb-modal-proof" style={{ marginTop: 43 }}>
              <div className="pb-proof-shot">
                <Image
                  src="/home/mockups/maison.jpg"
                  alt="Maison, site d'agence conceptuel, page d'accueil présentée sur ordinateur portable"
                  width={2000}
                  height={1500}
                  sizes="(max-width: 1120px) 100vw, 760px"
                />
              </div>
              <figcaption className="pb-proof-cap pb-cap">
                Maison · l&apos;accueil, un titre, une carte de bien, quatre entrées de menu
              </figcaption>
            </figure>

            <p className="pb-gd-p">
              Deux projets livrés montrent les pièces lourdes : un catalogue de soixante mille
              références indexé fiche par fiche, et un produit avec espace client et paiement.
            </p>

            <h2 className="pb-gd-h2">Questions</h2>
            {QUESTIONS.map((f) => (
              <div key={f.q}>
                <h3 className="pb-gd-q">{f.q}</h3>
                <p className="pb-gd-p">{f.a}</p>
              </div>
            ))}

            <h2 className="pb-gd-h2">Les trois dossiers</h2>
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
            <p>Dites-moi votre commune et votre logiciel. Je regarde avant de parler de site.</p>
            <Link href="/contact" className="pb-btn-line">
              Parler de votre agence <Arrow dir="ne" />
            </Link>
          </div>

          <nav className="pb-gd-next" aria-label="Pour aller plus loin">
            <span className="pb-label">Pour aller plus loin</span>
            <ul>
              <li>
                <Link href="/guides/rentrer-des-mandats-avec-son-site">
                  Rentrer des mandats avec son site <Arrow dir="e" />
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
