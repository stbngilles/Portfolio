// Constantes partagées pour le pipeline commercial (pas de "use server" ici)

export const QUOTE_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["SENT", "LOST"],
  SENT: ["SIGNED_AWAITING_DEPOSIT", "LOST"],
  SIGNED_AWAITING_DEPOSIT: ["COLLECTING_ASSETS"],
  COLLECTING_ASSETS: ["READY_FOR_DEV"],
  READY_FOR_DEV: [],
};

export const QUOTE_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Devis envoyé",
  SIGNED_AWAITING_DEPOSIT: "Signé — Acompte",
  COLLECTING_ASSETS: "Collecte contenu",
  READY_FOR_DEV: "Prêt pour le dev",
  LOST: "Perdu",
};
