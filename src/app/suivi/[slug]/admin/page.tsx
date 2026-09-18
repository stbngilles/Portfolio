import Link from "next/link";
import { notFound } from "next/navigation";
import type { SuiviDemande } from "@prisma/client";
import { prisma } from "@/lib/db";
import { lireAcces } from "@/lib/suivi/acces";
import type { Contenu } from "@/lib/suivi/paquet";
import { ATTENTE_CLIENT } from "@/lib/suivi/presentation";
import { AdminMaDemande, AdminNouvelleDemande, AdminPresentation, AdminReponse } from "@/components/suivi/Admin";
import {
  Avancement,
  Compteur,
  DevisPrix,
  EnCours,
  EnTete,
  Intro,
  Livre,
  Meta,
  Onglets,
  Reponse,
  dateCourte,
  depuis,
  lienEnTete,
  recent,
} from "@/components/suivi/vues";
import { Badge, Carte, Icone, TitreSection, Vide, boutonPrimaire, libelleStatut, tonPriorite, tonStatut } from "@/components/suivi/ui";

/**
 * Interface de l'admin : ses demandes à traiter, ce que j'attends de lui,
 * ses réponses, et l'édition de tout le reste. Ouverte par la session
 * plateforme ADMIN, jamais par le mot de passe du client.
 */

export const dynamic = "force-dynamic";

const ONGLETS = [
  { id: "tableau", label: "Tableau de bord" },
  { id: "ses-demandes", label: "Ses demandes" },
  { id: "mes-demandes", label: "Mes demandes" },
  { id: "en-cours", label: "En cours" },
  { id: "livre", label: "Livré" },
  { id: "devis", label: "Devis et prix" },
] as const;
type Onglet = (typeof ONGLETS)[number]["id"];

const FINI = ["Fait", "Refusée"];
/** Ses demandes qui m'attendent : reçues, en cours, ou un prix qu'il vient de valider. */
const aTraiter = (d: SuiviDemande) => d.sens === "CLIENT" && ["Reçue", "En cours", "Validée"].includes(d.statut);
const chezLui = (d: SuiviDemande) =>
  (d.sens === "PIXELBRUTE" && d.statut === "En attente") || (d.sens === "CLIENT" && d.statut === "Attente confirmation");

export default async function PageAdmin({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { slug } = await params;
  const acces = await lireAcces(slug);
  if (!acces) notFound();
  const base = `/suivi/${slug}/admin`;

  if (!acces.admin) {
    return (
      <Porte titre="Espace réservé">
        Cette page est ton interface de suivi. Connecte-toi d&apos;abord à la plateforme avec ton compte administrateur,
        puis reviens ici.
        <Link href="/app/login" className={`${boutonPrimaire} mt-6 w-full`}>
          Me connecter
        </Link>
      </Porte>
    );
  }
  if (!acces.importe) {
    return (
      <Porte titre="Pas encore ouvert">
        Le contenu arrive dans la base à la première connexion avec le mot de passe du client. Ouvre sa page une fois et
        entre-le.
        <Link href={`/suivi/${slug}`} className={`${boutonPrimaire} mt-6 w-full`}>
          Ouvrir sa page
        </Link>
      </Porte>
    );
  }

  const q = await searchParams;
  const onglet: Onglet = ONGLETS.some((o) => o.id === q.onglet) ? (q.onglet as Onglet) : "tableau";

  const projet = await prisma.suiviProjet.findUniqueOrThrow({
    where: { slug },
    include: {
      elements: { orderBy: { ordre: "asc" } },
      demandes: { orderBy: { createdAt: "asc" } },
    },
  });
  const contenu = projet.contenu as unknown as Contenu;
  const prenom = contenu.contact ?? "le client";

  const livres = projet.elements.filter((e) => e.etat === "LIVRE");
  const enCours = projet.elements.filter((e) => e.etat === "EN_COURS");
  const sesDemandes = projet.demandes.filter((d) => d.sens === "CLIENT").reverse();
  const mesDemandes = projet.demandes.filter((d) => d.sens === "PIXELBRUTE").reverse();
  const traiter = sesDemandes.filter(aTraiter);
  const attente = projet.demandes.filter(chezLui);
  const maListe = enCours.filter((e) => !ATTENTE_CLIENT.includes(e.statut ?? "") && e.statut !== "Non commandé");
  // Ses gestes des deux dernières semaines : ce qu'il a validé, refusé, fait, ou le mot qu'il m'a laissé.
  const reponses = projet.demandes
    .filter((d) => (d.reponseClient || (d.sens === "PIXELBRUTE" && d.statut !== "En attente")) && recent(d.updatedAt, 14))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <>
      <EnTete
        gauche={
          <>
            <span className="text-sm font-semibold">Pixelbrute</span>
            <span className="rounded bg-ink px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white">Admin</span>
            <span className="hidden truncate text-sm text-muted sm:inline">Suivi {projet.nom}</span>
          </>
        }
        droite={
          <>
            <Link href={`/suivi/${slug}`} className={lienEnTete}>
              <Icone nom="oeil" /> <span className="hidden sm:inline">Voir la page de {prenom}</span>
              <span className="sm:hidden">Sa page</span>
            </Link>
            <Link href="/app/admin" className={`${lienEnTete} hidden sm:inline-flex`}>
              Plateforme
            </Link>
          </>
        }
      />

      <main id="contenu" className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{projet.nom}</h1>
            <p className="mt-1 text-[15px] text-muted">Ton interface. {prenom} ne voit ni cette page ni ses formulaires.</p>
          </div>
          <Link href={`${base}?onglet=mes-demandes#nouvelle`} className={boutonPrimaire}>
            <Icone nom="envoi" /> Demander à {prenom}
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Compteur href={`${base}?onglet=ses-demandes`} icone="message" ton="bleu" valeur={traiter.length} label="À traiter" />
          <Compteur href={`${base}?onglet=mes-demandes`} icone="main" ton="ambre" valeur={attente.length} label={`Chez ${prenom}`} />
          <Compteur href={`${base}?onglet=en-cours`} icone="horloge" ton="gris" valeur={maListe.length} label="Ma liste" />
          <Compteur href={`${base}?onglet=livre`} icone="check" ton="vert" valeur={livres.length} label="Livrés" />
        </div>

        <Onglets
          base={base}
          onglets={ONGLETS}
          actif={onglet}
          compteurs={{ "ses-demandes": traiter.length, "mes-demandes": attente.length, "en-cours": enCours.length, livre: livres.length }}
        />

        <div className="mt-8">
          {onglet === "tableau" && (
            <div className="space-y-10">
              <section>
                <TitreSection>À traiter</TitreSection>
                {traiter.length === 0 ? (
                  <Vide>Aucune demande de {prenom} en attente de toi.</Vide>
                ) : (
                  <div className="space-y-3">
                    {traiter.map((d) => (
                      <CarteSaDemande key={d.id} slug={slug} prenom={prenom} d={d} ouvert={d.statut === "Reçue" && !d.reponse} />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <TitreSection>Ses réponses, 14 derniers jours</TitreSection>
                {reponses.length === 0 ? (
                  <Vide>Rien de neuf de sa part.</Vide>
                ) : (
                  <Carte>
                    <ul className="divide-y divide-line">
                      {reponses.map((d) => (
                        <li key={d.id} className="px-5 py-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="font-medium">
                              {d.texte}
                              {d.prix && <span className="ml-2 whitespace-nowrap tabular-nums text-muted">{d.prix} HTVA</span>}
                            </p>
                            <Badge ton={tonStatut(d.statut)}>{libelleStatut(d.statut, "admin", prenom)}</Badge>
                          </div>
                          {d.reponseClient && <p className="mt-1 text-[15px]">« {d.reponseClient} »</p>}
                          <p className="mt-1 text-sm text-muted">{depuis(d.updatedAt)}</p>
                        </li>
                      ))}
                    </ul>
                  </Carte>
                )}
              </section>

              <div className="grid gap-10 lg:grid-cols-2">
                <section>
                  <TitreSection>Chez {prenom}</TitreSection>
                  {attente.length === 0 ? (
                    <Vide>Il ne te doit rien.</Vide>
                  ) : (
                    <Carte>
                      <ul className="divide-y divide-line">
                        {attente.map((d) => (
                          <li key={d.id} className="px-5 py-4">
                            <p className="font-medium">
                              {d.texte}
                              {d.prix && <span className="ml-2 whitespace-nowrap tabular-nums text-muted">{d.prix} HTVA</span>}
                            </p>
                            <p className="mt-0.5 text-sm text-muted">Envoyée {depuis(d.createdAt)}</p>
                          </li>
                        ))}
                      </ul>
                    </Carte>
                  )}
                </section>
                <section>
                  <TitreSection
                    action={
                      <Link href={`${base}?onglet=en-cours`} className="text-sm font-medium text-accent hover:underline">
                        Modifier
                      </Link>
                    }
                  >
                    Ma liste
                  </TitreSection>
                  {maListe.length === 0 ? (
                    <Vide>Rien à faire de ton côté.</Vide>
                  ) : (
                    <Carte>
                      <ul className="divide-y divide-line">
                        {maListe.map((e) => (
                          <li key={e.id} className="flex items-start justify-between gap-3 px-5 py-4">
                            <div>
                              <p className="font-medium">{e.titre}</p>
                              {e.date && <p className="mt-0.5 text-sm text-muted">Prévu : {e.date}</p>}
                            </div>
                            <Badge ton={tonStatut(e.statut)}>{libelleStatut(e.statut, "admin", prenom)}</Badge>
                          </li>
                        ))}
                      </ul>
                    </Carte>
                  )}
                </section>
              </div>

              <section>
                <TitreSection>Avancement vu par {prenom}</TitreSection>
                <Avancement livres={livres.length} total={livres.length + enCours.length} />
                <AdminPresentation
                  slug={slug}
                  bonjour={contenu.presentation?.bonjour}
                  mot={contenu.presentation?.mot}
                  tu={contenu.presentation?.tu}
                  vueLe={projet.presentationVueLe}
                />
              </section>
            </div>
          )}

          {onglet === "ses-demandes" && (
            <>
              <Intro>
                Ce que {prenom} te demande. Réponds, dis si c&apos;est dans le devis, mets un prix sinon : il verra « Je
                valide / Je refuse ». Tu reçois un e-mail à chaque nouvelle demande.
              </Intro>
              {sesDemandes.length === 0 ? (
                <Vide>Il ne t&apos;a encore rien demandé.</Vide>
              ) : (
                <div className="space-y-3">
                  {[...sesDemandes.filter((d) => !FINI.includes(d.statut)), ...sesDemandes.filter((d) => FINI.includes(d.statut))].map((d) => (
                    <CarteSaDemande key={d.id} slug={slug} prenom={prenom} d={d} ouvert={d.statut === "Reçue" && !d.reponse} />
                  ))}
                </div>
              )}
            </>
          )}

          {onglet === "mes-demandes" && (
            <div className="space-y-10">
              <section id="nouvelle" className="scroll-mt-6">
                <Carte className="p-5 sm:p-6">
                  <h2 className="text-lg font-semibold">Nouvelle demande à {prenom}</h2>
                  <p className="mb-5 mt-0.5 text-[15px] text-muted">
                    Elle apparaît en tête de sa page, dans « Ce que je te demande ». Tutoie-le.
                  </p>
                  <AdminNouvelleDemande slug={slug} prenom={prenom} />
                </Carte>
              </section>
              <section>
                <TitreSection>
                  Envoyées <span className="font-normal text-muted">({mesDemandes.length})</span>
                </TitreSection>
                {mesDemandes.length === 0 ? (
                  <Vide>Aucune demande envoyée.</Vide>
                ) : (
                  <div className="space-y-3">
                    {mesDemandes.map((d) => (
                      <Carte key={d.id} className="p-5">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                          <span className="tabular-nums">{dateCourte(d.createdAt)}</span>
                          <span className="ml-auto flex gap-2">
                            <Badge ton={tonPriorite(d.priorite)}>{d.priorite}</Badge>
                            <Badge ton={tonStatut(d.statut)}>{libelleStatut(d.statut, "admin", prenom)}</Badge>
                          </span>
                        </div>
                        <p className="mt-2 text-[15px] font-medium">
                          {d.texte}
                          {d.prix && <span className="ml-2 whitespace-nowrap tabular-nums">{d.prix} HTVA</span>}
                        </p>
                        {d.detail && <p className="mt-1 whitespace-pre-line text-[15px] text-muted">{d.detail}</p>}
                        {d.reponseClient && (
                          <Reponse titre={`Mot de ${prenom}`} ton="bleu">
                            <p className="whitespace-pre-line">{d.reponseClient}</p>
                          </Reponse>
                        )}
                        <Meta items={[["Réglée le", d.statut !== "En attente" && d.traiteLe ? dateCourte(d.traiteLe) : null]]} />
                        <AdminMaDemande slug={slug} d={d} />
                      </Carte>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {onglet === "en-cours" && <EnCours slug={slug} admin prenom={prenom} elements={enCours} />}
          {onglet === "livre" && <Livre slug={slug} admin elements={livres} />}
          {onglet === "devis" && <DevisPrix slug={slug} contenu={contenu} admin />}
        </div>
      </main>
    </>
  );
}

function CarteSaDemande({ slug, prenom, d, ouvert }: { slug: string; prenom: string; d: SuiviDemande; ouvert: boolean }) {
  return (
    <Carte className="p-5">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <span className="tabular-nums">{dateCourte(d.createdAt)}</span>
        <span>· {depuis(d.createdAt)}</span>
        <span className="ml-auto flex gap-2">
          <Badge ton={tonPriorite(d.priorite)}>{d.priorite}</Badge>
          <Badge ton={tonStatut(d.statut)}>{libelleStatut(d.statut, "admin", prenom)}</Badge>
        </span>
      </div>
      <p className="mt-2 whitespace-pre-line text-[15px] font-medium [overflow-wrap:anywhere]">{d.texte}</p>
      {d.reponseClient && (
        <Reponse titre={`Mot de ${prenom}`} ton="bleu">
          <p className="whitespace-pre-line">{d.reponseClient}</p>
        </Reponse>
      )}
      {d.reponse && (
        <Reponse titre="Ta réponse">
          <p className="whitespace-pre-line">{d.reponse}</p>
          <Meta
            items={[
              ["Dans le devis :", d.dansDevis],
              ["Prix :", d.prix ? `${d.prix} HTVA` : null],
            ]}
          />
        </Reponse>
      )}
      <AdminReponse slug={slug} d={d} ouvert={ouvert} />
    </Carte>
  );
}

function Porte({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-line bg-white p-6 sm:p-8">
        <div className="mb-5 flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Icone nom="cadenas" className="size-5" />
        </div>
        <h1 className="text-xl font-semibold">{titre}</h1>
        <div className="mt-1.5 flex flex-col text-[15px] text-muted">{children}</div>
      </div>
    </main>
  );
}
