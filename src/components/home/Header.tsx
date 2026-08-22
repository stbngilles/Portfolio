"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Arrow from "./Arrow";

const LINKS = [
  { href: "/#projets", label: "Projets" },
  { href: "/#expertises", label: "Ce que je fais" },
  { href: "/#principes", label: "Principes" },
  { href: "/contact", label: "Contact" },
];

/** Pages hors homepage — gardées accessibles depuis le menu pour ne pas les
 *  orpheliner maintenant que la home est une page unique à ancres. */
const SUB_LINKS = [
  { href: "/realisations", label: "Réalisations" },
  { href: "/services/web-design", label: "Web design" },
  { href: "/services/seo", label: "SEO local" },
  { href: "/services/maintenance", label: "Maintenance" },
];

export default function Header({ variant = "home" }: { variant?: "home" | "page" } = {}) {
  const onHome = variant === "home";
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);

  /**
   * L'en-tête flotte au-dessus de sections tantôt craie, tantôt bleu Klein.
   * En encre sombre sur le bleu, le contraste tombe à 2,3:1 : on bascule donc
   * tout l'en-tête en craie dès qu'un panneau bleu passe sous la barre.
   */
  useEffect(() => {
    let raf: number | null = null;
    const check = () => {
      raf = null;
      const band = 34; // milieu de la barre d'en-tête
      const hit = Array.from(
        document.querySelectorAll<HTMLElement>(".pb-dark")
      ).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= band && r.bottom >= band;
      });
      setOverDark(hit);
    };
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const tone = overDark || open ? ("light" as const) : undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="pb-header" data-tone={tone}>
        <a
          href={onHome ? "#top" : "/"}
          className="pb-logo"
          aria-label={onHome ? "Pixelbrute — haut de page" : "Pixelbrute — retour à l'accueil"}
        >
          <Logo tone={tone} />
        </a>
        <div className="pb-header-actions">
          <a href={onHome ? "/contact" : "/"} className="pb-contact-pill">
            <span>{onHome ? "Me contacter" : "Retour à l'accueil"}</span>
            <Arrow dir={onHome ? "ne" : "w"} />
          </a>
          <button
            type="button"
            className="pb-burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div className="pb-menu" role="dialog" aria-modal="true" aria-label="Menu principal">
          <div className="pb-menu-inner">
          <div className="pb-label pb-menu-over">Menu · Pixelbrute</div>

          <nav className="pb-menu-nav">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="pb-menu-link" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="pb-label pb-menu-sub">
            <span>Aussi</span>
            {SUB_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>

          <button type="button" className="pb-menu-close" onClick={() => setOpen(false)}>
            Fermer <Arrow dir="x" />
          </button>
          </div>
        </div>
      )}
    </>
  );
}
