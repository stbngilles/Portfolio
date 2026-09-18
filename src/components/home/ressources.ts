import { CHECKLIST, SCORE_BANDS, type ChecklistSection, type ScoreBand } from "./checklist-data";

/**
 * Les ressources gratuites, une par vidéo YouTube : `/ressources/<slug>`.
 *
 * Pour en ajouter une : écrire son contenu (sur le modèle de
 * `checklist-data.ts`), puis ajouter une entrée ici. La page, le formulaire,
 * l'e-mail et le lien signé suivent tout seuls.
 *
 * Le `slug` finit dans la description de la vidéo : explicite, en minuscules,
 * sans accents, et définitif. Le changer casse le lien déjà publié, et les
 * liens signés déjà envoyés par e-mail (la signature inclut le slug).
 *
 * Pages `noindex`, hors sitemap : derrière le formulaire, un moteur ne lit
 * qu'un titre et trois champs.
 */
export type Ressource = {
  slug: string;
  /** Surtitre de la page. */
  over: string;
  /** Titre, puis sa fin en gris. */
  title: string;
  titleEnd: string;
  /** Une phrase par ligne. */
  lede: string[];
  /** Balise description, et sous-titre de l'e-mail. */
  description: string;
  /** Objet de l'e-mail, après le prénom : « Julie, … ». */
  subject: string;
  /** La vidéo qui renvoie ici, pour s'y retrouver. Pas affichée. */
  video?: string;
  sections: ChecklistSection[];
  bands: readonly ScoreBand[];
};

export const RESSOURCES: Ressource[] = [
  {
    slug: "checklist-site-internet",
    over: "Checklist gratuite · 27 points",
    title: "Les 27 points à vérifier sur ton site",
    titleEnd: "avant qu'il te ramène des clients.",
    lede: ["La liste que je passe sur chaque site qu'on me demande d'analyser.", "Une demi-heure. Aucune compétence technique."],
    description:
      "La checklist que je passe sur chaque site qu'on me demande d'analyser. Une demi-heure, aucune compétence technique, un score à la fin.",
    subject: "tes 27 points à vérifier sur ton site",
    video: "Les 5 erreurs qui montrent que ton site est daté",
    sections: CHECKLIST,
    bands: SCORE_BANDS,
  },
];

export const getRessource = (slug: string) => RESSOURCES.find((r) => r.slug === slug);

export const countPoints = (r: Ressource) => r.sections.reduce((n, s) => n + s.items.length, 0);
