import Arrow from "./Arrow";
import { AVAILABILITY } from "./data";

/**
 * Les trois portes d'entrée, posées au-dessus du formulaire.
 *
 * Le téléphone n'apparaissait qu'après l'envoi du formulaire : le visiteur qui
 * préfère appeler — la moitié de cette clientèle — n'avait aucun chemin depuis
 * la page de contact, et repartait. Les trois voies sont donc données d'entrée,
 * le formulaire restant celui qu'on met en avant (le seul en bleu plein).
 *
 * Les faits affichés sont ceux déjà tenus ailleurs sur le site : 24 h ouvrées
 * (métadonnées de la page), appel de trente minutes sans engagement (FAQ),
 * 5,0 ★ sur trois avis (STUDIO.facts), une seule personne (Studio).
 */
const TRUST = [
  "Réponse sous 24 h ouvrées",
  "Premier appel de 30 min, sans engagement",
  "5,0 ★ · 3 avis Google",
  "Vous parlez à la personne qui code",
];

export default function ContactWays() {
  return (
    <>
      <div className="pb-ways">
        <a href="#brief" className="pb-way" data-primary="">
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
        <a href="mailto:contact@pixelbrute.be" className="pb-way">
          <span className="pb-way-k">Si vous préférez écrire</span>
          <span className="pb-way-v">contact@pixelbrute.be</span>
          <span className="pb-way-m">Même adresse, même personne</span>
          <Arrow dir="ne" />
        </a>
      </div>

      <ul className="pb-trust pb-cap">
        {TRUST.map((t) => (
          <li key={t}>{t}</li>
        ))}
        {AVAILABILITY && <li data-slot="">{AVAILABILITY}</li>}
      </ul>
    </>
  );
}
