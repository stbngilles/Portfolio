# Pixelbrute — Instructions Claude Code

## Stack
- Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- Export statique : `output: "export"` dans `next.config.ts`
- Animations : GSAP 3.15 + @gsap/react (ScrollTrigger), Framer Motion (Hero uniquement)
- Fonts : DM Sans (`--font-geist`), Instrument Serif (`--font-instrument-serif`), JetBrains Mono
- Palette : Klein & Craie — voir `src/app/globals.css` (@theme)

## Règle absolue : toujours rebuilder après chaque modification

Le site se déploie depuis le dossier `out/` (export statique).
**Après toute modification de code, lancer systématiquement :**

```bash
npm run build
```

Le `out/` est le seul dossier qui compte pour la mise en ligne. Sans rebuild, les changements n'existent pas en production.

## Architecture composants (`src/components/`)

Tous les composants utilisent GSAP ScrollTrigger pour les animations au scroll :
- `Hero.tsx` — Framer Motion (entrée), pas de GSAP
- `ProductShowcase.tsx` — sticky-left layout + image scale scrub GSAP
- `Stats.tsx` — stagger GSAP
- `Testimonials.tsx` — slide directionnel GSAP
- `Process.tsx` — cascade stagger GSAP
- `Team.tsx` — image scale scrub + text stagger GSAP
- `Simulator.tsx` — scale entrance GSAP
- `FAQ.tsx` — entrance GSAP (state React préservé)
- `FinalCTA.tsx` — cinematic stagger GSAP
- `ContactForm.tsx` — slide opposés gauche/droite GSAP

## Conventions GSAP

- `gsap.registerPlugin(ScrollTrigger)` en haut de chaque fichier
- `useGSAP({ scope: sectionRef })` — toujours scopé à la section
- Animations d'entrée : `once: true`
- Parallax/scale : `scrub: 1.2–1.5`
- Ne jamais cibler des éléments React dynamiques (state) avec GSAP fromTo initial

## Design system

Classes utilitaires globales : `.wrap`, `.section`, `.section-head`, `.serif`, `.serif-i`, `.display`, `.mono`, `.overline`, `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-accent`, `.reveal`, `.card`, `.glass-card`

Couleurs principales :
- `--color-bg` : #F2F1EE (fond craie)
- `--color-ink` : #0F0F14 (texte principal)
- `--color-accent` : #1F3FBF (bleu Klein)
- `--color-paper` : #FAF9F5 (blanc chaud)
