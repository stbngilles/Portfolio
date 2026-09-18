"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Arrow from "./Arrow";
import BookCall from "./BookCall";
import { trackEvent } from "./track";
import { readSource } from "./Consent";
import type { ChecklistSection, ScoreBand } from "./checklist-data";
import { requestRessource } from "@/app/(home)/ressources/[slug]/actions";

/**
 * La checklist, en deux temps.
 *
 * `ChecklistGate` : le formulaire. La liste part par e-mail, avec un lien
 * signé vers la version à cocher. Une fausse adresse ne reçoit rien.
 *
 * `ChecklistOpen` : la version à cocher, rendue seulement quand la page a
 * reçu un lien valide. Le contenu lui arrive en props depuis le serveur, il
 * n'est pas dans le JavaScript public de la page.
 *
 * Le navigateur garde le lien et les coches, ressource par ressource :
 * quelqu'un qui revient sur `/ressources/<slug>` retrouve sa liste là où il
 * l'a laissée, sans rouvrir l'e-mail. Rien de cela ne sort du navigateur.
 */

const storeKey = (slug: string) => `pb-ressource:${slug}`;

type Saved = { t: string; checks: number[] };

/*
 * Petit magasin sur `localStorage`, lu par `useSyncExternalStore` : le
 * serveur rend sa version, le navigateur bascule sans rendu en cascade.
 * `memory` prend le relais quand le stockage est bloqué (navigation privée),
 * le temps de la visite.
 */
const memory = new Map<string, string | null>();
const listeners = new Set<() => void>();

function read(slug: string) {
  try {
    return localStorage.getItem(storeKey(slug)) ?? memory.get(slug) ?? null;
  } catch {
    return memory.get(slug) ?? null;
  }
}

function write(slug: string, s: Saved | null) {
  const raw = s && JSON.stringify(s);
  memory.set(slug, raw);
  try {
    if (raw) localStorage.setItem(storeKey(slug), raw);
    else localStorage.removeItem(storeKey(slug));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribeStore(l: () => void) {
  listeners.add(l);
  window.addEventListener("storage", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", l);
  };
}

function parse(raw: string | null): Saved | null {
  try {
    const s = JSON.parse(raw ?? "null") as Partial<Saved> | null;
    if (typeof s?.t !== "string") return null;
    return { t: s.t, checks: Array.isArray(s.checks) ? s.checks : [] };
  } catch {
    return null;
  }
}

const useSaved = (slug: string) => {
  const raw = useSyncExternalStore(subscribeStore, () => read(slug), () => null);
  return useMemo(() => parse(raw), [raw]);
};

export function ChecklistGate({
  slug,
  expired,
}: {
  slug: string;
  /** La page a reçu un lien qui ne se vérifie plus : on l'oublie. */
  expired: boolean;
}) {
  const router = useRouter();
  const saved = useSaved(slug);
  const [sentTo, setSentTo] = useState("");
  const [last, setLast] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const shownAt = useRef(0);

  // Déjà reçue sur ce navigateur : retour direct à la liste.
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!saved) return;
    if (expired) write(slug, null);
    else router.replace(`/ressources/${slug}?t=${encodeURIComponent(saved.t)}`);
  }, [saved, expired, router, slug]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.set("provenance", readSource());
    data.set("elapsed", String(Date.now() - shownAt.current));
    setError("");
    start(async () => {
      try {
        const res = await requestRessource(data);
        if (!res.ok) return setError(res.error ?? "L'envoi n'est pas passé, réessaie.");
      } catch {
        return setError("L'envoi n'est pas passé, réessaie dans un instant.");
      }
      trackEvent("ressource_requested", { ressource: slug });
      setSentTo(String(data.get("email") ?? ""));
      setLast(String(data.get("email") ?? ""));
    });
  }

  // Le temps de la redirection, pas de formulaire qui clignote.
  if (saved && !expired) {
    return (
      <div className="pb-ck-card-form">
        <p className="pb-cap">Ouverture de ta checklist…</p>
      </div>
    );
  }

  if (sentTo) {
    return (
      <div className="pb-ck-card-form pb-ck-sent" role="status">
        <div className="pb-over">C&apos;est parti</div>
        <h2 className="pb-d-s">Regarde ta boîte mail.</h2>
        <p>
          La checklist arrive à <b>{sentTo}</b> dans la minute.
        </p>
        <p>Rien après cinq minutes&nbsp;? Jette un œil dans les indésirables.</p>
        <button type="button" className="pb-btn-line" onClick={() => setSentTo("")}>
          Corriger mon adresse
        </button>
      </div>
    );
  }

  return (
    <form className="pb-ck-card-form" data-clarity-mask="true" onSubmit={submit}>
      <div className="pb-ck-form-head">
        <h2 className="pb-d-s">Reçois la checklist.</h2>
        <p>Par e-mail, dans la minute. Avec la version à cocher.</p>
      </div>

      <input type="hidden" name="ressource" value={slug} />
      <div className="pb-ck-fields">
        <label className="pb-ck-field">
          <span className="pb-cap">Prénom</span>
          <input name="prenom" className="pb-input" required autoComplete="given-name" />
        </label>
        <label className="pb-ck-field">
          <span className="pb-cap">Nom</span>
          <input name="nom" className="pb-input" required autoComplete="family-name" />
        </label>
        <label className="pb-ck-field pb-ck-field-full">
          <span className="pb-cap">Adresse e-mail</span>
          <input name="email" type="email" className="pb-input" required autoComplete="email" defaultValue={last} />
        </label>
      </div>

      <label className="pb-ck-consent">
        <input type="checkbox" name="newsletter" value="oui" required />
        <span>
          J&apos;accepte de recevoir la newsletter de Pixelbrute par e-mail. Désinscription en un clic,
          dans chaque envoi.
        </span>
      </label>

      <button type="submit" className="pb-ck-submit" disabled={pending}>
        {pending ? "Envoi…" : "Recevoir la checklist"} <Arrow dir="e" />
      </button>

      {error && (
        <p className="pb-form-err" role="alert">
          {error}
        </p>
      )}
      <p className="pb-ck-legal">
        Ton adresse n&apos;est ni vendue ni partagée.{" "}
        <Link href="/confidentialite#newsletter">Confidentialité</Link>
      </p>
    </form>
  );
}

export function ChecklistOpen({
  slug,
  token,
  title,
  sections,
  bands,
}: {
  slug: string;
  token: string;
  title: string;
  sections: ChecklistSection[];
  bands: readonly ScoreBand[];
}) {
  const saved = useSaved(slug);
  const checks = useMemo(() => (saved?.t === token ? saved.checks : []), [saved, token]);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const first = sections.map((_, i) => sections.slice(0, i).reduce((n, s) => n + s.items.length, 1));

  // Le lien est gardé, puis retiré de la barre d'adresse : l'adresse seule
  // suffit désormais sur ce navigateur, et le jeton ne traîne pas en favori.
  useEffect(() => {
    if (parse(read(slug))?.t !== token) write(slug, { t: token, checks: [] });
    window.history.replaceState(null, "", `/ressources/${slug}`);
  }, [slug, token]);

  function toggle(n: number) {
    write(slug, { t: token, checks: checks.includes(n) ? checks.filter((x) => x !== n) : [...checks, n] });
  }

  const score = checks.length;
  const band = bands.find((b) => score >= b.min) ?? bands[bands.length - 1];
  const done = sections.map((sec, si) => sec.items.filter((_, ii) => checks.includes(first[si] + ii)).length);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <header className="pb-ck-hero">
        <div className="pb-over">Ta checklist · {total} points</div>
        <h1 className="pb-ck-h1">{title}</h1>
      </header>

      <ol className="pb-ck-steps">
        <li>
          <span className="pb-ck-step-n">01</span>
          <h2>Ouvre ton site</h2>
          <p>Sur ton ordinateur, puis sur ton téléphone.</p>
        </li>
        <li>
          <span className="pb-ck-step-n">02</span>
          <h2>Coche ce qui est vrai</h2>
          <p>Pas ce qui «&nbsp;pourrait passer&nbsp;».</p>
        </li>
        <li>
          <span className="pb-ck-step-n">03</span>
          <h2>Lis ton score</h2>
          <p>Il se calcule tout seul, à chaque coche.</p>
        </li>
      </ol>

      <div className="pb-ck-layout">
        <aside className="pb-ck-rail">
          <div className="pb-ck-meter" aria-live="polite">
            <span className="pb-cap">Ton score</span>
            <div className="pb-ck-meter-n">
              {score}
              <span>/{total}</span>
            </div>
            <div className="pb-ck-track" aria-hidden="true">
              <i style={{ transform: `scaleX(${score / total})` }} />
            </div>
          </div>
          <nav className="pb-ck-nav" aria-label="Parties de la checklist">
            <ol>
              {sections.map((sec, si) => (
                <li key={sec.title} data-full={done[si] === sec.items.length || undefined}>
                  <a href={`#ck-${si + 1}`}>
                    <span className="pb-ck-nav-n">{pad(si + 1)}</span>
                    <span className="pb-ck-nav-t">{sec.title}</span>
                    <span className="pb-ck-nav-c">
                      {done[si]}/{sec.items.length}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <button type="button" className="pb-ck-print" onClick={() => window.print()}>
            Imprimer ou enregistrer en PDF
          </button>
        </aside>

        <div className="pb-ck-main">
          {sections.map((sec, si) => (
            <section key={sec.title} id={`ck-${si + 1}`} className="pb-ck-sec">
              <header className="pb-ck-sec-head">
                <span className="pb-ck-sec-n" aria-hidden="true">
                  {pad(si + 1)}
                </span>
                <div>
                  <span className="pb-cap">
                    Partie {si + 1} sur {sections.length} · {sec.items.length} point{sec.items.length > 1 ? "s" : ""}
                  </span>
                  <h2 className="pb-ck-sec-t">{sec.title}</h2>
                  {sec.intro && <p className="pb-ck-sec-p">{sec.intro}</p>}
                </div>
              </header>

              <ol className="pb-ck-list">
                {sec.items.map((it, ii) => {
                  const num = first[si] + ii;
                  const on = checks.includes(num);
                  return (
                    <li key={num} className="pb-ck-card" data-on={on || undefined}>
                      <label className="pb-ck-head">
                        <input type="checkbox" checked={on} onChange={() => toggle(num)} />
                        <span className="pb-ck-box" aria-hidden="true" />
                        <span className="pb-ck-head-txt">
                          <span className="pb-ck-n">Point {pad(num)}</span>
                          <span className="pb-ck-t">{it.title}</span>
                        </span>
                      </label>
                      <div className="pb-ck-body">
                        <div className="pb-ck-why">
                          <span className="pb-cap">Pourquoi</span>
                          <p>{it.why}</p>
                        </div>
                        <div className="pb-ck-test">
                          <span className="pb-cap">Le test</span>
                          <p>{it.test}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}

          <section className="pb-ck-score" id="ck-score">
            <span className="pb-cap">Ton score</span>
            <div className="pb-ck-score-n">
              {score}
              <span>/{total}</span>
            </div>
            <p className="pb-ck-score-t">{band.text}</p>
            <ul className="pb-ck-bands">
              {bands.map((b) => (
                <li key={b.label} data-on={b === band || undefined}>
                  <span>{b.label}</span>
                  <p>{b.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="pb-ck-cta">
            <h2 className="pb-d-m">Tu vois les problèmes, mais pas le temps de les corriger&nbsp;?</h2>
            <p>Je regarde ton site avec toi pendant quinze minutes.</p>
            <p>Ce que je changerais en premier, dans quel ordre, et ce que ça coûterait.</p>
            <BookCall className="pb-btn-solid">
              Réserver 15 minutes avec Esteban <Arrow dir="ne" />
            </BookCall>
            <span className="pb-cap">Sans engagement. Tu repars avec un plan.</span>
          </section>
        </div>
      </div>
    </>
  );
}
