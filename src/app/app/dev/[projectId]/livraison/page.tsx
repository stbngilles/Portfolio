import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { submitDelivery, markQAItemFixed } from "./actions";

const STATUS_VISUAL: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "En revue admin", color: "#D4A857", bg: "#FFF8E1" },
  APPROVED: { label: "Validée", color: "#13A66A", bg: "#E6F5EC" },
  NEEDS_CHANGES: { label: "Corrections requises", color: "#9F1239", bg: "#FEE2E2" },
};

export default async function LivraisonPage({
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
        include: { qaItems: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!project) notFound();
  if (role !== "ADMIN" && project.devId !== session.user.id) notFound();

  const submissions = project.deliverySubmissions;
  const latest = submissions[0] ?? null;
  const openQA = latest?.qaItems.filter((q) => !q.fixedAt) ?? [];
  const allFixed = openQA.length === 0;
  const canSubmit = !latest || latest.status === "NEEDS_CHANGES";

  return (
    <div className="wrap py-8 max-w-3xl">
      {/* Dernière soumission */}
      {latest && (
        <div
          className="p-6 mb-8"
          style={{
            background: STATUS_VISUAL[latest.status]?.bg ?? "var(--color-paper)",
            border: `1px solid ${STATUS_VISUAL[latest.status]?.color ?? "var(--color-line)"}`,
            borderRadius: 12,
          }}
        >
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <p className="mono uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.14em", color: STATUS_VISUAL[latest.status]?.color }}>
                · Revue #{latest.round} — {STATUS_VISUAL[latest.status]?.label}
              </p>
              <a
                href={latest.preprodUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="display no-underline"
                style={{ fontSize: 18, color: "var(--color-accent)" }}
              >
                {latest.preprodUrl} ↗
              </a>
            </div>
          </div>

          {latest.adminFeedback && (
            <div className="mb-4 p-4" style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8 }}>
              <p className="mono uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>
                Commentaire admin
              </p>
              <p className="serif-i" style={{ color: "var(--color-ink-soft)" }}>« {latest.adminFeedback} »</p>
            </div>
          )}

          {/* QA Items */}
          {latest.qaItems.length > 0 && (
            <div>
              <p className="mono uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>
                Corrections à apporter ({openQA.length} restante{openQA.length > 1 ? "s" : ""})
              </p>
              <div className="space-y-2">
                {latest.qaItems.map((item) => {
                  const fixed = !!item.fixedAt;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3"
                      style={{
                        background: fixed ? "rgba(19,166,106,0.08)" : "rgba(255,255,255,0.7)",
                        border: `1px solid ${fixed ? "#13A66A" : "var(--color-line)"}`,
                        borderRadius: 8,
                        opacity: fixed ? 0.7 : 1,
                      }}
                    >
                      <form action={markQAItemFixed.bind(null, item.id, session.user.id)}>
                        <input
                          type="checkbox"
                          checked={fixed}
                          readOnly
                          disabled={fixed}
                          onChange={() => {}}
                          style={{ marginTop: 2, accentColor: "var(--color-accent)", cursor: fixed ? "default" : "pointer" }}
                        />
                        {!fixed && (
                          <button type="submit" className="sr-only">
                            Marquer corrigé
                          </button>
                        )}
                      </form>
                      <div className="flex-1">
                        <p className="text-sm" style={{ textDecoration: fixed ? "line-through" : "none" }}>
                          {item.description}
                        </p>
                        {item.priority === "BLOCKING" && !fixed && (
                          <span className="mono uppercase" style={{ fontSize: 9, color: "#9F1239", letterSpacing: "0.14em" }}>
                            BLOQUANT
                          </span>
                        )}
                      </div>
                      {fixed && (
                        <span className="mono text-xs" style={{ color: "#13A66A" }}>✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {!allFixed && (
                <p className="serif-i text-sm mt-3" style={{ color: "var(--color-muted)" }}>
                  Cochez chaque correction pour débloquer la prochaine soumission.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Formulaire de soumission */}
      {canSubmit && allFixed && (
        <div
          className="p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-line)", borderRadius: 12 }}
        >
          <p className="mono uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>
            · {latest ? `Revue #${latest.round + 1} — Nouvelle soumission` : "Première soumission"}
          </p>
          <form action={submitDelivery.bind(null, projectId)} className="space-y-4">
            <label className="block">
              <span className="mono uppercase block mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                URL de pré-production *
              </span>
              <input
                type="url"
                name="preprodUrl"
                required
                placeholder="https://staging.client-site.com"
                className="w-full px-3 py-2 outline-none"
                style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14 }}
              />
            </label>
            <label className="block">
              <span className="mono uppercase block mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                Notes de déploiement * (min. 20 caractères)
              </span>
              <textarea
                name="deploymentNotes"
                required
                minLength={20}
                rows={6}
                placeholder="Ce que vous avez fait, les choix techniques, les points à vérifier en priorité, les dépendances externes (Stripe, etc.)…"
                className="w-full px-3 py-2 outline-none"
                style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
              />
            </label>
            <button type="submit" className="btn btn-primary w-full justify-center">
              Soumettre pour revue admin →
            </button>
          </form>
        </div>
      )}

      {latest?.status === "PENDING" && (
        <div className="p-5 text-center" style={{ background: "#FFF8E1", border: "1px solid #D4A857", borderRadius: 10 }}>
          <p className="serif-i" style={{ color: "#8A6914" }}>
            Votre soumission est en cours de revue par l'admin. Attendez son retour.
          </p>
        </div>
      )}

      {latest?.status === "APPROVED" && (
        <div className="p-5 text-center" style={{ background: "#E6F5EC", border: "1px solid #13A66A", borderRadius: 10 }}>
          <p className="serif-i" style={{ color: "#0D6E46", fontSize: 18 }}>
            Livraison validée par l'agence. ✓
          </p>
          <p className="text-sm mt-2" style={{ color: "#0D6E46" }}>
            Vous pouvez maintenant uploader votre facture.
          </p>
          <Link href={`/app/dev/${projectId}/qa`} className="btn mt-4 inline-block" style={{ background: "#13A66A", color: "white", padding: "8px 16px" }}>
            Voir la checklist finale →
          </Link>
        </div>
      )}
    </div>
  );
}
