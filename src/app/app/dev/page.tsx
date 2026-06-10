import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { DEV_NAV } from "@/lib/platform-nav";
import { requestRelease, cancelReleaseRequest } from "./actions";

// READY_FOR_DEV inclus : si le dev vient juste de prendre la mission et que
// le statut n'a pas encore été mis à jour (cas de bord), il doit quand même voir son projet.
const ACTIVE_STATUSES = ["READY_FOR_DEV", "BRIEFING", "DESIGN", "DEV", "CONTENT", "QA_REVIEW"];

const STATUS_LABEL: Record<string, string> = {
  BRIEFING: "Briefing",
  DESIGN: "Design",
  DEV: "Développement",
  CONTENT: "Contenu",
  LIVE: "En ligne",
  CLOSED: "Clôturé",
};

export default async function DevHome() {
  const { session, role } = await requireRole("DEV", "ADMIN");

  const [activeProjects, history, availableCount] = await Promise.all([
    prisma.project.findMany({
      where: {
        devId: session.user.id,
        status: { in: ACTIVE_STATUSES },
      },
      include: {
        client: { select: { name: true, email: true } },
        stages: { orderBy: { order: "asc" } },
        quote: { select: { id: true, number: true } },
        releaseRequests: {
          where: { devId: session.user.id },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      where: {
        devId: session.user.id,
        status: { in: ["LIVE", "CLOSED"] },
      },
      orderBy: { liveAt: "desc" },
      take: 20,
      include: { client: { select: { name: true, email: true } } },
    }),
    // Le pool n'affiche que les READY_FOR_DEV (brief + acompte validés)
    prisma.project.count({
      where: { devId: null, status: "READY_FOR_DEV" },
    }),
  ]);

  const hasActiveProject = activeProjects.length > 0;
  const titleLabel = hasActiveProject
    ? activeProjects.length > 1
      ? `Vos ${activeProjects.length} missions,`
      : "Votre mission,"
    : "Aucune mission en cours,";
  const italicLabel = hasActiveProject ? "en cours." : "pour le moment.";

  return (
    <DashboardShell
      eyebrow="Espace dev"
      title={titleLabel}
      italic={italicLabel}
      nav={DEV_NAV}
    >
      {hasActiveProject ? (
        <div className="grid gap-6 mb-14">
          {activeProjects.map((p) => {
            const lastRequest = p.releaseRequests[0] ?? null;
            const pendingRelease = lastRequest?.status === "PENDING";
            const refusedRelease = lastRequest?.status === "REFUSED";

            return (
              <div
                key={p.id}
                className="p-8"
                style={{
                  background: "var(--color-paper)",
                  border: `2px solid ${pendingRelease ? "#D4A857" : "var(--color-accent)"}`,
                  borderRadius: 12,
                }}
              >
                <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
                  <div>
                    <p
                      className="mono uppercase mb-2"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        color: pendingRelease ? "#8A6914" : "var(--color-accent)",
                      }}
                    >
                      · {pendingRelease ? "Libération demandée" : "Projet en cours"}
                    </p>
                    <Link
                      href={`/app/dev/${p.id}`}
                      className="no-underline"
                      style={{ color: "var(--color-ink)" }}
                    >
                      <h2
                        className="display"
                        style={{ fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1.1 }}
                      >
                        {p.name} →
                      </h2>
                    </Link>
                    <p className="text-sm mt-2" style={{ color: "var(--color-muted)" }}>
                      Client : {p.client.name ?? p.client.email}
                    </p>
                  </div>
                  <span
                    className="mono uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: "var(--color-muted)",
                      background: "var(--color-bg)",
                      padding: "6px 10px",
                      borderRadius: 6,
                    }}
                  >
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {p.stages.map((s) => {
                    const isDone = s.status === "VALIDATED";
                    const isActive =
                      s.status === "IN_PROGRESS" || s.status === "NEEDS_VALIDATION";
                    return (
                      <span
                        key={s.id}
                        className="text-xs px-3 py-1.5 rounded-full"
                        style={{
                          background: isDone
                            ? "var(--color-accent-soft)"
                            : isActive
                            ? "var(--color-bg)"
                            : "transparent",
                          border: `1px solid ${
                            isDone
                              ? "var(--color-accent)"
                              : isActive
                              ? "var(--color-ink)"
                              : "var(--color-line)"
                          }`,
                          color: isDone
                            ? "var(--color-accent-ink)"
                            : isActive
                            ? "var(--color-ink)"
                            : "var(--color-subtle)",
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {s.label}
                      </span>
                    );
                  })}
                </div>

                {refusedRelease && (
                  <div
                    className="p-4 mb-5"
                    style={{
                      background: "#FEE2E2",
                      border: "1px solid #9F1239",
                      borderRadius: 8,
                    }}
                  >
                    <p
                      className="mono uppercase mb-1"
                      style={{ fontSize: 10, letterSpacing: "0.14em", color: "#9F1239" }}
                    >
                      · Demande précédente refusée
                    </p>
                    <p className="text-sm serif-i" style={{ color: "#7B1024" }}>
                      « {lastRequest!.adminNote} »
                    </p>
                  </div>
                )}

                {pendingRelease ? (
                  <div
                    className="p-4 flex items-start justify-between gap-4 flex-wrap"
                    style={{
                      background: "#FFF8E1",
                      border: "1px solid #D4A857",
                      borderRadius: 8,
                    }}
                  >
                    <div className="flex-1 min-w-[200px]">
                      <p
                        className="mono uppercase mb-1"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          color: "#8A6914",
                        }}
                      >
                        · Demande envoyée, en attente de l'admin
                      </p>
                      <p className="text-sm serif-i" style={{ color: "#8A6914" }}>
                        « {lastRequest!.reason} »
                      </p>
                    </div>
                    <form action={cancelReleaseRequest}>
                      <input
                        type="hidden"
                        name="requestId"
                        value={lastRequest!.id}
                      />
                      <button
                        type="submit"
                        className="text-xs no-underline"
                        style={{ color: "#9F1239" }}
                      >
                        Annuler ma demande
                      </button>
                    </form>
                  </div>
                ) : role === "ADMIN" ? (
                  <form action={requestRelease}>
                    <input type="hidden" name="projectId" value={p.id} />
                    <button
                      type="submit"
                      className="btn btn-ghost"
                      style={{ padding: "8px 16px", fontSize: 13 }}
                      title="Vous êtes admin — pas besoin de rapport."
                    >
                      Libérer ce projet
                    </button>
                  </form>
                ) : (
                  <details>
                    <summary
                      className="text-sm cursor-pointer"
                      style={{ color: "var(--color-accent)" }}
                    >
                      Demander à relâcher ce projet →
                    </summary>
                    <form action={requestRelease} className="mt-4 space-y-3">
                      <input type="hidden" name="projectId" value={p.id} />
                      <label className="block">
                        <span
                          className="mono uppercase block mb-2"
                          style={{
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            color: "var(--color-muted)",
                          }}
                        >
                          Rapport (obligatoire)
                        </span>
                        <textarea
                          name="reason"
                          rows={5}
                          required
                          minLength={20}
                          placeholder="Où en êtes-vous ? Qu'est-ce qui est fait, qu'est-ce qui reste, pourquoi voulez-vous relâcher ?"
                          className="w-full px-3 py-2 outline-none"
                          style={{
                            background: "var(--color-bg)",
                            border: "1px solid var(--color-line)",
                            borderRadius: 6,
                            fontSize: 14,
                            fontFamily: "inherit",
                            resize: "vertical",
                          }}
                        />
                        <p
                          className="serif-i mt-2 text-xs"
                          style={{ color: "var(--color-subtle)" }}
                        >
                          L'admin examinera et vous notifiera de sa décision.
                          Vous restez assigné en attendant.
                        </p>
                      </label>
                      <button
                        type="submit"
                        className="btn btn-ghost"
                        style={{ padding: "8px 16px", fontSize: 13 }}
                      >
                        Envoyer le rapport →
                      </button>
                    </form>
                  </details>
                )}

                {p.quote && (
                  <div
                    className="mt-5 pt-4 text-sm"
                    style={{ borderTop: "1px solid var(--color-line)" }}
                  >
                    <Link
                      href={`/app/commercial/devis/${p.quote.id}`}
                      className="no-underline"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Voir le devis source {p.quote.number} →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
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
          <p
            className="serif-i mb-4"
            style={{ fontSize: 22, color: "var(--color-muted)" }}
          >
            Vous n'avez pas de projet en cours.
          </p>
          <p className="text-sm" style={{ color: "var(--color-subtle)" }}>
            {availableCount > 0
              ? `${availableCount} projet${availableCount > 1 ? "s" : ""} ${
                  availableCount > 1 ? "sont" : "est"
                } disponible${availableCount > 1 ? "s" : ""} dans le pool.`
              : "Aucun projet disponible pour le moment dans le pool."}
          </p>
          <Link
            href="/app/dev/disponibles"
            className="btn btn-primary mt-6 inline-flex"
          >
            Voir les projets disponibles →
          </Link>
        </div>
      )}

      {history.length > 0 && (
        <>
          <SectionTitle
            eyebrow={`${history.length} projet${history.length > 1 ? "s" : ""}`}
            title="Vos projets livrés,"
            italic="par ordre récent."
          />
          <div className="grid gap-3">
            {history.map((p) => (
              <Link
                key={p.id}
                href={`/app/admin/projects/${p.id}`}
                className="block no-underline transition"
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  color: "var(--color-ink)",
                }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p style={{ fontWeight: 500 }}>{p.name}</p>
                    <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                      {p.client.name ?? p.client.email}
                    </p>
                  </div>
                  <span
                    className="mono uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: "var(--color-subtle)",
                    }}
                  >
                    {STATUS_LABEL[p.status]}
                    {p.liveAt &&
                      ` · ${p.liveAt.toLocaleDateString("fr-BE")}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
