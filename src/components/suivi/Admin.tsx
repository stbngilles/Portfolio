import type { SuiviDemande, SuiviElement } from "@prisma/client";
import {
  ajouterElement,
  demanderAuClient,
  majDemande,
  majElement,
  majPresentation,
  marquerLivre,
  supprimerDemande,
  supprimerElement,
} from "@/app/suivi/[slug]/actions";
import { BoutonConfirmer } from "./BoutonConfirmer";
import { Icone, boutonPrimaire, boutonSecondaire, champ } from "./ui";

/**
 * Formulaires de l'interface admin (`/suivi/<slug>/admin`). Le client ne
 * les voit jamais : sa page n'importe pas ce fichier.
 */

export const STATUTS_ELEMENT = ["À faire", "En cours", "Attente client", "Attente confirmation", "Planifié", "Non commandé", "Fait"];
/** Demande du client : je la reçois, je la traite ; « Attente confirmation » + prix = il valide. */
export const STATUTS_DEMANDE_CLIENT = ["Reçue", "En cours", "Attente confirmation", "Validée", "Fait", "Refusée"];
/** Ma demande au client : elle attend chez lui, puis il la valide, la refuse ou la fait. */
export const STATUTS_DEMANDE_MOI = ["En attente", "Validée", "Refusée", "Fait"];
const PRIORITES = ["Bloquant", "Utile", "Plus tard"];

const petit = `${champ} py-2 text-sm`;
const tiroir = "group mt-3 rounded-lg border border-dashed border-accent/40 bg-accent-soft/20";
const resume =
  "cursor-pointer list-none px-3 py-2 text-sm font-medium text-accent marker:hidden [&::-webkit-details-marker]:hidden";
const petitPrimaire = `${boutonPrimaire} min-h-9 py-1.5 text-sm`;
const supprimer = "ml-auto cursor-pointer rounded-lg px-3 py-1.5 text-sm text-[#962318] hover:bg-[#FBE3E0]";

function Champ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[13px] font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function Choix({ name, valeurs, defaut }: { name: string; valeurs: string[]; defaut?: string | null }) {
  return (
    <select name={name} defaultValue={defaut ?? valeurs[0]} className={petit}>
      {valeurs.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  );
}

// ================================================================= éléments

function ChampsElement({ e, etat }: { e?: SuiviElement; etat: "LIVRE" | "EN_COURS" }) {
  const livre = etat === "LIVRE";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Champ label="Élément">
        <input name="titre" required defaultValue={e?.titre} className={petit} />
      </Champ>
      <Champ label="Groupe">
        <input name="groupe" defaultValue={e?.groupe} className={petit} />
      </Champ>
      <Champ label={livre ? "Ligne du devis" : "Dans le devis ?"}>
        <input name="devis" defaultValue={e?.devis ?? ""} className={petit} />
      </Champ>
      <Champ label={livre ? "Vérifié le" : "Date prévue"}>
        <input name="date" defaultValue={e?.date ?? ""} className={petit} />
      </Champ>
      <Champ label={livre ? "Où le voir" : "Ce qui manque"}>
        <textarea name="detail" rows={2} defaultValue={e?.detail ?? ""} className={petit} />
      </Champ>
      {livre ? (
        <Champ label="Remarque">
          <textarea name="remarque" rows={2} defaultValue={e?.remarque ?? ""} className={petit} />
        </Champ>
      ) : (
        <Champ label="À fournir par le client (cadre orange, vide = rien)">
          <textarea name="besoin" rows={2} defaultValue={e?.besoin ?? ""} className={petit} />
        </Champ>
      )}
      {!livre && (
        <>
          <Champ label="Statut">
            <Choix name="statut" valeurs={STATUTS_ELEMENT} defaut={e?.statut} />
          </Champ>
          <Champ label="Remarque">
            <input name="remarque" defaultValue={e?.remarque ?? ""} className={petit} />
          </Champ>
        </>
      )}
    </div>
  );
}

export function AdminElement({ slug, e }: { slug: string; e: SuiviElement }) {
  const etat = e.etat === "LIVRE" ? "LIVRE" : "EN_COURS";
  return (
    <details className={tiroir}>
      <summary className={resume}>Modifier</summary>
      <form action={majElement} className="space-y-3 px-3 pb-3">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={e.id} />
        <ChampsElement e={e} etat={etat} />
        <div className="flex flex-wrap gap-2 pt-1">
          <button type="submit" className={petitPrimaire}>
            Enregistrer
          </button>
          {etat === "EN_COURS" && (
            <button type="submit" formAction={marquerLivre} className={`${boutonSecondaire} min-h-9 py-1.5 text-sm`}>
              Marquer livré
            </button>
          )}
          <BoutonConfirmer message={`Supprimer « ${e.titre} » ?`} formAction={supprimerElement} className={supprimer}>
            Supprimer
          </BoutonConfirmer>
        </div>
      </form>
    </details>
  );
}

export function AdminAjoutElement({ slug, etat }: { slug: string; etat: "LIVRE" | "EN_COURS" }) {
  return (
    <details className={`${tiroir} mt-6`}>
      <summary className={resume}>+ Ajouter un élément</summary>
      <form action={ajouterElement} className="space-y-3 px-3 pb-3">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="etat" value={etat} />
        <ChampsElement etat={etat} />
        <button type="submit" className={petitPrimaire}>
          Ajouter
        </button>
      </form>
    </details>
  );
}

// ================================================================= demandes

/** Répondre à une demande du client. */
export function AdminReponse({ slug, d, ouvert }: { slug: string; d: SuiviDemande; ouvert?: boolean }) {
  return (
    <details className={tiroir} open={ouvert}>
      <summary className={resume}>{d.reponse ? "Modifier ma réponse" : "Répondre"}</summary>
      <form action={majDemande} className="space-y-3 px-3 pb-3">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={d.id} />
        <Champ label="Ma réponse">
          <textarea name="reponse" rows={3} defaultValue={d.reponse ?? ""} className={petit} />
        </Champ>
        <div className="grid gap-3 sm:grid-cols-4">
          <Champ label="Statut">
            <Choix name="statut" valeurs={STATUTS_DEMANDE_CLIENT} defaut={d.statut} />
          </Champ>
          <Champ label="Priorité">
            <Choix name="priorite" valeurs={PRIORITES} defaut={d.priorite} />
          </Champ>
          <Champ label="Dans le devis ?">
            <select name="dansDevis" defaultValue={d.dansDevis ?? ""} className={petit}>
              <option value="">À voir</option>
              <option>Oui</option>
              <option>Non</option>
            </select>
          </Champ>
          <Champ label="Prix HTVA si hors devis">
            <input name="prix" defaultValue={d.prix ?? ""} placeholder="ex. 120 €" className={petit} />
          </Champ>
        </div>
        <p className="text-[13px] text-muted">
          Hors devis : mets un prix et le statut « Attente confirmation ». Il verra « Je valide / Je refuse ».
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className={petitPrimaire}>
            Enregistrer
          </button>
          <BoutonConfirmer message="Supprimer cette demande ?" formAction={supprimerDemande} className={supprimer}>
            Supprimer
          </BoutonConfirmer>
        </div>
      </form>
    </details>
  );
}

function ChampsMaDemande({ d }: { d?: SuiviDemande }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <Champ label="Ce que tu lui demandes (une phrase)" className="sm:col-span-4">
        <input
          name="texte"
          required
          defaultValue={d?.texte}
          placeholder="Ex. : Envoie-moi les visuels du 3e jeu."
          className={petit}
        />
      </Champ>
      <Champ label="Explication (facultatif)" className="sm:col-span-4">
        <textarea
          name="detail"
          rows={3}
          defaultValue={d?.detail ?? ""}
          placeholder="Pourquoi, comment, pour quand."
          className={petit}
        />
      </Champ>
      <Champ label="Prix HTVA (rempli = à valider)" className="sm:col-span-2">
        <input name="prix" defaultValue={d?.prix ?? ""} placeholder="ex. 120 €" className={petit} />
      </Champ>
      <Champ label="Priorité">
        <Choix name="priorite" valeurs={PRIORITES} defaut={d?.priorite ?? "Utile"} />
      </Champ>
      {d && (
        <Champ label="Statut">
          <Choix name="statut" valeurs={STATUTS_DEMANDE_MOI} defaut={d.statut} />
        </Champ>
      )}
    </div>
  );
}

/** Envoyer une demande au client. */
export function AdminNouvelleDemande({ slug, prenom }: { slug: string; prenom: string }) {
  return (
    <form action={demanderAuClient} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />
      <ChampsMaDemande />
      <p className="text-[13px] text-muted">
        Avec un prix, {prenom} voit « Je valide / Je refuse ». Sans prix, il voit « C&apos;est fait ». Il peut
        toujours te laisser un mot.
      </p>
      <button type="submit" className={boutonPrimaire}>
        <Icone nom="envoi" /> Envoyer à {prenom}
      </button>
    </form>
  );
}

/** Modifier une demande déjà envoyée au client. */
export function AdminMaDemande({ slug, d }: { slug: string; d: SuiviDemande }) {
  return (
    <details className={tiroir}>
      <summary className={resume}>Modifier</summary>
      <form action={majDemande} className="space-y-3 px-3 pb-3">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={d.id} />
        <ChampsMaDemande d={d} />
        <div className="flex flex-wrap gap-2">
          <button type="submit" className={petitPrimaire}>
            Enregistrer
          </button>
          <BoutonConfirmer message="Supprimer cette demande ?" formAction={supprimerDemande} className={supprimer}>
            Supprimer
          </BoutonConfirmer>
        </div>
      </form>
    </details>
  );
}

// ================================================================= présentation

export function AdminPresentation({
  slug,
  bonjour,
  mot,
  tu,
  vueLe,
}: {
  slug: string;
  bonjour?: string;
  mot?: string;
  tu?: boolean;
  vueLe: Date | null;
}) {
  return (
    <details className={tiroir}>
      <summary className={resume}>
        Présentation d&apos;accueil{" "}
        <span className="font-normal text-muted">
          · {vueLe ? `vue par le client le ${vueLe.toLocaleDateString("fr-BE", { timeZone: "Europe/Brussels" })}` : "pas encore vue"}
        </span>
      </summary>
      <form action={majPresentation} className="space-y-3 px-3 pb-3">
        <input type="hidden" name="slug" value={slug} />
        <Champ label="Salutation, premier écran (vide : « Bonjour. »)">
          <input name="bonjour" defaultValue={bonjour ?? ""} placeholder="Bonjour." className={petit} />
        </Champ>
        <Champ label="Mot de la fin, dernier écran (vide : pas d'écran). Retours à la ligne gardés.">
          <textarea name="mot" rows={8} defaultValue={mot ?? ""} className={petit} />
        </Champ>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="tu" defaultChecked={tu !== false} className="size-4 accent-[#1F3FBF]" />
          Tutoyer le client
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="rouvrir" className="size-4 accent-[#1F3FBF]" />
          La rouvrir à la prochaine visite du client
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className={petitPrimaire}>
            Enregistrer
          </button>
          <a href={`/suivi/${slug}?presentation=1`} className={`${boutonSecondaire} min-h-9 py-1.5 text-sm`}>
            Prévisualiser
          </a>
        </div>
      </form>
    </details>
  );
}
