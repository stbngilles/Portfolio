import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { changeUserRole, inviteMember, resetMemberPassword } from "./actions";

const ROLE_LABEL: Record<string, string> = {
  ADMIN:      "Administrateur",
  COMMERCIAL: "Commercial",
  CLIENT:     "Client",
  DEV:        "Développeur",
  COMPTABLE:  "Comptable",
};

const ROLE_COLOR: Record<string, string> = {
  ADMIN:      "#0F0F14",
  COMMERCIAL: "var(--color-accent)",
  DEV:        "#7B5BFF",
  CLIENT:     "#13A66A",
  COMPTABLE:  "#D4A857",
};

// Rôles invitables depuis l'admin (pas CLIENT — eux passent par le devis)
const INVITABLE_ROLES = ["COMMERCIAL", "DEV", "COMPTABLE", "ADMIN"] as const;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    reset?: string;
    name?: string;
    email?: string;
    tempPwd?: string;
    role?: string;
    userId?: string;
  }>;
}) {
  const { session, role } = await requireRole("ADMIN");
  const sp = await searchParams;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const showCredentials = sp.created === "1" && sp.email && sp.tempPwd;
  const showReset = sp.reset === "1" && sp.email && sp.tempPwd;

  // Séparer membres internes et clients
  const members = users.filter((u) => u.role !== "CLIENT");
  const clients = users.filter((u) => u.role === "CLIENT");

  return (
    <DashboardShell
      eyebrow="Utilisateurs"
      title="L'équipe,"
      italic="et les clients."
      user={{ ...session.user, role }}
      nav={ADMIN_NAV}
    >
      {/* ── Bannière credentials (une seule fois après création) ── */}
      {showCredentials && (
        <div
          style={{
            background: "var(--color-accent-soft)",
            border: "2px solid var(--color-accent)",
            borderRadius: 12,
            padding: "24px 28px",
            marginBottom: 32,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--color-accent-ink)",
              fontFamily: "var(--font-geist)",
              marginBottom: 8,
            }}
          >
            ✓ Compte créé — {ROLE_LABEL[sp.role ?? ""] ?? sp.role}
          </p>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--color-accent-ink)",
              marginBottom: 6,
            }}
          >
            Transmettez ces identifiants à {sp.name}
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--color-accent-ink)",
              opacity: 0.8,
              marginBottom: 20,
            }}
          >
            ⚠️ Cette information n'apparaîtra plus après rafraîchissement. Copiez-la maintenant.
          </p>

          <div
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 8,
              padding: "16px 20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <CredRow label="URL de connexion" value="pixelbrute.be/app/login" />
            <CredRow label="Rôle" value={ROLE_LABEL[sp.role ?? ""] ?? (sp.role ?? "—")} />
            <CredRow label="Email" value={sp.email!} />
            <CredRow label="Mot de passe temporaire" value={sp.tempPwd!} highlight />
          </div>

          <p
            style={{
              fontSize: 12,
              color: "var(--color-accent-ink)",
              opacity: 0.7,
              marginTop: 14,
            }}
          >
            La personne peut changer son mot de passe après connexion depuis les paramètres de son compte.
          </p>
        </div>
      )}

      {/* ── Bannière reset mot de passe ─────────────────────── */}
      {showReset && (
        <div
          style={{
            background: "#FFF8E1",
            border: "2px solid #D4A857",
            borderRadius: 12,
            padding: "24px 28px",
            marginBottom: 32,
          }}
        >
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A6914", fontFamily: "var(--font-geist)", marginBottom: 8 }}>
            🔑 Mot de passe réinitialisé
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "#8A6914", marginBottom: 6 }}>
            Nouveau mot de passe pour {sp.name}
          </h3>
          <p style={{ fontSize: 13, color: "#8A6914", opacity: 0.8, marginBottom: 20 }}>
            ⚠️ Cette information n&apos;apparaîtra plus après rafraîchissement. Envoyez-la maintenant.
          </p>
          <div
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 8,
              padding: "16px 20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <CredRow label="Email" value={sp.email!} />
            <CredRow label="Nouveau mot de passe" value={sp.tempPwd!} highlight />
          </div>
        </div>
      )}

      {/* ── Formulaire d'invitation ──────────────────────────── */}
      <div
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 40,
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Inviter un membre
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--color-muted)",
            marginBottom: 20,
          }}
        >
          Vous créez le compte, vous copiez les identifiants, vous les envoyez par WhatsApp.
          La personne se connecte directement — aucune manipulation de sa part.
        </p>

        <form
          action={inviteMember}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 160px auto", gap: 12, alignItems: "end" }}
        >
          <InviteField label="Nom complet" name="name" placeholder="Marie Dupont" required />
          <InviteField label="Email" name="email" type="email" placeholder="marie@exemple.be" required />

          <label style={{ display: "block" }}>
            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-muted)",
                fontFamily: "var(--font-geist)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Rôle
            </span>
            <select
              name="role"
              defaultValue="COMMERCIAL"
              style={{
                width: "100%",
                padding: "9px 12px",
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
                borderRadius: 7,
                fontSize: 14,
                outline: "none",
                color: "var(--color-ink)",
              }}
            >
              {INVITABLE_ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABEL[r]}</option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            style={{
              padding: "9px 18px",
              background: "var(--color-accent)",
              color: "white",
              border: "none",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Créer le compte →
          </button>
        </form>
      </div>

      {/* ── Membres internes ─────────────────────────────────── */}
      <SectionTitle
        eyebrow={`${members.length} membre${members.length > 1 ? "s" : ""}`}
        title="L'équipe interne,"
        italic="avec leurs accès."
      />

      <div
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 10,
          overflow: "hidden",
          marginBottom: 40,
        }}
      >
        {members.length === 0 ? (
          <p style={{ padding: "24px", color: "var(--color-muted)", fontSize: 13, fontStyle: "italic" }}>
            Aucun membre — utilisez le formulaire ci-dessus pour en inviter.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--color-bg)" }}>
                {["Nom", "Email", "Rôle", "Depuis", "Modifier"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 18px",
                      textAlign: "left",
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--color-subtle)",
                      fontFamily: "var(--font-geist)",
                      fontWeight: 400,
                      borderBottom: "1px solid var(--color-line)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    borderTop: i > 0 ? "1px solid var(--color-line)" : "none",
                    background: u.id === session.user.id ? "var(--color-accent-soft)" : "transparent",
                  }}
                >
                  <td style={{ padding: "12px 18px", fontWeight: 500 }}>
                    {u.name ?? "—"}
                    {u.id === session.user.id && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 10,
                          fontFamily: "var(--font-geist)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--color-accent-ink)",
                          background: "var(--color-accent-soft)",
                          border: "1px solid var(--color-accent)",
                          borderRadius: 4,
                          padding: "1px 6px",
                        }}
                      >
                        Vous
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 18px", color: "var(--color-muted)" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-geist)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: ROLE_COLOR[u.role] ?? "var(--color-muted)",
                        fontWeight: 600,
                      }}
                    >
                      {ROLE_LABEL[u.role] ?? u.role}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 18px",
                      fontSize: 12,
                      color: "var(--color-subtle)",
                      fontFamily: "var(--font-geist)",
                    }}
                  >
                    {u.createdAt.toLocaleDateString("fr-BE")}
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    {u.id !== session.user.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        {/* Changer le rôle */}
                        <form
                          action={changeUserRole.bind(null, u.id)}
                          style={{ display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <select
                            name="role"
                            defaultValue={u.role}
                            key={u.role}
                            style={{
                              padding: "5px 10px",
                              background: "var(--color-bg)",
                              border: "1px solid var(--color-line)",
                              borderRadius: 5,
                              fontSize: 13,
                              outline: "none",
                              color: "var(--color-ink)",
                            }}
                          >
                            {Object.entries(ROLE_LABEL).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            style={{ fontSize: 12, color: "var(--color-accent)", background: "none", border: "none", cursor: "pointer" }}
                          >
                            OK
                          </button>
                        </form>

                        {/* Réinitialiser le mot de passe */}
                        <form action={resetMemberPassword.bind(null, u.id)}>
                          <button
                            type="submit"
                            style={{
                              fontSize: 11,
                              padding: "4px 10px",
                              background: "#FFF8E1",
                              border: "1px solid #D4A857",
                              color: "#8A6914",
                              borderRadius: 5,
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                            title="Générer un nouveau mot de passe temporaire"
                          >
                            🔑 Reset mdp
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--color-subtle)", fontStyle: "italic" }}>
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Clients (lecture seule ici) ───────────────────────── */}
      {clients.length > 0 && (
        <>
          <SectionTitle
            eyebrow={`${clients.length} client${clients.length > 1 ? "s" : ""}`}
            title="Les clients,"
            italic="créés via les devis."
          />
          <div
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "var(--color-bg)" }}>
                  {["Nom", "Email", "Depuis"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 18px",
                        textAlign: "left",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "var(--color-subtle)",
                        fontFamily: "var(--font-geist)",
                        fontWeight: 400,
                        borderBottom: "1px solid var(--color-line)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{ borderTop: i > 0 ? "1px solid var(--color-line)" : "none" }}
                  >
                    <td style={{ padding: "11px 18px", fontWeight: 500 }}>{u.name ?? "—"}</td>
                    <td style={{ padding: "11px 18px", color: "var(--color-muted)" }}>{u.email}</td>
                    <td style={{ padding: "11px 18px", fontSize: 12, color: "var(--color-subtle)", fontFamily: "var(--font-geist)" }}>
                      {u.createdAt.toLocaleDateString("fr-BE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardShell>
  );
}

/* ── Composants ──────────────────────────────────────────────────── */

function InviteField({
  label,
  name,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--color-muted)",
          fontFamily: "var(--font-geist)",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "9px 12px",
          background: "var(--color-bg)",
          border: "1px solid var(--color-line)",
          borderRadius: 7,
          fontSize: 14,
          outline: "none",
          color: "var(--color-ink)",
        }}
      />
    </label>
  );
}

function CredRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-subtle)",
          fontFamily: "var(--font-geist)",
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      <p
        className="select-all"
        style={{
          fontFamily: "var(--font-geist)",
          fontSize: highlight ? 18 : 14,
          fontWeight: highlight ? 700 : 500,
          color: highlight ? "var(--color-accent)" : "var(--color-ink)",
          letterSpacing: highlight ? "0.05em" : "normal",
        }}
      >
        {value}
      </p>
    </div>
  );
}
