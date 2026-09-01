"use client";

import { useState } from "react";
import { FAQS } from "./data";

/**
 * Accordéon FAQ. Vit sur /contact depuis qu'elle a quitté la homepage.
 *
 * Deux points tiennent au référencement plutôt qu'à l'affichage :
 * , chaque question est un `h3` qui enveloppe son bouton (motif d'accordéon
 *    de l'APG) ; la page n'avait sinon aucun sous-titre ;
 * , les réponses fermées restent dans le DOM, masquées par `hidden`. Elles
 *    n'étaient auparavant montées qu'à l'ouverture : sept réponses sur huit
 *    n'existaient nulle part dans le HTML.
 */
export default function Faq() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="pb-faq-grid">
      <div>
        <div className="pb-over">Questions</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(40px, 4.6vw, 72px)",
              lineHeight: 0.9,
              letterSpacing: "-0.045em",
              fontWeight: 500,
              color: "rgba(15,15,20,0.32)",
            }}
          >
            FAQ
          </h2>
          <div
            className="pb-mono"
            style={{ border: "1px solid rgba(15,15,20,0.4)", borderRadius: 10, fontSize: 15, padding: "9px 15px" }}
          >
            {FAQS.length}
          </div>
        </div>
        <p className="pb-mono" style={{ fontSize: 11, lineHeight: 1.8, color: "var(--pb-accent)", marginTop: 40, maxWidth: 220 }}>
          Si votre question n&apos;est pas là, posez-la dans le formulaire ci-dessus.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {FAQS.map((f, i) => (
          <div key={f.q} style={{ borderTop: "1px solid rgba(15,15,20,0.28)" }}>
            <h3 className="pb-faq-h">
              <button
                type="button"
                className="pb-faq-q"
                aria-expanded={open === i}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen((c) => (c === i ? -1 : i))}
              >
                <span>{f.q}</span>
              </button>
            </h3>
            <div className="pb-faq-a" id={`faq-a-${i}`} hidden={open !== i}>
              {f.a}
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(15,15,20,0.28)" }} />
      </div>
    </section>
  );
}
