import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { DEV_NAV } from "@/lib/platform-nav";
import { claimProject } from "../actions";
import { formatPrice } from "@/lib/pricing";

const POOL_STATUSES = ["READY_FOR_DEV"];

const ACTIVE_STATUSES = ["READY_FOR_DEV", "BRIEFING", "DESIGN", "DEV", "CONTENT"];

function relativeDeadline(deadline: Date): { label: string; tone: "ok" | "tight" | "late" } {
  const now = new Date();
  const ms = deadline.getTime() - now.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: `Retard de ${Math.abs(days)} j`, tone: "late" };
  if (days === 0) return { label: "Aujourd'hui", tone: "tight" };
  if (days <= 7) return { label: `Dans ${days} j`, tone: "tight" };
  return { label: `Dans ${days} j`, tone: "ok" };
}

type BriefParsed = {
  callNotes: string;
  brandColors: string;
  brandPersonality: string;
  siteReferences: string;
  estimatedDays: number | null;
};

function parseBrief(raw: string | null | undefined): BriefParsed {
  if (!raw) return { callNotes: "", brandColors: "", brandPersonality: "", siteReferences: "", estimatedDays: null };
  try {
    const d = JSON.parse(raw);
    const b = d.brief ?? {};
    return {
      callNotes: b.callNotes ?? "",
      brandColors: b.brandColors ?? "",
      brandPersonality: b.brandPersonality ?? "",
      siteReferences: b.siteReferences ?? "",
      estimatedDays: b.estimatedDays ?? null,
    };
  } catch {
    return { callNotes: "", brandColors: "", brandPersonality: "", siteReferences: "", estimatedDays: null };
  }
}

export default async function DispoPage() {
  const { session, role } = await requireRole("DEV", "ADMIN");

  const [available, currentMine] = await Promise.all([
    prisma.project.findMany({
      where: { devId: null, status: { in: POOL_STATUSES } },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        status: true,
        deadline: true,
        techStack: true,
        briefData: true,
        devPaymentAmount: true,
        quote: {
          select: {
            number: true,
            totalOneShot: true,
            lines: {
              select: { label: true, category: true, quantity: true },
            },
          },
        },
      },
    }),
    role === "ADMIN"
      ? Promise.resolve(null)
      : prisma.project.findFirst({
          where: { devId: session.user.id, status: { in: ACTIVE_STATUSES } },
          select: { id: true, name: true },
        }),
  ]);

  return (
    <DashboardShell
      eyebrow="Pool de projets"
      title="Missions disponibles,"
      italic="brief inclus."
      nav={DEV_NAV}
    >
      {/* Avertissement si dev a déjà un projet */}
      {currentMine && (
        <div
          style={{
            background: "#FFF8E1",
            border: "1px solid #D4A857",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          <p style={{ fontWeight: 600, color: "#8A6914", marginBottom: 4 }}>
            Vous avez déjà un projet en cours : <strong>{currentMine.name}</strong>
          </p>
          <p style={{ fontSize: 13, color: "#8A6914" }}>
            Demandez à relâcher votre projet actuel avant d&apos;en prendre un nouveau.
          </p>
        </div>
      )}

      <SectionTitle
        eyebrow={`${available.length} mission${available.length > 1 ? "s" : ""}`}
        title="À prendre,"
        italic="par ordre d'échéance."
      />

      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 28, fontStyle: "italic" }}>
        Le nom du client est masqué jusqu&apos;à acceptation. Vous voyez le brief complet,
        le scope du devis et la rémunération avant de vous engager.
      </p>

      {available.length === 0 ? (
        <div
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 20, color: "var(--color-muted)", fontStyle: "italic" }}>
            Aucune mission disponible pour l&apos;instant.
          </p>
          <p style={{ fontSize: 13, color: "var(--color-subtle)", marginTop: 8 }}>
            Les missions apparaissent ici dès que le brief est complété et l&apos;acompte client encaissé.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {available.map((p) => {
            const brief = parseBrief(p.briefData);
            const color = "#13A66A";
            const disabled = !!currentMine;
            const deadlineInfo = p.deadline ? relativeDeadline(p.deadline) : null;

            // Scope dev = uniquement les lignes SITE (développement web + SEO)
            // Logo, pub, photo → services séparés, pas du ressort du dev
            const scope =
              p.quote?.lines
                .filter((l) => l.category === "SITE")
                .map((l) => (l.quantity > 1 ? `${l.label} × ${l.quantity}` : l.label)) ?? [];

            return (
              <div
                key={p.id}
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  overflow: "hidden",
                  opacity: disabled ? 0.6 : 1,
                }}
              >
                {/* Header de la carte */}
                <div
                  style={{
                    padding: "18px 22px",
                    borderBottom: "1px solid var(--color-line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    background: "#E6F5EC",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-geist)",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "#0D6E46",
                        fontWeight: 600,
                      }}
                    >
                      Mission {p.quote?.number ?? p.id.slice(0, 6).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    {brief.estimatedDays && (
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          background: "white",
                          border: "1px solid #13A66A",
                          color: "#0D6E46",
                          borderRadius: 999,
                          fontFamily: "var(--font-geist)",
                          fontWeight: 500,
                        }}
                      >
                        ⏱ {brief.estimatedDays} j ouvrables estimés
                      </span>
                    )}
                    {deadlineInfo && (
                      <DeadlinePill info={deadlineInfo} date={p.deadline!} />
                    )}
                  </div>
                </div>

                {/* Corps */}
                <div style={{ padding: "20px 22px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                    {/* Colonne gauche : brief + stack */}
                    <div>
                      {/* Notes de brief */}
                      {brief.callNotes && (
                        <div style={{ marginBottom: 16 }}>
                          <p
                            style={{
                              fontSize: 11,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              color: "var(--color-muted)",
                              fontFamily: "var(--font-geist)",
                              marginBottom: 6,
                            }}
                          >
                            📝 Brief du projet
                          </p>
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--color-ink)",
                              lineHeight: 1.65,
                              background: "var(--color-bg)",
                              padding: "10px 12px",
                              borderRadius: 6,
                              border: "1px solid var(--color-line)",
                              // Limiter à 5 lignes
                              display: "-webkit-box",
                              WebkitLineClamp: 6,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {brief.callNotes}
                          </p>
                        </div>
                      )}

                      {/* Brand info */}
                      {(brief.brandColors || brief.brandPersonality) && (
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                          {brief.brandColors && (
                            <Chip label="Couleurs" value={brief.brandColors} />
                          )}
                          {brief.brandPersonality && (
                            <Chip label="Ambiance" value={brief.brandPersonality} />
                          )}
                        </div>
                      )}

                      {/* Stack */}
                      {p.techStack && (
                        <div>
                          <p
                            style={{
                              fontSize: 11,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              color: "var(--color-muted)",
                              fontFamily: "var(--font-geist)",
                              marginBottom: 6,
                            }}
                          >
                            Stack
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {p.techStack.split(/[,;]/).map((t, i) => {
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
                        </div>
                      )}
                    </div>

                    {/* Colonne droite : scope + rémunération */}
                    <div>
                      {/* Scope */}
                      {scope.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <p
                            style={{
                              fontSize: 11,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              color: "var(--color-muted)",
                              fontFamily: "var(--font-geist)",
                              marginBottom: 6,
                            }}
                          >
                            Scope du devis
                          </p>
                          <ul style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {scope.map((s, i) => (
                              <li
                                key={i}
                                style={{
                                  fontSize: 13,
                                  color: "var(--color-ink)",
                                  display: "flex",
                                  gap: 6,
                                }}
                              >
                                <span style={{ color: "var(--color-accent)", flexShrink: 0 }}>·</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Rémunération */}
                      <div
                        style={{
                          background: p.devPaymentAmount !== null ? "var(--color-accent-soft)" : "var(--color-bg)",
                          border: `1px solid ${p.devPaymentAmount !== null ? "var(--color-accent)" : "var(--color-line)"}`,
                          borderRadius: 8,
                          padding: "12px 14px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "var(--color-muted)",
                            fontFamily: "var(--font-geist)",
                            marginBottom: 4,
                          }}
                        >
                          Rémunération
                        </p>
                        <p
                          style={{
                            fontSize: 24,
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            color:
                              p.devPaymentAmount === 0
                                ? "var(--color-muted)"
                                : p.devPaymentAmount !== null
                                ? "var(--color-accent-ink)"
                                : "var(--color-subtle)",
                          }}
                        >
                          {p.devPaymentAmount === null
                            ? "À négocier"
                            : p.devPaymentAmount === 0
                            ? "0 €"
                            : formatPrice(p.devPaymentAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer : bouton accepter */}
                <div
                  style={{
                    padding: "14px 22px",
                    borderTop: "1px solid var(--color-line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    background: "var(--color-bg)",
                  }}
                >
                  <p style={{ fontSize: 12, color: "var(--color-subtle)", fontStyle: "italic" }}>
                    Le nom du client vous sera révélé après acceptation.
                  </p>
                  <form action={claimProject}>
                    <input type="hidden" name="projectId" value={p.id} />
                    <button
                      type="submit"
                      disabled={disabled}
                      style={{
                        padding: "9px 20px",
                        background: disabled ? "var(--color-bg)" : "var(--color-accent)",
                        color: disabled ? "var(--color-muted)" : "white",
                        border: `1px solid ${disabled ? "var(--color-line)" : "var(--color-accent)"}`,
                        borderRadius: 7,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: disabled ? "not-allowed" : "pointer",
                      }}
                    >
                      {disabled ? "Projet en cours — indisponible" : "Je prends cette mission →"}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}

/* ── Composants ──────────────────────────────────────────────────── */

function DeadlinePill({
  info,
  date,
}: {
  info: { label: string; tone: "ok" | "tight" | "late" };
  date: Date;
}) {
  const colors =
    info.tone === "late"
      ? { bg: "#FEE2E2", border: "#9F1239", text: "#9F1239" }
      : info.tone === "tight"
      ? { bg: "#FFF8E1", border: "#D4A857", text: "#8A6914" }
      : { bg: "white", border: "#13A66A", text: "#0D6E46" };
  return (
    <span
      style={{
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontFamily: "var(--font-geist)",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        padding: "3px 10px",
        borderRadius: 999,
      }}
      title={`Échéance : ${date.toLocaleDateString("fr-BE")}`}
    >
      ⏱ {info.label}
    </span>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--color-bg)",
        border: "1px solid var(--color-line)",
        borderRadius: 6,
        padding: "5px 10px",
      }}
    >
      <p style={{ fontSize: 10, fontFamily: "var(--font-geist)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: 12, color: "var(--color-ink)" }}>{value}</p>
    </div>
  );
}
