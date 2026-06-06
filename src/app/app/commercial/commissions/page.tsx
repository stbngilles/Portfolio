import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Mes commissions"
      title="Ce que vous avez gagné,"
      italic="en direct."
      user={{ ...session.user, role }}
      nav={COMMERCIAL_NAV}
      phase="Phase 1"
      what="One-shot et récurrent cumulé mois après mois. Le MRR perso grimpe à chaque client qui reste abonné. Détail par deal, historique des versements, à recevoir / déjà payé."
    />
  );
}
