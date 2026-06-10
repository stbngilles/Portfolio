"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Workspace = {
  key: "admin" | "commercial" | "client" | "dev" | "comptable";
  href: string;
  label: string;
  color: string;
  description: string;
};

const ALL_WORKSPACES: Workspace[] = [
  {
    key: "admin",
    href: "/app/admin",
    label: "Administration",
    color: "#0F0F14",
    description: "Vue agence, projets, commissions",
  },
  {
    key: "commercial",
    href: "/app/commercial",
    label: "Cockpit commercial",
    color: "var(--color-accent)",
    description: "Pipeline, devis, commissions perso",
  },
  {
    key: "client",
    href: "/app/client",
    label: "Espace client",
    color: "#13A66A",
    description: "Projet, factures, demandes",
  },
  {
    key: "dev",
    href: "/app/dev",
    label: "Espace dev",
    color: "#7B5BFF",
    description: "Missions, briefs, paiements",
  },
  {
    key: "comptable",
    href: "/app/comptable",
    label: "Espace comptable",
    color: "#D4A857",
    description: "Paiements à effectuer, statuts",
  },
];

export function WorkspaceSwitcher({
  availableKeys,
}: {
  availableKeys: Workspace["key"][];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const available = ALL_WORKSPACES.filter((w) => availableKeys.includes(w.key));
  const current =
    available.find((w) => pathname.startsWith(w.href)) ?? available[0];

  // Si un seul espace dispo, pas besoin de switcher → on affiche juste le label
  if (available.length <= 1) {
    if (!current) return null;
    return (
      <span
        className="mono uppercase"
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "var(--color-muted)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: current.color }}
        />
        {current.label}
      </span>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 transition"
        style={{
          background: open ? "var(--color-bg)" : "transparent",
          border: "1px solid var(--color-line)",
          borderRadius: 8,
          padding: "6px 12px",
          color: "var(--color-ink)",
          fontSize: 13,
          cursor: "pointer",
        }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: current?.color ?? "var(--color-muted)" }}
        />
        <span style={{ fontWeight: 500 }}>{current?.label ?? "Espace"}</span>
        <span style={{ color: "var(--color-muted)", fontSize: 10 }}>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: 260,
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(15,15,20,0.08)",
            zIndex: 60,
            padding: 6,
          }}
        >
          <p
            className="mono uppercase px-3 py-2"
            style={{
              fontSize: 9,
              letterSpacing: "0.14em",
              color: "var(--color-subtle)",
            }}
          >
            · Espaces accessibles
          </p>
          {available.map((w) => {
            const isCurrent = w.key === current?.key;
            return (
              <Link
                key={w.key}
                href={w.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 no-underline transition"
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: isCurrent ? "var(--color-bg)" : "transparent",
                  color: "var(--color-ink)",
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mt-2"
                  style={{ background: w.color }}
                />
                <div className="flex-1">
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{w.label}</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {w.description}
                  </p>
                </div>
                {isCurrent && (
                  <span
                    className="mono uppercase"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      color: "var(--color-accent)",
                      alignSelf: "center",
                    }}
                  >
                    Ici
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
