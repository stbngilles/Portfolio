import { MANIFESTO } from "./data";
import { Words } from "./Text";

/**
 * Manifeste sur fond encre : une seule phrase, en très grand, dont les mots
 * s'allument à mesure qu'on descend. Le corps, plus petit, tient à droite.
 */
export default function Manifesto() {
  return (
    <section id="manifeste" className="pb-manifesto pb-dark">
      <div className="pb-over" data-tone="light" data-reveal="">
        {MANIFESTO.over}
      </div>

      <Words className="pb-d-m pb-manifesto-h" text={`${MANIFESTO.lead} ${MANIFESTO.tail}`} />

      <div className="pb-manifesto-body" data-reveal-group="">
        {MANIFESTO.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
