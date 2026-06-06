import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { CLIENT_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("CLIENT", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Statistiques"
      title="Le trafic,"
      italic="et ce qu'il fait pour vous."
      user={{ ...session.user, role }}
      nav={CLIENT_NAV}
      phase="Phase 2"
      what="Visiteurs, pages vues, sources de trafic, conversions. Pour les clients avec gestion publicité : leads générés, coût par lead, retour sur investissement Meta Ads."
    />
  );
}
