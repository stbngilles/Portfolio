import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import { TERMS } from "@/components/home/data";

const SITE_URL = "https://pixelbrute.be";
const URL = `${SITE_URL}/comment-je-travaille`;

/**
 * Comment je travaille, du premier appel à l'après-livraison.
 *
 * La page tarifs répond à « combien ». Celle-ci répond à « comment », la
 * question que se pose un dirigeant qui a déjà vu passer un projet web qui
 * a mal tourné : qui décide quoi, quand est-ce qu'on voit quelque chose, et
 * ce qui se passe si ça dérape.
 *
 * Rien ici n'est une promesse chiffrée : pas de durée, pas de position
 * Google. Ce que la page engage, c'est l'ordre des étapes et ce que chacune
 * produit de visible. Une étape, deux phrases : ce qui dépasse est dans le
 * devis, pas sur la page.
 */

const STEPS = [
  {
    title: "L'appel, quinze minutes",
    text: `Vous décrivez votre métier et ce qui coince. Je dis ce que je ferais, et ce que ça coûte. ${TERMS.quote}`,
  },
  {
    title: "Le devis, poste par poste",
    text: `Le prix vient en premier. Le périmètre est écrit en clair : pages, fonction métier, socle, délai. ${TERMS.revisions}`,
  },
  {
    title: "La conception, écrite avant la maquette",
    text: "Une à trois pages : le problème, les pages du site, ce que chacune doit faire faire au visiteur. Vous validez un document, pas un dessin.",
  },
  {
    title: "La maquette, sur votre contenu",
    text: "Une page clé d'abord, avec vos textes et vos photos. Ce que vous voyez est ce qui sera codé.",
  },
  {
    title: "Le code, avec un lien de suivi",
    text: "Un lien de prévisualisation dès les premières pages, gardé jusqu'à la mise en ligne.",
  },
  {
    title: "La mise en ligne",
    text: "Domaine à votre nom, site déclaré à Google et à Bing, fiche Google mise en cohérence, anciennes adresses redirigées.",
  },
  {
    title: "Après",
    text: `Même interlocuteur. Le socle prend le relais : hébergement, sécurité, petites modifications, rapport mensuel. ${TERMS.socle} ${TERMS.handover}`,
  },
];

const YOU = [
  "Votre métier, avec vos mots.",
  "Vos textes et vos photos, même en vrac.",
  "Les accès : domaine, fiche Google, ancien site.",
  "Une personne qui décide.",
];

const NOT = [
  "Pas de garantie de position Google.",
  "Pas de sous-traitance.",
  "Pas de site loué : le domaine est à votre nom, le code vous est cédé.",
  "Pas de remise sans retrait : un prix qui baisse, c'est un poste en moins.",
];

export const metadata: Metadata = {
  title: { absolute: "Comment je travaille, du premier appel à la mise en ligne | Pixelbrute" },
  description:
    "Sept étapes, de l'appel de quinze minutes à l'après-livraison : le devis poste par poste, la conception écrite avant la maquette, un lien de suivi pendant le code, le domaine à votre nom.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Comment je travaille | Pixelbrute",
    description:
      "Sept étapes, ce que chacune produit de visible, ce que vous fournissez, et ce que je ne fais pas.",
    type: "website",
    locale: "fr_BE",
    url: URL,
    siteName: "Pixelbrute",
  },
};

export default function MethodePage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Comment je travaille", item: URL },
    ],
  };

  /* `HowTo` n'a plus de résultat enrichi chez Google, mais la structure
     reste ce qu'un assistant lit le plus facilement pour répondre à
     « comment ça se passe avec eux ». Les étapes sont celles de l'écran. */
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${URL}#etapes`,
    name: "Comment se déroule un projet de site avec Pixelbrute",
    description: metadata.description,
    inLanguage: "fr-BE",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.text,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <Header variant="page" />

      <main>
        <article className="pb-gd">
          <div className="pb-case-crumb pb-label">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Comment je travaille</span>
          </div>

          <h1 className="pb-gd-title">Comment je travaille</h1>
          <p className="pb-gd-lede">
            Sept étapes. Chacune produit quelque chose que vous pouvez lire ou ouvrir.
          </p>

          <div className="pb-gd-body">
            <h2 className="pb-gd-h2">Les étapes</h2>
            <ol className="pb-gd-steps">
              {STEPS.map((s, j) => (
                <li key={s.title}>
                  <span className="pb-mono pb-gd-step-n">{String(j + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="pb-gd-step-t">{s.title}</h3>
                    <p className="pb-gd-step-p">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="pb-gd-h2">Ce que vous fournissez</h2>
            <ul className="pb-gd-ul">
              {YOU.map((y) => (
                <li key={y}>{y}</li>
              ))}
            </ul>
            <p className="pb-gd-p">
              Si les textes manquent, je les écris à partir d&apos;un entretien. Si les photos
              manquent, on en parle tôt.
            </p>

            <h2 className="pb-gd-h2">Ce que je ne fais pas</h2>
            <ul className="pb-gd-ul">
              {NOT.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>

            <h2 className="pb-gd-h2">Combien de temps</h2>
            <p className="pb-gd-p">
              Essentiel, environ trois semaines. Signature, environ cinq. Les deux à compter du
              contenu reçu. Pour le sur mesure, le délai est dans le devis.
            </p>
          </div>

          <div className="pb-case-cta">
            <h2 className="pb-d-s">La première étape prend quinze minutes.</h2>
            <p>Réservée en ligne. Rien à signer.</p>
            <Link href="/contact" className="pb-btn-line">
              Réserver l&apos;appel <Arrow dir="ne" />
            </Link>
          </div>

          <nav className="pb-gd-next" aria-label="Pour aller plus loin">
            <span className="pb-label">Pour aller plus loin</span>
            <ul>
              <li>
                <Link href="/tarifs">
                  Les tarifs, écrits avant l&apos;appel <Arrow dir="e" />
                </Link>
              </li>
              <li>
                <Link href="/projets">
                  Les six dossiers <Arrow dir="e" />
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
