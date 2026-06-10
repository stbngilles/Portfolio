import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/pricing";
import { advanceStage } from "./stage-actions";

/* ── Labels d'étape ─────────────────────────────────────────────── */
const STAGE_STATUS_LABELS: Record<string, string> = {
  PENDING: "À venir",
  IN_PROGRESS: "En cours",
  NEEDS_VALIDATION: "En attente de validation client",
  VALIDATED: "Validé ✓",
};

const STAGE_DOT: Record<string, string> = {
  PENDING: "var(--color-line)",
  IN_PROGRESS: "#D4A857",
  NEEDS_VALIDATION: "var(--color-accent)",
  VALIDATED: "#13A66A",
};

/* ── Libellés des champs d'onboarding ─────────────────────────────*/
const ONBOARDING_LABELS: Record<string, string> = {
  company_pitch: "Pitch entreprise",
  target_audience: "Cible",
  main_goal: "Objectif n°1 du site",
  unique_voice: "Ce qui doit ressortir",
  tone: "Ton souhaité",
  assets_status: "État des assets",
  competitors_to_avoid: "Sites à ne pas imiter",
  deadline_constraints: "Contraintes deadline",
  reservation_buffer: "Pause réservations",
  stripe_products: "Produits en ligne",
};

/* ── Helpers ─────────────────────────────────────────────────────── */
type BriefParsed = {
  // Notes de l'appel (nouveau format : d.brief.callNotes)
  callNotes: string;
  brandColors: string;
  brandPersonality: string;
  siteReferences: string;
  sitesToAvoid: string;
  technicalRequirements: string;
  specificRequests: string;
  estimatedDays: number | null;
  // Notes kickoff (ancien format : d.kickoffNotes)
  kickoffNotes: string;
  // Réponses onboarding client (d.onboarding)
  onboarding: Record<string, string>;
};

function parseBriefData(raw: string | null | undefined): BriefParsed {
  const empty: BriefParsed = {
    callNotes: "", brandColors: "", brandPersonality: "",
    siteReferences: "", sitesToAvoid: "", technicalRequirements: "",
    specificRequests: "", estimatedDays: null,
    kickoffNotes: "", onboarding: {},
  };
  if (!raw) return empty;
  try {
    const d = JSON.parse(raw);
    const b = d.brief ?? {};
    return {
      callNotes:              b.callNotes              ?? "",
      brandColors:            b.brandColors            ?? "",
      brandPersonality:       b.brandPersonality       ?? "",
      siteReferences:         b.siteReferences         ?? "",
      sitesToAvoid:           b.sitesToAvoid           ?? "",
      technicalRequirements:  b.technicalRequirements  ?? "",
      specificRequests:       b.specificRequests       ?? "",
      estimatedDays:          b.estimatedDays          ?? null,
      kickoffNotes:           d.kickoffNotes           ?? "",
      onboarding:             d.onboarding             ?? {},
    };
  } catch {
    return empty;
  }
}

export default async function DevProjectHub({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { session, role } = await requireRole("DEV", "ADMIN");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: { select: { name: true, email: true } },
      stages: { orderBy: { order: "asc" } },
      blockerReports: {
        where: { status: "OPEN" },
        take: 3,
      },
      messages: {
        where: { readAt: null, senderRole: "ADMIN" },
      },
      deliverySubmissions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { qaItems: true },
      },
      quote: {
        select: {
          number: true,
          lines: {
            select: { label: true, category: true, quantity: true },
          },
        },
      },
    },
  });

  if (!project) notFound();

  const unreadMessages = project.messages.length;
  const openBlockers = project.blockerReports.length;
  const lastDelivery = project.deliverySubmissions[0] ?? null;
  const openQA = lastDelivery?.qaItems.filter((q) => !q.fixedAt).length ?? 0;
  const pendingMaintenance = 0; // dev ne fait pas la maintenance
  const isLive = project.status === "LIVE";

  const brief = parseBriefData(project.briefData);

  // Scope dev = uniquement ce qui est à développer (SITE)
  const scope =
    project.quote?.lines
      .filter((l) => l.category === "SITE")
      .map((l) => (l.quantity > 1 ? `${l.label} × ${l.quantity}` : l.label)) ?? [];

  const doneStages = project.stages.filter((s) => s.status === "VALIDATED").length;
  const totalStages = project.stages.length;
  const progressPct = totalStages > 0 ? Math.round((doneStages / totalStages) * 100) : 0;

  // Le brief est toujours affiché — vide ou pas. Le dev doit toujours savoir
  // ce qu'on attend de lui, même si l'admin n'a pas encore rempli les notes.
  const hasBriefContent =
    brief.callNotes.length > 0 ||
    brief.kickoffNotes.length > 0 ||
    brief.brandColors.length > 0 ||
    brief.brandPersonality.length > 0 ||
    brief.siteReferences.length > 0 ||
    brief.specificRequests.length > 0 ||
    Object.values(brief.onboarding).some((v) => v);

  return (
    <div className="wrap" style={{ paddingTop: 32, paddingBottom: 80 }}>

      {/* Bannière LIVE */}
      {isLive && (
        <div
          style={{
            background: "#E6F5EC",
            border: "1px solid #13A66A",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 20 }}>🎉</span>
          <p style={{ color: "#0D6E46", fontWeight: 500 }}>
            Ce projet est en ligne depuis le{" "}
            {project.liveAt?.toLocaleDateString("fr-BE") ?? "—"}. Beau travail !
          </p>
        </div>
      )}

      {/* Raccourcis d'alerte */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <QuickLink
          href={`/app/dev/${projectId}/messages`}
          label="Messages admin"
          value={
            unreadMessages > 0
              ? `${unreadMessages} non lu${unreadMessages > 1 ? "s" : ""}`
              : "À jour"
          }
          alert={unreadMessages > 0}
          alertColor="var(--color-accent)"
        />
        <QuickLink
          href={`/app/dev/${projectId}/livraison`}
          label="Livraison"
          value={
            lastDelivery?.status === "APPROVED"
              ? "Validée ✓"
              : lastDelivery?.status === "NEEDS_CHANGES"
              ? `${openQA} correction${openQA > 1 ? "s" : ""}`
              : lastDelivery
              ? "En review"
              : "Pas encore soumise"
          }
          alert={lastDelivery?.status === "NEEDS_CHANGES"}
          alertColor="#D4A857"
        />
        <QuickLink
          href={`/app/dev/${projectId}/bloquer`}
          label="Signaler un blocage"
          value={openBlockers > 0 ? `${openBlockers} ouvert${openBlockers > 1 ? "s" : ""}` : "Aucun"}
          alert={openBlockers > 0}
          alertColor="#9F1239"
        />
        <QuickLink
          href={`/app/dev/${projectId}/trousseau`}
          label="Accès & trousseau"
          value="Voir les accès →"
          alertColor="#7B5BFF"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Colonne principale ─────────────────────────────────── */}
        <div style={{ gridColumn: "1 / 3" }}>

          {/* Avancement */}
          <Section label="Avancement du projet">
            {/* Barre */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "var(--color-muted)" }}>
                  {doneStages}/{totalStages} étapes terminées
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-accent)" }}>
                  {progressPct} %
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "var(--color-line)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "var(--color-accent)",
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>

            {/* Étapes */}
            <div
              style={{
                border: "1px solid var(--color-line)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {project.stages.map((stage, idx) => {
                const isDone = stage.status === "VALIDATED";
                const isActive = stage.status === "IN_PROGRESS";
                const isWaiting = stage.status === "NEEDS_VALIDATION";
                const isPending = stage.status === "PENDING";

                return (
                  <div
                    key={stage.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "13px 18px",
                      borderBottom:
                        idx < project.stages.length - 1
                          ? "1px solid var(--color-line)"
                          : "none",
                      background: isDone
                        ? "#F0FAF5"
                        : isActive
                        ? "#FFFBEF"
                        : "var(--color-paper)",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Statut + label */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: STAGE_DOT[stage.status] ?? "var(--color-line)",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontWeight: isActive || isWaiting ? 600 : 400,
                            fontSize: 14,
                            color: isDone
                              ? "#0D6E46"
                              : isPending
                              ? "var(--color-muted)"
                              : "var(--color-ink)",
                          }}
                        >
                          {stage.label}
                        </p>
                        {stage.validatedAt && (
                          <p style={{ fontSize: 11, color: "#13A66A", marginTop: 2 }}>
                            Validé le {stage.validatedAt.toLocaleDateString("fr-BE")}
                          </p>
                        )}
                        {isWaiting && (
                          <p style={{ fontSize: 11, color: "var(--color-accent)", marginTop: 2 }}>
                            En attente de validation client
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {!isDone && !isWaiting && isPending && (
                        <form action={advanceStage}>
                          <input type="hidden" name="stageId" value={stage.id} />
                          <input type="hidden" name="status" value="IN_PROGRESS" />
                          <button
                            type="submit"
                            style={{
                              fontSize: 12,
                              padding: "5px 12px",
                              background: "#FFFBEF",
                              border: "1px solid #D4A857",
                              color: "#8A6914",
                              borderRadius: 5,
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                          >
                            Démarrer →
                          </button>
                        </form>
                      )}
                      {isActive && (
                        <details>
                          <summary
                            style={{
                              fontSize: 12,
                              padding: "5px 12px",
                              background: "var(--color-accent-soft)",
                              border: "1px solid var(--color-accent)",
                              color: "var(--color-accent-ink)",
                              borderRadius: 5,
                              cursor: "pointer",
                              fontWeight: 500,
                              listStyle: "none",
                              display: "inline-block",
                            }}
                          >
                            Soumettre pour validation →
                          </summary>
                          <form
                            action={advanceStage}
                            style={{
                              marginTop: 10,
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                              background: "var(--color-paper)",
                              border: "1px solid var(--color-accent)",
                              borderRadius: 8,
                              padding: "12px 14px",
                            }}
                          >
                            <input type="hidden" name="stageId" value={stage.id} />
                            <input type="hidden" name="status" value="NEEDS_VALIDATION" />
                            <p style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-geist)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                              Ce que tu as fait
                            </p>
                            <textarea
                              name="devNote"
                              rows={3}
                              required
                              placeholder="Décris ce qui est terminé, les choix faits, ce que l'admin doit vérifier…"
                              style={{
                                padding: "8px 10px",
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-line)",
                                borderRadius: 6,
                                fontSize: 13,
                                fontFamily: "inherit",
                                resize: "vertical",
                                outline: "none",
                                lineHeight: 1.55,
                              }}
                            />
                            <input
                              type="url"
                              name="devUrl"
                              placeholder="Lien de review (Figma, staging, Loom…)"
                              style={{
                                padding: "7px 10px",
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-line)",
                                borderRadius: 6,
                                fontSize: 13,
                                outline: "none",
                              }}
                            />
                            <button
                              type="submit"
                              style={{
                                padding: "8px 16px",
                                background: "var(--color-accent)",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Envoyer pour validation →
                            </button>
                          </form>
                        </details>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── Brief — toujours affiché ──────────────────────── */}
          <Section label="Brief du projet" style={{ marginTop: 24 }}>

            {!hasBriefContent ? (
              /* Kickoff marqué fait mais notes pas encore remplies */
              <div
                style={{
                  background: "#FFF8E1",
                  border: "1px solid #D4A857",
                  borderRadius: 8,
                  padding: "16px 18px",
                }}
              >
                <p style={{ fontWeight: 600, color: "#8A6914", marginBottom: 4 }}>
                  ⏳ Notes de brief pas encore renseignées
                </p>
                <p style={{ fontSize: 13, color: "#8A6914", lineHeight: 1.5 }}>
                  Le brief call a été marqué comme fait mais les notes n&apos;ont pas encore été saisies.
                  {role === "ADMIN" && (
                    <>
                      {" "}
                      <a
                        href={`/app/admin/brief/${projectId}`}
                        style={{ color: "#8A6914", fontWeight: 700, textDecoration: "underline" }}
                      >
                        Remplir les notes maintenant →
                      </a>
                    </>
                  )}
                  {role !== "ADMIN" && " Contactez votre chargé de compte."}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                {/* Notes brutes de l'appel (nouveau format) */}
                {brief.callNotes && (
                  <div
                    style={{
                      background: "var(--color-accent-soft)",
                      border: "1px solid var(--color-accent)",
                      borderRadius: 8,
                      padding: "16px 18px",
                    }}
                  >
                    <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-accent-ink)", fontFamily: "var(--font-geist)", marginBottom: 8, fontWeight: 600 }}>
                      📞 Notes de l&apos;appel de brief
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-ink)", whiteSpace: "pre-wrap" }}>
                      {brief.callNotes}
                    </p>
                  </div>
                )}

                {/* Notes kick-off (ancien format) */}
                {brief.kickoffNotes && !brief.callNotes && (
                  <div
                    style={{
                      background: "var(--color-accent-soft)",
                      border: "1px solid var(--color-accent)",
                      borderRadius: 8,
                      padding: "16px 18px",
                    }}
                  >
                    <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-accent-ink)", fontFamily: "var(--font-geist)", marginBottom: 8, fontWeight: 600 }}>
                      📞 Notes de cadrage
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-ink)", whiteSpace: "pre-wrap" }}>
                      {brief.kickoffNotes}
                    </p>
                  </div>
                )}

                {/* Champs structurés du brief */}
                {(brief.brandColors || brief.brandPersonality || brief.siteReferences || brief.sitesToAvoid || brief.technicalRequirements || brief.specificRequests) && (
                  <div
                    style={{
                      border: "1px solid var(--color-line)",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    {[
                      { key: "brandColors",           icon: "🎨", label: "Couleurs",              value: brief.brandColors },
                      { key: "brandPersonality",       icon: "✨", label: "Ambiance / ton",         value: brief.brandPersonality },
                      { key: "siteReferences",         icon: "👍", label: "Sites aimés",            value: brief.siteReferences },
                      { key: "sitesToAvoid",           icon: "👎", label: "À éviter",               value: brief.sitesToAvoid },
                      { key: "technicalRequirements",  icon: "⚙️", label: "Contraintes tech",       value: brief.technicalRequirements },
                      { key: "specificRequests",       icon: "📌", label: "Demandes spécifiques",   value: brief.specificRequests },
                    ]
                      .filter((row) => row.value)
                      .map((row, i, arr) => (
                        <div
                          key={row.key}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "170px 1fr",
                            gap: 12,
                            padding: "11px 16px",
                            borderBottom: i < arr.length - 1 ? "1px solid var(--color-line)" : "none",
                            alignItems: "flex-start",
                            background: i % 2 === 0 ? "var(--color-paper)" : "var(--color-bg)",
                          }}
                        >
                          <p style={{ fontSize: 12, color: "var(--color-muted)", fontFamily: "var(--font-geist)", paddingTop: 1 }}>
                            {row.icon} {row.label}
                          </p>
                          <p style={{ fontSize: 13, color: "var(--color-ink)", lineHeight: 1.55 }}>
                            {row.value}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                {/* Réponses onboarding client */}
                {Object.entries(brief.onboarding).filter(([, v]) => v).length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 8 }}>
                      Questionnaire client
                    </p>
                    <div style={{ border: "1px solid var(--color-line)", borderRadius: 8, overflow: "hidden" }}>
                      {Object.entries(brief.onboarding)
                        .filter(([, v]) => v)
                        .map(([key, value], i, arr) => (
                          <div
                            key={key}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "160px 1fr",
                              gap: 12,
                              padding: "11px 16px",
                              borderBottom: i < arr.length - 1 ? "1px solid var(--color-line)" : "none",
                              alignItems: "flex-start",
                              background: i % 2 === 0 ? "var(--color-paper)" : "var(--color-bg)",
                            }}
                          >
                            <p style={{ fontSize: 11, fontFamily: "var(--font-geist)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", paddingTop: 2 }}>
                              {ONBOARDING_LABELS[key] ?? key}
                            </p>
                            <p style={{ fontSize: 13, color: "var(--color-ink)", lineHeight: 1.5 }}>
                              {value}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </Section>

          {/* Maintenance — supprimé : le dev ne fait pas la maintenance */}
          {false && pendingMaintenance > 0 && (
            <div />
          )}
        </div>

        {/* ── Colonne latérale ──────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Rémunération */}
          <SideCard>
            <SideLabel>Rémunération</SideLabel>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color:
                  project.devPaymentAmount === 0
                    ? "var(--color-muted)"
                    : project.devPaymentAmount
                    ? "var(--color-accent-ink)"
                    : "var(--color-subtle)",
                marginBottom: 6,
              }}
            >
              {project.devPaymentAmount === 0
                ? "0 € (admin)"
                : project.devPaymentAmount
                ? formatPrice(project.devPaymentAmount)
                : "À négocier"}
            </p>
            <p style={{ fontSize: 12, color: "var(--color-muted)" }}>
              {project.devPaymentStatus === "PAID"
                ? "✓ Versé"
                : project.devPaymentStatus === "APPROVED"
                ? "Approuvé — virement en cours"
                : "En attente d'approbation"}
            </p>
          </SideCard>

          {/* Deadline + Stack */}
          <SideCard>
            <SideLabel>Deadline</SideLabel>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--color-ink)", marginBottom: 8 }}>
              {project.deadline
                ? project.deadline.toLocaleDateString("fr-BE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Non définie"}
            </p>
            {project.techStack && (
              <>
                <SideLabel style={{ marginTop: 12 }}>Stack</SideLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
                  {project.techStack.split(/[,;]/).map((t, i) => {
                    const trimmed = t.trim();
                    if (!trimmed) return null;
                    return (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          padding: "3px 8px",
                          background: "var(--color-accent-soft)",
                          color: "var(--color-accent-ink)",
                          border: "1px solid var(--color-accent)",
                          borderRadius: 4,
                          fontFamily: "var(--font-geist)",
                        }}
                      >
                        {trimmed}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </SideCard>

          {/* Scope */}
          {scope.length > 0 && (
            <SideCard>
              <SideLabel>Scope</SideLabel>
              <ul style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
                {scope.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 13,
                      color: "var(--color-ink)",
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    <span style={{ color: "var(--color-accent)" }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
              {project.quote && (
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-muted)",
                    marginTop: 10,
                    fontFamily: "var(--font-geist)",
                  }}
                >
                  Réf. {project.quote.number}
                </p>
              )}
            </SideCard>
          )}

          {/* Actions rapides */}
          <SideCard style={{ padding: 0, overflow: "hidden" }}>
            {[
              {
                href: `/app/dev/${projectId}/qa`,
                label: "Rapport QA",
                badge: openQA > 0 ? `${openQA}` : null,
              },
              { href: `/app/dev/${projectId}/livraison`, label: "Soumettre la livraison" },
              { href: `/app/dev/${projectId}/facture`, label: "Déposer ma facture" },
              { href: `/app/dev/${projectId}/trousseau`, label: "Accès & trousseau" },
            ].map((link, i, arr) => (
              <Link
                key={i}
                href={link.href}
                className="no-underline flex items-center justify-between"
                style={{
                  padding: "12px 16px",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--color-line)" : "none",
                  color: "var(--color-ink)",
                  fontSize: 14,
                  background: "transparent",
                }}
              >
                <span style={{ fontWeight: 500 }}>{link.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {link.badge && (
                    <span
                      style={{
                        background: "#D4A857",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: 999,
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                  <span style={{ color: "var(--color-accent)", fontSize: 13 }}>→</span>
                </div>
              </Link>
            ))}
          </SideCard>
        </div>
      </div>
    </div>
  );
}

/* ── Composants utilitaires ───────────────────────────────────── */

function Section({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      <p
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-muted)",
          fontFamily: "var(--font-geist)",
          marginBottom: 12,
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function SideCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 10,
        padding: "16px 18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SideLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--color-muted)",
        fontFamily: "var(--font-geist)",
        marginBottom: 4,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function QuickLink({
  href,
  label,
  value,
  alert,
  alertColor,
}: {
  href: string;
  label: string;
  value: string;
  alert?: boolean;
  alertColor: string;
}) {
  return (
    <Link
      href={href}
      className="no-underline block"
      style={{
        background: alert
          ? `color-mix(in srgb, ${alertColor} 8%, var(--color-paper))`
          : "var(--color-paper)",
        border: `1px solid ${alert ? alertColor : "var(--color-line)"}`,
        borderRadius: 10,
        padding: "14px 16px",
        color: "var(--color-ink)",
      }}
    >
      <p
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-muted)",
          fontFamily: "var(--font-geist)",
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontWeight: 600,
          fontSize: 13,
          color: alert ? alertColor : "var(--color-ink)",
        }}
      >
        {value}
      </p>
    </Link>
  );
}
