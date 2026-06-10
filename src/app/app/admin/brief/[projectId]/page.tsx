import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/pricing";
import { saveBriefNotes, completeBrief } from "./actions";

type BriefData = {
  callNotes: string;
  brandColors: string;
  brandPersonality: string;
  siteReferences: string;
  sitesToAvoid: string;
  technicalRequirements: string;
  specificRequests: string;
  estimatedDays: number | null;
};

function parseBriefData(raw: string | null | undefined): BriefData {
  const empty: BriefData = {
    callNotes: "",
    brandColors: "",
    brandPersonality: "",
    siteReferences: "",
    sitesToAvoid: "",
    technicalRequirements: "",
    specificRequests: "",
    estimatedDays: null,
  };
  if (!raw) return empty;
  try {
    const d = JSON.parse(raw);
    return { ...empty, ...(d.brief ?? {}) };
  } catch {
    return empty;
  }
}

export default async function BriefPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await requireRole("ADMIN");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: { select: { name: true, email: true } },
      commercial: { select: { name: true, email: true } },
      quote: {
        select: {
          number: true,
          totalOneShot: true,
          totalRecurring: true,
          lines: {
            select: { label: true, category: true, quantity: true, unitPrice: true },
          },
        },
      },
      invoices: {
        where: { status: "PAID" },
        select: { amount: true },
      },
    },
  });

  if (!project) notFound();

  const brief = parseBriefData(project.briefData);
  const depositPaid = project.status !== "SIGNED_DEPOSIT";
  const briefDone = project.kickoffDone;
  const canPublish = depositPaid && !briefDone;
  const alreadyPublished = briefDone;

  const scopeLines = project.quote?.lines.filter(
    (l) => l.category === "SITE" || l.category === "OPTION" || l.category === "LAUNCH_PACK",
  ) ?? [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-ink)",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--color-line)",
          background: "var(--color-paper)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          className="wrap"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            paddingBottom: 14,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href={`/app/admin/projects/${projectId}`}
              className="no-underline"
              style={{ fontSize: 13, color: "var(--color-muted)" }}
            >
              ← Retour projet
            </Link>
            <span style={{ width: 1, height: 18, background: "var(--color-line)", display: "inline-block" }} />
            <div>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-muted)", fontFamily: "var(--font-geist)" }}>
                Brief call
              </p>
              <p style={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>
                {project.name}
              </p>
            </div>
          </div>

          {/* Statuts */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <StatusPill
              label={depositPaid ? "Acompte payé ✓" : "Acompte en attente"}
              ok={depositPaid}
            />
            <StatusPill
              label={briefDone ? "Brief complet ✓" : "Brief en cours"}
              ok={briefDone}
            />
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 80 }}>

        {/* Bannière si brief déjà complété */}
        {alreadyPublished && (
          <div
            style={{
              background: "#E6F5EC",
              border: "1px solid #13A66A",
              borderRadius: 10,
              padding: "14px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>✓</span>
            <p style={{ color: "#0D6E46", fontSize: 14 }}>
              Brief marqué comme complet le{" "}
              {project.kickoffAt?.toLocaleDateString("fr-BE") ?? "—"}.
              Le projet est visible dans le pool si l&apos;acompte est payé.
              Vous pouvez encore modifier les notes ci-dessous.
            </p>
          </div>
        )}

        {/* Alerte acompte manquant */}
        {!depositPaid && (
          <div
            style={{
              background: "#FFF8E1",
              border: "1px solid #D4A857",
              borderRadius: 10,
              padding: "14px 20px",
              marginBottom: 24,
            }}
          >
            <p style={{ color: "#8A6914", fontSize: 14 }}>
              ⏳ L&apos;acompte client n&apos;est pas encore encaissé. Le projet n&apos;ira dans le pool
              qu&apos;une fois le brief complet <strong>et</strong> l&apos;acompte payé.
            </p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "flex-start" }}>
          {/* ── Formulaire principal ─────────────────────────── */}
          <form action={saveBriefNotes} id="brief-form">
            <input type="hidden" name="projectId" value={projectId} />

            {/* Notes brutes — priorité absolue */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block" }}>
                <p
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--color-muted)",
                    fontFamily: "var(--font-geist)",
                    marginBottom: 8,
                  }}
                >
                  📝 Notes de l'appel — tout noter ici en temps réel
                </p>
                <textarea
                  name="callNotes"
                  defaultValue={brief.callNotes}
                  rows={14}
                  placeholder={`Ce que le client veut, ce qu'il ne veut pas, ses angoisses, ses références…\n\nEx. : Il veut absolument un site sombre (dark mode). Sa concurrente directe s'appelle "LuminaWeb" et il déteste leur approche trop froide. Il a 3 prestataires en parallèle — attention au délai. Sa femme s'appelle Marie et elle valide aussi. Ouvert le WE. Parle beaucoup — synthétiser ses demandes…`}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "var(--color-paper)",
                    border: "2px solid var(--color-accent)",
                    borderRadius: 10,
                    fontSize: 15,
                    lineHeight: 1.7,
                    fontFamily: "inherit",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </label>
            </div>

            {/* Grille des champs structurés */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <BriefField
                name="brandColors"
                label="🎨 Couleurs de marque"
                placeholder="Bleu marine, blanc, gold… ou 'ne sait pas encore'"
                defaultValue={brief.brandColors}
              />
              <BriefField
                name="brandPersonality"
                label="✨ Personnalité / ambiance"
                placeholder="Luxe, chaleureux, sérieux, fun, épuré…"
                defaultValue={brief.brandPersonality}
              />
              <BriefField
                name="siteReferences"
                label="👍 Sites qu'il aime"
                placeholder="apple.com, notion.so, dribbble.com/shot/xxx"
                defaultValue={brief.siteReferences}
              />
              <BriefField
                name="sitesToAvoid"
                label="👎 Sites à ne pas ressembler"
                placeholder="Concurrents, styles à éviter, raisons…"
                defaultValue={brief.sitesToAvoid}
              />
              <BriefField
                name="technicalRequirements"
                label="⚙️ Contraintes techniques"
                placeholder="Hébergeur imposé, CMS, plugin spécifique, accès admin requis…"
                defaultValue={brief.technicalRequirements}
              />
              <BriefField
                name="specificRequests"
                label="📌 Demandes spécifiques"
                placeholder="Animation particulière, section custom, formulaire complexe…"
                defaultValue={brief.specificRequests}
              />
            </div>

            {/* Estimation */}
            <div style={{ marginTop: 14 }}>
              <label style={{ display: "block" }}>
                <p
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--color-muted)",
                    fontFamily: "var(--font-geist)",
                    marginBottom: 8,
                  }}
                >
                  ⏱ Temps de production estimé (jours ouvrables)
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="number"
                    name="estimatedDays"
                    defaultValue={brief.estimatedDays ?? ""}
                    min={1}
                    max={120}
                    placeholder="14"
                    style={{
                      width: 100,
                      padding: "10px 14px",
                      background: "var(--color-paper)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 8,
                      fontSize: 15,
                      outline: "none",
                    }}
                  />
                  <span style={{ fontSize: 14, color: "var(--color-muted)" }}>
                    jours ouvrables (visible du dev dans le pool)
                  </span>
                </div>
              </label>
            </div>

            {/* Bouton sauvegarder */}
            <div style={{ marginTop: 20 }}>
              <button
                type="submit"
                style={{
                  fontSize: 13,
                  padding: "8px 18px",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-line)",
                  color: "var(--color-muted)",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Sauvegarder (brouillon)
              </button>
            </div>
          </form>

          {/* ── Colonne droite : infos + action principale ─────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 80 }}>

            {/* Compléter le brief */}
            <div
              style={{
                background: alreadyPublished ? "#E6F5EC" : "var(--color-accent-soft)",
                border: `1px solid ${alreadyPublished ? "#13A66A" : "var(--color-accent)"}`,
                borderRadius: 10,
                padding: "18px 20px",
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: alreadyPublished ? "#0D6E46" : "var(--color-accent-ink)", marginBottom: 8 }}>
                {alreadyPublished ? "Brief complété ✓" : "Finaliser le brief"}
              </p>
              <p style={{ fontSize: 12, color: alreadyPublished ? "#0D6E46" : "var(--color-accent-ink)", opacity: 0.85, marginBottom: 14, lineHeight: 1.5 }}>
                {alreadyPublished
                  ? "Le projet apparaît dans le pool dès que l'acompte est encaissé."
                  : "Une fois l'appel terminé, marquez le brief comme complet. Le projet sera automatiquement proposé aux devs dès que l'acompte sera payé."}
              </p>
              {!alreadyPublished && (
                <form action={completeBrief}>
                  <input type="hidden" name="projectId" value={projectId} />
                  <input type="hidden" name="callNotes" value={brief.callNotes} />
                  <input type="hidden" name="brandColors" value={brief.brandColors} />
                  <input type="hidden" name="brandPersonality" value={brief.brandPersonality} />
                  <input type="hidden" name="siteReferences" value={brief.siteReferences} />
                  <input type="hidden" name="sitesToAvoid" value={brief.sitesToAvoid} />
                  <input type="hidden" name="technicalRequirements" value={brief.technicalRequirements} />
                  <input type="hidden" name="specificRequests" value={brief.specificRequests} />
                  <input type="hidden" name="estimatedDays" value={brief.estimatedDays ?? ""} />
                  <p style={{ fontSize: 11, color: "var(--color-accent-ink)", marginBottom: 10, opacity: 0.7 }}>
                    ⚠️ Sauvegardez d'abord le formulaire avant de marquer complet.
                  </p>
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      background: "var(--color-accent)",
                      color: "white",
                      border: "none",
                      borderRadius: 7,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Brief complet → publier dans le pool
                  </button>
                </form>
              )}
            </div>

            {/* Résumé du projet */}
            <div
              style={{
                background: "var(--color-paper)",
                border: "1px solid var(--color-line)",
                borderRadius: 10,
                padding: "16px 18px",
              }}
            >
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 12 }}>
                Résumé projet
              </p>
              <Row label="Client" value={project.client.name ?? project.client.email} />
              {project.commercial && (
                <Row label="Commercial" value={project.commercial.name ?? project.commercial.email} />
              )}
              {project.quote && (
                <Row
                  label="Montant"
                  value={formatPrice(project.quote.totalOneShot)}
                  accent
                />
              )}
              <Row label="Statut" value={project.status} />
            </div>

            {/* Scope */}
            {scopeLines.length > 0 && (
              <div
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 10,
                  padding: "16px 18px",
                }}
              >
                <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 10 }}>
                  Scope du devis
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {scopeLines.map((l, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 13,
                        color: "var(--color-ink)",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span>{l.quantity > 1 ? `${l.label} × ${l.quantity}` : l.label}</span>
                      <span style={{ color: "var(--color-muted)", fontFamily: "var(--font-geist)", fontSize: 12 }}>
                        {formatPrice(l.unitPrice * l.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Composants ──────────────────────────────────────────────────── */

function BriefField({
  name,
  label,
  placeholder,
  defaultValue,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
}) {
  return (
    <label style={{ display: "block" }}>
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
        {label}
      </p>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 7,
          fontSize: 13,
          lineHeight: 1.55,
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none",
        }}
      />
    </label>
  );
}

function StatusPill({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 999,
        background: ok ? "#E6F5EC" : "#FFF8E1",
        border: `1px solid ${ok ? "#13A66A" : "#D4A857"}`,
        color: ok ? "#0D6E46" : "#8A6914",
        fontFamily: "var(--font-geist)",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 8,
        paddingBottom: 6,
        marginBottom: 6,
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <span style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-geist)" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: accent ? 700 : 500,
          color: accent ? "var(--color-accent)" : "var(--color-ink)",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}
