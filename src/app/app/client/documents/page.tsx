import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { CLIENT_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("CLIENT", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Documents"
      title="Vos documents,"
      italic="à un clic."
      user={{ ...session.user, role }}
      nav={CLIENT_NAV}
      phase="Phase 2"
      what="Cahier des charges, contrats, identifiants techniques, accès aux comptes. Tout au même endroit, sécurisé, accessible 24/7."
    />
  );
}
