import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { CLIENT_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { PayInvoiceButton } from "./PayInvoiceButton";

const STATUS_VISUAL: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: "Brouillon", color: "var(--color-subtle)", bg: "var(--color-paper)" },
  SENT: { label: "À régler", color: "#D4A857", bg: "#FFF8E1" },
  PAID: { label: "Payée", color: "#13A66A", bg: "#E6F5EC" },
  OVERDUE: { label: "En retard", color: "#9F1239", bg: "#FEE2E2" },
  CANCELLED: { label: "Annulée", color: "var(--color-subtle)", bg: "var(--color-paper)" },
};

export default async function ClientInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string; cancelled?: string }>;
}) {
  const { session } = await requireRole("CLIENT", "ADMIN");
  const sp = await searchParams;

  const invoices = await prisma.invoice.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { name: true } } },
  });

  const totalDue = invoices
    .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
    .reduce((a, i) => a + i.amount, 0);

  return (
    <DashboardShell
      eyebrow="Vos factures"
      title="Tout ce qu'on vous a facturé,"
      italic="payable en ligne."
      nav={CLIENT_NAV}
    >
      {sp.paid && (
        <div
          className="p-4 mb-6"
          style={{
            background: "#E6F5EC",
            border: "1px solid #13A66A",
            borderRadius: 10,
            color: "#0D6E46",
          }}
        >
          Paiement reçu — merci ! Votre facture est marquée comme payée.
        </div>
      )}
      {sp.cancelled && (
        <div
          className="p-4 mb-6"
          style={{
            background: "#FFF8E1",
            border: "1px solid #D4A857",
            borderRadius: 10,
            color: "#8A6914",
          }}
        >
          Paiement annulé. Vous pouvez réessayer quand vous voulez.
        </div>
      )}

      <SectionTitle
        eyebrow={totalDue > 0 ? `Restant à régler : ${formatPrice(totalDue)}` : "Tout est à jour"}
        title="Historique,"
        italic="chronologique."
      />

      {invoices.length === 0 ? (
        <div
          className="p-10 text-center"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="serif-i" style={{ fontSize: 22, color: "var(--color-muted)" }}>
            Aucune facture pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {invoices.map((inv) => {
            const v = STATUS_VISUAL[inv.status] ?? STATUS_VISUAL.DRAFT;
            const payable = inv.status === "SENT" || inv.status === "OVERDUE";
            return (
              <article
                key={inv.id}
                className="p-5 flex items-center justify-between gap-4 flex-wrap"
                style={{
                  background: v.bg,
                  border: `1px solid ${v.color}`,
                  borderRadius: 10,
                }}
              >
                <div>
                  <p style={{ fontWeight: 500, fontSize: 16 }}>
                    #{inv.number}
                    {inv.project && (
                      <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>
                        {" · "}{inv.project.name}
                      </span>
                    )}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                    {formatPrice(inv.amount)}
                    {inv.dueDate && ` · échéance ${inv.dueDate.toLocaleDateString("fr-BE")}`}
                    {inv.paidAt && ` · payée le ${inv.paidAt.toLocaleDateString("fr-BE")}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="mono uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: v.color,
                    }}
                  >
                    {v.label}
                  </span>
                  {payable && <PayInvoiceButton invoiceId={inv.id} />}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
