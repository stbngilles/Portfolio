import type { Metadata } from "next";
import { Archivo, DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { IDENTITE, PROFILS } from "@/components/home/legal";

// Layout racine : uniquement le shell html, les polices, la mesure
// d'audience et le JSON-LD.
// Le chrome du site public vit dans `(home)/layout.tsx`, celui de la
// plateforme dans `app/layout.tsx`, les deux ne partagent que ce fichier.

const SITE_URL = "https://pixelbrute.be";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

// Police de la homepage refondue (groupe `(home)`), variable, axes wdth+wght.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jetbrains",
  weight: ["400", "500"],
});

// Balise de vérification Bing Webmaster Tools. Bing ne crawle pas plus vite un
// site vérifié, mais c'est la seule façon de voir ce qu'il en fait :
// pages indexées, requêtes, erreurs de crawl, et l'envoi manuel d'URLs.
//
// La variable porte le nom exact de la balise attendue. Un nom vague
// (« SITE_VERIFICATION ») invite à y coller la clé d'API Webmaster, qui est un
// secret : elle finirait publiée dans le HTML de chaque page.
const BING_MSVALIDATE_01 = process.env.BING_MSVALIDATE_01;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pixelbrute · Création de sites internet à Liège",
    template: "%s | Pixelbrute · Studio web Liège",
  },
  description:
    "Studio web solo à Liège. Création de sites internet sur mesure pour indépendants, artisans et petites structures. Conception, design et code par la même personne.",
  // NB : pas de `keywords`. Google ignore la balise depuis 2009 ; la laisser
  // ne servait qu'à figer un positionnement (Meta Ads) que le site ne tient plus.
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Pixelbrute · Création de sites internet à Liège",
    description:
      "Studio web solo à Liège. Conception, design et code par la même personne, pour des indépendants et de petites structures.",
    type: "website",
    locale: "fr_BE",
    url: SITE_URL,
    siteName: "Pixelbrute",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixelbrute · Création de sites internet à Liège",
    description:
      "Studio web solo à Liège. Conception, design et code par la même personne.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // La balise n'apparaît que si la variable est renseignée (Vercel > Settings
  // > Environment Variables). Une balise au contenu vide ferait échouer la
  // vérification au lieu de simplement ne rien faire.
  ...(BING_MSVALIDATE_01
    ? { verification: { other: { "msvalidate.01": BING_MSVALIDATE_01 } } }
    : {}),
};

/* Ancres du graphe. Un `@id` stable est ce qui distingue « trois fiches qui
   se ressemblent » de « une entreprise, une personne, un site, et les liens
   entre eux ». C'est cette différence qu'un moteur, et un assistant qui
   s'appuie dessus, sait exploiter. Ne jamais les renommer : ils servent
   d'identifiant de l'entité, pas d'URL à visiter. */
const ORG_ID = `${SITE_URL}/#studio`;
const PERSON_ID = `${SITE_URL}/#esteban`;
const WEBSITE_ID = `${SITE_URL}/#site`;

/** Une phrase qui tient seule, hors de tout contexte. C'est la forme qu'un
 *  modèle peut reprendre sans rien inventer autour, et donc celle qu'il
 *  reprend. Écrite au présent, sans superlatif, avec les faits vérifiables :
 *  un nom, un métier, un lieu, une clientèle. */
const DEFINITION =
  `Pixelbrute est un studio web solo basé à ${IDENTITE.ville}, en province de Liège (Belgique). ` +
  `Esteban Gilles y conçoit, dessine et code lui-même des sites sur mesure pour des indépendants, ` +
  `des artisans et de petites structures.`;

/**
 * Le balisage du site, en un seul graphe.
 *
 * Il y avait auparavant un objet `ProfessionalService` isolé. Un moteur y
 * lisait bien une entreprise, mais rien ne rattachait explicitement le
 * fondateur à l'entreprise, ni l'entreprise au site : trois faits côte à côte
 * qu'il fallait deviner reliés. `@graph` + `@id` les relie pour de bon.
 *
 * L'enjeu dépasse les résultats enrichis. Un assistant qui doit répondre
 * « qui est Pixelbrute » ou « qui peut me faire un site à Liège » construit
 * une entité à partir de ce qu'il trouve. Plus l'entité est nette et
 * recoupée, plus elle est citable ; plus elle est floue, plus elle est
 * remplacée par une autre, mieux décrite.
 */
const knowledgeGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": ORG_ID,
      name: "Pixelbrute",
      legalName: IDENTITE.nom,
      description: DEFINITION,
      url: SITE_URL,
      mainEntityOfPage: { "@id": WEBSITE_ID },
      email: "contact@pixelbrute.be",
      telephone: "+32492200275",
      foundingDate: "2025",
      founder: { "@id": PERSON_ID },
      employee: { "@id": PERSON_ID },
      knowsLanguage: "fr-BE",
      // Une personne, écrit en toutes lettres. C'est un fait de vente autant
      // qu'un fait de structure : il explique pourquoi il n'y a rien à
      // retraduire entre les étapes, et pourquoi peu de projets à la fois.
      numberOfEmployees: { "@type": "QuantitativeValue", value: 1 },
      // Fiche Google Business (par son CID permanent) et Instagram du studio.
      // C'est par ce champ qu'un moteur relie ce domaine aux avis publiés
      // ailleurs, et qu'un assistant peut les citer comme parlant bien de
      // cette entreprise-ci. Le LinkedIn personnel est sur la `Person`.
      sameAs: [...PROFILS.studio],
      /* La zone déclarée doit refléter ce qui est réellement desservi, et
         rester identique à celle de la fiche Google Business. Une zone
         étendue n'étend pas la portée : dans le pack local, Google calcule
         la distance depuis l'adresse de l'établissement, pas depuis le
         polygone déclaré. Annoncer la Belgique entière ne gagne rien et
         brouille la pertinence. */
      areaServed: [
        { "@type": "City", name: "Hannut" },
        { "@type": "City", name: "Waremme" },
        { "@type": "City", name: "Braives" },
        { "@type": "City", name: "Hélécine" },
        { "@type": "City", name: "Landen" },
        { "@type": "City", name: "Huy" },
        { "@type": "City", name: "Liège" },
        { "@type": "AdministrativeArea", name: "Hesbaye" },
        { "@type": "AdministrativeArea", name: "Province de Liège" },
      ],
      // L'adresse doit être rigoureusement identique à celle de la fiche Google
      // Business et des mentions légales : une adresse écrite de trois façons
      // différentes brouille le signal local au lieu de le renforcer.
      address: {
        "@type": "PostalAddress",
        streetAddress: IDENTITE.rue,
        postalCode: IDENTITE.codePostal,
        addressLocality: IDENTITE.ville,
        addressRegion: "Liège",
        addressCountry: "BE",
      },
      vatID: IDENTITE.tva.replace(/[\s.]/g, ""),
      // Pas de `geo` : les coordonnées présentes ici pointaient le centre de Liège,
      // à quarante kilomètres du siège. Un point faux vaut moins que pas de point.
      priceRange: "€€",
      currenciesAccepted: "EUR",
      paymentAccepted: "Virement bancaire, PayPal",
      // Pas d'`aggregateRating` ici. Google interdit les avis « auto-servis »,
      // ceux qu'une entreprise déclare sur son propre site à propos d'elle-même :
      // inéligibles aux résultats enrichis, et passibles d'une action manuelle.
      // Les avis Google restent visibles là où ils comptent : la fiche Business.
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services Pixelbrute",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Création de site internet sur mesure",
              description:
                "Sites sur mesure, rapides et responsive, conçus et codés à la main pour indépendants et artisans.",
              provider: { "@id": ORG_ID },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Référencement local",
              description:
                "Visibilité sur Google et dans le pack local, pour être trouvé par les clients de sa zone.",
              provider: { "@id": ORG_ID },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Boutique en ligne et réservation",
              description:
                "Vente en ligne, prise de rendez-vous et formulaires métier intégrés au site.",
              provider: { "@id": ORG_ID },
            },
          },
        ],
      },
    },
    {
      // La personne, décrite séparément de l'entreprise. Sur un studio solo
      // les deux se confondent dans les faits, mais pas dans une base de
      // connaissances : la question « qui a fait ce site » et la question
      // « quelle agence choisir » n'appellent pas la même réponse.
      "@type": "Person",
      "@id": PERSON_ID,
      name: IDENTITE.nom,
      givenName: "Esteban",
      familyName: "Gilles",
      jobTitle: "Concepteur et développeur web",
      description:
        "Fondateur de Pixelbrute. Conçoit, dessine et développe seul les sites qu'il livre, du premier appel à la mise en ligne.",
      url: `${SITE_URL}/#studio`,
      image: `${SITE_URL}/esteban.jpg`,
      email: "contact@pixelbrute.be",
      worksFor: { "@id": ORG_ID },
      founderOf: { "@id": ORG_ID },
      nationality: { "@type": "Country", name: "Belgique" },
      knowsLanguage: "fr-BE",
      sameAs: [...PROFILS.personne],
      // `knowsAbout` est le champ que lisent les moteurs pour savoir sur quoi
      // une personne fait autorité. Uniquement ce qui est démontré par un
      // projet en ligne ou un guide publié, pas une liste de mots-clés.
      knowsAbout: [
        "Création de sites internet",
        "Référencement local",
        "Google Business Profile",
        "Développement web front-end",
        "Next.js",
        "React",
        "TypeScript",
        "Design d'interface",
        "Commerce en ligne",
        "Systèmes de réservation en ligne",
      ],
      homeLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: IDENTITE.ville,
          addressRegion: "Liège",
          addressCountry: "BE",
        },
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "Pixelbrute",
      url: SITE_URL,
      description: DEFINITION,
      inLanguage: "fr-BE",
      publisher: { "@id": ORG_ID },
      // Pas de `SearchAction` : le site n'a pas de moteur de recherche
      // interne. Le déclarer quand même serait une promesse en l'air.
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${archivo.variable} antialiased`}
      >
        {/* JSON-LD rendu côté serveur, présent dans le HTML source.
            Il passait auparavant par `next/script` en `afterInteractive` :
            le balisage n'existait qu'après hydratation React, donc invisible
            pour tout robot qui n'exécute pas le JavaScript. Une balise script
            n'est pas concernée par les mismatchs d'hydratation, le risque
            invoqué à l'époque portait sur le contenu du body, pas sur elle. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(knowledgeGraph) }}
        />
        {children}
        {/* Mesure d'audience sans cookie ni donnée personnelle : aucune bannière
            de consentement n'est requise. Remplace Google Analytics, qui se
            chargeait sans consentement, donc en infraction avec l'ePrivacy. */}
        <Analytics />
      </body>
    </html>
  );
}
