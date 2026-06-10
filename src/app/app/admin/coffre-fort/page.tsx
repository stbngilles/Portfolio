import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
  StatCard,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { decryptSecret } from "@/lib/crypto";

const SERVICE_LABEL: Record<string, string> = {
  BREVO: "Brevo",
  STRIPE: "Stripe",
  WORDPRESS: "WordPress",
  DB: "Base de données",
  HOSTING: "Hébergement",
  DOMAIN: "Nom de domaine",
  OTHER: "Autre",
};

export default async function MasterVaultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; service?: string }>;
}) {
  await requireRole("ADMIN");
  const { q = "", service = "" } = await searchParams;

  const all = await prisma.projectCredential.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      project: {
        select: {
          id: true,
          name: true,
          client: { select: { name: true, email: true } },
        },
      },
    },
  });

  const filtered = all.filter((c) => {
    if (service && c.service !== service) return false;
    if (q) {
      const needle = q.toLowerCase();
      const hay = `${c.label} ${c.url ?? ""} ${c.username ?? ""} ${c.project.name} ${c.project.client.name ?? ""} ${c.project.client.email}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  const byService = all.reduce<Record<string, number>>((acc, c) => {
    acc[c.service] = (acc[c.service] ?? 0) + 1;
    return acc;
  }, {});

  const projectsCovered = new Set(all.map((c) => c.projectId)).size;

  return (
    <DashboardShell
      eyebrow="Coffre-fort maître"
      title="Tous les accès,"
      italic="centralisés."
      nav={ADMIN_NAV}
    >
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Identifiants" value={String(all.length)} hint="tous projets" accent />
        <StatCard label="Projets couverts" value={String(projectsCovered)} hint="avec accès" />
        <StatCard label="Services" value={String(Object.keys(byService).length)} hint="différents" />
        <StatCard
          label="Le plus utilisé"
          value={
            Object.entries(byService).sort((a, b) => b[1] - a[1])[0]?.[0]
              ? SERVICE_LABEL[Object.entries(byService).sort((a, b) => b[1] - a[1])[0][0]]
              : "—"
          }
          hint="par fréquence"
        />
      </section>

      <SectionTitle eyebrow="Recherche" title="Trouver un accès," italic="en deux secondes." />

      <form
        method="get"
        className="flex gap-3 mb-8 flex-wrap"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Recherche (label, client, projet, URL…)"
          className="flex-1 min-w-[240px] px-3 py-2 outline-none"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 8,
            fontSize: 14,
          }}
        />
        <select
          name="service"
          defaultValue={service}
          className="px-3 py-2 outline-none"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          <option value="">Tous services</option>
          {Object.entries(SERVICE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Filtrer</button>
        {(q || service) && (
          <Link href="/app/admin/coffre-fort" className="btn btn-ghost">Réinitialiser</Link>
        )}
      </form>

      {filtered.length === 0 ? (
        <div
          className="p-10 text-center"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="serif-i" style={{ fontSize: 22, color: "var(--color-muted)" }}>
            {all.length === 0
              ? "Aucun identifiant déposé pour le moment."
              : "Aucun résultat pour ce filtre."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => {
            const pwd = decryptSecret(c.password);
            const apiKey = decryptSecret(c.apiKey);
            return (
            <article
              key={c.id}
              className="p-5"
              style={{
                background: "var(--color-paper)",
                border: "1px solid var(--color-line)",
                borderRadius: 10,
              }}
            >
              <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                <div>
                  <span
                    className="mono uppercase mr-3"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      color: "var(--color-accent)",
                    }}
                  >
                    {SERVICE_LABEL[c.service] ?? c.service}
                  </span>
                  <strong style={{ fontSize: 16 }}>{c.label}</strong>
                </div>
                <Link
                  href={`/app/admin/projects/${c.project.id}`}
                  className="text-xs"
                  style={{ color: "var(--color-accent)" }}
                >
                  {c.project.name} →
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm" style={{ color: "var(--color-muted)" }}>
                {c.url && (
                  <div>
                    <span className="mono uppercase block" style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>URL</span>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-ink)" }}>
                      {c.url}
                    </a>
                  </div>
                )}
                {c.username && (
                  <div>
                    <span className="mono uppercase block" style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>Identifiant</span>
                    <code style={{ color: "var(--color-ink)" }}>{c.username}</code>
                  </div>
                )}
                {pwd && (
                  <div>
                    <span className="mono uppercase block" style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>Mot de passe</span>
                    <details>
                      <summary style={{ cursor: "pointer", color: "var(--color-accent)" }}>Révéler</summary>
                      <code style={{ color: "var(--color-ink)" }}>{pwd}</code>
                    </details>
                  </div>
                )}
                {apiKey && (
                  <div>
                    <span className="mono uppercase block" style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>API key</span>
                    <details>
                      <summary style={{ cursor: "pointer", color: "var(--color-accent)" }}>Révéler</summary>
                      <code style={{ color: "var(--color-ink)", wordBreak: "break-all" }}>{apiKey}</code>
                    </details>
                  </div>
                )}
              </div>

              {c.notes && (
                <p
                  className="serif-i mt-3 text-sm"
                  style={{ color: "var(--color-ink-soft)", lineHeight: 1.5 }}
                >
                  « {c.notes} »
                </p>
              )}

              <p
                className="mono uppercase mt-3"
                style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
              >
                Client : {c.project.client.name ?? c.project.client.email} ·
                MAJ {c.updatedAt.toLocaleDateString("fr-BE")}
              </p>
            </article>
            );
          })}
        </div>
      )}

      <p className="text-xs mt-8 serif-i" style={{ color: "var(--color-subtle)" }}>
        Les mots de passe sont stockés en clair en dev — à chiffrer (libsodium) en production.
      </p>
    </DashboardShell>
  );
}
