"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_KEY } from "./consent-key";

/**
 * Consentement aux cookies de mesure et de publicité (Google Analytics via
 * Google Tag Manager, Microsoft Clarity, et Google Ads le jour des annonces).
 *
 * Le consentement *par défaut* est posé avant GTM, dans le script inline de
 * `(home)/layout.tsx`, qui relit aussi le choix enregistré : un visiteur qui a
 * déjà accepté n'envoie pas une première page « refusée ». Ce composant ne
 * fait que demander, enregistrer, et mettre à jour.
 *
 * Règles de l'Autorité de protection des données, à ne pas défaire :
 * , « Refuser » et « Accepter » ont exactement le même poids visuel.
 * , Rien n'est déposé avant le clic, et fermer n'est pas accepter.
 * , Le choix se retire aussi facilement qu'il se donne : lien « Cookies »
 *   dans le pied de page, qui rouvre cette bannière.
 * , Le choix expire au bout de six mois, la question revient.
 */

const MAX_AGE = 1000 * 60 * 60 * 24 * 182;
const OPEN_EVENT = "pb:consent-open";
const SOURCE_KEY = "pb-source";

type Choice = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { v, t } = JSON.parse(raw) as { v: Choice; t: number };
    return Date.now() - t < MAX_AGE ? v : null;
  } catch {
    return null;
  }
}

export function hasConsent() {
  return readChoice() === "granted";
}

/**
 * Première page vue de la visite, avec sa provenance. Relue par le formulaire
 * de contact, qui la joint à la demande : c'est ce qui relie un contrat signé
 * à une source, là où GA4 s'arrête au formulaire envoyé. Gardée le temps de
 * l'onglet, et seulement avec l'accord du visiteur.
 */
function rememberSource() {
  try {
    if (sessionStorage.getItem(SOURCE_KEY)) return;
    const url = new URL(window.location.href);
    const p = url.searchParams;
    let ref = "";
    try {
      ref = document.referrer ? new URL(document.referrer).hostname : "";
    } catch {}
    if (ref === url.hostname) ref = "";
    const parts = [
      p.get("utm_source") && `utm_source=${p.get("utm_source")}`,
      p.get("utm_medium") && `utm_medium=${p.get("utm_medium")}`,
      p.get("utm_campaign") && `utm_campaign=${p.get("utm_campaign")}`,
      p.has("gclid") && "gclid",
      p.has("msclkid") && "msclkid",
      p.has("fbclid") && "fbclid",
      `référent=${ref || "direct"}`,
      `arrivée=${url.pathname}`,
    ].filter(Boolean);
    sessionStorage.setItem(SOURCE_KEY, parts.join(" · "));
  } catch {}
}

export function readSource() {
  try {
    return sessionStorage.getItem(SOURCE_KEY) ?? "";
  } catch {
    return "";
  }
}

function apply(choice: Choice) {
  const v = choice;
  const gtag =
    window.gtag ??
    function () {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer ??= []).push(arguments);
    };
  gtag("consent", "update", {
    analytics_storage: v,
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
  });
  if (choice === "granted") {
    // Déclencheur des balises qui ne lisent pas le mode consentement de
    // Google (Clarity) : elles partent sur cet événement, et sur lui seul.
    (window.dataLayer ??= []).push({ event: "pb_consent_granted" });
    rememberSource();
  }
}

export default function Consent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === "granted") apply("granted");
    else if (!choice) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  function choose(choice: Choice) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: choice, t: Date.now() }));
    } catch {}
    apply(choice);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="pb-consent" role="dialog" aria-label="Cookies">
      <p className="pb-consent-t">
        Des cookies pour savoir d&apos;où viennent les visites et ce qui marche. Rien ne part sans
        votre accord. <Link href="/confidentialite#cookies">Détails</Link>
      </p>
      <div className="pb-consent-acts">
        <button type="button" className="pb-btn-line" onClick={() => choose("denied")}>
          Refuser
        </button>
        <button type="button" className="pb-btn-line" onClick={() => choose("granted")}>
          Accepter
        </button>
      </div>
    </div>
  );
}

/** Lien « Cookies » du pied de page : rouvre la bannière. */
export function ConsentLink() {
  return (
    <button
      type="button"
      className="pb-consent-link"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      Cookies
    </button>
  );
}
