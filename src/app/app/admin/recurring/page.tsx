import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  StatCard,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";

const STATUS_VISUAL: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Actif", color: "#13A66A" },
  PAUSED: { label: "En pause", color: "#D4A857" },
  CANCELLED: { label: "Résilié", color: "#9F1239" },
};

export default async function AdminRecurringPage() {
  const { session, role } = await requireRole("ADMIN");

  const subs = await prisma.subscription.findMany({
    orderBy: [{ status: "asc" }, { startedAt: "desc" }],
    include: {
      project: {
        select: {
          id: true,
          name: true,
          client: { select: { name: true, email: true } },
          commercial: { select: { name: true, email: true } },
        },
      },
    },
  });

  // KPI : MRR actif, churn (résiliés ce mois), attach rate = subs actives / projets livrés
  const active = subs.filter((s) => s.status === "ACTIVE");
  const mrr = active.reduce((acc, s) => acc + s.monthlyAmount, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const churnedThisMonth = subs.filter(
    (s) =>
      s.status === "CANCELLED" &&
      s.cancelledAt &&
      s.cancelledAt >= startOfMonth,
  ).length;

  const liveProjects = await prisma.project.count({
    where: { status: { in: ["LIVE", "CLOSED"] } },
  });
  const attachRate =
    liveProjects > 0
      ? Math.round((active.length / liveProjects) * 100)
      : null;

  return (
    <DashboardShell
      eyebrow="Récurrent"
      title="Le MRR,"
      italic="suivi à la maille fine."
      user={{ ...session.user, role }}
      nav={ADMIN_NAV}
    >
      <SectionTitle
        eyebrow="Indicateurs clés"
        title="Le cœur du business,"
        italic="en direct."
      />
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <StatCard
          label="MRR actif"
          value={formatPrice(mrr)}
          hint={`${active.length} abonnement${active.length > 1 ? "s" : ""}`}
          accent
        />
        <StatCard
          label="Annualisé (ARR)"
          value={formatPrice(mrr * 12)}
          hint="MRR × 12"
        />
        <StatCard
          label="Taux d'attache"
          value={attachRate !== null ? `${attachRate} %` : "—"}
          hint="abos actifs / projets livrés"
        />
        <StatCard
          label="Churn ce mois"
          value={String(churnedThisMonth)}
          hint="résiliations en cours"
        />
      </section>

      <SectionTitle
        eyebrow="Abonnements"
        title="Tous les contrats,"
        italic="ouverts comme fermés."
      />

      {subs.length === 0 ? (
        <div
          className="p-10 text-center"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p
            className="serif-i"
            style={{ fontSize: 20, color: "var(--color-muted)" }}
          >
            Aucun abonnement enregistré.
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-subtle)" }}
          >
            Ils apparaîtront automatiquement à la signature d'un devis avec
            ligne récurrente.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {subs.map((s) => {
            const v = STATUS_VISUAL[s.status] ?? STATUS_VISUAL.ACTIVE;
            return (
              <Link
                key={s.id}
                href={`/app/admin/projects/${s.project.id}`}
                className="block no-underline transition"
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  color: "var(--color-ink)",
                }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: v.color }}
                      />
                      <span
                        className="mono uppercase"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          color: "var(--color-subtle)",
                        }}
                      >
                        {v.label} · depuis le{" "}
                        {s.startedAt.toLocaleDateString("fr-BE")}
                      </span>
                    </div>
                    <p
                      className="display"
                      style={{
                        fontSize: 20,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                      }}
                    >
                      {s.project.client.name ?? s.project.client.email}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {s.plan}
                      {s.project.commercial?.name &&
                        ` · vendu par ${s.project.commercial.name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="display"
                      style={{
                        fontSize: 22,
                        color: "var(--color-accent)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatPrice(s.monthlyAmount)}
                    </p>
                    <p
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "var(--color-subtle)",
                        letterSpacing: "0.14em",
                      }}
                    >
                      / MOIS
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
