"use client";

import { useState } from "react";

type Credential = {
  id: string;
  label: string;
  service: string;
  url: string | null;
  username: string | null;
  password: string | null;
  apiKey: string | null;
  notes: string | null;
  updatedAt?: Date | string | null;
};

const SERVICE_META: Record<string, { label: string; color: string; icon: string }> = {
  BREVO:     { label: "Brevo",         color: "#0AB9E6", icon: "✉️" },
  STRIPE:    { label: "Stripe",        color: "#635BFF", icon: "💳" },
  WORDPRESS: { label: "WordPress",     color: "#21759B", icon: "🌐" },
  DB:        { label: "Base de données",color: "#13A66A", icon: "🗄️" },
  HOSTING:   { label: "Hébergement",   color: "#D4A857", icon: "🖥️" },
  DOMAIN:    { label: "Domaine",       color: "#94949D", icon: "🔗" },
  VERCEL:    { label: "Vercel",        color: "#0F0F14", icon: "▲" },
  CLOUDFLARE:{ label: "Cloudflare",    color: "#F6821F", icon: "☁️" },
  GITHUB:    { label: "GitHub",        color: "#24292E", icon: "🐙" },
  CPANEL:    { label: "cPanel",        color: "#FF6C2C", icon: "⚙️" },
  FTP:       { label: "FTP/SFTP",      color: "#7B5BFF", icon: "📂" },
  OTHER:     { label: "Autre",         color: "var(--color-muted)", icon: "🔑" },
};

function SecretField({ label, value }: { label: string; value: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid var(--color-line)" }}>
      <span style={{ fontSize: 11, fontFamily: "var(--font-geist)", color: "var(--color-muted)", minWidth: 100, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            fontFamily: "var(--font-geist)",
            fontSize: 13,
            color: "var(--color-ink)",
            filter: revealed ? "none" : "blur(5px)",
            userSelect: revealed ? "text" : "none",
            transition: "filter 0.15s",
            wordBreak: "break-all",
            flex: 1,
          }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          style={{
            fontSize: 11,
            padding: "3px 8px",
            background: "var(--color-bg)",
            border: "1px solid var(--color-line)",
            borderRadius: 4,
            cursor: "pointer",
            color: "var(--color-muted)",
            whiteSpace: "nowrap",
          }}
        >
          {revealed ? "Masquer" : "Révéler"}
        </button>
        {revealed && (
          <button
            type="button"
            onClick={copy}
            style={{
              fontSize: 11,
              padding: "3px 8px",
              background: copied ? "#E6F5EC" : "var(--color-accent-soft)",
              border: `1px solid ${copied ? "#13A66A" : "var(--color-accent)"}`,
              borderRadius: 4,
              cursor: "pointer",
              color: copied ? "#0D6E46" : "var(--color-accent-ink)",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {copied ? "Copié ✓" : "Copier"}
          </button>
        )}
      </div>
    </div>
  );
}

function PlainField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid var(--color-line)" }}>
      <span style={{ fontSize: 11, fontFamily: "var(--font-geist)", color: "var(--color-muted)", minWidth: 100, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-geist)", fontSize: 13, color: "var(--color-ink)", wordBreak: "break-all", flex: 1 }}>
          {value.startsWith("http") ? (
            <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
              {value} ↗
            </a>
          ) : value}
        </span>
        <button
          type="button"
          onClick={copy}
          style={{
            fontSize: 11,
            padding: "3px 8px",
            background: copied ? "#E6F5EC" : "var(--color-bg)",
            border: `1px solid ${copied ? "#13A66A" : "var(--color-line)"}`,
            borderRadius: 4,
            cursor: "pointer",
            color: copied ? "#0D6E46" : "var(--color-muted)",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "Copié ✓" : "Copier"}
        </button>
      </div>
    </div>
  );
}

/** Carte des credentials — Client Component pour reveal/copy.
 *  Le bouton supprimer est géré côté serveur (form action) séparément.
 */
export function CredentialCard({
  credential,
}: {
  credential: Credential;
}) {
  const meta = SERVICE_META[credential.service] ?? SERVICE_META.OTHER;

  return (
    <div
      style={{
        background: "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <span style={{ fontSize: 16 }}>{meta.icon}</span>
        <div>
          <span
            style={{
              fontSize: 10,
              fontFamily: "var(--font-geist)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: meta.color,
              fontWeight: 600,
            }}
          >
            {meta.label}
          </span>
          <p style={{ fontWeight: 600, fontSize: 14, color: "var(--color-ink)", lineHeight: 1.2 }}>
            {credential.label}
          </p>
        </div>
      </div>

      {/* Champs */}
      <div style={{ padding: "4px 16px 12px" }}>
        {credential.url && <PlainField label="URL" value={credential.url} />}
        {credential.username && <PlainField label="Identifiant" value={credential.username} />}
        {credential.password && <SecretField label="Mot de passe" value={credential.password} />}
        {credential.apiKey && <SecretField label="Clé API" value={credential.apiKey} />}
        {credential.notes && (
          <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 10, fontStyle: "italic", lineHeight: 1.5 }}>
            📝 {credential.notes}
          </p>
        )}
        {/* Audit trail — traçabilité de la dernière modification */}
        {credential.updatedAt && (
          <p style={{ fontSize: 10, color: "var(--color-subtle)", marginTop: 10, fontFamily: "var(--font-geist)", letterSpacing: "0.06em" }}>
            Modifié le{" "}
            {new Date(credential.updatedAt).toLocaleDateString("fr-BE", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
