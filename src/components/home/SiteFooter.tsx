import Link from "next/link";
import Logo from "./Logo";

const PAGES = [
  { href: "/realisations", label: "Réalisations" },
  { href: "/services/web-design", label: "Web design" },
  { href: "/services/seo", label: "SEO local" },
  { href: "/services/maintenance", label: "Maintenance" },
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
          <div className="pb-foot-place pb-label">Liège, Belgique</div>
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
        <span>Studio web solo — conçu et codé à la main</span>
      </div>
    </footer>
  );
}
