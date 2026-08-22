"use client";

import { useEffect } from "react";
import Image from "next/image";
import Arrow from "./Arrow";
import { PROJECTS, pad } from "./data";

const N = PROJECTS.length;

/**
 * Étude de cas en modale. Extraite de l'ancienne roue des projets, qui a été
 * supprimée : la sélection l'ouvre désormais depuis une simple liste.
 *
 * Les deux « captures d'ambiance » d'origine montraient les images des projets
 * voisins — un remplissage qui laissait croire qu'on regardait le projet
 * courant. Elles sont remplacées par la vraie preuve datée quand elle existe.
 */
export default function ProjectModal({
  index,
  onClose,
  onNext,
  onPrev,
}: {
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const p = PROJECTS[index];

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="pb-modal" role="dialog" aria-modal="true" aria-label={`Étude de cas ${p.name}`}>
      <div style={{ position: "absolute", inset: 0 }} onClick={onClose} aria-hidden="true" />
      <div className="pb-modal-panel">
        <div className="pb-modal-bar">
          <div
            className="pb-mono"
            style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            <span style={{ background: "var(--pb-accent)", color: "#fff", borderRadius: 999, padding: "5px 10px" }}>
              {pad(index)}
            </span>
            <span style={{ color: "var(--pb-ink-3)" }}>{p.sector}</span>
          </div>
          <button type="button" className="pb-modal-close" onClick={onClose}>
            Fermer <Arrow dir="x" />
          </button>
        </div>

        {(p.shot ?? p.mockup) && (
          <div className="pb-modal-hero">
            <Image
              src={(p.shot ?? p.mockup)!}
              alt={p.shot ? `Page d'accueil de ${p.name} — capture du site livré` : `${p.name} — présenté sur ordinateur portable`}
              fill
              sizes="(max-width: 1120px) 100vw, 1100px"
            />
          </div>
        )}

        <div className="pb-modal-body">
          <h2 className="pb-modal-name" style={{ margin: 0 }}>
            {p.name}
          </h2>

          <div className="pb-modal-meta">
            <div>
              <div style={{ color: "var(--pb-accent)", marginBottom: 7 }}>Rôle</div>
              {p.role}
            </div>
            <div>
              <div style={{ color: "var(--pb-accent)", marginBottom: 7 }}>Livré</div>
              {p.stack}
            </div>
            <div>
              <div style={{ color: "var(--pb-accent)", marginBottom: 7 }}>Résultat</div>
              {p.result}
            </div>
          </div>

          <div className="pb-modal-cols">
            <div className="pb-modal-lbl" style={{ paddingTop: 8 }}>
              Contexte
            </div>
            <p className="pb-modal-p" style={{ margin: 0 }}>
              {p.context}
            </p>

            <div className="pb-modal-lbl pb-rule" style={{ paddingTop: 34 }}>
              Le problème
            </div>
            <p className="pb-modal-p pb-rule" style={{ margin: 0, paddingTop: 26 }}>
              {p.problem}
            </p>

            <div className="pb-modal-lbl pb-rule" style={{ paddingTop: 34 }}>
              Décisions
            </div>
            <div className="pb-rule" style={{ paddingTop: 8, display: "flex", flexDirection: "column" }}>
              {p.decisions.map((d, i) => (
                <div key={d} className="pb-modal-dec">
                  <span className="pb-mono" style={{ fontSize: 11.5, color: "var(--pb-accent)", paddingTop: 6 }}>
                    {pad(i)}
                  </span>
                  <span style={{ fontSize: 19, lineHeight: 1.55, letterSpacing: "-0.008em" }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {p.proof && (
            <div className="pb-modal-proof">
              <div className="pb-proof-shot">
                <Image
                  src={p.proof.src}
                  alt={`Capture d'écran — ${p.name}, ${p.metric}`}
                  width={p.proof.w}
                  height={p.proof.h}
                  sizes="(max-width: 1120px) 100vw, 1050px"
                />
              </div>
              <div className="pb-proof-cap pb-cap">{p.proof.caption}</div>
            </div>
          )}

          <div className="pb-modal-nav">
            <button type="button" onClick={onPrev}>
              <Arrow dir="w" /> Projet précédent
            </button>
            <span style={{ color: "var(--pb-ink-3)" }}>
              {pad(index)} / {pad(N - 1)}
            </span>
            <button type="button" onClick={onNext}>
              Projet suivant <Arrow dir="e" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
