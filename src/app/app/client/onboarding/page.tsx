import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/platform/DashboardShell";
import { CLIENT_NAV } from "@/lib/platform-nav";
import { updateClientBilling } from "./actions";

export default async function ClientOnboardingPage() {
  const { session } = await requireRole("CLIENT", "ADMIN");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      vatNumber: true,
      address: true,
      postalCode: true,
      city: true,
      country: true,
    },
  });

  if (!user) return null;

  return (
    <DashboardShell
      eyebrow="Onboarding"
      title="Vos informations,"
      italic="pour bien démarrer."
      nav={CLIENT_NAV}
    >
      <p style={{ fontSize: 14, color: "var(--color-muted)", marginBottom: 32, maxWidth: 560, lineHeight: 1.65 }}>
        On a parlé de l&apos;essentiel lors de notre appel. Il nous faut juste vos coordonnées de facturation
        pour émettre vos factures, et vos fichiers (logo, photos) pour démarrer le design.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "flex-start" }}>

        {/* Formulaire coordonnées */}
        <form action={updateClientBilling}>
          <input type="hidden" name="userId" value={session.user.id} />

          <div
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--color-line)", background: "var(--color-bg)" }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>Coordonnées de facturation</p>
              <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 2 }}>
                Nécessaires pour vos factures légales.
              </p>
            </div>
            <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <F label="Nom complet"    name="name"       defaultValue={user.name ?? ""}       placeholder="Marie Dupont" required />
              <F label="Téléphone"      name="phone"      defaultValue={user.phone ?? ""}      placeholder="+32 470 12 34 56" />
              <F label="N° TVA (si applicable)" name="vatNumber" defaultValue={user.vatNumber ?? ""} placeholder="BE0123.456.789" />
              <div /> {/* spacer */}
              <div style={{ gridColumn: "1 / -1" }}>
                <F label="Adresse (rue + numéro)" name="address" defaultValue={user.address ?? ""} placeholder="Rue de la Paix 12" />
              </div>
              <F label="Code postal" name="postalCode" defaultValue={user.postalCode ?? ""} placeholder="4000" />
              <F label="Ville"       name="city"       defaultValue={user.city ?? ""}       placeholder="Liège" />
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block" }}>
                  <span style={labelStyle}>Pays</span>
                  <select name="country" defaultValue={user.country ?? "BE"} style={inputStyle}>
                    <option value="BE">🇧🇪 Belgique</option>
                    <option value="FR">🇫🇷 France</option>
                    <option value="LU">🇱🇺 Luxembourg</option>
                    <option value="NL">🇳🇱 Pays-Bas</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </label>
              </div>
            </div>
            <div style={{ padding: "0 20px 20px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={{ padding: "10px 22px", background: "var(--color-accent)", color: "white", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Enregistrer →
              </button>
            </div>
          </div>
        </form>

        {/* Colonne droite : dépôt de fichiers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-accent)",
              borderRadius: 10,
              padding: "20px",
            }}
          >
            <p style={{ fontWeight: 600, color: "var(--color-accent-ink)", fontSize: 14, marginBottom: 8 }}>
              📁 Déposez vos fichiers
            </p>
            <p style={{ fontSize: 13, color: "var(--color-accent-ink)", opacity: 0.85, marginBottom: 16, lineHeight: 1.55 }}>
              Logo, photos, textes… Plus vite vous les déposez, plus vite on démarre le design.
            </p>
            <Link
              href="/app/client/assets"
              style={{
                display: "block",
                textAlign: "center",
                padding: "10px 16px",
                background: "var(--color-accent)",
                color: "white",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Déposer mes fichiers →
            </Link>
          </div>

          {/* Infos déjà renseignées */}
          {(user.vatNumber || user.address) && (
            <div style={{ background: "var(--color-paper)", border: "1px solid var(--color-line)", borderRadius: 10, padding: "16px 18px" }}>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 10 }}>
                Informations enregistrées
              </p>
              {user.vatNumber && <InfoRow label="TVA"     value={user.vatNumber} />}
              {user.phone     && <InfoRow label="Tél."    value={user.phone} />}
              {user.address   && <InfoRow label="Adresse" value={`${user.address}, ${user.postalCode} ${user.city}`} />}
            </div>
          )}

          <Link
            href="/app/client"
            style={{ fontSize: 13, color: "var(--color-muted)", textDecoration: "none", textAlign: "center" }}
          >
            ← Retour à mon projet
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}

/* ── Composants ──────────────────────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em",
  color: "var(--color-muted)", fontFamily: "var(--font-geist)",
  display: "block", marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px",
  background: "var(--color-bg)", border: "1px solid var(--color-line)",
  borderRadius: 7, fontSize: 14, outline: "none", color: "var(--color-ink)",
};

function F({ label, name, defaultValue, placeholder, required }: {
  label: string; name: string; defaultValue: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}{required ? " *" : ""}</span>
      <input type="text" name={name} defaultValue={defaultValue} placeholder={placeholder} required={required} style={inputStyle} />
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, paddingBottom: 6, marginBottom: 6, borderBottom: "1px solid var(--color-line)" }}>
      <span style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-geist)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-ink)", textAlign: "right" }}>{value}</span>
    </div>
  );
}
