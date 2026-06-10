import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/platform/DashboardShell";
import { COMPTABLE_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { markDevPaymentPaid } from "../admin/projects/dev-payment-actions";
import { markCommissionPaid } from "../admin/commissions/actions";

export default async function ComptablePage() {
  await requireRole("ADMIN", "COMPTABLE");

  const [devPending, devApproved, devPaid, commPending, commPaid] =
    await Promise.all([
      prisma.project.findMany({
        where: { devPaymentStatus: "PENDING", devPaymentAmount: { not: null, gt: 0 } },
        include: { dev: { select: { name: true, email: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.project.findMany({
        where: { devPaymentStatus: "APPROVED", devPaymentAmount: { not: null, gt: 0 } },
        include: { dev: { select: { name: true, email: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.project.findMany({
        where: { devPaymentStatus: "PAID", devPaymentAmount: { not: null, gt: 0 } },
        include: { dev: { select: { name: true, email: true } } },
        orderBy: { devPaymentPaidAt: "desc" },
        take: 20,
      }),
      prisma.commission.findMany({
        where: { status: "PENDING" },
        include: { commercial: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.commission.findMany({
        where: { status: "PAID" },
        include: { commercial: { select: { name: true, email: true } } },
        orderBy: { paidAt: "desc" },
        take: 20,
      }),
    ]);

  const totalToPay =
    devApproved.reduce((s, p) => s + (p.devPaymentAmount ?? 0), 0) +
    commPending.reduce((s, c) => s + c.amount, 0);

  const totalPending =
    devPending.reduce((s, p) => s + (p.devPaymentAmount ?? 0), 0);

  return (
    <DashboardShell
      eyebrow="Espace comptable"
      title="Ce qui est dû,"
      italic="et à qui."
      nav={COMPTABLE_NAV}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        <KpiCard
          label="À virer maintenant"
          value={formatPrice(totalToPay)}
          color="#D4A857"
          hint={`${devApproved.length + commPending.length} bénéficiaires`}
        />
        <KpiCard
          label="En attente d'approbation"
          value={formatPrice(totalPending)}
          color="var(--color-subtle)"
          hint={`${devPending.length} paiements devs`}
        />
        <KpiCard
          label="Déjà versé"
          value={formatPrice(
            devPaid.reduce((s, p) => s + (p.devPaymentAmount ?? 0), 0) +
              commPaid.reduce((s, c) => s + c.amount, 0),
          )}
          color="#13A66A"
          hint="cumul"
        />
      </div>

      {/* SECTION : À VIRER (approuvés) */}
      <TableSection
        title="À virer maintenant"
        count={devApproved.length + commPending.length}
        empty="Rien à virer — vous êtes à jour."
      >
        {devApproved.map((p) => (
          <Row
            key={`dev-${p.id}`}
            who={p.dev?.name ?? p.dev?.email ?? "Dev inconnu"}
            type="Développeur"
            label={p.name}
            amount={p.devPaymentAmount ?? 0}
            status="À virer"
            statusColor="#D4A857"
            action={
              <form action={markDevPaymentPaid}>
                <input type="hidden" name="projectId" value={p.id} />
                <button
                  type="submit"
                  style={{
                    fontSize: 12,
                    padding: "6px 14px",
                    background: "#E6F5EC",
                    border: "1px solid #13A66A",
                    color: "#0D6E46",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  Virement fait ✓
                </button>
              </form>
            }
          />
        ))}
        {commPending.map((c) => (
          <Row
            key={`comm-${c.id}`}
            who={c.commercial.name ?? c.commercial.email}
            type="Commercial"
            label={`Commission ${c.type}`}
            amount={c.amount}
            status="À verser"
            statusColor="#D4A857"
            action={
              <form action={markCommissionPaid}>
                <input type="hidden" name="commissionId" value={c.id} />
                <button
                  type="submit"
                  style={{
                    fontSize: 12,
                    padding: "6px 14px",
                    background: "#E6F5EC",
                    border: "1px solid #13A66A",
                    color: "#0D6E46",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  Versé ✓
                </button>
              </form>
            }
          />
        ))}
      </TableSection>

      {/* SECTION : EN ATTENTE ADMIN */}
      <TableSection
        title="En attente d'approbation (admin)"
        count={devPending.length}
        empty="Aucun paiement en attente d'approbation."
        muted
      >
        {devPending.map((p) => (
          <Row
            key={`pend-${p.id}`}
            who={p.dev?.name ?? p.dev?.email ?? "Dev inconnu"}
            type="Développeur"
            label={p.name}
            amount={p.devPaymentAmount ?? 0}
            status="Approbation requise"
            statusColor="var(--color-subtle)"
          />
        ))}
      </TableSection>

      {/* SECTION : HISTORIQUE */}
      <TableSection
        title="Historique des paiements"
        count={devPaid.length + commPaid.length}
        empty="Aucun paiement historique."
        muted
      >
        {devPaid.map((p) => (
          <Row
            key={`paid-dev-${p.id}`}
            who={p.dev?.name ?? p.dev?.email ?? "Dev inconnu"}
            type="Développeur"
            label={p.name}
            amount={p.devPaymentAmount ?? 0}
            status={`Versé le ${p.devPaymentPaidAt?.toLocaleDateString("fr-BE") ?? "—"}`}
            statusColor="#13A66A"
          />
        ))}
        {commPaid.map((c) => (
          <Row
            key={`paid-comm-${c.id}`}
            who={c.commercial.name ?? c.commercial.email}
            type="Commercial"
            label={`Commission ${c.type}`}
            amount={c.amount}
            status={`Versée le ${c.paidAt?.toLocaleDateString("fr-BE") ?? "—"}`}
            statusColor="#13A66A"
          />
        ))}
      </TableSection>
    </DashboardShell>
  );
}

/* ------------------------------------------------------------------ */
/* Composants                                                           */
/* ------------------------------------------------------------------ */

function KpiCard({
  label,
  value,
  color,
  hint,
}: {
  label: string;
  value: string;
  color: string;
  hint?: string;
}) {
  return (
    <div
      style={{
        background: "var(--color-paper)",
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
          color: "var(--color-muted)",
          fontFamily: "var(--font-geist)",
          marginBottom: 8,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color,
          lineHeight: 1,
          marginBottom: 4,
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

function TableSection({
  title,
  count,
  empty,
  muted,
  children,
}: {
  title: string;
  count: number;
  empty: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: muted ? "var(--color-muted)" : "var(--color-ink)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        {count > 0 && (
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-geist)",
              background: muted ? "var(--color-bg)" : "#FFF8E1",
              border: `1px solid ${muted ? "var(--color-line)" : "#D4A857"}`,
              color: muted ? "var(--color-subtle)" : "#8A6914",
              padding: "2px 8px",
              borderRadius: 999,
            }}
          >
            {count}
          </span>
        )}
      </div>

      {count === 0 ? (
        <p style={{ fontSize: 14, color: "var(--color-subtle)", paddingLeft: 4 }}>
          {empty}
        </p>
      ) : (
        <div>
          {/* Header colonnes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 140px 120px auto",
              gap: 12,
              padding: "6px 16px",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-subtle)",
              fontFamily: "var(--font-geist)",
            }}
          >
            <span>Bénéficiaire</span>
            <span>Rôle</span>
            <span>Projet / motif</span>
            <span style={{ textAlign: "right" }}>Montant</span>
            <span>Statut / action</span>
          </div>
          <div
            style={{
              border: "1px solid var(--color-line)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </section>
  );
}

function Row({
  who,
  type,
  label,
  amount,
  status,
  statusColor,
  action,
}: {
  who: string;
  type: string;
  label: string;
  amount: number;
  status: string;
  statusColor: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 120px 140px 120px auto",
        gap: 12,
        alignItems: "center",
        padding: "14px 16px",
        borderBottom: "1px solid var(--color-line)",
        background: "var(--color-paper)",
        fontSize: 14,
      }}
    >
      <span style={{ fontWeight: 500, color: "var(--color-ink)" }}>{who}</span>
      <span
        style={{
          fontSize: 11,
          fontFamily: "var(--font-geist)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--color-muted)",
        }}
      >
        {type}
      </span>
      <span
        style={{
          fontSize: 13,
          color: "var(--color-muted)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontWeight: 600,
          fontSize: 15,
          color: "var(--color-ink)",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatPrice(amount)}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 180 }}>
        <span
          style={{
            fontSize: 12,
            color: statusColor,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {status}
        </span>
        {action}
      </div>
    </div>
  );
}
