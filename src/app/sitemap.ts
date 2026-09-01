import type { MetadataRoute } from "next";
import { PROJECTS } from "@/components/home/data";
import { GUIDES } from "@/components/home/guides";

export const dynamic = "force-static";

const SITE_URL = "https://pixelbrute.be";

/**
 * Le site public : la home, le contact, l'index des projets et une page par
 * étude de cas. Les anciennes pages (/services/*, /realisations, /equipe/*)
 * ont été retirées, les laisser ici enverrait Google sur des redirections.
 *
 * Les dates sont figées, pas dérivées de `new Date()` : un sitemap qui
 * annonce « tout a changé » à chaque déploiement finit par n'être plus cru.
 * À remonter quand le contenu de la page bouge réellement.
 */
const LAST_EDIT = {
  home: "2026-08-23",
  contact: "2026-08-23",
  projets: "2026-08-23",
  guides: "2026-08-23",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_EDIT.home,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projets`,
      lastModified: LAST_EDIT.projets,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: LAST_EDIT.contact,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: LAST_EDIT.guides,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...PROJECTS.map((p) => ({
      url: `${SITE_URL}/projets/${p.slug}`,
      lastModified: LAST_EDIT.projets,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/creation-site-internet-hesbaye`,
      lastModified: LAST_EDIT.guides,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      lastModified: LAST_EDIT.guides,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified: LAST_EDIT.guides,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...GUIDES.map((g) => ({
      url: `${SITE_URL}/guides/${g.slug}`,
      lastModified: g.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
