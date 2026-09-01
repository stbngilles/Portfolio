import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://pixelbrute.be";

/**
 * `/app/*` (la plateforme) et `/api/*` restent hors index : ce sont des écrans
 * de connexion et des espaces authentifiés. Indexés, ils n'apporteraient aucun
 * trafic et dilueraient le signal de qualité du domaine, Bing y est plus
 * sensible que Google, qui se contente d'ignorer ces pages.
 *
 * Le groupe `bingbot` est explicite et vide de restriction : si une règle
 * `*` devait un jour se durcir, le crawl Bing ne suivrait pas. Aucun
 * `Crawl-delay`, Bing le respecte à la lettre et il ne ferait que ralentir
 * la découverte d'un site qui tient en quelques pages.
 */

/**
 * Les moteurs génératifs, nommés un par un.
 *
 * Une règle `*: allow /` les autorise déjà tous. Les écrire quand même tient
 * à trois choses :
 *
 * , `Google-Extended` et `Applebot-Extended` ne sont pas des robots. Ce sont
 *    des jetons de contrôle : ils ne décident pas de l'exploration (Googlebot
 *    et Applebot s'en chargent) mais du droit de réutiliser la page dans
 *    Gemini et Apple Intelligence. Les nommer, c'est dire oui explicitement,
 *    là où le silence est parfois lu comme un refus.
 * , les robots « à la demande » (`ChatGPT-User`, `Claude-User`,
 *    `Perplexity-User`) ne construisent pas un index : ils vont chercher la
 *    page au moment où quelqu'un pose la question. Ce sont eux qui décident,
 *    en direct, si le studio est cité dans une réponse.
 * , le jour où la règle `*` se durcit, un `Disallow` de plus, un outil qui
 *    réécrit le fichier, ces groupes-là ne suivront pas silencieusement.
 *
 * La liste vaut donc autant comme documentation que comme configuration.
 */
const MOTEURS_GENERATIFS = [
  // OpenAI, entraînement, index de ChatGPT Search, récupération à la demande.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // `OAI-AdsBot` relit la page d'atterrissage d'une annonce ChatGPT avant de la
  // valider. OpenAI demande qu'il soit nommé, pas seulement couvert par `*` :
  // sans son groupe, l'aperçu d'annonce échoue sur « site inaccessible » alors
  // que le site répond 200 à tout le monde.
  "OAI-AdsBot",
  // Anthropic, même découpage en trois.
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity, index et récupération à la demande.
  "PerplexityBot",
  "Perplexity-User",
  // Jetons d'autorisation IA (voir plus haut) : ni l'un ni l'autre n'explore.
  "Google-Extended",
  "Applebot-Extended",
  // Le reste du peloton.
  "Amazonbot",
  "Applebot",
  "Bytespider",
  "CCBot",
  "DuckAssistBot",
  "MistralAI-User",
  "YouBot",
  "cohere-ai",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  // Même exclusion pour tout le monde : un assistant n'a pas plus de raison
  // qu'un moteur d'aller lire un écran de connexion.
  const disallow = ["/app/", "/api/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "bingbot", allow: "/", disallow },
      ...MOTEURS_GENERATIFS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
