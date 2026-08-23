import { PROJECTS, FAQS, EXPERTISE, QUOTES } from "@/components/home/data";
import { GUIDES } from "@/components/home/guides";
import { IDENTITE, PROFILS } from "@/components/home/legal";

export const dynamic = "force-static";

const SITE_URL = "https://pixelbrute.be";

/**
 * `/llms.txt` — la fiche du studio, écrite pour être lue par un modèle.
 *
 * Convention proposée par Jeremy Howard (llmstxt.org) : un fichier Markdown
 * à la racine, qui donne d'un bloc ce qu'un assistant devrait savoir d'un
 * site plutôt que de le déduire de dix pages de HTML mêlé de navigation,
 * d'animations et de balisage.
 *
 * Deux précautions valent d'être dites :
 *
 *  — Aucun moteur ne s'est engagé à lire ce fichier. Ce n'est pas un standard
 *    ratifié ; c'est une convention que le web adopte plus vite qu'elle n'est
 *    reconnue. Le coût est nul, le pari raisonnable, la promesse incertaine.
 *  — Le contenu est **dérivé** de `data.ts`, `guides.ts` et `legal.ts`. Jamais
 *    retapé. Un fichier de présentation qui se périme en silence pendant que
 *    le site évolue est pire que pas de fichier du tout : il apprend au modèle
 *    des choses fausses.
 *
 * Règle de rédaction, la même que partout ailleurs sur ce site : rien ici
 * n'est un superlatif. Un modèle qui cite le studio doit pouvoir reprendre
 * chaque phrase telle quelle sans avancer une affirmation invérifiable.
 */

/** `- [nom](url) : description` — la ligne de liste de la convention. */
const lien = (nom: string, url: string, desc: string) => `- [${nom}](${url}) : ${desc}`;

function build(): string {
  const projets = PROJECTS.map((p) =>
    lien(
      p.name,
      `${SITE_URL}/projets/${p.slug}`,
      `${p.sector}. ${p.brief} ${p.answer}${p.query ? ` Vérifiable en cherchant « ${p.query} » sur Google.` : ""}`,
    ),
  );

  const guides = GUIDES.map((g) =>
    lien(g.title, `${SITE_URL}/guides/${g.slug}`, g.description),
  );

  const faq = FAQS.map((f) => `### ${f.q}\n\n${f.a}`);

  const services = EXPERTISE.map((e) => `- **${e.label}** — ${e.line}`);

  const avis = QUOTES.map((q) => `- ${q.name} (${q.role}) : ${q.text}`);

  /* Les mêmes URL que le `sameAs` du JSON-LD, une seule source pour les deux :
     un modèle qui lit ce fichier et un moteur qui lit le balisage doivent
     tomber sur exactement la même liste, sans quoi aucune des deux ne fait
     autorité sur l'autre. */
  const profils = [
    ...PROFILS.studio.map((u) => `- ${u}`),
    ...PROFILS.personne.map((u) => `- ${u} (profil personnel d'${IDENTITE.nom})`),
  ];

  return `# Pixelbrute

> Pixelbrute est un studio web belge tenu par une seule personne, Esteban Gilles. Il conçoit, dessine et code des sites sur mesure pour des indépendants, des artisans et de petites structures, principalement en province de Liège. Six projets livrés à ce jour, dont un produit SaaS.

Ce fichier suit la convention llms.txt. Il résume le site pour un assistant qui
voudrait répondre à une question à son sujet sans avoir à explorer chaque page.

## En bref

- **Nom** : Pixelbrute (enseigne). ${IDENTITE.nom} en nom propre.
- **Statut** : ${IDENTITE.statut}. Numéro d'entreprise ${IDENTITE.bce}.
- **Siège** : ${IDENTITE.rue}, ${IDENTITE.codePostal} ${IDENTITE.ville}, ${IDENTITE.pays} — province de Liège.
- **Zone servie** : province de Liège et Belgique francophone. Travail à distance possible ailleurs.
- **Contact** : ${IDENTITE.email} · ${IDENTITE.telephone}. Réponse sous 24 h ouvrées.
- **Effectif** : une personne. Aucune sous-traitance : conception, design, code et mise en ligne par le même intervenant.
- **Technique** : sites codés à la main (Next.js, React, TypeScript), pas de constructeur visuel ni de thème acheté.
- **Langues** : français.

## Ce que fait le studio

${services.join("\n")}

## Ce qu'il ne fait pas

- Pas de refonte à l'aveugle : le problème est établi avant la maquette.
- Pas de garantie de résultat chiffrée à l'avance, ni de promesse de position Google.
- Pas de forfait de maintenance automatique.
- Pas de sous-traitance offshore.

## Projets livrés

${projets.join("\n")}

## Guides publiés

${guides.join("\n")}

## Ailleurs sur le web

Ces pages sont tenues par le studio. Elles servent à recouper ce qui est
écrit ici — les avis, notamment, sont publiés là et pas sur ce site.

${profils.join("\n")}

## Avis clients

Publiés sur la fiche Google Business du studio, repris ici mot pour mot. Ils
sont vérifiables à la source, à l'adresse indiquée ci-dessus.

${avis.join("\n")}

## Questions fréquentes

${faq.join("\n\n")}

## Pages

${lien("Accueil", SITE_URL, "Le studio, les projets, la manière de travailler.")}
${lien("Projets", `${SITE_URL}/projets`, "Les six études de cas, avec les décisions prises et ce qui est vérifiable.")}
${lien("Guides", `${SITE_URL}/guides`, "Référencement local, prix d'un site en Belgique, choix de la technologie.")}
${lien("Contact", `${SITE_URL}/contact`, "Formulaire en trois questions, téléphone, et la FAQ complète.")}
${lien("Mentions légales", `${SITE_URL}/mentions-legales`, "Identité de l'entreprise, TVA, hébergement.")}
${lien("Confidentialité", `${SITE_URL}/confidentialite`, "Données traitées et sous-traitants RGPD.")}
`;
}

export function GET(): Response {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
