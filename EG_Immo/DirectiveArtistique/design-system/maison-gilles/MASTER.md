# Maison — Design System (MASTER)

Source de vérité : `Design.pdf` (Directive artistique V3 · 2026). Ce fichier en est la traduction web.
Les fichiers `pages/*.md` peuvent surcharger ces règles pour une page précise.

## Positionnement
Maison cherche, pour quelques acheteurs par an, la maison rare, partout en Belgique : trois à cinq biens par recherche, un seul interlocuteur du premier entretien aux clés.
En une phrase : le chasseur discret, en Belgique.
Personnalité : exclusive, sensorielle, calme, contemporaine. Aucune urgence, jamais.

## Palette
| Jeton | Hex | Usage |
|---|---|---|
| `--ivoire` | #E8E1D5 | Fond, pages entières. Domine (60–65 %). |
| `--papier` | #F5F1EA | Surfaces posées sur l'ivoire (cartes, panneau hero, formulaire). |
| `--noir` | #1A1412 | Texte courant, menu plein écran. Remplace le noir pur partout. |
| `--bordeaux` | #390517 | Signature : titres, boutons, une seule page forte (7–10 %). |
| `--bronze` | #A38560 | Filets 1 px, texte sur bordeaux ou noir chaud (5,0 et 5,3:1). Jamais un fond, jamais du texte sur ivoire (2,66:1). |
| `--bronze-encre` | #6F5536 | Le bronze quand il est du texte sur fond clair : labels, lieux, chiffres, le mot souligné (5,34:1 sur ivoire, 6,0 sur papier). |
| `--gris` | #E0E0E0 | Rendu froid, placeholders d'images. |

Thème unique (clair). Pas de dark mode : un seul neutre clair par support.

Noms et valeurs print : Ivoire (232 225 213 · C0 M3 J8 N9) · Papier (243 238 230 · C0 M2 J5 N5) · Noir chaud (26 20 18 · C0 M23 J31 N90) · Bordeaux (57 5 23 · C0 M91 J60 N78) · Bronze (163 133 96 · C0 M18 J41 N36) · Bronze encre (111 85 54 · C0 M23 J51 N56). Pantone approchants : Bordeaux 4975 C, Bronze 4655 C, Ivoire 7527 C.
Ratios d'usage : ivoire + papier 60–65 %, noir chaud 25 % (texte, menu), bordeaux 7–10 %, bronze 3–5 %.

Contrastes mesurés (WCAG) : noir sur ivoire 14,0 · bordeaux sur ivoire 13,4 · ivoire sur bordeaux 13,4 · encre douce (noir 66 %) sur ivoire 5,2 · bronze encre sur ivoire 5,3 · bronze sur bordeaux 5,0 · bronze sur noir 5,3 · bordeaux sur noir 1,05 (aplats décoratifs seulement, jamais de texte).

## Typographie
- **Morganite** (locale, `fonts/`) : Bold pour titres et display, Medium pour accroches et chiffres, Light en contrepoint. Toujours en capitales, jamais en paragraphe.
- **Plus Jakarta Sans** (Google Fonts) : Light pour le corps, Regular pour les liens et valeurs, Medium pour labels et noms.
- Échelle φ depuis 16 px : `--t-0` 12,6 (16 / √φ, demi-pas, minimum lisible pour un label) · `--t-1` 16 · `--t-2` 26 · `--t-3` 42 · `--t-4` 68 · `--t-5` 110 · `--t-6` 178.
- Interlignage corps 1.618. Titres Morganite 0.9. Labels : capitales, interlettrage 0.24em. Corps jamais sous 16 px, en rem. Chiffres tabulaires sur prix, surfaces et distances. Longueur de ligne 34 em maximum (≈ 60–66 caractères).
- Fichiers : Morganite en WOFF2 sous-ensemble Latin (10 KB par graisse, TTF en repli), Plus Jakarta Sans via Google Fonts. Deux familles, pas une de plus.

## Espacements (Fibonacci ≈ φ)
`--s-1` 8 · `--s-2` 13 · `--s-3` 21 · `--s-4` 34 · `--s-5` 55 · `--s-6` 89 · `--s-7` 144 · `--s-8` 233.
Rayons : 2 / 3 / 5 (lignes architecturales, jamais de « carte » arrondie). Gouttière : 34 (desktop), 21 (tablette), 8 + 13 (mobile).

## Mise en page
- Partage 38,2 / 61,8 : hero (panneau ivoire / photo), colonne label / texte, fiche bien (galerie / carte), contact.
- Grille de sélection : colonnes 38,2 / 23,6 / 38,2. Les visuels larges sont des rectangles d'or (1.618).
- Le titre du hero traverse la couture ivoire / photo et s'inverse (deux couches, `clip-path`).
- Navigation : liste verticale en bas à gauche du hero, menu plein écran noir chaud (bouton en haut à droite).
- Filets : 1 px bronze à 45 %. Boutons : fond transparent, bordure bordeaux 1 px, capitales espacées 12 px, remplissage bordeaux au survol.
- Matière : une par page. Fossile teinté bordeaux sur l'accueil (section Note), pierre teintée noir chaud sur la fiche bien (Pourquoi ce bien). Grain papier global à 4,5 %.
- Fiche bien : hero 61,8 vh, galerie 61,8 / fiche collante 38,2, puis sections label 38,2 / contenu 61,8 : Description, Caractéristiques, Pourquoi ce bien, Situation, Votre conseiller, Autres biens.

## Images
- Sources : `Site/img/*.webp` (maîtres), exports responsives dans `Site/img/r/` : AVIF + WebP en 640 / 1080 / 1600, servis en `<picture>` + `srcset` + `sizes`. Script : grade chaud-neutre unique (balance des blancs gray-world à 40 %, hautes lumières dorées, saturation −7 %) appliqué à toutes les photos de biens, jamais aux matières.
- Cibles de poids : hero ≤ 200 KB, image de contenu ≤ 120 KB à 1080 px. Hero préchargée (`<link rel="preload" imagesrcset>` + `fetchpriority="high"`), jamais lazy. Tout le reste en `loading="lazy"`. `width` / `height` explicites partout.
- Les photos de biens actuelles ne sont PAS sous licence : reprises d'annonces JamesEdition (Sotheby's International Realty Belgique, Rodenburgh Immobiliën ×2, Found & Baker avec filigrane « FB »), photographes non identifiés, aucune autorisation. Crédits et procédure de retrait dans la page `#mentions-legales`, site en `noindex`. Ne jamais retirer ni masquer un filigrane. À remplacer par des images réellement sous licence avant toute mise en ligne publique ou commerciale.

## Logo
- Une signature à la main : « Maison », tracé par le fondateur (`Logo/Maison-script-original.svg`), sans retouche (bouts ronds, bordeaux). La marque s'appelle « Maison », sans autre mot ; le nom du fondateur reste dans les coordonnées.
- Fichiers `Logo/export/` : `maison-script-{bordeaux,ivoire,noir}.svg`, `maison-script-fort-bordeaux.svg` (trait 3, panneau et gaufrage), `m-script-{bordeaux,ivoire,noir}.svg` (le M seul : favicon et avatar seulement, la signature entière partout ailleurs), `favicon.svg`.
- Trait : 2 sur 100 de hauteur (2,2 dans le site), bouts et jonctions ronds, `fill: none`. Dans le HTML le trait est porté par l'élément `svg.trait` / `svg.arc`, jamais par un sélecteur `path` (les `<use>` n'en héritent pas).
- Zone de protection : la hauteur du « a » sur les quatre côtés. Tailles minimales : M seul 16 px / 6 mm, signature 90 px / 22 mm.
- Mésusages : étirer, recolorer hors palette, ombre, remplir les boucles, ajouter un signe (une flèche dans le M a été essayée et retirée), poser Morganite à côté.
- Abandonné le 14 sept. 2026 : le monogramme EG en perspective + wordmark Morganite (initiales fausses, perspective contre lettres plates, condensée trop « magazine »).

## Mouvement
Subtil. Entrée du hero 900 ms, survol des images ×1.03 en 618 ms, `prefers-reduced-motion` respecté. Aucun défilement automatique.

## Ton
Phrases courtes. Aucune formule « pas X mais Y », aucun bandeau « exclusivité », aucun compte à rebours. On retire plutôt qu'on ajoute.

## Lexique
- Bannis : « d'exception », « excellence », « prestige », « exclusif » en accroche, « luxe », « unique », « ne manquez pas », « contactez vite ».
- Préférés : rare, juste, précis, calme, hors marché, entretien, un seul interlocuteur, matières, lieux, surfaces, distances.

## Étiquette
Projet conceptuel. Le pied de page du site et le case study le disent : « Projet conceptuel, non affilié à une agence réelle. Photographies reprises d'annonces publiques, droits réservés à leurs auteurs. » Ne jamais écrire « sous licence » tant que les photos n'ont pas été remplacées. Aucun chiffre de résultat n'est avancé.

## À ne pas faire
1. Morganite en paragraphe. 2. Bronze en fond. 3. Bronze #A38560 en texte sur ivoire (utiliser Bronze encre). 4. Texture sur chaque support. 5. Noir pur #000000. 6. Codes de l'immobilier classique (pictogrammes, photos saturées). 7. Urgence. 8. Superlatifs du lexique banni.
