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

            <h3 className="pb-gd-h3" id="newsletter">
              La newsletter
            </h3>
            <p className="pb-gd-p">
              Pour recevoir une ressource gratuite (une checklist liée à une vidéo), vous donnez
              votre prénom, votre nom et votre adresse e-mail, et vous acceptez de recevoir la
              newsletter. Ces données servent uniquement à vous envoyer la ressource, puis la
              newsletter.
            </p>
            <p className="pb-gd-p">
              Base légale&nbsp;: votre consentement (article 6.1.a du RGPD), donné en cochant la case
              du formulaire. Chaque envoi contient un lien de désinscription, et un e-mail à{" "}
              <a href={`mailto:${IDENTITE.email}`}>{IDENTITE.email}</a> suffit aussi.
            </p>
            <p className="pb-gd-p">
              Conservation&nbsp;: jusqu&apos;à votre désinscription. L&apos;adresse est alors retirée
              de la liste d&apos;envoi.
            </p>

            <h3 className="pb-gd-h3">La mesure d&apos;audience sans cookie</h3>
            <p className="pb-gd-p">
              Le site compte les visites et les pages lues avec Vercel Web Analytics. Cet outil ne
              dépose <strong>aucun cookie</strong>, ne crée aucun identifiant permanent et ne suit
              personne d&apos;un site à l&apos;autre. Les statistiques produites sont agrégées&nbsp;:
              elles ne permettent pas de vous identifier.
            </p>
            <p className="pb-gd-p">
              Base légale&nbsp;: l&apos;intérêt légitime à connaître l&apos;audience de son propre site
              (article 6.1.f du RGPD). Aucune donnée personnelle n&apos;est traitée, votre
              consentement n&apos;est donc pas requis pour cet outil.
            </p>

            <h3 className="pb-gd-h3">La mesure et la publicité avec cookies</h3>
            <p className="pb-gd-p">
              Seulement si vous cliquez sur «&nbsp;Accepter&nbsp;», le site charge aussi Google
              Analytics et Microsoft Clarity, par Google Tag Manager. Ils disent d&apos;où viennent
              les visites, quelles pages mènent à une prise de contact, et où la lecture
              s&apos;arrête. Clarity enregistre les clics et le défilement, jamais ce que vous tapez.
              Si des annonces Google sont diffusées, les mêmes balises mesurent lesquelles
              amènent une demande.
            </p>
            <p className="pb-gd-p">
              Avec votre accord, le formulaire de contact joint aussi la provenance de votre visite
              (site d&apos;origine, campagne, première page vue), pour savoir quel canal a mené à
              votre demande.
            </p>
            <p className="pb-gd-p">
              Base légale&nbsp;: votre consentement (article 6.1.a du RGPD). Sans lui, ces outils
              reçoivent au plus un signal anonyme, sans cookie ni identifiant. Vous pouvez le
              retirer à tout moment, aussi simplement que vous l&apos;avez donné.
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

            <h2 className="pb-gd-h2" id="cookies">
              Cookies
            </h2>
            <p className="pb-gd-p">
              <strong>Aucun cookie n&apos;est déposé avant votre choix.</strong> Si vous refusez, il
              n&apos;y en aura aucun. Si vous acceptez&nbsp;:
            </p>
            <div className="pb-legal-tw">
              <table className="pb-legal-t">
                <thead>
                  <tr>
                    <th>Cookie</th>
                    <th>Outil</th>
                    <th>Rôle</th>
                    <th>Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>_ga, _ga_*</td>
                    <td>Google Analytics</td>
                    <td>Distinguer les visites, mesurer la provenance</td>
                    <td>13 mois</td>
                  </tr>
                  <tr>
                    <td>_gcl_*</td>
                    <td>Google Ads</td>
                    <td>Relier une demande à l&apos;annonce qui l&apos;a amenée</td>
                    <td>90 jours</td>
                  </tr>
                  <tr>
                    <td>_clck, _clsk</td>
                    <td>Microsoft Clarity</td>
                    <td>Regrouper les pages d&apos;une même visite</td>
                    <td>1 an, 1 jour</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="pb-gd-p">
              Votre choix lui-même est gardé dans votre navigateur (
              <span className="pb-mono">pb-consent</span>) pendant six mois, puis la question revient.
              Pour le changer, utilisez le lien «&nbsp;Cookies&nbsp;» en bas de chaque page.
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
              toujours la version applicable. Dernière mise à jour&nbsp;: 16 septembre 2026.
            </p>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
