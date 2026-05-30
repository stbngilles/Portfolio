"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  val: string;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { val: "5.0", suffix: "★", label: "Note Google" },
  { val: "<4", suffix: " sem.", label: "Délai moyen" },
  { val: "48", suffix: "h", label: "Réponse garantie" },
  { val: "0", suffix: "", label: "Template utilisé" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = sectionRef.current?.querySelectorAll(".stats-item");
      if (!items) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 28, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="stats-section" aria-label="Repères chiffrés">
      <div className="wrap">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stats-item">
              <div className="stats-val display">
                {s.val}
                {s.suffix && <span className="stats-suffix">{s.suffix}</span>}
              </div>
              <div className="stats-label mono uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-section {
          background: var(--color-ink);
          color: var(--color-paper);
          padding: 40px 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .stats-item {
          padding: 6px 28px;
          border-right: 1px solid color-mix(in oklab, var(--color-paper) 12%, transparent);
          text-align: left;
          will-change: opacity, transform;
        }
        .stats-item:last-child { border-right: none; }
        .stats-val {
          font-size: clamp(40px, 5vw, 60px);
          letter-spacing: -0.028em;
          line-height: 1;
          color: var(--color-paper);
          font-variant-numeric: tabular-nums;
        }
        .stats-suffix { color: var(--color-accent); margin-left: 4px; font-weight: 500; }
        .stats-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          color: color-mix(in oklab, var(--color-paper) 62%, transparent);
          margin-top: 12px;
        }
        @media (max-width: 860px) {
          .stats-section { padding: 28px 0; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-item {
            padding: 18px;
            border-right: 1px solid color-mix(in oklab, var(--color-paper) 12%, transparent);
            border-bottom: 1px solid color-mix(in oklab, var(--color-paper) 12%, transparent);
          }
          .stats-item:nth-child(2n) { border-right: none; }
          .stats-item:nth-last-child(-n+2) { border-bottom: none; }
          .stats-val { font-size: 36px; }
          .stats-label { margin-top: 8px; font-size: 9.5px; }
        }
        @media (max-width: 420px) {
          .stats-grid { grid-template-columns: 1fr; }
          .stats-item { border-right: none; padding: 14px; }
          .stats-item:last-child { border-bottom: none; }
          .stats-val { font-size: 32px; }
        }
      `}</style>
    </section>
  );
}
