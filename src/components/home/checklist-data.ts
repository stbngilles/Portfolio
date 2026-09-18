/**
 * La checklist des 27 points, `/ressources/checklist-site-internet`
 * (voir `ressources.ts`).
 *
 * Aimant à contacts : le lien part de la description d'une vidéo YouTube, la
 * liste part par e-mail contre un prénom, un nom, une adresse et
 * l'inscription à la newsletter. Lu côté serveur seulement : la page et
 * l'e-mail le passent au composant, il n'est pas dans le JavaScript public.
 *
 * Tutoiement, comme dans la vidéo : c'est la seule page du site qui tutoie,
 * et elle doit le faire d'un bout à l'autre.
 *
 * Le numéro de chaque point est sa position : ne pas réordonner sans
 * vérifier que la vidéo ne cite pas «\u00a0le point 12\u00a0».
 */

export type ChecklistItem = { title: string; why: string; test: string };

export type ChecklistSection = {
  title: string;
  intro?: string;
  items: ChecklistItem[];
};

export const CHECKLIST: ChecklistSection[] = [
  {
    title: "Première impression",
    intro:
      "Ce que quelqu'un voit dans les 5 premières secondes, sans scroller. C'est là que tu perds ou que tu gardes la plupart des visiteurs.",
    items: [
      {
        title: "La première phrase visible dit ce que tu fais, pour qui, et où",
        why: "Quelqu'un qui arrive de Google a tapé un besoin précis. S'il ne retrouve pas ce besoin dans ta première phrase, il pense qu'il s'est trompé de site.",
        test: "Montre ton accueil 5 secondes à quelqu'un qui ne connaît pas ta boîte. Il doit pouvoir dire ton métier et ta zone.",
      },
      {
        title: "Le titre de l'onglet contient ton métier et ta ville, pas «\u00a0Accueil\u00a0»",
        why: "C'est ce que Google affiche en gros dans ses résultats. «\u00a0Accueil - Lambert SPRL\u00a0» ne donne aucune raison de cliquer.",
        test: "Regarde l'onglet de ton navigateur. Il devrait ressembler à «\u00a0Chauffagiste à Namur | Lambert & Fils\u00a0».",
      },
      {
        title: "Ton bouton principal est visible sans scroller",
        why: "Une bonne partie des visiteurs ne descendent jamais. Si le bouton est plus bas, ils ne le verront pas.",
        test: "Ouvre le site, ne touche à rien. Le bouton «\u00a0Demander un devis\u00a0» (ou équivalent) est-il à l'écran ?",
      },
      {
        title: "Il n'y a pas de carrousel d'images qui défile tout seul",
        why: "Les gens ne lisent pas ce qui bouge. Le message de la deuxième slide, personne ne le voit. Et ça ralentit le site.",
        test: "Si les images du haut changent toutes seules, ce point n'est pas coché.",
      },
      {
        title: "Aucune phrase creuse en haut de page",
        why: "«\u00a0Bienvenue\u00a0», «\u00a0votre partenaire de confiance\u00a0», «\u00a0la qualité au service de vos projets\u00a0» : tes concurrents ont exactement la même. Elles ne disent rien à personne.",
        test: "Ta phrase d'accroche fonctionnerait-elle aussi pour un comptable ou un traiteur ? Si oui, elle est trop vague.",
      },
    ],
  },
  {
    title: "Passer à l'action",
    intro: "Le visiteur est intéressé. Est-ce qu'il sait quoi faire, et est-ce que c'est facile ?",
    items: [
      {
        title: "Tu as décidé d'une seule action principale",
        why: "Appeler, demander un devis, réserver un créneau. Une seule. Quand il y a six boutons de la même taille, les gens n'en cliquent aucun.",
        test: "Compte les boutons différents sur ton premier écran. Plus de deux, c'est trop.",
      },
      {
        title: "Ce bouton revient après chaque section",
        why: "Quelqu'un se décide au milieu de la page, pas forcément en haut. Il ne doit pas avoir à remonter pour te contacter.",
        test: "Scrolle toute la page. Le bouton doit apparaître au moins tous les deux écrans.",
      },
      {
        title: "Le bouton dit ce qui va se passer",
        why: "«\u00a0En savoir plus\u00a0» et «\u00a0Cliquez ici\u00a0» ne rassurent pas. «\u00a0Demander un devis gratuit\u00a0» ou «\u00a0Être rappelé aujourd'hui\u00a0», oui.",
        test: "Lis le texte de ton bouton principal. Sait-on ce qui arrive après le clic ?",
      },
      {
        title: "Ton numéro de téléphone est cliquable sur mobile",
        why: "Sur téléphone, un numéro non cliquable oblige à le recopier à la main. Beaucoup abandonnent à cette étape.",
        test: "Depuis ton téléphone, tape sur le numéro. Ça doit lancer l'appel.",
      },
    ],
  },
  {
    title: "Le contenu",
    intro: "Ce que tu racontes, et à qui tu le racontes.",
    items: [
      {
        title: "L'accueil parle du problème du client, pas de ton histoire",
        why: "Ton client a une chaudière en panne ou une salle de bains à refaire. Il ne se demande pas depuis quand tu existes, il se demande si tu vas régler son problème.",
        test: "Compte les «\u00a0nous / notre / nos\u00a0» et les «\u00a0vous / votre\u00a0» sur ton accueil. Il devrait y avoir plus de «\u00a0vous\u00a0».",
      },
      {
        title: "Chaque service a sa propre page",
        why: "Google fait remonter une page par recherche. «\u00a0Installation pompe à chaleur\u00a0» et «\u00a0débouchage canalisation\u00a0» sont deux recherches, donc deux pages. Une seule page «\u00a0Nos services\u00a0» ne sort sur aucune des deux.",
        test: "As-tu une page dédiée pour chacun de tes 3 à 5 services principaux ?",
      },
      {
        title: "Tu donnes une idée de tes prix",
        why: "«\u00a0Sur devis\u00a0» partout fait peur. Une fourchette, un «\u00a0à partir de\u00a0», un exemple chiffré : ça filtre les mauvais clients et ça rassure les bons.",
        test: "Peut-on trouver un chiffre en euros quelque part sur ton site ?",
      },
      {
        title: "Ta zone d'intervention est écrite clairement",
        why: "Si quelqu'un doit deviner si tu te déplaces chez lui, il appelle un concurrent qui l'a écrit.",
        test: "Ta ville et ton rayon (ou la liste des communes) sont-ils visibles sur l'accueil ?",
      },
      {
        title: "Il n'y a pas de section «\u00a0Nos valeurs\u00a0»",
        why: "Rigueur, écoute, qualité, passion : tout le monde les affiche. Ça n'a jamais fait signer personne. Remplace par des faits : délai d'intervention, garantie, nombre de chantiers.",
        test: "Chaque affirmation sur toi est-elle accompagnée d'un chiffre ou d'un fait vérifiable ?",
      },
    ],
  },
  {
    title: "La preuve",
    intro: "Ce qui montre que tu es bon, sans que tu aies à le dire toi-même.",
    items: [
      {
        title: "Au moins 3 avis clients réels sont visibles sur l'accueil",
        why: "Un inconnu qui dit «\u00a0il est venu le jour même, prix correct\u00a0» vaut plus que tout ce que tu peux écrire. Les avis doivent être sur le site, pas derrière un lien «\u00a0voir nos avis\u00a0».",
        test: "Les avis apparaissent-ils avec un prénom, une note et un texte, directement sur l'accueil ?",
      },
      {
        title: "Toutes les photos sont de vraies photos de toi et de ton travail",
        why: "Les photos de banque d'images (l'ouvrier souriant, la poignée de main en costume) sonnent faux, même pour quelqu'un qui ne saurait pas dire pourquoi. Tes photos au téléphone, même imparfaites, prouvent que tu existes.",
        test: "Pour chaque photo, peux-tu dire où et quand elle a été prise ? Sinon, elle dégage.",
      },
      {
        title: "Tes réalisations ont du contexte",
        why: "Une photo de chantier seule ne dit rien. «\u00a0Remplacement d'une chaudière mazout par une pompe à chaleur, maison 4 façades à Wavre, 3 jours\u00a0» dit tout.",
        test: "Chaque réalisation indique-t-elle au moins le lieu, le type de travaux et la durée ?",
      },
      {
        title: "Tes éléments de réassurance sont concrets",
        why: "Assurance, agrément, certification, garantie, années d'activité, nombre de clients. Des choses vérifiables, pas des adjectifs.",
        test: "Ton site affiche-t-il au moins deux éléments de ce type, avec le chiffre ou le nom exact ?",
      },
    ],
  },
  {
    title: "Téléphone et vitesse",
    intro:
      "La majorité de tes visiteurs sont sur téléphone, souvent en 4G. Teste tout ce qui suit sur un vrai téléphone, wifi coupé.",
    items: [
      {
        title: "Le site s'affiche en moins de 3 secondes en 4G",
        why: "Chaque seconde d'attente fait partir des gens. Les images trop lourdes sont la cause numéro un.",
        test: "Coupe le wifi, ouvre ton site, compte. Pour un avis précis, tape ton adresse sur pagespeed.web.dev.",
      },
      {
        title: "Le texte se lit sans zoomer",
        why: "Si on doit pincer pour lire, on ne lit pas.",
        test: "Tiens ton téléphone à bout de bras. Le texte courant est-il lisible ?",
      },
      {
        title: "Les boutons se cliquent avec le pouce, sans se tromper",
        why: "Un bouton trop petit ou collé à un autre, c'est un clic raté et un visiteur agacé.",
        test: "Essaie de cliquer chaque bouton principal avec le pouce, d'une main. Tu dois réussir du premier coup.",
      },
      {
        title: "Le menu mobile s'ouvre, se ferme, et a 6 entrées maximum",
        why: "Douze entrées de menu sur un téléphone, personne ne les lit. Et un menu qui reste bloqué ouvert cache la page.",
        test: "Ouvre et ferme le menu trois fois. Compte les entrées.",
      },
    ],
  },
  {
    title: "Être trouvé sur Google",
    intro: "Un site parfait que personne ne trouve ne sert à rien. Les bases, sans entrer dans la technique.",
    items: [
      {
        title: "Ta fiche Google Business est complète et renvoie vers ton site",
        why: "Pour un métier local, c'est la fiche qui apparaît en premier, avant ton site. Photos, horaires, catégorie exacte, avis récents.",
        test: "Tape ton nom sur Google. La fiche à droite est-elle à jour et cliquable vers ton site ?",
      },
      {
        title: "Le site est en https, avec le cadenas",
        why: "Sans ça, Chrome affiche «\u00a0Non sécurisé\u00a0» à côté de ton nom. Ça tue la confiance et Google te pénalise.",
        test: "Regarde à gauche de ton adresse dans le navigateur. Cadenas ou avertissement ?",
      },
      {
        title: "Chaque page a son propre titre et sa propre description",
        why: "Google lit ces deux lignes pour décider sur quelle recherche afficher chaque page. Si elles sont identiques partout, il ne sait pas quoi faire de ton site.",
        test: "Tape «\u00a0site:tonsite.be\u00a0» sur Google. Les titres des résultats doivent être tous différents.",
      },
      {
        title: "Nom, adresse, téléphone et horaires sont identiques partout",
        why: "Site, fiche Google, Facebook, annuaires. La moindre différence (un ancien numéro, une abréviation) embrouille Google et les clients.",
        test: "Compare les quatre infos sur ton site et ta fiche Google, caractère par caractère.",
      },
    ],
  },
  {
    title: "Le contact",
    items: [
      {
        title: "Ton formulaire a 4 champs maximum et tu as vérifié que tu reçois les messages",
        why: "Nom, téléphone, message, c'est assez. Chaque champ en plus fait perdre des demandes. Et beaucoup de formulaires envoient dans le vide sans que personne le sache.",
        test: "Envoie-toi un message depuis ton propre formulaire, maintenant. Est-il arrivé ? En combien de temps ?",
      },
    ],
  },
];

export type ScoreBand = { min: number; label: string; text: string };

/** Du meilleur au pire. `min` inclus. */
export const SCORE_BANDS: readonly ScoreBand[] = [
  {
    min: 22,
    label: "22 à 27",
    text: "Ton site est devant la grande majorité des sites de PME. Corrige les derniers points et occupe-toi du trafic.",
  },
  {
    min: 15,
    label: "15 à 21",
    text: "La base est là mais tu perds des clients à plusieurs endroits. Commence par les sections «\u00a0Première impression\u00a0» et «\u00a0Passer à l'action\u00a0», c'est là que ça se joue.",
  },
  {
    min: 8,
    label: "8 à 14",
    text: "Ton site fait office de carte de visite, pas plus. Il ne te ramènera rien tant que ces points ne sont pas réglés, peu importe le trafic.",
  },
  {
    min: 0,
    label: "0 à 7",
    text: "Une refonte coûtera moins cher que des rustines. Le site actuel te fait probablement perdre des clients qui arrivent dessus.",
  },
];
