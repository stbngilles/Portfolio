"use client";

import type { ReactNode } from "react";
import { useForm, ValidationError } from "@formspree/react";
import Link from "next/link";
import Arrow from "./Arrow";
import { QUOTES } from "./data";

/**
 * Formulaire de brief — trois blocs, deux champs obligatoires.
 *
 * Historique des coupes, pour ne pas les refaire à l'envers :
 * — « Nom de l'entreprise » et « Site actuel » sont partis. Le domaine de
 *   l'adresse e-mail donne le premier, et le second se demande en une phrase
 *   au téléphone. Deux champs de plus pour une information qu'on obtient
 *   autrement, c'est deux raisons d'abandonner.
 * — Besoin et budget étaient deux listes empilées de cinq lignes en corps 30 :
 *   610 px de formulaire pour dix clics. Ils tiennent maintenant en pastilles
 *   sur un même bloc.
 * — Le descriptif du projet n'est plus `required` : c'est le champ le plus
 *   coûteux (il demande de rédiger), et il était placé avant même le nom.
 *
 * Les tranches de budget encadrent le catalogue réel (src/lib/pricing.ts :
 * Starter 1 200 €, Essentiel 2 500 €, E-commerce 6 000 €) et gardent une
 * sortie « je ne sais pas » : sur cette clientèle, forcer une fourchette fait
 * surtout perdre des demandes légitimes.
 *
 * Envoi via le Formspree déjà utilisé par l'ancien formulaire du site.
 */
const BESOINS = [
  "Site vitrine",
  "Boutique en ligne",
  "Refonte de site",
  "Référencement local",
  "Maintenance",
];

const BUDGETS = [
  "Moins de 1 500 €",
  "1 500 – 3 000 €",
  "3 000 – 6 000 €",
  "Plus de 6 000 €",
  "Je ne sais pas",
];

const TEL = "+32 492 20 02 75";
const TEL_HREF = "tel:+32492200275";
const MAIL = "contact@pixelbrute.be";

/** Le plus court des avis réels : il doit tenir sous le formulaire, pas le noyer. */
const PROOF = QUOTES.reduce((a, b) => (b.text.length < a.text.length ? b : a));

const STEPS = 3;

/** Une pastille cochable. Le `input` est masqué, la pastille sert de surface. */
function Chip({ name, value, type }: { name: string; value: string; type: "checkbox" | "radio" }) {
  return (
    <label className="pb-chip">
      <input type={type} name={name} value={value} />
      <span>{value}</span>
    </label>
  );
}

/**
 * Un bloc du formulaire. Numéroté `01 / 3` : un formulaire dont on voit la
 * fin se remplit, un formulaire qui déroule s'abandonne.
 */
function Field({
  n,
  label,
  hint,
  htmlFor,
  children,
}: {
  n: number;
  label: string;
  hint: string;
  /** Absent quand le bloc contient plusieurs contrôles : le libellé n'est alors pas un `label`. */
  htmlFor?: string;
  children: ReactNode;
}) {
  const head = (
    <>
      <span className="pb-fnum">
        {String(n).padStart(2, "0")} / {STEPS}
      </span>
      {label}
      <div className="pb-field-hint">{hint}</div>
    </>
  );

  return (
    <div className="pb-field">
      {htmlFor ? (
        <label className="pb-field-lbl pb-label" htmlFor={htmlFor}>
          {head}
        </label>
      ) : (
        <div className="pb-field-lbl pb-label">{head}</div>
      )}
      {children}
    </div>
  );
}

export default function BriefForm() {
  const [state, handleSubmit] = useForm("xdaawkyd");

  if (state.succeeded) {
    return (
      <div className="pb-form-done">
        <div className="pb-over">Demande envoyée</div>
        <h2 className="pb-d-s">Merci — je vous réponds sous 24 h ouvrées.</h2>

        <ol className="pb-next">
          <li>
            <b>01</b>
            <span>Je lis votre demande et je regarde ce que vous faites déjà en ligne.</span>
          </li>
          <li>
            <b>02</b>
            <span>
              Je réponds par e-mail : ce que je comprends du besoin, ce que je ferais, un ordre de
              grandeur.
            </span>
          </li>
          <li>
            <b>03</b>
            <span>
              Si ça vous parle, on cale trente minutes au téléphone. Sans engagement — et sans devis
              envoyé dans la même heure.
            </span>
          </li>
        </ol>

        <div className="pb-done-acts">
          <Link href="/realisations" className="pb-btn-line">
            Voir les réalisations <Arrow dir="ne" />
          </Link>
          <Link href="/" className="pb-btn-line">
            Retour à l&apos;accueil
          </Link>
        </div>

        <p className="pb-form-note">
          C&apos;est urgent&nbsp;? Appelez directement le <a href={TEL_HREF}>{TEL}</a>.
        </p>
      </div>
    );
  }

  return (
    <form id="brief" className="pb-form" onSubmit={handleSubmit}>
      {/* Objet lisible dans la boîte de réception, et piège à robots (Formspree). */}
      <input type="hidden" name="_subject" value="Nouvelle demande — pixelbrute.be/contact" />
      <input
        type="text"
        name="_gotcha"
        className="pb-hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <Field
        n={1}
        label="Votre besoin"
        hint="Plusieurs choix possibles. Le budget n'est qu'un ordre de grandeur, HTVA."
      >
        <div>
          <div className="pb-chips" role="group" aria-label="Ce dont vous avez besoin">
            {BESOINS.map((b) => (
              <Chip key={b} name="besoin" value={b} type="checkbox" />
            ))}
          </div>
          <div className="pb-chips-lbl pb-cap">Budget indicatif</div>
          <div className="pb-chips" role="radiogroup" aria-label="Budget indicatif">
            {BUDGETS.map((b) => (
              <Chip key={b} name="budget" value={b} type="radio" />
            ))}
          </div>
        </div>
      </Field>

      <Field
        n={2}
        htmlFor="projet"
        label="Le projet"
        hint="Facultatif — deux lignes suffisent. Ce qui coince, plutôt qu'une liste de fonctionnalités."
      >
        <div>
          <textarea
            id="projet"
            name="projet"
            className="pb-textarea"
            placeholder="Ex. : « Électricien à Herstal, je n'ai qu'une page Facebook et je passe mes soirées à répondre aux mêmes questions. »"
          />
          <ValidationError prefix="Projet" field="projet" errors={state.errors} className="pb-form-err" />
        </div>
      </Field>

      <Field n={3} htmlFor="nom" label="Vous" hint="Le téléphone si vous préférez être rappelé.">
        <div>
          <div className="pb-inputs" data-cols="3">
            <input id="nom" name="nom" className="pb-input" required placeholder="Nom et prénom" autoComplete="name" />
            <input
              id="email"
              name="email"
              type="email"
              className="pb-input"
              required
              placeholder="Adresse e-mail"
              autoComplete="email"
            />
            <input
              id="tel"
              name="telephone"
              type="tel"
              inputMode="tel"
              className="pb-input"
              placeholder="Téléphone (facultatif)"
              autoComplete="tel"
            />
          </div>
          <ValidationError prefix="E-mail" field="email" errors={state.errors} className="pb-form-err" />
        </div>
      </Field>

      <div className="pb-field pb-proof">
        <div className="pb-field-lbl pb-label">Avant d&apos;envoyer</div>
        <div>
          <blockquote className="pb-proof-q">{PROOF.text}</blockquote>
          <div className="pb-proof-who pb-cap">
            {PROOF.name} · {PROOF.role}
          </div>
        </div>
      </div>

      <button type="submit" className="pb-submit" disabled={state.submitting}>
        {state.submitting ? "Envoi en cours…" : "Envoyer — réponse sous 24 h ouvrées"}
      </button>

      <p className="pb-form-note">
        Pas de newsletter, pas de démarchage. Vous préférez parler&nbsp;? <a href={TEL_HREF}>{TEL}</a>.
      </p>

      <ValidationError errors={state.errors} className="pb-form-err" />
      {state.errors && (
        <p className="pb-form-note">
          L&apos;envoi n&apos;est pas passé&nbsp;? Écrivez-moi directement à{" "}
          <a href={`mailto:${MAIL}`}>{MAIL}</a> — ça arrive au même endroit.
        </p>
      )}
    </form>
  );
}
