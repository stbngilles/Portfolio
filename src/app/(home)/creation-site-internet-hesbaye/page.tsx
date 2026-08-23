import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import Arrow from "@/components/home/Arrow";
import { PROJECTS } from "@/components/home/data";
import { IDENTITE } from "@/components/home/legal";

const SITE_URL = "https://pixelbrute.be";
const URL = `${SITE_URL}/creation-site-internet-hesbaye`;

/**
 * Page de zone — Hesbaye.
 *
 * Ce n'est pas une page-passerelle : elle ne se décline pas commune par
 * commune avec le nom échangé. Elle n'existe qu'une fois, elle porte des
 * clients réels situés dans la zone, et deux captures datées de résultats
 * obtenus là. Décliner ce contenu pour dix communes en changeant le toponyme
 * serait exactement ce que Google sanctionne — et ce qu'on déconseille dans
 * le guide sur le pack local.
 *
 * L'angle : un indépendant de Hesbaye n'a pas besoin de sortir sur « Liège ».
 * Il a besoin de sortir sur sa commune, où presque personne ne se bat.
 */

const COMMUNES = [
  "Hannut",
  "Waremme",
  "Braives",
  "Hélécine",
  "Landen",
  "Berloz",
  "Geer",
  "Lincent",
  "Wasseiges",
  "Jodoigne",
  "Huy",
];

export const metadata: Metadata = {
  title: { absolute: "Création de site internet en Hesbaye — Hannut, Waremme, Braives" },
  description:
    "Studio web installé à Hannut. Sites internet et référencement local pour indépendants et artisans de Hesbaye. Deux clients de la zone en 1ʳᵉ position du pack local Google.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Création de site internet en Hesbaye | Pixelbrute",
    description:
      "Installé à Hannut. Deux clients de la zone en 1ʳᵉ position du pack local — captures datées à l'appui.",
    type: "website",
    locale: "fr_BE",
    url: URL,
    siteName: "Pixelbrute",
    images: [
      { url: "/home/preuves/zenharmonie-google.png", width: 1500, height: 970, alt: "Résultat Google — pack local, Hélécine" },
    ],
  },
};

/** Les clients réellement situés en Hesbaye, dans l'ordre de la preuve. */
const LOCAUX = ["zen-harmonie", "detail-wave", "motodistri"];

export default function HesbayePage() {
  const locaux = LOCAUX.map((s) => PROJECTS.find((p) => p.slug === s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Création de site internet en Hesbaye", item: URL },
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Création de site internet en Hesbaye",
    serviceType: "Création de site internet et référencement local",
    provider: { "@id": `${SITE_URL}/#studio` },
    url: URL,
    areaServed: COMMUNES.map((c) => ({ "@type": "City", name: c })),
    inLanguage: "fr-BE",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <Header variant="page" />

      <main>
        <article className="pb-gd">
          <div className="pb-case-crumb pb-label">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Hesbaye</span>
          </div>

          <h1 className="pb-gd-title">Création de site internet en Hesbaye</h1>
          <p className="pb-gd-lede">
            Je travaille depuis {IDENTITE.ville}. Mes trois clients les plus proches sont à Braives,
            Hélécine et dans la région de Waremme — deux d&apos;entre eux sont aujourd&apos;hui en
            première position du pack local Google. Cette page explique pourquoi c&apos;est plus
            facile ici qu&apos;en ville, et ce que ça demande.
          </p>

          <div className="pb-gd-body">
            <h2 className="pb-gd-h2">Pourquoi une commune se gagne, et pas une grande ville</h2>
            <p className="pb-gd-p">
              Dans le bloc de trois établissements que Google affiche en haut d&apos;une recherche
              locale, la distance entre celui qui cherche et l&apos;établissement compte lourdement.
              À Liège, sur « coiffeur » ou « électricien », vous affrontez des dizaines de
              concurrents installés dans les rues voisines du chercheur. Vous ne gagnerez pas la
              proximité.
            </p>
            <p className="pb-gd-p">
              À Hannut, à Braives ou à Lincent, la situation s&apos;inverse. Il y a peu de
              concurrents, la plupart ont une fiche Google à moitié vide, et beaucoup n&apos;ont pas
              de site du tout. La requête « votre métier + votre commune » est souvent libre.
            </p>
            <p className="pb-gd-p">
              Le lot est modeste et il faut le dire&nbsp;: on parle de quelques recherches par mois,
              pas de centaines. Mais ces quelques personnes cherchent exactement votre prestation,
              exactement dans votre commune, et elles appellent. C&apos;est une acquisition qui coûte
              une fois et travaille ensuite sans budget publicitaire.
            </p>

            <h2 className="pb-gd-h2">Deux résultats obtenus ici, vérifiables maintenant</h2>
            <p className="pb-gd-p">
              Zen Harmonie est un cabinet de massage à Hélécine. Tapez «&nbsp;massage
              hélécine&nbsp;»&nbsp;: le cabinet sort en première position du pack local.
            </p>
            <figure className="pb-gd-proof">
              <div className="pb-proof-shot">
                <Image
                  src="/home/preuves/zenharmonie-google.png"
                  alt="Résultat Google pour « massage hélécine » — Zen Harmonie en première position du pack local"
                  width={1500}
                  height={970}
                  sizes="(max-width: 900px) 100vw, 760px"
                />
              </div>
              <figcaption className="pb-proof-cap pb-cap">
                Google · «&nbsp;massage hélécine&nbsp;» · août 2026
              </figcaption>
            </figure>

            <p className="pb-gd-p">
              Detail Wave nettoie canapés et intérieurs de voiture dans la région de Waremme. Même
              mécanique sur «&nbsp;nettoyage canapé waremme&nbsp;».
            </p>
            <figure className="pb-gd-proof">
              <div className="pb-proof-shot">
                <Image
                  src="/home/preuves/detailwave-google.png"
                  alt="Résultat Google pour « nettoyage canapé waremme » — Detail Wave en tête"
                  width={1500}
                  height={935}
                  sizes="(max-width: 900px) 100vw, 760px"
                />
              </div>
              <figcaption className="pb-proof-cap pb-cap">
                Google · «&nbsp;nettoyage canapé waremme&nbsp;» · août 2026
              </figcaption>
            </figure>

            <p className="pb-gd-p">
              Ni l&apos;un ni l&apos;autre n&apos;a de budget publicitaire. Ce sont des indépendants,
              sur des requêtes que personne ne disputait, avec une fiche Google correctement remplie
              et un site qui nomme leur zone.
            </p>

            <h2 className="pb-gd-h2">Les communes où j&apos;interviens</h2>
            <p className="pb-gd-p">
              Je me déplace pour la première rencontre dans un rayon d&apos;environ trente minutes
              autour de {IDENTITE.ville}&nbsp;:
            </p>
            <ul className="pb-gd-ul">
              {COMMUNES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="pb-gd-p">
              Au-delà, je travaille aussi — simplement, on se voit en visio plutôt qu&apos;autour
              d&apos;une table. Trois de mes six projets sont hors de ce rayon.
            </p>

            <h2 className="pb-gd-h2">Ce que je fais concrètement</h2>
            <p className="pb-gd-p">
              Le site et la visibilité locale vont ensemble&nbsp;: un site que personne ne trouve ne
              sert à rien, et une fiche Google bien remplie qui renvoie vers un site vide ne
              convertit pas. Je traite les deux.
            </p>
            <ul className="pb-gd-ul">
              <li>Le site&nbsp;: conception, design, code et mise en ligne, par la même personne.</li>
              <li>La fiche Google&nbsp;: catégorie, zone, services, description, photos.</li>
              <li>La cohérence entre les deux&nbsp;: mêmes coordonnées, mêmes communes nommées.</li>
              <li>Les fonctions dont votre métier a besoin&nbsp;: réservation, devis, boutique.</li>
            </ul>

            <h2 className="pb-gd-h2">Les projets de la zone</h2>
          </div>

          <ul className="pb-gd-rel-list">
            {locaux.map((p) => (
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
            <h2 className="pb-d-s">Vous êtes de la région&nbsp;?</h2>
            <p>
              Dites-moi votre métier et votre commune. Je regarde ce que donne la recherche
              aujourd&apos;hui et je vous dis franchement s&apos;il y a quelque chose à prendre —
              parfois la réponse est non.
            </p>
            <Link href="/contact" className="pb-btn-line">
              Parler de votre projet <Arrow dir="ne" />
            </Link>
          </div>

          <nav className="pb-gd-next" aria-label="Pour aller plus loin">
            <span className="pb-label">Pour aller plus loin</span>
            <ul>
              <li>
                <Link href="/guides/etre-trouve-sur-google-maps">
                  Être trouvé sur Google Maps quand on travaille près de chez soi <Arrow dir="e" />
                </Link>
              </li>
              <li>
                <Link href="/guides/combien-coute-un-site-internet-en-belgique">
                  Combien coûte un site internet, et pourquoi personne ne veut vous le dire{" "}
                  <Arrow dir="e" />
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
