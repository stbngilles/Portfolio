import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  StatCard,
  PlaceholderPanel,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { getCommercialRecurringMRR } from "@/lib/commissions";

export default async function CommercialHome() {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");

  const [quotes, signedDeals, commissionAgg, mrr] = await Promise.all([
    prisma.quote.count({ where: { commercialId: session.user.id } }),
    prisma.quote.count({
      where: { commercialId: session.user.id, status: "SIGNED" },
    }),
    prisma.commission.aggregate({
      where: { commercialId: session.user.id, status: "PENDING" },
      _sum: { amount: true },
    }),
    getCommercialRecurringMRR(session.user.id),
  ]);

  const pending = formatPrice(commissionAgg._sum.amount ?? 0);
  const mrrPerso = formatPrice(mrr.commission);

  return (
    <DashboardShell
      eyebrow="Cockpit commercial"
      title="Vendez,"
      italic="comptez ce que vous gagnez."
      user={{ ...session.user, role }}
      nav={COMMERCIAL_NAV}
    >
      <SectionTitle eyebrow="Mes chiffres" title="L'état," italic="en temps réel." />
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        <StatCard label="Devis envoyés" value={String(quotes)} />
        <StatCard label="Deals signés" value={String(signedDeals)} />
        <StatCard
          label="Commissions dues"
          value={pending}
          hint="non encore versées"
        />
        <StatCard
          label="MRR perso"
          value={mrrPerso}
          hint={`15 % de ${formatPrice(mrr.mrrBase)}/mois`}
          accent
        />
      </section>

      <SectionTitle eyebrow="Mes outils" title="Tout ce qu'il faut," italic="pour vendre vite." />
      <div className="grid md:grid-cols-2 gap-4">
        <PlaceholderPanel
          title="Calculateur de devis"
          description="Configurez l'offre (site + options + récurrent), générez un PDF propre, envoyez au prospect en un clic. Le prototype existant servira de base."
          phase="Phase 1 — priorité"
        />
        <PlaceholderPanel
          title="Pipeline visuel"
          description="Prospect → RDV → Devis envoyé → Signé. Glisser-déposer entre étapes, relances auto, conversion en projet."
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Brief de signature"
          description="Formulaire obligatoire à la signature qui capture tout ce dont la production a besoin. Sans lui, le deal n'est pas validé."
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Classement"
          description="Compétition saine entre commerciaux. Top du mois, top du trimestre, badges."
          phase="Phase 2"
        />
      </div>
    </DashboardShell>
  );
}
