import { requireRole } from "@/lib/auth-guard";
import { DashboardShell } from "@/components/platform/DashboardShell";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";
import { QuoteCalculator } from "./QuoteCalculator";

export default async function NouveauDevisPage() {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");

  return (
    <DashboardShell
      eyebrow="Nouveau devis"
      title="On configure,"
      italic="ça calcule tout seul."
      user={{ ...session.user, role }}
      nav={COMMERCIAL_NAV}
    >
      <QuoteCalculator />
    </DashboardShell>
  );
}
