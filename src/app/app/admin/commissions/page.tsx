import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { ADMIN_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("ADMIN");
  return (
    <ComingSoon
      eyebrow="Commissions"
      title="Ce qu'on doit,"
      italic="à chacun."
      user={{ ...session.user, role }}
      nav={ADMIN_NAV}
      phase="Phase 1"
      what="Calcul automatique 20 % one-shot + 15 % récurrent + 15 % pack publicité. Récap mensuel par commercial, bouton « marquer comme payé » et export comptable."
    />
  );
}
