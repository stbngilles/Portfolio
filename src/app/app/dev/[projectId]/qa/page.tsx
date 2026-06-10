import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { markQAItemFixed } from "../livraison/actions";

export default async function DevQAPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { session, role } = await requireRole("DEV", "ADMIN");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      deliverySubmissions: {
        orderBy: { round: "desc" },
        take: 1,
        include: { qaItems: { orderBy: [{ fixedAt: "asc" }, { order: "asc" }] } },
      },
    },
  });
  if (!project) notFound();
  if (role !== "ADMIN" && project.devId !== session.user.id) notFound();

  const latest = project.deliverySubmissions[0];

  if (!latest) {
    return (
      <div className="wrap py-12 text-center">
        <p className="serif-i" style={{ fontSize: 20, color: "var(--color-muted)" }}>
          Aucune soumission encore — soumettez d'abord votre livraison.
        </p>
      </div>
    );
  }

  const open = latest.qaItems.filter((q) => !q.fixedAt);
  const done = latest.qaItems.filter((q) => !!q.fixedAt);
  const allFixed = open.length === 0;

  return (
    <div className="wrap py-8 max-w-3xl">
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
        <div>
          <p className="mono uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>
            Checklist QA — Revue #{latest.round}
          </p>
          <a
            href={latest.preprodUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm no-underline"
            style={{ color: "var(--color-accent)" }}
          >
            {latest.preprodUrl} ↗
          </a>
        </div>
        <div className="text-right">
          <p className="display" style={{ fontSize: 28, color: allFixed ? "#13A66A" : "var(--color-accent)", letterSpacing: "-0.02em" }}>
            {done.length}/{latest.qaItems.length}
          </p>
          <p className="mono text-xs" style={{ color: "var(--color-subtle)", letterSpacing: "0.14em" }}>
            CORRECTIONS
          </p>
        </div>
      </div>

      {latest.qaItems.length === 0 ? (
        <div className="p-10 text-center" style={{ background: "var(--color-paper)", border: "1px dashed var(--color-line)", borderRadius: 12 }}>
          <p className="serif-i" style={{ fontSize: 20, color: "var(--color-muted)" }}>
            L'admin n'a pas encore créé de points QA.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Open */}
          {open.map((item) => {
            const isBlocking = item.priority === "BLOCKING";
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4"
                style={{
                  background: isBlocking ? "#FEE2E2" : "var(--color-paper)",
                  border: `1px solid ${isBlocking ? "#9F1239" : "var(--color-line)"}`,
                  borderRadius: 10,
                }}
              >
                <form action={markQAItemFixed.bind(null, item.id, session.user.id)} className="pt-0.5">
                  <button
                    type="submit"
                    className="w-5 h-5 flex items-center justify-center"
                    style={{
                      background: "transparent",
                      border: `2px solid ${isBlocking ? "#9F1239" : "var(--color-muted)"}`,
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    title="Marquer comme corrigé"
                  />
                </form>
                <div className="flex-1">
                  <p style={{ fontSize: 14, color: "var(--color-ink)" }}>{item.description}</p>
                  {item.attachmentUrls && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.attachmentUrls.split("\n").filter(Boolean).map((url, i) => {
                        const isVideo = /loom\.com|youtube|youtu\.be|vimeo|\.mp4|\.mov/i.test(url);
                        return (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mono no-underline"
                            style={{
                              fontSize: 10,
                              letterSpacing: "0.1em",
                              padding: "3px 8px",
                              background: "var(--color-accent-soft)",
                              color: "var(--color-accent-ink)",
                              border: "1px solid var(--color-accent)",
                              borderRadius: 4,
                            }}
                          >
                            {isVideo ? "▶ Voir la vidéo" : "📎 Voir la capture"} ↗
                          </a>
                        );
                      })}
                    </div>
                  )}
                  {isBlocking && (
                    <span className="mono uppercase block mt-1" style={{ fontSize: 9, letterSpacing: "0.14em", color: "#9F1239" }}>
                      BLOQUANT — à corriger en priorité
                    </span>
                  )}
                </div>
                <span
                  className="mono uppercase"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: isBlocking ? "#9F1239" : "var(--color-bg)",
                    color: isBlocking ? "white" : "var(--color-subtle)",
                  }}
                >
                  {item.priority}
                </span>
              </div>
            );
          })}
          {/* Done */}
          {done.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 opacity-60"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", borderRadius: 10 }}
            >
              <span style={{ color: "#13A66A", fontSize: 16 }}>✓</span>
              <p className="text-sm" style={{ textDecoration: "line-through", color: "var(--color-muted)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {allFixed && latest.qaItems.length > 0 && (
        <div className="mt-8 p-5 text-center" style={{ background: "#E6F5EC", border: "1px solid #13A66A", borderRadius: 10 }}>
          <p className="serif-i" style={{ color: "#0D6E46", fontSize: 18 }}>
            Toutes les corrections sont validées. ✓
          </p>
          <p className="text-sm mt-1" style={{ color: "#0D6E46" }}>
            Vous pouvez re-soumettre pour validation finale.
          </p>
        </div>
      )}
    </div>
  );
}
