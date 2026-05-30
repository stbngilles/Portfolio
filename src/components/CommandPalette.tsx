"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  Briefcase,
  Sparkles,
  Users,
  HelpCircle,
  Mail,
  Home,
  Wrench,
} from "lucide-react";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigation" | "Services" | "Réalisations" | "Contact";
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  external?: boolean;
};

const ACTIONS: Action[] = [
  { id: "home", label: "Accueil", group: "Navigation", href: "/", icon: Home },
  { id: "work", label: "Réalisations", hint: "Voir les cas clients", group: "Réalisations", href: "/realisations", icon: Briefcase },
  { id: "process", label: "Méthode", hint: "Notre process en 4 étapes", group: "Navigation", href: "/#process", icon: Sparkles },
  { id: "duo", label: "L'équipe", hint: "Esteban & Amandine", group: "Navigation", href: "/equipe", icon: Users },
  { id: "faq", label: "FAQ", group: "Navigation", href: "/#faq", icon: HelpCircle },
  { id: "devis", label: "Estimer mon projet", hint: "Devis en 15 minutes", group: "Contact", href: "/#devis", icon: Sparkles },
  { id: "contact", label: "Contact", hint: "contact@pixelbrute.be", group: "Contact", href: "/#contact", icon: Mail },
  { id: "design", label: "Service · Web Design", group: "Services", href: "/services/web-design", icon: Wrench },
  { id: "seo", label: "Service · SEO & Visibilité", group: "Services", href: "/services/seo", icon: Wrench },
  { id: "maintenance", label: "Service · Maintenance", group: "Services", href: "/services/maintenance", icon: Wrench },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ACTIONS;
    return ACTIONS.filter((a) =>
      [a.label, a.hint, a.group].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Action[]>();
    filtered.forEach((a) => {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const flatList = filtered;

  const go = (a: Action) => {
    setOpen(false);
    if (a.href.startsWith("/#")) {
      const id = a.href.slice(2);
      if (window.location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(a.href);
      }
      return;
    }
    router.push(a.href);
  };

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const a = flatList[active];
      if (a) go(a);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmd"
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[14vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: "color-mix(in oklab, var(--color-ink) 55%, transparent)", backdropFilter: "blur(6px)" }}
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-label="Recherche rapide"
            className="relative w-full max-w-[640px] rounded-[10px] overflow-hidden"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              boxShadow: "0 24px 80px -20px rgba(15,15,20,.4)",
            }}
            initial={{ y: 14, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            onKeyDown={handleKeyNav}
          >
            <div className="flex items-center gap-3 px-5 h-[58px] border-b" style={{ borderColor: "var(--color-line)" }}>
              <Search size={16} style={{ color: "var(--color-muted)" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Aller à une page, un service…"
                className="flex-1 bg-transparent outline-none text-[15px]"
                style={{ color: "var(--color-ink)" }}
              />
              <kbd
                className="mono px-2 py-1 rounded"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  background: "var(--color-bg-deep)",
                  color: "var(--color-muted)",
                  border: "1px solid var(--color-line)",
                }}
              >
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto py-2">
              {flatList.length === 0 && (
                <div
                  className="px-5 py-8 text-center text-[14px]"
                  style={{ color: "var(--color-muted)" }}
                >
                  Aucun résultat pour <span className="serif-i">« {query} »</span>
                </div>
              )}
              {grouped.map(([group, items]) => (
                <div key={group} className="py-1">
                  <div
                    className="mono uppercase px-5 pt-3 pb-1.5"
                    style={{
                      fontSize: 9.5,
                      letterSpacing: "0.16em",
                      color: "var(--color-subtle)",
                    }}
                  >
                    {group}
                  </div>
                  {items.map((a) => {
                    const idx = flatList.indexOf(a);
                    const isActive = idx === active;
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.id}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => go(a)}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors"
                        style={{
                          background: isActive ? "var(--color-bg-deep)" : "transparent",
                          color: "var(--color-ink)",
                        }}
                      >
                        <Icon
                          size={15}
                          className=""
                          // @ts-expect-error lucide forwards style
                          style={{ color: isActive ? "var(--color-accent)" : "var(--color-muted)" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium truncate">{a.label}</div>
                          {a.hint && (
                            <div
                              className="text-[12px] truncate"
                              style={{ color: "var(--color-muted)" }}
                            >
                              {a.hint}
                            </div>
                          )}
                        </div>
                        <ArrowUpRight
                          size={14}
                          style={{
                            color: isActive ? "var(--color-accent)" : "var(--color-subtle)",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div
              className="flex items-center gap-4 px-5 h-[40px] border-t mono"
              style={{
                borderColor: "var(--color-line)",
                fontSize: 10,
                letterSpacing: "0.1em",
                color: "var(--color-muted)",
                background: "var(--color-bg)",
              }}
            >
              <span>↑↓ Naviguer</span>
              <span>↵ Ouvrir</span>
              <span className="ml-auto">Astuce · ⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
