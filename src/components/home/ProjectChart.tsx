import type { Chart } from "./data";

/**
 * Graphiques des études de cas. Trois formes, aucune bibliothèque : des
 * `div` et une grille CSS suffisent, et ça reste lisible sans JavaScript.
 *
 * La règle est la même que pour le texte : on ne dessine que des chiffres
 * relevés sur le site du client. Un graphique décoratif ment deux fois, sur
 * le fond et sur le sérieux du reste de la page.
 */

/** Barres horizontales. L'échelle part de zéro, sinon l'écart est un mensonge. */
function Bars({ items }: { items: Extract<Chart, { kind: "bars" }>["items"] }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className="pb-bars">
      {items.map((it) => (
        <div key={it.label} className="pb-bar-row" data-strong={it.strong ? "" : undefined}>
          <div className="pb-bar-lbl">{it.label}</div>
          <div className="pb-bar-track">
            <div className="pb-bar-fill" style={{ width: `${Math.max((it.value / max) * 100, 1.5)}%` }} />
          </div>
          <div className="pb-bar-val pb-mono">{it.display}</div>
        </div>
      ))}
    </div>
  );
}

/** Bande hebdomadaire : une ligne par jour, la plage d'ouverture posée sur
 *  une échelle horaire commune. Les jours fermés gardent leur ligne, c'est
 *  le vide qui porte l'information. */
function Week({ chart }: { chart: Extract<Chart, { kind: "week" }> }) {
  const span = chart.to - chart.from;
  const ticks = [chart.from, chart.from + span / 2, chart.to];
  /* L'échelle tombe parfois sur une demi-heure : « 14.5h » est un chiffre de
     tableur, pas un horaire. */
  const hour = (h: number) => (Number.isInteger(h) ? `${h} h` : `${Math.floor(h)} h 30`);
  return (
    <div className="pb-week">
      {chart.days.map((d) => {
        const open = d.from !== null && d.to !== null;
        return (
          <div key={d.day} className="pb-week-row" data-open={open ? "" : undefined}>
            <div className="pb-week-day">{d.day}</div>
            <div className="pb-week-track">
              {open && (
                <div
                  className="pb-week-slot"
                  style={{
                    left: `${((d.from! - chart.from) / span) * 100}%`,
                    width: `${((d.to! - d.from!) / span) * 100}%`,
                  }}
                />
              )}
            </div>
            <div className="pb-week-val pb-mono">{d.label}</div>
          </div>
        );
      })}
      <div className="pb-week-row pb-week-scale" aria-hidden="true">
        <div />
        <div className="pb-week-track">
          {ticks.map((t, i) => (
            <span key={t} className="pb-mono" style={{ left: `${(i / (ticks.length - 1)) * 100}%` }}>
              {hour(t)}
            </span>
          ))}
        </div>
        <div />
      </div>
    </div>
  );
}

export default function ProjectChart({ chart }: { chart: Chart }) {
  return (
    <figure className="pb-chart">
      <figcaption className="pb-chart-head">
        <div className="pb-modal-lbl">Le chiffre du projet</div>
        <h3 className="pb-chart-title">{chart.title}</h3>
      </figcaption>

      {chart.kind === "bars" && <Bars items={chart.items} />}
      {chart.kind === "week" && <Week chart={chart} />}

      <p className="pb-chart-note">{chart.note}</p>
    </figure>
  );
}
