import Link from "next/link";
import { notFound } from "next/navigation";
import type { SuiviDemande } from "@prisma/client";
import { prisma } from "@/lib/db";
import { lireAcces } from "@/lib/suivi/acces";
import type { Contenu } from "@/lib/suivi/paquet";
import { ATTENTE_CLIENT, SANS_BESOIN, construireDiapos } from "@/lib/suivi/presentation";
import { Connexion } from "@/components/suivi/Connexion";
import { FormDemande } from "@/components/suivi/FormDemande";
import { Presentation } from "@/components/suivi/Presentation";
import {
  Avancement,
  Compteur,
  DevisPrix,
  EnCours,
  EnTete,
  Livre,
  Meta,
  Numero,
  Onglets,
  Reponse,
  dateCourte,
  lienEnTete,
} from "@/components/suivi/vues";
import {
  Badge,
  Carte,
  Icone,
  TitreSection,
  Vide,
  boutonPrimaire,
  boutonSecondaire,
  champ,
  libelleStatut,
  tonPriorite,
  tonStatut,
} from "@/components/suivi/ui";
import { envoyerMot, marquerFait, refuser, seDeconnecter, valider } from "./actions";

/**
 * Interface du client : ce que je lui demande, ce qu'il me demande, ce qui
 * est livré, ce qui reste, les devis. Tutoiement : le client est un proche.
 * L'admin peut l'ouvrir pour la voir telle quelle, sans y agir.
 */

export const dynamic = "force-dynamic";

const ONGLETS = [
  { id: "accueil", label: "Accueil" },
  { id: "pour-toi", label: "Ce que je te demande" },
  { id: "demandes", label: "Tes demandes" },
  { id: "livre", label: "Livré" },
  { id: "en-cours", label: "En cours" },
  { id: "devis", label: "Devis et prix" },
] as const;
type Onglet = (typeof ONGLETS)[number]["id"];

/** Ce qui attend un geste du client : mes demandes, et les prix proposés sur les siennes. */
const attendClient = (d: SuiviDemande) =>
  (d.sens === "PIXELBRUTE" && d.statut === "En attente") || (d.sens === "CLIENT" && d.statut === "Attente confirmation");

export default async function PageClient({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ onglet?: string; presentation?: string }>;
}) {
  const { slug } = await params;
  const acces = await lireAcces(slug);
  if (!acces) notFound();

  if (!acces.ouvert) {
    const p = acces.importe ? await prisma.suiviProjet.findUnique({ where: { slug }, select: { nom: true } }) : null;
    // Avant l'import, le nom n'est lisible que dans le paquet chiffré : on le déduit du slug.
    const nom = p?.nom ?? slug.split("-").map((m) => m[0].toUpperCase() + m.slice(1)).join(" ");
    return <Connexion slug={slug} nom={nom} />;
  }

  const q = await searchParams;
  const onglet: Onglet = ONGLETS.some((o) => o.id === q.onglet) ? (q.onglet as Onglet) : "accueil";

  const projet = await prisma.suiviProjet.findUniqueOrThrow({
    where: { slug },
    include: {
      elements: { orderBy: { ordre: "asc" } },
      demandes: { orderBy: { createdAt: "asc" } },
    },
  });
  const contenu = projet.contenu as unknown as Contenu;
  const prenom = contenu.contact ?? "";
  const moi = contenu.moi ?? "Pixelbrute";
  const base = `/suivi/${slug}`;
  // L'admin qui regarde la page du client : il voit tout, mais ne clique pas à sa place.
  const apercu = acces.admin && !acces.client;

  const livres = projet.elements.filter((e) => e.etat === "LIVRE");
  const enCours = projet.elements.filter((e) => e.etat === "EN_COURS");
  const pourToi = projet.demandes.filter(attendClient);
  const mesDemandes = projet.demandes.filter((d) => d.sens === "PIXELBRUTE").reverse();
  const tesDemandes = projet.demandes.filter((d) => d.sens === "CLIENT").reverse();
  const tesOuvertes = tesDemandes.filter((d) => !["Fait", "Refusée"].includes(d.statut));
  const attentes = enCours.filter((e) => e.statut === "Attente client" && !SANS_BESOIN(e.besoin));
  const deMonCote = enCours.filter((e) => !ATTENTE_CLIENT.includes(e.statut ?? "") && e.statut !== "Non commandé");
  const majLe = [projet.updatedAt, ...projet.elements.map((e) => e.updatedAt), ...projet.demandes.map((d) => d.updatedAt)].reduce(
    (a, b) => (b > a ? b : a),
  );

  // S'ouvre seule à la première visite du client ; ensuite, sur demande (lien d'en-tête).
  const presentation =
    q.presentation === "1" || (acces.client && !acces.admin && !projet.presentationVueLe)
      ? construireDiapos({ nom: projet.nom, livres, enCours, pourToi, attentes, presentation: contenu.presentation })
      : null;

  return (
    <>
      {presentation && <Presentation key={q.presentation ?? "accueil"} slug={slug} nom={projet.nom} diapos={presentation} />}

      <EnTete
        gauche={
          <>
            <span className="text-sm font-semibold">Pixelbrute</span>
            <span className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
            <span className="hidden truncate text-sm text-muted sm:inline">Suivi du site {projet.nom}</span>
          </>
        }
        droite={
          <>
            <Link href={`${base}?presentation=1`} scroll={false} className={lienEnTete}>
              <span className="sm:hidden">Présentation</span>
              <span className="hidden sm:inline">Revoir la présentation</span>
            </Link>
            {projet.site && (
              <a href={projet.site} target="_blank" rel="noopener noreferrer" className={`${lienEnTete} hidden sm:inline-flex`}>
                Voir le site <Icone nom="externe" className="size-3.5" />
              </a>
            )}
            {acces.client && (
              <form action={seDeconnecter}>
                <input type="hidden" name="slug" value={slug} />
                <button type="submit" className={lienEnTete} aria-label="Se déconnecter">
                  <Icone nom="sortie" /> <span className="hidden sm:inline">Se déconnecter</span>
                </button>
              </form>
            )}
          </>
        }
      />

      {apercu && (
        <div className="border-b border-accent/20 bg-accent-soft/60">
          <p className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm text-accent-ink sm:px-6">
            <span>Aperçu : tu vois la page de {prenom || "ton client"} telle qu&apos;il la voit. Les boutons sont désactivés.</span>
            <Link href={`${base}/admin`} className="font-medium underline underline-offset-2">
              Retour à mon interface
            </Link>
          </p>
        </div>
      )}

      <main id="contenu" className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{prenom ? `Salut ${prenom}.` : projet.nom}</h1>
            <p className="mt-1 text-[15px] text-muted">
              Le suivi du site {projet.nom}, mis à jour le {dateCourte(majLe)}. Je fais le point chaque vendredi.
            </p>
          </div>
          <Link href={`${base}?onglet=demandes#nouvelle`} className={boutonPrimaire}>
            <Icone nom="plus" /> Nouvelle demande
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Compteur href={`${base}?onglet=pour-toi`} icone="main" ton="ambre" valeur={pourToi.length} label="Je te demande" />
          <Compteur href={`${base}?onglet=demandes`} icone="message" ton="gris" valeur={tesOuvertes.length} label="Tes demandes en cours" />
          <Compteur href={`${base}?onglet=livre`} icone="check" ton="vert" valeur={livres.length} label="Livrés" />
          <Compteur href={`${base}?onglet=en-cours`} icone="horloge" ton="bleu" valeur={enCours.length} label="En cours" />
        </div>

        <Onglets
          base={base}
          onglets={ONGLETS}
          actif={onglet}
          compteurs={{ "pour-toi": pourToi.length, demandes: tesOuvertes.length, livre: livres.length, "en-cours": enCours.length }}
        />

        <div className="mt-8">
          {onglet === "accueil" && (
            <div className="space-y-10">
              <BlocPourToi slug={slug} moi={moi} demandes={pourToi} apercu={apercu} />

              <section aria-labelledby="avancement">
                <TitreSection>
                  <span id="avancement">Avancement</span>
                </TitreSection>
                <Avancement livres={livres.length} total={livres.length + enCours.length} />
              </section>

              <div className="grid gap-10 lg:grid-cols-2">
                <section aria-labelledby="attentes">
                  <TitreSection>
                    <span id="attentes">J&apos;attends aussi de toi</span>
                  </TitreSection>
                  {attentes.length === 0 ? (
                    <Vide>Rien d&apos;autre.</Vide>
                  ) : (
                    <Carte>
                      <ul className="divide-y divide-line">
                        {attentes.map((e) => (
                          <li key={e.id} className="px-5 py-4">
                            <p className="font-medium">{e.titre}</p>
                            <p className="mt-0.5 text-[15px] text-muted">{e.besoin}</p>
                          </li>
                        ))}
                      </ul>
                    </Carte>
                  )}
                </section>
                <section aria-labelledby="mon-cote">
                  <TitreSection>
                    <span id="mon-cote">De mon côté</span>
                  </TitreSection>
                  {deMonCote.length === 0 ? (
                    <Vide>Tout est à jour de mon côté.</Vide>
                  ) : (
                    <Carte>
                      <ul className="divide-y divide-line">
                        {deMonCote.map((e) => (
                          <li key={e.id} className="flex items-start justify-between gap-3 px-5 py-4">
                            <div>
                              <p className="font-medium">{e.titre}</p>
                              {e.date && <p className="mt-0.5 text-sm text-muted">Prévu : {e.date}</p>}
                            </div>
                            <Badge ton={tonStatut(e.statut)}>{libelleStatut(e.statut)}</Badge>
                          </li>
                        ))}
                      </ul>
                    </Carte>
                  )}
                </section>
              </div>

              <section aria-labelledby="dernieres">
                <TitreSection
                  action={
                    <Link href={`${base}?onglet=demandes`} className="text-sm font-medium text-accent hover:underline">
                      Toutes tes demandes
                    </Link>
                  }
                >
                  <span id="dernieres">Tes dernières demandes</span>
                </TitreSection>
                {tesDemandes.length === 0 ? (
                  <Vide>Tu ne m&apos;as encore rien demandé.</Vide>
                ) : (
                  <Carte>
                    <ul className="divide-y divide-line">
                      {tesDemandes.slice(0, 4).map((d) => (
                        <li key={d.id} className="flex items-start justify-between gap-3 px-5 py-4">
                          <div className="min-w-0">
                            <p className="font-medium [overflow-wrap:anywhere]">{d.texte}</p>
                            <p className="mt-0.5 text-sm text-muted">{dateCourte(d.createdAt)}</p>
                          </div>
                          <Badge ton={tonStatut(d.statut)}>{libelleStatut(d.statut)}</Badge>
                        </li>
                      ))}
                    </ul>
                  </Carte>
                )}
              </section>
            </div>
          )}

          {onglet === "pour-toi" && (
            <div className="space-y-10">
              <BlocPourToi slug={slug} moi={moi} demandes={pourToi} apercu={apercu} />
              <HistoriquePourToi demandes={mesDemandes.filter((d) => d.statut !== "En attente")} />
            </div>
          )}

          {onglet === "demandes" && <TesDemandes slug={slug} moi={moi} demandes={tesDemandes} apercu={apercu} />}
          {onglet === "livre" && <Livre slug={slug} elements={livres} />}
          {onglet === "en-cours" && <EnCours slug={slug} prenom={prenom} elements={enCours} />}
          {onglet === "devis" && <DevisPrix slug={slug} contenu={contenu} />}
        </div>
      </main>
    </>
  );
}

// ================================================================= ce que je te demande

function BlocPourToi({ slug, moi, demandes, apercu }: { slug: string; moi: string; demandes: SuiviDemande[]; apercu: boolean }) {
  return (
    <section aria-labelledby="pour-toi">
      <Carte className="overflow-hidden border-[#F0D59E]">
        <div className="border-b border-[#F0D59E] bg-[#FCEFD6] px-5 py-4">
          <h2 id="pour-toi" className="flex items-center gap-2 text-lg font-semibold text-[#5C3700]">
            <Icone nom="main" className="size-5" /> Ce que je te demande
          </h2>
          <p className="mt-0.5 text-[15px] text-[#7A4A00]">Dans l&apos;ordre. Un clic suffit, je suis prévenu tout de suite.</p>
        </div>
        {demandes.length === 0 ? (
          <p className="px-5 py-6 text-muted">Rien pour l&apos;instant. Merci !</p>
        ) : (
          <ol className="divide-y divide-line">
            {demandes.map((d, i) => (
              <li key={d.id} className="flex gap-3 px-5 py-5">
                <Numero n={i + 1} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {d.texte}
                    {d.prix && <span className="ml-2 whitespace-nowrap font-semibold tabular-nums">{d.prix} HTVA</span>}
                  </p>
                  {/* Ma demande porte son explication ; sa demande à lui, ma réponse avec le prix. */}
                  {(d.detail || d.reponse) && (
                    <p className="mt-1 max-w-prose whitespace-pre-line text-[15px] text-muted">{d.detail ?? d.reponse}</p>
                  )}
                  {d.reponseClient && (
                    <Reponse titre="Ton dernier mot">
                      <p className="whitespace-pre-line">{d.reponseClient}</p>
                    </Reponse>
                  )}
                  <GesteClient slug={slug} moi={moi} d={d} apercu={apercu} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </Carte>
    </section>
  );
}

/** Les boutons du client : valider ou refuser un prix, dire « c'est fait », laisser un mot. */
function GesteClient({ slug, moi, d, apercu }: { slug: string; moi: string; d: SuiviDemande; apercu: boolean }) {
  return (
    <form className="mt-4 space-y-3">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="id" value={d.id} />
      <label className="block max-w-xl">
        <span className="mb-1.5 block text-sm font-medium">
          Un mot pour {moi} <span className="font-normal text-muted">(facultatif)</span>
        </span>
        <textarea name="mot" rows={2} disabled={apercu} className={`${champ} resize-y`} />
      </label>
      <div className="flex flex-wrap gap-2">
        {d.prix ? (
          <>
            <button type="submit" formAction={valider} disabled={apercu} className={boutonPrimaire}>
              <Icone nom="check" /> Je valide
            </button>
            <button type="submit" formAction={refuser} disabled={apercu} className={boutonSecondaire}>
              Je refuse
            </button>
          </>
        ) : (
          <>
            <button type="submit" formAction={marquerFait} disabled={apercu} className={boutonPrimaire}>
              <Icone nom="check" /> C&apos;est fait
            </button>
            <button type="submit" formAction={envoyerMot} disabled={apercu} className={boutonSecondaire}>
              Envoyer juste mon mot
            </button>
          </>
        )}
      </div>
    </form>
  );
}

function HistoriquePourToi({ demandes }: { demandes: SuiviDemande[] }) {
  if (!demandes.length) return null;
  return (
    <section>
      <TitreSection>
        Déjà réglé <span className="font-normal text-muted">({demandes.length})</span>
      </TitreSection>
      <Carte>
        <ul className="divide-y divide-line">
          {demandes.map((d) => (
            <li key={d.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium">
                  {d.texte}
                  {d.prix && <span className="ml-2 whitespace-nowrap tabular-nums text-muted">{d.prix} HTVA</span>}
                </p>
                <Badge ton={tonStatut(d.statut)}>{libelleStatut(d.statut)}</Badge>
              </div>
              {d.reponseClient && <p className="mt-1 text-[15px] text-muted">Ton mot : {d.reponseClient}</p>}
              <Meta items={[["Le", d.traiteLe ? dateCourte(d.traiteLe) : null]]} />
            </li>
          ))}
        </ul>
      </Carte>
    </section>
  );
}

// ================================================================= tes demandes

function TesDemandes({ slug, moi, demandes, apercu }: { slug: string; moi: string; demandes: SuiviDemande[]; apercu: boolean }) {
  const ouvertes = demandes.filter((d) => !["Fait", "Refusée"].includes(d.statut));
  const traitees = demandes.filter((d) => ["Fait", "Refusée"].includes(d.statut));

  return (
    <div className="space-y-10">
      <section id="nouvelle" aria-labelledby="titre-nouvelle" className="scroll-mt-6">
        <Carte className="p-5 sm:p-6">
          <h2 id="titre-nouvelle" className="text-lg font-semibold">
            Nouvelle demande
          </h2>
          <p className="mb-5 mt-0.5 text-[15px] text-muted">
            Tout ce que tu veux voir changer, ajouter ou corriger. Je te réponds ici : compris dans le devis ou non, et
            le prix s&apos;il y en a un.
          </p>
          {apercu ? <Vide>Formulaire désactivé en aperçu.</Vide> : <FormDemande slug={slug} />}
        </Carte>
      </section>

      <ListeTesDemandes titre="En cours" slug={slug} moi={moi} demandes={ouvertes} apercu={apercu} vide="Aucune demande en cours." />
      {traitees.length > 0 && <ListeTesDemandes titre="Traitées" slug={slug} moi={moi} demandes={traitees} apercu={apercu} />}
    </div>
  );
}

function ListeTesDemandes({
  titre,
  slug,
  moi,
  demandes,
  apercu,
  vide,
}: {
  titre: string;
  slug: string;
  moi: string;
  demandes: SuiviDemande[];
  apercu: boolean;
  vide?: string;
}) {
  return (
    <section>
      <TitreSection>
        {titre} <span className="font-normal text-muted">({demandes.length})</span>
      </TitreSection>
      {demandes.length === 0 ? (
        <Vide>{vide}</Vide>
      ) : (
        <div className="space-y-3">
          {demandes.map((d) => (
            <Carte key={d.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <span className="tabular-nums">{dateCourte(d.createdAt)}</span>
                <span className="ml-auto flex gap-2">
                  <Badge ton={tonPriorite(d.priorite)}>{d.priorite}</Badge>
                  <Badge ton={tonStatut(d.statut)}>{libelleStatut(d.statut)}</Badge>
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-[15px] font-medium [overflow-wrap:anywhere]">{d.texte}</p>
              {(d.reponse || d.dansDevis || d.prix) && (
                <Reponse titre={`Réponse de ${moi}`}>
                  {d.reponse && <p className="whitespace-pre-line">{d.reponse}</p>}
                  <Meta
                    items={[
                      ["Dans le devis :", d.dansDevis],
                      ["Prix :", d.prix ? `${d.prix} HTVA` : null],
                      ["Mis à jour le", d.traiteLe ? dateCourte(d.traiteLe) : null],
                    ]}
                  />
                </Reponse>
              )}
              {d.reponseClient && (
                <Reponse titre="Ton mot">
                  <p className="whitespace-pre-line">{d.reponseClient}</p>
                </Reponse>
              )}
              {d.statut === "Attente confirmation" && <GesteClient slug={slug} moi={moi} d={d} apercu={apercu} />}
            </Carte>
          ))}
        </div>
      )}
    </section>
  );
}
