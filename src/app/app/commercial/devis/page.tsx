import { requireRole } from "@/lib/auth-guard";
import { ComingSoon } from "@/components/platform/ComingSoon";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";

export default async function Page() {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");
  return (
    <ComingSoon
      eyebrow="Calculateur de devis"
      title="Configurer, chiffrer,"
      italic="envoyer."
      user={{ ...session.user, role }}
      nav={COMMERCIAL_NAV}
      phase="Phase 1 — priorité"
      what="Configurez le site (Essentiel/Pro/E-com), ajoutez options et récurrent, le prix se calcule, le PDF se génère, le devis part par email. Le prototype existant servira de base."
    />
  );
}
