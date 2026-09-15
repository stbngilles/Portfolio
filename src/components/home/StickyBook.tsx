"use client";

import { useEffect, useState } from "react";
import Arrow from "./Arrow";
import BookCall from "./BookCall";
import TrackLink from "./TrackLink";
import { IDENTITE } from "./legal";

/**
 * Barre de réservation de `/contact`, à la place de la bulle des autres pages.
 *
 * Elle n'apparaît que quand aucune autre porte n'est à l'écran : ni le bouton
 * du hero, ni le calendrier, ni le dernier écran, ni le pied de page. Deux
 * boutons « réserver » visibles à la fois, c'est un choix de trop.
 *
 * Sur téléphone, elle occupe le bas de l'écran, pouce compris, avec le
 * numéro à côté : appeler est aussi une conversion.
 */
export default function StickyBook() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-cx-watch], .pb-foot");
    if (!targets.length) return;

    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setOn(seen.size === 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className="pb-cx-sticky" data-on={on ? "" : undefined} inert={!on}>
      <TrackLink
        event="tel_click"
        href={`tel:${IDENTITE.telephoneHref}`}
        className="pb-btn-line pb-cx-sticky-tel"
        aria-label={`Appeler le ${IDENTITE.telephone}`}
      >
        Appeler
      </TrackLink>
      <BookCall className="pb-btn-solid">
        Réserver 15 min <Arrow dir="ne" />
      </BookCall>
    </div>
  );
}
