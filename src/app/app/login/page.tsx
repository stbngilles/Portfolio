"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn.email({ email, password, callbackURL: "/app" });
    setLoading(false);
    if (res.error) {
      setError(res.error.message ?? "Identifiants invalides.");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="wrap" style={{ paddingTop: 80, paddingBottom: 120 }}>
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-start">
        {/* Colonne gauche : éditorial */}
        <div className="hidden lg:block pt-6">
          <div
            className="mono uppercase flex items-center gap-3 mb-8"
            style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--color-muted)" }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            Espace pro Pixelbrute
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              marginBottom: 32,
            }}
          >
            Le studio,{" "}
            <em className="serif-i" style={{ color: "var(--color-accent)" }}>
              en un seul endroit.
            </em>
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: 17, lineHeight: 1.6, maxWidth: 460 }}>
            Votre projet, vos factures, vos demandes et la performance de vos campagnes —
            tout vit ici. Plus de mails perdus, plus d'angoisse de « où ça en est ».
          </p>

          <div
            className="mt-12 pt-8"
            style={{ borderTop: "1px solid var(--color-line)" }}
          >
            <p
              className="mono uppercase mb-3"
              style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
            >
              Pour qui
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "var(--color-muted)" }}>
              <li>· Clients Pixelbrute — suivi de projet, factures, demandes</li>
              <li>· Commerciaux — pipeline, devis, commissions</li>
              <li>· Équipe — administration, production</li>
            </ul>
          </div>
        </div>

        {/* Colonne droite : formulaire */}
        <div className="card p-8 md:p-10" style={{ background: "var(--color-paper)" }}>
          <div className="mb-8">
            <p
              className="mono uppercase mb-3"
              style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
            >
              · Connexion
            </p>
            <h2
              className="display"
              style={{ fontSize: 32, lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              Bienvenue.
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
              Entrez vos identifiants pour accéder à votre espace.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
            <Field
              label="Mot de passe"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />

            {error && (
              <div
                className="text-sm px-4 py-3 rounded"
                style={{
                  background: "color-mix(in srgb, #DC2626 8%, transparent)",
                  color: "#991B1B",
                  border: "1px solid color-mix(in srgb, #DC2626 20%, transparent)",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center"
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              {loading ? "Connexion…" : "Se connecter →"}
            </button>
          </form>

          <p
            className="mt-8 text-sm pt-6"
            style={{
              color: "var(--color-muted)",
              borderTop: "1px solid var(--color-line)",
            }}
          >
            Pas encore de compte ?{" "}
            <Link
              href="/app/signup"
              className="no-underline"
              style={{ color: "var(--color-accent)", fontWeight: 500 }}
            >
              Créer un accès
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  minLength,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span
        className="mono uppercase block mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}
      >
        {label}
      </span>
      <input
        type={type}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 outline-none transition"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-line)",
          borderRadius: 8,
          color: "var(--color-ink)",
          fontSize: 15,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line)")}
      />
    </label>
  );
}
