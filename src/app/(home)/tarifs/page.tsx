import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import { PRICING, SITE_FROM, euro } from "@/components/home/data";
import { IDENTITE } from "@/components/home/legal";

const SITE_URL = "https://pixelbrute.be";
const URL = `${SITE_URL}/tarifs`;

/**
 * Tarifs, publiés.
 *
 * La page existe pour une raison : « combien ça coûte » est la première
 * question de tout le monde, et un site qui la cache renvoie vers un
 * concurrent qui y répond. Les montants ne sont pas retapés ici, ils viennent
 * du catalogue qui sert aux devis (voir `PRICING` dans `data.ts`), donc le
 * chiffre lu avant l'appel est celui du devis après.
 *
 * Elle filtre aussi : quelqu'un qui cherche un site à 300 € le voit avant de
 * réserver un appel, et quelqu'un qui pilote une PME ou une agence y trouve
 * une fourchette claire au lieu d'une promesse de devis.
 */

export const metadata: Metadata = {
  title: { absolute: "Tarifs, le prix d'un site internet chez Pixelbrute, Liège" },
  description: `Les prix avant l'appel : une page dès ${euro(SITE_FROM.starter)}, un site vitrine dès ${euro(SITE_FROM.essentiel)}, une boutique ou une réservation dès ${euro(SITE_FROM.ecommerce)}, hors TVA. Suppléments et suivi mensuel affichés.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "Tarifs | Pixelbrute, studio web à Liège",
    description: `Une page dès ${euro(SITE_FROM.starter)}, un site vitrine dès ${euro(SITE_FROM.essentiel)}, une boutique dès ${euro(SITE_FROM.ecommerce)}, hors TVA. Tout est écrit avant l'appel.`,
    type: "website",
    locale: "fr_BE",
    url: URL,
    siteName: "Pixelbrute",
    // Pas d'`images` ici : la carte vient de `opengraph-image.tsx` à côté.
  },
};

/** Les questions propres à cette page. Rendu et balisage partent du même tableau. */
const QUESTIONS = [
  {
    q: "Pourquoi publier les prix ?",
    a: "Parce que c'est la première question, et que la cacher fait perdre du temps aux deux côtés. Les fourchettes ci-dessus sont celles du devis. Elles servent à savoir si on parle du même ordre de grandeur avant de réserver un appel.",
  },
  {
    q: "Le prix de départ est-il le prix final ?",
    a: "Le prix de départ couvre le périmètre décrit dans la case. Ce qui s'ajoute est listé au-dessus, avec son prix. Le devis reprend ces lignes poste par poste, et il est chiffré pendant l'appel de quinze minutes, pas envoyé trois jours plus tard.",
  },
  {
    q: "Et la TVA ?",
    a: `Tous les montants de cette page sont hors TVA. ${IDENTITE.regimeTva}.`,
  },
  {
    q: "Que se passe-t-il si je pars ?",
    a: "Vous emportez tout. Le nom de domaine est enregistré à votre nom, le code est lisible par un autre développeur, et rien n'est loué. Le suivi mensuel s'arrête quand vous le décidez, le site reste.",
  },
];

export default function TarifsPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tarifs", item: URL },
    ],
  };

  /* Les offres, en `Offer` avec un prix de départ. `valueAddedTaxIncluded:
     false` dit noir sur blanc ce que la page dit en tête : hors TVA. Les
     suppléments ne sont pas balisés un par un, un moteur n'en ferait rien
     sans le site auquel ils s'ajoutent. */
  const offres = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${URL}#offres`,
    name: "Tarifs Pixelbrute",
    url: URL,
    itemListElement: [
      ...PRICING.sites
        .filter((t): t is typeof t & { from: number } => t.from !== null)
        .map((t) => ({
          "@type": "Offer",
          name: t.name,
          description: t.who,
          url: URL,
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: t.from / 100,
            priceCurrency: "EUR",
            valueAddedTaxIncluded: false,
          },
          seller: { "@id": `${SITE_URL}/#studio` },
          itemOffered: { "@type": "Service", name: t.name, provider: { "@id": `${SITE_URL}/#studio` } },
        })),
      ...PRICING.monthly.map((m) => ({
        "@type": "Offer",
        name: m.name,
        description: m.note,
        url: URL,
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: m.price / 100,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
          unitText: "mois",
          billingIncrement: 1,
        },
        seller: { "@id": `${SITE_URL}/#studio` },
        itemOffered: { "@type": "Service", name: m.name, provider: { "@id": `${SITE_URL}/#studio` } },
      })),
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${URL}#faq`,
    inLanguage: "fr-BE",
    about: { "@id": `${SITE_URL}/#studio` },
    mainEntity: QUESTIONS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offres) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <Header variant="page" />

      <main>
        <section className="pb-idx">
          <div className="pb-case-crumb pb-label">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Tarifs</span>
          </div>

          <h1 className="pb-idx-title">
            Ce que ça coûte,
            <br />
            <span className="pb-mute">écrit avant l&apos;appel.</span>
          </h1>

          <p className="pb-idx-lede">
            Les prix ci-dessous sont ceux du devis, pas des prix d&apos;appel. Un chiffre précis se
            donne pendant l&apos;appel de quinze minutes, une fois le périmètre compris. Tout est
            hors TVA.
          </p>

          <div className="pb-price-grid">
            {PRICING.sites.map((t) => (
              <article key={t.name} className="pb-price-card">
                <h2 className="pb-d-s">{t.name}</h2>
                <div className="pb-price-from">
                  {t.from === null ? (
                    <>
                      Sur devis
                    </>
                  ) : (
                    <>
                      <small>dès</small>
                      {euro(t.from)}
                      <small>HTVA</small>
                    </>
                  )}
                </div>
                <p className="pb-price-who">{t.who}</p>
                <ul className="pb-price-list">
                  {t.includes.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="pb-price-note">
            Un site immobilier branché sur vos biens, un outil métier ou une plateforme entrent dans la
            dernière case : le prix suit ce qu&apos;il faut brancher, plus que le nombre de pages.
          </p>

          <h2 className="pb-price-h2">Ce qui s&apos;ajoute, quand il en faut</h2>
          <ul className="pb-price-rows">
            {PRICING.options.map((o) => (
              <li key={o.name} className="pb-price-row">
                <span className="pb-price-row-n">{o.name}</span>
                <span className="pb-price-row-p">
                  {o.prefix ? <small>{o.prefix}</small> : null}
                  {euro(o.price)}
                </span>
                <p>{o.note}</p>
              </li>
            ))}
          </ul>

          <h2 className="pb-price-h2">Chaque mois, si vous le voulez</h2>
          <ul className="pb-price-rows">
            {PRICING.monthly.map((m) => (
              <li key={m.name} className="pb-price-row">
                <span className="pb-price-row-n">{m.name}</span>
                <span className="pb-price-row-p">{euro(m.price)} / mois</span>
                <p>{m.note}</p>
              </li>
            ))}
          </ul>
          <p className="pb-price-note">
            Aucun des deux n&apos;est obligatoire, et aucun n&apos;est automatique : on convient de ce
            qui est utile. Sans suivi, le site reste à vous, hébergé où vous voulez.
          </p>

          <h2 className="pb-price-h2">Ce qui fait bouger le prix</h2>
          <ul className="pb-gd-ul" style={{ marginTop: 22 }}>
            <li>Le nombre de pages réellement différentes, pas le nombre de pages.</li>
            <li>Des données à gérer : un catalogue, des biens, des créneaux, des stocks.</li>
            <li>Quelqu&apos;un qui doit se connecter, ou payer, sur le site.</li>
            <li>L&apos;état du contenu que vous fournissez : textes, photos, traductions.</li>
          </ul>

          <h2 className="pb-price-h2">Questions</h2>
          <div className="pb-gd-body" style={{ marginTop: 0 }}>
            {QUESTIONS.map((f) => (
              <div key={f.q}>
                <h3 className="pb-gd-q">{f.q}</h3>
                <p className="pb-gd-p">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="pb-case-cta">
            <h2 className="pb-d-s">Vous avez un ordre de grandeur. Il manque le vôtre.</h2>
            <p>
              Un appel de quinze minutes, réservé en ligne : vous décrivez le projet, vous raccrochez
              avec un chiffre. Rien à signer, ni pendant, ni après.
            </p>
            <Link href="/contact" className="pb-btn-line">
              Réserver l&apos;appel <Arrow dir="ne" />
            </Link>
          </div>

          <nav className="pb-gd-next" aria-label="Pour aller plus loin">
            <span className="pb-label">Pour aller plus loin</span>
            <ul>
              <li>
                <Link href="/comment-je-travaille">
                  Comment je travaille, du premier appel à la mise en ligne <Arrow dir="e" />
                </Link>
              </li>
              <li>
                <Link href="/guides/combien-coute-un-site-internet-en-belgique">
                  Combien coûte un site internet en Belgique, les fourchettes du marché <Arrow dir="e" />
                </Link>
              </li>
              <li>
                <Link href="/guides/wix-wordpress-ou-sur-mesure">
                  Wix, WordPress ou sur mesure : comment choisir <Arrow dir="e" />
                </Link>
              </li>
              <li>
                <Link href="/projets">
                  Les cinq dossiers, avec ce qui a été construit pour ce prix <Arrow dir="e" />
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
