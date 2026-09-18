"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Diapo, Ligne } from "@/lib/suivi/presentation";
import { presentationVue } from "@/app/suivi/[slug]/actions";
import { Icone } from "./ui";

/**
 * Présentation d'accueil plein écran, écran par écran, façon tableau de bord.
 *
 * Pensée pour un lecteur lent : rien n'avance seul, gros texte, un bouton
 * « Suivant » toujours au même endroit, les flèches du clavier en bonus.
 */
export function Presentation({ slug, nom, diapos }: { slug: string; nom: string; diapos: Diapo[] }) {
  const router = useRouter();
  const [ouverte, setOuverte] = useState(true);
  const [i, setI] = useState(0);
  const suivant = useRef<HTMLButtonElement>(null);
  const d = diapos[i];
  const premiere = i === 0;
  const derniere = i === diapos.length - 1;

  const fermer = useCallback(() => {
    setOuverte(false);
    // Marquée vue d'abord : sinon la page rechargée pourrait la rouvrir. Si
    // l'enregistrement échoue, le client entre quand même : elle se rouvrira, rien de plus.
    presentationVue(slug)
      .catch(() => undefined)
      .then(() => router.replace(`/suivi/${slug}`, { scroll: false }));
  }, [router, slug]);

  const aller = useCallback(
    (n: number) => {
      if (n >= diapos.length) return fermer();
      setI(Math.max(0, n));
    },
    [diapos.length, fermer],
  );

  useEffect(() => {
    if (!ouverte) return;
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const touche = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") aller(i + 1);
      else if (e.key === "ArrowLeft") aller(i - 1);
      else if (e.key === "Escape") fermer();
    };
    window.addEventListener("keydown", touche);
    return () => {
      document.body.style.overflow = avant;
      window.removeEventListener("keydown", touche);
    };
  }, [ouverte, i, aller, fermer]);

  // Le focus reste sur « Suivant » : on avance en tapant Entrée, écran après écran.
  useEffect(() => {
    suivant.current?.focus({ preventScroll: true });
  }, [i]);

  if (!ouverte) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Présentation du suivi ${nom}`}
      className="pres fixed inset-0 z-50 flex flex-col overflow-hidden text-white"
    >
      <style>{CSS}</style>
      <div aria-hidden="true" className="pres-grille pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pres-halo pointer-events-none absolute inset-0" />

      {/* Barre du haut */}
      <div className="relative flex items-center justify-between gap-3 px-5 pt-5 sm:px-10 sm:pt-8">
        <p className="flex min-w-0 items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.18em] text-white/60">
          <span className="pres-pouls size-2 shrink-0 rounded-full bg-[#7FA2FF]" />
          <span className="truncate">Pixelbrute · Suivi {nom}</span>
        </p>
        <button
          type="button"
          onClick={fermer}
          className="inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full px-4 text-[15px] text-white/80 hover:bg-white/10 hover:text-white"
        >
          Passer
        </button>
      </div>

      {/* Écran */}
      <div className="relative flex min-h-0 flex-1 overflow-y-auto px-5 sm:px-10">
        <div key={d.id} aria-live="polite" className="m-auto w-full max-w-4xl py-8">
          <p className="pres-entre font-mono text-[13px] tracking-[0.2em] text-[#9DB6FF]" style={{ ["--n" as string]: 0 }}>
            {d.etiquette}
          </p>

          <div className={d.anneau ? "mt-6 grid items-center gap-10 sm:grid-cols-[auto_1fr]" : ""}>
            {d.anneau && <Anneau {...d.anneau} />}
            <div>
              <h2
                className={`pres-entre mt-4 text-balance font-semibold leading-[1.05] tracking-[-0.03em] ${
                  d.mot ? "text-[30px] sm:text-[40px]" : "text-[40px] sm:text-[64px]"
                }`}
                style={{ ["--n" as string]: 1 }}
              >
                {d.titre}
              </h2>
              {d.phrases?.map((p, k) => (
                <p
                  key={p}
                  className="pres-entre mt-5 max-w-[34ch] text-[21px] leading-snug text-white/80 sm:text-[26px]"
                  style={{ ["--n" as string]: k + 2 }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {d.lignes && (
            <ul className="mt-10 grid gap-3 md:grid-cols-2">
              {d.lignes.map((l, k) => (
                <LigneHud key={`${l.titre}-${k}`} l={l} n={k + 2} />
              ))}
            </ul>
          )}
          {d.reste && (
            <p className="pres-entre mt-5 text-[17px] text-white/60" style={{ ["--n" as string]: (d.lignes?.length ?? 0) + 2 }}>
              {d.reste}
            </p>
          )}

          {d.mot && (
            <blockquote
              className="pres-entre mt-6 max-w-[52ch] whitespace-pre-line border-l-2 border-[#7FA2FF] pl-6 text-[19px] leading-[1.5] text-white/90 sm:text-[22px]"
              style={{ ["--n" as string]: 2 }}
            >
              {d.mot}
            </blockquote>
          )}
        </div>
      </div>

      {/* Barre du bas */}
      <div className="relative px-5 pb-6 sm:px-10 sm:pb-10">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          <div className="flex gap-1.5" aria-hidden="true">
            {diapos.map((x, k) => (
              <span key={x.id} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${k <= i ? "bg-white" : "bg-white/20"}`} />
            ))}
          </div>
          <div className="flex items-center justify-end gap-3 sm:justify-between">
            <p className="hidden text-[15px] text-white/70 sm:block">
              Écran {i + 1} sur {diapos.length}
            </p>
            <div className="flex gap-2">
              {!premiere && (
                <button
                  type="button"
                  onClick={() => aller(i - 1)}
                  className="inline-flex min-h-14 cursor-pointer items-center rounded-full px-5 text-[17px] text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Précédent
                </button>
              )}
              <button
                ref={suivant}
                type="button"
                onClick={() => aller(i + 1)}
                className="pres-bouton inline-flex min-h-14 cursor-pointer items-center gap-2 rounded-full bg-white px-8 text-[18px] font-semibold text-[#0E1F6E]"
              >
                {derniere ? "Ouvrir mon espace" : premiere ? "Commencer" : "Suivant"}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ pièces

const TONS: Record<Ligne["ton"], { icone: "check" | "horloge" | "main" | "plus" | "message"; classe: string }> = {
  fait: { icone: "check", classe: "bg-[#2BB673]/20 text-[#7BE0A8]" },
  cours: { icone: "horloge", classe: "bg-[#7FA2FF]/20 text-[#B5C8FF]" },
  vous: { icone: "main", classe: "bg-[#F5B544]/20 text-[#FFD48A]" },
  option: { icone: "plus", classe: "bg-white/10 text-white/80" },
  info: { icone: "message", classe: "bg-white/10 text-white" },
};

function LigneHud({ l, n }: { l: Ligne; n: number }) {
  const t = TONS[l.ton];
  return (
    <li
      className="pres-entre flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-sm"
      style={{ ["--n" as string]: n }}
    >
      <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${t.classe}`}>
        <Icone nom={t.icone} className="size-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[19px] font-medium leading-snug [overflow-wrap:anywhere] sm:text-[21px]">{l.titre}</span>
        {l.meta && <span className="mt-1 block text-[16px] leading-snug text-white/65 sm:text-[17px]">{l.meta}</span>}
      </span>
    </li>
  );
}

function Anneau({ fait, total }: { fait: number; total: number }) {
  const pct = Math.round((fait / total) * 100);
  const r = 84;
  const c = 2 * Math.PI * r;
  return (
    <div className="pres-entre relative mx-auto size-[220px] sm:mx-0" style={{ ["--n" as string]: 1 }}>
      <svg viewBox="0 0 220 220" className="absolute inset-0" aria-hidden="true">
        {/* Graduations qui tournent lentement : le côté tableau de bord. */}
        <g className="pres-tourne" style={{ transformOrigin: "110px 110px" }}>
          <circle cx="110" cy="110" r="104" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1" strokeDasharray="2 8" />
        </g>
        <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
        <circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c}
          transform="rotate(-90 110 110)"
          className="pres-remplit"
          style={{ ["--fin" as string]: c * (1 - fait / total) }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[52px] font-semibold leading-none tabular-nums tracking-[-0.03em]">{pct} %</span>
        <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">livré</span>
      </div>
      <span className="sr-only">
        {fait} éléments livrés sur {total}, soit {pct} %.
      </span>
    </div>
  );
}

// Styles propres à la présentation : un bleu Klein nuit, une grille fine, des entrées en cascade.
const CSS = `
.pres { background: radial-gradient(120% 90% at 50% 0%, #1F3FBF 0%, #0E1F6E 45%, #070F3A 100%); }
.pres-grille {
  background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
  background-size: 55px 55px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 80%);
}
.pres-halo { background: radial-gradient(40% 35% at 50% 45%, rgba(127,162,255,.18), transparent 70%); }
.pres-entre { animation: pres-entre .7s cubic-bezier(.2,.7,.2,1) both; animation-delay: calc(var(--n, 0) * 140ms + 80ms); }
@keyframes pres-entre { from { opacity: 0; transform: translateY(14px); filter: blur(4px); } to { opacity: 1; transform: none; filter: none; } }
.pres-remplit { animation: pres-remplit 1.6s cubic-bezier(.3,.8,.2,1) .4s forwards; }
@keyframes pres-remplit { to { stroke-dashoffset: var(--fin); } }
.pres-tourne { animation: pres-tourne 40s linear infinite; }
@keyframes pres-tourne { to { transform: rotate(360deg); } }
.pres-pouls { animation: pres-pouls 2.4s ease-in-out infinite; box-shadow: 0 0 12px #7FA2FF; }
@keyframes pres-pouls { 50% { opacity: .35; } }
.pres-bouton { transition: transform .2s, box-shadow .2s; box-shadow: 0 8px 30px -8px rgba(127,162,255,.7); }
.pres-bouton:hover { transform: translateY(-1px); box-shadow: 0 12px 40px -8px rgba(127,162,255,.9); }
.pres button:focus-visible { outline: 3px solid #FFD48A; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  .pres-entre, .pres-tourne, .pres-pouls { animation: none; }
  .pres-remplit { animation: none; stroke-dashoffset: var(--fin); }
}
`;
