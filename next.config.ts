import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Migration: passage de l'export statique vers Next.js full-stack (Vercel).
  // L'ancien export est conservé via `npm run build:static-legacy` si besoin
  // de regénérer un build statique vers `deploy/`. Le `deploy/` actuel reste
  // intact tant que la migration DNS n'est pas faite.
  //
  // NB : `trailingSlash` retiré — il casse les sous-routes Better-Auth
  // ([...all] match mais le routeur interne 404 sur /sign-up/email/ vs /sign-up/email).
  // À réactiver via rewrites au moment du déploiement prod si besoin SEO.
  // Disable source maps to avoid a Turbopack bug with non-ASCII chars in the project path
  productionBrowserSourceMaps: false,
  // Force le bon dossier racine : un package-lock.json parasite dans
  // C:\Users\gille\ trompe sinon la détection auto de Turbopack.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Better-Auth bundle un adaptateur kysely qui importe un symbole supprimé
  // dans les dernières versions de kysely. On garde better-auth en externe
  // serveur pour que Node le résolve dynamiquement (et tree-shake correctement).
  /**
   * Anciennes URLs du site (supprimées : le site tient en `/` et `/contact`).
   * 301 plutôt que 404 : elles étaient indexées, la redirection permanente
   * transfère leur référencement au lieu de le perdre.
   */
  async redirects() {
    return [
      // `/realisations` retrouve une vraie page équivalente : mieux vaut une
      // page qu'une ancre, Google ne classe pas un fragment.
      { source: "/realisations", destination: "/projets", permanent: true },
      { source: "/realisations/:slug", destination: "/projets/:slug", permanent: true },
      { source: "/services", destination: "/#expertises", permanent: true },
      { source: "/services/:slug", destination: "/#expertises", permanent: true },
      { source: "/equipe", destination: "/#studio", permanent: true },
      { source: "/equipe/:slug", destination: "/#studio", permanent: true },
      // Étude de cas retirée à la demande du client.
      { source: "/projets/azimut-games", destination: "/projets", permanent: true },
    ];
  },
  serverExternalPackages: [
    "better-auth",
    "@better-auth/kysely-adapter",
    "kysely",
    "@prisma/client",
    "prisma",
  ],
};

export default nextConfig;
