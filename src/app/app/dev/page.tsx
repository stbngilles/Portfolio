import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  StatCard,
  PlaceholderPanel,
  SectionTitle,
} from "@/components/platform/DashboardShell";

export default async function DevHome() {
  const { session, role } = await requireRole("DEV", "ADMIN");

  const [assigned, inProgress] = await Promise.all([
    prisma.project.count({ where: { devId: session.user.id } }),
    prisma.project.count({
      where: { devId: session.user.id, status: { in: ["DESIGN", "DEV", "CONTENT"] } },
    }),
  ]);

  return (
    <DashboardShell
      eyebrow="Espace dev"
      title="Vos missions,"
      italic="claires et briefées."
      user={{ ...session.user, role }}
      nav={[
        { href: "/app/dev", label: "Mes projets" },
        { href: "/app/dev/briefs", label: "Briefs techniques" },
        { href: "/app/dev/paiements", label: "Mes paiements" },
      ]}
    >
      <SectionTitle eyebrow="Charge actuelle" title="L'état," italic="aujourd'hui." />
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
        <StatCard label="Projets assignés" value={String(assigned)} />
        <StatCard label="En cours" value={String(inProgress)} hint="design, dev ou contenu" accent />
        <StatCard label="À régler" value="—" hint="paiements en attente" />
      </section>

      <SectionTitle eyebrow="Modules" title="Tout ce qu'il faut," italic="rien de plus." />
      <div className="grid md:grid-cols-2 gap-4">
        <PlaceholderPanel
          title="Brief technique"
          description="Le brief de signature + le scoping technique de chaque projet. Tout ce qu'il faut pour démarrer sans question."
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Deadlines"
          description="Vue calendrier des deadlines, validations clients, mises en ligne. Alertes avant échéance."
          phase="Phase 2"
        />
      </div>
    </DashboardShell>
  );
}
