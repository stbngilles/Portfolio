"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavTabs({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();

  /**
   * Détermine quel onglet est actif. Règle :
   *  - match exact en priorité
   *  - sinon, le href le plus long qui est un préfixe du pathname courant
   *    (ex. /app/admin/projects/abc match l'onglet /app/admin/projects)
   *  - on évite que /app/admin (vue d'ensemble) match toutes les sous-pages
   *    en exigeant que le href courant soit un sous-chemin strict.
   */
  const activeHref = (() => {
    let best: string | null = null;
    for (const it of items) {
      if (pathname === it.href) return it.href; // match exact gagne
      if (pathname.startsWith(it.href + "/")) {
        if (!best || it.href.length > best.length) best = it.href;
      }
    }
    return best;
  })();

  return (
    <nav
      className="flex overflow-x-auto"
      style={{ marginBottom: -1, gap: "clamp(4px, 1.2vw, 18px)" }}
    >
      {items.map((n) => {
        const active = n.href === activeHref;
        return (
          <Link
            key={n.href}
            href={n.href}
            className="text-sm no-underline transition-colors whitespace-nowrap"
            style={{
              padding: "18px 6px",
              color: active ? "var(--color-ink)" : "var(--color-muted)",
              fontWeight: active ? 500 : 400,
              letterSpacing: "0.005em",
              borderBottom: active
                ? "2px solid var(--color-accent)"
                : "2px solid transparent",
            }}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
