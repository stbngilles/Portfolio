import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { CLIENT_NAV } from "@/lib/platform-nav";
import {
  parseAssetsState,
  ASSET_LABELS,
  assetsProgress,
  type AssetKey,
} from "@/lib/assets";
import { toggleAsset } from "./actions";

export default async function ClientAssetsPage() {
  const { session } = await requireRole("CLIENT", "ADMIN");

  const project = await prisma.project.findFirst({
    where: { clientId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, assetsState: true, status: true },
  });

  return (
    <DashboardShell
      eyebrow="Vos contenus"
      title="Ce qu'on attend de vous,"
      italic="pour démarrer."
      nav={CLIENT_NAV}
    >
      {!project ? (
        <div
          className="p-10 text-center"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="serif-i" style={{ fontSize: 22, color: "var(--color-muted)" }}>
            Aucun projet actif.
          </p>
        </div>
      ) : (
        <>
          <SectionTitle
            eyebrow={`${assetsProgress(project.assetsState).done}/${assetsProgress(project.assetsState).total} dépôts validés`}
            title="Cochez quand c'est prêt,"
            italic="le dev démarre dès que tout est vert."
          />

          <p className="serif-i mb-6 text-sm" style={{ color: "var(--color-muted)" }}>
            Déposez le matériel dans le dossier partagé qu'on vous a envoyé, puis
            cochez ici. Tant qu'une case n'est pas cochée, votre projet ne peut
            pas être affecté à un développeur — pas par mauvaise volonté, juste
            pour éviter qu'il bloque à mi-parcours.
          </p>

          <div className="grid gap-3">
            {(Object.keys(ASSET_LABELS) as AssetKey[]).map((k) => {
              const state = parseAssetsState(project.assetsState);
              const done = state[k];
              return (
                <form
                  key={k}
                  action={toggleAsset}
                  className="flex items-center justify-between gap-4 p-5"
                  style={{
                    background: done ? "var(--color-accent-soft)" : "var(--color-paper)",
                    border: `1px solid ${done ? "var(--color-accent)" : "var(--color-line)"}`,
                    borderRadius: 10,
                  }}
                >
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="key" value={k} />
                  <div className="flex items-center gap-4">
                    <span
                      className="display"
                      style={{
                        fontSize: 22,
                        color: done ? "var(--color-accent)" : "var(--color-subtle)",
                        lineHeight: 1,
                      }}
                    >
                      {done ? "✓" : "○"}
                    </span>
                    <div>
                      <p style={{ fontWeight: 500 }}>{ASSET_LABELS[k]}</p>
                      <p
                        className="mono uppercase mt-1"
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          color: done ? "var(--color-accent-ink)" : "var(--color-subtle)",
                        }}
                      >
                        {done ? "Reçu" : "En attente"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={done ? "btn btn-ghost" : "btn btn-accent"}
                    style={{ padding: "8px 14px", fontSize: 12 }}
                  >
                    {done ? "Annuler" : "Marquer reçu ✓"}
                  </button>
                </form>
              );
            })}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
