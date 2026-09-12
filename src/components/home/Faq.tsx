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
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 13 }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(38.3px, 4.6vw, 78.8px)",
              lineHeight: "var(--pb-lh-display)",
              letterSpacing: "-0.045em",
              fontWeight: 500,
              color: "rgba(15,15,20,0.32)",
            }}
          >
            FAQ
          </h2>
          <div
            className="pb-mono"
            style={{ border: "1px solid rgba(15,15,20,0.4)", borderRadius: "var(--pb-r-s)", fontSize: "var(--pb-t-small)", padding: "10px 16px" }}
          >
            {FAQS.length}
          </div>
        </div>
        <p className="pb-mono" style={{ fontSize: "var(--pb-t-label)", lineHeight: "var(--pb-lh-read)", color: "var(--pb-accent)", marginTop: 43, maxWidth: 233 }}>
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
