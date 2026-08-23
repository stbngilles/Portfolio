/**
 * Contenu de la homepage. Tout le texte éditorial vit ici pour qu'une
 * correction de copy ne demande jamais de toucher au rendu.
 *
 * Structure de la page (août 2026) : hero → manifeste → projets → expertises
 * → principes → témoignages → studio → CTA.
 *
 * Les études de cas (août 2026) sont écrites à partir des sites en ligne,
 * relus page par page : les chiffres cités — 60 000 références, 63 communes,
 * 36 balises, acompte de 50 % — sont lisibles sur les sites eux-mêmes ou
 * dans leurs conditions générales. Rien n'est estimé, rien n'est arrondi
 * vers le haut. Quand un chiffre manque, la phrase le dit au lieu de le
 * remplacer par un adjectif.
 */

export type Proof = { src: string; w: number; h: number; caption: string };

/** Une décision de conception : ce qui a été tranché, et pourquoi. */
export type Decision = { title: string; text: string };

/** Un élément réellement livré — vérifiable en ouvrant le site. */
export type Built = { label: string; text: string };

/** Un chiffre lisible sur le site livré. Jamais une estimation. */
export type Fact = { value: string; label: string };

/**
 * Visuel de lecture d'une étude de cas. Trois formes seulement, toutes
 * dessinées à partir de chiffres relevés sur le site du client — jamais une
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
    }
  | { kind: "grid36"; title: string; note: string };

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
  /** Fait partie des projets mis en avant. */
  featured: boolean;
  role: string;
  stack: string;
  result: string;
  /** Phrase d'ouverture de l'étude de cas — le projet en une respiration. */
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
  /** Ce que ça a produit — et ce qu'on ne peut pas prouver. */
  outcome: string[];
  /** Graphique de lecture — `null` quand aucun chiffre ne mérite un dessin. */
  chart: Chart | null;
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
    sector: "Éditeur de jeux · Belgique",
    brief:
      "Deux jeux de plein air, un stand réservé à Essen, et aucun revendeur pour les faire essayer.",
    answer:
      "Faire du site la boutique et le démonstrateur à la fois — la règle expliquée avant le prix.",
    metric: "Boutique et réseau à construire",
    rating: null,
    query: null,
    proof: null,
    featured: false,
    role: "Conception, design, développement, intégration boutique",
    stack: "Site, boutique, fiches jeux, formulaires réseau",
    result: "Boutique en ligne · départ pour Essen 2026",
    lede:
      "Un jeu qui se joue debout, dehors, sur une grille de six mètres de côté ne se comprend pas sur une photo de boîte.",
    context: [
      "Azimut Games est né d'une formation de moniteur en course d'orientation à l'ADEPS. Vincent Merveille en a tiré Azimut XL : trente-six balises posées au sol en 6×6, plus de cent quarante cartes, et un terrain de récréation qui devient un plateau de jeu. Azimath, le second titre, applique le même principe aux quatre opérations.",
      "Derrière la boîte : deux ans de prototypes, des tests en classe menés par des institutrices, une relecture complète des règles, une illustratrice, un fabricant. En octobre 2026, le jeu part à SPIEL Essen — le plus grand salon du secteur — hall 4, stand D425.",
    ],
    problem: [
      "Tant que le visiteur n'a pas compris comment on y joue, il n'a aucune raison de payer 58,80 €. Et un jeu de plein air se montre mal : la photo de boîte ne dit rien, le rendu 3D ment, et la vidéo arrive trop tard dans la page.",
      "Deuxième contrainte : il n'y a pas encore de revendeur pour faire la démonstration à la place du site. Le réseau se construit. Le site doit donc tenir trois rôles à la fois — expliquer, vendre, et recruter les lieux qui feront jouer.",
    ],
    decisions: [
      {
        title: "La règle avant le prix",
        text: "Trois gestes en haut de la page d'accueil : on pose la grille, on pioche une carte, on rejoint la balise. Le mécanisme complet du jeu tient en trois phrases, et il est lu avant que le tarif n'apparaisse. Un visiteur qui a compris la règle est un visiteur qui peut décider.",
      },
      {
        title: "Montrer le jeu là où il se joue",
        text: "Une section entière de photos prises dans un champ, un jour d'hiver, avec deux joueurs au milieu des balises. Ni studio, ni image de synthèse : sur un jeu qui se pratique dehors, le studio ment et ça se voit.",
      },
      {
        title: "Écrire le contenu exact de la boîte",
        text: "« Cette liste est le contenu exact de la boîte. Tout autre élément visible sur les photos est une mise en situation. » La phrase est affichée sous le détail du matériel, et répétée sous les visuels où apparaissent des cônes qui ne sont pas livrés. Chaque malentendu évité là, c'est un retour et un avis négatif en moins.",
      },
      {
        title: "Créditer tout le monde, nommément",
        text: "Auteur, illustratrice, relecteur des règles, responsable de fabrication, testeurs de la FRSO, institutrices, traductrices. Pour un premier jeu d'un éditeur que personne ne connaît, les noms sont la crédibilité : ils prouvent qu'il y a eu un vrai travail d'édition derrière la boîte.",
      },
      {
        title: "Recruter la distribution depuis le site",
        text: "Deux formulaires structurés plutôt qu'une adresse mail : « référencer un lieu » pour les boutiques, ludothèques, écoles et clubs, et « devenir ambassadeur » pour ceux qui feraient jouer près de chez eux. Le site ne se contente pas de vendre, il construit le réseau qui n'existe pas encore.",
      },
      {
        title: "Un agenda plutôt qu'une carte vide",
        text: "Tant qu'il n'y a pas de revendeur, la page « Où nous trouver » n'affiche pas une carte sans points : elle affiche les prochaines dates de démonstration. On dit où on sera, pas où on n'est pas.",
      },
    ],
    built: [
      { label: "Boutique", text: "Panier, paiement sécurisé, expédition sous 1 à 3 jours ouvrables, retour sous 14 jours." },
      { label: "Fiches jeux", text: "Principe, matériel chiffré, âge, nombre d'équipes, niveaux de difficulté, vidéos et consignes de sécurité." },
      { label: "Pages réseau", text: "« Où nous trouver » avec agenda des salons, référencement de lieux, programme ambassadeur." },
      { label: "Formulaires protégés", text: "Champs typés, consentement explicite, et un champ leurre invisible pour arrêter les robots sans imposer de captcha." },
      { label: "Univers de marque", text: "Page dédiée à Azi, la mascotte guide, et déclinaison graphique sur l'ensemble du site." },
      { label: "Pages légales", text: "CGV, mentions, rétractation, confidentialité — obligatoires dès qu'on encaisse un paiement." },
    ],
    facts: [
      { value: "2", label: "jeux au catalogue" },
      { value: "8", label: "langues (Azimut XL)" },
      { value: "36", label: "balises, grille 6×6" },
      { value: "+140", label: "cartes de jeu" },
    ],
    outcome: [
      "La boutique est en ligne, les deux jeux sont commandables, et les formulaires de réseau tournent avant le salon.",
      "Aucun chiffre de vente à afficher ici : le premier vrai test grandeur nature, c'est Essen, en octobre 2026. Je préfère une case vide à un chiffre gonflé.",
    ],
    chart: {
      kind: "grid36",
      title: "La grille du jeu, posée au sol",
      note: "Trente-six balises en 6×6, numérotées de 11 à 66. Les dizaines donnent la ligne, les unités la colonne — c'est toute la règle de lecture d'Azimut XL, et c'est ce que la page d'accueil doit faire comprendre en trois phrases.",
    },
    url: "https://azimuts.vercel.app",
    shot: "/home/sites/azimut-games.webp",
    mockup: "/home/mockups/azimut-games.jpg",
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
      "Sur un catalogue de soixante mille références, une recherche approximative ne sert à rien : le motard veut la pièce qui va sur sa moto, et il veut en être sûr avant de payer.",
    context: [
      "Hugo Fizaine vend des pièces et des équipements moto depuis la province de Liège — atelier à Braives, siège à Berloz. Le stock est réel, les colis partent tous les jours, l'activité existait avant le site. C'est l'outil qui ne suivait pas.",
      "Le catalogue couvre toutes les marques, tous les modèles et toutes les années de production : plus de soixante mille références, et pour chacune une liste de motos compatibles. Cette liste, c'est toute la valeur du site — et c'est aussi ce qui rend sa mise en ligne difficile.",
    ],
    problem: [
      "Un motard qui cherche un kit chaîne pour une KTM GS 125 de 1994 ne veut pas quinze résultats plausibles. Il en veut un, le bon, et une phrase qui lui dit qu'il va sur sa moto. Tant que cette certitude n'est pas écrite dans la page, elle passe par le téléphone.",
      "Chaque appel de vérification coûte du temps qui n'est facturé nulle part. Chaque doute non levé finit en panier abandonné — ou pire, en retour, avec les frais et l'avis qui vont avec.",
      "Troisième contrainte : le budget publicitaire est de 15 € par jour. À ce niveau-là, la publicité n'a pas les moyens de compenser un site introuvable ou lent. Tout doit venir de la structure.",
    ],
    decisions: [
      {
        title: "La moto avant le produit",
        text: "Le site s'ouvre sur un sélecteur marque / cylindrée / année / modèle, pas sur une bannière promotionnelle. Le visiteur renseigne sa moto une fois et le catalogue se filtre. « Mon garage » retient le véhicule d'une visite à l'autre : on ne retape pas sa cylindrée à chaque passage.",
      },
      {
        title: "La compatibilité écrite noir sur blanc",
        text: "Chaque fiche produit affiche la liste des motos compatibles, avec la cylindrée et les années de production. Pas de « compatible avec la plupart des modèles » : la liste exacte, ou rien. C'est la réponse à l'appel téléphonique, écrite d'avance et disponible à trois heures du matin.",
      },
      {
        title: "Une deuxième porte pour ceux qui connaissent leurs cotes",
        text: "Un mécanicien ne cherche pas par modèle, il cherche par dimension. Une entrée séparée attaque le catalogue par les cotes : pneumatiques, chambres à air, batteries, roulements, joints spi de fourche et de moteur, pastilles de soupape, galets de variateur, chaînes, courroies. Onze familles, chacune avec ses champs.",
      },
      {
        title: "Le stock affiché tel qu'il est",
        text: "La fiche annonce le nombre de pièces réellement disponibles et la date de livraison estimée, calculée à la commande. Une rupture est un état normal de la page, pas une erreur : mieux vaut la lire tout de suite que la découvrir à l'étape du paiement.",
      },
      {
        title: "Séparer le site public de la gestion",
        text: "Le catalogue et la gestion de stock vivent derrière une API ; la boutique ne fait que lire. Les imports peuvent tourner, le catalogue peut doubler, la boutique reste rapide — et une panne d'un côté ne ferme pas l'autre.",
      },
      {
        title: "Écrire sur les vraies requêtes",
        text: "Catégories, fiches et articles sont rédigés sur ce que les motards tapent réellement, pas sur le vocabulaire du fournisseur. C'est ce qui rend 15 €/jour de publicité suffisants : le budget sert à accélérer un site déjà trouvable, pas à masquer un site invisible.",
      },
      {
        title: "Rendre l'entreprise vérifiable",
        text: "Numéro BCE, adresse de l'atelier, point de retrait chez un concessionnaire partenaire, WhatsApp direct. Sur un marché saturé de revendeurs sans adresse, prouver qu'il y a un local et un humain derrière vaut mieux que n'importe quel badge de confiance.",
      },
    ],
    built: [
      { label: "Catalogue et boutique", text: "Plus de 60 000 références, marques, catégories et sous-catégories, promotions et ventes flash." },
      { label: "Sélecteur de véhicule", text: "Marque, cylindrée, année, modèle — et « Mon garage » qui retient la moto entre deux visites." },
      { label: "Recherche par cotes", text: "Onze familles de pièces attaquables par dimension, sans passer par le modèle de moto." },
      { label: "Paiement et logistique", text: "Paiement sécurisé, échelonnement en trois fois, expédition sous 24 h avant 15 h, suivi de colis, retour sous 14 jours." },
      { label: "Click & collect", text: "Retrait chez les concessionnaires partenaires, avec adresse et horaires affichés par point." },
      { label: "Espace client et Club Pro", text: "Compte, historique de commandes, et un tarif professionnel pour les ateliers et les revendeurs." },
      { label: "Trois langues", text: "Français, anglais, italien — chaque langue a ses routes, ce n'est pas une traduction posée par-dessus." },
      { label: "Contenu éditorial", text: "Blog, FAQ et pages de marques, écrits sur les requêtes réelles des motards." },
    ],
    facts: [
      { value: "60 000+", label: "références au catalogue" },
      { value: "3", label: "langues : FR · EN · IT" },
      { value: "24 h", label: "expédition, commande avant 15 h" },
      { value: "15 €/j", label: "budget publicitaire" },
    ],
    outcome: [
      "Sur la période relevée du 15 au 29 mai 2026, le site monte jusqu'à 600 vues par jour, avec 15 € de publicité quotidienne. La capture Google Analytics est ci-dessous, non recadrée, avec ses dates.",
      "Ce que cette courbe ne dit pas : le chiffre d'affaires. Il appartient au client, et je ne publie que ce que je peux montrer.",
    ],
    /* Pas de graphique ici : les chiffres disponibles — références, familles de
       pièces, motos compatibles — n'ont pas la même unité et ne peuvent pas
       partager un axe sans mentir. La courbe Analytics plus bas est la vraie
       mesure du projet. */
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
      "Ses horaires disent tout du problème : lundi et mardi de 18 h à 20 h 30, vendredi à partir de 14 h 30, samedi la matinée. Le reste du temps, personne ne décroche.",
    context: [
      "Pierre Vanderelst pratique la massothérapie à Hélécine, en Brabant wallon. Il est seul : c'est lui qui reçoit, lui qui masse, lui qui répond au téléphone — et il ne peut pas faire les trois en même temps.",
      "Trois familles de soins : sportif et récupération, relaxant et anti-stress, thérapie manuelle. De trente minutes à une heure, de 40 à 70 €, avec un tarif étudiant. Un métier de contact, jugé sur l'atmosphère avant d'être jugé sur le parcours.",
    ],
    problem: [
      "Sur ces plages horaires, le téléphone est le pire canal de réservation possible. Le client appelle en journée : le praticien est en séance ou ailleurs. Le praticien rappelle le soir : le client est à table. Deux personnes qui se manquent, et un créneau qui reste vide.",
      "L'autre perte du métier, c'est le rendez-vous non honoré. Une heure réservée et non venue ne se rattrape pas — elle est simplement perdue, et sur un agenda de quelques heures par semaine, elle pèse.",
      "Enfin, tout cela devait tenir dans une page qui respire. Un site de bien-être surchargé se contredit lui-même : l'atmosphère est le premier argument commercial.",
    ],
    decisions: [
      {
        title: "Sortir le téléphone du chemin de la réservation",
        text: "La prise de rendez-vous est un parcours en étapes : on choisit le soin, puis la durée et son prix, puis le créneau, puis on laisse ses coordonnées. Aucun compte à créer, aucun outil tiers à installer. Le site prend les rendez-vous pendant que le praticien masse.",
      },
      {
        title: "Un acompte de 50 % à la réservation",
        text: "L'acompte est réglé en ligne par carte, le solde sur place le jour du soin. Il n'est pas remboursable, et c'est écrit noir sur blanc dans les conditions générales plutôt que caché en petits caractères. Un créneau réservé engage la personne qui le réserve : c'est ce qui remplit réellement un agenda.",
      },
      {
        title: "Le report plutôt que l'annulation",
        text: "Le mail de confirmation contient un lien pour déplacer le rendez-vous, sans frais, jusqu'à 48 h avant la séance. On offre une sortie honorable ; en échange, le créneau revient assez tôt pour être proposé à quelqu'un d'autre.",
      },
      {
        title: "Le prix affiché avant l'appel",
        text: "Chaque soin porte ses durées et ses tarifs, et le tarif étudiant est annoncé dès la première étape de la réservation. Personne n'a besoin de téléphoner pour demander un prix — et le praticien ne perd pas d'appel à répondre à cette question-là.",
      },
      {
        title: "Dire ce que ce n'est pas",
        text: "Les conditions précisent que ces massages ne sont ni médicaux, ni kinésithérapeutiques, ni à caractère érotique. Sur ce métier, cette phrase n'est pas une formalité juridique : c'est un filtre qui écarte les appels qu'on ne veut pas recevoir.",
      },
      {
        title: "Le référencement sur la commune, pas sur le métier",
        text: "« Massage hélécine » plutôt que « massothérapie bien-être ». Sur une commune de cette taille, la requête locale est la seule qui décide quelqu'un à monter dans sa voiture — et c'est celle où il est encore possible d'être premier.",
      },
    ],
    built: [
      { label: "Réservation en ligne", text: "Parcours en étapes — soin, durée et prix, créneau, coordonnées — sans création de compte." },
      { label: "Acompte et paiement", text: "50 % réglés en ligne par carte via une plateforme sécurisée, solde sur place le jour de la séance." },
      { label: "Report autonome", text: "Lien de déplacement du rendez-vous dans le mail de confirmation, actif jusqu'à 48 h avant." },
      { label: "Fiches de soins", text: "Bienfaits détaillés, indications, durées et tarifs — de quoi choisir sans appeler." },
      { label: "Bons cadeaux", text: "Prise de commande par contact direct, sans complexifier le tunnel de réservation." },
      { label: "Présence locale", text: "Fiche Google, adresse, itinéraire, horaires réels et référencement sur la commune et ses voisines." },
      { label: "Cadre légal", text: "CGV explicites sur l'acompte, l'annulation, le retard et la nature exacte des soins." },
    ],
    facts: [
      { value: "5,0 ★", label: "12 avis Google" },
      { value: "50 %", label: "d'acompte à la réservation" },
      { value: "48 h", label: "pour reporter sans frais" },
      { value: "40–70 €", label: "selon la durée du soin" },
    ],
    outcome: [
      "Sur « massage hélécine », la fiche sort en tête du pack local, devant des cabinets installés dans les communes voisines. La capture est datée d'août 2026 : retapez la requête, ça se vérifie en dix secondes.",
      "Le nombre de rendez-vous pris par le site, en revanche, appartient au praticien. Je ne le publie pas.",
    ],
    chart: {
      kind: "week",
      title: "Les heures où le cabinet est ouvert",
      note: "Seize heures d'ouverture par semaine, dont l'essentiel après 18 h. C'est le graphique qui explique tout le projet : aux heures où un client pense à réserver, le praticien est en séance — et aux heures où il pourrait rappeler, le client ne répond plus.",
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
      "Le visiteur a une odeur de brûlé près du tableau et deux questions : est-ce que vous venez chez moi, et dans combien de temps.",
    context: [
      "Volt-Pro dépanne, met aux normes RGIE, installe des bornes de recharge et du photovoltaïque. L'entreprise est basée à Waremme et couvre trois territoires : Bruxelles-Capitale, le Brabant wallon et la province de Liège.",
      "Son argument n'est pas le portfolio — personne ne choisit un électricien sur ses plus belles installations. Son argument, c'est la proximité et la vitesse de réaction, avec une ligne d'urgence ouverte 24 h sur 24.",
    ],
    problem: [
      "Un site d'électricien parle d'habitude de son expertise, de ses années de métier et de ses certifications. Le visiteur en urgence ne lit rien de tout ça : il cherche un délai et un numéro, et il les cherche en dix secondes.",
      "Deuxième difficulté, plus structurelle : ces visiteurs ne tapent pas « électricien ». Ils tapent « électricien Jodoigne », « dépannage électrique Uccle », « mise en conformité RGIE Herstal ». Une page unique ne peut pas répondre à soixante-trois requêtes différentes sans devenir illisible.",
    ],
    decisions: [
      {
        title: "Le délai avant l'entreprise",
        text: "En haut de page : dépannage urgent, moins de deux heures, certifié RGIE, le numéro en clair et cliquable. La présentation du métier vient après, pour ceux qui lisent encore — c'est-à-dire ceux qui ne sont pas en urgence.",
      },
      {
        title: "Une page par commune, réellement écrite",
        text: "Soixante-trois communes, chacune avec son code postal, sa distance, son délai d'intervention annoncé — une heure à une heure trente à Waremme — une description de son tissu local, et les communes voisines en lien. Générer soixante-trois pages est facile ; les rendre réellement différentes est le travail. Une page dupliquée soixante-trois fois ne se classe pas.",
      },
      {
        title: "Découper par intention, pas par technique",
        text: "Dépannage, tableau et mise en conformité, borne de recharge, photovoltaïque, rénovation, domotique. Six entrées qui correspondent à six raisons d'appeler, pas à six catégories de matériel. Le visiteur reconnaît sa situation, pas un vocabulaire de métier.",
      },
      {
        title: "Nommer ce qui inquiète",
        text: "« Disjoncteur qui saute », « odeur de brûlé », « certificat de contrôle avant vente ou location ». Ce sont les mots que le visiteur a en tête et qu'il tape dans Google. Les écrire, c'est se rendre trouvable et se rendre rassurant du même geste.",
      },
      {
        title: "Écrire la méthode en quatre temps",
        text: "Appel et fourchette de prix annoncée avant déplacement, devis ferme par écrit, intervention, puis conformité et garantie. Sur un métier où le prix inquiète autant que la panne, annoncer l'ordre des étapes vaut mieux que n'importe quelle promesse de sérieux.",
      },
      {
        title: "Sans sous-traitant — et le dire",
        text: "« Vous parlez directement au technicien qui viendra. » C'est la seule différence lisible face aux plateformes de mise en relation qui occupent exactement les mêmes requêtes, avec un call center et un artisan tiré au sort.",
      },
    ],
    built: [
      { label: "63 pages communes", text: "Code postal, délai d'intervention local, contexte de la commune, services et communes voisines en maillage." },
      { label: "3 pages territoires", text: "Bruxelles-Capitale, Brabant wallon, province de Liège — chacune regroupant ses communes." },
      { label: "6 pages services", text: "Dépannage 24/7, tableau et conformité RGIE, borne de recharge, photovoltaïque, rénovation, domotique." },
      { label: "Demande de devis typée", text: "Formulaire réduit à l'essentiel, avec le type de demande en liste : on sait quoi préparer avant de rappeler." },
      { label: "Appel en un geste", text: "Numéro d'urgence cliquable, présent en permanence, sans jamais recouvrir le contenu." },
      { label: "Blog", text: "Contenu de fond sur les questions récurrentes — conformité, primes, sécurité." },
    ],
    facts: [
      { value: "63", label: "communes couvertes" },
      { value: "< 2 h", label: "délai annoncé en urgence" },
      { value: "24/7", label: "ligne d'urgence" },
      { value: "6", label: "services distincts" },
    ],
    outcome: [
      "Le site est en ligne avec ses soixante-trois pages locales et sa ligne d'urgence. La couverture se juge commune par commune.",
      "Pas de capture Google ici : je pourrais sortir la seule requête qui m'arrange, sur soixante-trois, et ça ne prouverait rien. Quand un relevé sera représentatif, il sera publié.",
    ],
    chart: {
      kind: "bars",
      title: "Les 63 communes, par territoire",
      note: "Chaque commune a sa page, son code postal, son délai d'intervention et ses communes voisines en lien. Soixante-trois pages générées, soixante-trois pages réellement différentes — une page dupliquée ne se classe pas.",
      items: [
        { label: "Province de Liège", value: 28, display: "28 communes" },
        { label: "Bruxelles-Capitale", value: 19, display: "19 communes" },
        { label: "Brabant wallon", value: 16, display: "16 communes" },
      ],
    },
    url: "https://volt-pro.be",
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
      "Un nettoyage de canapé se vend sur une seule image : l'avant et l'après. Tout le reste du site est là pour ne pas la gêner.",
    context: [
      "DetailWave nettoie à domicile, en injection-extraction : canapés, matelas, tapis, intérieurs de voiture, bureaux, fins de chantier. La zone est Liège et sa périphérie, le service tourne sept jours sur sept, les produits sont biodégradables.",
      "Sur ce marché, le concurrent d'à côté propose la même prestation au même tarif. Ce qui se compare vraiment, c'est le résultat visible — et la confiance qu'on accorde à quelqu'un qui va entrer chez soi.",
    ],
    problem: [
      "Un site de nettoyage s'écrit d'habitude comme un catalogue : liste de prestations, logos de produits, « devis sur demande ». Le visiteur repart sans savoir à quoi ressemble le travail, ni ce qu'il va payer.",
      "Deux inconnues, donc deux raisons de fermer l'onglet. Et pour le prestataire, deux appels téléphoniques par prospect, dont la moitié s'arrête net à l'annonce du prix.",
    ],
    decisions: [
      {
        title: "L'avant/après en curseur, pas en vignettes",
        text: "Chaque prestation s'ouvre sur une photo unique, coupée en deux par une poignée que l'on fait glisser. Le visiteur produit lui-même le résultat en tirant le curseur — c'est la démonstration la plus courte qui existe, et elle ne demande aucune lecture.",
      },
      {
        title: "Le prix affiché, prestation par prestation",
        text: "Canapé trois places à 90 €, quatre places à 120 €, cinq places et plus à 145 €. Matelas 70 €, tapis 50 €, bureau 35 € de l'heure. Seule la fin de chantier reste sur devis, parce qu'elle se calcule au mètre carré. Rien n'est « sur demande » sans raison.",
      },
      {
        title: "Un panier de devis, comme une boutique",
        text: "On empile les prestations, on voit le total estimé se mettre à jour, puis on envoie la demande. La mécanique de l'e-commerce appliquée à un service : le client connaît son prix avant le premier appel, et le prestataire reçoit une demande déjà qualifiée.",
      },
      {
        title: "L'angle santé plutôt que l'angle propreté",
        text: "Acariens, bactéries, odeurs. Un canapé propre est un argument de confort ; un canapé sain est un argument qui justifie 90 €. Le titre de la page dit « Prenez soin de votre santé », pas « Nettoyage professionnel ».",
      },
      {
        title: "Les communes écrites, une par une",
        text: "Liège, Ans, Seraing, Herstal, Saint-Nicolas, Grâce-Hollogne, Chaudfontaine, Flémalle, Awans, Esneux. Une intervention à domicile se choisit sur la distance : le visiteur doit lire le nom de sa commune, pas « Liège et environs ».",
      },
      {
        title: "Les avis repris tels quels",
        text: "Y compris celui qui raconte que le prestataire a prévenu, avant d'intervenir, que certaines taches anciennes ne partiraient pas complètement. C'est l'avis le plus utile de la page : il dit qu'ici, on ne promet pas l'impossible.",
      },
    ],
    built: [
      { label: "Configurateur de prestation", text: "Options tarifées — nombre de places, type de véhicule — avec le total qui se recalcule à chaque choix." },
      { label: "Panier de devis", text: "Plusieurs prestations empilées, total estimé, envoi de la demande. Gratuit, sans engagement, réglé après intervention." },
      { label: "Comparateurs avant/après", text: "Curseur glissant sur photo unique, une par prestation." },
      { label: "Grille tarifaire", text: "Six prestations, prix affichés, contenu détaillé de chaque intervention." },
      { label: "Zone d'intervention", text: "Dix communes nommées, plus la mention de la périphérie." },
      { label: "Preuve sociale", text: "Avis Google affichés en clair, avec lien vers la fiche pour les lire à la source." },
      { label: "Guides d'expert", text: "Articles sur l'entretien des textiles et le traitement des taches — utiles, et bons pour le référencement." },
    ],
    facts: [
      { value: "5,0 ★", label: "11 avis Google" },
      { value: "6", label: "prestations tarifées" },
      { value: "10", label: "communes nommées" },
      { value: "7j/7", label: "service continu" },
    ],
    outcome: [
      "Sur « nettoyage canapé waremme », la fiche sort en tête du bloc « Entreprises », devant des sociétés de nettoyage bien plus anciennes. La capture est datée d'août 2026, non recadrée.",
      "Le taux de transformation du panier de devis, lui, appartient au client.",
    ],
    chart: {
      kind: "bars",
      title: "La grille tarifaire, affichée en clair",
      note: "Les prix lisibles sur le site, sans appel ni formulaire préalable. Le nettoyage de bureau se facture 35 € de l'heure et la fin de chantier au mètre carré : ce sont les deux seules lignes qui ne peuvent pas être un prix fixe.",
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
      "Un artisan a déjà tout ce qu'il faut pour faire un site : des photos, des avis, une adresse, un métier. Tout est sur sa fiche Google. Il manque juste quelqu'un pour l'assembler.",
    context: [
      "La plupart des artisans du bâtiment ont une fiche Google complète et aucun site. En face, un devis d'agence tourne entre 2 000 et 5 000 €, avec deux à six mois de délai et le contenu à fournir soi-même.",
      "Lokigen prend le problème par l'autre bout : 39 € par mois, nom de domaine et hébergement compris, et le site est généré puis montré en entier avant qu'un euro ne soit payé.",
    ],
    problem: [
      "Le vrai blocage n'est pas le prix, c'est la matière. Un plombier n'écrira jamais les textes de son site, ne triera pas ses photos de chantier et ne remplira pas un éditeur en glisser-déposer un dimanche soir. Or c'est exactement ce que lui demande un constructeur de sites classique.",
      "Il faut donc produire un site complet — structure, textes, photos, avis, zone, formulaire — sans que l'utilisateur ait une seule ligne à rédiger ni une seule image à téléverser.",
    ],
    decisions: [
      {
        title: "Une seule entrée : le nom de l'entreprise",
        text: "On retrouve la fiche Google, on importe les photos, les avis, les coordonnées et la zone d'intervention. Rien à taper, rien à téléverser, aucune donnée à recopier. L'utilisateur fournit un nom, le produit fait le reste.",
      },
      {
        title: "L'aperçu complet avant le paiement",
        text: "Le site fini, entier, visible gratuitement et sans carte bancaire. C'est la seule façon de vendre à quelqu'un qui s'est déjà fait avoir une fois — et c'est aussi ce qui permet de ne pas argumenter : il regarde et il décide.",
      },
      {
        title: "Des modules activables, pas un éditeur libre",
        text: "Galerie de réalisations, avis Google, bouton WhatsApp, formulaire de devis avec le sélecteur de TVA rénovation belge à 6 % ou 21 %, prise de rendez-vous, zone d'intervention, badges de certification, bouton d'urgence. On active, on n'assemble pas. Moins de choix, un résultat propre à coup sûr.",
      },
      {
        title: "Un prix, écrit une fois",
        text: "39 € par mois tout compris, ou 390 € à l'année. Pas de palier caché, pas de quota qui bloque du jour au lendemain. C'est écrit sur la page de tarif : le prix d'aujourd'hui est celui de l'an prochain.",
      },
      {
        title: "Ne jamais toucher aux avis",
        text: "Aucun avis supprimé, aucun tri arrangeant. Ce sont les vrais clients de l'artisan qui parlent, tels quels. C'est un engagement écrit — et le seul qui compte vraiment, parce qu'un outil qui filtre les avis finit par les fabriquer.",
      },
      {
        title: "Le domaine géré dans le produit",
        text: "Achat et configuration du nom de domaine inclus dans l'abonnement. C'est l'étape technique qui fait abandonner la moitié des inscriptions sur les plateformes concurrentes : ici, elle n'existe pas pour l'utilisateur.",
      },
    ],
    built: [
      { label: "Génération depuis la fiche Google", text: "Import des photos, des avis, des coordonnées et de la zone d'intervention à partir du nom de l'entreprise." },
      { label: "Rédaction assistée", text: "Textes de métier rédigés et photos classées automatiquement, puis validés par l'artisan avant publication." },
      { label: "Aperçu gratuit", text: "Site complet consultable sans carte bancaire, mise en ligne en moins de 24 h après validation." },
      { label: "Bibliothèque de modules", text: "Neuf modules activables d'un clic, dont le formulaire de devis avec TVA rénovation 6 % / 21 %." },
      { label: "Gabarits par métier", text: "Douze métiers du bâtiment couverts, du plombier au terrassier, avec le vocabulaire et les modules qui vont avec." },
      { label: "Abonnement et hébergement", text: "39 €/mois HTVA ou 390 €/an, domaine, hébergement et mises à jour inclus, résiliable en un clic." },
    ],
    facts: [
      { value: "39 €", label: "par mois, tout compris" },
      { value: "3 min", label: "pour générer le site" },
      { value: "24 h", label: "pour être en ligne" },
      { value: "12", label: "métiers du bâtiment couverts" },
    ],
    outcome: [
      "Le produit est en ligne et ouvert aux inscriptions : on peut générer un site complet et le voir en entier sans payer.",
      "Aucun chiffre d'usage affiché pour l'instant. Il y en aura quand il y aura de quoi en montrer un honnête.",
    ],
    chart: {
      kind: "bars",
      title: "Ce que coûte un site, sur trois ans",
      note: "Le devis d'agence est un versement unique, l'abonnement est mensuel : à trois ans, l'abonnement passe encore sous le bas de la fourchette d'agence — et il inclut le domaine, l'hébergement et les mises à jour. C'est l'argument de la page de tarif, remis à plat.",
      items: [
        { label: "Agence — haut de fourchette", value: 5000, display: "5 000 €" },
        { label: "Agence — bas de fourchette", value: 2000, display: "2 000 €" },
        { label: "Lokigen — 3 ans", value: 1404, display: "1 404 €", strong: true },
        { label: "Lokigen — 1 an", value: 468, display: "468 €" },
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
    "Je travaille depuis Hannut, en Hesbaye. La plupart de mes clients sont à moins de vingt minutes — Braives, Hélécine, Waremme — et c'est là que le référencement local paie le plus vite : dans une commune, il reste des requêtes que personne ne dispute.",
  ],
  facts: [
    { lbl: "Basé à", val: "Hannut · Hesbaye liégeoise" },
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
export const AVAILABILITY: string | null = "Une place libre dès maintenant";

export const pad = (n: number) => String(n + 1).padStart(2, "0");
