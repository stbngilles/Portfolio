import Link from "next/link";

/**
 * Layout plateforme — Klein & Craie.
 * Chrome sobre, éditoriale. Pas de noise-bg (réservé au site marketing pour
 * conserver leur séparation visuelle), mais on garde la même palette,
 * la même typo, le même accent bleu Klein.
 */
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}>
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          background: "color-mix(in srgb, var(--color-paper) 88%, transparent)",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <div className="wrap flex items-center justify-between" style={{ paddingTop: 18, paddingBottom: 18 }}>
          <Link
            href="/app"
            className="flex items-baseline gap-[2px] no-underline"
            style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 18 }}
          >
            <span
              className="inline-block w-[10px] h-[10px] mr-[10px] rounded-[2px]"
              style={{ background: "var(--color-accent)", translate: "0 -2px" }}
            />
            Pixelbrute
            <span
              className="mono ml-3"
              style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)", textTransform: "uppercase" }}
            >
              · Platform
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm no-underline transition-colors"
            style={{ color: "var(--color-muted)" }}
          >
            ← Retour au site
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ borderTop: "1px solid var(--color-line)" }}>
        <div className="wrap flex justify-between items-center" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <p
            className="mono uppercase"
            style={{ fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.1em" }}
          >
            © 2026 · Pixelbrute · OS
          </p>
          <p
            className="serif-i"
            style={{ fontSize: 13, color: "var(--color-subtle)" }}
          >
            le studio qui tourne tout seul.
          </p>
        </div>
      </footer>
    </div>
  );
}
