import type { Metadata } from "next";

/**
 * Espaces de suivi client : privés, derrière un mot de passe, jamais indexés,
 * absents du sitemap et de tout lien du site public. Pas de ligne dans
 * `robots.ts` non plus : elle publierait l'adresse.
 */
export const metadata: Metadata = {
  title: { absolute: "Suivi du projet · Pixelbrute" },
  robots: { index: false, follow: false, nocache: true },
};

export default function SuiviLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-bg text-ink [font-family:var(--font-sans)]">{children}</div>;
}
