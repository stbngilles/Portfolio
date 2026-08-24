"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { openCal } from "./cal";
import { AVAILABILITY, STUDIO } from "./data";

/**
 * La bulle de réservation, en bas à droite de toutes les pages publiques.
 *
 * Elle existe parce que la réservation n'était atteignable qu'en bas de la home
 * ou sur `/contact` : le visiteur qui lit un guide ou une étude de cas n'avait
 * aucun chemin vers une date sans revenir en arrière.
 *
 * Ce qu'elle n'a pas, et qu'ont les widgets du genre : de compte à rebours, ni
 * de « plus que deux places ». Un chiffre qui se réinitialise au rechargement
 * est faux, et il serait la seule chose fausse d'un site qui affiche ses prix,
 * ses délais et le nom de la personne au bout du fil. La ligne de rareté ici
 * est `AVAILABILITY`, tenue à la main dans `data.ts`, ou rien.
 *
 * Elle ne s'ouvre pas d'elle-même : la bulle apparaît après un moment de
 * lecture, le panneau attend un clic. Rien n'est stocké, donc rien à consentir
 * côté cookies.
 */

/** Les cinq prochains jours, libellés en français. Calculés après montage. */
function nextDays(count = 5) {
  const fmtDay = new Intl.DateTimeFormat("fr-BE", { weekday: "short" });
  const fmtNum = new Intl.DateTimeFormat("fr-BE", { day: "numeric" });
  const out: { iso: string; day: string; num: string }[] = [];
  const d = new Date();
  for (let i = 0; i < count; i++) {
    out.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      day: fmtDay.format(d).replace(".", ""),
      num: fmtNum.format(d),
    });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export default function BookingWidget() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<ReturnType<typeof nextDays>>([]);

  useEffect(() => {
    const reveal = () => {
      setDays(nextDays());
      setShown(true);
      window.removeEventListener("scroll", onScroll);
    };
    // Après un écran et demi de lecture, ou huit secondes — le premier des deux.
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 1.5) reveal();
    };
    const timer = window.setTimeout(reveal, 8000);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const book = useCallback((iso?: string) => {
    setOpen(false);
    openCal(iso);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!shown) return null;

  return (
    <div className="pb-book" data-open={open ? "" : undefined}>
      {open && (
        <div className="pb-book-card" role="dialog" aria-label="Réserver un appel">
          <button className="pb-book-x" onClick={() => setOpen(false)} aria-label="Fermer">
            ✕
          </button>

          <div className="pb-book-who">
            <Image src={STUDIO.img} alt="" width={44} height={44} className="pb-book-face" />
            <div>
              <b>{STUDIO.name}</b>
              <span>{STUDIO.role} · Pixelbrute</span>
            </div>
          </div>

          <p className="pb-book-t">Cadrage et devis — 15 min</p>
          <p className="pb-book-p">
            Vous décrivez ce qui coince, on chiffre le projet pendant l&apos;appel. Par téléphone ou
            en visio, sans engagement.
          </p>

          {AVAILABILITY && <p className="pb-book-slot">{AVAILABILITY}</p>}

          <div className="pb-book-days">
            {days.map((d) => (
              <button key={d.iso} onClick={() => book(d.iso)}>
                <span>{d.day}</span>
                <b>{d.num}</b>
              </button>
            ))}
          </div>

          <button className="pb-book-go" onClick={() => book()}>
            Voir les créneaux
          </button>
        </div>
      )}

      <button
        className="pb-book-bubble"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Masquer la réservation" : "Réserver un appel de 15 minutes"}
      >
        {open ? "Fermer" : "Réserver 15 min"}
      </button>
    </div>
  );
}
