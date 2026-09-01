/**
 * Identité légale et sous-traitants. Une seule source pour les deux pages
 * légales, le JSON-LD et le pied de page : ces informations doivent être
 * strictement identiques partout, sinon elles ne valent rien, ni juridiquement,
 * ni pour la cohérence des signaux locaux que lit Google (nom, adresse,
 * téléphone à l'identique).
 */

export const IDENTITE = {
  /**
   * L'entreprise est une personne physique (étudiant indépendant) : la loi
   * impose l'identité de la personne, pas seulement l'enseigne.
   */
  nom: "Esteban Gilles",
  enseigne: "Pixelbrute",
  /** Étudiant indépendant jusqu'au 30 septembre 2026, à revoir à cette date. */
  statut: "Entreprise personne physique, étudiant indépendant",
  rue: "Rue Victor Gilles 3A",
  codePostal: "4280",
  ville: "Hannut",
  pays: "Belgique",
  email: "contact@pixelbrute.be",
  telephone: "+32 492 20 02 75",
  telephoneHref: "+32492200275",
  /** Le numéro d'entreprise BCE et le numéro de TVA sont identiques en Belgique. */
  bce: "BE 1029.035782",
  tva: "BE 1029.035782",
  /** Assujetti ordinaire, pas de régime de franchise. La TVA belge s'applique. */
  regimeTva: "Assujetti à la TVA, régime normal, TVA belge de 21 % applicable",
} as const;

/**
 * Profils publics, ailleurs que sur ce site.
 *
 * Alimente le `sameAs` du JSON-LD. C'est ce champ qui permet à un moteur, et
 * à un assistant, de relier « Pixelbrute » sur ce domaine à « Pixelbrute »
 * sur une fiche Google ou un Instagram, et donc de considérer que les avis
 * publiés là-bas parlent bien de cette entreprise-ci.
 *
 * Un modèle ne recommande pas une entreprise sur la foi de son seul site :
 * il recoupe. Chaque URL ajoutée ici est un point de recoupement de plus.
 * Ne mettre que des pages réellement en ligne et réellement contrôlées par
 * le studio, une URL morte dans `sameAs` dévalue les autres.
 *
 * La séparation studio / personne n'est pas cosmétique. Un profil LinkedIn
 * personnel déclaré comme profil d'entreprise brouille les deux entités au
 * lieu de les renforcer : il faut que chaque URL soit rattachée à celle
 * qu'elle décrit vraiment. Sur un studio solo, les deux se confondent dans
 * les faits, pas dans une base de connaissances.
 *
 * Note pour plus tard : Google a déjà une entité pour Pixelbrute dans son
 * Knowledge Graph, identifiant `/g/11yzdtjtv1`. C'est ce qui rend le studio
 * « résolvable », relevé sur les résultats Google, à ne pas perdre. On ne le
 * publie pas dans le balisage : `sameAs` attend des pages, pas des
 * identifiants internes.
 */
export const PROFILS = {
  /** Le studio en tant qu'entreprise. */
  studio: [
    // Forme canonique de la fiche Google Business, par son identifiant
    // permanent (CID). Un lien `share.google/…` est un raccourcisseur : il
    // peut expirer et ne dit rien de l'entité pointée.
    "https://www.google.com/maps?cid=10717857398967500648",
    "https://www.instagram.com/pixelbrute_/",
  ],
  /** Esteban Gilles en tant que personne. */
  personne: ["https://www.linkedin.com/in/estebangilles/"],
} as const;

/** Codes NACEBEL 2025 déclarés à la BCE, depuis le 11 octobre 2025. */
export const NACEBEL = [
  { code: "62.100", label: "Activités de programmation informatique" },
  { code: "74.120", label: "Activités de design graphique et de communication visuelle" },
  { code: "73.110", label: "Activités d'agence de publicité" },
  { code: "73.300", label: "Activités de conseil en relations publiques et communication" },
  { code: "74.201", label: "Production photographique, sauf activités des photographes de presse" },
  { code: "47.120", label: "Autre commerce de détail non spécialisé" },
] as const;

/**
 * Sous-traitants au sens du RGPD. Tout service qui voit passer une donnée
 * personnelle doit figurer ici, c'est la partie de la politique de
 * confidentialité qui se périme le plus vite, et celle qu'on oublie de
 * mettre à jour quand on change d'outil.
 */
export const SOUS_TRAITANTS = [
  {
    nom: "Vercel Inc.",
    role: "Hébergement et mesure d'audience sans cookie",
    pays: "États-Unis, avec serveurs en Europe",
    donnees: "Journaux techniques de connexion, statistiques de pages agrégées",
  },
  {
    nom: "one.com",
    role: "Enregistrement du nom de domaine",
    pays: "Danemark",
    donnees: "Données d'enregistrement du domaine",
  },
  {
    nom: "Formspree Inc.",
    role: "Traitement du formulaire de contact",
    pays: "États-Unis",
    donnees: "Nom, e-mail, téléphone et message que vous saisissez",
  },
] as const;

/** Autorité de contrôle compétente en Belgique. */
export const APD = {
  nom: "Autorité de protection des données",
  adresse: "Rue de la Presse 35, 1000 Bruxelles",
  email: "contact@apd-gba.be",
  site: "https://www.autoriteprotectiondonnees.be",
} as const;
