import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  StatCard,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import {
  getCommercialRecurringMRR,
  getCommercialCommissionStats,
} from "@/lib/commissions";

const TYPE_LABEL: Record<string, string> = {
  ONE_SHOT: "One-shot (20 %)",
  RECURRING: "Récurrent (15 %)",
  LAUNCH_PACK: "Pack lancement (15 %)",
};

const TYPE_COLOR: Record<string, string> = {
  ONE_SHOT: "var(--color-accent)",
  RECURRING: "#13A66A",
  LAUNCH_PACK: "#7B5BFF",
};

export default async function CommercialCommissionsPage() {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");

  const [mrr, stats, commissions] = await Promise.all([
    getCommercialRecurringMRR(session.user.id),
    getCommercialCommissionStats(session.user.id),
    prisma.commission.findMany({
      where: { commercialId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <DashboardShell
      eyebrow="Mes commissions"
      title="Ce que vous gagnez,"
      italic="aujourd'hui et demain."
      user={{ ...session.user, role }}
      nav={COMMERCIAL_NAV}
    >
      <SectionTitle
        eyebrow="Récurrent"
        title="Le MRR qui grimpe,"
        italic="tant que vos clients restent."
      />
      <section className="grid sm:grid-cols-3 gap-4 mb-14">
        <StatCard
          label="MRR perso"
          value={formatPrice(mrr.commission)}
          hint={`15 % de ${formatPrice(mrr.mrrBase)}/mois`}
          accent
        />
        <StatCard
          label="Abonnements"
          value={String(mrr.subscriptions)}
          hint="clients actifs sous abonnement"
        />
        <StatCard
          label="Annualisé"
          value={formatPrice(mrr.commission * 12)}
          hint="si tout reste tel quel sur 12 mois"
        />
      </section>

      <SectionTitle
        eyebrow="Solde"
        title="À recevoir,"
        italic="déjà reçu."
      />
      <section className="grid sm:grid-cols-2 gap-4 mb-14">
        <StatCard
          label={`À recevoir · ${stats.pendingCount} ligne${stats.pendingCount > 1 ? "s" : ""}`}
          value={formatPrice(stats.pendingTotal)}
          hint="non encore versées"
          accent
        />
        <StatCard
          label={`Déjà versées · ${stats.paidCount} ligne${stats.paidCount > 1 ? "s" : ""}`}
          value={formatPrice(stats.paidTotal)}
          hint="cumul historique"
        />
      </section>

      <SectionTitle
        eyebrow="Détail"
        title="Chaque commission,"
        italic="par devis."
      />

      {commissions.length === 0 ? (
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
            Aucune commission enregistrée pour le moment.
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-subtle)" }}
          >
            Elles apparaîtront à la signature de votre premier devis.
          </p>
        </div>
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
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Base</th>
                <th className="px-5 py-3">Taux</th>
                <th className="px-5 py-3 text-right">Montant</th>
                <th className="px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
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
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: TYPE_COLOR[c.type] ?? "#65656E" }}
                      />
                      <span>{TYPE_LABEL[c.type] ?? c.type}</span>
                    </div>
                    {c.periodMonth && (
                      <p
                        className="mono text-xs mt-1"
                        style={{ color: "var(--color-subtle)" }}
                      >
                        {c.periodMonth.toLocaleDateString("fr-BE", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4" style={{ color: "var(--color-muted)" }}>
                    {formatPrice(c.baseAmount)}
                  </td>
                  <td
                    className="px-5 py-4 mono"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {(c.rate * 100).toFixed(0)} %
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
                          c.status === "PAID"
                            ? "#E6F5EC"
                            : "var(--color-bg)",
                        color:
                          c.status === "PAID" ? "#13A66A" : "var(--color-muted)",
                        border:
                          c.status === "PAID"
                            ? "1px solid #13A66A"
                            : "1px solid var(--color-line)",
                      }}
                    >
                      {c.status === "PAID" ? "Versée" : "En attente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p
        className="serif-i mt-6 text-sm"
        style={{ color: "var(--color-subtle)" }}
      >
        Le MRR récurrent se recalcule en direct depuis vos abonnements actifs.{" "}
        <Link
          href="/app/commercial/pipeline"
          className="no-underline"
          style={{ color: "var(--color-accent)" }}
        >
          Signez un autre devis avec récurrent →
        </Link>{" "}
        et regardez-le grimper.
      </p>
    </DashboardShell>
  );
}
