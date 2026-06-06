"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth-bootstrap/status")
      .then((r) => r.json())
      .then((d) => setIsFirstUser(d.empty))
      .catch(() => setIsFirstUser(false));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signUp.email({ name, email, password, callbackURL: "/app" });
    if (res.error) {
      setLoading(false);
      setError(res.error.message ?? "Impossible de créer le compte.");
      return;
    }

    if (isFirstUser) {
      await fetch("/api/auth-bootstrap/promote-first", { method: "POST" });
    }

    setLoading(false);
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="wrap" style={{ paddingTop: 80, paddingBottom: 120 }}>
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-start">
        <div className="hidden lg:block pt-6">
          <div
            className="mono uppercase flex items-center gap-3 mb-8"
            style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--color-muted)" }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            {isFirstUser ? "Bootstrap administrateur" : "Création d'un accès"}
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
            {isFirstUser ? (
              <>
                Premier inscrit,{" "}
                <em className="serif-i" style={{ color: "var(--color-accent)" }}>
                  premier maître à bord.
                </em>
              </>
            ) : (
              <>
                Quelques infos,{" "}
                <em className="serif-i" style={{ color: "var(--color-accent)" }}>
                  et c'est parti.
                </em>
              </>
            )}
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: 17, lineHeight: 1.6, maxWidth: 460 }}>
            {isFirstUser
              ? "La base est vide. Ce compte sera promu ADMIN automatiquement. Tous les suivants seront créés en CLIENT par défaut, et promus à la main quand il faudra."
              : "Vous serez recontacté après votre inscription pour finaliser votre dossier."}
          </p>
        </div>

        <div className="card p-8 md:p-10" style={{ background: "var(--color-paper)" }}>
          <div className="mb-8">
            <p
              className="mono uppercase mb-3"
              style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
            >
              · Créer un compte
            </p>
            <h2
              className="display"
              style={{ fontSize: 32, lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              On y va.
            </h2>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <Field label="Nom" type="text" value={name} onChange={setName} />
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
            <Field
              label="Mot de passe (≥ 8 caractères)"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              minLength={8}
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
              {loading ? "Création…" : "Créer le compte →"}
            </button>
          </form>

          <p
            className="mt-8 text-sm pt-6"
            style={{
              color: "var(--color-muted)",
              borderTop: "1px solid var(--color-line)",
            }}
          >
            Déjà inscrit ?{" "}
            <Link
              href="/app/login"
              className="no-underline"
              style={{ color: "var(--color-accent)", fontWeight: 500 }}
            >
              Se connecter
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
