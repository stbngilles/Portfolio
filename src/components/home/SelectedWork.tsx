"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Arrow from "./Arrow";
import { PROJECTS, pad } from "./data";
import ProjectModal from "./ProjectModal";
import { Lines } from "./Text";

const N = PROJECTS.length;

const ORDER = PROJECTS;

/** Largeur de chaque vignette sur la grille 12 colonnes, le rythme de la page. */
const SPAN = ["7", "5", "5", "7", "6", "6"];

/**
 * Le travail, en grand. Cinq projets sur une grille irrégulière : chaque
 * capture est un cadre sans bordure, l'image scale au survol, un curseur
 * « Voir » suit la souris. Le nom et la preuve viennent sous l'image, rien
 * d'autre, l'étude de cas s'ouvre en modale.
 */
export default function SelectedWork() {
  const [open, setOpen] = useState<number | null>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(() => setOpen((o) => (o === null ? o : (o + 1) % N)), []);
  const prev = useCallback(() => setOpen((o) => (o === null ? o : (o + N - 1) % N)), []);

  useEffect(() => {
    const g = grid.current;
    const c = cursor.current;
    if (!g || !c || !window.matchMedia("(hover: hover)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, on = false;
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      c.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${on ? 1 : 0.4})`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      on = !!(e.target as HTMLElement).closest(".pb-tile-img");
      if (on) c.dataset.on = "";
      else delete c.dataset.on;
    };
    const leave = () => {
      on = false;
      delete c.dataset.on;
    };
    g.addEventListener("mousemove", move);
    g.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      g.removeEventListener("mousemove", move);
      g.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="projets" className="pb-work-sec">
      <div className="pb-work-head">
        <div className="pb-over" data-reveal="">
          Projets · 2025, 2026
        </div>
        <Lines className="pb-d-l" lines={["Six projets,", "et la preuve datée."]} muteFrom={1} />
      </div>

      <div className="pb-work-grid" ref={grid}>
        {ORDER.map((p, i) => (
          <article key={p.slug} className="pb-tile" style={{ ["--span" as string]: SPAN[i] }} data-reveal="">
            <button type="button" className="pb-tile-img" onClick={() => setOpen(PROJECTS.indexOf(p))} aria-label={`Ouvrir l'étude de cas ${p.name}`}>
              <div className="pb-tile-frame">
                {p.mockup ? (
                  <Image src={p.mockup} alt={`${p.name}, site livré, présenté sur ordinateur portable`} fill sizes="(max-width: 900px) 100vw, 60vw" />
                ) : p.shot ? (
                  <Image src={p.shot} alt={`Page d'accueil de ${p.name}, capture du site livré`} fill sizes="(max-width: 900px) 100vw, 60vw" />
                ) : (
                  <div className="pb-tile-missing pb-label">{p.name} · capture à venir</div>
                )}
              </div>
            </button>

            <div className="pb-tile-foot">
              <div className="pb-tile-id">
                <span className="pb-mono pb-cap">{pad(i)}</span>
                {/* Le nom mène à la page du dossier. La vignette ouvre toujours
                    la modale : un lecteur pressé garde l'aperçu, et le moteur
                    obtient enfin un lien qu'il peut suivre, la modale n'a
                    aucune URL à indexer. */}
                <h3 className="pb-d-s pb-tile-name">
                  <Link href={`/projets/${p.slug}`}>{p.name}</Link>
                </h3>
                <span className="pb-cap">{p.sector}</span>
              </div>
              <div className="pb-tile-metric">
                {p.query ? (
                  <a
                    className="pb-verify pb-label"
                    href={`https://www.google.com/search?q=${encodeURIComponent(p.query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i aria-hidden="true" />
                    {p.metric} <Arrow dir="ne" />
                  </a>
                ) : (
                  <span className="pb-label pb-tile-fact">{p.metric}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="pb-work-more">
        <Link href="/projets" className="pb-btn-line">
          Les six dossiers en entier <Arrow dir="ne" />
        </Link>
      </div>

      <div className="pb-cursor pb-label" ref={cursor} aria-hidden="true">
        Voir <Arrow dir="ne" />
      </div>

      {open !== null && <ProjectModal index={open} onClose={close} onNext={next} onPrev={prev} />}
    </section>
  );
}
