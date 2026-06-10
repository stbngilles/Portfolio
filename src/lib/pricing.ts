/**
 * Catalogue tarifaire Pixelbrute — source unique de vérité.
 * Les montants sont en CENTIMES (entier) pour éviter les pièges des floats.
 * Modifie ici, ça impacte le calculateur, les devis et les commissions.
 *
 * Bases issues de la vision plateforme v1. À ajuster avec l'expérience terrain.
 */

export type Currency = "EUR";
export const CURRENCY: Currency = "EUR";

// =====================================================================
// SITES (one-shot, ligne principale, exclusive)
// =====================================================================

export type SiteKey = "starter" | "essentiel" | "ecommerce" | "sur_mesure";

export interface SiteOffer {
  key: SiteKey;
  label: string;
  description: string;
  basePrice: number; // centimes — 0 pour sur-mesure
  pagesIncluded: number;
  // Prix langue supplémentaire qui dépend du type de site
  extraLanguagePrice: number;
}

export const SITES: SiteOffer[] = [
  {
    key: "starter",
    label: "Starter",
    description:
      "Une seule page qui présente l'activité du client. Design soigné, adapté mobile. Idéal pour lancer vite ou tester. Sans SEO inclus — peut être ajouté en option.",
    basePrice: 120000,
    pagesIncluded: 1,
    extraLanguagePrice: 15000,
  },
  {
    key: "essentiel",
    label: "Essentiel",
    description:
      "Site vitrine 5 pages (ex. Accueil, Services, À propos, Galerie, Contact). Design propre, adapté mobile et tablette. SEO non inclus — à ajouter en option si le client veut être visible sur Google.",
    basePrice: 250000,
    pagesIncluded: 5,
    extraLanguagePrice: 25000,
  },
  {
    key: "ecommerce",
    label: "E-commerce",
    description:
      "Boutique en ligne complète — vente de produits ou services, catalogue, paiement intégré. À partir de 30 pages. Inclut la configuration technique du système de vente.",
    basePrice: 600000,
    pagesIncluded: 30,
    extraLanguagePrice: 60000,
  },
  {
    key: "sur_mesure",
    label: "Sur-mesure",
    description:
      "Projet spécifique hors catalogue. Le commercial saisit le prix négocié avec le client.",
    basePrice: 0,
    pagesIncluded: 0,
    extraLanguagePrice: 0,
  },
];

// =====================================================================
// OPTIONS (one-shot, additionnelles, quantité possible)
// =====================================================================

export type OptionKey =
  | "seo_basic"
  | "seo_advanced"
  | "extra_page"
  | "writing_per_page"
  | "extra_language"
  | "reservation_manual"
  | "reservation_synced"
  | "stripe_payment"
  | "logo_simple"
  | "migration"
  | "photo_session";

export interface OptionOffer {
  key: OptionKey;
  label: string;
  description: string;
  unitPrice: number; // 0 si dépend du site (cas langue)
  quantifiable: boolean;
  defaultQty: number;
  // Si true, le prix est dynamique (récupéré via getOptionPrice ci-dessous).
  dynamicPrice?: boolean;
}

export const OPTIONS: OptionOffer[] = [
  {
    key: "seo_basic",
    label: "Référencement Google (base)",
    description:
      "Le site apparaît correctement sur Google : titres, descriptions, fiche de partage sur les réseaux. On envoie aussi le plan du site à Google pour qu'il l'indexe plus vite.",
    unitPrice: 35000,
    quantifiable: false,
    defaultQty: 1,
  },
  {
    key: "seo_advanced",
    label: "Référencement Google (avancé)",
    description:
      "Tout ce qui est dans le SEO de base + audit complet du site, données structurées (permet d'afficher les étoiles et infos dans les résultats Google), optimisation de la vitesse, redirections si ancien site.",
    unitPrice: 70000,
    quantifiable: false,
    defaultQty: 1,
  },
  {
    key: "extra_page",
    label: "Page supplémentaire",
    description:
      "Une page = une section complète du site (ex. À propos, Services, Galerie, FAQ, Contact…). Chaque page nécessite un design, une mise en page et l'intégration du contenu.",
    unitPrice: 15000,
    quantifiable: true,
    defaultQty: 1,
  },
  {
    key: "writing_per_page",
    label: "Rédaction de texte (par page)",
    description:
      "On écrit le contenu de la page à la place du client. Améliore le référencement Google car un texte bien structuré est mieux lu par Google. Équivalent d'un article de blog professionnel par page.",
    unitPrice: 8000,
    quantifiable: true,
    defaultQty: 1,
  },
  {
    key: "extra_language",
    label: "Langue supplémentaire",
    description:
      "Traduction complète du site : textes, menus, formulaires, boutons. Idéal pour les clients avec une clientèle internationale. Prix variable selon le kit (Starter / Essentiel / Pro).",
    unitPrice: 0,
    quantifiable: true,
    defaultQty: 1,
    dynamicPrice: true,
  },
  {
    key: "reservation_manual",
    label: "Prise de rendez-vous (manuelle)",
    description:
      "Formulaire de demande de créneau sur le site. Le client soumet ses disponibilités, le propriétaire confirme lui-même par email ou téléphone. Simple, sans abonnement à un outil. Équivalent ~1 page de travail.",
    unitPrice: 40000,
    quantifiable: false,
    defaultQty: 1,
  },
  {
    key: "reservation_synced",
    label: "Prise de rendez-vous (agenda en ligne)",
    description:
      "Agenda connecté à Google Calendar ou outil tiers (Cal.com, Outlook…). Le client réserve directement un créneau disponible — le propriétaire n'a rien à faire. Équivalent 1 à 2 pages de travail.",
    unitPrice: 90000,
    quantifiable: false,
    defaultQty: 1,
  },
  {
    key: "stripe_payment",
    label: "Paiement en ligne (carte bancaire)",
    description:
      "Page de paiement sécurisé par carte sur le site. Le client paie directement (acompte, session, produit…). Nécessite la création d'un compte Stripe au nom du client. Compte pour ~1 page de travail.",
    unitPrice: 40000,
    quantifiable: false,
    defaultQty: 1,
  },
  {
    key: "logo_simple",
    label: "Logo simple",
    description:
      "Logotype texte + icône basique (picto issu d'une bibliothèque libre + mise en forme). Suffit pour lancer. Attention : si le client veut un logo vraiment unique et personnalisé, il faut un designer — cela fait l'objet d'un devis séparé.",
    unitPrice: 75000,
    quantifiable: false,
    defaultQty: 1,
  },
  {
    key: "migration",
    label: "Reprise de l'ancien site",
    description:
      "On récupère le contenu de l'ancien site (textes, images, pages) et on le transfère sur le nouveau. Les liens déjà référencés sur Google restent valides grâce aux redirections.",
    unitPrice: 30000,
    quantifiable: false,
    defaultQty: 1,
  },
  {
    key: "photo_session",
    label: "Séance photo professionnelle",
    description:
      "Photos des locaux, de l'équipe ou des produits pour le site. Prix défini selon la distance et l'ampleur de la séance — à préciser en notes.",
    unitPrice: 0,
    quantifiable: false,
    defaultQty: 1,
  },
];

/**
 * Calcule le prix unitaire d'une option, qui peut dépendre du site choisi
 * (cas langue supplémentaire).
 */
export function getOptionUnitPrice(
  optionKey: OptionKey,
  siteKey: SiteKey | null,
  customPrice?: number,
): number {
  if (customPrice !== undefined) return customPrice;
  if (optionKey === "extra_language" && siteKey) {
    const site = SITES.find((s) => s.key === siteKey);
    return site?.extraLanguagePrice ?? 0;
  }
  const opt = OPTIONS.find((o) => o.key === optionKey);
  return opt?.unitPrice ?? 0;
}

// =====================================================================
// RÉCURRENT (mensuel, prélevé en continu)
// =====================================================================

export type RecurringKey =
  | "maintenance_basic"
  | "social_posts"
  | "social_video_edited"
  | "social_video_onsite"
  | "ads_management";

export interface RecurringOffer {
  key: RecurringKey;
  label: string;
  description: string;
  monthlyPrice: number; // centimes / mois
  pitch: string; // argument commercial — affiché dans le calculateur
  // Si > 0 : ce service est exécuté par un producteur (ex. Amandine pour les réseaux).
  // Quand le commercial EST le producteur → il touche 100 %.
  // Quand quelqu'un d'autre vend → commercial 15 %, producteur producerRate.
  producerRate: number;
}

export const RECURRING: RecurringOffer[] = [
  {
    key: "maintenance_basic",
    label: "Maintenance technique",
    description: "Sauvegardes, mises à jour, surveillance uptime.",
    monthlyPrice: 12000,
    producerRate: 0,
    pitch:
      "Sans maintenance : ~40€/mois d'hébergement seul + 40€/h facturés à chaque intervention. Avec Pixelbrute : hébergement inclus, site toujours à jour, panne résolue en 48h garantis.",
  },
  {
    key: "social_posts",
    label: "Réseaux sociaux — posts",
    description:
      "2-3 posts par semaine sur Facebook et Instagram. Visuels créés par Pixelbrute, textes rédigés, publication planifiée. Le client envoie ses photos — on s'occupe du reste.",
    monthlyPrice: 29000,
    producerRate: 0.85,
    pitch:
      "Le client fournit ses photos (smartphone suffit), on crée les visuels, on rédige les légendes, on publie aux meilleurs moments. Idéal pour rester visible sans y passer du temps.",
  },
  {
    key: "social_video_edited",
    label: "Réseaux sociaux — montage vidéo",
    description:
      "2-3 posts par semaine + montage de 4 reels/vidéos courtes par mois. Le client filme lui-même et nous envoie le footage brut. Sous-titres, musique, format Instagram/Facebook inclus. Attention : la qualité du résultat dépend de la qualité du footage envoyé.",
    monthlyPrice: 42000,
    producerRate: 0.85,
    pitch:
      "Pour les clients qui filment déjà des petits clips mais ne savent pas les monter. Important à préciser : si le footage est flou ou mal cadré, même un bon montage ne rattrapera pas. À utiliser avec des clients qui ont l'habitude de filmer.",
  },
  {
    key: "social_video_onsite",
    label: "Réseaux sociaux — tournage sur place",
    description:
      "1 session de tournage chez le client par mois (~2-3h sur place). Pixelbrute filme, monte et publie : 4 reels + 8-10 posts statiques. Tout le contenu du mois produit en une seule session. Frais de déplacement inclus dans un rayon raisonnable.",
    monthlyPrice: 69000,
    producerRate: 0.85,
    pitch:
      "La formule clé en main : on vient, on filme, on monte, on publie. Le client n'a rien à faire. C'est la seule formule où on peut vraiment garantir la qualité du contenu, puisque c'est nous qui filmons.",
  },
  {
    key: "ads_management",
    label: "Gestion publicité (Facebook & Instagram)",
    description:
      "On crée vos publicités Facebook et Instagram, on teste ce qui marche, on coupe ce qui ne rapporte pas, et on vous envoie un rapport chaque semaine. Budget publicitaire non inclus — prévoir entre 10 et 20€/jour en plus.",
    monthlyPrice: 40000,
    producerRate: 0,
    pitch:
      "Sans gestion : le client dépense son budget pub sans savoir si ça marche, et sans pouvoir l'arrêter à temps. Avec Pixelbrute : on gère tout, on stoppe ce qui ne convertit pas, on pousse ce qui rapporte. À noter : les 400€/mois couvrent uniquement notre travail — le client paie son propre budget pub en plus (généralement 10 à 20€/jour, soit 300 à 600€/mois).",
  },
];

// =====================================================================
// PACK PUBLICITÉ DE LANCEMENT (one-shot, traité comme service)
// =====================================================================

export const LAUNCH_PACK = {
  key: "launch_pack" as const,
  label: "Pack publicité de lancement (3 mois)",
  description:
    "Boost de visibilité sur 3 mois après mise en ligne. Comprend setup + budget pub + suivi.",
  price: 150000, // 1 500 €
};

// =====================================================================
// BUNDLES MÉTIER (offres pré-configurées par secteur)
// =====================================================================

export interface Bundle {
  key: string;
  label: string;
  emoji: string;
  targetSector: string; // description courte du public cible
  site: SiteKey;
  options: OptionKey[];
  recurring: RecurringKey[];
  discountCents: number; // remise appliquée vs à la carte
}

export const BUNDLES: Bundle[] = [
  {
    key: "kine",
    label: "Kiné / Thérapeute",
    emoji: "🩺",
    targetSector: "Kinésithérapeute, ostéopathe, psychologue, coach…",
    site: "essentiel",
    options: ["seo_basic", "reservation_synced", "stripe_payment"],
    recurring: ["maintenance_basic"],
    discountCents: 40000, // −400 €
  },
  {
    key: "artisan",
    label: "Artisan / Indépendant",
    emoji: "🔧",
    targetSector: "Plombier, électricien, menuisier, peintre…",
    site: "essentiel",
    options: ["seo_basic"],
    recurring: ["maintenance_basic"],
    discountCents: 25000, // −250 €
  },
  {
    key: "commerce",
    label: "Commerce local",
    emoji: "🏪",
    targetSector: "Boutique, fleuriste, librairie, pharmacie…",
    site: "essentiel",
    options: ["seo_basic", "stripe_payment"],
    recurring: ["maintenance_basic"],
    discountCents: 30000, // −300 €
  },
  {
    key: "restaurateur",
    label: "Restaurateur / Bar",
    emoji: "🍽️",
    targetSector: "Restaurant, café, brasserie, traiteur…",
    site: "essentiel",
    options: ["seo_basic", "reservation_manual"],
    recurring: ["maintenance_basic"],
    discountCents: 30000, // −300 €
  },
];

// =====================================================================
// COMMISSIONS
// =====================================================================

export const COMMISSION_RATES = {
  ONE_SHOT_SITE_AND_OPTIONS: 0.2, // 20 % site + options
  RECURRING: 0.15, // 15 % récurrent (tant que client abonné)
  LAUNCH_PACK: 0.15, // 15 % pack pub de lancement
};

// =====================================================================
// MARGE DE SÉCURITÉ (back-office) — invisible côté commercial
// =====================================================================
//
// Pourcentage à appliquer sur l'estimation du COÛT DEV interne pour absorber
// les imprévus (retours, fixes de bugs, dérapages). Le commercial voit le
// prix affiché ; cette marge tampon le coût qu'on propose au freelance.
//
// Exemple : prix affiché 5 000 € → coût dev estimé 1 500 € → on propose
// 1 500 × (1 - 0.20) = 1 200 € au freelance, on garde 300 € en réserve.
export const DEV_COST_SAFETY_MARGIN_PCT = 0.2;

/**
 * Donne le montant maxi qu'on peut proposer à un freelance, à partir
 * du prix one-shot facturé au client. On part d'une estimation à 30 %
 * de coût dev brut, puis on rabote par la marge de sécurité.
 */
export function suggestedDevPayout(oneShotCents: number): number {
  const grossDevCost = Math.round(oneShotCents * 0.3);
  return Math.round(grossDevCost * (1 - DEV_COST_SAFETY_MARGIN_PCT));
}

// =====================================================================
// UTILITAIRES
// =====================================================================

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("fr-BE", {
    style: "currency",
    currency: "EUR",
  });
}

export function formatPriceMonthly(cents: number): string {
  if (cents === 0) return "—";
  return `${formatPrice(cents)} / mois`;
}
