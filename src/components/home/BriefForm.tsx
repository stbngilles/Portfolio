"use client";

import type { ReactNode } from "react";
import { useForm, ValidationError } from "@formspree/react";
import Link from "next/link";
import Arrow from "./Arrow";
import { QUOTES } from "./data";

/**
 * Formulaire de brief. Les tranches de budget encadrent le catalogue réel
 * (src/lib/pricing.ts : Starter 1 200 €, Essentiel 2 500 €, E-commerce 6 000 €)
 * et gardent une sortie « je ne sais pas encore » : sur cette clientèle,
 * forcer une fourchette fait surtout perdre des demandes légitimes.
 *
 * Deux champs obligatoires seulement — nom et e-mail. Le descriptif du projet
 * était `required` : c'était le champ le plus coûteux du formulaire (il demande
 * de rédiger) placé avant même qu'on ait donné son nom. Une demande de trois
 * mots se qualifie au téléphone ; une demande jamais envoyée, non.
 *
 * Envoi via le Formspree déjà utilisé par l'ancien formulaire du site.
 */
const BESOINS = [
  "Site vitrine",
  "Boutique en ligne",
  "Refonte d'un site existant",
  "Référencement local",
  "Maintenance & suivi",
];

const BUDGETS = [
  "Moins de 1 500 €",
  "1 500 € – 3 000 €",
  "3 000 € – 6 000 €",
  "Plus de 6 000 €",
  "Je ne sais pas encore",
];

const TEL = "+32 492 20 02 75";
const TEL_HREF = "tel:+32492200275";
const MAIL = "contact@pixelbrute.be";

/** Le plus court des avis réels : il doit tenir sous le formulaire, pas le noyer. */
const PROOF = QUOTES.reduce((a, b) => (b.text.length < a.text.length ? b : a));

const STEPS = 4;

/**
 * Un bloc du formulaire. Numéroté `01 / 04` : un formulaire dont on voit la
 * fin se remplit, un formulaire qui déroule s'abandonne.
 */
function Field({
  n,
  label,
  hint,
  htmlFor,
  group,
  children,
}: {
  n: number;
  label: string;
  hint: string;
  /** Renseigné pour un champ unique ; sinon `group` prend le relais. */
  htmlFor?: string;
  /** Pour les paquets de cases ou de boutons radio, qui n'ont pas de `for`. */
  group?: "group" | "radiogroup";
  children: ReactNode;
}) {
  const id = `pb-lbl-${n}`;
  const head = (
    <>
      <span className="pb-fnum">
        {String(n).padStart(2, "0")} / {STEPS}
      </span>
      {label}
      <div className="pb-field-hint">{hint}</div>
    </>
  );

  if (group) {
    return (
      <div className="pb-field" role={group} aria-labelledby={id}>
        <div className="pb-field-lbl pb-label" id={id}>
          {head}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="pb-field">
      <label className="pb-field-lbl pb-label" htmlFor={htmlFor}>
        {head}
      </label>
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
            <span>Je lis votre demande et je regarde votre site actuel, s&apos;il existe.</span>
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
        group="group"
        label="Ce dont vous avez besoin"
        hint="Plusieurs choix possibles. Un clic, et c'est fait."
      >
        <div className="pb-choices">
          {BESOINS.map((b) => (
            <label key={b} className="pb-choice">
              <span>{b}</span>
              <input type="checkbox" name="besoin" value={b} />
            </label>
          ))}
        </div>
      </Field>

      <Field
        n={2}
        group="radiogroup"
        label="Budget indicatif"
        hint="HTVA. Un ordre de grandeur suffit — ce n'est pas un engagement."
      >
        <div className="pb-choices">
          {BUDGETS.map((b) => (
            <label key={b} className="pb-choice">
              <span>{b}</span>
              <input type="radio" name="budget" value={b} />
            </label>
          ))}
        </div>
      </Field>

      <Field
        n={3}
        htmlFor="projet"
        label="Le projet"
        hint="Deux lignes suffisent. Ce qui coince aujourd'hui, plutôt qu'une liste de fonctionnalités."
      >
        <div>
          <textarea
            id="projet"
            name="projet"
            className="pb-textarea"
            placeholder="Ex. : « Je suis électricien à Herstal, je n'ai qu'une page Facebook et je passe mes soirées à répondre aux mêmes questions par message. »"
          />
          <ValidationError prefix="Projet" field="projet" errors={state.errors} className="pb-form-err" />
        </div>
      </Field>

      <Field n={4} htmlFor="nom" label="Vous" hint="Nom et e-mail suffisent. Le reste aide, sans plus.">
        <div>
          <div className="pb-inputs">
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
          </div>
          <div className="pb-inputs">
            <input
              id="tel"
              name="telephone"
              type="tel"
              inputMode="tel"
              className="pb-input"
              placeholder="Téléphone — si vous préférez un appel"
              autoComplete="tel"
            />
            <input
              id="entreprise"
              name="entreprise"
              className="pb-input"
              placeholder="Nom de l'entreprise"
              autoComplete="organization"
            />
          </div>
          <input
            id="site"
            name="site"
            className="pb-input"
            placeholder="Site actuel, s'il existe"
            autoComplete="url"
          />
          <ValidationError prefix="E-mail" field="email" errors={state.errors} className="pb-form-err" />
        </div>
      </Field>

      <div className="pb-field pb-proof">
        <div className="pb-field-lbl pb-label">
          Avant d&apos;envoyer
          <div className="pb-field-hint">Avis Google, repris mot pour mot.</div>
        </div>
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
        Pas de newsletter, pas de démarchage : vos informations servent uniquement à vous répondre.
        Vous préférez parler&nbsp;? <a href={TEL_HREF}>{TEL}</a>.
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
