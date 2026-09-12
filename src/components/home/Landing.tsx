import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import Arrow from "./Arrow";
import BookCall from "./BookCall";
import TrackLink from "./TrackLink";
import { IDENTITE } from "./legal";

/**
 * Page d'atterrissage pour les annonces, `/lp/*`.
 *
 * Une annonce qui envoie sur la home paie un clic pour un visiteur qui
 * trouve un menu, un pied de page et sept liens vers ailleurs. Ici, une seule
 * sortie : réserver quinze minutes. Pas de menu, pas de pied de page, le logo
 * n'est pas un lien, et les seuls autres liens sont le téléphone (une
 * conversion aussi) et les deux pages légales, obligatoires.
 *
 * Les pages qui l'utilisent sont `noindex` et absentes du sitemap : elles
 * répètent le message d'une page publique avec moins de contenu, exactement
 * ce qu'un moteur classe comme page mince. La balise n'empêche pas AdsBot de
 * lire la page pour le score de qualité, il ignore `noindex`.
 *
 * Le texte de chaque landing reprend les mots du groupe d'annonces qui y
 * envoie (« agence web à Liège », « site agence immobilière ») : c'est ce
 * que Google Ads compare entre l'annonce, le mot-clé et la page.
 */
export type LandingProps = {
  over: string;
  /** Une ligne par entrée. Contient les mots du groupe d'annonces. */
  title: string[];
  lede: string;
  points: { title: string; text: string }[];
  /** Captures datées, quand la page a une preuve visuelle. */
  proofs?: { src: string; w: number; h: number; alt: string; caption: string }[];
  /** Liste courte, quand la preuve est ce qui sera construit. */
  bullets?: { label: string; items: string[] };
  price: string;
  faq: { q: string; a: string }[];
  cta: string;
};

export default function Landing({ over, title, lede, points, proofs, bullets, price, faq, cta }: LandingProps) {
  return (
    <main className="pb-lp">
      <div className="pb-lp-bar">
        <div className="pb-logo" aria-label="Pixelbrute">
          <Logo idSuffix="lp" />
        </div>
        <TrackLink event="tel_click" href={`tel:${IDENTITE.telephoneHref}`} className="pb-lp-tel pb-label">
          {IDENTITE.telephone}
        </TrackLink>
      </div>

      <section className="pb-lp-hero">
        <div className="pb-over">{over}</div>
        <h1 className="pb-lp-h1">
          {title.map((t, i) => (
            <span key={t} className={i === title.length - 1 ? "pb-mute" : undefined}>
              {t}
            </span>
          ))}
        </h1>
        <p className="pb-lp-lede">{lede}</p>
        <div className="pb-lp-acts">
          <BookCall className="pb-btn-solid">
            {cta} <Arrow dir="ne" />
          </BookCall>
          <span className="pb-cap">Quinze minutes, sans engagement. Le devis est chiffré pendant l&apos;appel.</span>
        </div>
      </section>

      <section className="pb-lp-points">
        {points.map((p, i) => (
          <div key={p.title} className="pb-lp-point">
            <span className="pb-mono pb-lp-n">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="pb-lp-pt">{p.title}</h2>
            <p className="pb-lp-pp">{p.text}</p>
          </div>
        ))}
      </section>

      {proofs && proofs.length > 0 && (
        <section className="pb-lp-proofs">
          <div className="pb-over">Vérifiable en dix secondes</div>
          <div className="pb-lp-proof-grid">
            {proofs.map((s) => (
              <figure key={s.src} className="pb-gd-proof">
                <div className="pb-proof-shot">
                  <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(max-width: 900px) 100vw, 420px" />
                </div>
                <figcaption className="pb-proof-cap pb-cap">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {bullets && (
        <section className="pb-lp-proofs">
          <div className="pb-over">{bullets.label}</div>
          <ul className="pb-gd-ul">
            {bullets.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="pb-lp-price">{price}</p>

      <section className="pb-lp-faq">
        {faq.map((f) => (
          <div key={f.q}>
            <h2 className="pb-gd-q">{f.q}</h2>
            <p className="pb-gd-p">{f.a}</p>
          </div>
        ))}
      </section>

      <section className="pb-lp-final">
        <h2 className="pb-d-s">On en parle quinze minutes&nbsp;?</h2>
        <p>
          Vous décrivez ce qui coince, je vous dis ce que je ferais et ce que ça coûte. Même si ce
          n&apos;est pas avec moi, vous raccrochez en sachant quoi faire.
        </p>
        <BookCall className="pb-btn-solid">
          {cta} <Arrow dir="ne" />
        </BookCall>
      </section>

      <footer className="pb-lp-foot pb-cap">
        <span>© 2026 Pixelbrute · {IDENTITE.ville}, province de Liège</span>
        <span className="pb-foot-legal">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </span>
      </footer>
    </main>
  );
}
