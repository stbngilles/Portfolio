import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import SiteFooter from "@/components/home/SiteFooter";
import { IDENTITE, NACEBEL } from "@/components/home/legal";

const SITE_URL = "https://pixelbrute.be";

/**
 * Mentions légales. Obligation du Code de droit économique belge (livre XII) :
 * un prestataire de services en ligne doit rendre son identité, son adresse
 * géographique, ses coordonnées et son numéro d'entreprise directement
 * accessibles.
 *
 * Volontairement sans le lien vers la plateforme européenne de règlement des
 * litiges (RLL/ODR) : elle a fermé le 20 juillet 2025 et le règlement (UE)
 * 2024/3228 a supprimé l'obligation de l'afficher. La plupart des modèles de
 * mentions légales en circulation la mentionnent encore, c'est un lien mort.
 */

export const metadata: Metadata = {
  title: { absolute: "Mentions légales | Pixelbrute" },
  description:
    "Identité de l'éditeur, coordonnées, numéro d'entreprise, hébergement et conditions d'utilisation du site pixelbrute.be.",
  alternates: { canonical: `${SITE_URL}/mentions-legales` },
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header variant="page" />

      <main>
        <article className="pb-gd">
          <div className="pb-case-crumb pb-label">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Mentions légales</span>
          </div>

          <h1 className="pb-gd-title">Mentions légales</h1>
          <p className="pb-gd-lede">
            Qui édite ce site, comment le joindre, et à quelles conditions il s&apos;utilise.
          </p>

          <div className="pb-gd-body">
            <h2 className="pb-gd-h2">Éditeur du site</h2>
            <dl className="pb-legal-dl">
              <div>
                <dt>Responsable</dt>
                <dd>{IDENTITE.nom}</dd>
              </div>
              <div>
                <dt>Enseigne</dt>
                <dd>{IDENTITE.enseigne}</dd>
              </div>
              <div>
                <dt>Forme</dt>
                <dd>{IDENTITE.statut}</dd>
              </div>
              <div>
                <dt>Siège</dt>
                <dd>
                  {IDENTITE.rue}
                  <br />
                  {IDENTITE.codePostal} {IDENTITE.ville}, {IDENTITE.pays}
                </dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>
                  <a href={`mailto:${IDENTITE.email}`}>{IDENTITE.email}</a>
                </dd>
              </div>
              <div>
                <dt>Téléphone</dt>
                <dd>
                  <a href={`tel:${IDENTITE.telephoneHref}`}>{IDENTITE.telephone}</a>
                </dd>
              </div>
              <div>
                <dt>Numéro d&apos;entreprise (BCE)</dt>
                <dd className="pb-mono">{IDENTITE.bce}</dd>
              </div>
              <div>
                <dt>Numéro de TVA</dt>
                <dd className="pb-mono">{IDENTITE.tva}</dd>
              </div>
              <div>
                <dt>Régime TVA</dt>
                <dd>{IDENTITE.regimeTva}</dd>
              </div>
            </dl>

            <h2 className="pb-gd-h2">Activités déclarées</h2>
            <p className="pb-gd-p">
              Codes NACEBEL 2025 enregistrés à la Banque-Carrefour des Entreprises&nbsp;:
            </p>
            <ul className="pb-gd-ul">
              {NACEBEL.map((n) => (
                <li key={n.code}>
                  <span className="pb-mono">{n.code}</span>, {n.label}
                </li>
              ))}
            </ul>

            <h2 className="pb-gd-h2">Hébergement</h2>
            <p className="pb-gd-p">
              Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut,
              CA 91789, États-Unis. Le nom de domaine est enregistré chez <strong>one.com</strong>.
            </p>

            <h2 className="pb-gd-h2">Propriété intellectuelle</h2>
            <p className="pb-gd-p">
              La structure du site, ses textes, son code et ses éléments graphiques sont protégés
              par le droit d&apos;auteur. Toute reproduction ou représentation, totale ou partielle,
              sans autorisation écrite préalable est interdite.
            </p>
            <p className="pb-gd-p">
              Les captures d&apos;écran, noms et marques des projets présentés dans les études de cas
              restent la propriété de leurs titulaires respectifs. Ils apparaissent ici à titre de
              référence de travaux réalisés.
            </p>

            <h2 className="pb-gd-h2">Responsabilité</h2>
            <p className="pb-gd-p">
              Les informations publiées sur ce site sont fournies à titre indicatif. Les chiffres
              cités dans les études de cas et les guides sont relevés à une date donnée, précisée
              à chaque fois&nbsp;; ils peuvent avoir évolué depuis. Ils ne constituent ni une garantie
              de résultat, ni un engagement contractuel.
            </p>
            <p className="pb-gd-p">
              Les liens vers des sites tiers sont proposés pour votre commodité. Leur contenu
              n&apos;engage que leurs éditeurs.
            </p>

            <h2 className="pb-gd-h2">Données personnelles</h2>
            <p className="pb-gd-p">
              Le traitement des données personnelles est détaillé dans la{" "}
              <Link href="/confidentialite">politique de confidentialité</Link>, qui précise
              quelles données sont collectées, pourquoi, par qui elles sont traitées et comment
              exercer vos droits.
            </p>

            <h2 className="pb-gd-h2">Droit applicable</h2>
            <p className="pb-gd-p">
              Le présent site et son utilisation sont soumis au droit belge. En cas de litige, et à
              défaut de résolution amiable, les cours et tribunaux de l&apos;arrondissement judiciaire
              de Liège sont seuls compétents.
            </p>
            <p className="pb-gd-p">
              Toute réclamation peut être adressée en premier lieu à{" "}
              <a href={`mailto:${IDENTITE.email}`}>{IDENTITE.email}</a>. Les consommateurs peuvent
              également saisir le Service de Médiation pour le Consommateur (SPF Économie,
              boulevard du Roi Albert II 8 bte 1, 1000 Bruxelles).
            </p>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
