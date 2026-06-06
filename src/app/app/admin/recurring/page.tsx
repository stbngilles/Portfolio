import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { ADMIN_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("ADMIN");
  return (
    <ComingSoon
      eyebrow="Récurrent"
      title="Le MRR,"
      italic="suivi à la maille fine."
      user={{ ...session.user, role }}
      nav={ADMIN_NAV}
      phase="Phase 1"
      what="Tous les abonnements actifs : maintenance, gestion publicité, packs. Filtres par plan, par commercial signataire, par ancienneté. Suivi du churn et du taux d'attache (le KPI directeur)."
    />
  );
}
