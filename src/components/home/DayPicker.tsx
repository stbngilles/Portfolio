"use client";

import { useEffect, useState } from "react";
import Arrow from "./Arrow";
import BookCall from "./BookCall";
import { nextDays, openCal } from "./cal";

/**
 * Les cinq prochains jours, en boutons. Un clic ouvre le calendrier sur ce
 * jour : les créneaux affichés restent ceux de Cal.com, jamais les nôtres.
 *
 * Les dates sont calculées après montage, sinon le rendu serveur (fuseau du
 * serveur, heure du build) et celui du navigateur divergent.
 */
export default function DayPicker() {
  const [days, setDays] = useState<ReturnType<typeof nextDays>>([]);

  useEffect(() => {
    setDays(nextDays());
  }, []);

  return (
    <>
      <div className="pb-book-days pb-cx-days" role="group" aria-label="Choisir un jour">
        {days.map((d) => (
          <button
            key={d.iso}
            type="button"
            onClick={() => openCal(d.iso)}
            aria-label={`Voir les créneaux du ${d.day} ${d.num}`}
          >
            <span>{d.day}</span>
            <b>{d.num}</b>
          </button>
        ))}
      </div>
      <BookCall className="pb-book-go pb-cx-go">
        Voir tous les créneaux <Arrow dir="ne" />
      </BookCall>
    </>
  );
}
