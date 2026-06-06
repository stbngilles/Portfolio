import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { CLIENT_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("CLIENT", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Mes demandes"
      title="Une modif, une question,"
      italic="un ticket."
      user={{ ...session.user, role }}
      nav={CLIENT_NAV}
      phase="Phase 1"
      what="Système de tickets pour vos demandes de modification, questions, problèmes. Chaque ticket a un statut, une priorité, un historique. Plus rien ne se perd dans un mail."
    />
  );
}
