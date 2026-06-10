import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { addCredential, deleteCredential } from "./actions";
import { decryptSecret } from "@/lib/crypto";
import { CredentialCard } from "@/components/platform/CredentialCard";

const SERVICE_OPTIONS = [
  "HOSTING",
  "DOMAIN",
  "VERCEL",
  "CLOUDFLARE",
  "GITHUB",
  "CPANEL",
  "FTP",
  "WORDPRESS",
  "DB",
  "STRIPE",
  "BREVO",
  "OTHER",
] as const;

const SERVICE_LABEL: Record<string, string> = {
  HOSTING:    "Hébergement",
  DOMAIN:     "Nom de domaine",
  VERCEL:     "Vercel",
  CLOUDFLARE: "Cloudflare",
  GITHUB:     "GitHub",
  CPANEL:     "cPanel",
  FTP:        "FTP / SFTP",
  WORDPRESS:  "WordPress",
  DB:         "Base de données",
  STRIPE:     "Stripe",
  BREVO:      "Brevo",
  OTHER:      "Autre",
};

// Checklist des services recommandés selon le scope (pour aider l'admin)
const RECOMMENDED = ["HOSTING", "DOMAIN", "STRIPE", "BREVO"];

export default async function TrousseauPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { session, role } = await requireRole("DEV", "ADMIN");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      credentials: { orderBy: { service: "asc" } },
      deliverySubmissions: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!project) notFound();
  if (role !== "ADMIN" && project.devId !== session.user.id) notFound();

  // Décrypter les secrets côté serveur avant de passer au client
  const credentials = project.credentials.map((c) => ({
    id: c.id,
    label: c.label,
    service: c.service,
    url: c.url,
    username: c.username,
    password: decryptSecret(c.password),
    apiKey: decryptSecret(c.apiKey),
    notes: c.notes,
    updatedAt: c.updatedAt,
  }));

  const missingRecommended = RECOMMENDED.filter(
    (s) => !credentials.some((c) => c.service === s),
  );

  const hasPendingDelivery = project.deliverySubmissions[0]?.status === "PENDING";

  return (
    <div className="wrap" style={{ paddingTop: 32, paddingBottom: 80 }}>
      {/* Titre */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 6 }}>
          Trousseau de la mission
        </p>
        <h2 className="display" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>
          Accès du projet,{" "}
          <em className="serif-i" style={{ color: "var(--color-accent)" }}>
            au même endroit.
          </em>
        </h2>
        <p style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 6, fontStyle: "italic" }}>
          ⚠️ Ne partagez jamais ces accès hors de la plateforme. Chiffrés au repos (AES-256-GCM).
        </p>
      </div>

      {/* Alerte : accès manquants avant livraison */}
      {missingRecommended.length > 0 && hasPendingDelivery && (
        <div
          style={{
            background: "#FFF8E1",
            border: "1px solid #D4A857",
            borderRadius: 10,
            padding: "14px 18px",
            marginBottom: 20,
          }}
        >
          <p style={{ fontWeight: 600, color: "#8A6914", marginBottom: 4 }}>
            ⚠️ Accès manquants avant la mise en ligne
          </p>
          <p style={{ fontSize: 13, color: "#8A6914" }}>
            Déposez les accès suivants avant de soumettre la livraison :{" "}
            <strong>{missingRecommended.map((s) => SERVICE_LABEL[s]).join(", ")}</strong>
          </p>
        </div>
      )}

      {/* Alerte : aucun accès du tout */}
      {credentials.length === 0 && (
        <div
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
            padding: "40px 24px",
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          <p style={{ fontSize: 18, color: "var(--color-muted)", fontStyle: "italic", marginBottom: 8 }}>
            Aucun accès déposé pour l&apos;instant.
          </p>
          <p style={{ fontSize: 13, color: "var(--color-subtle)" }}>
            {role === "ADMIN"
              ? "Déposez les accès nécessaires ci-dessous pour que le dev puisse travailler."
              : "L'admin déposerait les accès nécessaires. Vous pouvez aussi en ajouter."}
          </p>
        </div>
      )}

      {/* Grille des credentials */}
      {credentials.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {credentials.map((c) => (
            <div key={c.id} style={{ position: "relative" }}>
              <CredentialCard credential={c} />
              {/* Bouton supprimer — form server séparé, positionné en overlay */}
              {role === "ADMIN" && (
                <form
                  action={deleteCredential.bind(null, c.id)}
                  style={{ position: "absolute", top: 12, right: 12 }}
                >
                  <button
                    type="submit"
                    style={{
                      fontSize: 11,
                      padding: "3px 8px",
                      background: "#FEE2E2",
                      border: "1px solid #9F1239",
                      color: "#9F1239",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulaire d'ajout */}
      <div
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 12,
          padding: "24px 28px",
        }}
      >
        <p
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--color-muted)",
            fontFamily: "var(--font-geist)",
            marginBottom: 18,
          }}
        >
          {role === "ADMIN" ? "Déposer un accès" : "Ajouter un accès (vos propres credentials)"}
        </p>
        <form
          action={addCredential.bind(null, projectId)}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <F label="Libellé *" name="label" required placeholder="ex. Hébergement cPanel client" />

          <label style={{ display: "block" }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", display: "block", marginBottom: 6 }}>
              Service *
            </span>
            <select
              name="service"
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
              {SERVICE_OPTIONS.map((k) => (
                <option key={k} value={k}>{SERVICE_LABEL[k]}</option>
              ))}
            </select>
          </label>

          <F label="URL" name="url" placeholder="https://app.netlify.com/..." />
          <F label="Identifiant / Email" name="username" placeholder="admin@client.be" />
          <F label="Mot de passe" name="password" type="password" placeholder="••••••••" />
          <F label="Clé API" name="apiKey" placeholder="sk_live_..." />

          <div style={{ gridColumn: "1 / -1" }}>
            <F label="Notes" name="notes" placeholder="Permissions accordées, contexte d'utilisation, contact support..." />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-start" }}>
            <button
              type="submit"
              style={{
                padding: "10px 22px",
                background: "var(--color-accent)",
                color: "white",
                border: "none",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Déposer l&apos;accès →
            </button>
          </div>
        </form>
      </div>

      {/* Note sécurité pour dev */}
      {role === "DEV" && (
        <p style={{ fontSize: 12, color: "var(--color-subtle)", marginTop: 14, textAlign: "center" }}>
          Vos ajouts sont visibles par l&apos;admin Pixelbrute. Ne déposez que les accès liés à ce projet.
        </p>
      )}
    </div>
  );
}

function F({
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
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
