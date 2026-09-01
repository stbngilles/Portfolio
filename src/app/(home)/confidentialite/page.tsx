import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import { IDENTITE, SOUS_TRAITANTS, APD } from "@/components/home/legal";

const SITE_URL = "https://pixelbrute.be";

/**
 * Politique de confidentialité. Obligatoire dès qu'une donnée personnelle est
 * traitée, ici le formulaire de contact et la mesure d'audience.
 *
 * Écrite pour être lue : un visiteur doit pouvoir répondre en une minute aux
 * trois questions qu'il se pose vraiment, qu'est-ce que vous savez de moi,
 * à qui ça part, comment je le fais effacer.
 */

export const metadata: Metadata = {
  title: { absolute: "Politique de confidentialité | Pixelbrute" },
  description:
    "Quelles données sont collectées sur pixelbrute.be, pourquoi, combien de temps elles sont conservées, à qui elles sont transmises et comment exercer vos droits.",
  alternates: { canonical: `${SITE_URL}/confidentialite` },
};

export default function ConfidentialitePage() {
  return (
    <>
      <Header variant="page" />

      <main>
        <article className="pb-gd">
          <div className="pb-case-crumb pb-label">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Confidentialité</span>
          </div>

          <h1 className="pb-gd-title">Politique de confidentialité</h1>
          <p className="pb-gd-lede">
            Ce que ce site sait de vous, où ça va, combien de temps c&apos;est gardé, et comment le
            faire effacer. En clair, sans renvoi à une annexe.
          </p>

          <div className="pb-gd-body">
            <h2 className="pb-gd-h2">Qui est responsable</h2>
            <p className="pb-gd-p">
              {IDENTITE.nom} ({IDENTITE.enseigne}), {IDENTITE.rue}, {IDENTITE.codePostal}{" "}
              {IDENTITE.ville}, {IDENTITE.pays}. Numéro d&apos;entreprise {IDENTITE.bce}. Pour toute
              question relative à vos données&nbsp;: <a href={`mailto:${IDENTITE.email}`}>{IDENTITE.email}</a>.
            </p>

            <h2 className="pb-gd-h2">Ce qui est collecté, et pourquoi</h2>

            <h3 className="pb-gd-h3">Le formulaire de contact</h3>
            <p className="pb-gd-p">
              Quand vous décrivez votre projet, vous transmettez votre nom, votre adresse e-mail,
              éventuellement votre téléphone, et le texte de votre message. Ces données servent
              uniquement à vous répondre et à préparer un éventuel devis.
            </p>
            <p className="pb-gd-p">
              Base légale&nbsp;: votre demande elle-même, des mesures précontractuelles prises à votre
              initiative (article 6.1.b du RGPD). Sans ces données, il n&apos;est pas possible de vous
              répondre.
            </p>
            <p className="pb-gd-p">
              Conservation&nbsp;: trois ans à compter du dernier échange si la demande n&apos;aboutit pas.
              Si elle aboutit, les documents liés à la relation commerciale sont conservés dix ans,
              comme l&apos;impose la législation comptable belge.
            </p>

            <h3 className="pb-gd-h3">La mesure d&apos;audience</h3>
            <p className="pb-gd-p">
              Le site compte les visites et les pages lues avec Vercel Web Analytics. Cet outil ne
              dépose <strong>aucun cookie</strong>, ne crée aucun identifiant permanent et ne suit
              personne d&apos;un site à l&apos;autre. Les statistiques produites sont agrégées&nbsp;:
              elles ne permettent pas de vous identifier.
            </p>
            <p className="pb-gd-p">
              Base légale&nbsp;: l&apos;intérêt légitime à connaître l&apos;audience de son propre site
              (article 6.1.f du RGPD). Comme aucune donnée personnelle n&apos;est traitée et
              qu&apos;aucun cookie n&apos;est déposé, votre consentement n&apos;est pas requis, et
              aucune bannière ne vous est imposée.
            </p>

            <h3 className="pb-gd-h3">Les journaux techniques</h3>
            <p className="pb-gd-p">
              L&apos;hébergeur enregistre automatiquement les connexions au serveur, adresse IP,
              date, page demandée, navigateur. C&apos;est nécessaire au fonctionnement et à la
              sécurité du site. Ces journaux sont conservés au maximum trente jours.
            </p>

            <h2 className="pb-gd-h2">À qui vos données sont transmises</h2>
            <p className="pb-gd-p">
              Rien n&apos;est vendu, loué ni échangé. Les seuls tiers qui voient passer une donnée
              sont les prestataires techniques nécessaires au fonctionnement du site&nbsp;:
            </p>
            <div className="pb-legal-tw">
              <table className="pb-legal-t">
                <thead>
                  <tr>
                    <th>Prestataire</th>
                    <th>Rôle</th>
                    <th>Localisation</th>
                    <th>Données concernées</th>
                  </tr>
                </thead>
                <tbody>
                  {SOUS_TRAITANTS.map((s) => (
                    <tr key={s.nom}>
                      <td>{s.nom}</td>
                      <td>{s.role}</td>
                      <td>{s.pays}</td>
                      <td>{s.donnees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pb-gd-p">
              Les transferts vers les États-Unis s&apos;appuient sur le cadre de protection des
              données UE–États-Unis (Data Privacy Framework) et sur les clauses contractuelles
              types de la Commission européenne.
            </p>

            <h2 className="pb-gd-h2">Cookies</h2>
            <p className="pb-gd-p">
              <strong>Ce site ne dépose aucun cookie.</strong> Ni publicitaire, ni de mesure, ni de
              confort. C&apos;est la raison pour laquelle aucune bannière ne vous demande votre
              accord&nbsp;: il n&apos;y a rien à accepter.
            </p>
            <p className="pb-gd-p">
              Si votre navigateur conserve encore un cookie commençant par <span className="pb-mono">_ga</span>,
              il provient d&apos;une version antérieure du site qui utilisait Google Analytics. Il
              n&apos;est plus alimenté et vous pouvez le supprimer sans conséquence.
            </p>

            <h2 className="pb-gd-h2">Vos droits</h2>
            <p className="pb-gd-p">
              Le RGPD vous donne le droit d&apos;accéder à vos données, de les faire corriger ou
              effacer, de limiter leur traitement, de vous opposer à celui-ci, et d&apos;en recevoir
              une copie dans un format lisible par machine.
            </p>
            <p className="pb-gd-p">
              Pour exercer l&apos;un de ces droits, écrivez à{" "}
              <a href={`mailto:${IDENTITE.email}`}>{IDENTITE.email}</a>. Vous recevrez une réponse
              dans le mois. Aucune justification n&apos;est nécessaire pour demander l&apos;effacement
              d&apos;une demande de contact.
            </p>
            <p className="pb-gd-p">
              Si la réponse ne vous satisfait pas, vous pouvez introduire une réclamation auprès de
              l&apos;{APD.nom}, {APD.adresse},{" "}
              <a href={`mailto:${APD.email}`}>{APD.email}</a>,{" "}
              <a href={APD.site} target="_blank" rel="noopener noreferrer">
                autoriteprotectiondonnees.be
              </a>
              .
            </p>

            <h2 className="pb-gd-h2">Modifications</h2>
            <p className="pb-gd-p">
              Cette politique peut évoluer si les outils utilisés changent. La version en ligne est
              toujours la version applicable. Dernière mise à jour&nbsp;: 23 août 2026.
            </p>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
