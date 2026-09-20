# Maison Gilles — plan d'action (brief « grande maison », 14 sept. 2026)

Tri du brief contre l'existant (site statique dans `Site/`, tokens dans `MASTER.md`).
Ce qui est déjà acquis : palette bordeaux / bronze / ivoire / noir chaud, deux polices (Morganite en titrage, Plus Jakarta Sans en corps), échelle φ en variables CSS, condensée réservée aux titres, prix en chiffres tabulaires, `prefers-reduced-motion`, cibles 44 px, lazy loading hors hero, dimensions explicites, menu plein écran, fiche bien, aucun Playfair, aucune urgence.

## 1. Socle invisible (priorité haute)
- [x] Mesurer tous les contrastes texte / fond au calcul WCAG.
      Résultat : bronze #A38560 sur ivoire = 2,66:1 (échec AA, même en grand texte). Bronze sur bordeaux = 5,03, sur noir = 5,28 (OK).
- [x] Ajouter un jeton **Bronze encre** `#6F5536` (5,34:1 sur ivoire, 6,0 sur papier) pour tout texte bronze sur fond clair. `#A38560` reste réservé aux filets et au texte sur bordeaux / noir.
- [x] Remonter les labels de 9,9 px à 12,6 px (`16 / √φ`, demi-pas de l'échelle) : sous 11 px un label n'est plus lisible.
- [x] Positionnement en une phrase, sans « d'exception », « excellence », « prestige ». Retirer « biens d'exception » du site (meta, hero, énoncé).

## 2. Performance (priorité haute)
- [x] Images responsives : AVIF + WebP en `<picture>` / `srcset`, largeurs 640 · 1080 · 1600, hero < 200 KB, contenu < 100 KB (aujourd'hui 165 à 680 KB par image).
- [x] Précharger l'image hero (`<link rel="preload">` + `fetchpriority="high"`), jamais de lazy loading dessus.
- [x] Sous-ensemble Morganite en WOFF2 (3 fichiers TTF = 292 KB aujourd'hui).
- [x] Unifier les photos : même température, même grade chaud-neutre, appliqué en une passe au moment de l'export.

## 3. Identité (priorité haute)
- [x] Décliner le logo en SVG : monogramme, monogramme négatif, logo horizontal, logo empilé, version monochrome ; zone de protection ; taille minimale ; mésusages.
- [x] Nommer la palette (HEX, RGB, CMJN, ratios d'usage 60 / 30 / 10).

## 4. Brand book (priorité moyenne)
- [x] Rédiger le mini brand book en 8 sections (plateforme, logo, couleur, typographie, photographie, éléments graphiques, voix, applications) — page HTML publiée.
- [x] Mockups d'application : carte de visite, papier à lettre, panneau extérieur, couverture du dossier de bien, signature mail, grille Instagram.

## 5. Case study (priorité moyenne)
- [x] Contexte + positionnement, concurrence locale (Rodenburgh, Engel & Völkers Brasschaat).
- [x] Moodboard édité à 9 références (déjà 9 tuiles) présenté comme « inspiration / matières », puis planche de **distillation** moodboard → palette.
- [x] Système d'identité, pages UX (captures accueil, sélection, fiche, mobile), applications, note de méthode.
- [x] Étiquette « projet conceptuel » sur le site et le case study, aucun chiffre de ROI.

## 6. Documentation
- [x] Mettre à jour `MASTER.md` : jetons ajoutés, règles de contraste, lexique interdit.

## Fait en plus
- [x] Correction du hero mobile : la carte de bien poussait la grille au-delà de 390 px (`minmax(0, 1fr)` + `min-width: 0`).
- [x] Titre « verre dépoli » refait en SVG (`clipPath` texte + image) : `background-clip: text` décale le rendu dans Chrome dès que le bloc est positionné.
- [x] Captures headless (Chrome `--headless=new --virtual-time-budget`) pour le case study : `docs/img/`.

## Logo (14 sept., après-midi)
- [x] Premier montage (monogramme EG en perspective + MAISON GILLES en Morganite) rejeté par Gilles : initiales fausses, perspective contre lettres plates, condensée trop « magazine ».
- [x] Planche de quatre pistes typographiques (`docs/pistes-logo.html`), puis planche à partir du tracé à la main « Maison » (`docs/signature-maison.html`).
- [x] Retenu : le tracé « Maison » tel quel. Une flèche dans le M a été essayée puis retirée à la demande de Gilles. Fichiers `Logo/export/maison-script-*.svg`, `m-script-*.svg`, `favicon.svg`.
- [x] Reporté dans le site (coin du hero et de la fiche, menu, pied de page, favicon), le brand book (section 2 et maquettes), le case study (section 4 et méthode), `MASTER.md`.
- [x] La marque s'appelle « Maison », sans autre mot. « Maison Gilles » retiré des titres, textes, coordonnées (domaine et mail fictifs : maison.be). Le nom du fondateur reste dans les contacts.
- [ ] Si Gilles refait « aison » d'un seul geste, remonter le nouveau tracé tel quel (le « s » et le « o » sont un peu hésitants).

## Reste à faire (hors de ce lot)
- [ ] Remplacer les photos de biens : reprises sans autorisation d'annonces JamesEdition (Sotheby's International Realty Belgique, Rodenburgh Immobiliën, Found & Baker, filigrane « FB »), biens réels identifiables. Source légale à choisir (Stocksy, Unsplash sans bien identifiable) avant toute mise en ligne publique.
- [x] Page `#mentions-legales` (statut conceptuel, crédits par agence, retrait sous 48 h, RGPD, polices), lien dans le pied de page, `noindex` ; fausse mention « sous licence » retirée du site, du brand book et du case study.
- [ ] Compléter dans les mentions : adresse postale, e-mail de contact (retrait sous 48 h), hébergeur.
- [ ] Morganite : la licence interdit de modifier les fichiers sans accord écrit de Rajesh Rajput, or le site sert des sous-ensembles WOFF2. Demander l'accord ou servir les fichiers d'origine.
- [ ] Mesurer LCP / INP / CLS sur un hébergement réel (Lighthouse), viser LCP < 2,5 s. Le hero 1600 px AVIF pèse 212 KB, légèrement au-dessus de la cible de 200 KB.
- [ ] Ancrer la crédibilité avec un vrai client, même modeste.

## Livrables
- Site : `Site/` · artifact https://claude.ai/code/artifact/c1531a40-3436-47f7-97a3-f7e74bb409fc
- Brand book : `docs/brand-book.html` · artifact https://claude.ai/code/artifact/2059a4af-f840-4d02-b851-15a5c07560b4
- Case study : `docs/case-study.html` · artifact https://claude.ai/code/artifact/9fd20b14-d2fd-470f-a17b-302a0500d9bc
- Logos : `Logo/export/` (signature `maison-arc-*`, arc `arc-*`, favicon ; les anciens `monogramme-*` et `logo-*` sont obsolètes)
- Pistes logo : https://claude.ai/code/artifact/3b80f056-fc19-4e98-9757-b2176d6e336d · Signature : https://claude.ai/code/artifact/0ef0acd7-ad2f-442c-a618-6c98fe12c869

## Hors périmètre (décisions)
- Grille 8 px : le projet est construit sur φ / Fibonacci (8 · 13 · 21 · 34…). On garde φ, cohérent avec la directive artistique ; 8 et 34 restent multiples de 4 ou proches.
- Dark mode : thème unique clair, choix de la directive.
- Curseur custom, smooth-scroll JS : exclus.
