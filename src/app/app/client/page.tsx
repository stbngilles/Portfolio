import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  PlaceholderPanel,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { clientValidateStage } from "@/app/app/admin/projects/actions";
import type { StageStatus } from "@/lib/stages";

const STATUS_VISUAL: Record<
  StageStatus,
  { bg: string; border: string; text: string; tag: string }
> = {
  PENDING: {
    bg: "transparent",
    border: "var(--color-line)",
    text: "var(--color-subtle)",
    tag: "À venir",
  },
  IN_PROGRESS: {
    bg: "var(--color-bg)",
    border: "var(--color-ink)",
    text: "var(--color-ink)",
    tag: "En cours",
  },
  NEEDS_VALIDATION: {
    bg: "#FFF8E1",
    border: "#D4A857",
    text: "#8A6914",
    tag: "À valider",
  },
  VALIDATED: {
    bg: "var(--color-accent-soft)",
    border: "var(--color-accent)",
    text: "var(--color-accent-ink)",
    tag: "Validé",
  },
};

export default async function ClientHome() {
  const { session, role } = await requireRole("CLIENT", "ADMIN");

  const project = await prisma.project.findFirst({
    where: { clientId: session.user.id },
    include: { stages: { orderBy: { order: "asc" } } },
  });

  const firstName = (session.user.name ?? "").split(" ")[0] || "à vous";

  return (
    <DashboardShell
      eyebrow="Votre espace"
      title={`Bonjour ${firstName},`}
      italic="on vous montre tout."
      user={{ ...session.user, role }}
      nav={[
        { href: "/app/client", label: "Mon projet" },
        { href: "/app/client/factures", label: "Factures" },
        { href: "/app/client/tickets", label: "Mes demandes" },
        { href: "/app/client/stats", label: "Statistiques" },
        { href: "/app/client/documents", label: "Documents" },
      ]}
    >
      <SectionTitle
        eyebrow="Projet en cours"
        title="Où en est-on,"
        italic="aujourd'hui."
      />

      {project ? (
        <div
          className="p-8 mb-14"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-baseline justify-between mb-8 flex-wrap gap-2">
            <h3
              className="display"
              style={{ fontSize: 26, letterSpacing: "-0.02em" }}
            >
              {project.name}
            </h3>
            <ProgressPill stages={project.stages} />
          </div>

          <ol className="grid gap-3">
            {project.stages.map((s) => {
              const v = STATUS_VISUAL[s.status as StageStatus];
              const needsValidation = s.status === "NEEDS_VALIDATION";

              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap"
                  style={{
                    background: v.bg,
                    border: `1px solid ${v.border}`,
                    borderRadius: 10,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--color-subtle)",
                        width: 18,
                      }}
                    >
                      {String(s.order).padStart(2, "0")}
                    </span>
                    <div>
                      <p style={{ fontWeight: 500, color: v.text }}>{s.label}</p>
                      <p
                        className="mono mt-1"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          color: v.text,
                          opacity: 0.7,
                          textTransform: "uppercase",
                        }}
                      >
                        {v.tag}
                        {s.validatedAt &&
                          ` · ${s.validatedAt.toLocaleDateString("fr-BE")}`}
                      </p>
                    </div>
                  </div>

                  {needsValidation && (
                    <form action={clientValidateStage}>
                      <input type="hidden" name="stageId" value={s.id} />
                      <button
                        type="submit"
                        className="btn btn-accent"
                        style={{ padding: "8px 16px", fontSize: 13 }}
                      >
                        Je valide cette étape →
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <div
          className="p-10 mb-14 text-center"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="serif-i" style={{ fontSize: 22, color: "var(--color-muted)" }}>
            Aucun projet en cours pour le moment.
          </p>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-subtle)" }}
          >
            Si vous venez de signer, votre projet apparaîtra ici sous 24 h.
          </p>
        </div>
      )}

      <SectionTitle eyebrow="À venir" title="Tout ce qui vivra," italic="ici." />
      <div className="grid md:grid-cols-2 gap-4">
        <PlaceholderPanel
          title="Mes demandes"
          description="Vos modifications, vos questions, vos problèmes : tout suivi par ticket. Plus rien ne se perd dans un mail."
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Échéancier"
          description="50 % à la signature, 50 % à la mise en ligne. Paiement sécurisé en ligne, reçus PDF disponibles."
          phase="Phase 1"
        />
        <PlaceholderPanel
          title="Performance publicité"
          description="Leads générés, coût par lead, retour sur dépense. La transparence totale sur ce que paient vos campagnes."
          phase="Phase 2"
        />
        <PlaceholderPanel
          title="Documents"
          description="Cahier des charges, contrats, identifiants, accès. Tout au même endroit, accessible 24/7."
          phase="Phase 2"
        />
      </div>
    </DashboardShell>
  );
}

function ProgressPill({
  stages,
}: {
  stages: { status: string }[];
}) {
  const total = stages.length;
  const done = stages.filter((s) => s.status === "VALIDATED").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="text-right">
      <p
        className="display"
        style={{
          fontSize: 28,
          color: "var(--color-accent)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {pct}%
      </p>
      <p
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.14em",
          color: "var(--color-subtle)",
          marginTop: 4,
        }}
      >
        {done}/{total} ÉTAPES
      </p>
    </div>
  );
}
