"use client";

import { useActionState } from "react";
import { remplacerDocument, type Retour } from "@/app/suivi/[slug]/actions";
import { Icone, boutonPrimaire, champ } from "./ui";

/** Admin : remplace le PDF d'un devis sans changer son lien de téléchargement. */
export function RemplacerPdf({ slug, fichier, titre }: { slug: string; fichier: string; titre: string }) {
  const [etat, action, envoi] = useActionState<Retour, FormData>(remplacerDocument, {});

  return (
    <form action={action} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-end">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="nom" value={fichier} />
      <label className="block flex-1">
        <span className="mb-1 block text-[13px] font-medium text-muted">{titre}</span>
        <input type="file" name="pdf" accept="application/pdf" required className={`${champ} py-2 text-sm`} />
      </label>
      <button type="submit" disabled={envoi} className={`${boutonPrimaire} min-h-9 py-1.5 text-sm`}>
        <Icone nom="fichier" /> {envoi ? "Envoi…" : "Remplacer le PDF"}
      </button>
      {etat.erreur && (
        <p role="alert" className="text-sm text-[#962318] sm:basis-full">
          {etat.erreur}
        </p>
      )}
      {etat.ok && (
        <p role="status" className="text-sm text-muted sm:basis-full">
          PDF remplacé. Le lien de téléchargement reste le même.
        </p>
      )}
    </form>
  );
}
