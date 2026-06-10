import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
  StatCard,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { getAgencyMRR } from "@/lib/commissions";
import { approveDevPayment, markDevPaymentPaid } from "../projects/dev-payment-actions";
import { markCommissionPaid } from "../commissions/actions";
import { markInvoicePaid, relanceInvoice } from "./actions";

export default async function FinancesConsolePage() {
  await requireRole("ADMIN");

  const [
    pendingDevPayments,
    approvedDevPayments,
    pendingCommissions,
    revenue,
    paidDev,
    mrrCents,
    unpaidInvoices,
  ] = await Promise.all([
    prisma.project.findMany({
      where: { devPaymentStatus: "PENDING", devPaymentAmount: { not: null } },
      include: { dev: { select: { name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.project.findMany({
      where: { devPaymentStatus: "APPROVED", devPaymentAmount: { not: null } },
      include: { dev: { select: { name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.commission.findMany({
      where: { status: "PENDING" },
      include: { commercial: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.quote.aggregate({
      where: { status: "SIGNED" },
      _sum: { totalOneShot: true },
    }),
    prisma.project.aggregate({
      where: { devPaymentStatus: "PAID" },
      _sum: { devPaymentAmount: true },
    }),
    getAgencyMRR(),
    prisma.invoice.findMany({
      where: { status: { in: ["SENT", "OVERDUE"] } },
      orderBy: { dueDate: "asc" },
      include: { project: { select: { name: true } } },
    }),
  ]);

  const totalRevenue = revenue._sum.totalOneShot ?? 0;
  const totalPaidDev = paidDev._sum.devPaymentAmount ?? 0;
  const totalPendingDev = pendingDevPayments.reduce(
    (acc, p) => acc + (p.devPaymentAmount ?? 0),
    0,
  );
  const totalApprovedDev = approvedDevPayments.reduce(
    (acc, p) => acc + (p.devPaymentAmount ?? 0),
    0,
  );
  const totalCommissionsDue = pendingCommissions.reduce((acc, c) => acc + c.amount, 0);
  const totalUnpaid = unpaidInvoices.reduce((acc, i) => acc + i.amount, 0);

  const margin = totalRevenue - totalPaidDev - totalApprovedDev - totalPendingDev - totalCommissionsDue;
  const marginPct = totalRevenue > 0 ? Math.round((margin / totalRevenue) * 100) : 0;

  return (
    <DashboardShell
      eyebrow="Console financière"
      title="Tout l'argent,"
      italic="d'un seul écran."
      nav={ADMIN_NAV}
    >
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="MRR" value={formatPrice(mrrCents)} hint="récurrent" accent />
        <StatCard label="Revenu cumulé" value={formatPrice(totalRevenue)} hint="one-shot signés" />
        <StatCard label="Marge brute" value={formatPrice(margin)} hint={`${marginPct} % du revenu`} />
        <StatCard
          label="À verser (total)"
          value={formatPrice(totalPendingDev + totalApprovedDev + totalCommissionsDue)}
          hint="devs + commerciaux"
        />
      </section>

      <SectionTitle
        eyebrow={`${pendingDevPayments.length} à approuver`}
        title="Paiements freelance,"
        italic="en attente d'approbation."
      />

      {pendingDevPayments.length === 0 ? (
        <EmptyBlock text="Aucun paiement à approuver." />
      ) : (
        <div className="grid gap-3 mb-12">
          {pendingDevPayments.map((p) => (
            <article
              key={p.id}
              className="flex items-center justify-between gap-4 p-5 flex-wrap"
              style={{
                background: "#FFF8E1",
                border: "1px solid #D4A857",
                borderRadius: 10,
              }}
            >
              <div>
                <Link
                  href={`/app/admin/projects/${p.id}`}
                  className="display no-underline"
                  style={{ fontSize: 18, color: "var(--color-ink)" }}
                >
                  {p.name}
                </Link>
                <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                  Dev : {p.dev?.name ?? p.dev?.email ?? "—"} ·
                  Montant : <strong>{formatPrice(p.devPaymentAmount ?? 0)}</strong>
                </p>
              </div>
              <form action={approveDevPayment}>
                <input type="hidden" name="projectId" value={p.id} />
                <button type="submit" className="btn btn-primary">Approuver →</button>
              </form>
            </article>
          ))}
        </div>
      )}

      <SectionTitle
        eyebrow={`${approvedDevPayments.length} à régler`}
        title="Paiements approuvés,"
        italic="à virer."
      />

      {approvedDevPayments.length === 0 ? (
        <EmptyBlock text="Rien à virer aux devs." />
      ) : (
        <div className="grid gap-3 mb-12">
          {approvedDevPayments.map((p) => (
            <article
              key={p.id}
              className="flex items-center justify-between gap-4 p-5 flex-wrap"
              style={{
                background: "var(--color-accent-soft)",
                border: "1px solid var(--color-accent)",
                borderRadius: 10,
              }}
            >
              <div>
                <Link
                  href={`/app/admin/projects/${p.id}`}
                  className="display no-underline"
                  style={{ fontSize: 18, color: "var(--color-ink)" }}
                >
                  {p.name}
                </Link>
                <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                  Dev : {p.dev?.name ?? p.dev?.email ?? "—"} ·
                  Montant : <strong>{formatPrice(p.devPaymentAmount ?? 0)}</strong>
                </p>
              </div>
              <form action={markDevPaymentPaid}>
                <input type="hidden" name="projectId" value={p.id} />
                <button type="submit" className="btn btn-accent">Marquer viré ✓</button>
              </form>
            </article>
          ))}
        </div>
      )}

      <SectionTitle
        eyebrow={`${pendingCommissions.length} en attente`}
        title="Commissions commerciales,"
        italic="à débloquer."
      />

      {pendingCommissions.length === 0 ? (
        <EmptyBlock text="Aucune commission en attente." />
      ) : (
        <div className="grid gap-3 mb-12">
          {pendingCommissions.map((c) => (
            <article
              key={c.id}
              className="flex items-center justify-between gap-4 p-5 flex-wrap"
              style={{
                background: "var(--color-paper)",
                border: "1px solid var(--color-line)",
                borderRadius: 10,
              }}
            >
              <div>
                <p style={{ fontWeight: 500 }}>
                  {c.commercial.name ?? c.commercial.email}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                  {c.type} · base {formatPrice(c.baseAmount)} ×{" "}
                  {(c.rate * 100).toFixed(0)} % = <strong>{formatPrice(c.amount)}</strong>
                </p>
              </div>
              <form action={markCommissionPaid}>
                <input type="hidden" name="commissionId" value={c.id} />
                <button type="submit" className="btn btn-primary">Marquer payée ✓</button>
              </form>
            </article>
          ))}
        </div>
      )}

      <SectionTitle
        eyebrow={`${unpaidInvoices.length} client(s)`}
        title="Factures en attente,"
        italic="à relancer."
      />

      {unpaidInvoices.length === 0 ? (
        <EmptyBlock text="Tout est encaissé." />
      ) : (
        <div className="grid gap-3">
          {unpaidInvoices.map((i) => {
            const overdue = i.dueDate && i.dueDate < new Date();
            return (
              <article
                key={i.id}
                className="flex items-center justify-between gap-4 p-5 flex-wrap"
                style={{
                  background: overdue ? "#FEE2E2" : "var(--color-paper)",
                  border: `1px solid ${overdue ? "#9F1239" : "var(--color-line)"}`,
                  borderRadius: 10,
                }}
              >
                <div>
                  <p style={{ fontWeight: 500 }}>
                    #{i.number}{" "}
                    {i.project && (
                      <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>
                        · {i.project.name}
                      </span>
                    )}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                    {formatPrice(i.amount)}
                    {i.dueDate && ` · échéance ${i.dueDate.toLocaleDateString("fr-BE")}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="mono uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: overdue ? "#9F1239" : "var(--color-subtle)",
                    }}
                  >
                    {overdue ? "En retard" : i.status}
                  </span>
                  <form action={relanceInvoice}>
                    <input type="hidden" name="invoiceId" value={i.id} />
                    <button type="submit" className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>
                      Relancer
                    </button>
                  </form>
                  <form action={markInvoicePaid}>
                    <input type="hidden" name="invoiceId" value={i.id} />
                    <button type="submit" className="btn btn-accent" style={{ padding: "6px 12px", fontSize: 12 }}>
                      Marquer payée ✓
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
          <p className="text-sm mt-2" style={{ color: "var(--color-muted)" }}>
            Total impayé : <strong>{formatPrice(totalUnpaid)}</strong>
          </p>
        </div>
      )}
    </DashboardShell>
  );
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div
      className="p-8 text-center mb-12"
      style={{
        background: "var(--color-paper)",
        border: "1px dashed var(--color-line)",
        borderRadius: 12,
      }}
    >
      <p className="serif-i" style={{ fontSize: 18, color: "var(--color-muted)" }}>
        {text}
      </p>
    </div>
  );
}
