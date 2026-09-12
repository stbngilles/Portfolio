import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import { PRICING, SITE_FROM, TERMS, euro } from "@/components/home/data";

const SITE_URL = "https://pixelbrute.be";
const URL = `${SITE_URL}/comment-je-travaille`;

/**
 * Comment je travaille, du premier appel à l'après-livraison.
 *
 * La page tarifs répond à « combien ». Celle-ci répond à « comment », la
 * question que se pose un dirigeant qui a déjà vu passer un projet web qui
 * a mal tourné : qui décide quoi, quand est-ce qu'on voit quelque chose, et
 * ce qui se passe si ça dérape. Un décideur signe sur la méthode plus que
 * sur le prix ; un artisan, l'inverse. Le site vise désormais le premier.
 *
 * Rien ici n'est une promesse chiffrée : pas de durée, pas de position
 * Google. Ce que la page engage, c'est l'ordre des étapes et ce que chacune
 * produit de visible.
 */

const STEPS = [
  {
    title: "L'appel, quinze minutes",
    text: `Vous le réservez en ligne. Vous décrivez votre métier et ce qui coince aujourd'hui : les demandes qui n'arrivent pas, le temps perdu au téléphone, le site qu'on n'ose plus montrer. Je vous dis ce que je ferais, ce que je ne ferais pas, et ce que ça coûte. ${TERMS.quote}`,
  },
  {
    title: "Le devis, poste par poste",
    text: `Le prix vient en premier, pas noyé en dernière page. Le devis reprend une des trois offres avec le périmètre écrit en clair : les pages, la fonction métier, le socle mensuel, le délai, ce que vous fournissez, ce que je fournis. ${PRICING.payment.small} ${PRICING.payment.large} ${TERMS.revisions} Un poste qui ne sert à rien est retiré, pas facturé.`,
  },
  {
    title: "La conception, écrite avant la maquette",
    text: "Une à trois pages : le problème, les pages du site, ce que chacune doit faire faire au visiteur, et les mots que les gens tapent pour vous trouver. C'est ici que je dis ce qui ne sert à rien. Vous validez ce document, pas un dessin.",
  },
  {
    title: "La maquette, sur votre contenu",
    text: "Une page clé d'abord, avec vos textes et vos photos, pas du faux texte. Ce que vous voyez est ce qui sera codé : la même personne fait les deux, il n'y a rien à retraduire.",
  },
  {
    title: "Le code, avec un lien de suivi",
    text: "Le site est codé sur mesure, sans constructeur ni thème acheté. Vous recevez un lien de prévisualisation dès les premières pages, et vous le gardez jusqu'à la mise en ligne : pas de démonstration surprise en fin de projet.",
  },
  {
    title: "La mise en ligne",
    text: "Le nom de domaine est enregistré à votre nom. Le site est déclaré à Google et à Bing, le plan du site leur est envoyé, la fiche Google est mise en cohérence avec les pages. Les anciennes adresses, s'il y en avait, sont redirigées.",
  },
  {
    title: "Après",
    text: `Vous gardez le même interlocuteur. Le socle mensuel, annoncé dès le devis, prend le relais : hébergement, sécurité, petites modifications, et un rapport chaque mois sur les visites et les demandes. ${TERMS.socle} Les corrections liées au travail livré sont comprises. ${TERMS.handover}`,
  },
];

const YOU = [
  "Votre métier, dit avec vos mots, et les questions que vos clients vous posent déjà.",
  "Les textes que vous avez, même en vrac, et les photos, même prises au téléphone.",
  "Les accès : nom de domaine, fiche Google, ancien site, logiciel métier s'il y en a un.",
  "Une personne qui décide, et qui répond dans la semaine.",
];

const NOT = [
  "Pas de garantie de position Google, ni de résultat chiffré à l'avance.",
  "Pas de sous-traitance : conception, design et code par la même personne.",
  "Pas de site loué : le domaine est à votre nom et le code vous appartient. Le socle mensuel paie l'hébergement et la maintenance, pas le droit d'exister.",
  "Pas de remise sans retrait : un prix qui baisse, c'est un poste en moins, pas un prix qui était faux.",
  "Pas de projet accepté quand le sur mesure ne se justifie pas. Je le dis pendant l'appel.",
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
            Sept étapes, du premier appel à l&apos;après-livraison. Chacune produit quelque chose
            que vous pouvez lire ou ouvrir : un chiffre, un document, une maquette, un lien. Vous
            n&apos;attendez jamais la fin pour savoir où en est le projet.
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

            <aside className="pb-gd-note">
              <span className="pb-label pb-gd-note-l">À retenir</span>
              <p>
                Le document de conception est validé avant la première maquette. C&apos;est
                l&apos;étape que la plupart des projets sautent, et celle qui évite de redessiner
                trois fois.
              </p>
            </aside>

            <h2 className="pb-gd-h2">Ce que vous fournissez</h2>
            <ul className="pb-gd-ul">
              {YOU.map((y) => (
                <li key={y}>{y}</li>
              ))}
            </ul>
            <p className="pb-gd-p">
              Si les textes manquent, je les écris à partir d&apos;un entretien, c&apos;est une ligne
              du tarif. Si les photos manquent, on en parle tôt : c&apos;est souvent le point qui
              retarde tout.
            </p>

            <h2 className="pb-gd-h2">Ce que je ne fais pas</h2>
            <ul className="pb-gd-ul">
              {NOT.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>

            <h2 className="pb-gd-h2">Combien de temps, combien</h2>
            <p className="pb-gd-p">
              Essentiel, environ trois semaines. Signature, environ cinq. Les deux à compter du
              contenu reçu : c&apos;est presque toujours le contenu qui décide de la date, pas le
              code. Pour le sur mesure, le délai est dans le devis, avec une livraison par étapes.
              Le prix est écrit avant l&apos;appel : Essentiel dès {euro(SITE_FROM.essentiel)},
              Signature dès {euro(SITE_FROM.signature)}, sur mesure dès {euro(SITE_FROM.surMesure)},
              hors TVA, socle mensuel compris.
            </p>
          </div>

          <div className="pb-case-cta">
            <h2 className="pb-d-s">La première étape prend quinze minutes.</h2>
            <p>
              Vous la réservez en ligne, vous décrivez ce qui coince, vous raccrochez avec un chiffre,
              ou un devis écrit sous 48&nbsp;h pour le sur mesure.
              Rien à signer, ni pendant, ni après.
            </p>
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
                  Les cinq dossiers, avec ce qui a été tranché et pourquoi <Arrow dir="e" />
                </Link>
              </li>
              <li>
                <Link href="/#principes">
                  Les principes du studio <Arrow dir="e" />
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
