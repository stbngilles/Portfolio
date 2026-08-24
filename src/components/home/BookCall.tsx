"use client";

import { useCallback, type ReactNode } from "react";
import { BOOKING_CAL_LINK, BOOKING_URL } from "./data";

/**
 * Le lien de réservation, qui ouvre le calendrier en modale par-dessus le site.
 *
 * Trois contraintes, dans cet ordre :
 *
 * 1. Rien au chargement. Le script de Cal.com pèse plus lourd que la page ;
 *    il n'est injecté qu'au premier clic, et une seule fois (`pending`).
 * 2. Ça marche sans JavaScript. Le `href` est la page publique Cal.com : sans
 *    script, sans hydratation, ou si leur CDN tombe, le lien reste un lien.
 *    Même chose pour un clic milieu ou ⌘-clic, qu'on laisse filer vers l'onglet.
 * 3. Un échec ne bloque pas. Si le script ne répond pas, on part sur la page
 *    publique plutôt que d'avaler le clic en silence.
 */

type CalFn = ((...args: unknown[]) => void) & { loaded?: boolean; ns?: unknown; q?: unknown[] };

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

/**
 * Amorce officielle de Cal.com : une file d'attente, puis le script qui la vide.
 * La promesse est gardée au niveau du module, pas du composant : deux boutons
 * sur la même page ne doivent injecter le script qu'une fois.
 */
let pending: Promise<CalFn> | null = null;

function injectCal(): Promise<CalFn> {
  return (pending ??= new Promise((resolve, reject) => {
    if (window.Cal?.loaded) {
      resolve(window.Cal);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onerror = () => reject(new Error("Cal.com embed indisponible"));
    script.onload = () => (window.Cal ? resolve(window.Cal) : reject(new Error("Cal absent")));

    const cal = function (...args: unknown[]) {
      (cal.q ??= []).push(args);
    } as CalFn;
    cal.q = [];
    cal.ns = {};
    window.Cal ??= cal;

    document.head.appendChild(script);
  }));
}

type Props = Omit<React.ComponentPropsWithoutRef<"a">, "href" | "onClick"> & {
  children: ReactNode;
};

export default function BookCall({ children, ...rest }: Props) {
  const open = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Nouvel onglet demandé explicitement : on ne s'en mêle pas.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();

    injectCal()
      .then((Cal) => {
        Cal("init", { origin: "https://cal.com" });
        Cal("modal", {
          calLink: BOOKING_CAL_LINK,
          config: { layout: "month_view" },
        });
      })
      .catch(() => {
        pending = null; // réessayer au clic suivant plutôt que rester en panne
        window.open(BOOKING_URL, "_blank", "noopener");
      });
  }, []);

  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener" {...rest} onClick={open}>
      {children}
    </a>
  );
}
