"use client";

import { useEffect, useRef, useState } from "react";
import Arrow from "./Arrow";
import BookCall from "./BookCall";
import { embedCal } from "./cal";

/**
 * Le calendrier Cal.com posé dans la page, ouvert, sans clic.
 *
 * Sur `/contact`, où arrivent les annonces, le calendrier est l'action même :
 * le montrer ouvert retire l'étape « ouvrir la modale ». Le script reste
 * chargé en différé, à l'approche de la section, pour ne pas peser sur le
 * premier écran (voir `cal.ts`).
 *
 * En attendant, et si Cal.com ne répond pas, un lien vers la page publique
 * tient la place : la section ne reste jamais vide.
 */
type State = "idle" | "loading" | "ready" | "error";

export default function CalInline() {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const el = box.current;
    const target = frame.current;
    if (!el || !target) return;

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        io.disconnect();
        setState("loading");
        embedCal(
          target,
          () => setState("ready"),
          () => setState("error"),
        );
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="pb-cx-cal-box" data-state={state}>
      <div ref={frame} className="pb-cx-cal-frame" />
      <div className="pb-cx-cal-wait" aria-live="polite">
        <span className="pb-cap">
          {state === "error" ? "L'agenda ne s'affiche pas ici" : "Chargement de l'agenda"}
        </span>
        <BookCall className="pb-btn-solid">
          Ouvrir l&apos;agenda <Arrow dir="ne" />
        </BookCall>
      </div>
    </div>
  );
}
