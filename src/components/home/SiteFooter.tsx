import Link from "next/link";
import Logo from "./Logo";
import TrackLink from "./TrackLink";
import { ConsentLink } from "./Consent";

const PAGES = [
  { href: "/projets", label: "Projets" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/comment-je-travaille", label: "Méthode" },
  { href: "/creation-site-agence-immobiliere", label: "Immobilier" },
  { href: "/guides", label: "Guides" },
  { href: "/creation-site-internet-liege", label: "Liège" },
  { href: "/creation-site-internet-hesbaye", label: "Hesbaye" },
  { href: "/#studio", label: "Le studio" },
  { href: "/contact", label: "Contact" },
];

/**
 * Footer minimal : une ligne de liens au lieu des quatre colonnes précédentes,
 * qui répétaient le sommaire de la page qu'on vient de lire.
 */
export default function SiteFooter() {
  return (
    <footer className="pb-foot">
      <div className="pb-foot-top">
        <div>
          <div className="pb-logo" style={{ pointerEvents: "none" }}>
            <Logo idSuffix="foot" />
          </div>
          <div className="pb-foot-place pb-label">Hannut · Hesbaye, province de Liège</div>
        </div>

        <div className="pb-foot-reach">
          <TrackLink event="mail_click" href="mailto:contact@pixelbrute.be">
            contact@pixelbrute.be
          </TrackLink>
          <TrackLink event="tel_click" href="tel:+32492200275">
            +32 492 20 02 75
          </TrackLink>
        </div>
      </div>

      <nav className="pb-foot-links pb-label">
        {PAGES.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="pb-foot-bar pb-cap">
        <span>© 2026 Pixelbrute</span>
        <span className="pb-foot-legal">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <ConsentLink />
        </span>
        <span>Studio web solo, conçu et codé à la main</span>
      </div>
    </footer>
  );
}
