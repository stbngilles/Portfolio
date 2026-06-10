import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/platform/DashboardShell";
import { CLIENT_NAV } from "@/lib/platform-nav";
import { updateClientBilling } from "../onboarding/actions";

export default async function ClientProfilPage() {
  const { session } = await requireRole("CLIENT", "ADMIN");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true, email: true, phone: true,
      vatNumber: true, address: true,
      postalCode: true, city: true, country: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return (
    <DashboardShell
      eyebrow="Mon profil"
      title="Mes informations,"
      italic="de facturation."
      nav={CLIENT_NAV}
    >
      <div style={{ maxWidth: 640 }}>
        <p style={{ fontSize: 14, color: "var(--color-muted)", marginBottom: 28, lineHeight: 1.6 }}>
          Ces informations apparaissent sur vos factures. Gardez-les à jour.
        </p>

        <form action={updateClientBilling}>
          <input type="hidden" name="userId" value={session.user.id} />

          <div
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--color-line)", background: "var(--color-bg)" }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>Coordonnées</p>
            </div>
            <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <F label="Nom complet *"  name="name"       defaultValue={user.name ?? ""}       placeholder="Marie Dupont" required />
              <F label="Email"          name="_email"     defaultValue={user.email}             disabled />
              <F label="Téléphone"      name="phone"      defaultValue={user.phone ?? ""}      placeholder="+32 470 12 34 56" />
              <F label="N° TVA"         name="vatNumber"  defaultValue={user.vatNumber ?? ""}  placeholder="BE0123.456.789" />
              <div style={{ gridColumn: "1 / -1" }}>
                <F label="Adresse (rue + numéro)" name="address" defaultValue={user.address ?? ""} placeholder="Rue de la Paix 12" />
              </div>
              <F label="Code postal" name="postalCode" defaultValue={user.postalCode ?? ""} placeholder="4000" />
              <F label="Ville"       name="city"       defaultValue={user.city ?? ""}       placeholder="Liège" />
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block" }}>
                  <span style={labelStyle}>Pays</span>
                  <select name="country" defaultValue={user.country ?? "BE"} style={selectStyle}>
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

        <p style={{ fontSize: 12, color: "var(--color-subtle)", marginTop: 20, textAlign: "center" }}>
          Client depuis le {user.createdAt.toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
          Pour changer votre mot de passe ou votre email, contactez votre chargé de compte.
        </p>
      </div>
    </DashboardShell>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em",
  color: "var(--color-muted)", fontFamily: "var(--font-geist)",
  display: "block", marginBottom: 6,
};

const inputBase: React.CSSProperties = {
  width: "100%", padding: "9px 12px",
  background: "var(--color-bg)", border: "1px solid var(--color-line)",
  borderRadius: 7, fontSize: 14, outline: "none", color: "var(--color-ink)",
};

const selectStyle: React.CSSProperties = { ...inputBase };

function F({ label, name, defaultValue, placeholder, required, disabled }: {
  label: string; name: string; defaultValue: string;
  placeholder?: string; required?: boolean; disabled?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={{ ...inputBase, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "auto" }}
      />
    </label>
  );
}
