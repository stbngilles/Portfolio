import Link from "next/link";
import type { ReactNode } from "react";
import type { SuiviElement } from "@prisma/client";
import type { Contenu } from "@/lib/suivi/paquet";
import { SANS_BESOIN } from "@/lib/suivi/presentation";
import { AdminAjoutElement, AdminElement } from "./Admin";
import { AvecLiens, Badge, Carte, Icone, TitreSection, boutonPrimaire, boutonSecondaire, libelleStatut, tonStatut } from "./ui";

/**
 * Vues communes aux deux interfaces d'un espace de suivi : celle du client
 * (`/suivi/<slug>`) et celle de l'admin (`/suivi/<slug>/admin`). Même
 * charpente, même lecture des données ; seuls les gestes changent.
 */

export type Lecteur = "client" | "admin";

export const dateCourte = (d: Date) =>
  d.toLocaleDateString("fr-BE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Brussels" });

/** « il y a 3 jours », pour dire depuis quand une demande attend. */
export function depuis(d: Date) {
  const jours = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  return jours <= 0 ? "aujourd'hui" : jours === 1 ? "hier" : `il y a ${jours} jours`;
}

/** Vrai si la date tombe dans les `jours` derniers jours. */
export const recent = (d: Date, jours: number) => Date.now() - d.getTime() < jours * 86_400_000;

function grouper(els: SuiviElement[]) {
  const g = new Map<string, SuiviElement[]>();
  for (const e of els) g.set(e.groupe, [...(g.get(e.groupe) ?? []), e]);
  return [...g];
}

// ================================================================= charpente

export function EnTete({ gauche, droite }: { gauche: ReactNode; droite: ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        Aller au contenu
      </a>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">{gauche}</div>
          <div className="flex items-center gap-1">{droite}</div>
        </div>
      </header>
    </>
  );
}

export const lienEnTete =
  "inline-flex min-h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm text-muted hover:bg-bg hover:text-ink";

export function Onglets<T extends string>({
  base,
  onglets,
  actif,
  compteurs,
}: {
  base: string;
  onglets: readonly { id: T; label: string }[];
  actif: T;
  compteurs: Partial<Record<T, number>>;
}) {
  return (
    <nav aria-label="Sections" className="mt-8 border-b border-line">
      {/* Sur mobile les onglets passent à la ligne : aucun ne se cache hors écran. */}
      <ul className="-mb-px flex flex-wrap gap-x-1">
        {onglets.map((o) => {
          const on = o.id === actif;
          return (
            <li key={o.id}>
              <Link
                href={`${base}?onglet=${o.id}`}
                aria-current={on ? "page" : undefined}
                scroll={false}
                className={`flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-[15px] transition-colors ${
                  on ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:border-line hover:text-ink"
                }`}
              >
                {o.label}
                {compteurs[o.id] !== undefined && (
                  <span className="rounded-full bg-[#ECEBE7] px-1.5 text-xs tabular-nums text-muted">{compteurs[o.id]}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const TONS_COMPTEUR = {
  vert: "text-[#1B5E2E] bg-[#E4F2E7]",
  bleu: "text-accent bg-accent-soft",
  ambre: "text-[#7A4A00] bg-[#FCEFD6]",
  gris: "text-ink bg-[#ECEBE7]",
};

export function Compteur(props: {
  href: string;
  icone: "check" | "horloge" | "main" | "message" | "envoi";
  ton: keyof typeof TONS_COMPTEUR;
  valeur: number;
  label: string;
}) {
  return (
    <Link
      href={props.href}
      scroll={false}
      aria-label={`${props.valeur} ${props.label}`}
      className="group flex items-center gap-3 rounded-xl border border-line bg-white p-4 transition-colors hover:border-ink/30"
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${TONS_COMPTEUR[props.ton]}`}>
        <Icone nom={props.icone} className="size-5" />
      </span>
      <span>
        <span className="block text-2xl font-semibold leading-none tabular-nums">{props.valeur}</span>
        <span className="mt-1 block text-sm text-muted group-hover:text-ink">{props.label}</span>
      </span>
    </Link>
  );
}

export function Numero({ n }: { n: number }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#7A4A00] text-sm font-semibold text-white tabular-nums">
      {n}
    </span>
  );
}

export function Intro({ children }: { children: ReactNode }) {
  return <p className="mb-8 max-w-2xl text-[15px] text-muted">{children}</p>;
}

export function Avancement({ livres, total }: { livres: number; total: number }) {
  const pct = total ? Math.round((livres / total) * 100) : 0;
  return (
    <Carte className="p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[15px]">
          <strong className="font-semibold">{livres}</strong> éléments livrés sur {total}
        </p>
        <p className="text-sm tabular-nums text-muted">{pct} %</p>
      </div>
      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#ECEBE7]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Part des éléments livrés"
      >
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </Carte>
  );
}

// ================================================================= livré

export function Livre({ slug, admin, elements }: { slug: string; admin?: boolean; elements: SuiviElement[] }) {
  return (
    <>
      <Intro>
        {admin
          ? "Ce qui est en ligne et vérifié. Ajoute une ligne à chaque livraison, ou passe-la depuis « En cours » avec « Marquer livré »."
          : "Ce qui est en ligne, vérifié en production. Si un point ne correspond pas à ce que tu vois, fais-moi une demande."}
      </Intro>
      <div className="space-y-8">
        {grouper(elements).map(([groupe, els]) => (
          <section key={groupe}>
            <TitreSection>{groupe}</TitreSection>
            <Carte>
              <ul className="divide-y divide-line">
                {els.map((e) => (
                  <li key={e.id} className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E4F2E7] text-[#1B5E2E]">
                        <Icone nom="check" className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <p className="font-medium">{e.titre}</p>
                          {e.date && <p className="text-sm tabular-nums text-muted">Vérifié le {e.date}</p>}
                        </div>
                        {e.detail && (
                          <p className="mt-1 text-[15px] [overflow-wrap:anywhere]">
                            <AvecLiens texte={e.detail} />
                          </p>
                        )}
                        {e.remarque && <p className="mt-1 text-[15px] text-muted">{e.remarque}</p>}
                        {e.devis && <p className="mt-1.5 text-[13px] text-subtle">Devis : {e.devis}</p>}
                      </div>
                    </div>
                    {admin && <AdminElement slug={slug} e={e} />}
                  </li>
                ))}
              </ul>
            </Carte>
          </section>
        ))}
      </div>
      {admin && <AdminAjoutElement slug={slug} etat="LIVRE" />}
    </>
  );
}

// ================================================================= en cours

export function EnCours({
  slug,
  admin,
  prenom,
  elements,
}: {
  slug: string;
  admin?: boolean;
  prenom: string;
  elements: SuiviElement[];
}) {
  const lecteur: Lecteur = admin ? "admin" : "client";
  return (
    <>
      <Intro>
        {admin
          ? `Ce qui n'est pas encore en ligne. Le cadre orange, c'est ce que ${prenom} doit te fournir : il le voit aussi.`
          : "Ce qui n'est pas encore en ligne, avec une date. Quand j'ai besoin de toi, c'est écrit dans le cadre orange : tant que ce n'est pas fait, la date recule d'autant."}
      </Intro>
      <div className="space-y-8">
        {grouper(elements).map(([groupe, els]) => (
          <section key={groupe}>
            <TitreSection>{groupe}</TitreSection>
            <Carte>
              <ul className="divide-y divide-line">
                {els.map((e) => (
                  <li key={e.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-medium">{e.titre}</p>
                      <Badge ton={tonStatut(e.statut)}>{libelleStatut(e.statut, lecteur, prenom)}</Badge>
                    </div>
                    {e.detail && <p className="mt-1 text-[15px] text-muted">{e.detail}</p>}
                    {!SANS_BESOIN(e.besoin) && (
                      <p className="mt-2 rounded-lg border border-[#F0D59E] bg-[#FCEFD6]/60 px-3 py-2 text-[15px]">
                        <span className="font-medium text-[#7A4A00]">
                          {admin ? `À fournir par ${prenom} : ` : "J'ai besoin de toi : "}
                        </span>
                        {e.besoin}
                      </p>
                    )}
                    {e.remarque && <p className="mt-1.5 text-[15px] text-muted">{e.remarque}</p>}
                    <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
                      {e.date && (
                        <div className="flex gap-1">
                          <dt>Prévu :</dt>
                          <dd className="text-ink">{e.date}</dd>
                        </div>
                      )}
                      {e.devis && (
                        <div className="flex gap-1">
                          <dt>Dans le devis :</dt>
                          <dd className="text-ink">{e.devis}</dd>
                        </div>
                      )}
                    </dl>
                    {admin && <AdminElement slug={slug} e={e} />}
                  </li>
                ))}
              </ul>
            </Carte>
          </section>
        ))}
      </div>
      {admin && <AdminAjoutElement slug={slug} etat="EN_COURS" />}
    </>
  );
}

// ================================================================= devis et prix

export function DevisPrix({ slug, contenu, admin }: { slug: string; contenu: Contenu; admin?: boolean }) {
  const h = contenu.hebergement;
  return (
    <div className="space-y-10">
      <section aria-labelledby="tarifs">
        <TitreSection>
          <span id="tarifs">{admin ? "Tarifs affichés" : "Tes tarifs"}</span>
        </TitreSection>
        <div className="grid gap-3 md:grid-cols-3">
          {contenu.tarifs.map((t) => (
            <Carte key={t.libelle} className="p-5">
              <p className="text-sm font-medium text-muted">{t.libelle}</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.02em] tabular-nums">{t.montant}</p>
              <p className="text-sm text-muted">{t.precision}</p>
              {t.detail && <p className="mt-3 border-t border-line pt-3 text-[15px]">{t.detail}</p>}
            </Carte>
          ))}
          {h && (
            <Carte className="flex flex-col border-accent/40 p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-accent">
                <Icone nom="serveur" /> Conseillé : {h.libelle.replace(/^Hébergement /, "hébergement ")}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.02em] tabular-nums">{h.montant}</p>
              <p className="text-sm text-muted">{h.precision}</p>
              <p className="mt-3 border-t border-line pt-3 text-[15px]">{h.texte}</p>
              <a href={h.lien} target="_blank" rel="noopener noreferrer" className={`${boutonPrimaire} mt-4 w-full`}>
                {h.bouton} <Icone nom="externe" />
              </a>
            </Carte>
          )}
        </div>
        {contenu.tva && <p className="mt-3 text-sm text-muted">{contenu.tva}</p>}
      </section>

      <section aria-labelledby="devis">
        <TitreSection>
          <span id="devis">Devis</span>
        </TitreSection>
        <div className="grid gap-4 lg:grid-cols-2">
          {contenu.devis.map((d) => (
            <Carte key={d.numero} className="flex flex-col p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icone nom="fichier" className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted">Devis {d.numero}</p>
                  <h3 className="font-semibold">{d.titre}</h3>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted">Émis le</dt>
                  <dd className="tabular-nums">{d.emis}</dd>
                </div>
                <div>
                  <dt className="text-muted">Valable jusqu&apos;au</dt>
                  <dd className="tabular-nums">{d.valide}</dd>
                </div>
              </dl>
              <ul className="mt-4 flex-1 space-y-1.5 border-t border-line pt-4 text-[15px]">
                {d.lignes.map((l) => (
                  <li key={l} className="flex gap-2">
                    <span className="mt-2.5 size-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
                    {l}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p>
                  <span className="text-sm text-muted">Total </span>
                  <span className="text-lg font-semibold tabular-nums">{d.total}</span>
                </p>
                <a href={`/suivi/${slug}/documents/${d.fichier}`} target="_blank" className={boutonSecondaire}>
                  <Icone nom="telecharger" /> Télécharger le PDF
                </a>
              </div>
            </Carte>
          ))}
        </div>
      </section>
    </div>
  );
}

// ================================================================= échanges

/** Bloc « réponse » sous une demande : la mienne ou celle du client. */
export function Reponse({ titre, children, ton = "gris" }: { titre: string; children: ReactNode; ton?: "gris" | "bleu" }) {
  return (
    <div className={`mt-3 rounded-lg px-4 py-3 ${ton === "bleu" ? "bg-accent-soft/50" : "bg-bg"}`}>
      <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-muted">{titre}</p>
      <div className="mt-1 text-[15px]">{children}</div>
    </div>
  );
}

export function Meta({ items }: { items: [string, ReactNode][] }) {
  const pleins = items.filter(([, v]) => v);
  if (!pleins.length) return null;
  return (
    <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
      {pleins.map(([k, v]) => (
        <div key={k} className="flex gap-1">
          <dt>{k}</dt>
          <dd className="tabular-nums text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
