import { BOOKING_CAL_LINK, BOOKING_URL } from "./data";

/**
 * Chargement et ouverture de la modale Cal.com.
 *
 * Trois contraintes, dans cet ordre :
 *
 * 1. Rien au chargement de la page. Le script de Cal.com pèse plus lourd que
 *    le site ; il n'est injecté qu'au premier clic, et une seule fois — la
 *    promesse est gardée au niveau du module, pas du composant.
 * 2. Ça marche sans JavaScript. Les composants qui appellent `openCal` gardent
 *    un `href` vers `BOOKING_URL` : sans script, sans hydratation, ou si leur
 *    CDN tombe, le lien reste un lien.
 * 3. Un échec ne bloque pas. Si le script ne répond pas, on part sur la page
 *    publique plutôt que d'avaler le clic en silence.
 */

type CalFn = ((...args: unknown[]) => void) & { loaded?: boolean; ns?: unknown; q?: unknown[] };

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

let pending: Promise<CalFn> | null = null;

/** Amorce officielle de Cal.com : une file d'attente, puis le script qui la vide. */
function injectCal(): Promise<CalFn> {
  return (pending ??= new Promise<CalFn>((resolve, reject) => {
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

/**
 * Ouvre le calendrier par-dessus la page. `date` (AAAA-MM-JJ) pré-sélectionne
 * un jour : les créneaux affichés restent ceux de Cal.com, jamais les nôtres.
 */
export function openCal(date?: string) {
  injectCal()
    .then((Cal) => {
      Cal("init", { origin: "https://cal.com" });
      Cal("modal", {
        calLink: BOOKING_CAL_LINK,
        config: {
          layout: "month_view",
          ...(date ? { date, month: date.slice(0, 7) } : {}),
        },
      });
    })
    .catch(() => {
      pending = null; // réessayer au clic suivant plutôt que rester en panne
      window.open(BOOKING_URL, "_blank", "noopener");
    });
}

/** Vrai quand l'utilisateur veut ouvrir un onglet, pas la modale. */
export function wantsNewTab(e: React.MouseEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}
