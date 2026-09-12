import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import BookCall from "@/components/home/BookCall";
import { PRICING, QUOTES, SITE_FROM, TERMS, euro } from "@/components/home/data";
import { IDENTITE, PROFILS } from "@/components/home/legal";

const SITE_URL = "https://pixelbrute.be";
const URL = `${SITE_URL}/tarifs`;

/**
 * Tarifs, publiés.
 *
 * La page existe pour une raison : « combien ça coûte » est la première
 * question de tout le monde, et un site qui la cache renvoie vers un
 * concurrent qui y répond. Elle affiche des prix de départ, jamais la grille
 * complète : ça filtre les demandes froides sans bloquer sur un chiffre.
 *
 * Trois offres, et l'offre du milieu est celle à vendre : voir `PRICING`
 * dans `data.ts` pour les règles, et pourquoi le socle mensuel n'est pas une
 * option.
 */

export const metadata: Metadata = {
  title: { absolute: "Tarifs, le prix d'un site internet chez Pixelbrute, Liège" },
  description: `Trois offres, hors TVA, écrites avant l'appel : Essentiel dès ${euro(SITE_FROM.essentiel)}, Signature dès ${euro(SITE_FROM.signature)}, sur mesure dès ${euro(SITE_FROM.surMesure)}. Hébergement et maintenance compris chaque mois.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "Tarifs | Pixelbrute, studio web à Liège",
    description: `Essentiel dès ${euro(SITE_FROM.essentiel)}, Signature dès ${euro(SITE_FROM.signature)}, sur mesure dès ${euro(SITE_FROM.surMesure)}, hors TVA. Socle mensuel compris. Tout est écrit avant l'appel.`,
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
    a: "Parce que c'est la première question, et que la cacher fait perdre du temps aux deux côtés. Les prix de départ ci-dessus sont ceux du devis. Ils servent à savoir si on parle du même ordre de grandeur avant de réserver un appel.",
  },
  {
    q: "Le socle mensuel est-il obligatoire ?",
    a: "Oui. Aucun site n'est livré sans son hébergement, sa sécurité, ses petites modifications et son rapport mensuel : un site laissé seul finit hors ligne ou compromis, et c'est toujours le client qui le découvre. Le socle est dans chaque offre et annoncé dès le devis, jamais après. L'engagement de douze mois couvre la mise en ligne, la sécurité et le suivi de la première année, la période où un site bouge le plus.",
  },
  {
    q: "Le prix de départ est-il le prix final ?",
    a: `Le prix de départ couvre le périmètre décrit dans la case. Les options listées plus bas se chiffrent au devis, poste par poste, et le prix vient en premier sur le devis, pas en dernière page. ${TERMS.quote}`,
  },
  {
    q: "Comment se passe le paiement ?",
    a: `${PRICING.payment.small} ${PRICING.payment.large} ${IDENTITE.regimeTva}.`,
  },
  {
    q: "Que se passe-t-il si je pars ?",
    a: `Vous emportez le domaine et le code, lisible par un autre développeur. Rien n'est loué. ${TERMS.handover} ${TERMS.socle} Quand il s'arrête, l'hébergement s'arrête avec lui, et le site se réinstalle ailleurs : il est construit pour ça.`,
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

  /* Chaque offre porte deux prix : le départ, et le socle par mois. Les deux
     en `priceSpecification`, `valueAddedTaxIncluded: false` dit noir sur
     blanc ce que la page dit en tête. Les options ne sont pas balisées : sans
     prix affiché, un moteur n'en ferait rien. */
  const offres = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${URL}#offres`,
    name: "Tarifs Pixelbrute",
    url: URL,
    itemListElement: [
      ...PRICING.sites.map((t) => ({
        "@type": "Offer",
        name: t.name,
        description: `${t.who} ${t.includes.join(", ")}.`,
        url: URL,
        priceCurrency: "EUR",
        priceSpecification: [
          {
            "@type": "PriceSpecification",
            name: "Prix de départ",
            minPrice: t.from / 100,
            priceCurrency: "EUR",
            valueAddedTaxIncluded: false,
          },
          {
            "@type": "UnitPriceSpecification",
            name: "Socle mensuel compris",
            price: t.monthly / 100,
            priceCurrency: "EUR",
            valueAddedTaxIncluded: false,
            unitText: "mois",
            billingIncrement: 1,
          },
        ],
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
            Trois offres, pas plus. Chacune comprend son socle mensuel, hébergement, sécurité,
            petites modifications, rapport : aucun site n&apos;est livré sans. Les prix sont des
            prix de départ, hors TVA. Pour Essentiel et Signature, le prix est fixé pendant
            l&apos;appel de quinze minutes. Pour le sur mesure, vous recevez un devis écrit sous
            48&nbsp;h ouvrées.
          </p>

          <div className="pb-price-grid" data-cols="3">
            {PRICING.sites.map((t) => (
              <article key={t.key} className="pb-price-card" data-featured={t.featured ? "" : undefined}>
                {t.featured && <span className="pb-price-tag pb-label">Celle qui rapporte</span>}
                <h2 className="pb-d-s">{t.name}</h2>
                <div className="pb-price-from">
                  <small>dès</small>
                  {euro(t.from)}
                  <small>HTVA</small>
                </div>
                <p className="pb-price-month">
                  + <b>{euro(t.monthly)} / mois</b>, socle compris
                </p>
                <p className="pb-price-who">{t.who}</p>
                <ul className="pb-price-list">
                  {t.includes.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <p className="pb-price-delay pb-cap">{t.delay}</p>
              </article>
            ))}
          </div>

          <div className="pb-price-cta">
            <BookCall className="pb-btn-solid">
              Réserver l&apos;appel <Arrow dir="ne" />
            </BookCall>
            <span className="pb-cap">Quinze minutes, sans engagement. Vous choisissez le créneau.</span>
          </div>

          <ul className="pb-price-socle">
            <li className="pb-label" style={{ gridColumn: "1 / -1", color: "var(--pb-accent)" }}>
              {PRICING.socle.name}
            </li>
            {PRICING.socle.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>

          <h2 className="pb-price-h2">Dans chaque devis, noir sur blanc</h2>
          <ul className="pb-gd-ul" style={{ marginTop: 22 }}>
            <li>{PRICING.payment.small}</li>
            <li>{PRICING.payment.large}</li>
            <li>{TERMS.revisions}</li>
            <li>{TERMS.socle}</li>
            <li>{TERMS.handover}</li>
            <li>Le délai, à compter du contenu reçu. C&apos;est presque toujours le contenu qui décide de la date.</li>
          </ul>

          <aside className="pb-price-proof">
            <p className="pb-price-quote">{QUOTES[1].text}</p>
            <p className="pb-cap">
              {QUOTES[1].name} · {QUOTES[1].role}
            </p>
            <p className="pb-price-proof-facts">
              {/* La note, pas le compte : trois avis, c'est vrai, et c'est
                  visible sur la fiche, mais ce n'est pas à mettre en gras à
                  l'endroit où le client vient de lire 9 000 €. Le compte
                  revient ici à partir d'une dizaine d'avis. */}
              <span>5,0 ★ sur Google</span>
              <a href={PROFILS.studio[0]} target="_blank" rel="noopener">
                Voir la fiche Google <Arrow dir="ne" />
              </a>
              <span>Deux clients en 1ʳᵉ position du pack local</span>
              <Link href="/projets">
                Vérifier <Arrow dir="e" />
              </Link>
            </p>
          </aside>

          <h2 className="pb-price-h2">En plus, chaque mois, si vous le voulez</h2>
          <ul className="pb-price-rows">
            {PRICING.monthly.map((m) => (
              <li key={m.name} className="pb-price-row">
                <span className="pb-price-row-n">{m.name}</span>
                <span className="pb-price-row-p">{euro(m.price)} / mois</span>
                <p>{m.note}</p>
              </li>
            ))}
          </ul>

          <h2 className="pb-price-h2">Chiffré à part, au devis</h2>
          <ul className="pb-gd-ul" style={{ marginTop: 22 }}>
            {PRICING.options.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <p className="pb-price-note">
            Un prix ne descend jamais sans qu&apos;un poste soit retiré. Si le budget est plus
            serré que l&apos;offre visée, on enlève une fonction, pas un zéro.
          </p>

          <h2 className="pb-price-h2">Ce qui fait bouger le prix</h2>
          <ul className="pb-gd-ul" style={{ marginTop: 22 }}>
            <li>La fonction métier : recherche de biens, page programme, agenda, espace client.</li>
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
              avec un chiffre, ou un devis écrit sous 48&nbsp;h pour le sur mesure. Rien à signer,
              ni pendant, ni après.
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
                <Link href="/projets">
                  Les cinq dossiers, avec ce qui a été construit <Arrow dir="e" />
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
