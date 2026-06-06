import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  StatCard,
  PlaceholderPanel,
  SectionTitle,
} from "@/components/platform/DashboardShell";

export default async function AdminHome() {
  const { session, role } = await requireRole("ADMIN");

  const [userCount, projectCount, openTickets, activeSubs] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.ticket.count({ where: { status: "OPEN" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
  ]);

  const mrrCents = await prisma.subscription.aggregate({
    where: { status: "ACTIVE" },
    _sum: { monthlyAmount: true },
  });
  const mrr = ((mrrCents._sum.monthlyAmount ?? 0) / 100).toLocaleString("fr-BE", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <DashboardShell
      eyebrow="Cockpit administrateur"
      title="Tout le studio,"
      italic="d'un coup d'œil."
      user={{ ...session.user, role }}
      nav={[
        { href: "/app/admin", label: "Vue d'ensemble" },
        { href: "/app/admin/projects", label: "Projets" },
        { href: "/app/admin/clients", label: "Clients" },
        { href: "/app/admin/recurring", label: "Récurrent" },
        { href: "/app/admin/commissions", label: "Commissions" },
        { href: "/app/admin/users", label: "Utilisateurs" },
      ]}
    >
      <SectionTitle eyebrow="Indicateurs en direct" title="L'agence," italic="ce mois-ci." />
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        <StatCard label="MRR" value={mrr} hint="récurrent mensuel actif" accent />
        <StatCard label="Abonnements actifs" value={String(activeSubs)} hint="maintenance + pub" />
        <StatCard label="Projets" value={String(projectCount)} hint="tous statuts confondus" />
        <StatCard label="Utilisateurs" value={String(userCount)} hint="tous rôles" />
      </section>

      <SectionTitle eyebrow="Modules à construire" title="Le reste," italic="par ordre d'impact." />
      <div className="grid md:grid-cols-2 gap-4">
        <PlaceholderPanel
          title="Pipeline des projets"
          description="Kanban briefing → design → dev → contenu → live. Attribution aux freelances, suivi des deadlines, alertes de retard."
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Tickets ouverts"
          description={`${openTickets} ticket(s) à trier. File d'entrée centralisée toutes sources : client, équipe, fondateur.`}
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Commissions à régler"
          description="Calcul auto 20 % one-shot + 15 % récurrent. Récap mensuel par commercial avec bouton de paiement."
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Facturation & relances"
          description="Factures émises, en attente, en retard. Relances automatiques par email aux échéances."
          phase="Phase 2"
        />
      </div>
    </DashboardShell>
  );
}
