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

**Le site n'a que deux URLs.** Tout lien de navigation pointe vers une ancre de la home
ou vers `/contact`. Ne pas réintroduire `/services/*`, `/realisations` ou `/equipe/*` :
ces pages ont été supprimées, `sitemap.ts` ne les liste plus.

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
