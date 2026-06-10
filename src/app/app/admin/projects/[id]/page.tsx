import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { setStageStatus, saveKickoffNotes } from "../actions";
import { setDevPayment, toggleDevPaymentStatus } from "../dev-payment-actions";
import { STAGE_STATUS_LABEL, type StageStatus } from "@/lib/stages";
import { formatPrice } from "@/lib/pricing";
import { ADMIN_NAV } from "@/lib/platform-nav";

const INVOICE_VISUAL: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "var(--color-subtle)" },
  SENT: { label: "Envoyée", color: "#D4A857" },
  PAID: { label: "Payée", color: "#13A66A" },
  OVERDUE: { label: "En retard", color: "#9F1239" },
  CANCELLED: { label: "Annulée", color: "var(--color-subtle)" },
};

const STATUS_TINT: Record<StageStatus, { bg: string; border: string; text: string }> = {
  PENDING: { bg: "transparent", border: "var(--color-line)", text: "var(--color-subtle)" },
  IN_PROGRESS: { bg: "var(--color-bg)", border: "var(--color-ink)", text: "var(--color-ink)" },
  NEEDS_VALIDATION: { bg: "#FFF8E1", border: "#D4A857", text: "#8A6914" },
  VALIDATED: { bg: "var(--color-accent-soft)", border: "var(--color-accent)", text: "var(--color-accent-ink)" },
};

export default async function AdminProjectDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ welcome?: string; tempPwd?: string; email?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const { session, role } = await requireRole("ADMIN");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      commercial: true,
      dev: true,
      stages: { orderBy: { order: "asc" } },
      invoices: { orderBy: { createdAt: "desc" } },
      subscription: true,
      quote: {
        select: {
          id: true, number: true, totalOneShot: true,
          clientPhone: true, clientVat: true,
          clientAddress: true, clientPostalCode: true,
          clientCity: true, clientCountry: true,
        },
      },
    },
  });

  if (!project) notFound();

  const showWelcome = sp.welcome === "1" && sp.tempPwd && sp.email;

  return (
    <DashboardShell
      eyebrow="Projet"
      title={project.name}
      user={{ ...session.user, role }}
      nav={ADMIN_NAV}
    >
      {/* Bannière de bienvenue avec identifiants temporaires (à la conversion devis → projet) */}
      {showWelcome && (
        <div
          className="p-6 mb-10"
          style={{
            background: "var(--color-accent-soft)",
            border: "2px solid var(--color-accent)",
            borderRadius: 12,
          }}
        >
          <p
            className="mono uppercase mb-3"
            style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-accent-ink)" }}
          >
            · Compte client créé
          </p>
          <h3
            className="display mb-3"
            style={{ fontSize: 22, letterSpacing: "-0.02em", lineHeight: 1.2, color: "var(--color-accent-ink)" }}
          >
            Voici les identifiants à transmettre,{" "}
            <em className="serif-i">une seule fois.</em>
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--color-accent-ink)" }}>
            Cette information ne s'affichera plus après rafraîchissement de la page.
            Copiez-la maintenant.
          </p>
          <div
            className="grid sm:grid-cols-2 gap-3"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div>
              <p
                className="mono uppercase mb-1"
                style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
              >
                Email
              </p>
              <p className="mono select-all" style={{ fontSize: 14 }}>
                {sp.email}
              </p>
            </div>
            <div>
              <p
                className="mono uppercase mb-1"
                style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
              >
                Mot de passe temporaire
              </p>
              <p className="mono select-all" style={{ fontSize: 14, fontWeight: 600 }}>
                {sp.tempPwd}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bannière BRIEF À FAIRE */}
      {!project.kickoffDone && (
        <Link
          href={`/app/admin/brief/${project.id}`}
          className="no-underline"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--color-accent-soft)",
            border: "2px solid var(--color-accent)",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 16,
            gap: 12,
            color: "var(--color-ink)",
          }}
        >
          <div>
            <p style={{ fontWeight: 600, color: "var(--color-accent-ink)", marginBottom: 3 }}>
              📞 Brief call à compléter
            </p>
            <p style={{ fontSize: 13, color: "var(--color-accent-ink)", opacity: 0.85 }}>
              Le brief n&apos;est pas encore marqué comme complet. Le projet ne sera pas visible
              dans le pool dev tant que le brief n&apos;est pas finalisé.
            </p>
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-accent)",
              whiteSpace: "nowrap",
              background: "white",
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid var(--color-accent)",
            }}
          >
            Ouvrir le brief →
          </span>
        </Link>
      )}

      {/* Bannière BRIEF FAIT MAIS ACOMPTE MANQUANT */}
      {project.kickoffDone && project.status === "SIGNED_DEPOSIT" && (
        <div
          style={{
            background: "#FFF8E1",
            border: "1px solid #D4A857",
            borderRadius: 10,
            padding: "14px 20px",
            marginBottom: 16,
          }}
        >
          <p style={{ fontWeight: 600, color: "#8A6914", marginBottom: 3 }}>
            Brief complet — en attente de l&apos;acompte
          </p>
          <p style={{ fontSize: 13, color: "#8A6914" }}>
            Le brief est fait. Le projet sera automatiquement envoyé dans le pool dès que l&apos;acompte sera encaissé.
          </p>
        </div>
      )}

      {/* Bannière LIVE */}
      {project.status === "LIVE" && (
        <div
          className="flex items-center gap-3 p-5 mb-10"
          style={{
            background: "#E6F5EC",
            border: "1px solid #13A66A",
            borderRadius: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>🎉</span>
          <div>
            <p style={{ fontWeight: 600, color: "#0D6E46" }}>Projet en ligne</p>
            {project.liveAt && (
              <p style={{ fontSize: 13, color: "#0D6E46", opacity: 0.8 }}>
                Mis en ligne le {project.liveAt.toLocaleDateString("fr-BE")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Méta équipe */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <MetaCard label="Client" value={project.client.name ?? project.client.email} />
        <MetaCard
          label="Commercial"
          value={project.commercial?.name ?? "—"}
          subtle={!project.commercial}
        />
        <MetaCard
          label="Développeur"
          value={project.dev?.name ?? "—"}
          subtle={!project.dev}
        />
      </div>

      {/* Coordonnées de facturation client */}
      {(project.client.phone || project.client.vatNumber || project.client.address || project.quote?.clientVat || project.quote?.clientPhone) && (
        <div
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 12 }}>
            Coordonnées de facturation
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px 24px" }}>
            {(project.client.phone || project.quote?.clientPhone) && (
              <BillingRow label="Téléphone" value={project.client.phone ?? project.quote?.clientPhone ?? "—"} />
            )}
            {(project.client.vatNumber || project.quote?.clientVat) && (
              <BillingRow label="TVA" value={project.client.vatNumber ?? project.quote?.clientVat ?? "—"} />
            )}
            {(project.client.address || project.quote?.clientAddress) && (
              <BillingRow label="Adresse" value={project.client.address ?? project.quote?.clientAddress ?? "—"} />
            )}
            {(project.client.postalCode || project.quote?.clientPostalCode) && (
              <BillingRow label="Code postal" value={project.client.postalCode ?? project.quote?.clientPostalCode ?? "—"} />
            )}
            {(project.client.city || project.quote?.clientCity) && (
              <BillingRow label="Ville" value={project.client.city ?? project.quote?.clientCity ?? "—"} />
            )}
            {project.client.email && (
              <BillingRow label="Email" value={project.client.email} />
            )}
          </div>
        </div>
      )}

      {/* Alerte : infos de facturation incomplètes */}
      {!project.client.vatNumber && !project.quote?.clientVat && (
        <div
          style={{
            background: "#FFF8E1",
            border: "1px solid #D4A857",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 24,
            fontSize: 13,
            color: "#8A6914",
          }}
        >
          ⚠️ Numéro de TVA manquant — à récupérer avant d&apos;émettre la facture finale.
        </div>
      )}

      <SectionTitle
        eyebrow="Suivi des étapes"
        title="Avancement,"
        italic="en direct."
      />
      <p
        className="text-sm mb-6 serif-i"
        style={{ color: "var(--color-muted)" }}
      >
        Quand le client doit valider, mettez l'étape sur « À valider » : il
        verra alors le bouton de validation en 1 clic dans son espace.
      </p>

      <div className="grid gap-3">
        {project.stages.map((s) => {
          const tint = STATUS_TINT[s.status as StageStatus];
          return (
            <div
              key={s.id}
              className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap"
              style={{
                background: tint.bg,
                border: `1px solid ${tint.border}`,
                borderRadius: 10,
              }}
            >
              <div className="flex items-start gap-4" style={{ flex: 1 }}>
                <span
                  className="mono"
                  style={{ fontSize: 11, color: "var(--color-subtle)", width: 18, paddingTop: 2 }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, color: tint.text }}>{s.label}</p>
                  {s.validatedAt && (
                    <p className="mono mt-1" style={{ fontSize: 10, color: "var(--color-subtle)" }}>
                      Validé le {s.validatedAt.toLocaleDateString("fr-BE")}
                    </p>
                  )}
                  {/* Note du dev (soumission) */}
                  {s.status === "NEEDS_VALIDATION" && s.devNote && (
                    <div
                      style={{
                        marginTop: 8,
                        background: "var(--color-accent-soft)",
                        border: "1px solid var(--color-accent)",
                        borderRadius: 6,
                        padding: "8px 12px",
                        maxWidth: 500,
                      }}
                    >
                      <p style={{ fontSize: 10, fontFamily: "var(--font-geist)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-accent-ink)", marginBottom: 4 }}>
                        Note du dev
                      </p>
                      <p style={{ fontSize: 13, color: "var(--color-ink)", lineHeight: 1.5 }}>{s.devNote}</p>
                      {s.devUrl && (
                        <a
                          href={s.devUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 12, color: "var(--color-accent)", fontWeight: 600, display: "inline-block", marginTop: 6 }}
                        >
                          Voir le travail ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <form action={setStageStatus} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                <input type="hidden" name="stageId" value={s.id} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <select
                    name="status"
                    defaultValue={s.status}
                    className="px-3 py-1.5 outline-none"
                    style={{
                      background: "var(--color-paper)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                  >
                    {(Object.keys(STAGE_STATUS_LABEL) as StageStatus[]).map((k) => (
                      <option key={k} value={k}>
                        {STAGE_STATUS_LABEL[k]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="text-xs no-underline"
                    style={{ color: "var(--color-accent)" }}
                  >
                    Appliquer
                  </button>
                </div>
                {/* Champs contexte — pour les étapes que le client doit valider */}
                {(s.key === "design" || s.key === "review" || s.key === "live") && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 320 }}>
                    <input
                      type="url"
                      name="validationUrl"
                      defaultValue={s.validationUrl ?? ""}
                      placeholder="Lien démo / Figma / préprod…"
                      style={{
                        padding: "5px 10px",
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-line)",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "100%",
                        outline: "none",
                      }}
                    />
                    <input
                      type="text"
                      name="validationNote"
                      defaultValue={s.validationNote ?? ""}
                      placeholder="Message au client : ce qu'il doit vérifier…"
                      style={{
                        padding: "5px 10px",
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-line)",
                        borderRadius: 6,
                        fontSize: 12,
                        width: "100%",
                        outline: "none",
                      }}
                    />
                  </div>
                )}
              </form>
            </div>
          );
        })}
      </div>

      {/* Factures */}
      {project.invoices.length > 0 && (
        <div className="mt-16">
          <SectionTitle
            eyebrow="Facturation"
            title="Les factures,"
            italic="émises et à émettre."
          />
          <div className="grid gap-3">
            {project.invoices.map((inv) => {
              const v = INVOICE_VISUAL[inv.status] ?? INVOICE_VISUAL.DRAFT;
              return (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap"
                  style={{
                    background: "var(--color-paper)",
                    border: "1px solid var(--color-line)",
                    borderRadius: 10,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: v.color }}
                    />
                    <div>
                      <p style={{ fontWeight: 500 }}>{inv.number}</p>
                      <p
                        className="mono mt-1"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          color: "var(--color-subtle)",
                          textTransform: "uppercase",
                        }}
                      >
                        {v.label}
                        {inv.dueDate &&
                          ` · échéance ${inv.dueDate.toLocaleDateString("fr-BE")}`}
                      </p>
                    </div>
                  </div>
                  <p
                    className="display"
                    style={{
                      fontSize: 22,
                      color: "var(--color-accent)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {formatPrice(inv.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes de kick-off — visibles aussi du dev */}
      <div className="mt-16">
        <SectionTitle
          eyebrow="Brief & kick-off"
          title="Notes du cadrage,"
          italic="visibles du dev."
        />
        <KickoffNotesEditor
          projectId={project.id}
          existingNotes={(() => {
            try {
              const d = JSON.parse(project.briefData ?? "{}");
              return d.kickoffNotes ?? "";
            } catch {
              return "";
            }
          })()}
        />
      </div>

      {/* Finances du projet : prix vendu, paiement dev, marge */}
      <div className="mt-16">
        <SectionTitle
          eyebrow="Finances du projet"
          title="Combien on touche,"
          italic="combien on paye."
        />
        <ProjectFinances
          projectId={project.id}
          revenue={project.quote?.totalOneShot ?? 0}
          devPaymentAmount={project.devPaymentAmount}
          devPaymentStatus={project.devPaymentStatus}
          devPaymentPaidAt={project.devPaymentPaidAt}
          devName={project.dev?.name ?? project.dev?.email ?? null}
        />
      </div>

      {/* Abonnement récurrent */}
      {project.subscription && (
        <div className="mt-16">
          <SectionTitle
            eyebrow="Abonnement récurrent"
            title="Le contrat,"
            italic="qui paie chaque mois."
          />
          <div
            className="p-6 flex items-center justify-between gap-4 flex-wrap"
            style={{
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-accent)",
              borderRadius: 12,
            }}
          >
            <div>
              <p
                className="mono uppercase mb-1"
                style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-accent-ink)" }}
              >
                · {project.subscription.status}
              </p>
              <p style={{ fontWeight: 500, color: "var(--color-accent-ink)" }}>
                {project.subscription.plan}
              </p>
              <p
                className="mono mt-1"
                style={{ fontSize: 11, color: "var(--color-accent-ink)" }}
              >
                Démarré le{" "}
                {project.subscription.startedAt.toLocaleDateString("fr-BE")}
              </p>
            </div>
            <p
              className="display"
              style={{
                fontSize: 28,
                color: "var(--color-accent-ink)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {formatPrice(project.subscription.monthlyAmount)}
              <span
                className="serif-i text-sm ml-2"
                style={{ color: "var(--color-accent-ink)", opacity: 0.7 }}
              >
                /mois
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Devis source */}
      {project.quote && (
        <div className="mt-12">
          <p
            className="mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "var(--color-subtle)",
              marginBottom: 8,
            }}
          >
            Devis source
          </p>
          <Link
            href={`/app/commercial/devis/${project.quote.id}`}
            className="text-sm no-underline"
            style={{ color: "var(--color-accent)" }}
          >
            {project.quote.number} →
          </Link>
        </div>
      )}

      <div className="mt-12">
        <Link
          href="/app/admin/projects"
          className="text-sm no-underline"
          style={{ color: "var(--color-muted)" }}
        >
          ← Retour à la liste
        </Link>
      </div>
    </DashboardShell>
  );
}

function KickoffNotesEditor({
  projectId,
  existingNotes,
}: {
  projectId: string;
  existingNotes: string;
}) {
  return (
    <div
      style={{
        background: "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 10,
        padding: "20px 24px",
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: "var(--color-muted)",
          marginBottom: 12,
          lineHeight: 1.5,
        }}
      >
        Ces notes sont partagées avec le développeur assigné. Écrivez ici
        tout ce qui a été dit lors du kick-off : objectifs, contraintes,
        demandes particulières du client, etc.
      </p>
      <form action={saveKickoffNotes} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="hidden" name="projectId" value={projectId} />
        <textarea
          name="kickoffNotes"
          rows={8}
          defaultValue={existingNotes}
          placeholder="Ex. Le client veut absolument une section avant/après. Il a mentionné qu'il déteste les animations trop rapides. Budget serré, on évite les intégrations tierces complexes. Livraison impérative avant le 15 septembre (salon professionnel)."
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "var(--color-bg)",
            border: "1px solid var(--color-line)",
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: "inherit",
            resize: "vertical",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            style={{
              fontSize: 13,
              padding: "8px 18px",
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-accent)",
              color: "var(--color-accent-ink)",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Enregistrer les notes →
          </button>
        </div>
      </form>
    </div>
  );
}

function BillingRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-subtle)", fontFamily: "var(--font-geist)", marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-ink)" }}>{value}</p>
    </div>
  );
}

function MetaCard({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) {
  return (
    <div
      className="p-5"
      style={{
        background: "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 10,
      }}
    >
      <p
        className="mono uppercase mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
      >
        {label}
      </p>
      <p
        style={{
          fontWeight: 500,
          color: subtle ? "var(--color-subtle)" : "var(--color-ink)",
          fontStyle: subtle ? "italic" : "normal",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function ProjectFinances({
  projectId,
  revenue,
  devPaymentAmount,
  devPaymentStatus,
  devPaymentPaidAt,
  devName,
}: {
  projectId: string;
  revenue: number;
  devPaymentAmount: number | null;
  devPaymentStatus: string;
  devPaymentPaidAt: Date | null;
  devName: string | null;
}) {
  const cost = devPaymentAmount ?? 0;
  const margin = revenue - cost;
  const marginPct = revenue > 0 ? Math.round((margin / revenue) * 100) : 0;
  const isPaid = devPaymentStatus === "PAID";

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div
          className="p-5"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 10,
          }}
        >
          <p
            className="mono uppercase mb-2"
            style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
          >
            Revenu projet
          </p>
          <p
            className="display"
            style={{ fontSize: 24, letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {formatPrice(revenue)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
            one-shot facturé au client
          </p>
        </div>

        <div
          className="p-5"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 10,
          }}
        >
          <p
            className="mono uppercase mb-2"
            style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
          >
            Coût dev
          </p>
          <p
            className="display"
            style={{
              fontSize: 24,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: devPaymentAmount === null ? "var(--color-subtle)" : "var(--color-ink)",
              fontStyle: devPaymentAmount === null ? "italic" : "normal",
            }}
          >
            {devPaymentAmount === null ? "non défini" : formatPrice(cost)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
            {devName ? `versé à ${devName}` : "aucun dev assigné"}
          </p>
        </div>

        <div
          className="p-5"
          style={{
            background: margin >= 0 ? "var(--color-accent-soft)" : "#FEE2E2",
            border: `1px solid ${margin >= 0 ? "var(--color-accent)" : "#9F1239"}`,
            borderRadius: 10,
          }}
        >
          <p
            className="mono uppercase mb-2"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: margin >= 0 ? "var(--color-accent-ink)" : "#9F1239",
            }}
          >
            Marge brute
          </p>
          <p
            className="display"
            style={{
              fontSize: 24,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: margin >= 0 ? "var(--color-accent-ink)" : "#9F1239",
            }}
          >
            {formatPrice(margin)}
          </p>
          <p
            className="text-xs mt-1"
            style={{
              color: margin >= 0 ? "var(--color-accent-ink)" : "#9F1239",
              opacity: 0.7,
            }}
          >
            {revenue > 0 ? `${marginPct} % de marge` : "—"}
          </p>
        </div>
      </div>

      {/* Édition du paiement dev */}
      <div
        className="p-5 flex items-end justify-between gap-4 flex-wrap"
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 10,
        }}
      >
        <form action={setDevPayment} className="flex items-end gap-3 flex-wrap">
          <input type="hidden" name="projectId" value={projectId} />
          <label className="block">
            <span
              className="mono uppercase block mb-2"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "var(--color-muted)",
              }}
            >
              Montant à payer au dev (€ HTVA)
            </span>
            <input
              type="number"
              name="amount"
              min={0}
              step={0.01}
              defaultValue={
                devPaymentAmount !== null ? (devPaymentAmount / 100).toFixed(2) : ""
              }
              placeholder="ex. 1500"
              className="px-3 py-2 outline-none w-40"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
                borderRadius: 6,
                fontSize: 14,
              }}
            />
          </label>
          <button
            type="submit"
            className="text-sm no-underline"
            style={{ color: "var(--color-accent)", padding: "10px 0" }}
          >
            Enregistrer →
          </button>
        </form>

        {devPaymentAmount !== null && devPaymentAmount > 0 && (
          <form action={toggleDevPaymentStatus}>
            <input type="hidden" name="projectId" value={projectId} />
            <button
              type="submit"
              className="btn btn-ghost"
              style={{
                padding: "8px 16px",
                fontSize: 13,
                color: isPaid ? "var(--color-muted)" : "var(--color-accent)",
                borderColor: isPaid ? "var(--color-line)" : "var(--color-accent)",
              }}
            >
              {isPaid
                ? `✓ Payé le ${devPaymentPaidAt?.toLocaleDateString("fr-BE") ?? ""} · Annuler`
                : "Marquer comme payé →"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
