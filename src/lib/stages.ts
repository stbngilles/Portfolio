/**
 * Étapes par défaut d'un projet web Pixelbrute.
 * Ordre canonique : brief → design → dev → contenu → review → live.
 * Le client valide à chaque étape, ce qui horodate l'action et débloque la
 * suivante.
 */
export const DEFAULT_PROJECT_STAGES = [
  { key: "brief", label: "Brief & cadrage", order: 1 },
  { key: "design", label: "Maquette / design", order: 2 },
  { key: "dev", label: "Développement", order: 3 },
  { key: "content", label: "Contenu & SEO", order: 4 },
  { key: "review", label: "Relecture finale", order: 5 },
  { key: "live", label: "Mise en ligne", order: 6 },
] as const;

export type StageStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "NEEDS_VALIDATION"
  | "VALIDATED";

export const STAGE_STATUS_LABEL: Record<StageStatus, string> = {
  PENDING: "À venir",
  IN_PROGRESS: "En cours",
  NEEDS_VALIDATION: "À valider",
  VALIDATED: "Validé",
};
