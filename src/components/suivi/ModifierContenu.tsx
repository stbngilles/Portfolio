"use client";

import { useActionState } from "react";
import { majContenu, type Retour } from "@/app/suivi/[slug]/actions";
import type { Contenu } from "@/lib/suivi/paquet";
import { boutonPrimaire, champ } from "./ui";

const petit = `${champ} py-2 text-sm`;

function Champ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[13px] font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

/** Admin : corrige les cartes « Tes tarifs » et « Devis » que voit le client. */
export function ModifierContenu({ slug, contenu }: { slug: string; contenu: Contenu }) {
  const [etat, action, envoi] = useActionState<Retour, FormData>(majContenu, {});

  return (
    <form action={action} className="divide-y divide-line">
      <input type="hidden" name="slug" value={slug} />

      {contenu.tarifs.map((t, i) => (
        <fieldset key={i} className="grid gap-3 px-5 py-4 sm:grid-cols-3">
          <legend className="sr-only">Tarif {i + 1}</legend>
          <Champ label="Tarif">
            <input name={`tarif_libelle_${i}`} defaultValue={t.libelle} className={petit} />
          </Champ>
          <Champ label="Montant">
            <input name={`tarif_montant_${i}`} defaultValue={t.montant} className={petit} />
          </Champ>
          <Champ label="Précision">
            <input name={`tarif_precision_${i}`} defaultValue={t.precision} className={petit} />
          </Champ>
          <Champ label="Détail" className="sm:col-span-3">
            <textarea name={`tarif_detail_${i}`} defaultValue={t.detail ?? ""} rows={2} className={`${petit} resize-y`} />
          </Champ>
        </fieldset>
      ))}

      <div className="px-5 py-4">
        <Champ label="Note sous les tarifs">
          <input name="tva" defaultValue={contenu.tva ?? ""} className={petit} />
        </Champ>
      </div>

      {contenu.devis.map((d, i) => (
        <fieldset key={d.fichier} className="grid gap-3 px-5 py-4 sm:grid-cols-3">
          <legend className="sr-only">Devis {i + 1}</legend>
          <Champ label="Numéro (affiché « Devis … »)">
            <input name={`devis_numero_${i}`} defaultValue={d.numero} className={petit} />
          </Champ>
          <Champ label="Titre" className="sm:col-span-2">
            <input name={`devis_titre_${i}`} defaultValue={d.titre} className={petit} />
          </Champ>
          <Champ label="Émis le">
            <input name={`devis_emis_${i}`} defaultValue={d.emis} className={petit} />
          </Champ>
          <Champ label="Valable jusqu'au">
            <input name={`devis_valide_${i}`} defaultValue={d.valide} className={petit} />
          </Champ>
          <Champ label="Total">
            <input name={`devis_total_${i}`} defaultValue={d.total} className={petit} />
          </Champ>
          <Champ label="Lignes, une par ligne" className="sm:col-span-3">
            <textarea name={`devis_lignes_${i}`} defaultValue={d.lignes.join("\n")} rows={6} className={`${petit} resize-y`} />
          </Champ>
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center gap-3 px-5 py-4">
        <button type="submit" disabled={envoi} className={`${boutonPrimaire} min-h-9 py-1.5 text-sm`}>
          {envoi ? "Enregistrement…" : "Enregistrer les cartes"}
        </button>
        {etat.erreur && (
          <p role="alert" className="text-sm text-[#962318]">
            {etat.erreur}
          </p>
        )}
        {etat.ok && (
          <p role="status" className="text-sm text-muted">
            Enregistré. Le client voit déjà la nouvelle version.
          </p>
        )}
      </div>
    </form>
  );
}
