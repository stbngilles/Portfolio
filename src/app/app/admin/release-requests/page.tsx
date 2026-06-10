import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { acceptReleaseRequest, refuseReleaseRequest } from "./actions";

const STATUS_VISUAL: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "En attente", color: "#D4A857", bg: "#FFF8E1" },
  ACCEPTED: { label: "Acceptée", color: "#13A66A", bg: "#E6F5EC" },
  REFUSED: { label: "Refusée", color: "#9F1239", bg: "#FEE2E2" },
};

export default async function ReleaseRequestsPage() {
  const { role } = await requireRole("ADMIN");

  const pending = await prisma.releaseRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          status: true,
          client: { select: { name: true, email: true } },
        },
      },
      dev: { select: { id: true, name: true, email: true } },
    },
  });

  const decided = await prisma.releaseRequest.findMany({
    where: { status: { in: ["ACCEPTED", "REFUSED"] } },
    orderBy: { decidedAt: "desc" },
    take: 20,
    include: {
      project: {
        select: { id: true, name: true },
      },
      dev: { select: { name: true, email: true } },
    },
  });

  return (
    <DashboardShell
      eyebrow="Demandes de libération"
      title="Un dev veut se retirer,"
      italic="à vous de trancher."
      nav={ADMIN_NAV}
    >
      <SectionTitle
        eyebrow={`${pending.length} en attente`}
        title="À examiner,"
        italic="d'abord."
      />

      {pending.length === 0 ? (
        <div
          className="p-10 text-center mb-14"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p
            className="serif-i"
            style={{ fontSize: 22, color: "var(--color-muted)" }}
          >
            Aucune demande en attente.
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-subtle)" }}
          >
            Les devs ne peuvent pas relâcher un projet seuls — ils doivent
            d'abord soumettre un rapport ici.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 mb-14">
          {pending.map((r) => (
            <article
              key={r.id}
              className="p-6"
              style={{
                background: "var(--color-paper)",
                border: "1px solid #D4A857",
                borderRadius: 12,
              }}
            >
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <p
                    className="mono uppercase mb-2"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: "#8A6914",
                    }}
                  >
                    · Reçue le {r.createdAt.toLocaleDateString("fr-BE")}
                  </p>
                  <Link
                    href={`/app/admin/projects/${r.project.id}`}
                    className="display no-underline"
                    style={{ fontSize: 22, letterSpacing: "-0.02em", color: "var(--color-ink)" }}
                  >
                    {r.project.name}
                  </Link>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Demandé par{" "}
                    <strong style={{ color: "var(--color-ink)" }}>
                      {r.dev.name ?? r.dev.email}
                    </strong>{" "}
                    · client : {r.project.client.name ?? r.project.client.email}
                  </p>
                </div>
              </div>

              <div
                className="p-4 mb-5 serif-i"
                style={{
                  background: "var(--color-bg)",
                  borderRadius: 8,
                  fontSize: 15,
                  color: "var(--color-ink-soft)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                « {r.reason} »
              </div>

              <details>
                <summary
                  className="text-sm cursor-pointer mb-4"
                  style={{ color: "var(--color-accent)" }}
                >
                  Accepter ou refuser →
                </summary>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <form action={acceptReleaseRequest} className="space-y-3">
                    <input type="hidden" name="requestId" value={r.id} />
                    <label className="block">
                      <span
                        className="mono uppercase block mb-2"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          color: "var(--color-muted)",
                        }}
                      >
                        Note pour le dev (optionnel)
                      </span>
                      <textarea
                        name="adminNote"
                        rows={3}
                        placeholder="Merci pour le boulot ! Bonne continuation."
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
                    </label>
                    <button
                      type="submit"
                      className="btn btn-primary w-full justify-center"
                    >
                      Accepter & libérer le projet ✓
                    </button>
                  </form>

                  <form action={refuseReleaseRequest} className="space-y-3">
                    <input type="hidden" name="requestId" value={r.id} />
                    <label className="block">
                      <span
                        className="mono uppercase block mb-2"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          color: "var(--color-muted)",
                        }}
                      >
                        Raison du refus (obligatoire)
                      </span>
                      <textarea
                        name="adminNote"
                        rows={3}
                        required
                        minLength={5}
                        placeholder="On en discute en visio demain. En attendant, tu continues."
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
                    </label>
                    <button
                      type="submit"
                      className="btn btn-ghost w-full justify-center"
                      style={{ color: "#9F1239", borderColor: "#9F1239" }}
                    >
                      Refuser la demande
                    </button>
                  </form>
                </div>
              </details>
            </article>
          ))}
        </div>
      )}

      {decided.length > 0 && (
        <>
          <SectionTitle
            eyebrow="Historique"
            title="Les dernières demandes,"
            italic="tranchées."
          />
          <div className="grid gap-2">
            {decided.map((r) => {
              const v = STATUS_VISUAL[r.status];
              return (
                <Link
                  key={r.id}
                  href={`/app/admin/projects/${r.project.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 no-underline transition flex-wrap"
                  style={{
                    background: v.bg,
                    border: `1px solid ${v.color}`,
                    borderRadius: 8,
                    color: "var(--color-ink)",
                  }}
                >
                  <div>
                    <span
                      className="mono uppercase mr-3"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        color: v.color,
                      }}
                    >
                      {v.label}
                    </span>
                    <span style={{ fontWeight: 500 }}>{r.project.name}</span>
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {r.dev.name ?? r.dev.email}
                    {r.decidedAt &&
                      ` · ${r.decidedAt.toLocaleDateString("fr-BE")}`}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
