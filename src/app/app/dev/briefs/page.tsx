import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { DEV_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("DEV", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Briefs techniques"
      title="Tout ce qu'il faut,"
      italic="pour démarrer sans question."
      user={{ ...session.user, role }}
      nav={DEV_NAV}
      phase="Phase 1"
      what="Le brief de signature rempli par le commercial + le scoping technique : type de site, fonctionnalités, langues, contenu, particularités, accès, contraintes."
    />
  );
}
