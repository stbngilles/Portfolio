import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell, SectionTitle } from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { approveDelivery, requestChanges } from "./actions";

export default async function AdminQAPage() {
  const { session, role } = await requireRole("ADMIN");

  const submissions = await prisma.deliverySubmission.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      project: { select: { id: true, name: true, techStack: true } },
      dev: { select: { name: true, email: true } },
      qaItems: true,
    },
  });

  const recentReviewed = await prisma.deliverySubmission.findMany({
    where: { status: { in: ["APPROVED", "NEEDS_CHANGES"] } },
    orderBy: { reviewedAt: "desc" },
    take: 10,
    include: {
      project: { select: { id: true, name: true } },
      dev: { select: { name: true } },
    },
  });

  return (
    <DashboardShell
      eyebrow="Centre QA"
      title="Les livraisons,"
      italic="à inspecter."
      nav={ADMIN_NAV}
    >
      <SectionTitle
        eyebrow={`${submissions.length} en attente`}
        title="À valider ou corriger,"
        italic="maintenant."
      />

      {submissions.length === 0 ? (
        <div className="p-10 text-center mb-12" style={{ background: "var(--color-paper)", border: "1px dashed var(--color-line)", borderRadius: 12 }}>
          <p className="serif-i" style={{ fontSize: 22, color: "var(--color-muted)" }}>
            Aucune soumission en attente. ✓
          </p>
        </div>
      ) : (
        <div className="grid gap-6 mb-14">
          {submissions.map((sub) => (
            <article
              key={sub.id}
              className="p-6"
              style={{ background: "var(--color-paper)", border: "1px solid #D4A857", borderRadius: 12 }}
            >
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <p className="mono uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#8A6914" }}>
                    · Revue #{sub.round} — {sub.createdAt.toLocaleDateString("fr-BE")}
                  </p>
                  <Link href={`/app/admin/projects/${sub.project.id}`} className="display no-underline" style={{ fontSize: 22, letterSpacing: "-0.02em", color: "var(--color-ink)" }}>
                    {sub.project.name}
                  </Link>
                  <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                    Dev : {sub.dev.name ?? sub.dev.email}
                    {sub.project.techStack && ` · Stack : ${sub.project.techStack}`}
                  </p>
                </div>
                <a
                  href={sub.preprodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent"
                  style={{ padding: "8px 16px", fontSize: 13 }}
                >
                  Ouvrir la pré-prod ↗
                </a>
              </div>

              <div className="p-4 mb-5" style={{ background: "var(--color-bg)", borderRadius: 8, whiteSpace: "pre-wrap", fontSize: 14, color: "var(--color-ink-soft)" }}>
                <p className="mono uppercase mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}>Notes de déploiement</p>
                {sub.deploymentNotes}
              </div>

              <details>
                <summary className="text-sm cursor-pointer mb-4" style={{ color: "var(--color-accent)" }}>
                  Répondre au dev →
                </summary>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {/* Valider */}
                  <form action={approveDelivery} className="space-y-3">
                    <input type="hidden" name="submissionId" value={sub.id} />
                    <div className="p-4" style={{ background: "#E6F5EC", border: "1px solid #13A66A", borderRadius: 8 }}>
                      <p className="font-medium mb-1" style={{ color: "#0D6E46" }}>Valider la livraison</p>
                      <p className="text-xs" style={{ color: "#0D6E46" }}>
                        Le projet passe en "Validé". Le dev peut soumettre sa facture.
                      </p>
                    </div>
                    <button type="submit" className="btn btn-primary w-full justify-center">
                      Approuver ✓
                    </button>
                  </form>

                  {/* Demander des corrections */}
                  <form action={requestChanges} className="space-y-3">
                    <input type="hidden" name="submissionId" value={sub.id} />
                    <label className="block">
                      <span className="mono uppercase block mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                        Commentaire global (optionnel)
                      </span>
                      <input
                        name="feedback"
                        placeholder="Vue d'ensemble de ce qui ne va pas…"
                        className="w-full px-3 py-2 outline-none"
                        style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14 }}
                      />
                    </label>
                    <label className="block">
                      <span className="mono uppercase block mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                        Points à corriger (1 par ligne · `Description | URL_capture | URL_vidéo` — préfixe [BLOQUANT] possible)
                      </span>
                      <textarea
                        name="qaItems"
                        rows={6}
                        placeholder={"[BLOQUANT] Le formulaire de contact ne s'envoie pas | https://loom.com/share/xyz\nLe menu mobile se ferme mal | https://drive.google.com/file/d/abc\nFont de titre incorrecte sur mobile"}
                        className="w-full px-3 py-2 outline-none"
                        style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 13, fontFamily: "monospace", resize: "vertical" }}
                      />
                      <span className="text-xs block mt-1" style={{ color: "var(--color-subtle)" }}>
                        Astuce : enregistrez une vidéo Loom du bug et collez l'URL après un `|`. Le dev verra le lien dans sa checklist QA.
                      </span>
                    </label>
                    <button type="submit" className="btn btn-ghost w-full justify-center" style={{ color: "#9F1239", borderColor: "#9F1239" }}>
                      Demander des corrections
                    </button>
                  </form>
                </div>
              </details>
            </article>
          ))}
        </div>
      )}

      {recentReviewed.length > 0 && (
        <>
          <SectionTitle eyebrow="Historique" title="Déjà tranchées," italic="récemment." />
          <div className="grid gap-2">
            {recentReviewed.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-4 py-3 flex-wrap gap-2"
                style={{
                  background: s.status === "APPROVED" ? "#E6F5EC" : "#FEE2E2",
                  border: `1px solid ${s.status === "APPROVED" ? "#13A66A" : "#9F1239"}`,
                  borderRadius: 8,
                }}
              >
                <p style={{ fontWeight: 500 }}>{s.project.name}</p>
                <span className="mono uppercase text-xs" style={{ color: s.status === "APPROVED" ? "#0D6E46" : "#9F1239" }}>
                  {s.status === "APPROVED" ? "Approuvée" : "Corrections"} · Revue #{s.round}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
