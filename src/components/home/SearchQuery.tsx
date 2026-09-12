"use client";

import { useEffect, useState } from "react";

/**
 * La requête tapée dans la scène « recherche Google » du hero.
 *
 * Elle tourne entre quelques métiers réels de la cible, agence immobilière,
 * électricien, cabinet comptable, et revient sur la forme générique. Chaque
 * requête est tapée lettre à lettre, tenue, puis effacée, comme dans une
 * barre de recherche.
 *
 * Le rendu serveur et le premier rendu client sont identiques, la forme
 * générique : pas de décalage d'hydratation, et sans JavaScript la scène
 * reste lisible. Avec `prefers-reduced-motion`, rien ne bouge.
 *
 * La scène entière est `aria-hidden` (voir `Hero`), ce texte ne parle donc
 * qu'aux yeux : pas de région live, pas d'annonce à chaque changement.
 */
const QUERIES: [string, string][] = [
  ["agence immobilière", "Waremme"],
  ["électricien", "Herstal"],
  ["expert-comptable", "Liège"],
  ["votre métier", "votre ville"],
];

const GENERIC = QUERIES.length - 1;
const TYPE_MS = 48;
const ERASE_MS = 22;
const HOLD_MS = 2600;
const FIRST_HOLD_MS = 3400;

/** La requête écrite comme on la tape : « agence immobilière + Waremme ». */
const full = ([job, town]: [string, string]) => `${job} + ${town}`;

export default function SearchQuery() {
  const [idx, setIdx] = useState(GENERIC);
  const [len, setLen] = useState(full(QUERIES[GENERIC]).length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let i = GENERIC;
    let n = full(QUERIES[i]).length;
    let phase: "hold" | "erase" | "type" = "hold";
    let timer = 0;

    const step = () => {
      const text = full(QUERIES[i]);
      let wait = TYPE_MS;

      if (phase === "hold") {
        phase = "erase";
        wait = i === GENERIC && n === text.length ? FIRST_HOLD_MS : HOLD_MS;
      } else if (phase === "erase") {
        n -= 1;
        wait = ERASE_MS;
        if (n === 0) {
          i = (i + 1) % QUERIES.length;
          phase = "type";
          wait = 260;
        }
      } else {
        n += 1;
        wait = TYPE_MS + (Math.random() * 40 - 10);
        if (n >= full(QUERIES[i]).length) phase = "hold";
      }

      setIdx(i);
      setLen(n);
      timer = window.setTimeout(step, wait);
    };

    timer = window.setTimeout(step, FIRST_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const [job, town] = QUERIES[idx];
  const typed = full([job, town]).slice(0, len);
  // Le métier en encre, « + ville » en gris : même coupe que le texte figé.
  const head = typed.slice(0, Math.min(typed.length, job.length));
  const tail = typed.slice(job.length);

  return (
    <span className="pb-search-q">
      {head}
      {tail ? <span>{tail}</span> : null}
    </span>
  );
}
