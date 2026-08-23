# Pixelbrute — Instructions Claude Code

## Deux applications dans un seul repo

1. **Le site public** — deux pages, et deux seulement : la home (`/`) et le contact (`/contact`),
   dans le groupe `(home)`. Direction artistique « Klein & Craie », autonome.
2. **La plateforme** — `/app/*` : espaces admin, client, dev, commercial, comptable.
   Auth Better-Auth, paiements Stripe, base PostgreSQL via Prisma.

Les deux ne partagent que le layout racine (`src/app/layout.tsx` : polices, GA, JSON-LD).
Rien d'autre. Une modification de la home ne peut pas casser la plateforme, et l'inverse.

## Stack
- Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- Déploiement : **Vercel**, full-stack (`next build`). Pas d'export statique.
  `out/` et `deploy/` sont des reliquats de l'ancien site — ils ne bougent plus.
- Animations du site public : GSAP 3.15 + ScrollTrigger, smooth scroll Lenis
- Formulaire de contact : Formspree (pas de route API)
- Fonts : Archivo (`--font-archivo`, la home), DM Sans (`--font-geist`),
  Instrument Serif (`--font-instrument-serif`), JetBrains Mono
- Base : Prisma + PostgreSQL (Neon), adaptateur `@prisma/adapter-pg`

## Après modification

```bash
npm run build
```

Le script enchaîne `patch-kysely` → `prisma generate` → `prisma db push` → `next build`.
Sans `DATABASE_URL` en local, lancer `npx next build` seul suffit à valider le compilateur.

## Site public (`src/components/home/`)

Une seule feuille de style : `src/app/(home)/home.css`, tout scopé sous `.pb`.
`globals.css` (thème Tailwind) ne sert plus qu'à la plateforme.

Sections de la home, dans l'ordre : `Hero` (#top) → `Marquee` → `SelectedWork` (#projets)
→ `Manifesto` → `Expertise` (#expertises) → `Principles` (#principes) → `Quotes`
→ `Studio` (#studio) → `FinalCta`, avec `Header` et `SiteFooter` autour.
Contact : `ContactWays` → `BriefForm` → `Faq`.

Le mouvement est piloté par `Motion.tsx` (Lenis + ScrollTrigger), monté une fois
dans `(home)/layout.tsx`. Les composants n'initialisent pas leur propre smooth scroll.

**Les URLs du site public, et elles seules** : `/`, `/contact`, `/projets`,
`/projets/[slug]`, `/guides`, `/guides/[slug]`, `/creation-site-internet-hesbaye`,
`/mentions-legales`, `/confidentialite`, plus `/llms.txt`.
Ne pas réintroduire `/services/*`, `/realisations` ou `/equipe/*` : supprimées, et
redirigées en 301 dans `next.config.ts`. Toute page ajoutée doit entrer dans
`sitemap.ts` — sinon elle n'existe pour aucun moteur.

## Référencement — Google *et* Bing

Bing est un objectif explicite, au même niveau que Google. Il découvre beaucoup plus
lentement un domaine neuf et peu lié, et sanctionne plus durement les pages minces
indexées sur le domaine : les leviers qui lui sont propres se traitent à part.

**IndexNow** — le protocole de push de Bing (et Yandex, Seznam, Naver). La clé est
publique par construction : Bing vérifie la propriété en lisant `<clé>.txt` à la racine.

```bash
npm run seo:indexnow            # toutes les URLs du sitemap en ligne
npm run seo:indexnow -- /guides # une page précise
```

À lancer **après chaque déploiement**, jamais dans `build` : au moment du build, la
nouvelle version n'est pas encore servie, et Bing viendrait crawler l'ancienne.

**Bing Webmaster Tools** — la variable d'env `BING_MSVALIDATE_01` attend la balise
`msvalidate.01`, celle de l'écran *Vérification de propriété*. Ce n'est **pas** la clé
d'API (*Paramètres > Accès API*), qui est un secret : la placer là la publierait dans
le HTML de chaque page. Si la variable est vide, aucune balise n'est rendue — une
balise au contenu vide ferait échouer la vérification.

**Hors index** : `/app/*` et `/api/*`, par `robots.ts` *et* par le `noindex` du layout
plateforme. Le robots seul ne suffit pas — une URL liée depuis l'extérieur peut être
indexée sans être crawlée.

**L'hôte canonique est l'apex `https://pixelbrute.be`** — `www` redirige vers lui,
jamais l'inverse. La constante `SITE_URL` est répétée dans `layout.tsx`, `sitemap.ts`,
`robots.ts`, les `generateMetadata` et `scripts/indexnow.mjs` : les cinq déclarent
l'apex, et doivent continuer à le faire. Un canonique qui redirige coûte peu à
Google, mais casse IndexNow, dont le `host` et la `keyLocation` doivent répondre
200 sans redirection.

## Plateforme (`src/app/app/`)

Chrome propre dans `src/app/app/layout.tsx`, composants dans `src/components/platform/`,
logique métier dans `src/lib/`. Le rôle effectif (impersonation comprise) vient de
`getEffectiveSession()` dans `src/lib/auth-guard.ts`.

## Design system (plateforme)

Classes utilitaires de `globals.css` : `.wrap`, `.section`, `.section-head`, `.serif`,
`.serif-i`, `.display`, `.mono`, `.overline`, `.btn`, `.btn-primary`, `.btn-ghost`,
`.btn-accent`, `.reveal`, `.card`, `.glass-card`

Couleurs :
- `--color-bg` : #F2F1EE (fond craie)
- `--color-ink` : #0F0F14 (texte principal)
- `--color-accent` : #1F3FBF (bleu Klein)
- `--color-paper` : #FAF9F5 (blanc chaud)
