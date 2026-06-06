import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Pipeline"
      title="Vos deals,"
      italic="par étape."
      user={{ ...session.user, role }}
      nav={COMMERCIAL_NAV}
      phase="Phase 1"
      what="Vue kanban : Prospect → RDV → Devis envoyé → Signé. Glisser-déposer entre étapes, relances automatiques, conversion en projet à la signature."
    />
  );
}
