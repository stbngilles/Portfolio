import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://pixelbrute.be";

/**
 * Le site public tient en deux pages : la home et le contact. Les anciennes
 * pages (/services/*, /realisations, /equipe/*) ont été retirées — les laisser
 * ici enverrait Google sur des 404.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
