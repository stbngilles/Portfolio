import Arrow from "./Arrow";
import BookCall from "./BookCall";
import { AVAILABILITY, WHATSAPP_URL } from "./data";

/**
 * Les voies directes, sous le formulaire, pas au-dessus.
 *
 * Elles ont longtemps ouvert la page : quatre cartes, une ligne de faits et
 * une pastille de disponibilité repoussaient le formulaire de 300 px, et la
 * page demandait de choisir un canal avant d'avoir dit un mot. Le formulaire
 * est l'action principale, il vient donc en premier ; ces cartes sont la
 * sortie de secours de celui qui ne veut pas écrire.
 *
 * Trois portes, plus quatre : « décrire votre projet » a disparu, elle
 * pointait vers le formulaire désormais placé juste au-dessus.
 *
 * Le bleu plein ne sert qu'à une porte à la fois, ici la réservation, seule
 * à poser un créneau daté. Ne pas en peindre deux.
 *
 * Cette carte ouvre le calendrier en modale par-dessus la page (`BookCall`) :
 * son `href` reste la page Cal.com, qui sert de secours et de ⌘-clic.
 *
 * Les faits affichés sont ceux déjà tenus ailleurs sur le site : appel de
 * quinze minutes sans engagement (FAQ), 5,0 ★ sur trois avis (STUDIO.facts),
 * une seule personne (Studio). La réponse sous 24 h n'y est plus : elle est
 * déjà dans l'œil-de-bœuf, sur le bouton d'envoi et sous le formulaire.
 */
const TRUST = [
  "Devis chiffré pendant l'appel, sans engagement",
  "5,0 ★ · 3 avis Google",
  "Vous parlez à la personne qui code",
];

export default function ContactWays() {
  return (
    <section className="pb-alt">
      <div className="pb-over">Sinon</div>
      <h2 className="pb-d-s pb-alt-title">Vous préférez parler&nbsp;?</h2>

      <div className="pb-ways">
        <BookCall className="pb-way" data-primary="">
          <span className="pb-way-k">Le plus direct</span>
          <span className="pb-way-v">Réserver 15 min</span>
          <span className="pb-way-m">Vous choisissez le créneau</span>
          <Arrow dir="ne" />
        </BookCall>
        <a href="tel:+32492200275" className="pb-way">
          <span className="pb-way-k">Le plus rapide</span>
          <span className="pb-way-v">+32 492 20 02 75</span>
          <span className="pb-way-m">Appel direct, pas de standard</span>
          <Arrow dir="ne" />
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="pb-way">
          <span className="pb-way-k">À l&apos;écrit</span>
          <span className="pb-way-v">WhatsApp</span>
          <span className="pb-way-m">Même numéro, même personne</span>
          <Arrow dir="ne" />
        </a>
      </div>

      <ul className="pb-trust pb-cap">
        {AVAILABILITY && <li>{AVAILABILITY}</li>}
        {TRUST.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  );
}
