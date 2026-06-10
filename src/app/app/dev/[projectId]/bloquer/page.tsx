import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { reportBlocker } from "./actions";

const TYPE_LABEL: Record<string, string> = {
  MISSING_ASSET: "Asset manquant (photo, texte, logo…)",
  BROKEN_API: "API ou service tiers cassé",
  UNCLEAR_BRIEF: "Brief insuffisant ou ambigu",
  ACCESS_DENIED: "Accès refusé ou credential invalide",
  OTHER: "Autre blocage",
};

export default async function BloquerPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { session, role } = await requireRole("DEV", "ADMIN");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      blockerReports: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!project) notFound();
  if (role !== "ADMIN" && project.devId !== session.user.id) notFound();

  const openBlockers = project.blockerReports.filter((b) => b.status === "OPEN");
  const resolved = project.blockerReports.filter((b) => b.status !== "OPEN");

  return (
    <div className="wrap py-8 max-w-3xl">
      <p className="serif-i mb-8" style={{ color: "var(--color-muted)", fontSize: 15 }}>
        Un blocage signalé <strong>gèle le projet</strong> et alerte l'admin immédiatement.
        Il reste bloqué jusqu'à résolution. N'utilisez ce bouton que si vous êtes vraiment bloqué.
      </p>

      {/* Blocages ouverts */}
      {openBlockers.length > 0 && (
        <div className="space-y-3 mb-8">
          {openBlockers.map((b) => (
            <div
              key={b.id}
              className="p-5"
              style={{ background: "#FEE2E2", border: "1px solid #9F1239", borderRadius: 10 }}
            >
              <p className="mono uppercase mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#9F1239" }}>
                · BLOQUÉ — {TYPE_LABEL[b.type] ?? b.type}
              </p>
              <p className="serif-i" style={{ color: "#7B1024" }}>« {b.description} »</p>
              <p className="mono text-xs mt-2" style={{ color: "#9F1239", opacity: 0.7 }}>
                Signalé le {b.createdAt.toLocaleDateString("fr-BE")} · En attente de l'admin
              </p>
              {b.adminNote && (
                <div className="mt-3 p-3" style={{ background: "#FFF", borderRadius: 6 }}>
                  <p className="mono uppercase text-xs mb-1" style={{ color: "#9F1239" }}>Réponse admin :</p>
                  <p className="text-sm">{b.adminNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulaire */}
      {openBlockers.length === 0 ? (
        <div
          className="p-6 mb-8"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="mono uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>
            · Signaler un blocage
          </p>
          <form action={reportBlocker.bind(null, projectId)} className="space-y-4">
            <label className="block">
              <span className="mono uppercase block mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                Type de blocage
              </span>
              <select
                name="type"
                className="w-full px-3 py-2 outline-none"
                style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14 }}
              >
                {Object.entries(TYPE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mono uppercase block mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                Description précise (min. 20 caractères)
              </span>
              <textarea
                name="description"
                rows={5}
                required
                minLength={20}
                placeholder="Décrivez exactement ce qui bloque : quelle page, quelle API, quel fichier manque, depuis quand…"
                className="w-full px-3 py-2 outline-none"
                style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
              />
            </label>
            <button
              type="submit"
              className="btn w-full justify-center"
              style={{ background: "#9F1239", color: "white", padding: "12px 16px" }}
            >
              Signaler le blocage — projet gelé
            </button>
          </form>
        </div>
      ) : (
        <div
          className="p-5 mb-8 text-center"
          style={{ background: "var(--color-bg)", border: "1px dashed var(--color-line)", borderRadius: 10 }}
        >
          <p className="serif-i" style={{ color: "var(--color-muted)" }}>
            Vous avez déjà un blocage ouvert. L'admin doit le résoudre avant d'en créer un nouveau.
          </p>
        </div>
      )}

      {/* Historique résolu */}
      {resolved.length > 0 && (
        <>
          <p className="mono uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>
            · Historique résolu
          </p>
          <div className="space-y-2">
            {resolved.map((b) => (
              <div
                key={b.id}
                className="px-4 py-3"
                style={{ background: "#E6F5EC", border: "1px solid #13A66A", borderRadius: 8 }}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm" style={{ color: "#0D6E46" }}>
                    {TYPE_LABEL[b.type] ?? b.type} — {b.description.slice(0, 80)}{b.description.length > 80 ? "…" : ""}
                  </p>
                  <span className="mono text-xs" style={{ color: "#0D6E46" }}>
                    Résolu le {b.resolvedAt?.toLocaleDateString("fr-BE") ?? "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
