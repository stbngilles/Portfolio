"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Arrow from "./Arrow";

const LINKS = [
  { href: "/#projets", label: "Projets" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/creation-site-agence-immobiliere", label: "Immobilier" },
  { href: "/#expertises", label: "Ce que je fais" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ variant = "home" }: { variant?: "home" | "page" } = {}) {
  const onHome = variant === "home";
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);

  /**
   * L'en-tête flotte au-dessus de sections tantôt craie, tantôt bleu Klein.
   * En encre sombre sur le bleu, le contraste tombe à 2,3:1 : on bascule donc
   * tout l'en-tête en craie dès qu'un panneau bleu passe sous la barre.
   *
   * Les bornes des panneaux sont mesurées quand la page change de taille, pas
   * quand elle défile. `getBoundingClientRect()` appelé à chaque image de
   * scroll obligeait le navigateur à recalculer la mise en page au moment
   * précis où Lenis venait d'écrire la position, une lecture forcée par
   * frame, sur toute la hauteur du document. En coordonnées document, la
   * comparaison ne coûte plus qu'une soustraction.
   */
  useEffect(() => {
    const band = 34; // milieu de la barre d'en-tête
    let ranges: Array<[number, number]> = [];
    let raf: number | null = null;

    const apply = () => {
      raf = null;
      const y = window.scrollY + band;
      setOverDark(ranges.some(([top, bottom]) => top <= y && bottom >= y));
    };

    const measure = () => {
      const y = window.scrollY;
      ranges = Array.from(document.querySelectorAll<HTMLElement>(".pb-dark")).map((el) => {
        const r = el.getBoundingClientRect();
        return [r.top + y, r.bottom + y] as [number, number];
      });
      apply();
    };

    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(apply);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    // Les images arrivent en différé : la hauteur des sections bouge après la
    // première mesure, et les bornes seraient fausses jusqu'au redimensionnement.
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
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
          aria-label={onHome ? "Pixelbrute, haut de page" : "Pixelbrute, retour à l'accueil"}
        >
          <Logo tone={tone} />
        </a>
        <div className="pb-header-actions">
          {/* Sur téléphone, le libellé tient en un mot : la pilule ne se casse
              plus sur deux lignes et le burger garde sa hauteur. La flèche
              « retour » précède le texte, comme on revient en arrière. */}
          <a href={onHome ? "/contact" : "/"} className="pb-contact-pill">
            {!onHome && <Arrow dir="w" />}
            <span className="pb-pill-long">{onHome ? "Me contacter" : "Retour à l'accueil"}</span>
            <span className="pb-pill-short">{onHome ? "Contact" : "Accueil"}</span>
            {onHome && <Arrow dir="ne" />}
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
            <Link href="/projets" onClick={() => setOpen(false)}>
              Les dossiers
            </Link>
            <Link href="/guides" onClick={() => setOpen(false)}>
              Guides
            </Link>
            <Link href="/comment-je-travaille" onClick={() => setOpen(false)}>
              Méthode
            </Link>
            <Link href="/#principes" onClick={() => setOpen(false)}>
              Principes
            </Link>
            <Link href="/#studio" onClick={() => setOpen(false)}>
              Le studio
            </Link>
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
