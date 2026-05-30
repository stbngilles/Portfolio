"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: "01",
    t: "Écoute",
    em: ".",
    d: "Un appel de 30 min pour comprendre votre business, vos clients, ce qui bloque. Pas de brief formel.",
    time: "Jour 1",
  },
  {
    n: "02",
    t: "Stratégie",
    em: "&",
    d: "On pose une architecture, des messages clés, une promesse claire. Vous validez avant qu'on touche à Figma.",
    time: "Semaine 1",
  },
  {
    n: "03",
    t: "Design",
    em: "&",
    d: "Maquettes sur mesure, itérations live, aucun template. Vous voyez votre site prendre forme.",
    time: "Semaine 2–3",
  },
  {
    n: "04",
    t: "Mise en ligne",
    em: ".",
    d: "Code performant, SEO technique, hébergement sécurisé. Formation 1h pour que vous gardiez la main.",
    time: "Semaine 3–4",
  },
  {
    n: "05",
    t: "Acquisition",
    em: ".",
    d: "Campagnes Meta Ads pilotées par nous. On cible, on optimise, on rapporte. Vous voyez les premiers leads arriver — sans jamais toucher à Facebook.",
    time: "Semaine 4 → en continu",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Header reveal
      gsap.fromTo(
        sectionRef.current!.querySelectorAll(".section-head > *"),
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Step cards: cascade left → right with scale
      gsap.fromTo(
        ".process-step",
        { opacity: 0, y: 60, scale: 0.91 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: { each: 0.09, from: "start" },
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".process-grid",
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section" id="process">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">
            <span
              className="inline-block"
              style={{ width: 18, height: 1, background: "var(--color-accent)" }}
            />
            MÉTHODE · SITE + ACQUISITION
          </div>
          <h2 className="serif">
            De l&apos;idée
            <br />
            <em className="serif-i">aux premiers clients.</em>
          </h2>
        </div>
      </div>
      <div className="wrap">
        <div className="process-grid">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`process-step${s.n === "05" ? " is-acquisition" : ""}`}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--color-accent)",
                  letterSpacing: "0.14em",
                  marginBottom: "auto",
                }}
              >
                {s.n}
              </div>
              <h4
                className="serif"
                style={{
                  fontSize: 30,
                  letterSpacing: "-0.02em",
                  margin: "24px 0 8px",
                  lineHeight: 1,
                }}
              >
                {s.t}
                <em className="serif-i" style={{ color: "var(--color-accent)" }}>
                  {s.em}
                </em>
              </h4>
              <p
                className="text-[13px] leading-[1.55]"
                style={{ color: "var(--color-muted)" }}
              >
                {s.d}
              </p>
              <div
                className="mono uppercase mt-4"
                style={{
                  fontSize: 10,
                  color: "var(--color-subtle)",
                  letterSpacing: "0.12em",
                }}
              >
                ↳ {s.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .process-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        .process-step {
          background: color-mix(in oklab, var(--color-paper) 70%, transparent);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--color-line);
          border-radius: 12px;
          padding: 32px 22px;
          min-height: 260px;
          display: flex;
          flex-direction: column;
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .process-step.is-acquisition {
          border-color: var(--color-accent);
          background: color-mix(in oklab, var(--color-accent-soft) 50%, var(--color-paper));
        }
        .process-step:hover {
          transform: translateY(-6px);
          border-color: var(--color-accent);
          background: var(--color-paper);
          box-shadow: 0 20px 40px -20px rgba(31, 63, 191, 0.15);
        }
        @media (max-width: 1200px) {
          .process-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 860px) {
          .process-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .process-grid { grid-template-columns: 1fr; }
          .process-step { min-height: 0; padding: 28px 22px; }
        }
      `}</style>
    </section>
  );
}
