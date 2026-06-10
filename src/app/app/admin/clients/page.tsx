import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell, SectionTitle } from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";

const PROJECT_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  SIGNED_DEPOSIT:    { label: "Acompte en attente",  color: "#D4A857" },
  ONBOARDING:        { label: "Onboarding",           color: "#7B5BFF" },
  COLLECTING_ASSETS: { label: "Collecte contenus",    color: "#7B5BFF" },
  READY_FOR_DEV:     { label: "Prêt pour le dev",     color: "#13A66A" },
  BRIEFING:          { label: "Briefing",             color: "#94949D" },
  DESIGN:            { label: "Design",               color: "#D4A857" },
  DEV:               { label: "Développement",        color: "var(--color-accent)" },
  CONTENT:           { label: "Contenu & SEO",        color: "#7B5BFF" },
  QA_REVIEW:         { label: "QA en cours",          color: "#D4A857" },
  VALIDATED:         { label: "Validé",               color: "#13A66A" },
  LIVE:              { label: "En ligne 🟢",           color: "#13A66A" },
  CLOSED:            { label: "Clôturé",              color: "#94949D" },
  BLOCKED:           { label: "Bloqué ⚠️",            color: "#9F1239" },
};

export default async function AdminClientsPage() {
  await requireRole("ADMIN");

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: {
      ownedProjects: {
        orderBy: { createdAt: "desc" },
        include: {
          stages: { select: { status: true } },
          invoices: {
            where: { status: { in: ["SENT", "OVERDUE", "PAID"] } },
            select: { amount: true, status: true },
          },
          subscription: { select: { monthlyAmount: true, status: true } },
          dev: { select: { name: true } },
          quote: { select: { number: true, totalOneShot: true } },
        },
      },
    },
  });

  return (
    <DashboardShell
      eyebrow="Clients"
      title={`${clients.length} client${clients.length > 1 ? "s" : ""},`}
      italic="leurs projets."
      nav={ADMIN_NAV}
    >
      {clients.length === 0 ? (
        <div
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 20, color: "var(--color-muted)", fontStyle: "italic", marginBottom: 8 }}>
            Aucun client pour le moment.
          </p>
          <p style={{ fontSize: 13, color: "var(--color-subtle)" }}>
            Les clients sont créés automatiquement lors de la conversion d&apos;un devis signé.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {clients.map((client) => {
            const projects = client.ownedProjects;
            const activeProject = projects.find(
              (p) => p.status !== "LIVE" && p.status !== "CLOSED",
            ) ?? projects[0];

            const unpaidInvoices = projects
              .flatMap((p) => p.invoices)
              .filter((i) => i.status === "SENT" || i.status === "OVERDUE");

            const totalUnpaid = unpaidInvoices.reduce((s, i) => s + i.amount, 0);

            const mrr = projects
              .filter((p) => p.subscription?.status === "ACTIVE")
              .reduce((s, p) => s + (p.subscription?.monthlyAmount ?? 0), 0);

            const doneStages = activeProject?.stages.filter((s) => s.status === "VALIDATED").length ?? 0;
            const totalStages = activeProject?.stages.length ?? 0;
            const pct = totalStages > 0 ? Math.round((doneStages / totalStages) * 100) : 0;

            const statusInfo = activeProject
              ? PROJECT_STATUS_LABEL[activeProject.status] ?? { label: activeProject.status, color: "var(--color-muted)" }
              : null;

            return (
              <div
                key={client.id}
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                {/* Header client */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--color-line)",
                    flexWrap: "wrap",
                    gap: 12,
                    background: "var(--color-bg)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Avatar initiales — lien vers la fiche */}
                    <Link
                      href={`/app/admin/clients/${client.id}`}
                      className="no-underline"
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "var(--color-accent-soft)",
                          border: "1px solid var(--color-accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--color-accent-ink)",
                          flexShrink: 0,
                        }}
                      >
                        {(client.name ?? client.email).slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 15, color: "var(--color-ink)", lineHeight: 1.2 }}>
                          {client.name ?? "—"} <span style={{ fontSize: 12, color: "var(--color-accent)" }}>→</span>
                        </p>
                        <p style={{ fontSize: 12, color: "var(--color-muted)", fontFamily: "var(--font-geist)" }}>
                          {client.email}
                          {client.phone && ` · ${client.phone}`}
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* Pills d'info */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    {mrr > 0 && (
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "var(--color-accent-soft)", border: "1px solid var(--color-accent)", color: "var(--color-accent-ink)", fontFamily: "var(--font-geist)", fontWeight: 500 }}>
                        MRR {formatPrice(mrr)}/mois
                      </span>
                    )}
                    {totalUnpaid > 0 && (
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "#FEE2E2", border: "1px solid #9F1239", color: "#9F1239", fontFamily: "var(--font-geist)", fontWeight: 500 }}>
                        💳 {formatPrice(totalUnpaid)} impayé
                      </span>
                    )}
                    {client.vatNumber && (
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "var(--color-bg)", border: "1px solid var(--color-line)", color: "var(--color-muted)", fontFamily: "var(--font-geist)" }}>
                        TVA {client.vatNumber}
                      </span>
                    )}
                    <p style={{ fontSize: 11, color: "var(--color-subtle)", fontFamily: "var(--font-geist)" }}>
                      Client depuis {client.createdAt.toLocaleDateString("fr-BE")}
                    </p>
                  </div>
                </div>

                {/* Projets */}
                {projects.length === 0 ? (
                  <p style={{ padding: "14px 20px", fontSize: 13, color: "var(--color-subtle)", fontStyle: "italic" }}>
                    Aucun projet lié.
                  </p>
                ) : (
                  <div>
                    {projects.map((p, i) => {
                      const ps = PROJECT_STATUS_LABEL[p.status] ?? { label: p.status, color: "var(--color-muted)" };
                      const done = p.stages.filter((s) => s.status === "VALIDATED").length;
                      const total = p.stages.length;
                      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

                      return (
                        <Link
                          key={p.id}
                          href={`/app/admin/projects/${p.id}`}
                          className="no-underline"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            padding: "12px 20px",
                            borderTop: i > 0 ? "1px solid var(--color-line)" : "none",
                            color: "var(--color-ink)",
                            flexWrap: "wrap",
                          }}
                        >
                          {/* Nom + statut */}
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <span
                                style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: "50%",
                                  background: ps.color,
                                  flexShrink: 0,
                                }}
                              />
                              <p style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</p>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: ps.color, fontFamily: "var(--font-geist)", fontWeight: 500 }}>
                                {ps.label}
                              </span>
                              {p.dev && (
                                <span style={{ fontSize: 11, color: "var(--color-subtle)" }}>
                                  Dev : {p.dev.name}
                                </span>
                              )}
                              {p.quote && (
                                <span style={{ fontSize: 11, color: "var(--color-subtle)", fontFamily: "var(--font-geist)" }}>
                                  {p.quote.number} · {formatPrice(p.quote.totalOneShot)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Barre de progression */}
                          <div style={{ minWidth: 140 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 11, color: "var(--color-muted)" }}>{done}/{total} étapes</span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-accent)" }}>{progress}%</span>
                            </div>
                            <div style={{ height: 4, background: "var(--color-line)", borderRadius: 999, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${progress}%`, background: p.status === "LIVE" ? "#13A66A" : "var(--color-accent)", borderRadius: 999 }} />
                            </div>
                          </div>

                          <span style={{ fontSize: 12, color: "var(--color-accent)", flexShrink: 0 }}>Voir →</span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Adresse si disponible */}
                {(client.address || client.city) && (
                  <div
                    style={{
                      padding: "10px 20px",
                      borderTop: "1px solid var(--color-line)",
                      fontSize: 12,
                      color: "var(--color-subtle)",
                      background: "var(--color-bg)",
                    }}
                  >
                    📍 {[client.address, client.postalCode, client.city, client.country].filter(Boolean).join(" · ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
