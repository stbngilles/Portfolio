import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  StatCard,
  PlaceholderPanel,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { getAgencyMRR } from "@/lib/commissions";
import { assetsProgress } from "@/lib/assets";
import Link from "next/link";

export default async function AdminHome() {
  const { session, role } = await requireRole("ADMIN");

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const [
    userCount,
    projectCount,
    openTickets,
    activeSubs,
    signedQuotes,
    pendingCommissions,
    mrrCents,
    pendingReleases,
    revenueAgg,
    devCostsPaid,
    devCostsPending,
    stuckOnboarding,
    stuckAssets,
    pendingQA,
    openBlockers,
    quotesToReview,
    pendingKickoff,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.ticket.count({ where: { status: "OPEN" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.quote.count({ where: { status: "SIGNED" } }),
    prisma.commission.aggregate({
      where: { status: "PENDING" },
      _sum: { amount: true },
    }),
    getAgencyMRR(),
    prisma.releaseRequest.count({ where: { status: "PENDING" } }),
    // Revenu = somme des one-shot de tous les devis signés
    prisma.quote.aggregate({
      where: { status: "SIGNED" },
      _sum: { totalOneShot: true },
    }),
    // Coûts dev déjà payés
    prisma.project.aggregate({
      where: { devPaymentStatus: "PAID" },
      _sum: { devPaymentAmount: true },
    }),
    // Coûts dev à payer
    prisma.project.aggregate({
      where: { devPaymentStatus: "PENDING", devPaymentAmount: { not: null } },
      _sum: { devPaymentAmount: true },
    }),

    // === Goulots d'étranglement ===
    // Onboarding bloqué depuis > 7 jours
    prisma.project.findMany({
      where: {
        status: "ONBOARDING",
        onboardingDone: false,
        updatedAt: { lt: sevenDaysAgo },
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        client: { select: { name: true, email: true } },
      },
      take: 10,
    }),
    // Onboarding ok mais assets pas complets depuis > 7 jours
    prisma.project.findMany({
      where: {
        onboardingDone: true,
        kickoffDone: true,
        status: { in: ["ONBOARDING", "COLLECTING_ASSETS", "BRIEFING"] },
        updatedAt: { lt: sevenDaysAgo },
      },
      select: {
        id: true,
        name: true,
        assetsState: true,
        updatedAt: true,
        client: { select: { name: true, email: true } },
      },
      take: 10,
    }),
    // Livraisons en attente de validation admin > 3 jours
    prisma.deliverySubmission.findMany({
      where: { status: "PENDING", createdAt: { lt: threeDaysAgo } },
      select: {
        id: true,
        createdAt: true,
        project: { select: { id: true, name: true } },
        dev: { select: { name: true, email: true } },
      },
      take: 10,
    }),
    // Blocages ouverts (toujours)
    prisma.blockerReport.findMany({
      where: { status: "OPEN" },
      select: {
        id: true,
        createdAt: true,
        type: true,
        project: { select: { id: true, name: true } },
        dev: { select: { name: true, email: true } },
      },
      take: 10,
    }),
    // Devis sur-mesure en attente de revue
    prisma.quote.count({
      where: { needsAdminReview: true, adminReviewedAt: null },
    }),
    // Kick-off à faire
    prisma.project.count({
      where: { kickoffDone: false, status: { not: "CLOSED" } },
    }),
  ]);

  const mrr = formatPrice(mrrCents);
  const arr = formatPrice(mrrCents * 12);
  const commissionsDue = formatPrice(pendingCommissions._sum.amount ?? 0);

  const totalRevenue = revenueAgg._sum.totalOneShot ?? 0;
  const totalDevPaid = devCostsPaid._sum.devPaymentAmount ?? 0;
  const totalDevPending = devCostsPending._sum.devPaymentAmount ?? 0;
  const totalCommissions = pendingCommissions._sum.amount ?? 0;
  const grossMargin =
    totalRevenue - totalDevPaid - totalDevPending - totalCommissions;
  const grossMarginPct =
    totalRevenue > 0 ? Math.round((grossMargin / totalRevenue) * 100) : 0;

  return (
    <DashboardShell
      eyebrow="Cockpit administrateur"
      title="Tout le studio,"
      italic="d'un coup d'œil."
      user={{ ...session.user, role }}
      nav={ADMIN_NAV}
    >
      {/* === Bandeau alertes goulots === */}
      <BottleneckAlerts
        pendingReleases={pendingReleases}
        quotesToReview={quotesToReview}
        pendingKickoff={pendingKickoff}
        stuckOnboarding={stuckOnboarding}
        stuckAssets={stuckAssets}
        pendingQA={pendingQA}
        openBlockers={openBlockers}
      />

      <SectionTitle eyebrow="Récurrent & business" title="Le cœur du business," italic="en direct." />
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="MRR" value={mrr} hint="récurrent mensuel actif" accent />
        <StatCard label="ARR projeté" value={arr} hint="MRR × 12" />
        <StatCard label="Abonnements actifs" value={String(activeSubs)} hint="maintenance + pub" />
        <StatCard label="Deals signés" value={String(signedQuotes)} hint="cumulé" />
      </section>

      <SectionTitle eyebrow="Finances" title="Ce qu'on encaisse," italic="ce qu'on dépense." />
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Revenu cumulé"
          value={formatPrice(totalRevenue)}
          hint="one-shot des devis signés"
        />
        <StatCard
          label="Coûts dev versés"
          value={formatPrice(totalDevPaid)}
          hint="aux freelances"
        />
        <StatCard
          label="À verser (dev + comm.)"
          value={formatPrice(totalDevPending + totalCommissions)}
          hint={`${formatPrice(totalDevPending)} devs · ${formatPrice(totalCommissions)} commerciaux`}
        />
        <StatCard
          label="Marge brute"
          value={formatPrice(grossMargin)}
          hint={totalRevenue > 0 ? `${grossMarginPct} % du revenu` : "—"}
          accent
        />
      </section>

      <SectionTitle eyebrow="Activité" title="L'état," italic="autour." />
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        <StatCard label="Projets" value={String(projectCount)} hint="tous statuts" />
        <StatCard label="Utilisateurs" value={String(userCount)} hint="tous rôles" />
        <StatCard label="Tickets ouverts" value={String(openTickets)} hint="à trier" />
        <StatCard label="Commissions à verser" value={commissionsDue} hint="aux commerciaux" />
      </section>

      <SectionTitle eyebrow="Modules à construire" title="Le reste," italic="par ordre d'impact." />
      <div className="grid md:grid-cols-2 gap-4">
        <PlaceholderPanel
          title="Pipeline des projets"
          description="Kanban briefing → design → dev → contenu → live. Attribution aux freelances, suivi des deadlines, alertes de retard."
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Tickets ouverts"
          description={`${openTickets} ticket(s) à trier. File d'entrée centralisée toutes sources : client, équipe, fondateur.`}
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Commissions à régler"
          description="Calcul auto 20 % one-shot + 15 % récurrent. Récap mensuel par commercial avec bouton de paiement."
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Facturation & relances"
          description="Factures émises, en attente, en retard. Relances automatiques par email aux échéances."
          phase="Phase 2"
        />
      </div>
    </DashboardShell>
  );
}

type ProjectAlert = {
  id: string;
  name: string;
  updatedAt: Date;
  assetsState?: string | null;
  client: { name: string | null; email: string };
};
type QAAlert = {
  id: string;
  createdAt: Date;
  project: { id: string; name: string };
  dev: { name: string | null; email: string };
};
type BlockerAlert = {
  id: string;
  createdAt: Date;
  type: string;
  project: { id: string; name: string };
  dev: { name: string | null; email: string };
};

function BottleneckAlerts({
  pendingReleases,
  quotesToReview,
  pendingKickoff,
  stuckOnboarding,
  stuckAssets,
  pendingQA,
  openBlockers,
}: {
  pendingReleases: number;
  quotesToReview: number;
  pendingKickoff: number;
  stuckOnboarding: ProjectAlert[];
  stuckAssets: ProjectAlert[];
  pendingQA: QAAlert[];
  openBlockers: BlockerAlert[];
}) {
  const alerts: Array<{
    href: string;
    tone: "danger" | "warn" | "info";
    title: string;
    detail: string;
  }> = [];

  if (openBlockers.length > 0)
    alerts.push({
      href: "/app/admin/blockers",
      tone: "danger",
      title: `${openBlockers.length} blocage${openBlockers.length > 1 ? "s" : ""} ouvert${openBlockers.length > 1 ? "s" : ""}`,
      detail:
        openBlockers
          .slice(0, 3)
          .map((b) => b.project.name)
          .join(" · ") + (openBlockers.length > 3 ? " · …" : ""),
    });
  if (pendingQA.length > 0)
    alerts.push({
      href: "/app/admin/qa",
      tone: "warn",
      title: `${pendingQA.length} livraison${pendingQA.length > 1 ? "s" : ""} à valider > 3 jours`,
      detail: pendingQA.slice(0, 3).map((q) => q.project.name).join(" · "),
    });
  if (pendingReleases > 0)
    alerts.push({
      href: "/app/admin/release-requests",
      tone: "warn",
      title: `${pendingReleases} demande${pendingReleases > 1 ? "s" : ""} de libération`,
      detail: "Un dev veut se retirer d'un projet.",
    });
  if (quotesToReview > 0)
    alerts.push({
      href: "/app/admin/quotes-review",
      tone: "warn",
      title: `${quotesToReview} devis sur-mesure à valider`,
      detail: "Un commercial attend votre OK avant envoi client.",
    });
  if (pendingKickoff > 0)
    alerts.push({
      href: "/app/admin/kickoff",
      tone: "info",
      title: `${pendingKickoff} kick-off${pendingKickoff > 1 ? "s" : ""} à planifier`,
      detail: "Avant que le brief parte au pool dev.",
    });
  if (stuckOnboarding.length > 0)
    alerts.push({
      href: "/app/admin/projects",
      tone: "info",
      title: `${stuckOnboarding.length} client${stuckOnboarding.length > 1 ? "s" : ""} bloqué${stuckOnboarding.length > 1 ? "s" : ""} sur l'onboarding > 7 j`,
      detail: stuckOnboarding.slice(0, 3).map((p) => p.client.name ?? p.client.email).join(" · "),
    });
  if (stuckAssets.length > 0) {
    const missing = stuckAssets
      .map((p) => `${p.name} (${assetsProgress(p.assetsState).done}/${assetsProgress(p.assetsState).total})`)
      .slice(0, 3)
      .join(" · ");
    alerts.push({
      href: "/app/admin/projects",
      tone: "info",
      title: `${stuckAssets.length} projet${stuckAssets.length > 1 ? "s" : ""} en attente de contenu > 7 j`,
      detail: missing,
    });
  }

  if (alerts.length === 0) return null;

  const TONE_STYLE = {
    danger: { bg: "#FEE2E2", border: "#9F1239", color: "#7B1024" },
    warn: { bg: "#FFF8E1", border: "#D4A857", color: "#8A6914" },
    info: { bg: "var(--color-accent-soft)", border: "var(--color-accent)", color: "var(--color-accent-ink)" },
  } as const;

  return (
    <section className="mb-10">
      <p
        className="mono uppercase mb-3"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
      >
        · Goulots d'étranglement
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {alerts.map((a, i) => {
          const s = TONE_STYLE[a.tone];
          return (
            <Link
              key={i}
              href={a.href}
              className="block p-4 no-underline"
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 10,
                color: s.color,
              }}
            >
              <p style={{ fontWeight: 500, marginBottom: 4 }}>{a.title} →</p>
              <p className="text-sm" style={{ opacity: 0.85 }}>{a.detail}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
