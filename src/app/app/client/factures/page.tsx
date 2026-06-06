import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { CLIENT_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("CLIENT", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Factures"
      title="Vos factures,"
      italic="payables en ligne."
      user={{ ...session.user, role }}
      nav={CLIENT_NAV}
      phase="Phase 1"
      what="Échéancier 50 % à la signature, 50 % à la mise en ligne. Paiement Stripe sécurisé, reçus PDF téléchargeables, historique consultable à vie."
    />
  );
}
