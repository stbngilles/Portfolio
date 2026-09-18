import { track as vercelTrack } from "@vercel/analytics";

/**
 * Événements de conversion du site public.
 *
 * Jusqu'ici, la mesure comptait des pages vues, rien d'autre : impossible de
 * dire quelle page produit un appel réservé, un formulaire envoyé ou un clic
 * sur le numéro. Sans ça, une campagne Google Ads se pilote à l'aveugle, et
 * le premier euro dépensé l'est pour rien.
 *
 * Chaque événement part vers deux destinations :
 *
 * , Vercel Web Analytics, déjà en place, sans cookie ni consentement. Les
 *    événements personnalisés y sont comptés sur les offres Pro et
 *    Entreprise ; sur l'offre gratuite, l'appel est accepté et ignoré, il ne
 *    casse rien.
 * , `window.dataLayer`, que lit Google Tag Manager (`(home)/layout.tsx`).
 *    Chaque nom y est un déclencheur « Événement personnalisé », relié à un
 *    événement GA4 du même nom. Les balises n'envoient rien sans l'accord
 *    donné dans la bannière (`Consent.tsx`).
 *
 * Les noms sont courts, en anglais, stables : ils deviennent des noms de
 * conversion dans Google Ads, et un nom qui change casse l'historique.
 */
export type PbEvent =
  /** Le calendrier Cal.com s'ouvre (modale ou nouvel onglet). */
  | "booking_open"
  /** Cal.com confirme qu'un créneau est réservé. La conversion qui compte. */
  | "booking_done"
  /** Le formulaire de contact est parti (Formspree a répondu OK). */
  | "brief_sent"
  /** Une ressource `/ressources/<slug>` est partie par e-mail, avec l'inscription à la newsletter. Propriété `ressource` : le slug. */
  | "ressource_requested"
  | "tel_click"
  | "whatsapp_click"
  | "mail_click";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: PbEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const data: Props = { page: window.location.pathname, ...props };
  try {
    vercelTrack(name, data);
  } catch {
    /* la mesure ne doit jamais casser l'action mesurée */
  }
  try {
    (window.dataLayer ??= []).push({ event: name, ...data });
  } catch {
    /* idem */
  }
}
