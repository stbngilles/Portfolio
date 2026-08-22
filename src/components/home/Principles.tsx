import { PRINCIPLES } from "./data";
import { Lines } from "./Text";

/**
 * Principes : titre collant à gauche, les trois rangées défilent à droite.
 */
export default function Principles() {
  return (
    <section id="principes" className="pb-princ">
      <div className="pb-princ-side">
        <div className="pb-over" data-reveal="">Comment je travaille</div>
        <Lines className="pb-d-l" lines={["Trois principes,", "tenus sur", "chaque projet."]} />
      </div>

      <div className="pb-princ-list">
        {PRINCIPLES.map((r, i) => (
          <div key={r.title} className="pb-princ-row" data-reveal="">
            <span className="pb-mono pb-princ-n">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="pb-d-s pb-princ-title">{r.title}</h3>
            <p className="pb-princ-txt">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
