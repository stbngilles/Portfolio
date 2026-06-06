import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { DEV_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("DEV", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Mes paiements"
      title="Ce qu'on vous doit,"
      italic="et quand."
      user={{ ...session.user, role }}
      nav={DEV_NAV}
      phase="Phase 2"
      what="Détail par projet livré : montant convenu, statut (en attente / payé), date de versement, références de virement. Plus de relances pour savoir où on en est."
    />
  );
}
