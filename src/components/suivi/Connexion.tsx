"use client";

import { useActionState, useState } from "react";
import { seConnecter, type Retour } from "@/app/suivi/[slug]/actions";
import { Icone, boutonPrimaire, champ } from "./ui";

export function Connexion({ slug, nom }: { slug: string; nom: string }) {
  const [etat, action, envoi] = useActionState<Retour, FormData>(seConnecter, {});
  const [voir, setVoir] = useState(false);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center text-sm font-semibold tracking-[0.02em] text-muted">Pixelbrute</p>
        <div className="rounded-xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(15,15,20,0.04)] sm:p-8">
          <div className="mb-5 flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Icone nom="cadenas" className="size-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-[-0.01em]">Suivi du site {nom}</h1>
          <p className="mt-1.5 text-[15px] text-muted">Entre le mot de passe que je t&apos;ai envoyé.</p>

          <form action={action} className="mt-6" noValidate>
            <input type="hidden" name="slug" value={slug} />
            {/* Champ identifiant masqué : aide les gestionnaires de mots de passe à ranger l'entrée. */}
            <input type="text" name="username" autoComplete="username" value={nom} readOnly hidden />
            <label htmlFor="motdepasse" className="mb-1.5 block text-sm font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="motdepasse"
                name="motdepasse"
                type={voir ? "text" : "password"}
                autoComplete="current-password"
                autoFocus
                required
                aria-invalid={!!etat.erreur}
                aria-describedby={etat.erreur ? "erreur-mdp" : undefined}
                className={`${champ} pr-20`}
              />
              <button
                type="button"
                onClick={() => setVoir((v) => !v)}
                aria-pressed={voir}
                className="absolute inset-y-1 right-1 cursor-pointer rounded-md px-3 text-sm text-muted hover:bg-bg hover:text-ink"
              >
                {voir ? "Masquer" : "Afficher"}
              </button>
            </div>
            {etat.erreur && (
              <p id="erreur-mdp" role="alert" className="mt-2 text-sm text-[#962318]">
                {etat.erreur}
              </p>
            )}
            <button type="submit" disabled={envoi} className={`${boutonPrimaire} mt-5 w-full`}>
              {envoi ? "Connexion…" : "Accéder au suivi"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Mot de passe perdu ?{" "}
          <a href="mailto:contact@pixelbrute.be" className="text-accent underline underline-offset-2">
            contact@pixelbrute.be
          </a>
        </p>
      </div>
    </main>
  );
}
