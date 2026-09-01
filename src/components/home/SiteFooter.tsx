import Link from "next/link";
import Logo from "./Logo";

const PAGES = [
  { href: "/projets", label: "Projets" },
  { href: "/guides", label: "Guides" },
  { href: "/creation-site-internet-hesbaye", label: "Hesbaye" },
  { href: "/#expertises", label: "Ce que je fais" },
  { href: "/#principes", label: "Principes" },
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
          <a href="mailto:contact@pixelbrute.be">contact@pixelbrute.be</a>
          <a href="tel:+32492200275">+32 492 20 02 75</a>
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
        </span>
        <span>Studio web solo, conçu et codé à la main</span>
      </div>
    </footer>
  );
}
