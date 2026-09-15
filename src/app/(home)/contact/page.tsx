import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/home/Header";
import Arrow from "@/components/home/Arrow";
import BookCall from "@/components/home/BookCall";
import CalInline from "@/components/home/CalInline";
import DayPicker from "@/components/home/DayPicker";
import StickyBook from "@/components/home/StickyBook";
import TrackLink from "@/components/home/TrackLink";
import ContactWays from "@/components/home/ContactWays";
import BriefForm from "@/components/home/BriefForm";
import Faq from "@/components/home/Faq";
import SiteFooter from "@/components/home/SiteFooter";
import { Lines } from "@/components/home/Text";
import { IDENTITE } from "@/components/home/legal";
import { AVAILABILITY, FAQS, QUOTES, STUDIO, TERMS } from "@/components/home/data";

export const metadata: Metadata = {
  title: { absolute: "Contact, réserver un appel de 15 minutes | Pixelbrute, studio web à Liège" },
  description:
    "Quinze minutes pour chiffrer votre site, par téléphone ou en visio. Prix fixé pendant l'appel, ou devis écrit sous 48 h. Studio web à Liège, +32 492 20 02 75.",
  alternates: { canonical: "https://pixelbrute.be/contact" },
};

const SITE_URL = "https://pixelbrute.be";

/**
 * Les questions de la page, en `FAQPage`.
 *
 * Google n'affiche plus les résultats enrichis FAQ depuis 2023, sauf pour une
 * poignée de sites institutionnels, donc aucune promesse de ce côté-là. Le
 * balisage reste posé pour l'autre lecteur : une paire question/réponse
 * explicitement marquée est la forme la plus directement reprenable qui
 * existe pour un modèle qui doit répondre « est-ce qu'ils sous-traitent ? »
 * ou « qu'est-ce qui fait varier le prix ? ».
 *
 * Les réponses sont celles de `data.ts`, à l'identique, le texte à l'écran
 * et le texte balisé ne peuvent pas diverger, sous peine d'être traités comme
 * du contenu masqué.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/contact#faq`,
  inLanguage: "fr-BE",
  about: { "@id": `${SITE_URL}/#studio` },
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
  ],
};

const STEPS = [
  { t: "Vous parlez de votre activité.", p: "Ce qui marche, ce qui coince, ce que vous visez." },
  { t: "Je dis ce que je ferais.", p: "Et ce que je ne ferais pas, franchement." },
  { t: "Vous raccrochez avec un chiffre.", p: TERMS.quote },
];

const PROOFS = [
  {
    src: "/home/preuves/zenharmonie-google.png",
    w: 1500,
    h: 970,
    alt: "Résultat Google pour « massage hélécine », Zen Harmonie en première position du pack local",
    caption: "Google · « massage hélécine » · août 2026",
  },
  {
    src: "/home/preuves/detailwave-google.png",
    w: 1500,
    h: 935,
    alt: "Résultat Google pour « nettoyage canapé waremme », Detail Wave en tête",
    caption: "Google · « nettoyage canapé waremme » · août 2026",
  },
];

/**
 * `/contact`, la page où arrivent les annonces Google.
 *
 * Tout la tire vers une seule action : réserver quinze minutes. Dans l'ordre,
 * le hero et son bouton, ce qui se passe pendant l'appel, le calendrier
 * ouvert, les preuves. Écrire, appeler, WhatsApp viennent ensuite, pour qui
 * n'est pas prêt à poser un créneau.
 *
 * Le calendrier est aussi dans l'en-tête et dans une barre qui apparaît dès
 * qu'aucune autre porte n'est à l'écran (`StickyBook`). La bulle des autres
 * pages est coupée ici, elle ferait doublon.
 */
export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header variant="contact" />
      <main className="pb-cx">
        <section className="pb-cx-hero">
          <div className="pb-cx-main">
            <div className="pb-over">Studio web · Liège et province</div>
            <Lines as="h1" className="pb-d-xl pb-cx-h1" lines={["Quinze minutes", "pour chiffrer", "votre site."]} muteFrom={2} />
            <p className="pb-cx-lede">
              Vous décrivez ce qui coince. Je vous dis ce que je ferais, et ce que ça coûte.
            </p>

            <div className="pb-cx-acts" data-cx-watch="">
              <BookCall className="pb-btn-solid pb-cx-cta">
                Réserver mes 15 minutes <Arrow dir="ne" />
              </BookCall>
              <TrackLink event="tel_click" href={`tel:${IDENTITE.telephoneHref}`} className="pb-cx-tel">
                Ou appeler le {IDENTITE.telephone}
              </TrackLink>
            </div>

            <ul className="pb-trust pb-cap pb-cx-trust">
              {AVAILABILITY && <li>{AVAILABILITY}</li>}
              <li data-keep="">5,0 ★ sur Google</li>
              <li>Téléphone ou visio</li>
              <li data-keep="">Sans engagement</li>
            </ul>
          </div>

          <aside className="pb-cx-card" aria-label="Réserver un appel" data-cx-watch="">
            <div className="pb-cx-who">
              <Image src={STUDIO.img} alt={`${STUDIO.name}, Pixelbrute`} width={70} height={70} className="pb-cx-face" priority />
              <div>
                <b>{STUDIO.name}</b>
                <span>{STUDIO.role} · Pixelbrute</span>
              </div>
            </div>
            <p className="pb-cx-say">C&apos;est moi qui décroche. Et moi qui code votre site.</p>
            <div className="pb-cap">Choisissez un jour</div>
            <DayPicker />
          </aside>
        </section>

        <section className="pb-cx-steps">
          <div className="pb-over">Pendant l&apos;appel</div>
          <h2 className="pb-d-l pb-cx-h2">Trois temps, pas un de plus.</h2>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.t}>
                <span className="pb-cx-n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="pb-cx-st">{s.t}</h3>
                <p className="pb-cx-sp">{s.p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="creneaux" className="pb-cx-cal" data-cx-watch="">
          <div className="pb-over">Agenda en direct</div>
          <h2 className="pb-d-l pb-cx-h2">Choisissez votre créneau.</h2>
          <CalInline />
        </section>

        <section className="pb-cx-proof">
          <div className="pb-over">Vérifiable en dix secondes</div>
          <h2 className="pb-d-m pb-cx-h2">Deux clients en tête du pack local Google.</h2>
          <div className="pb-cx-proof-grid">
            {PROOFS.map((s) => (
              <figure key={s.src} className="pb-cx-fig">
                <div className="pb-proof-shot">
                  <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(max-width: 987px) 100vw, 50vw" />
                </div>
                <figcaption className="pb-proof-cap pb-cap">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className="pb-cx-quotes">
            {QUOTES.slice(0, 2).map((q) => (
              <blockquote key={q.name} className="pb-cx-quote">
                <p>{q.text}</p>
                <footer className="pb-cap">
                  {q.name} · {q.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="ecrire" className="pb-cx-write">
          <div className="pb-over">Pas prêt pour un appel</div>
          <h2 className="pb-d-l pb-cx-h2">Écrivez-moi plutôt.</h2>
          <p className="pb-cx-lede pb-cx-write-lede">Trois questions, une minute. Réponse sous 24 h ouvrées.</p>
          <BriefForm />
          <ContactWays />
        </section>

        <Faq />

        <section className="pb-cx-final pb-dark" data-cx-watch="">
          {AVAILABILITY && (
            <span className="pb-label pb-inked pb-cx-slot" data-tone="light">
              {AVAILABILITY}
            </span>
          )}
          <Lines as="h2" className="pb-d-xl" lines={["Choisissez", "votre créneau."]} />
          <div className="pb-cx-final-acts">
            <BookCall className="pb-btn-paper pb-cx-cta">
              Réserver mes 15 minutes <Arrow dir="ne" />
            </BookCall>
            <TrackLink event="tel_click" href={`tel:${IDENTITE.telephoneHref}`} className="pb-btn-ghost">
              {IDENTITE.telephone}
            </TrackLink>
          </div>
          <p className="pb-cx-final-p">Assez pour cadrer et chiffrer. Même si ce n&apos;est pas avec moi.</p>
        </section>
      </main>
      <SiteFooter />
      <StickyBook />
    </>
  );
}
