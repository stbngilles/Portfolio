"use client";

import { useState } from "react";
import { FAQS } from "./data";

/** Accordéon FAQ. Vit sur /contact depuis qu'elle a quitté la homepage. */
export default function Faq() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="pb-faq-grid">
      <div>
        <div className="pb-over">Questions</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
          <div
            style={{
              fontSize: "clamp(40px, 4.6vw, 72px)",
              lineHeight: 0.9,
              letterSpacing: "-0.045em",
              fontWeight: 500,
              color: "rgba(15,15,20,0.32)",
            }}
          >
            FAQ
          </div>
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
            <button
              type="button"
              className="pb-faq-q"
              aria-expanded={open === i}
              onClick={() => setOpen((c) => (c === i ? -1 : i))}
            >
              <span>{f.q}</span>
              <span className="pb-mono" style={{ flex: "none", fontSize: 20 }} aria-hidden="true">
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && <div className="pb-faq-a">{f.a}</div>}
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(15,15,20,0.28)" }} />
      </div>
    </section>
  );
}
