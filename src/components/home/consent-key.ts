/**
 * Clé du choix de consentement dans `localStorage`. Module à part, sans
 * "use client" : le layout serveur la lit pour son script inline, et une
 * constante importée d'un module client y arriverait comme une référence,
 * pas comme une chaîne.
 */
export const CONSENT_KEY = "pb-consent";
