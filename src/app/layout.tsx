import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

// NB : la Navbar / Footer / ClientShell ont été déplacés dans
// `(marketing)/layout.tsx` pour ne s'appliquer qu'aux pages du site public.
// Le layout racine ne fait plus que poser le shell html / polices / GA / JSON-LD,
// pour que les routes plateforme `/app/*` puissent avoir leur propre chrome.

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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pixelbrute — Studio web & Meta Ads à Liège | Sites dès 900 €",
    template: "%s | Pixelbrute — Studio web Liège",
  },
  description:
    "Studio web indépendant à Liège. Création de sites sur mesure (Next.js) + campagnes Meta Ads. Pour artisans, indépendants et PME qui veulent des clients, pas juste une vitrine. Devis sous 48h.",
  keywords: [
    "création site web Liège",
    "agence web Liège",
    "développement web Liège",
    "studio web Liège",
    "Meta Ads Liège",
    "publicité Facebook Liège",
    "site internet Liège",
    "site web artisan Liège",
    "freelance web Liège",
    "Next.js Liège",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Pixelbrute — Studio web & Meta Ads à Liège",
    description:
      "Un site qui bosse. Des pubs qui ramènent. Studio site + acquisition à Liège pour artisans, indépendants et petites marques. Sites dès 900 € HTVA.",
    type: "website",
    locale: "fr_BE",
    url: SITE_URL,
    siteName: "Pixelbrute",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixelbrute — Studio web & Meta Ads à Liège",
    description:
      "Un site qui bosse. Des pubs qui ramènent. Pour artisans et indépendants à Liège.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Pixelbrute",
  description:
    "Studio web indépendant à Liège. Création de sites sur mesure (Next.js) et campagnes Meta Ads pour artisans, indépendants et PME belges.",
  url: SITE_URL,
  email: "contact@pixelbrute.be",
  foundingDate: "2025",
  areaServed: [
    { "@type": "City", name: "Liège" },
    { "@type": "Country", name: "Belgique" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Liège",
    addressCountry: "BE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.6326,
    longitude: 5.5797,
  },
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Virement bancaire, PayPal",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "2",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services Pixelbrute",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Création de site web sur mesure",
          description:
            "Sites Next.js performants, responsive, optimisés SEO, livrés en 4 semaines.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Campagnes Meta Ads",
          description:
            "Gestion complète de vos publicités Facebook et Instagram pour générer des leads qualifiés.",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/* JSON-LD via next/script : injection client, hors zone d'hydratation
            React. Évite les mismatchs causés par les extensions navigateur. */}
        <Script
          id="ld-local-business"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
      <GoogleAnalytics gaId="G-HBC3873LQL" />
    </html>
  );
}
