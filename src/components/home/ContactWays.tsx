import Arrow from "./Arrow";
import { AVAILABILITY, BOOKING_URL, WHATSAPP_URL } from "./data";

/**
 * Les quatre portes d'entrée, posées au-dessus du formulaire.
 *
 * Le téléphone n'apparaissait qu'après l'envoi du formulaire : le visiteur qui
 * préfère appeler — la moitié de cette clientèle — n'avait aucun chemin depuis
 * la page de contact, et repartait. Les voies sont donc données d'entrée.
 *
 * La réservation en ligne est passée devant le formulaire, et prend le bleu
 * plein : le formulaire promet une réponse sous 24 h, la réservation pose un
 * créneau daté en dix secondes. Sur la même page, la seconde gagne toujours.
 * Le bleu ne sert qu'à une porte à la fois — ne pas en peindre deux.
 *
 * WhatsApp a pris la place de l'adresse e-mail, qui reste dans le pied de page :
 * quatre portes est un maximum, et sur cette clientèle un `mailto:` ouvre un
 * logiciel que beaucoup n'ont jamais configuré. Pour revenir en arrière, il
 * suffit de rendre sa carte à `contact@pixelbrute.be`.
 *
 * Les faits affichés sont ceux déjà tenus ailleurs sur le site : 24 h ouvrées
 * (métadonnées de la page), appel de quarante-cinq minutes sans engagement
 * (FAQ), 5,0 ★ sur trois avis (STUDIO.facts), une seule personne (Studio).
 */
const TRUST = [
  "Réponse sous 24 h ouvrées",
  "Devis chiffré pendant l'appel, sans engagement",
  "5,0 ★ · 3 avis Google",
  "Vous parlez à la personne qui code",
];

export default function ContactWays() {
  return (
    <>
      <div className="pb-ways">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener"
          className="pb-way"
          data-primary=""
        >
          <span className="pb-way-k">Le plus direct</span>
          <span className="pb-way-v">Réserver 45 min</span>
          <span className="pb-way-m">Vous choisissez le créneau · devis chiffré pendant l&apos;appel</span>
          <Arrow dir="ne" />
        </a>
        <a href="#brief" className="pb-way">
          <span className="pb-way-k">Le plus utile</span>
          <span className="pb-way-v">Décrire votre projet</span>
          <span className="pb-way-m">3 questions · une minute</span>
          <Arrow dir="s" />
        </a>
        <a href="tel:+32492200275" className="pb-way">
          <span className="pb-way-k">Le plus rapide</span>
          <span className="pb-way-v">+32 492 20 02 75</span>
          <span className="pb-way-m">Appel direct — pas de standard</span>
          <Arrow dir="ne" />
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="pb-way">
          <span className="pb-way-k">Si vous préférez écrire</span>
          <span className="pb-way-v">WhatsApp</span>
          <span className="pb-way-m">Même numéro, même personne — en écrit</span>
          <Arrow dir="ne" />
        </a>
      </div>

      <ul className="pb-trust pb-cap">
        {TRUST.map((t) => (
          <li key={t}>{t}</li>
        ))}
        {AVAILABILITY && (
          <li data-slot="">
            <span className="pb-label pb-inked">{AVAILABILITY}</span>
          </li>
        )}
      </ul>
    </>
  );
}
