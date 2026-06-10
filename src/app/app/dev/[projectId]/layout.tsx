import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { NavTabs } from "@/components/platform/NavTabs";

const PROJECT_DEV_NAV = (id: string) => [
  { href: `/app/dev/${id}`, label: "Tableau" },
  { href: `/app/dev/${id}/trousseau`, label: "Trousseau" },
  { href: `/app/dev/${id}/livraison`, label: "Livraison" },
  { href: `/app/dev/${id}/qa`, label: "QA" },
  { href: `/app/dev/${id}/messages`, label: "Messages" },
  { href: `/app/dev/${id}/facture`, label: "Facture" },
  { href: `/app/dev/${id}/bloquer`, label: "Signaler" },
];

export default async function DevProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { session, role } = await requireRole("DEV", "ADMIN");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, status: true, devId: true },
  });

  if (!project) notFound();
  // Un DEV ne peut accéder qu'à ses projets
  if (role !== "ADMIN" && project.devId !== session.user.id) notFound();

  const nav = PROJECT_DEV_NAV(projectId);

  return (
    <div>
      <div
        className="wrap pt-6 pb-2"
        style={{ borderBottom: "1px solid var(--color-line)" }}
      >
        <Link
          href="/app/dev"
          className="mono uppercase text-xs no-underline mb-4 block"
          style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
        >
          ← Mes projets
        </Link>
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h2
            className="display"
            style={{ fontSize: 24, letterSpacing: "-0.02em" }}
          >
            {project.name}
          </h2>
          <span
            className="mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "var(--color-muted)",
              background: "var(--color-bg)",
              padding: "4px 10px",
              borderRadius: 6,
            }}
          >
            {project.status}
          </span>
        </div>
        <NavTabs items={nav} />
      </div>
      {children}
    </div>
  );
}
