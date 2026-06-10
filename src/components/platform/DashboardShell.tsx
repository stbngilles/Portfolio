import { NavTabs } from "./NavTabs";

type NavItem = { href: string; label: string };

export function DashboardShell({
  title,
  eyebrow,
  italic,
  nav,
  children,
}: {
  title: string;
  eyebrow: string;
  italic?: string;
  nav: NavItem[];
  user?: { name?: string | null; email: string; role: string };
  children: React.ReactNode;
}) {
  return (
    <>
      {/* En-tête compact */}
      <section className="wrap" style={{ paddingTop: 36, paddingBottom: 20 }}>
        <div className="max-w-3xl">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--color-muted)",
              fontFamily: "var(--font-geist)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-accent)",
              }}
            />
            {eyebrow}
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
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
      </section>

      {/* Tabs de navigation */}
      {nav.length > 0 && (
        <div style={{ borderBottom: "1px solid var(--color-line)" }}>
          <div className="wrap">
            <NavTabs items={nav} />
          </div>
        </div>
      )}

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 80 }}>
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
      style={{
        background: accent ? "var(--color-accent-soft)" : "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 10,
        padding: "20px 24px",
      }}
    >
      <p
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-subtle)",
          fontFamily: "var(--font-geist)",
          marginBottom: 8,
        }}
      >
        {label}
      </p>
      <p
        className="display"
        style={{
          fontSize: 28,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: accent ? "var(--color-accent-ink)" : "var(--color-ink)",
          marginBottom: hint ? 6 : 0,
        }}
      >
        {value}
      </p>
      {hint && (
        <p style={{ fontSize: 12, color: "var(--color-muted)" }}>{hint}</p>
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
      style={{
        background: "var(--color-paper)",
        border: "1px dashed var(--color-line)",
        borderRadius: 10,
        padding: "24px 28px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
        <h3 className="display" style={{ fontSize: 17, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <span
          style={{
            fontSize: 9,
            fontFamily: "var(--font-geist)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--color-subtle)",
            flexShrink: 0,
          }}
        >
          {phase ?? "À venir"}
        </span>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", lineHeight: 1.6 }}>
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
    <div style={{ marginBottom: 20, marginTop: 4 }}>
      <p
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-subtle)",
          fontFamily: "var(--font-geist)",
          marginBottom: 6,
        }}
      >
        · {eyebrow}
      </p>
      <h2
        className="display"
        style={{ fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.015em" }}
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
