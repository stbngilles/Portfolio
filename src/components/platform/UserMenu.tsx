"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrateur",
  COMMERCIAL: "Commercial",
  CLIENT: "Client",
  DEV: "Développeur",
};

function getInitials(nameOrEmail: string): string {
  const cleaned = nameOrEmail.trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function UserMenu({
  name,
  email,
  role,
  canImpersonate,
}: {
  name: string | null | undefined;
  email: string;
  role: string;
  canImpersonate: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const display = name ?? email;
  const initials = getInitials(display);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 transition"
        style={{
          background: open ? "var(--color-bg)" : "transparent",
          border: "1px solid var(--color-line)",
          borderRadius: 999,
          padding: "4px 10px 4px 4px",
          cursor: "pointer",
        }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span
          className="inline-flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--color-ink)",
            color: "var(--color-paper)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {initials}
        </span>
        <span style={{ fontSize: 13, color: "var(--color-ink)" }}>
          {display}
        </span>
        <span style={{ color: "var(--color-muted)", fontSize: 10 }}>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: 240,
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(15,15,20,0.08)",
            zIndex: 60,
            padding: 6,
          }}
        >
          <div className="px-3 py-3" style={{ borderBottom: "1px solid var(--color-line)" }}>
            <p style={{ fontWeight: 500 }}>{display}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
              {email}
            </p>
            <p
              className="mono uppercase mt-2"
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                color: "var(--color-subtle)",
              }}
            >
              {ROLE_LABEL[role] ?? role}
            </p>
          </div>

          {canImpersonate && (
            <Link
              href="/app/impersonate"
              onClick={() => setOpen(false)}
              className="block no-underline transition"
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                color: "var(--color-ink)",
                fontSize: 14,
              }}
            >
              Voir comme…
            </Link>
          )}

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block no-underline transition"
            style={{
              padding: "10px 12px",
              borderRadius: 6,
              color: "var(--color-muted)",
              fontSize: 14,
            }}
          >
            ← Retour au site
          </Link>

          <form action="/api/auth/sign-out" method="POST" className="mt-1">
            <button
              type="submit"
              className="block w-full text-left transition"
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                color: "#9F1239",
                fontSize: 14,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderTop: "1px solid var(--color-line)",
              }}
            >
              Déconnexion
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
