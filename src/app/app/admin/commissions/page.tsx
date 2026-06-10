import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  StatCard,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { formatPrice, COMMISSION_RATES } from "@/lib/pricing";
import { toggleCommissionStatus } from "./actions";

const TYPE_LABEL: Record<string, string> = {
  ONE_SHOT: "One-shot",
  RECURRING: "Récurrent",
  LAUNCH_PACK: "Pack lancement",
};

export default async function AdminCommissionsPage() {
  const { session, role } = await requireRole("ADMIN");

  // Toutes les commissions enregistrées
  const commissions = await prisma.commission.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { commercial: { select: { id: true, name: true, email: true } } },
  });

  // Récap par commercial
  const byCommercial = new Map<
    string,
    {
      id: string;
      name: string;
      email: string;
      pending: number;
      paid: number;
      mrrBase: number;
    }
  >();
  for (const c of commissions) {
    const key = c.commercial.id;
    const entry = byCommercial.get(key) ?? {
      id: c.commercial.id,
      name: c.commercial.name ?? c.commercial.email,
      email: c.commercial.email,
      pending: 0,
      paid: 0,
      mrrBase: 0,
    };
    if (c.status === "PAID") entry.paid += c.amount;
    else entry.pending += c.amount;
    byCommercial.set(key, entry);
  }

  // MRR récurrent par commercial = somme des abos actifs des projets qu'il a vendus
  const activeSubs = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    select: { monthlyAmount: true, project: { select: { commercialId: true } } },
  });
  for (const s of activeSubs) {
    if (!s.project.commercialId) continue;
    const e = byCommercial.get(s.project.commercialId);
    if (e) e.mrrBase += s.monthlyAmount;
  }

  // Totaux agence
  const totalPending = commissions
    .filter((c) => c.status === "PENDING")
    .reduce((acc, c) => acc + c.amount, 0);
  const totalPaid = commissions
    .filter((c) => c.status === "PAID")
    .reduce((acc, c) => acc + c.amount, 0);
  const totalMRRBase = activeSubs.reduce((acc, s) => acc + s.monthlyAmount, 0);
  const totalMRRCommission = Math.round(
    totalMRRBase * COMMISSION_RATES.RECURRING,
  );

  return (
    <DashboardShell
      eyebrow="Commissions"
      title="Ce qu'on doit,"
      italic="à chacun."
      user={{ ...session.user, role }}
      nav={ADMIN_NAV}
    >
      <SectionTitle
        eyebrow="Vue agence"
        title="Le total,"
        italic="tous commerciaux confondus."
      />
      <section className="grid sm:grid-cols-3 gap-4 mb-14">
        <StatCard
          label="À verser"
          value={formatPrice(totalPending)}
          hint="commissions en attente"
          accent
        />
        <StatCard
          label="Déjà versé"
          value={formatPrice(totalPaid)}
          hint="cumul historique"
        />
        <StatCard
          label="Récurrent / mois"
          value={formatPrice(totalMRRCommission)}
          hint={`15 % de ${formatPrice(totalMRRBase)} MRR`}
        />
      </section>

      <SectionTitle
        eyebrow="Par commercial"
        title="Qui gagne,"
        italic="combien."
      />
      {byCommercial.size === 0 ? (
        <EmptyState message="Aucune commission enregistrée." />
      ) : (
        <div className="grid gap-3 mb-14">
          {[...byCommercial.values()]
            .sort((a, b) => b.pending + b.mrrBase * 0.15 - (a.pending + a.mrrBase * 0.15))
            .map((c) => (
              <div
                key={c.id}
                className="p-5 flex items-center justify-between gap-4 flex-wrap"
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                }}
              >
                <div>
                  <p style={{ fontWeight: 500 }}>{c.name}</p>
                  <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                    {c.email}
                  </p>
                </div>
                <div className="flex gap-6 text-right flex-wrap">
                  <div>
                    <p
                      className="mono uppercase"
                      style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
                    >
                      À verser
                    </p>
                    <p
                      className="display"
                      style={{
                        fontSize: 20,
                        color: "var(--color-accent)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatPrice(c.pending)}
                    </p>
                  </div>
                  <div>
                    <p
                      className="mono uppercase"
                      style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
                    >
                      MRR perso (15 %)
                    </p>
                    <p
                      className="display"
                      style={{ fontSize: 20, letterSpacing: "-0.02em" }}
                    >
                      {formatPrice(Math.round(c.mrrBase * COMMISSION_RATES.RECURRING))}
                      <span className="serif-i text-xs ml-1" style={{ color: "var(--color-muted)" }}>
                        /mois
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <SectionTitle
        eyebrow="Détail"
        title="Toutes les lignes,"
        italic="à valider une par une."
      />

      {commissions.length === 0 ? (
        <EmptyState message="Aucune commission enregistrée pour le moment." />
      ) : (
        <div
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                className="mono uppercase text-left"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: "var(--color-subtle)",
                  background: "var(--color-bg)",
                }}
              >
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Commercial</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">Montant</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => {
                return (
                  <tr
                    key={c.id}
                    style={{ borderTop: "1px solid var(--color-line)" }}
                  >
                    <td
                      className="px-5 py-4 mono"
                      style={{ fontSize: 12, color: "var(--color-subtle)" }}
                    >
                      {c.createdAt.toLocaleDateString("fr-BE")}
                    </td>
                    <td className="px-5 py-4">
                      {c.commercial.name ?? c.commercial.email}
                    </td>
                    <td className="px-5 py-4">
                      {TYPE_LABEL[c.type] ?? c.type}
                      <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                        {(c.rate * 100).toFixed(0)} % de {formatPrice(c.baseAmount)}
                        {c.periodMonth &&
                          ` · ${c.periodMonth.toLocaleDateString("fr-BE", {
                            year: "numeric",
                            month: "short",
                          })}`}
                      </p>
                    </td>
                    <td
                      className="px-5 py-4 text-right"
                      style={{ fontWeight: 500 }}
                    >
                      {formatPrice(c.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="mono uppercase px-2 py-1 rounded"
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          background:
                            c.status === "PAID" ? "#E6F5EC" : "var(--color-bg)",
                          color:
                            c.status === "PAID"
                              ? "#13A66A"
                              : "var(--color-muted)",
                          border:
                            c.status === "PAID"
                              ? "1px solid #13A66A"
                              : "1px solid var(--color-line)",
                        }}
                      >
                        {c.status === "PAID" ? "Versée" : "En attente"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <form action={toggleCommissionStatus}>
                        <input type="hidden" name="id" value={c.id} />
                        <button
                          type="submit"
                          className="text-xs no-underline"
                          style={{
                            color:
                              c.status === "PAID"
                                ? "var(--color-muted)"
                                : "var(--color-accent)",
                          }}
                        >
                          {c.status === "PAID"
                            ? "Annuler le versement"
                            : "Marquer versée"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="p-10 text-center mb-14"
      style={{
        background: "var(--color-paper)",
        border: "1px dashed var(--color-line)",
        borderRadius: 12,
      }}
    >
      <p className="serif-i" style={{ fontSize: 20, color: "var(--color-muted)" }}>
        {message}
      </p>
    </div>
  );
}
