/**
 * Contenu de la homepage. Tout le texte éditorial vit ici pour qu'une
 * correction de copy ne demande jamais de toucher au rendu.
 *
 * Structure de la page (août 2026) : hero → manifeste → trois projets
 * sélectionnés → expertises → principes → témoignages → studio → CTA.
 * Le principe directeur est la sélection : moins d'éléments, plus de place
 * pour les meilleurs — et rien n'est montré deux fois.
 */

export type Proof = { src: string; w: number; h: number; caption: string };

export type Project = {
  slug: string;
  name: string;
  sector: string;
  /** La problématique du client, en une phrase. */
  brief: string;
  /** La réponse apportée, en une phrase. */
  answer: string;
  /** Le fait vérifiable, en quelques mots. */
  metric: string;
  /** Note Google ou source du relevé — `null` quand il n'y en a pas. */
  rating: string | null;
  /** Requête exacte à retaper pour vérifier — `null` si la preuve n'en est pas une. */
  query: string | null;
  /** Capture datée. `null` tant que le fichier n'est pas déposé. */
  proof: Proof | null;
  /** Fait partie des trois projets mis en avant sur la home. */
  featured: boolean;
  role: string;
  stack: string;
  result: string;
  context: string;
  problem: string;
  decisions: string[];
  /** Site en ligne — `null` si le projet n'est pas (ou plus) public. */
  url: string | null;
  /** Capture de la page d'accueil du site livré (1440×900, WebP). `null` tant
   *  qu'elle n'est pas déposée : on affiche alors un emplacement vide, jamais
   *  une photo de banque. */
  shot: string | null;
  /** Mockup (laptop en situation, 4:3) — utilisé dans la grille de la home
   *  quand il existe ; sinon la capture plate. */
  mockup: string | null;
};

/** L'ordre du tableau est l'ordre de la grille : il alterne les formats
 *  (grand / petit / petit / grand / moyen / moyen) et les ambiances des
 *  mockups — sombre, clair, chaud — plutôt que de suivre la chronologie. */
export const PROJECTS: Project[] = [
  {
    slug: "azimut-games",
    name: "Azimut Games",
    sector: "Édition & boutique de jeux",
    brief:
      "Un catalogue à variantes multiples et une gestion déjà en place qu'il n'était pas question de remplacer.",
    answer:
      "Brancher la boutique sur l'existant, et garder la complexité côté back-office plutôt que côté client.",
    metric: "Catalogue complexe rendu simple",
    rating: null,
    query: null,
    proof: null,
    featured: false,
    role: "Conception, design, développement, intégration",
    stack: "Boutique, catalogue, connexion gestion",
    result: "Catalogue complexe rendu simple",
    context:
      "Un éditeur avec un catalogue à variantes multiples, des stocks qui bougent et une gestion déjà en place qu'il n'était pas question de remplacer.",
    problem:
      "Toute la difficulté est invisible pour le visiteur : réconcilier un catalogue riche et un système de gestion existant sans que la boutique devienne un formulaire administratif.",
    decisions: [
      "Brancher la boutique sur la gestion existante au lieu de dupliquer les données à deux endroits.",
      "Aplatir les variantes en choix compréhensibles côté client, la complexité restant côté back-office.",
      "Construire les fiches produit autour de ce qui fait décider : contenu de la boîte, durée, nombre de joueurs.",
      "Prévoir les ruptures de stock comme un état normal de la page, pas comme une erreur.",
    ],
    url: "https://azimuts.vercel.app",
    shot: "/home/sites/azimut-games.webp",
    mockup: "/home/mockups/azimut-games.jpg",
  },
  {
    slug: "motodistri",
    name: "Motodistri",
    sector: "Distribution de pièces moto · Liège",
    brief:
      "Plusieurs milliers de références, et un client qui décroche son téléphone pour savoir si la pièce va sur sa moto.",
    answer:
      "Traiter la recherche comme la fonction principale du site, pas comme un champ dans l'en-tête.",
    metric: "Jusqu'à 600 vues/jour · 15 €/jour de pub",
    rating: null,
    query: null,
    proof: {
      src: "/home/preuves/motodistri-ga.png",
      w: 1500,
      h: 633,
      caption: "Google Analytics · 15 → 29 mai 2026",
    },
    featured: true,
    role: "Conception, design, développement, hébergement",
    stack: "Site, boutique, application mobile, catalogue",
    result: "Jusqu'à 600 vues/jour · 15 €/jour de pub",
    context:
      "Un revendeur de pièces moto avec un catalogue de plusieurs milliers de références, une gestion de stock réelle et des commandes à expédier tous les jours. L'activité existait déjà ; l'outil ne suivait pas.",
    problem:
      "Trouver la bonne pièce était le vrai goulot d'étranglement. Un catalogue de cette taille rend n'importe quelle recherche approximative inutilisable, et chaque appel client pour vérifier une compatibilité coûte du temps qui n'est pas facturé.",
    decisions: [
      "Séparer le site public et l'API de gestion, pour que le catalogue puisse grossir sans ralentir la boutique.",
      "Traiter la recherche comme la fonction principale du site plutôt que comme un champ dans l'en-tête.",
      "Faire du suivi de commandes et des expéditions une partie du système, pas un fichier à côté.",
      "Écrire le contenu éditorial autour des vraies requêtes des motards, ce qui rend les 15 €/jour de pub suffisants.",
    ],
    url: "https://motodistri.com",
    shot: "/home/sites/motodistri.webp",
    mockup: "/home/mockups/motodistri.jpg",
  },
  {
    slug: "zen-harmonie",
    name: "Zen Harmonie",
    sector: "Massothérapie · Hélécine",
    brief:
      "Une praticienne seule dont le téléphone est le goulot d'étranglement : chaque rendez-vous se cale à la main, chaque annulation laisse une heure vide.",
    answer:
      "Un site qui installe le calme en trois secondes et sort le téléphone du chemin critique de la réservation.",
    metric: "1ʳᵉ position du pack local",
    rating: "Fiche Google du client · 5,0 ★ · 12 avis",
    query: "massage hélécine",
    proof: {
      src: "/home/preuves/zenharmonie-google.png",
      w: 1500,
      h: 970,
      caption: "Google · « massage hélécine » · août 2026",
    },
    featured: true,
    role: "Conception, design, développement",
    stack: "Site, prise de rendez-vous, SEO local",
    result: "1ʳᵉ position · pack local Google",
    context:
      "Une praticienne seule, qui perd du temps au téléphone pour caler des rendez-vous et gérer les annulations de dernière minute.",
    problem:
      "Le site devait installer la confiance en quelques secondes — un métier de contact se juge sur l'atmosphère — tout en enlevant le téléphone du chemin critique de la réservation.",
    decisions: [
      "Laisser l'ambiance faire le travail de réassurance : peu de texte, respiration, aucune promesse thérapeutique.",
      "Rendre la réservation accessible depuis n'importe quel écran, sans compte à créer.",
      "Demander un acompte à la réservation pour réduire les rendez-vous non honorés.",
      "Travailler le référencement sur la commune et les communes voisines plutôt que sur des termes génériques.",
    ],
    url: "https://zenharmoniehélécine.be",
    shot: "/home/sites/zen-harmonie.webp",
    mockup: "/home/mockups/zen-harmonie.jpg",
  },
  {
    slug: "volt-pro",
    name: "Volt-Pro",
    sector: "Électricité générale · 3 provinces",
    brief:
      "On n'appelle pas un électricien pour comparer, on l'appelle parce que quelque chose ne fonctionne plus.",
    answer:
      "Mettre le rappel sous deux heures avant toute présentation de l'entreprise, et une page par zone couverte.",
    metric: "Rappel < 2 h · 3 provinces couvertes",
    rating: null,
    query: null,
    proof: null,
    featured: false,
    role: "Conception, design, développement, SEO local",
    stack: "Site, pages de zones, demande de devis",
    result: "Rappel < 2 h · 3 provinces couvertes",
    context:
      "Un électricien dont les clients appellent rarement pour comparer : ils appellent parce que quelque chose ne fonctionne plus. La proximité et la vitesse de réaction sont l'argument, pas le portfolio.",
    problem:
      "Un site d'électricien classique parle de son expertise. Or ce que cherche le visiteur, c'est de savoir si on intervient chez lui et à quelle vitesse. Il faut aussi apparaître sur des recherches très locales, commune par commune.",
    decisions: [
      "Mettre la promesse de rappel sous 2 h au centre de la page, avant toute présentation de l'entreprise.",
      "Générer une page par zone couverte, avec un contenu réellement différent, pour exister sur les recherches locales.",
      "Réduire la demande de devis au strict nécessaire : ce qu'on répare, où, et comment vous joindre.",
      "Séparer les services par intention (dépannage, installation, photovoltaïque) plutôt que par catégorie technique.",
    ],
    url: "https://volt-pro.be",
    shot: "/home/sites/volt-pro.webp",
    mockup: "/home/mockups/volt-pro.jpg",
  },
  {
    slug: "detail-wave",
    name: "Detail Wave",
    sector: "Nettoyage & detailing · Waremme",
    brief:
      "Un métier qui se juge à l'œil, et dont les sites noient d'habitude les photos sous des listes de prestations et des logos de produits.",
    answer:
      "Retirer tout ce qui n'est pas la photo : un cadre, une légende, un seul appel à l'action.",
    metric: "1ʳᵉ position du pack local",
    rating: "Fiche Google du client · 5,0 ★ · 11 avis",
    query: "nettoyage canapé waremme",
    proof: {
      src: "/home/preuves/detailwave-google.png",
      w: 1500,
      h: 935,
      caption: "Google · « nettoyage canapé waremme » · août 2026",
    },
    featured: true,
    role: "Direction artistique, design, développement",
    stack: "Vitrine, galerie, demande de devis",
    result: "1ʳᵉ position · pack local Google",
    context:
      "Un métier où le résultat est purement visuel : une carrosserie corrigée, un intérieur remis à neuf. Le client achète ce qu'il voit.",
    problem:
      "La plupart des sites de detailing noient les photos sous des listes de prestations et des logos de produits. Le travail devient invisible.",
    decisions: [
      "Retirer tout ce qui n'est pas la photo. L'interface se réduit à un cadre et une légende.",
      "Sombre et contrasté, pour que les reflets sur la peinture restent lisibles.",
      "Regrouper les prestations en trois niveaux au lieu d'un tableau détaillé.",
      "Un seul appel à l'action, présent en permanence, sans jamais recouvrir l'image.",
    ],
    url: "https://detailwave.be",
    shot: "/home/sites/detail-wave.webp",
    mockup: "/home/mockups/detail-wave.jpg",
  },
  {
    slug: "lokigen",
    name: "Lokigen",
    sector: "SaaS · génération de sites",
    brief:
      "Des indépendants qui ont une fiche Google et pas de site — et pas le budget ni le temps d'un projet sur mesure.",
    answer:
      "Un outil qui part de la fiche Google : le nom de l'entreprise suffit, le site est assemblé et en ligne en trois minutes.",
    metric: "Un site en 3 minutes",
    rating: null,
    query: null,
    proof: null,
    featured: false,
    role: "Produit, design, développement",
    stack: "Application web, génération automatique, hébergement inclus",
    result: "Produit en ligne",
    context:
      "La plupart des très petites structures ont une fiche Google complète et aucun site. Le sur-mesure est hors de portée ; les constructeurs de sites demandent des heures qu'elles n'ont pas.",
    problem:
      "Produire un site correct — structure, textes, photos, formulaire — sans que l'utilisateur n'ait rien à rédiger ni à mettre en page.",
    decisions: [
      "Une seule entrée : le nom de l'entreprise. Le reste est lu sur la fiche Google.",
      "Des gabarits par métier plutôt qu'un éditeur libre : moins de choix, un résultat propre à coup sûr.",
      "Aperçu immédiat avant toute création de compte.",
      "Hébergement et nom de domaine gérés dans le produit, sans étape technique.",
    ],
    url: null,
    shot: null,
    mockup: "/home/mockups/lokigen.jpg",
  },
];

export const FEATURED = PROJECTS.filter((p) => p.featured);
export const OTHERS = PROJECTS.filter((p) => !p.featured);

/**
 * Manifeste. Une conviction, pas une liste de qualités : « rapide, responsive,
 * optimisé » sont des prérequis, personne ne les achète.
 */
export const MANIFESTO = {
  over: "Ce que je crois",
  lead: "Un site n'est pas une brochure.",
  tail: "C'est ce qui décide si on vous appelle ou si on appelle le concurrent d'à côté.",
  body: [
    "Je ne vends pas de garantie de résultat, et je me méfie de ceux qui le font. Je montre ce qui a été construit, pourquoi, et ce que ça a produit chez les clients.",
    "Les premières positions Google montrées juste au-dessus se vérifient en dix secondes : tapez la requête vous-même avant de me croire.",
  ],
};

/**
 * Trois expertises, pas six. « Suivi » et « maintenance » sont rangés dans la
 * troisième plutôt que comptés comme des lignes de plus. Pas de numéros :
 * ce n'est pas une méthode en étapes.
 */
export const EXPERTISE = [
  {
    label: "Conception",
    line: "Comprendre ce qui vous fait perdre du temps ou de l'argent avant de dessiner quoi que ce soit.",
  },
  {
    label: "Design & développement",
    line: "Dessiné et codé par la même personne. Ce qui a été décidé pendant la conception se retrouve tel quel dans le site livré.",
  },
  {
    label: "Visibilité locale",
    line: "Exister sur les recherches de votre zone, commune par commune — et y rester une fois le site en ligne. Campagnes Google Ads quand le projet le demande.",
  },
];

/** Principes de collaboration — ce qui remplace la « méthode en cinq étapes ». */
export const PRINCIPLES = [
  {
    title: "Le problème avant la maquette",
    text: "Je commence par ce qui coince : les appels qui n'aboutissent pas, les rendez-vous non honorés, les clients qui ne trouvent pas ce qu'ils cherchent. Le design répond à ça, pas à une tendance.",
  },
  {
    title: "Je dis aussi ce qui ne sert à rien",
    text: "Un blog que personne n'écrira, une animation qui ralentit tout, une page équipe pour une personne seule. Retirer ce qui ne sert pas coûte moins cher que de le construire puis de le maintenir.",
  },
  {
    title: "Construit pour être repris",
    text: "Ce qui est livré reste lisible et maintenable par quelqu'un d'autre : vous n'êtes prisonnier ni d'un outil, ni de moi.",
  },
];

/** Présentation humaine — faits vérifiables uniquement, pas de biographie. */
export const STUDIO = {
  name: "Esteban",
  role: "Design & développement",
  img: "/esteban.jpg",
  body: [
    "Pixelbrute, c'est une personne. Je gère la conception, le design, le code et la mise en ligne — du premier appel jusqu'après la livraison.",
    "C'est une contrainte autant qu'un choix : je prends peu de projets à la fois, et vous parlez toujours à la personne qui construit.",
  ],
  facts: [
    { lbl: "Basé à", val: "Liège, Belgique" },
    { lbl: "Rôle", val: "Conception, design, code" },
    { lbl: "Projets livrés", val: "Six, dont un produit SaaS" },
    { lbl: "Avis Google", val: "5,0 ★ · 3 avis" },
  ],
};

export type Quote = {
  text: string;
  name: string;
  role: string;
  /** Photo du projet ; `null` quand on n'en a pas — on affiche alors les initiales. */
  img: string | null;
};

/**
 * Avis clients réels, repris mot pour mot (fautes de frappe et emoji compris :
 * on ne réécrit pas un avis). Les deux premiers sont publiés sur Google ;
 * celui de Moto Distri était encore en attente de publication au moment de
 * l'intégration — à revérifier avant mise en ligne.
 */
export const QUOTES: Quote[] = [
  {
    text: "« Super expérience avec Pixelbrute ! Je recommande à 100% ! Il est très à l'écoute, répond rapidement à mes demandes et mon site web est exactement ce que j'attendais ! Mercii beaucoup Pixelbrute 🫶🏻 »",
    name: "Detail Wave",
    role: "Avis Google · 5/5 · avril 2026",
    img: null,
  },
  {
    text: "« Je recommande à 200% très pro, à l'écoute, prends le temps de comprendre notre réel besoin et essaye de se mettre à notre place ! Franchement vous avez besoin d'un site ??? Foncez ! 💪 »",
    name: "Pierre Vanderelst",
    role: "Avis Google · 5/5 · mars 2026",
    img: null,
  },
  {
    text: "« Une excellente agence web à Liège ! J'ai fait appel à eux pour la création de mon site e-commerce de pièces détachées moto et la gestion de mes campagnes publicitaires (Google Ads / Meta Ads). Le travail est ultra professionnel, le site est rapide, bien référencé et parfaitement pensé pour la vente en ligne. En plus de maîtriser leur sujet, ils sont à l'écoute et de super bons conseils. Si vous cherchez un développeur ou une agence web fiable sur Liège et les environs pour lancer votre e-commerce, foncez les yeux fermés ! »",
    name: "Moto Distri",
    role: "Avis Google · 5/5 · 2026",
    img: null,
  },
];

export const FAQS = [
  {
    q: "Par quoi on commence ?",
    a: "Un appel de trente minutes. Vous m'expliquez votre métier et ce qui coince aujourd'hui. Je vous dis si je peux aider et comment. Sans engagement, et sans devis envoyé dans la même heure.",
  },
  {
    q: "Combien de temps prend un projet ?",
    a: "Ça dépend entièrement du périmètre. Une vitrine avec un contenu prêt et un catalogue avec une gestion de stock ne se comparent pas. Je donne une durée après avoir compris le projet, pas avant.",
  },
  {
    q: "Qu'est-ce qui fait varier le prix ?",
    a: "Le nombre de pages réellement différentes, la présence d'une boutique ou d'un système de réservation, l'intégration avec un outil de gestion existant, et l'état du contenu que vous fournissez.",
  },
  {
    q: "Qui écrit les textes et fournit les photos ?",
    a: "Vous connaissez votre métier mieux que moi. Vous fournissez la matière, je la structure, je la mets en page, et je réécris ce qui ne fonctionne pas à l'écran. Si vous n'avez pas de photos, on en parle tôt : c'est souvent le point qui retarde tout.",
  },
  {
    q: "Est-ce que vous sous-traitez ?",
    a: "Non. Conception, design et code sont faits par la même personne. C'est la contrainte du studio solo, et c'est aussi ce qui fait qu'il n'y a rien à retraduire entre les étapes.",
  },
  {
    q: "Que se passe-t-il après la mise en ligne ?",
    a: "Vous gardez le même interlocuteur. Les corrections liées au travail livré sont normales et incluses. Pour les évolutions, on convient de ce qui est utile plutôt que d'un forfait automatique.",
  },
  {
    q: "Vous travaillez avec quels types d'entreprises ?",
    a: "Des indépendants et de petites structures où le patron répond encore au téléphone. Électricité, detailing, massothérapie, pièces moto, édition de jeux jusqu'ici. Le secteur importe moins que la présence d'un vrai métier derrière.",
  },
  {
    q: "Vous garantissez des résultats ?",
    a: "Non, et je me méfie de ceux qui le font. Je montre ce qui a été construit chez d'autres clients, les décisions prises et ce que ça a produit — les premières places Google se vérifient en dix secondes. Vous jugez sur pièces.",
  },
];

/**
 * Mention de disponibilité du dernier écran. Texte daté, à mettre à jour à
 * chaque build — ou `null` pour ne rien afficher. Jamais gardée pour l'effet.
 */
export const AVAILABILITY: string | null = "Prochaine disponibilité · octobre 2026";

export const pad = (n: number) => String(n + 1).padStart(2, "0");
