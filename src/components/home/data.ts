/**
 * Contenu de la homepage. Tout le texte éditorial vit ici pour qu'une
 * correction de copy ne demande jamais de toucher au rendu.
 *
 * Structure de la page (août 2026) : hero → manifeste → projets → expertises
 * → principes → témoignages → studio → CTA.
 *
 * Les études de cas (août 2026) sont écrites à partir des sites en ligne,
 * relus page par page : les chiffres cités, 60 000 références, 63 communes,
 * acompte de 50 %, sont lisibles sur les sites eux-mêmes ou
 * dans leurs conditions générales. Rien n'est estimé, rien n'est arrondi
 * vers le haut. Quand un chiffre manque, la phrase le dit au lieu de le
 * remplacer par un adjectif.
 */

export type Proof = { src: string; w: number; h: number; caption: string };

/** Une décision de conception : ce qui a été tranché, et pourquoi. */
export type Decision = { title: string; text: string };

/** Un élément réellement livré, vérifiable en ouvrant le site. */
export type Built = { label: string; text: string };

/** Un chiffre lisible sur le site livré. Jamais une estimation. */
export type Fact = { value: string; label: string };

/**
 * Visuel de lecture d'une étude de cas. Trois formes seulement, toutes
 * dessinées à partir de chiffres relevés sur le site du client, jamais une
 * illustration décorative. Une capture du site livré n'apprend rien à qui
 * peut cliquer sur le lien ; un graphique, si.
 */
export type Chart =
  | {
      kind: "bars";
      title: string;
      note: string;
      items: { label: string; value: number; display: string; strong?: boolean }[];
    }
  | {
      kind: "week";
      title: string;
      note: string;
      /** Bornes de l'échelle horaire affichée. */
      from: number;
      to: number;
      days: { day: string; from: number | null; to: number | null; label: string }[];
    };

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
  /** Note Google ou source du relevé, `null` quand il n'y en a pas. */
  rating: string | null;
  /** Requête exacte à retaper pour vérifier, `null` si la preuve n'en est pas une. */
  query: string | null;
  /** Capture datée. `null` tant que le fichier n'est pas déposé. */
  proof: Proof | null;
  /** Fait partie des projets mis en avant. */
  featured: boolean;
  role: string;
  stack: string;
  result: string;
  /** Phrase d'ouverture de l'étude de cas, le projet en une respiration. */
  lede: string;
  /** Le client et sa situation, en paragraphes. */
  context: string[];
  /** Ce qui coinçait réellement, en paragraphes. */
  problem: string[];
  /** Les arbitrages, titrés et expliqués. */
  decisions: Decision[];
  /** Ce qui est en ligne aujourd'hui, poste par poste. */
  built: Built[];
  /** Les chiffres lisibles sur le site livré. */
  facts: Fact[];
  /** Ce que ça a produit, et ce qu'on ne peut pas prouver. */
  outcome: string[];
  /** Graphique de lecture, `null` quand aucun chiffre ne mérite un dessin. */
  chart: Chart | null;
  /** Site en ligne, `null` si le projet n'est pas (ou plus) public. */
  url: string | null;
  /** Capture de la page d'accueil du site livré (1440×900, WebP). `null` tant
   *  qu'elle n'est pas déposée : on affiche alors un emplacement vide, jamais
   *  une photo de banque. */
  shot: string | null;
  /** Mockup (laptop en situation, 4:3), utilisé dans la grille de la home
   *  quand il existe ; sinon la capture plate. */
  mockup: string | null;
  /** Le récit en images, quand le projet ne tient pas dans une capture : un
   *  titre, deux lignes, une ou deux grandes captures, et on recommence.
   *  Absent pour un site seul, dont la capture et le lien suffisent. */
  story?: Chapter[];
};

/** Un temps du récit visuel. `text` reste court : la capture fait le reste. */
export type Chapter = {
  title: string;
  text: string[];
  images: Proof[];
  /** `one` empile en pleine largeur, `two` met côte à côte, `phones` centre
   *  deux écrans de téléphone, `narrow` centre une seule image étroite. */
  layout?: "one" | "two" | "phones" | "narrow";
};

/** L'ordre du tableau est l'ordre de la grille : Maison ouvre, pleine
 *  largeur, parce que c'est le projet le plus complet, marque, site et
 *  supports. Les autres alternent ensuite les formats (grand / petit /
 *  petit / grand / moyen) et les ambiances des mockups, sombre, clair,
 *  chaud, plutôt que de suivre la chronologie.
 *
 *  Règle d'écriture (septembre 2026) : un paragraphe de contexte, un ou deux
 *  de problème, cinq décisions au plus, chacune en deux phrases, et un
 *  résultat en deux phrases. Ce qui ne tient pas dans ce format n'est pas
 *  une information, c'est du remplissage. */
export const PROJECTS: Project[] = [
  {
    slug: "maison",
    name: "Maison",
    sector: "Chasseur immobilier · projet conceptuel, 2026",
    brief:
      "Un chasseur de biens rares, quelques acheteurs par an, et un site qui doit montrer la rareté sans la proclamer.",
    answer:
      "Dessiner la marque avant le site : une signature à la main, une palette tirée d'un moodboard de matières, quatre biens et pas un de plus.",
    metric: "Marque, site et supports · projet conceptuel",
    rating: null,
    query: null,
    proof: null,
    featured: true,
    role: "Direction artistique, identité, UX/UI, intégration",
    stack: "Identité, site, fiches de biens, brand book, papeterie, panneau, vitrine",
    result: "Projet conceptuel · aucun chiffre avancé",
    lede:
      "Aucun client derrière ce projet. Une agence inventée pour montrer un site immobilier sans rien qui presse.",
    context: [
      "Maison cherche, pour quelques acheteurs par an, la maison rare, partout en Belgique. Trois à cinq biens par recherche, un seul interlocuteur. Le positionnement tient en une phrase : le chasseur discret.",
    ],
    problem: [
      "Quatre biens en ligne, pas quarante. Il faut que quatre suffisent, et que la rareté se lise dans la mise en page plutôt que dans un bandeau.",
      "Le secteur a ses codes. Les reprendre, c'est ressembler à tout le monde ; les inverser un à un, c'est se définir contre les autres.",
    ],
    decisions: [
      {
        title: "Une signature à la main plutôt qu'un monogramme",
        text: "« Maison », tracé d'un seul geste par le fondateur, sans retouche. Le geste se suffit.",
      },
      {
        title: "Une palette tirée des matières",
        text: "Neuf matières prises de près, aucune maison. L'ambre devient le bordeaux, le cuir donne le bronze, la pierre donne l'ivoire.",
      },
      {
        title: "Le contraste mesuré avant la couleur",
        text: "Le bronze sur ivoire tient 2,66:1 : gardé pour les filets, doublé d'un bronze encre à 5,34:1 pour le texte.",
      },
      {
        title: "Deux familles, une échelle",
        text: "Morganite pour les titres, Plus Jakarta Sans pour le reste. Échelle en φ, espacements Fibonacci, définis une fois.",
      },
      {
        title: "Quatre biens, aucune urgence",
        text: "Un prix sur demande, une seule surface bordeaux par page, un délai de réponse écrit : deux jours ouvrés.",
      },
    ],
    built: [
      { label: "Identité", text: "Signature en trois déclinaisons, M seul pour le favicon, zone de protection fixée." },
      { label: "Brand book", text: "Palette nommée, contrastes mesurés, lexique, mésusages du logo." },
      { label: "Site", text: "Accueil, sélection, quatre fiches, menu plein écran, formulaire d'entretien. Une page HTML, sans framework." },
      { label: "Système", text: "Échelle φ, espacements Fibonacci, partages 38,2 / 61,8, définis une fois en CSS." },
      { label: "Supports", text: "Carte de visite, bannière « Vendue », panneau, vitrine, dossier de bien." },
      { label: "Mentions", text: "Statut du projet, crédits photo et retrait sous 48 h, écrits dans la page." },
    ],
    facts: [
      { value: "4", label: "biens en ligne, pas quarante" },
      { value: "2", label: "familles de polices" },
      { value: "φ", label: "échelle et partages 38,2 / 61,8" },
      { value: "5,3:1", label: "contraste minimal des labels" },
    ],
    outcome: [
      "Aucun client, aucun chiffre. Ce dossier montre le travail complet, de la phrase de positionnement au panneau de façade.",
      "Le site n'est pas public : les photos de biens viennent d'annonces existantes et seront remplacées avant toute mise en ligne.",
    ],
    chart: {
      kind: "bars",
      title: "Ce que pèse la page, avant et après",
      note: "Mesures sur les fichiers du projet. La hero passe de 681 KB à 212 KB en AVIF, la police de titrage de 292 KB à 30 KB.",
      items: [
        { label: "Hero · WebP d'origine", value: 681, display: "681 KB" },
        { label: "Morganite · TTF", value: 292, display: "292 KB" },
        { label: "Hero · AVIF 1600 px", value: 212, display: "212 KB", strong: true },
        { label: "Hero · AVIF 1080 px", value: 110, display: "110 KB", strong: true },
        { label: "Morganite · WOFF2", value: 30, display: "30 KB", strong: true },
      ],
    },
    /* Pas d'URL tant que les photos de biens ne sont pas sous licence : le
       site tourne en local, la capture et les planches en tiennent lieu. */
    url: null,
    shot: "/home/sites/maison.webp",
    mockup: "/home/mockups/maison.jpg",
    /* Les captures viennent du site lui-même, en mode « capture » (hauteur
       de hero figée), découpées section par section, jamais retouchées. */
    story: [
      {
        title: "L'accueil",
        text: [
          "Une photo, un titre, quatre entrées de menu. Une seule carte de bien, un seul bouton.",
        ],
        images: [{ src: "/home/sites/maison.webp", w: 1440, h: 900, caption: "l'accueil à 1440 px" }],
      },
      {
        title: "La sélection",
        text: [
          "Quatre biens, pas quarante. Le lieu, la surface, une phrase, le prix.",
        ],
        images: [{ src: "/home/maison/selection.webp", w: 1440, h: 1715, caption: "la sélection, quatre biens" }],
      },
      {
        title: "Quatre temps",
        text: [
          "Une note sur un fossile, puis le parcours. C'est la seule surface bordeaux de la page.",
        ],
        layout: "two",
        images: [
          { src: "/home/maison/accroche.webp", w: 1440, h: 787, caption: "la note sur le fossile" },
          { src: "/home/maison/parcours.webp", w: 1440, h: 864, caption: "le parcours en quatre temps" },
        ],
      },
      {
        title: "Un premier entretien",
        text: [
          "Quatre champs, une réponse sous deux jours ouvrés. Aucun bandeau.",
        ],
        images: [{ src: "/home/maison/contact.webp", w: 1440, h: 751, caption: "le formulaire d'entretien" }],
      },
      {
        title: "La fiche de bien",
        text: [
          "Galerie à gauche, fiche collante à droite. Un seul bouton : demander une visite privée.",
        ],
        images: [
          { src: "/home/maison/fiche.webp", w: 1440, h: 1630, caption: "la fiche de la Villa sous les chênes" },
          { src: "/home/maison/fiche-suite.webp", w: 1440, h: 1287, caption: "la suite de la fiche : description, caractéristiques, pourquoi ce bien" },
        ],
      },
      {
        title: "Sur téléphone",
        text: [
          "Une colonne, la photo pleine largeur, le titre réduit à quatre mots.",
        ],
        layout: "phones",
        images: [
          { src: "/home/maison/mobile-accueil.webp", w: 780, h: 1688, caption: "l'accueil sur téléphone" },
          { src: "/home/maison/mobile-fiche.webp", w: 780, h: 1688, caption: "la fiche de bien sur téléphone" },
        ],
      },
      {
        title: "La signature",
        text: [
          "Tracée d'un seul geste. En vitrine, sur la carte, sur la bannière : la même ligne.",
        ],
        layout: "two",
        images: [
          { src: "/home/maison/vitrine.webp", w: 1600, h: 1067, caption: "la vitrine" },
          { src: "/home/maison/carte.webp", w: 1600, h: 1200, caption: "la carte de visite" },
          { src: "/home/maison/vendue.webp", w: 1600, h: 1067, caption: "la bannière « Vendue »" },
        ],
      },
      {
        title: "Les matières",
        text: [
          "Neuf matières prises de près, aucune maison. La palette vient de là.",
        ],
        layout: "narrow",
        images: [{ src: "/home/maison/moodboard.webp", w: 1080, h: 1350, caption: "le moodboard" }],
      },
    ],
  },
  {
    slug: "motodistri",
    name: "Motodistri",
    sector: "Distribution de pièces moto · Braives, Liège",
    brief:
      "Soixante mille références, et un client qui décroche son téléphone pour savoir si la pièce va sur sa moto.",
    answer:
      "Écrire la compatibilité dans la page, et traiter la recherche comme la fonction principale du site.",
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
    role: "Conception, design, développement, hébergement, publicité",
    stack: "Site, boutique, catalogue, espace client, trois langues",
    result: "Jusqu'à 600 vues/jour · 15 €/jour de pub",
    lede:
      "Le motard veut la pièce qui va sur sa moto, et la certitude avant de payer.",
    context: [
      "Hugo Fizaine vend des pièces moto depuis Braives. Le stock est réel, les colis partent chaque jour. Le catalogue : plus de soixante mille références, chacune avec sa liste de motos compatibles.",
    ],
    problem: [
      "Tant que la compatibilité n'est pas écrite dans la page, elle passe par le téléphone. Chaque appel coûte du temps, chaque doute finit en panier abandonné.",
      "Le budget publicitaire est de 15 € par jour. Tout doit venir de la structure.",
    ],
    decisions: [
      {
        title: "La moto avant le produit",
        text: "Marque, cylindrée, année, modèle. Le catalogue se filtre, et « Mon garage » retient la moto d'une visite à l'autre.",
      },
      {
        title: "La compatibilité écrite noir sur blanc",
        text: "Chaque fiche affiche la liste exacte des motos compatibles, ou rien. La réponse au téléphone, écrite d'avance.",
      },
      {
        title: "Une deuxième porte, par les cotes",
        text: "Onze familles de pièces attaquables par dimension, pour le mécanicien qui connaît ses mesures.",
      },
      {
        title: "Le stock affiché tel qu'il est",
        text: "Pièces disponibles et date de livraison, calculées à la commande. Une rupture se lit tout de suite.",
      },
      {
        title: "Écrire sur les vraies requêtes",
        text: "Catégories et fiches rédigées sur ce que les motards tapent. C'est ce qui rend 15 € par jour suffisants.",
      },
    ],
    built: [
      { label: "Catalogue et boutique", text: "Plus de 60 000 références, marques, catégories, promotions." },
      { label: "Sélecteur de véhicule", text: "Marque, cylindrée, année, modèle, et « Mon garage »." },
      { label: "Recherche par cotes", text: "Onze familles de pièces, par dimension." },
      { label: "Paiement et logistique", text: "Paiement en trois fois, expédition sous 24 h, retour sous 14 jours." },
      { label: "Espace client et Club Pro", text: "Compte, historique, tarif professionnel pour les ateliers." },
      { label: "Trois langues", text: "Français, anglais, italien, chacune avec ses routes." },
    ],
    facts: [
      { value: "60 000+", label: "références au catalogue" },
      { value: "3", label: "langues : FR · EN · IT" },
      { value: "24 h", label: "expédition, commande avant 15 h" },
      { value: "15 €/j", label: "budget publicitaire" },
    ],
    outcome: [
      "Du 15 au 29 mai 2026, jusqu'à 600 vues par jour, avec 15 € de publicité quotidienne. La capture Analytics est ci-dessous, non recadrée.",
      "Le chiffre d'affaires appartient au client. Je ne publie que ce que je peux montrer.",
    ],
    /* Pas de graphique ici : les chiffres disponibles n'ont pas la même unité
       et ne peuvent pas partager un axe sans mentir. La courbe Analytics est
       la vraie mesure du projet. */
    chart: null,
    url: "https://motodistri.com",
    shot: "/home/sites/motodistri.webp",
    mockup: "/home/mockups/motodistri.jpg",
  },
  {
    slug: "zen-harmonie",
    name: "Zen Harmonie",
    sector: "Massothérapie · Hélécine",
    brief:
      "Un praticien seul, qui reçoit le soir et le samedi : aux heures où l'on pense à réserver, il est en séance.",
    answer:
      "Sortir le téléphone du chemin de la réservation, et faire tenir le créneau par un acompte.",
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
    role: "Conception, design, développement, SEO local",
    stack: "Site, réservation en ligne, acompte, SEO local",
    result: "1ʳᵉ position · pack local Google",
    lede:
      "Lundi et mardi de 18 h à 20 h 30, vendredi dès 14 h 30, samedi matin. Le reste du temps, personne ne décroche.",
    context: [
      "Pierre Vanderelst pratique la massothérapie à Hélécine. Il est seul : il reçoit, il masse, il répond au téléphone, et il ne peut pas faire les trois en même temps.",
    ],
    problem: [
      "Le client appelle en journée, le praticien est en séance. Le praticien rappelle le soir, le client est à table. Deux personnes qui se manquent, un créneau qui reste vide.",
      "Et une heure réservée et non venue ne se rattrape pas.",
    ],
    decisions: [
      {
        title: "Sortir le téléphone du chemin",
        text: "Soin, durée, créneau, coordonnées. Aucun compte à créer. Le site prend les rendez-vous pendant que le praticien masse.",
      },
      {
        title: "Un acompte de 50 % à la réservation",
        text: "Réglé en ligne, solde sur place. Un créneau réservé engage la personne qui le réserve.",
      },
      {
        title: "Le report plutôt que l'annulation",
        text: "Un lien dans le mail de confirmation déplace le rendez-vous sans frais, jusqu'à 48 h avant.",
      },
      {
        title: "Le prix affiché avant l'appel",
        text: "Chaque soin porte ses durées et ses tarifs. Personne ne téléphone pour demander un prix.",
      },
      {
        title: "La commune plutôt que le métier",
        text: "« Massage hélécine » plutôt que « massothérapie bien-être » : la seule requête qui décide quelqu'un à prendre sa voiture.",
      },
    ],
    built: [
      { label: "Réservation en ligne", text: "Soin, durée et prix, créneau, coordonnées, sans compte." },
      { label: "Acompte et paiement", text: "50 % en ligne par carte, solde sur place." },
      { label: "Report autonome", text: "Lien de déplacement dans le mail, actif jusqu'à 48 h avant." },
      { label: "Fiches de soins", text: "Bienfaits, durées et tarifs : de quoi choisir sans appeler." },
      { label: "Présence locale", text: "Fiche Google, horaires réels, référencement sur la commune." },
    ],
    facts: [
      { value: "5,0 ★", label: "12 avis Google" },
      { value: "50 %", label: "d'acompte à la réservation" },
      { value: "48 h", label: "pour reporter sans frais" },
      { value: "40–70 €", label: "selon la durée du soin" },
    ],
    outcome: [
      "Sur « massage hélécine », la fiche sort en tête du pack local. La capture est datée d'août 2026 : retapez la requête.",
      "Le nombre de rendez-vous pris par le site appartient au praticien.",
    ],
    chart: {
      kind: "week",
      title: "Les heures où le cabinet est ouvert",
      note: "Seize heures par semaine, l'essentiel après 18 h. Aux heures où un client pense à réserver, le praticien est en séance.",
      from: 8,
      to: 21,
      days: [
        { day: "Lundi", from: 18, to: 20.5, label: "18 h – 20 h 30" },
        { day: "Mardi", from: 18, to: 20.5, label: "18 h – 20 h 30" },
        { day: "Mercredi", from: null, to: null, label: "Fermé" },
        { day: "Jeudi", from: null, to: null, label: "Fermé" },
        { day: "Vendredi", from: 14.5, to: 19, label: "14 h 30 – 19 h" },
        { day: "Samedi", from: 8.5, to: 15, label: "8 h 30 – 15 h" },
        { day: "Dimanche", from: null, to: null, label: "Fermé" },
      ],
    },
    url: "https://zenharmoniehélécine.be",
    shot: "/home/sites/zen-harmonie.webp",
    mockup: "/home/mockups/zen-harmonie.jpg",
  },
  {
    slug: "volt-pro",
    name: "Volt-Pro",
    sector: "Électricité générale · 63 communes",
    brief:
      "On n'appelle pas un électricien pour comparer, on l'appelle parce que quelque chose ne fonctionne plus.",
    answer:
      "Mettre le délai d'intervention avant toute présentation, et écrire une page par commune couverte.",
    metric: "Rappel < 2 h · 63 communes",
    rating: null,
    query: null,
    proof: null,
    featured: false,
    role: "Conception, design, développement, SEO local",
    stack: "Site, 63 pages communes, pages services, demande de devis",
    result: "Rappel < 2 h · 63 communes couvertes",
    lede:
      "Une odeur de brûlé près du tableau, et deux questions : vous venez, et dans combien de temps.",
    context: [
      "Volt-Pro dépanne, met aux normes et installe des bornes depuis Waremme, sur trois territoires : Bruxelles, le Brabant wallon et la province de Liège. Ligne d'urgence ouverte 24 h sur 24.",
    ],
    problem: [
      "Le visiteur en urgence cherche un délai et un numéro, en dix secondes.",
      "Et il ne tape pas « électricien », il tape « électricien Jodoigne ». Une page unique ne répond pas à soixante-trois communes.",
    ],
    decisions: [
      {
        title: "Le délai avant l'entreprise",
        text: "En haut de page : moins de deux heures, certifié RGIE, le numéro cliquable. Le métier vient après.",
      },
      {
        title: "Une page par commune, réellement écrite",
        text: "Soixante-trois pages, chacune avec son code postal, son délai et ses voisines. Une page dupliquée ne se classe pas.",
      },
      {
        title: "Découper par intention",
        text: "Dépannage, tableau, borne, photovoltaïque, rénovation, domotique : six raisons d'appeler, pas six familles de matériel.",
      },
      {
        title: "Nommer ce qui inquiète",
        text: "« Disjoncteur qui saute », « odeur de brûlé » : les mots que le visiteur tape, écrits dans la page.",
      },
    ],
    built: [
      { label: "63 pages communes", text: "Code postal, délai local, contexte, communes voisines en lien." },
      { label: "6 pages services", text: "Dépannage 24/7, tableau et RGIE, borne, photovoltaïque, rénovation, domotique." },
      { label: "Demande de devis typée", text: "Formulaire réduit, type de demande en liste." },
      { label: "Appel en un geste", text: "Numéro d'urgence cliquable, présent en permanence." },
    ],
    facts: [
      { value: "63", label: "communes couvertes" },
      { value: "< 2 h", label: "délai annoncé en urgence" },
      { value: "24/7", label: "ligne d'urgence" },
      { value: "6", label: "services distincts" },
    ],
    outcome: [
      "Le site est en ligne avec ses soixante-trois pages locales et sa ligne d'urgence.",
      "Pas de capture Google ici : une requête sur soixante-trois ne prouverait rien.",
    ],
    chart: {
      kind: "bars",
      title: "Les 63 communes, par territoire",
      note: "Chaque commune a sa page, son code postal, son délai et ses voisines en lien.",
      items: [
        { label: "Province de Liège", value: 28, display: "28 communes" },
        { label: "Bruxelles-Capitale", value: 19, display: "19 communes" },
        { label: "Brabant wallon", value: 16, display: "16 communes" },
      ],
    },
    // Site hors ligne : pas de lien tant qu'il ne répond pas.
    url: null,
    shot: "/home/sites/volt-pro.webp",
    mockup: "/home/mockups/volt-pro.jpg",
  },
  {
    slug: "detail-wave",
    name: "Detail Wave",
    sector: "Nettoyage textile & auto à domicile · Liège",
    brief:
      "Deux inconnues font fermer l'onglet : à quoi ressemble le travail, et combien ça coûte.",
    answer:
      "Un curseur avant/après par prestation, un prix par prestation, et un panier de devis.",
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
    role: "Direction artistique, design, développement, SEO local",
    stack: "Site, configurateur de devis, avant/après, SEO local",
    result: "1ʳᵉ position · pack local Google",
    lede:
      "Un nettoyage de canapé se vend sur une image : l'avant et l'après.",
    context: [
      "DetailWave nettoie à domicile, autour de Liège : canapés, matelas, tapis, intérieurs de voiture. Sept jours sur sept, produits biodégradables.",
    ],
    problem: [
      "Deux inconnues font fermer l'onglet : à quoi ressemble le travail, et combien ça coûte. Pour le prestataire, deux appels par prospect.",
    ],
    decisions: [
      {
        title: "L'avant/après en curseur",
        text: "Une photo coupée en deux par une poignée. Le visiteur produit lui-même le résultat, sans rien lire.",
      },
      {
        title: "Le prix affiché, prestation par prestation",
        text: "Canapé trois places 90 €, matelas 70 €, tapis 50 €. Rien n'est « sur demande » sans raison.",
      },
      {
        title: "Un panier de devis",
        text: "On empile les prestations, le total se met à jour, on envoie. Le prestataire reçoit une demande déjà chiffrée.",
      },
      {
        title: "L'angle santé plutôt que propreté",
        text: "Acariens, bactéries, odeurs. Un canapé sain est un argument qui justifie 90 €.",
      },
      {
        title: "Les communes écrites, une par une",
        text: "Liège, Ans, Seraing, Herstal : dix communes nommées. Une intervention à domicile se choisit sur la distance.",
      },
    ],
    built: [
      { label: "Configurateur", text: "Options tarifées, total recalculé à chaque choix." },
      { label: "Panier de devis", text: "Prestations empilées, total estimé, envoi de la demande." },
      { label: "Avant/après", text: "Curseur sur photo unique, une par prestation." },
      { label: "Zone d'intervention", text: "Dix communes nommées, plus la périphérie." },
      { label: "Preuve sociale", text: "Avis Google en clair, avec lien vers la fiche." },
    ],
    facts: [
      { value: "5,0 ★", label: "11 avis Google" },
      { value: "6", label: "prestations tarifées" },
      { value: "10", label: "communes nommées" },
      { value: "7j/7", label: "service continu" },
    ],
    outcome: [
      "Sur « nettoyage canapé waremme », la fiche sort en tête du bloc « Entreprises ». La capture est datée d'août 2026.",
      "Le taux de transformation du panier appartient au client.",
    ],
    chart: {
      kind: "bars",
      title: "La grille tarifaire, affichée en clair",
      note: "Les prix lisibles sur le site, sans appel préalable. Bureau à l'heure et fin de chantier au mètre carré : les deux seules lignes sans prix fixe.",
      items: [
        { label: "Nettoyage tapis", value: 50, display: "50 €" },
        { label: "Nettoyage matelas", value: 70, display: "70 €" },
        { label: "Canapé 3 places", value: 90, display: "90 €", strong: true },
        { label: "Canapé 4 places", value: 120, display: "120 €" },
        { label: "Prestation automobile", value: 120, display: "120 €" },
        { label: "Canapé 5 places et +", value: 145, display: "145 €" },
      ],
    },
    url: "https://detailwave.be",
    shot: "/home/sites/detail-wave.webp",
    mockup: "/home/mockups/detail-wave.jpg",
  },
  {
    slug: "lokigen",
    name: "Lokigen",
    sector: "SaaS · sites pour artisans",
    brief:
      "Des artisans qui ont une fiche Google complète, aucun site, et ni le temps ni le budget d'un projet sur mesure.",
    answer:
      "Partir de la fiche Google : le nom de l'entreprise suffit, le site est assemblé et visible avant d'être payé.",
    metric: "Un site en 3 minutes · 39 €/mois",
    rating: null,
    query: null,
    proof: null,
    featured: false,
    role: "Produit, design, développement, exploitation",
    stack: "Application web, génération automatique, domaine et hébergement inclus",
    result: "Produit en ligne · ouvert aux inscriptions",
    lede:
      "Tout est déjà sur la fiche Google de l'artisan. Il manque quelqu'un pour l'assembler.",
    context: [
      "La plupart des artisans du bâtiment ont une fiche Google complète et aucun site. Lokigen prend le problème par l'autre bout : 39 € par mois, et le site est montré en entier avant d'être payé.",
    ],
    problem: [
      "Le blocage n'est pas le prix, c'est la matière. Un plombier n'écrira pas ses textes et ne triera pas ses photos un dimanche soir.",
      "Il faut produire un site complet sans qu'il ait une ligne à rédiger.",
    ],
    decisions: [
      {
        title: "Une seule entrée : le nom de l'entreprise",
        text: "Photos, avis, coordonnées et zone sont importés de la fiche Google. Rien à taper.",
      },
      {
        title: "L'aperçu complet avant le paiement",
        text: "Le site fini, visible sans carte bancaire. Il regarde et il décide.",
      },
      {
        title: "Des modules activables, pas un éditeur",
        text: "Galerie, avis, WhatsApp, devis avec TVA 6 % ou 21 %, rendez-vous. On active, on n'assemble pas.",
      },
      {
        title: "Un prix, écrit une fois",
        text: "39 € par mois, ou 390 € l'année. Le prix d'aujourd'hui est celui de l'an prochain.",
      },
      {
        title: "Ne jamais toucher aux avis",
        text: "Aucun avis supprimé, aucun tri. Un outil qui filtre les avis finit par les fabriquer.",
      },
    ],
    built: [
      { label: "Génération", text: "Photos, avis, coordonnées et zone importés depuis le nom de l'entreprise." },
      { label: "Aperçu gratuit", text: "Site complet visible sans carte bancaire, en ligne sous 24 h." },
      { label: "Modules", text: "Neuf modules activables d'un clic." },
      { label: "Gabarits par métier", text: "Douze métiers du bâtiment, du plombier au terrassier." },
      { label: "Abonnement", text: "39 €/mois HTVA ou 390 €/an, domaine et hébergement inclus, résiliable en un clic." },
    ],
    facts: [
      { value: "39 €", label: "par mois, tout compris" },
      { value: "3 min", label: "pour générer le site" },
      { value: "24 h", label: "pour être en ligne" },
      { value: "12", label: "métiers du bâtiment couverts" },
    ],
    outcome: [
      "Le produit est en ligne et ouvert aux inscriptions.",
      "Aucun chiffre d'usage pour l'instant. Il y en aura quand il y aura de quoi en montrer un honnête.",
    ],
    chart: {
      kind: "bars",
      title: "Ce que coûte un site, sur trois ans",
      note: "À trois ans, l'abonnement passe encore sous le bas de la fourchette d'agence, domaine et hébergement compris.",
      items: [
        { label: "Agence · haut de fourchette", value: 5000, display: "5 000 €" },
        { label: "Agence · bas de fourchette", value: 2000, display: "2 000 €" },
        { label: "Lokigen · 3 ans", value: 1404, display: "1 404 €", strong: true },
        { label: "Lokigen · 1 an", value: 468, display: "468 €" },
      ],
    },
    url: "https://lokigen.be",
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
    "Je montre ce qui a été construit, pourquoi, et ce que ça a produit. Les positions Google se vérifient en dix secondes.",
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
    line: "Comprendre ce qui vous coûte, avant de dessiner.",
  },
  {
    label: "Design & développement",
    line: "Dessiné et codé par la même personne.",
  },
  {
    label: "Visibilité locale",
    line: "Sortir sur les recherches de votre zone, commune par commune.",
  },
];

/** Principes de collaboration, ce qui remplace la « méthode en cinq étapes ». */
export const PRINCIPLES = [
  {
    title: "Le problème avant la maquette",
    text: "Je commence par ce qui coince. Le design répond à ça, pas à une tendance.",
  },
  {
    title: "Je dis aussi ce qui ne sert à rien",
    text: "Un blog que personne n'écrira, une page équipe pour une personne seule. Retiré, pas facturé.",
  },
  {
    title: "Construit pour être repris",
    text: "Le code reste lisible par un autre. Vous n'êtes prisonnier ni d'un outil, ni de moi.",
  },
];

/** Présentation humaine, faits vérifiables uniquement, pas de biographie. */
export const STUDIO = {
  name: "Esteban",
  role: "Design & développement",
  img: "/esteban.jpg",
  body: [
    "Pixelbrute, c'est une personne. Conception, design, code et mise en ligne, du premier appel jusqu'après la livraison.",
    "Je travaille depuis Hannut. La plupart de mes clients sont à moins de vingt minutes.",
  ],
  facts: [
    { lbl: "Basé à", val: "Hannut · Hesbaye liégeoise" },
    { lbl: "Rôle", val: "Conception, design, code" },
    { lbl: "Dossiers publiés", val: "Six" },
    { lbl: "Avis Google", val: "5,0 ★ · 3 avis" },
  ],
  /**
   * Logo officiel, tiré de venturelab.be, d'une seule couleur : il est posé
   * en masque CSS, donc teint à l'encre du site plutôt qu'en rose VentureLab.
   */
  incubator: {
    lbl: "Incubé au",
    name: "VentureLab · Liège",
    url: "https://www.venturelab.be/",
    logo: "/venturelab.svg",
  },
};

export type Quote = {
  text: string;
  name: string;
  role: string;
  /** Photo du projet ; `null` quand on n'en a pas, on affiche alors les initiales. */
  img: string | null;
};

/**
 * Avis clients réels, repris mot pour mot (fautes de frappe et emoji compris :
 * on ne réécrit pas un avis). Les deux premiers sont publiés sur Google ;
 * celui de Moto Distri était encore en attente de publication au moment de
 * l'intégration, à revérifier avant mise en ligne.
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

/**
 * Tarifs publiés, `/tarifs`.
 *
 * Trois offres, jamais plus : devant trois choix, on prend celle du milieu,
 * et la grille est construite pour que le milieu soit celle à vendre,
 * Signature. Chaque offre embarque son socle mensuel, hébergement, sécurité,
 * petites modifications, rapport : pas de site livré sans, et c'est annoncé
 * dès le devis, pas après. Le site affiche « à partir de », jamais la grille
 * complète : ça filtre les demandes froides sans bloquer sur un chiffre.
 *
 * On vend un résultat, pas des heures : un promoteur ne paie pas quarante
 * heures de code, il paie un site qui vend ses programmes. Rien ici n'est
 * exprimé en temps.
 *
 * Ces montants sont ceux du site public. Le catalogue de la plateforme
 * (`src/lib/pricing.ts`), lu par les devis et les commissions, a sa propre
 * grille : le site public ne l'importe plus, une refonte tarifaire ne doit
 * pas casser vingt-sept écrans de la plateforme. Les deux sont à tenir
 * alignés à la main, et le catalogue est en retard sur cette grille.
 *
 * Montants en centimes, hors TVA. Paiement : moitié à la commande, moitié à
 * la livraison jusqu'à 6 000 € ; au-delà, trois tranches, 30 / 40 / 30. Le
 * code est cédé au paiement intégral : quelqu'un qui paie la moitié,
 * récupère le code et disparaît, ça s'est déjà vu.
 *
 * Les conditions de `TERMS` (délais, corrections comprises, durée du socle)
 * sont écrites ici une fois et reprises telles quelles sur la page tarifs,
 * la méthode et la FAQ : un délai qui diffère d'une page à l'autre n'engage
 * plus personne.
 */

/** « 2 500 € », espace fine insécable entre les milliers, insécable avant le signe. */
export const euro = (c: number) =>
  String(Math.round(c / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f") + "\u00a0€";

export const SITE_FROM = {
  essentiel: 250000,
  signature: 550000,
  surMesure: 900000,
} as const;

export type PriceTier = {
  key: string;
  name: string;
  /** Prix de départ, en centimes. */
  from: number;
  /** Socle mensuel compris, en centimes par mois. */
  monthly: number;
  /** À qui ça s'adresse, en une phrase. */
  who: string;
  /** Délai de livraison, à compter du contenu reçu. */
  delay: string;
  includes: string[];
  /** L'offre du milieu, celle à vendre. Une seule. */
  featured?: boolean;
};

export type PriceLine = { name: string; price: number; note: string };

export const PRICING: {
  sites: PriceTier[];
  socle: { name: string; items: string[] };
  monthly: PriceLine[];
  options: string[];
  payment: { small: string; large: string };
} = {
  sites: [
    {
      key: "essentiel",
      name: "Essentiel",
      from: SITE_FROM.essentiel,
      monthly: 9000,
      who: "Une entreprise qui doit être trouvée, comprise, puis appelée.",
      delay: "Environ trois semaines, une fois le contenu reçu",
      includes: [
        "Site vitrine, cinq à sept pages",
        "Design sur mesure, lisible au téléphone",
        "Formulaire de contact",
        "Mise en ligne, domaine à votre nom",
      ],
    },
    {
      key: "signature",
      name: "Signature",
      featured: true,
      from: SITE_FROM.signature,
      monthly: 15000,
      who: "Un site qui fait un travail précis : rentrer des mandats, vendre un programme, remplir un agenda.",
      delay: "Environ cinq semaines, une fois le contenu reçu",
      includes: [
        "Dix à quinze pages",
        "Une fonctionnalité métier : recherche de biens, page programme, prise de rendez-vous",
        "Contenu structuré pour les recherches de votre zone",
        "Suivi des conversions : appels, formulaires, réservations",
      ],
    },
    {
      key: "sur-mesure",
      name: "Sur mesure",
      from: SITE_FROM.surMesure,
      monthly: 25000,
      who: "Le site fait tourner une partie de l'activité, et se branche sur vos outils.",
      delay: "Délai écrit dans le devis, livraison par étapes",
      includes: [
        "Espace client, tableau de bord",
        "Configurateur, boutique en ligne",
        "Intégrations avec vos logiciels",
        "Conception écrite, devis poste par poste, livraison par étapes",
      ],
    },
  ],
  socle: {
    name: "Le socle mensuel, compris dans chaque offre",
    items: [
      "Hébergement",
      "Sécurité et mises à jour",
      "Petites modifications de contenu",
      "Rapport mensuel : visites, demandes, positions",
    ],
  },
  monthly: [
    {
      name: "Contenu",
      price: 25000,
      note: "Articles rédigés et publiés chaque mois, sur les questions que vos clients tapent.",
    },
    {
      name: "Campagnes Meta et Google Ads",
      price: 75000,
      note: "Création, tests, arrêt de ce qui ne rapporte pas, rapport chaque semaine. Budget média en plus.",
    },
  ],
  options: [
    "Page supplémentaire",
    "Langue supplémentaire",
    "Refonte de contenu",
    "Séance photo",
    "Formation à l'administration du site",
  ],
  payment: {
    small: "Jusqu'à 6 000 € : moitié à la commande, moitié à la livraison.",
    large: "Au-delà : 30 % à la commande, 40 % à la validation de la maquette, 30 % à la livraison.",
  },
};

/**
 * Les conditions écrites dans chaque devis. Une phrase chacune, reprises
 * mot pour mot partout où elles sont citées.
 */
export const TERMS = {
  /** Qui reçoit un prix quand. */
  quote:
    "Prix fixé pendant l'appel de quinze minutes pour Essentiel et Signature. Pour le sur mesure, devis écrit sous 48 h ouvrées.",
  /* Les étapes sont nommées dans la phrase même : sans ça, un client tient
     tout le projet pour une seule étape et demande ses deux séries à la fin,
     sur l'ensemble. */
  revisions:
    "Deux séries de corrections comprises à chacune des quatre étapes validées : maquette, intégration, contenu, recette. Au-delà, facturé, et annoncé avant.",
  socle:
    "Socle mensuel sur douze mois, puis au mois, avec un mois de préavis.",
  handover:
    "Le domaine est enregistré à votre nom dès le départ. Le code est cédé au paiement intégral.",
} as const;

export const FAQS = [
  {
    q: "Par quoi on commence ?",
    a: `Un appel de quinze minutes, réservé en ligne. ${TERMS.quote} Rien à signer, ni pendant, ni après.`,
  },
  {
    q: "Combien de temps prend un projet ?",
    a: "Essentiel, environ trois semaines. Signature, environ cinq. Les deux à compter du contenu reçu. Sur mesure : délai écrit dans le devis.",
  },
  {
    q: "Qu'est-ce qui fait varier le prix ?",
    a: `Le nombre de pages réellement différentes, une boutique ou une réservation, un outil à brancher, l'état du contenu. Essentiel dès ${euro(SITE_FROM.essentiel)}, Signature dès ${euro(SITE_FROM.signature)}, sur mesure dès ${euro(SITE_FROM.surMesure)}, hors TVA.`,
  },
  {
    q: "Qui écrit les textes et fournit les photos ?",
    a: "Vous fournissez la matière, je la structure et je réécris ce qui ne fonctionne pas à l'écran. Sans photos, on en parle tôt.",
  },
  {
    q: "Est-ce que vous sous-traitez ?",
    a: "Non. Conception, design et code par la même personne.",
  },
  {
    q: "Vous garantissez des résultats ?",
    a: "Non, et je me méfie de ceux qui le font. Les premières places Google se vérifient en dix secondes : vous jugez sur pièces.",
  },
];

/**
 * Mention de disponibilité du dernier écran. Texte daté, à mettre à jour à
 * chaque build, ou `null` pour ne rien afficher. Jamais gardée pour l'effet.
 */
/**
 * Réservation en ligne (Cal.com). Le nom d'utilisateur du compte fait partie du
 * lien : s'il change, ces deux constantes sont le seul endroit à modifier.
 * L'événement dure 15 min et propose deux lieux, téléphone ou visio.
 *
 * `BOOKING_CAL_LINK` est la forme attendue par la modale, `BOOKING_URL` la page
 * publique, celle qui sert de `href`, donc de secours si le script de la modale
 * ne se charge pas. Les deux doivent désigner le même événement.
 */
export const BOOKING_CAL_LINK = "estebangilles/appel";
export const BOOKING_URL = `https://cal.com/${BOOKING_CAL_LINK}`;

/**
 * WhatsApp, même numéro que la ligne, sans indicatif ni « + » dans wa.me.
 * Le texte pré-rempli n'engage à rien : il évite la page blanche, et dit à
 * quel titre on écrit, sinon le premier message reçu est souvent « bonjour ».
 */
export const WHATSAPP_URL =
  "https://wa.me/32492200275?text=" +
  encodeURIComponent("Bonjour, je vous écris au sujet d'un projet de site.");

export const AVAILABILITY: string | null = "Une place libre dès maintenant";

export const pad = (n: number) => String(n + 1).padStart(2, "0");
