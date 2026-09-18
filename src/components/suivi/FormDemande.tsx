"use client";

import { useActionState, useEffect, useRef } from "react";
import { creerDemande, type Retour } from "@/app/suivi/[slug]/actions";
import { boutonPrimaire, champ } from "./ui";

const PRIORITES = [
  { v: "Bloquant", aide: "Gêne les ventes ou les visiteurs" },
  { v: "Utile", aide: "À faire bientôt" },
  { v: "Plus tard", aide: "Quand il y aura le temps" },
];

export function FormDemande({ slug }: { slug: string }) {
  const [etat, action, envoi] = useActionState<Retour, FormData>(creerDemande, {});
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat.ok) form.current?.reset();
  }, [etat]);

  return (
    <form ref={form} action={action} className="space-y-5" noValidate>
      <input type="hidden" name="slug" value={slug} />

      <div>
        <label htmlFor="texte" className="mb-1.5 block text-sm font-medium">
          Ta demande <span className="text-[#962318]" aria-hidden="true">*</span>
        </label>
        <textarea
          id="texte"
          name="texte"
          rows={4}
          required
          aria-invalid={!!etat.erreur}
          aria-describedby="texte-aide"
          placeholder="Ex. : changer le prix d'Azimath, ajouter un magasin, corriger une faute sur la page À propos…"
          className={`${champ} resize-y`}
        />
        <p id="texte-aide" className="mt-1.5 text-sm text-muted">
          Une demande à la fois. Ajoute la page concernée si tu la connais.
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Priorité</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {PRIORITES.map((p) => (
            <label
              key={p.v}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white px-3 py-2.5 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50"
            >
              <input type="radio" name="priorite" value={p.v} defaultChecked={p.v === "Utile"} className="mt-1 accent-[#1F3FBF]" />
              <span>
                <span className="block text-[15px] font-medium">{p.v}</span>
                <span className="block text-sm text-muted">{p.aide}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={envoi} className={boutonPrimaire}>
          {envoi ? "Envoi…" : "Envoyer la demande"}
        </button>
        <p aria-live="polite" className="text-sm">
          {etat.erreur && <span className="text-[#962318]">{etat.erreur}</span>}
          {etat.ok && <span className="text-[#1B5E2E]">Envoyé. Je suis prévenu par e-mail, ma réponse arrivera ici.</span>}
        </p>
      </div>
    </form>
  );
}
