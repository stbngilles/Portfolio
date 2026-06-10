import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/platform/DashboardShell";
import { clientValidateStage } from "@/app/app/admin/projects/actions";
import type { StageStatus } from "@/lib/stages";
import { CLIENT_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";

// Étapes où le client valide vraiment (design, relecture, mise en ligne)
// Les autres (brief, dev, contenu) sont gérées en interne.
const CLIENT_VALIDATES = new Set(["design", "review", "live"]);

const STATUS_VISUAL: Record<StageStatus, { bg: string; border: string; text: string; dot: string; tag: string }> = {
  PENDING:           { bg: "transparent",              border: "var(--color-line)",   text: "var(--color-subtle)", dot: "var(--color-line)",   tag: "À venir" },
  IN_PROGRESS:       { bg: "var(--color-paper)",        border: "var(--color-ink)",    text: "var(--color-ink)",    dot: "#D4A857",             tag: "En cours ●" },
  NEEDS_VALIDATION:  { bg: "#FFF8E1",                   border: "#D4A857",             text: "#8A6914",             dot: "#D4A857",             tag: "Votre accord requis" },
  VALIDATED:         { bg: "#F0FAF5",                   border: "#13A66A",             text: "#0D6E46",             dot: "#13A66A",             tag: "Validé ✓" },
};

export default async function ClientHome() {
  const { session, role } = await requireRole("CLIENT", "ADMIN");

  const [project, unpaidInvoices, openTickets] = await Promise.all([
    prisma.project.findFirst({
      where: { clientId: session.user.id },
      include: {
        stages: { orderBy: { order: "asc" } },
        subscription: { select: { monthlyAmount: true, plan: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { clientId: session.user.id, status: { in: ["SENT", "OVERDUE"] } },
      select: { id: true, number: true, amount: true, status: true, dueDate: true },
    }),
    prisma.ticket.count({
      where: { authorId: session.user.id, status: "OPEN" },
    }),
  ]);

  const firstName = (session.user.name ?? "").split(" ")[0] || "vous";
  const doneStages  = project?.stages.filter((s) => s.status === "VALIDATED").length ?? 0;
  const totalStages = project?.stages.length ?? 0;
  const progressPct = totalStages > 0 ? Math.round((doneStages / totalStages) * 100) : 0;
  const isLive      = project?.status === "LIVE";

  // L'étape qui attend la validation DU CLIENT (pas juste n'importe qui)
  const needsClientValidation = project?.stages.find(
    (s) => s.status === "NEEDS_VALIDATION" && CLIENT_VALIDATES.has(s.key),
  );

  // Étape en cours (pour afficher dans le titre)
  const currentStage = project?.stages.find((s) => s.status === "IN_PROGRESS" || s.status === "NEEDS_VALIDATION");

  return (
    <DashboardShell
      eyebrow="Votre espace"
      title={`Bonjour ${firstName},`}
      italic={isLive ? "votre site est en ligne." : "voici où on en est."}
      nav={CLIENT_NAV}
    >
      {/* ── Alerte validation ────────────────────────────────────── */}
      {needsClientValidation && (
        <div
          style={{
            background: "#FFF8E1",
            border: "2px solid #D4A857",
            borderRadius: 10,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <p style={{ fontWeight: 700, color: "#8A6914", fontSize: 15, marginBottom: 6 }}>
            ⚡ Votre accord est requis — {needsClientValidation.label}
          </p>

          {/* Message de l'équipe */}
          {needsClientValidation.validationNote && (
            <p style={{ fontSize: 14, color: "#8A6914", marginBottom: 10, lineHeight: 1.6 }}>
              {needsClientValidation.validationNote}
            </p>
          )}

          {/* Lien vers la démo */}
          {needsClientValidation.validationUrl && (
            <a
              href={needsClientValidation.validationUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "white",
                background: "#D4A857",
                padding: "8px 16px",
                borderRadius: 7,
                textDecoration: "none",
                marginBottom: 14,
              }}
            >
              Voir la démo / maquette ↗
            </a>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: needsClientValidation.validationUrl ? 0 : 8 }}>
            <form action={clientValidateStage}>
              <input type="hidden" name="stageId" value={needsClientValidation.id} />
              <button
                type="submit"
                style={{
                  padding: "10px 22px",
                  background: "#D4A857",
                  color: "white",
                  border: "none",
                  borderRadius: 7,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✓ Je valide, on peut continuer
              </button>
            </form>
            <p style={{ fontSize: 12, color: "#8A6914", alignSelf: "center", fontStyle: "italic" }}>
              Des remarques ? Contactez-nous avant de valider.
            </p>
          </div>
        </div>
      )}

      {/* ── Factures impayées ─────────────────────────────────────── */}
      {unpaidInvoices.length > 0 && (
        <div
          style={{
            background: "#FEE2E2",
            border: "1px solid #9F1239",
            borderRadius: 10,
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontWeight: 600, color: "#7B1024", fontSize: 14 }}>
            💳 {unpaidInvoices.length} facture{unpaidInvoices.length > 1 ? "s" : ""} en attente —{" "}
            {formatPrice(unpaidInvoices.reduce((s, i) => s + i.amount, 0))}
          </p>
          <Link
            href="/app/client/factures"
            style={{ fontSize: 13, padding: "6px 14px", background: "#9F1239", color: "white", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}
          >
            Payer →
          </Link>
        </div>
      )}

      {/* ── Projet ────────────────────────────────────────────────── */}
      {project ? (
        <div style={{ marginBottom: 36 }}>
          {/* En-tête + barre de progression */}
          <div
            style={{
              background: isLive ? "#E6F5EC" : "var(--color-paper)",
              border: `1px solid ${isLive ? "#13A66A" : "var(--color-line)"}`,
              borderRadius: 10,
              padding: "20px 24px",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: isLive ? "#0D6E46" : "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 4 }}>
                  {isLive ? "🟢 En ligne" : currentStage ? `En cours · ${currentStage.label}` : project.status}
                </p>
                <h3 style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-0.01em", color: isLive ? "#0D6E46" : "var(--color-ink)" }}>
                  {project.name}
                </h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: isLive ? "#13A66A" : "var(--color-accent)", lineHeight: 1 }}>
                  {progressPct}%
                </p>
                <p style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-geist)" }}>
                  {doneStages}/{totalStages} étapes
                </p>
              </div>
            </div>
            <div style={{ height: 6, background: "var(--color-line)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: isLive ? "#13A66A" : "var(--color-accent)", borderRadius: 999, transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Étapes — avec logique de validation intelligente */}
          <ol style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {project.stages.map((s) => {
              const v = STATUS_VISUAL[s.status as StageStatus];
              const isClientStage    = CLIENT_VALIDATES.has(s.key);
              const needsValidation  = s.status === "NEEDS_VALIDATION";

              return (
                <li
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 18px",
                    background: v.bg,
                    border: `1px solid ${v.border}`,
                    borderRadius: 9,
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.dot, flexShrink: 0 }} />
                    <div>
                      <p style={{
                        fontWeight: (needsValidation && isClientStage) || s.status === "IN_PROGRESS" ? 600 : 400,
                        fontSize: 14,
                        color: v.text,
                      }}>
                        {s.label}
                        {/* Indiquer discrètement si étape purement interne */}
                        {!isClientStage && s.status !== "VALIDATED" && (
                          <span style={{ fontSize: 10, color: "var(--color-subtle)", fontWeight: 400, marginLeft: 8, fontStyle: "italic" }}>
                            (interne)
                          </span>
                        )}
                      </p>
                      {s.validatedAt && (
                        <p style={{ fontSize: 11, color: "#13A66A", marginTop: 2, fontFamily: "var(--font-geist)" }}>
                          Validé le {s.validatedAt.toLocaleDateString("fr-BE")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: v.text, fontFamily: "var(--font-geist)", fontWeight: 500 }}>
                      {v.tag}
                    </span>
                    {/* Bouton validation UNIQUEMENT pour les étapes client */}
                    {needsValidation && isClientStage && (
                      <form action={clientValidateStage}>
                        <input type="hidden" name="stageId" value={s.id} />
                        <button
                          type="submit"
                          style={{
                            fontSize: 12,
                            padding: "5px 14px",
                            background: "#D4A857",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Valider →
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <div style={{ background: "var(--color-paper)", border: "1px dashed var(--color-line)", borderRadius: 12, padding: "40px 24px", textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 20, color: "var(--color-muted)", fontStyle: "italic", marginBottom: 8 }}>
            Aucun projet en cours pour le moment.
          </p>
          <p style={{ fontSize: 13, color: "var(--color-subtle)" }}>
            Si vous venez de signer, votre projet apparaîtra ici sous 24 h.
          </p>
        </div>
      )}

      {/* ── Raccourcis ────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        <QuickCard href="/app/client/factures"  icon="💳" title="Mes factures"  desc={unpaidInvoices.length > 0 ? `${unpaidInvoices.length} en attente` : "À jour"} alert={unpaidInvoices.length > 0} />
        <QuickCard href="/app/client/tickets"   icon="🎫" title="Mes demandes" desc={openTickets > 0 ? `${openTickets} ouverte${openTickets > 1 ? "s" : ""}` : "Créer une demande"} alert={openTickets > 0} />
        <QuickCard href="/app/client/assets"    icon="📁" title="Mes fichiers"  desc="Logo, photos, textes" />
        <QuickCard href="/app/client/profil"    icon="👤" title="Mon profil"    desc="Mes informations" />
        <QuickCard href="/app/client/documents" icon="📄" title="Documents"     desc="Contrats, devis" />
        {project?.subscription && (
          <QuickCard href="/app/client/stats" icon="📈" title="Abonnement" desc={`${formatPrice(project.subscription.monthlyAmount)}/mois`} />
        )}
      </div>
    </DashboardShell>
  );
}

function QuickCard({ href, icon, title, desc, alert }: { href: string; icon: string; title: string; desc: string; alert?: boolean }) {
  return (
    <Link href={href} className="no-underline block" style={{ background: "var(--color-paper)", border: `1px solid ${alert ? "#D4A857" : "var(--color-line)"}`, borderRadius: 10, padding: "16px 18px", color: "var(--color-ink)" }}>
      <span style={{ fontSize: 20, display: "block", marginBottom: 8 }}>{icon}</span>
      <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{title}</p>
      <p style={{ fontSize: 12, color: alert ? "#8A6914" : "var(--color-muted)" }}>{desc}</p>
    </Link>
  );
}
