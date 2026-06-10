import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { updateClientInfo, resetClientPassword, viewAsClient } from "./actions";

const PROJECT_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  SIGNED_DEPOSIT:    { label: "Acompte en attente",  color: "#D4A857" },
  ONBOARDING:        { label: "Onboarding",           color: "#7B5BFF" },
  COLLECTING_ASSETS: { label: "Collecte contenus",    color: "#7B5BFF" },
  READY_FOR_DEV:     { label: "Prêt pour le dev",     color: "#13A66A" },
  BRIEFING:          { label: "Briefing",             color: "#94949D" },
  DESIGN:            { label: "Design",               color: "#D4A857" },
  DEV:               { label: "Développement",        color: "var(--color-accent)" },
  CONTENT:           { label: "Contenu & SEO",        color: "#7B5BFF" },
  QA_REVIEW:         { label: "QA en cours",          color: "#D4A857" },
  VALIDATED:         { label: "Validé",               color: "#13A66A" },
  LIVE:              { label: "En ligne 🟢",           color: "#13A66A" },
  CLOSED:            { label: "Clôturé",              color: "#94949D" },
};

export default async function ClientProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reset?: string; tempPwd?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  await requireRole("ADMIN");

  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      ownedProjects: {
        orderBy: { createdAt: "desc" },
        include: {
          stages:       { select: { status: true } },
          invoices:     { select: { number: true, amount: true, status: true, dueDate: true } },
          subscription: { select: { plan: true, monthlyAmount: true, status: true } },
          quote:        { select: { number: true, totalOneShot: true } },
        },
      },
    },
  });

  if (!client || client.role !== "CLIENT") notFound();

  const showReset = sp.reset === "1" && sp.tempPwd;

  const allInvoices = client.ownedProjects.flatMap((p) => p.invoices);
  const unpaid      = allInvoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE");
  const totalUnpaid = unpaid.reduce((s, i) => s + i.amount, 0);
  const totalPaid   = allInvoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);

  return (
    <DashboardShell
      eyebrow="Fiche client"
      title={client.name ?? client.email}
      italic="profil complet."
      nav={ADMIN_NAV}
    >
      <div style={{ marginBottom: 16 }}>
        <Link href="/app/admin/clients" style={{ fontSize: 13, color: "var(--color-muted)", textDecoration: "none" }}>
          ← Retour aux clients
        </Link>
      </div>

      {/* Bannière reset mdp */}
      {showReset && (
        <div
          style={{
            background: "#FFF8E1",
            border: "2px solid #D4A857",
            borderRadius: 10,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <p style={{ fontWeight: 700, color: "#8A6914", marginBottom: 4 }}>
            🔑 Nouveau mot de passe généré
          </p>
          <p style={{ fontSize: 13, color: "#8A6914", marginBottom: 16 }}>
            ⚠️ N&apos;apparaîtra plus après rafraîchissement — envoyez-le maintenant.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "var(--color-paper)", border: "1px solid var(--color-line)", borderRadius: 8, padding: "16px 20px" }}>
            <div>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-subtle)", fontFamily: "var(--font-geist)", marginBottom: 4 }}>Email</p>
              <p className="select-all" style={{ fontFamily: "var(--font-geist)", fontSize: 14, fontWeight: 500 }}>{client.email}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-subtle)", fontFamily: "var(--font-geist)", marginBottom: 4 }}>Mot de passe temporaire</p>
              <p className="select-all" style={{ fontFamily: "var(--font-geist)", fontSize: 20, fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.05em" }}>{sp.tempPwd}</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "flex-start" }}>

        {/* ── Colonne principale ─────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Formulaire d'édition */}
          <form action={updateClientInfo}>
            <input type="hidden" name="userId" value={client.id} />
            <Card title="Informations de contact & facturation">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <F label="Nom complet"  name="name"        defaultValue={client.name ?? ""}         placeholder="Jean Dupont" />
                <F label="Email"        name="email"        defaultValue={client.email}              placeholder="jean@exemple.be" disabled />
                <F label="Téléphone"    name="phone"        defaultValue={client.phone ?? ""}        placeholder="+32 470 12 34 56" />
                <F label="N° TVA"       name="vatNumber"    defaultValue={client.vatNumber ?? ""}    placeholder="BE0123.456.789" />
                <F label="Adresse"      name="address"      defaultValue={client.address ?? ""}      placeholder="Rue de la Paix 12" />
                <F label="Code postal"  name="postalCode"   defaultValue={client.postalCode ?? ""}   placeholder="4000" />
                <F label="Ville"        name="city"         defaultValue={client.city ?? ""}         placeholder="Liège" />
                <div>
                  <label style={{ display: "block" }}>
                    <span style={labelStyle}>Pays</span>
                    <select
                      name="country"
                      defaultValue={client.country ?? "BE"}
                      style={inputStyle}
                    >
                      <option value="BE">🇧🇪 Belgique</option>
                      <option value="FR">🇫🇷 France</option>
                      <option value="LU">🇱🇺 Luxembourg</option>
                      <option value="NL">🇳🇱 Pays-Bas</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </label>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  style={{
                    padding: "9px 20px",
                    background: "var(--color-accent)",
                    color: "white",
                    border: "none",
                    borderRadius: 7,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Enregistrer les modifications →
                </button>
              </div>
            </Card>
          </form>

          {/* Projets */}
          <Card title={`${client.ownedProjects.length} projet${client.ownedProjects.length > 1 ? "s" : ""}`}>
            {client.ownedProjects.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--color-subtle)", fontStyle: "italic" }}>Aucun projet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {client.ownedProjects.map((p) => {
                  const ps = PROJECT_STATUS_LABEL[p.status] ?? { label: p.status, color: "var(--color-muted)" };
                  const done  = p.stages.filter((s) => s.status === "VALIDATED").length;
                  const total = p.stages.length;
                  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <Link
                      key={p.id}
                      href={`/app/admin/projects/${p.id}`}
                      className="no-underline"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "12px 16px",
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-line)",
                        borderRadius: 8,
                        color: "var(--color-ink)",
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: ps.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{p.name}</p>
                        <div style={{ display: "flex", gap: 10 }}>
                          <span style={{ fontSize: 11, color: ps.color, fontWeight: 500 }}>{ps.label}</span>
                          {p.quote && <span style={{ fontSize: 11, color: "var(--color-subtle)" }}>{p.quote.number} · {formatPrice(p.quote.totalOneShot)}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 70 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)" }}>{pct}%</p>
                        <div style={{ height: 3, background: "var(--color-line)", borderRadius: 999, marginTop: 4 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-accent)", borderRadius: 999 }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--color-accent)" }}>→</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Factures */}
          {allInvoices.length > 0 && (
            <Card title="Factures">
              <div style={{ display: "flex", flexDirection: "column" }}>
                {allInvoices.map((inv, i) => {
                  const isOverdue = inv.status === "OVERDUE";
                  const isPaid    = inv.status === "PAID";
                  const color     = isOverdue ? "#9F1239" : isPaid ? "#13A66A" : "#D4A857";
                  return (
                    <div
                      key={inv.number}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: i < allInvoices.length - 1 ? "1px solid var(--color-line)" : "none",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
                        <span style={{ fontSize: 13, fontFamily: "var(--font-geist)" }}>{inv.number}</span>
                        {inv.dueDate && (
                          <span style={{ fontSize: 11, color: "var(--color-subtle)" }}>
                            · échéance {inv.dueDate.toLocaleDateString("fr-BE")}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, color, fontWeight: 500 }}>
                          {isPaid ? "Payée ✓" : isOverdue ? "En retard" : "En attente"}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{formatPrice(inv.amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--color-line)" }}>
                <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Total encaissé : <strong>{formatPrice(totalPaid)}</strong></span>
                {totalUnpaid > 0 && <span style={{ fontSize: 12, color: "#9F1239", fontWeight: 600 }}>Impayé : {formatPrice(totalUnpaid)}</span>}
              </div>
            </Card>
          )}
        </div>

        {/* ── Colonne droite : actions rapides ───────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Voir comme ce client */}
          <div
            style={{
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-accent)",
              borderRadius: 10,
              padding: "18px 20px",
            }}
          >
            <p style={{ fontWeight: 600, color: "var(--color-accent-ink)", marginBottom: 6, fontSize: 14 }}>
              👁 Voir comme ce client
            </p>
            <p style={{ fontSize: 12, color: "var(--color-accent-ink)", opacity: 0.8, marginBottom: 14, lineHeight: 1.5 }}>
              Basculez sur son espace pour voir exactement ce qu&apos;il voit — ses étapes, ses factures, ses accès.
            </p>
            <form action={viewAsClient}>
              <input type="hidden" name="userId" value={client.id} />
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
                Voir comme {client.name?.split(" ")[0] ?? "ce client"} →
              </button>
            </form>
          </div>

          {/* Reset mot de passe */}
          <div
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 10,
              padding: "18px 20px",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              🔑 Réinitialiser le mot de passe
            </p>
            <p style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 14, lineHeight: 1.5 }}>
              Génère un nouveau mdp temporaire à envoyer par WhatsApp. Le client pourra le changer après connexion.
            </p>
            <form action={resetClientPassword}>
              <input type="hidden" name="userId" value={client.id} />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "9px 16px",
                  background: "#FFF8E1",
                  border: "1px solid #D4A857",
                  color: "#8A6914",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Générer nouveau mot de passe
              </button>
            </form>
          </div>

          {/* Résumé financier */}
          <div
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 10,
              padding: "18px 20px",
            }}
          >
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 14 }}>
              Résumé financier
            </p>
            <MiniRow label="Encaissé"    value={formatPrice(totalPaid)} color="#13A66A" />
            {totalUnpaid > 0 && <MiniRow label="Impayé" value={formatPrice(totalUnpaid)} color="#9F1239" />}
            {client.ownedProjects.some((p) => p.subscription?.status === "ACTIVE") && (
              <MiniRow
                label="MRR"
                value={formatPrice(client.ownedProjects.filter((p) => p.subscription?.status === "ACTIVE").reduce((s, p) => s + (p.subscription?.monthlyAmount ?? 0), 0)) + "/mois"}
                color="var(--color-accent)"
              />
            )}
            <MiniRow label="Projets"    value={String(client.ownedProjects.length)} />
            <MiniRow label="Inscrit le" value={client.createdAt.toLocaleDateString("fr-BE")} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

/* ── Composants ──────────────────────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--color-muted)",
  fontFamily: "var(--font-geist)",
  display: "block",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "var(--color-bg)",
  border: "1px solid var(--color-line)",
  borderRadius: 7,
  fontSize: 14,
  outline: "none",
  color: "var(--color-ink)",
};

function F({
  label,
  name,
  defaultValue,
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        style={{ ...inputStyle, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "auto" }}
      />
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--color-line)", background: "var(--color-bg)" }}>
        <p style={{ fontWeight: 600, fontSize: 14 }}>{title}</p>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

function MiniRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 8, marginBottom: 8, borderBottom: "1px solid var(--color-line)" }}>
      <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: color ?? "var(--color-ink)" }}>{value}</span>
    </div>
  );
}
