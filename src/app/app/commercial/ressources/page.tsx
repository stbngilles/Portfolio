import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Ressources de vente"
      title="Tout ce qu'il faut,"
      italic="pour conclure."
      user={{ ...session.user, role }}
      nav={COMMERCIAL_NAV}
      phase="Phase 1"
      what="Kit de vente, cas clients, traitement des objections, scripts d'appel, vidéos de démo. Accessible à tout moment, mis à jour quand on apprend quelque chose."
    />
  );
}
