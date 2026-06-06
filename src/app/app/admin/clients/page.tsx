import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { ADMIN_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("ADMIN");
  return (
    <ComingSoon
      eyebrow="Clients"
      title="La fiche client,"
      italic="enrichie."
      user={{ ...session.user, role }}
      nav={ADMIN_NAV}
      phase="Phase 1"
      what="Une vue par client agrégeant son projet, ses factures, ses abonnements actifs, ses tickets et ses interactions. Le point de départ avant chaque relance ou rendez-vous."
    />
  );
}
