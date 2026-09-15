"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useForm, ValidationError } from "@formspree/react";
import Link from "next/link";
import Arrow from "./Arrow";
import TrackLink from "./TrackLink";
import { trackEvent } from "./track";
import { readSource } from "./Consent";
import { SITE_FROM, euro } from "./data";

/**
 * Formulaire de brief, trois blocs, deux champs obligatoires.
 *
 * Historique des coupes, pour ne pas les refaire à l'envers :
 *, « Nom de l'entreprise » et « Site actuel » sont partis. Le domaine de
 *   l'adresse e-mail donne le premier, et le second se demande en une phrase
 *   au téléphone. Deux champs de plus pour une information qu'on obtient
 *   autrement, c'est deux raisons d'abandonner.
 *, Besoin et budget étaient deux listes empilées de cinq lignes en corps 30 :
 *   610 px de formulaire pour dix clics. Ils tiennent maintenant en pastilles
 *   sur un même bloc.
 *, Le descriptif du projet n'est plus `required` : c'est le champ le plus
 *   coûteux (il demande de rédiger), et il était placé avant même le nom.
 *, Un avis client était encarté entre le dernier champ et le bouton d'envoi,
 *   sous le titre « Avant d'envoyer ». Au milieu d'un formulaire, une citation
 *   se lit comme une consigne de plus : la preuve sociale vit sous les voies
 *   directes et sur la home, pas ici.
 *
 * Les tranches de budget sont celles de la page tarifs, calculées depuis le
 * même grille (`SITE_FROM`, voir `data.ts`) : un formulaire qui propose
 * « moins de 1 500 € » sous un site qui affiche 2 500 € comme prix de départ
 * contredit le positionnement au moment précis où le visiteur s'engage. La
 * sortie « je ne sais pas » reste : forcer une fourchette fait surtout perdre
 * des demandes légitimes.
 *
 * Envoi via le Formspree déjà utilisé par l'ancien formulaire du site.
 */
const BESOINS = [
  "Site vitrine",
  "Site immobilier",
  "Boutique en ligne",
  "Réservation en ligne",
  "Refonte de site",
  "Référencement local",
  "Campagnes publicitaires",
  "Suivi mensuel",
];

const BUDGETS = [
  `Moins de ${euro(SITE_FROM.essentiel)}`,
  `${euro(SITE_FROM.essentiel)} à ${euro(SITE_FROM.signature)}`,
  `${euro(SITE_FROM.signature)} à ${euro(SITE_FROM.surMesure)}`,
  `Plus de ${euro(SITE_FROM.surMesure)}`,
  "Je ne sais pas",
];

/**
 * « Comment m'avez-vous trouvé ? », facultatif. La seule mesure qui voit ce
 * que les outils ne voient pas : le bouche-à-oreille, l'annonce vue sur un
 * téléphone puis le site tapé sur l'ordinateur.
 */
const TROUVE = [
  "Google",
  "Google Maps",
  "Bing",
  "Instagram",
  "LinkedIn",
  "Une annonce",
  "Bouche-à-oreille",
  "Autre",
];

const TEL = "+32 492 20 02 75";
const TEL_HREF = "tel:+32492200275";
const MAIL = "contact@pixelbrute.be";

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
  const found = useRef("");
  // Provenance de la visite, enregistrée par `Consent` si le visiteur a
  // accepté. Lue à l'envoi et pas au montage : un visiteur qui arrive sur
  // cette page et accepte les cookies juste avant d'écrire compte aussi.
  const provenance = useRef<HTMLInputElement>(null);

  // Compté quand Formspree a accepté, pas au clic : un envoi refusé n'est pas
  // une demande. L'effet ne joue qu'au passage à `succeeded`.
  useEffect(() => {
    if (state.succeeded) trackEvent("brief_sent", { trouve: found.current || "non précisé" });
  }, [state.succeeded]);

  if (state.succeeded) {
    return (
      <div className="pb-form-done">
        <div className="pb-over">Demande envoyée</div>
        <h2 className="pb-d-s">Merci, je vous réponds sous 24 h ouvrées.</h2>

        <ol className="pb-next">
          <li>
            <b>01</b>
            <span>Je lis votre demande et je regarde ce que vous faites déjà en ligne.</span>
          </li>
          <li>
            <b>02</b>
            <span>Je réponds par e-mail : ce que je ferais, et un ordre de grandeur.</span>
          </li>
          <li>
            <b>03</b>
            <span>Si ça vous parle, on cale quinze minutes. Rien à signer.</span>
          </li>
        </ol>

        <div className="pb-done-acts">
          <Link href="/#projets" className="pb-btn-line">
            Voir les projets <Arrow dir="ne" />
          </Link>
          <Link href="/" className="pb-btn-line">
            Retour à l&apos;accueil
          </Link>
        </div>

        <p className="pb-form-note">
          C&apos;est urgent&nbsp;? Appelez directement le{" "}
          <TrackLink event="tel_click" href={TEL_HREF}>
            {TEL}
          </TrackLink>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      id="brief"
      className="pb-form"
      data-clarity-mask="true"
      onSubmit={(e) => {
        found.current = String(new FormData(e.currentTarget).get("trouve") ?? "");
        if (provenance.current) provenance.current.value = readSource();
        return handleSubmit(e);
      }}
    >
      {/* Objet lisible dans la boîte de réception, et piège à robots (Formspree). */}
      <input type="hidden" name="_subject" value="Nouvelle demande, pixelbrute.be/contact" />
      <input ref={provenance} type="hidden" name="provenance" defaultValue="" />
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
        hint="Plusieurs réponses possibles."
      >
        <div>
          <div className="pb-chips" role="group" aria-label="Ce dont vous avez besoin">
            {BESOINS.map((b) => (
              <Chip key={b} name="besoin" value={b} type="checkbox" />
            ))}
          </div>
          <div className="pb-chips-lbl pb-cap">Budget indicatif · ordre de grandeur, HTVA</div>
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
        hint="Facultatif, deux lignes suffisent."
      >
        <div>
          <textarea
            id="projet"
            name="projet"
            className="pb-textarea"
            placeholder="Ex. : « Agence immobilière à Waremme. Nos biens sont sur le portail, le site date de 2016, et personne ne nous demande d'estimation. »"
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
          <div className="pb-chips-lbl pb-cap">Comment m&apos;avez-vous trouvé&nbsp;? · facultatif</div>
          <div className="pb-chips" role="radiogroup" aria-label="Comment m'avez-vous trouvé ?">
            {TROUVE.map((t) => (
              <Chip key={t} name="trouve" value={t} type="radio" />
            ))}
          </div>
        </div>
      </Field>

      <button type="submit" className="pb-submit" disabled={state.submitting}>
        {state.submitting ? "Envoi en cours…" : "Envoyer, réponse sous 24 h ouvrées"}
      </button>

      <p className="pb-form-note">Pas de newsletter, pas de démarchage.</p>

      <ValidationError errors={state.errors} className="pb-form-err" />
      {state.errors && (
        <p className="pb-form-note">
          L&apos;envoi n&apos;est pas passé&nbsp;? Écrivez-moi directement à{" "}
          <a href={`mailto:${MAIL}`}>{MAIL}</a>, ça arrive au même endroit.
        </p>
      )}
    </form>
  );
}
