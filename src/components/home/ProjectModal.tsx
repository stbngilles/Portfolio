"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Arrow from "./Arrow";
import { PROJECTS, pad } from "./data";
import ProjectChart from "./ProjectChart";

const N = PROJECTS.length;

/**
 * Étude de cas en modale. Extraite de l'ancienne roue des projets, qui a été
 * supprimée : la sélection l'ouvre désormais depuis une simple liste.
 *
 * Version longue (août 2026). L'ancienne modale tenait en quatre blocs et
 * quatre puces : on repartait sans savoir ce qui avait été construit. Elle
 * déroule maintenant tout le dossier, contexte, problème, décisions
 * expliquées une par une, inventaire de ce qui est en ligne, chiffres relevés
 * sur le site, résultat et preuve datée.
 *
 * Le rythme est tenu par une seule grille (`.pb-modal-cols`) : libellé mono à
 * gauche, contenu à droite. Chaque section émet donc une paire d'enfants, pas
 * un conteneur, c'est ce qui garde les libellés alignés d'un bloc à l'autre.
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
  const panel = useRef<HTMLDivElement>(null);

  /* Passer au projet suivant remet la fiche en haut. Sans ça, on arrivait sur
     le nouveau projet au milieu de ses décisions, à la hauteur où on avait
     laissé le précédent. */
  useEffect(() => {
    panel.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [index]);

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
      {/* `data-lenis-prevent` : sans lui, le scroll fluide de la page capte la
          molette et le panneau ne défile jamais, on ne voyait que le premier
          écran de l'étude de cas. */}
      <div className="pb-modal-panel" data-lenis-prevent ref={panel}>
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

        <div className="pb-modal-body">
          <h2 className="pb-modal-name" style={{ margin: 0 }}>
            {p.name}
          </h2>

          <p className="pb-modal-lede">{p.lede}</p>

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

          {/* Les chiffres se lisent sur le site du client : ils sont là pour
              être recomptés, pas pour impressionner. */}
          <div className="pb-modal-facts">
            {p.facts.map((f) => (
              <div key={f.label} className="pb-modal-fact">
                <div className="pb-modal-fact-v">{f.value}</div>
                <div className="pb-cap">{f.label}</div>
              </div>
            ))}
          </div>

          {p.chart && <ProjectChart chart={p.chart} />}

          <div className="pb-modal-cols">
            <div className="pb-modal-lbl" style={{ paddingTop: 8 }}>
              Contexte
            </div>
            <div className="pb-modal-prose">
              {p.context.map((t) => (
                <p key={t} className="pb-modal-p">
                  {t}
                </p>
              ))}
            </div>

            <div className="pb-modal-lbl pb-rule" style={{ paddingTop: 34 }}>
              Le problème
            </div>
            <div className="pb-modal-prose pb-rule" style={{ paddingTop: 26 }}>
              {p.problem.map((t) => (
                <p key={t} className="pb-modal-p">
                  {t}
                </p>
              ))}
            </div>

            <div className="pb-modal-lbl pb-rule" style={{ paddingTop: 34 }}>
              Décisions
            </div>
            <div className="pb-rule" style={{ paddingTop: 8, display: "flex", flexDirection: "column" }}>
              {p.decisions.map((d, i) => (
                <div key={d.title} className="pb-modal-dec">
                  <span className="pb-mono" style={{ fontSize: 11.5, color: "var(--pb-accent)", paddingTop: 7 }}>
                    {pad(i)}
                  </span>
                  <div>
                    <h3 className="pb-modal-dec-t">{d.title}</h3>
                    <p className="pb-modal-dec-p">{d.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pb-modal-lbl pb-rule" style={{ paddingTop: 34 }}>
              Ce qui est en ligne
            </div>
            <div className="pb-rule" style={{ paddingTop: 8 }}>
              <dl className="pb-modal-built">
                {p.built.map((b) => (
                  <div key={b.label} className="pb-modal-built-row">
                    <dt>{b.label}</dt>
                    <dd>{b.text}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="pb-modal-lbl pb-rule" style={{ paddingTop: 34 }}>
              Résultat
            </div>
            <div className="pb-modal-prose pb-rule" style={{ paddingTop: 26 }}>
              {p.outcome.map((t) => (
                <p key={t} className="pb-modal-p">
                  {t}
                </p>
              ))}

              {/* Deux sorties : la requête à retaper, et le site lui-même.
                  L'une vérifie l'affirmation, l'autre vérifie le travail. */}
              <div className="pb-modal-links">
                {p.query && (
                  <a
                    className="pb-verify pb-label"
                    href={`https://www.google.com/search?q=${encodeURIComponent(p.query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i aria-hidden="true" />
                    Vérifier « {p.query} » <Arrow dir="ne" />
                  </a>
                )}
                {p.url && (
                  <a className="pb-modal-visit pb-label" href={p.url} target="_blank" rel="noopener noreferrer">
                    Ouvrir le site <Arrow dir="ne" />
                  </a>
                )}
                {/* La modale est un aperçu ; le dossier a sa propre page,
                    partageable et indexable. */}
                <Link className="pb-modal-visit pb-label" href={`/projets/${p.slug}`}>
                  Page du dossier <Arrow dir="ne" />
                </Link>
              </div>
            </div>
          </div>

          {p.proof && (
            <div className="pb-modal-proof">
              <div className="pb-proof-shot">
                <Image
                  src={p.proof.src}
                  alt={`Capture d'écran, ${p.name}, ${p.metric}`}
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
