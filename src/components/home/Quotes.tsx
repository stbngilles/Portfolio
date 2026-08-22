"use client";

import { useState } from "react";
import Arrow from "./Arrow";
import { QUOTES } from "./data";

/**
 * Avis clients, un à la fois, en grand. Les guillemets font partie du texte
 * (avis repris mot pour mot).
 */
export default function Quotes() {
  const [i, setI] = useState(0);
  const q = QUOTES[i];
  const go = (d: number) => setI((c) => (c + d + QUOTES.length) % QUOTES.length);

  return (
    <section id="avis" className="pb-quotes">
      <div className="pb-quotes-top" data-reveal="">
        <div className="pb-over">Ce que disent les clients</div>
        <div className="pb-quote-count pb-label">
          {i + 1} / {QUOTES.length}
        </div>
      </div>

      <div className="pb-quote-clip" data-reveal="">
        <blockquote key={i} className="pb-d-m pb-quote-text">
          {q.text}
        </blockquote>
      </div>

      <div key={`who-${i}`} className="pb-quote-who">
        <div>
          <div className="pb-quote-name">{q.name}</div>
          <div className="pb-quote-role pb-cap">{q.role}</div>
        </div>

        <div className="pb-quote-nav">
          <button type="button" className="pb-arrow" onClick={() => go(-1)} aria-label="Témoignage précédent">
            <Arrow dir="w" />
          </button>
          <button type="button" className="pb-arrow" onClick={() => go(1)} aria-label="Témoignage suivant">
            <Arrow dir="e" />
          </button>
        </div>
      </div>
    </section>
  );
}
