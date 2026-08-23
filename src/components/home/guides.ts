/**
 * Guides — le contenu éditorial du site, hors études de cas.
 *
 * Même règle que `data.ts` : le texte vit ici, le rendu ailleurs. Et même
 * discipline sur les chiffres — tout nombre cité est soit relevé sur un site
 * livré, soit tiré d'une source datée et nommée dans le texte. Rien n'est
 * arrondi vers le haut, rien n'est inventé pour faire poids.
 *
 * Ces pages visent des requêtes que les études de cas ne peuvent pas viser :
 * un dossier client se positionne sur le nom du client, pas sur la question
 * que se pose quelqu'un qui cherche encore.
 */

export type GuideBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "steps"; items: { title: string; text: string }[] }
  | { kind: "note"; text: string }
  | { kind: "proof"; src: string; w: number; h: number; caption: string };

export type Guide = {
  slug: string;
  /** Titre de la balise `<title>` — la requête, écrite comme elle se tape. */
  title: string;
  /** Titre affiché. Peut être plus vivant que le `title`. */
  h1: string;
  description: string;
  lede: string;
  /** Date de publication, ISO. */
  date: string;
  /** La question à laquelle la page répond — sert de repère à la rédaction. */
  intent: string;
  blocks: GuideBlock[];
  /** Études de cas à mettre en regard, par slug. */
  related: string[];
};

export const GUIDES: Guide[] = [
  /* ======================================================================= */
  {
    slug: "etre-trouve-sur-google-maps",
    title: "Être trouvé sur Google Maps quand on est indépendant à Liège",
    h1: "Être trouvé sur Google Maps quand on travaille près de chez soi",
    description:
      "Comment fonctionne le bloc de trois établissements en haut des résultats Google, et ce qui décide vraiment qui s'y trouve. Avec deux cas liégeois en première position.",
    lede:
      "Le bloc de trois établissements avec la carte, en haut des résultats Google, s'appelle le pack local. Pour un artisan ou un indépendant, il compte souvent plus que tout le reste de la page — et il ne se gagne pas du tout comme le référencement classique.",
    date: "2026-08-23",
    intent: "être premier sur Google Maps / fiche Google Business artisan / référencement local",
    related: ["zen-harmonie", "detail-wave"],
    blocks: [
      {
        kind: "p",
        text:
          "Quand quelqu'un cherche « massage près de chez moi » ou « nettoyage de canapé Waremme », Google affiche d'abord une carte et trois établissements. Ce bloc occupe le premier écran sur mobile. En dessous seulement viennent les liens bleus habituels. Autrement dit : sur une requête locale, la première place organique est déjà la quatrième chose que le visiteur voit.",
      },
      {
        kind: "p",
        text:
          "C'est une bonne nouvelle pour qui débute. Le pack local ne se joue pas sur l'ancienneté du domaine ni sur le nombre de pages du site. Il se joue sur des signaux qu'on peut réunir en quelques semaines — et que la plupart des concurrents négligent parce qu'ils regardent ailleurs.",
      },

      { kind: "h2", text: "Les trois critères, et rien d'autre" },
      {
        kind: "p",
        text:
          "Google documente publiquement les critères du classement local. Ils sont trois, et il n'y a pas de quatrième : la pertinence, la distance, la notoriété. Tout ce qu'on peut lire ailleurs se range dans l'une de ces trois cases.",
      },
      {
        kind: "steps",
        items: [
          {
            title: "La pertinence — est-ce que votre fiche correspond à ce qui est cherché",
            text:
              "C'est la catégorie principale de votre fiche qui pèse le plus lourd : c'est le premier facteur de classement du pack local. Un institut qui se déclare « salon de beauté » ne sortira pas sur « massage », même à cent mètres du chercheur. Viennent ensuite les catégories secondaires, la liste des services, les attributs et la description.",
          },
          {
            title: "La distance — où se trouve la personne qui cherche",
            text:
              "Vous n'avez aucune prise dessus, et c'est le critère le plus mal compris. La proximité ne se contourne pas, mais elle ne décide pas seule : un établissement plus proche avec une fiche vide passe derrière un concurrent un peu plus loin mais complet et bien noté. C'est exactement l'espace où on peut gagner.",
          },
          {
            title: "La notoriété — ce que le reste du web dit de vous",
            text:
              "Les avis, les mentions ailleurs, la qualité du site, les liens locaux. C'est la partie longue à construire, et celle qui fait la différence entre deux fiches par ailleurs identiques.",
          },
        ],
      },

      { kind: "h2", text: "Les avis pèsent plus lourd qu'on ne croit — et leur fraîcheur encore plus" },
      {
        kind: "p",
        text:
          "Les études sectorielles de 2026 situent les avis autour de 17 % des facteurs de classement local. C'est déjà considérable. Mais le changement récent est ailleurs : c'est la fraîcheur qui a bougé.",
      },
      {
        kind: "p",
        text:
          "En 2023, l'ancienneté des avis arrivait en vingtième position des facteurs mesurés par l'enquête Whitespark. Darren Shaw, qui la pilote, la classe désormais dans son top 5. L'ordre de grandeur mesuré : recevoir plus d'un avis par semaine vaut environ 1,7 position de mieux sur la grille de résultats.",
      },
      {
        kind: "note",
        text:
          "Ce que ça implique concrètement : quarante avis vieux de trois ans valent moins que douze avis étalés sur les six derniers mois. Une campagne d'avis ponctuelle produit un pic puis s'éteint. Demander l'avis à chaque fin de chantier, systématiquement, produit un signal continu. C'est un réflexe, pas une opération.",
      },

      { kind: "h2", text: "Ce qu'il faut faire, dans l'ordre" },
      {
        kind: "steps",
        items: [
          {
            title: "Choisir la bonne catégorie principale",
            text:
              "C'est gratuit, ça prend deux minutes, et c'est le premier facteur. Cherchez la catégorie que Google propose pour le mot que vos clients tapent — pas celle qui décrit le mieux votre métier à vos yeux. « Réparateur de smartphones » et « Magasin de téléphonie » ne sortent pas sur les mêmes requêtes.",
          },
          {
            title: "Remplir tout le reste",
            text:
              "Zone desservie, horaires, services listés un par un, description, photos réelles. Une fiche complète devance une fiche vide à distance égale. La plupart de vos concurrents s'arrêtent au nom et au numéro de téléphone.",
          },
          {
            title: "Mettre les mêmes coordonnées partout",
            text:
              "Nom, adresse, téléphone : à l'identique sur la fiche, sur le site, sur les annuaires. Une adresse écrite de trois façons différentes brouille le signal. C'est fastidieux et sans gloire, et ça compte.",
          },
          {
            title: "Installer une habitude d'avis",
            text:
              "Un lien direct vers le formulaire d'avis, envoyé à la fin de chaque prestation. Pas une relance de masse une fois par an.",
          },
          {
            title: "Faire porter au site les mots de la zone",
            text:
              "Le site alimente la pertinence de la fiche. S'il ne nomme jamais les communes que vous desservez, Google n'a pas de quoi relier les deux.",
          },
        ],
      },

      { kind: "h2", text: "Deux exemples, vérifiables" },
      {
        kind: "p",
        text:
          "Zen Harmonie est un cabinet de massage à Hélécine. La requête « massage hélécine » place le cabinet en première position du pack local. Vous pouvez la retaper : elle est censée donner le même résultat depuis n'importe quel navigateur.",
      },
      {
        kind: "proof",
        src: "/home/preuves/zenharmonie-google.png",
        w: 1500,
        h: 970,
        caption: "Google · « massage hélécine » · août 2026",
      },
      {
        kind: "p",
        text:
          "Detail Wave nettoie les canapés et les intérieurs de voiture dans la région de Waremme. Même mécanique, même résultat sur « nettoyage canapé waremme ».",
      },
      {
        kind: "proof",
        src: "/home/preuves/detailwave-google.png",
        w: 1500,
        h: 935,
        caption: "Google · « nettoyage canapé waremme » · août 2026",
      },
      {
        kind: "p",
        text:
          "Dans les deux cas, ce ne sont pas de grosses structures avec un budget publicitaire. Ce sont des indépendants sur des requêtes que personne ne dispute sérieusement, avec une fiche correctement remplie et un site qui parle de leur zone. C'est reproductible.",
      },

      { kind: "h2", text: "Ce que ça ne fait pas" },
      {
        kind: "p",
        text:
          "Le pack local ne vous fera pas sortir sur des requêtes sans intention géographique. Personne ne cherche « massage » sans contexte et n'atterrit chez un cabinet d'Hélécine. Et sur une requête très disputée en centre-ville, la distance reprend le dessus : à Liège même, sur « coiffeur », vous ne battrez pas le salon situé dans la rue du chercheur.",
      },
      {
        kind: "p",
        text:
          "L'intérêt du référencement local n'est pas le volume, c'est la qualification. Cinq personnes par mois qui cherchent précisément votre prestation dans votre commune valent mieux que cinq cents visiteurs qui passaient par là.",
      },
    ],
  },

  /* ======================================================================= */
  {
    slug: "combien-coute-un-site-internet-en-belgique",
    title: "Combien coûte un site internet en Belgique ?",
    h1: "Combien coûte un site internet, et pourquoi personne ne veut vous le dire",
    description:
      "Les fourchettes réelles du marché belge en 2026, ce qui fait varier un devis du simple au quintuple, et les coûts que les devis oublient de mentionner.",
    lede:
      "C'est la première question que tout le monde pose et la dernière à laquelle on répond. Voici les fourchettes du marché belge, ce qui fait vraiment bouger un prix, et les lignes qui n'apparaissent pas sur le devis.",
    date: "2026-08-23",
    intent: "combien coûte un site internet Belgique / prix site vitrine",
    related: ["motodistri", "volt-pro", "zen-harmonie"],
    blocks: [
      {
        kind: "p",
        text:
          "Un site vitrine en Belgique se situe généralement entre 800 et 5 000 € HTVA en 2026. C'est une fourchette du simple au sextuple, ce qui n'aide personne — mais elle est honnête, et l'écart s'explique. Le reste de cette page sert à comprendre où vous tombez dedans.",
      },

      { kind: "h2", text: "Les fourchettes du marché" },
      {
        kind: "ul",
        items: [
          "Site d'une seule page (one-page) chez un indépendant : environ 500 à 1 500 € HTVA.",
          "Site vitrine de cinq à dix pages chez un indépendant : environ 800 à 3 000 € HTVA.",
          "Le même site en agence : plutôt 1 500 à 5 000 € HTVA.",
          "Boutique en ligne, réservation, espace client : au-delà, et surtout très variable selon le catalogue.",
          "Formule à l'abonnement : à partir d'environ 69 €/mois, hébergement et maintenance inclus.",
        ],
      },
      {
        kind: "note",
        text:
          "Sur l'abonnement, une question à poser avant de signer : à qui appartient le site si vous arrêtez de payer ? Dans beaucoup de formules, la réponse est « pas à vous ». Quatre ans à 69 €/mois font 3 312 € — le prix d'un site qu'on possède — sauf qu'au bout des quatre ans, vous n'avez rien à emporter. Ce n'est pas une arnaque, c'est une location : elle a du sens si vous voulez zéro souci et aucun engagement, beaucoup moins si vous comptez rester.",
      },

      { kind: "h2", text: "Ce qui fait vraiment varier le prix" },
      {
        kind: "p",
        text:
          "Le nombre de pages est un mauvais indicateur — c'est pourtant celui sur lequel la plupart des devis sont construits. Quatre choses pèsent bien plus lourd.",
      },

      { kind: "h3", text: "1. Est-ce qu'il faut gérer des données" },
      {
        kind: "p",
        text:
          "Un site qui présente cinq services est un travail de mise en forme. Un site qui doit afficher un catalogue, dire ce qui est en stock et savoir quelle pièce va sur quel modèle est un travail de structure — et l'écart n'est pas de 20 %, il est d'un ordre de grandeur. Pour Motodistri, le catalogue compte plus de soixante mille références, chacune avec sa liste de motos compatibles. Ce n'est pas « plus de pages », c'est un autre métier.",
      },

      { kind: "h3", text: "2. Est-ce que quelqu'un doit pouvoir se connecter" },
      {
        kind: "p",
        text:
          "Réservation en ligne, espace client, paiement, suivi de commande : dès qu'un visiteur a un compte ou paie, il faut gérer les cas où ça se passe mal. Le prix ne vient pas de la fonctionnalité, il vient de tout ce qu'il faut prévoir autour.",
      },

      { kind: "h3", text: "3. Combien de contenu il faut produire" },
      {
        kind: "p",
        text:
          "C'est le poste le plus sous-estimé, des deux côtés. Un site de dix pages dont vous fournissez les textes et les photos coûte nettement moins qu'un site de cinq pages où tout est à écrire et à photographier. Pour Volt-Pro, la couverture des soixante-trois communes desservies représentait un travail de rédaction et de structure à elle seule.",
      },

      { kind: "h3", text: "4. Combien de langues" },
      {
        kind: "p",
        text:
          "Chaque langue supplémentaire, c'est le contenu à traduire, à maintenir, et une version de plus à vérifier à chaque modification. En Belgique la question se pose vite. Motodistri tourne en trois langues.",
      },

      { kind: "h2", text: "Ce que le devis ne dit pas toujours" },
      {
        kind: "ul",
        items: [
          "Le nom de domaine : environ 15 à 20 € HTVA par an. Petit, mais annuel, et c'est à votre nom qu'il doit être enregistré.",
          "L'hébergement : à partir d'environ 96 € HTVA par an. Vérifiez ce qui est inclus — les sauvegardes, notamment.",
          "Les mises à jour de sécurité, si le site tourne sur un système à extensions. Un site laissé sans mise à jour finit par être compromis, ce n'est pas une hypothèse.",
          "Les modifications de contenu après la mise en ligne : incluses, facturées à l'heure, ou impossibles sans le développeur ?",
          "Les licences de thèmes ou d'extensions payantes, souvent annuelles elles aussi.",
        ],
      },
      {
        kind: "note",
        text:
          "Deux questions qui valent tous les comparatifs de devis : « est-ce que je peux modifier mes textes moi-même, et comment ? » et « si je pars, qu'est-ce que j'emporte ? » Les réponses en disent plus long sur la suite de la relation que le prix affiché.",
      },

      { kind: "h2", text: "Quel budget pour quel objectif" },
      {
        kind: "p",
        text:
          "Une manière plus utile de poser la question : qu'est-ce que le site doit faire gagner ? S'il doit remplacer une demi-journée de téléphone par semaine, il se paie en quelques mois quel que soit son prix. S'il est là parce qu'« il faut bien avoir un site », n'importe quel montant sera trop cher.",
      },
      {
        kind: "p",
        text:
          "Le pire achat n'est pas le site trop cher, c'est le site à 500 € que personne ne trouve et que vous ne pouvez pas modifier. Il ne coûte pas 500 € : il coûte 500 € plus le budget du site qu'il faudra refaire.",
      },
    ],
  },

  /* ======================================================================= */
  {
    slug: "wix-wordpress-ou-sur-mesure",
    title: "Wix, WordPress ou sur mesure : comment choisir",
    h1: "Wix, WordPress ou sur mesure",
    description:
      "Les trois façons de faire un site, ce que chacune coûte réellement sur quatre ans, et les questions à se poser avant de trancher. Sans discours de vendeur.",
    lede:
      "Trois familles de solutions, trois logiques différentes. Aucune n'est bonne dans l'absolu, et celui qui vous dit le contraire vend l'une des trois. Voici les critères qui décident réellement.",
    date: "2026-08-23",
    intent: "alternative à Wix / site internet sans abonnement / WordPress ou sur mesure",
    related: ["azimut-games", "lokigen"],
    blocks: [
      {
        kind: "p",
        text:
          "Je construis des sites sur mesure. Autant le dire tout de suite : je ne suis pas neutre. Mais je décline régulièrement des projets qui n'en ont pas besoin, et cette page explique comment je fais la différence — vous pourrez l'appliquer sans moi.",
      },

      { kind: "h2", text: "Les constructeurs en ligne : Wix, Squarespace, Webflow" },
      {
        kind: "p",
        text:
          "On assemble un site dans le navigateur, à partir de blocs. L'hébergement, la sécurité et les mises à jour sont compris. Aucune compétence technique requise pour démarrer.",
      },
      {
        kind: "ul",
        items: [
          "Pour : en ligne en quelques jours, coût de départ faible, rien à maintenir.",
          "Contre : abonnement à vie, personnalisation limitée par ce que l'outil prévoit, et surtout — le site n'est pas exportable. Vous ne pouvez pas le déménager.",
          "Le bon cas : valider une activité qui démarre, ou une présence simple qui n'évoluera pas.",
        ],
      },
      {
        kind: "note",
        text:
          "Le calcul que peu de gens font : un abonnement à 30 €/mois représente 1 440 € sur quatre ans, sans rien qui vous appartienne au bout. Ce n'est pas un argument contre — c'est un argument pour faire le calcul avant, pas après.",
      },

      { kind: "h2", text: "WordPress" },
      {
        kind: "p",
        text:
          "Un socle libre, installé chez l'hébergeur de votre choix, étendu par des extensions. C'est ce qui fait tourner une très large part du web, et l'immense majorité des sites d'indépendants en Belgique.",
      },
      {
        kind: "ul",
        items: [
          "Pour : vous possédez le site, vous pouvez changer de prestataire, et il existe une extension pour à peu près tout.",
          "Contre : les mises à jour sont votre responsabilité. Un site laissé six mois sans mise à jour finit par être compromis — c'est une question de délai, pas de chance. Et les extensions s'accumulent, se contredisent et alourdissent la page.",
          "Le bon cas : un besoin standard, un budget mesuré, et quelqu'un — vous ou un prestataire — qui assure l'entretien.",
        ],
      },

      { kind: "h2", text: "Le sur mesure" },
      {
        kind: "p",
        text:
          "Le site est écrit pour votre cas. Il ne contient que ce dont vous avez besoin, et il fait exactement ce que vous avez demandé.",
      },
      {
        kind: "ul",
        items: [
          "Pour : rapide parce qu'il ne transporte rien d'inutile, sans surface d'attaque liée aux extensions, et sans limite fonctionnelle a priori.",
          "Contre : plus cher au départ, plus long, et vous dépendez de quelqu'un qui sait lire le code — vous, ou celui qui l'a écrit.",
          "Le bon cas : une logique métier qui n'existe pas en extension, un catalogue ou un volume que les solutions standards gèrent mal, ou une exigence de performance réelle.",
        ],
      },

      { kind: "h2", text: "Les questions qui décident, dans l'ordre" },
      {
        kind: "steps",
        items: [
          {
            title: "Votre besoin existe-t-il déjà en extension ?",
            text:
              "Une prise de rendez-vous simple, un formulaire de contact, un blog : c'est du standard, et le payer sur mesure est de l'argent jeté. Une compatibilité pièce-par-modèle sur soixante mille références : aucune extension ne le fera correctement.",
          },
          {
            title: "Combien de temps comptez-vous garder ce site ?",
            text:
              "Sous deux ans, l'abonnement est souvent le meilleur calcul. Au-delà de quatre ans, la propriété devient l'argument décisif.",
          },
          {
            title: "Qui va le modifier, et à quelle fréquence ?",
            text:
              "Si vous changez vos textes toutes les semaines, il vous faut une interface d'édition, quelle que soit la technologie. Si le contenu ne bouge pas trois fois par an, c'est un faux problème et ça ne doit pas peser dans le choix.",
          },
          {
            title: "Que se passe-t-il si le prestataire disparaît ?",
            text:
              "Question la plus désagréable et la plus utile. Elle a une réponse concrète : à qui appartient le nom de domaine, où sont les accès à l'hébergement, et le code est-il lisible par quelqu'un d'autre ? Si les trois réponses sont floues, le prix n'a pas d'importance.",
          },
        ],
      },

      { kind: "h2", text: "Ce que je réponds quand on me pose la question" },
      {
        kind: "p",
        text:
          "Si votre besoin est standard, votre budget serré et l'échéance courte : prenez WordPress chez quelqu'un de sérieux, ou un constructeur en ligne si vous voulez zéro entretien. Vous n'avez pas besoin de moi, et je vous le dirai.",
      },
      {
        kind: "p",
        text:
          "Le sur mesure se justifie quand quelque chose dans votre activité ne rentre pas dans les cases : un catalogue particulier, une manière de vendre qui vous est propre, une exigence de vitesse qui a des conséquences commerciales. Là, le surcoût de départ s'amortit — et pas en confort, en résultat.",
      },
    ],
  },
];

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
