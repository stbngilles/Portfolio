"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nextDays, openCal } from "./cal";
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
 * La carte ne s'ouvre qu'au clic, jamais seule. Ouverte à l'arrivée, elle
 * masquait le titre du hero, couvrait le premier écran sur mobile (ce que
 * Google compte comme interstitiel intrusif) et proposait un appel à quelqu'un
 * qui n'avait encore vu ni un projet ni un prix. Pas d'ouverture en fin de page
 * non plus : chaque page y a déjà son appel à l'action, la carte le doublerait.
 *
 * Le délai d'apparition de la bulle n'est pas du théâtre : à zéro, elle entre
 * en même temps que le hero et les deux animations se marchent dessus.
 */

/** Le temps que la première section se pose. */
const SHOW_DELAY = 1400;

/** `/contact` a sa propre barre (`StickyBook`) : la bulle y ferait doublon. */
const OWN_BAR = ["/contact"];

export default function BookingWidget() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<ReturnType<typeof nextDays>>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDays(nextDays());
      setShown(true);
    }, SHOW_DELAY);

    return () => window.clearTimeout(timer);
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

  if (!shown || OWN_BAR.includes(pathname)) return null;

  return (
    <div className="pb-book" data-open={open ? "" : undefined}>
      {open && (
        <div className="pb-book-card" role="dialog" aria-label="Réserver un appel">
          <button className="pb-book-x" onClick={() => setOpen(false)} aria-label="Fermer">
            ✕
          </button>

          <div className="pb-book-who">
            <Image src={STUDIO.img} alt="" width={43} height={43} className="pb-book-face" />
            <div>
              <b>{STUDIO.name}</b>
              <span>{STUDIO.role} · Pixelbrute</span>
            </div>
          </div>

          <p className="pb-book-t">Cadrage et devis, 15 min</p>
          <p className="pb-book-p">
            Vous décrivez ce qui coince, vous repartez avec un prix, ou un devis écrit sous
            48&nbsp;h pour le sur mesure. Par téléphone ou en visio, sans engagement.
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
