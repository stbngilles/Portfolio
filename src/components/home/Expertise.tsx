import { EXPERTISE } from "./data";
import { Lines } from "./Text";

/**
 * Trois expertises sur panneau bleu Klein : des rangées pleine largeur,
 * numérotées, qui s'ouvrent au survol. Le seul aplat bleu avant le dernier écran.
 */
export default function Expertise() {
  return (
    <section id="expertises" className="pb-exp pb-dark">
      <div className="pb-exp-head">
        <div className="pb-over" data-tone="light" data-reveal="">
          Ce que je fais
        </div>
        <Lines className="pb-d-l pb-exp-title" lines={["Tout, de la première", "réunion à la mise en ligne."]} />
      </div>

      <div className="pb-exp-list">
        {EXPERTISE.map((e, i) => (
          <div key={e.label} className="pb-exp-row" data-reveal="">
            <span className="pb-mono pb-exp-n">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="pb-d-m pb-exp-label">{e.label}</h3>
            <p className="pb-exp-line">{e.line}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
