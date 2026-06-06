import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { setStageStatus } from "../actions";
import { STAGE_STATUS_LABEL, type StageStatus } from "@/lib/stages";

const STATUS_TINT: Record<StageStatus, { bg: string; border: string; text: string }> = {
  PENDING: { bg: "transparent", border: "var(--color-line)", text: "var(--color-subtle)" },
  IN_PROGRESS: { bg: "var(--color-bg)", border: "var(--color-ink)", text: "var(--color-ink)" },
  NEEDS_VALIDATION: { bg: "#FFF8E1", border: "#D4A857", text: "#8A6914" },
  VALIDATED: { bg: "var(--color-accent-soft)", border: "var(--color-accent)", text: "var(--color-accent-ink)" },
};

export default async function AdminProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session, role } = await requireRole("ADMIN");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      commercial: true,
      dev: true,
      stages: { orderBy: { order: "asc" } },
    },
  });

  if (!project) notFound();

  return (
    <DashboardShell
      eyebrow="Projet"
      title={project.name}
      user={{ ...session.user, role }}
      nav={[
        { href: "/app/admin/projects", label: "← Tous les projets" },
        { href: `/app/admin/projects/${id}`, label: "Suivi" },
      ]}
    >
      {/* Méta */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <MetaCard label="Client" value={project.client.name ?? project.client.email} />
        <MetaCard
          label="Commercial"
          value={project.commercial?.name ?? "—"}
          subtle={!project.commercial}
        />
        <MetaCard
          label="Développeur"
          value={project.dev?.name ?? "—"}
          subtle={!project.dev}
        />
      </div>

      <SectionTitle
        eyebrow="Suivi des étapes"
        title="Avancement,"
        italic="en direct."
      />
      <p
        className="text-sm mb-6 serif-i"
        style={{ color: "var(--color-muted)" }}
      >
        Quand le client doit valider, mettez l'étape sur « À valider » : il
        verra alors le bouton de validation en 1 clic dans son espace.
      </p>

      <div className="grid gap-3">
        {project.stages.map((s) => {
          const tint = STATUS_TINT[s.status as StageStatus];
          return (
            <div
              key={s.id}
              className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap"
              style={{
                background: tint.bg,
                border: `1px solid ${tint.border}`,
                borderRadius: 10,
              }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="mono"
                  style={{ fontSize: 11, color: "var(--color-subtle)", width: 18 }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <div>
                  <p style={{ fontWeight: 500, color: tint.text }}>{s.label}</p>
                  {s.validatedAt && (
                    <p
                      className="mono mt-1"
                      style={{ fontSize: 10, color: "var(--color-subtle)" }}
                    >
                      Validé le {s.validatedAt.toLocaleDateString("fr-BE")}
                    </p>
                  )}
                </div>
              </div>

              <form action={setStageStatus} className="flex items-center gap-2">
                <input type="hidden" name="stageId" value={s.id} />
                <select
                  name="status"
                  defaultValue={s.status}
                  className="px-3 py-1.5 outline-none"
                  style={{
                    background: "var(--color-paper)",
                    border: "1px solid var(--color-line)",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                >
                  {(Object.keys(STAGE_STATUS_LABEL) as StageStatus[]).map((k) => (
                    <option key={k} value={k}>
                      {STAGE_STATUS_LABEL[k]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="text-xs no-underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  Appliquer
                </button>
              </form>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <Link
          href="/app/admin/projects"
          className="text-sm no-underline"
          style={{ color: "var(--color-muted)" }}
        >
          ← Retour à la liste
        </Link>
      </div>
    </DashboardShell>
  );
}

function MetaCard({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) {
  return (
    <div
      className="p-5"
      style={{
        background: "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 10,
      }}
    >
      <p
        className="mono uppercase mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
      >
        {label}
      </p>
      <p
        style={{
          fontWeight: 500,
          color: subtle ? "var(--color-subtle)" : "var(--color-ink)",
          fontStyle: subtle ? "italic" : "normal",
        }}
      >
        {value}
      </p>
    </div>
  );
}
