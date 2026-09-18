import type { SuiviDemande, SuiviElement } from "@prisma/client";

/**
 * Présentation d'accueil d'un espace de suivi : quelques écrans, un par
 * question que le client se pose (qu'est-ce qui est fait, qu'est-ce qui
 * reste, qu'attend-on de moi, comment me servir de cette page).
 *
 * Tout vient de la base : la présentation dit la même chose que les onglets,
 * dans un autre ordre. Seuls la salutation et le mot de la fin sont écrits à
 * la main, depuis la page, par l'admin.
 */

export const ATTENTE_CLIENT = ["Attente client", "Attente confirmation"];
export const SANS_BESOIN = (b?: string | null) => !b || /^rien\.?$/i.test(b.trim());

export type Ligne = { titre: string; meta?: string; ton: "fait" | "cours" | "vous" | "option" | "info" };

export type Diapo = {
  id: string;
  etiquette: string;
  titre: string;
  phrases?: string[];
  anneau?: { fait: number; total: number };
  lignes?: Ligne[];
  reste?: string;
  mot?: string;
};

// Deux colonnes de trois : au-delà, l'écran défile sur un portable et un lecteur lent perd le fil. Le reste est dans les onglets.
const MAX_LIGNES = 6;

const pluriel = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`;
const sansPoint = (s: string) => s.trim().replace(/[.\s]+$/, "");

function couper(lignes: Ligne[], onglet: string) {
  const reste = lignes.length - MAX_LIGNES;
  return {
    lignes: lignes.slice(0, MAX_LIGNES),
    reste: reste > 0 ? `Et ${pluriel(reste, "autre point", "autres points")}, dans l'onglet « ${onglet} ».` : undefined,
  };
}

export function construireDiapos(p: {
  nom: string;
  livres: SuiviElement[];
  enCours: SuiviElement[];
  /** Ce qui attend le client : demandes de Pixelbrute, prix à valider. */
  pourToi: SuiviDemande[];
  attentes: SuiviElement[];
  presentation?: { bonjour?: string; mot?: string; tu?: boolean };
}): Diapo[] {
  // Tutoiement par défaut (le client est un proche), vouvoiement si l'admin décoche.
  const v = (vous: string, toi: string) => (p.presentation?.tu === false ? vous : toi);
  const diapos: Omit<Diapo, "etiquette">[] = [];
  const total = p.livres.length + p.enCours.length;
  const mesTaches = p.enCours.filter((e) => !ATTENTE_CLIENT.includes(e.statut ?? "") && e.statut !== "Non commandé");
  const options = p.enCours.filter((e) => e.statut === "Non commandé");

  // 1. Bonjour
  diapos.push({
    id: "bonjour",
    titre: p.presentation?.bonjour?.trim() || "Bonjour.",
    phrases: [
      `Voici le point sur le site ${p.nom}.`,
      v(
        "Prenez votre temps : vous passez à la suite avec le bouton « Suivant ».",
        "Prends ton temps : tu passes à la suite avec le bouton « Suivant ».",
      ),
    ],
  });

  // 2. Le bilan en un chiffre
  if (total > 0) {
    const reste = p.enCours.length;
    diapos.push({
      id: "bilan",
      titre: `${pluriel(p.livres.length, "élément est", "éléments sont")} en ligne.`,
      phrases: [reste ? `Il en reste ${reste} à terminer.` : "Il ne reste rien à terminer."],
      anneau: { fait: p.livres.length, total },
    });
  }

  // 3. Ce qui est fait, par groupe
  if (p.livres.length) {
    const groupes = new Map<string, number>();
    for (const e of p.livres) groupes.set(e.groupe, (groupes.get(e.groupe) ?? 0) + 1);
    diapos.push({
      id: "fait",
      titre: "Ce qui est déjà en ligne.",
      ...couper(
        [...groupes].map(([g, n]) => ({ titre: g, meta: `${pluriel(n, "point vérifié", "points vérifiés")} en ligne`, ton: "fait" as const })),
        "Livré",
      ),
    });
  }

  // 4. Ce qu'il me reste à faire
  diapos.push({
    id: "reste",
    titre: "Ce qu'il me reste à faire.",
    ...(mesTaches.length
      ? couper(
          mesTaches.map((e) => ({ titre: e.titre, meta: e.date ? `Prévu : ${e.date}` : e.statut ?? undefined, ton: "cours" as const })),
          "En cours",
        )
      : { phrases: ["Tout est à jour de mon côté."] }),
  });

  // 5. Proposé, pas commandé : ce qui sort du devis
  if (options.length) {
    diapos.push({
      id: "options",
      titre: "Proposé, pas commandé.",
      phrases: [`Ces points ne sont pas dans le devis. Rien ne démarre sans ${v("votre", "ton")} accord.`],
      ...couper(
        options.map((e) => ({ titre: e.titre, meta: e.remarque ?? e.detail ?? undefined, ton: "option" as const })),
        "En cours",
      ),
    });
  }

  // 6. Ce qu'on attend du client
  const client: Ligne[] = [
    ...p.pourToi.map((d) => ({
      titre: sansPoint(d.texte),
      meta: d.prix ? `${d.prix} HTVA` : undefined,
      ton: "vous" as const,
    })),
    ...p.attentes.map((e) => ({
      titre: e.titre,
      meta: SANS_BESOIN(e.besoin) ? undefined : e.besoin ?? undefined,
      ton: "vous" as const,
    })),
  ];
  diapos.push({
    id: "vous",
    ...(client.length
      ? { titre: v("Ce que j'attends de vous.", "Ce que j'attends de toi."), ...couper(client, "Ce que je te demande") }
      : {
          titre: v("Rien à faire de votre côté.", "Rien à faire de ton côté."),
          phrases: [v("Pour l'instant, tout avance sans vous.", "Pour l'instant, tout avance sans toi.")],
        }),
  });

  // 7. Mode d'emploi
  diapos.push({
    id: "mode",
    titre: v("Comment vous servir de cette page.", "Comment te servir de cette page."),
    lignes: [
      { titre: "Ce que je te demande", meta: "Un bouton pour valider, refuser ou dire « c'est fait ».", ton: "info" },
      { titre: "Une question, un changement ?", meta: "Le bouton bleu « Nouvelle demande », en haut.", ton: "info" },
      { titre: "Ma réponse", meta: `Écrite sous ${v("votre", "ta")} demande, avec le prix si ce n'est pas dans le devis.`, ton: "info" },
      { titre: "Le point", meta: "Chaque vendredi, je mets cette page à jour.", ton: "info" },
      { titre: "Revoir ces écrans", meta: "Le lien « Revoir la présentation », en haut de la page.", ton: "info" },
    ],
  });

  // 8. Le mot de la fin, s'il est écrit
  const mot = p.presentation?.mot?.trim();
  if (mot) diapos.push({ id: "mot", titre: "Un dernier mot.", mot });

  return diapos.map((d, i) => ({
    ...d,
    etiquette: `${String(i + 1).padStart(2, "0")} / ${String(diapos.length).padStart(2, "0")}`,
  }));
}
