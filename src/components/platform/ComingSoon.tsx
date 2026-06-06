import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";

export function ComingSoon({
  eyebrow,
  title,
  italic,
  user,
  nav,
  what,
  phase,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  user: { name?: string | null; email: string; role: string };
  nav: { href: string; label: string }[];
  what: string;
  phase: string;
}) {
  return (
    <DashboardShell
      eyebrow={eyebrow}
      title={title}
      italic={italic}
      user={user}
      nav={nav}
    >
      <div
        className="p-12 text-center"
        style={{
          background: "var(--color-paper)",
          border: "1px dashed var(--color-line)",
          borderRadius: 12,
        }}
      >
        <p
          className="mono uppercase mb-4"
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--color-subtle)",
          }}
        >
          · {phase}
        </p>
        <h2
          className="display mb-4"
          style={{ fontSize: 32, letterSpacing: "-0.02em", lineHeight: 1.1 }}
        >
          On y travaille,{" "}
          <em className="serif-i" style={{ color: "var(--color-accent)" }}>
            ça arrive.
          </em>
        </h2>
        <p
          style={{
            color: "var(--color-muted)",
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          {what}
        </p>
      </div>
    </DashboardShell>
  );
}
