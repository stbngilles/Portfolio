import Link from "next/link";

type NavItem = { href: string; label: string };

export function DashboardShell({
  title,
  eyebrow,
  italic,
  nav,
  user,
  children,
}: {
  title: string;
  eyebrow: string;
  italic?: string;
  nav: NavItem[];
  user: { name?: string | null; email: string; role: string };
  children: React.ReactNode;
}) {
  return (
    <>
      {/* En-tête éditorial */}
      <section
        className="wrap"
        style={{ paddingTop: 56, paddingBottom: 24 }}
      >
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="max-w-3xl">
            <div
              className="mono uppercase flex items-center gap-3 mb-5"
              style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--color-muted)" }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
              {eyebrow}
            </div>
            <h1
              className="display"
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
              {italic && (
                <>
                  {" "}
                  <em className="serif-i" style={{ color: "var(--color-accent)" }}>
                    {italic}
                  </em>
                </>
              )}
            </h1>
          </div>

          <div className="text-right">
            <p className="text-sm" style={{ color: "var(--color-ink-soft)", fontWeight: 500 }}>
              {user.name ?? user.email}
            </p>
            <p
              className="mono uppercase mt-1"
              style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
            >
              {user.role}
            </p>
            <form action="/api/auth/sign-out" method="POST" className="mt-3">
              <button
                type="submit"
                className="text-xs no-underline transition-colors"
                style={{ color: "var(--color-muted)" }}
              >
                Déconnexion →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Onglets de navigation interne */}
      {nav.length > 0 && (
        <div style={{ borderBottom: "1px solid var(--color-line)" }}>
          <div className="wrap">
            <nav className="flex gap-1 overflow-x-auto" style={{ marginBottom: -1 }}>
              {nav.map((n, i) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-4 py-4 text-sm no-underline transition-colors whitespace-nowrap"
                  style={{
                    color: i === 0 ? "var(--color-ink)" : "var(--color-muted)",
                    fontWeight: i === 0 ? 500 : 400,
                    borderBottom: i === 0 ? "2px solid var(--color-accent)" : "2px solid transparent",
                  }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {children}
      </div>
    </>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="p-6 transition"
      style={{
        background: accent ? "var(--color-accent-soft)" : "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 12,
      }}
    >
      <p
        className="mono uppercase mb-3"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
      >
        {label}
      </p>
      <p
        className="display"
        style={{
          fontSize: 32,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: accent ? "var(--color-accent-ink)" : "var(--color-ink)",
          marginBottom: 8,
        }}
      >
        {value}
      </p>
      {hint && (
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function PlaceholderPanel({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase?: string;
}) {
  return (
    <div
      className="p-7 transition group"
      style={{
        background: "var(--color-paper)",
        border: "1px dashed var(--color-line)",
        borderRadius: 12,
      }}
    >
      <div className="flex items-start justify-between mb-3 gap-4">
        <h3
          className="display"
          style={{ fontSize: 18, lineHeight: 1.2, letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>
        <span
          className="mono uppercase shrink-0"
          style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
        >
          {phase ?? "À venir"}
        </span>
      </div>
      <p className="text-sm" style={{ color: "var(--color-muted)", lineHeight: 1.55 }}>
        {description}
      </p>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  italic,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
}) {
  return (
    <div className="mb-6">
      <p
        className="mono uppercase mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
      >
        · {eyebrow}
      </p>
      <h2
        className="display"
        style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em" }}
      >
        {title}
        {italic && (
          <>
            {" "}
            <em className="serif-i" style={{ color: "var(--color-accent)" }}>
              {italic}
            </em>
          </>
        )}
      </h2>
    </div>
  );
}
