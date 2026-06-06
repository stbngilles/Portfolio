"use client";

import React, { useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PLANS = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: 120,
    tagline: "Le minimum vital pour dormir tranquille.",
    features: [
      "Hébergement + base de données",
      "Mises à jour de sécurité",
      "1h de support / mois",
    ],
    featured: false,
  },
  {
    id: "business",
    name: "Business",
    price: 220,
    tagline: "Pour un site qui évolue avec vous.",
    features: [
      "Tout l'Essentiel",
      "3h de modifications / mois",
      "Rapport mensuel de performance",
    ],
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 400,
    tagline: "Quand votre site = votre chiffre.",
    features: [
      "Tout le Business",
      "Évolutions prioritaires",
      "SLA d'intervention sous 24h",
    ],
    featured: false,
  },
];

export default function Maintenance() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
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

      gsap.fromTo(
        ".plan-card",
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".plan-grid",
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section section-alt" id="maintenance">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">
            <span
              className="inline-block"
              style={{ width: 18, height: 1, background: "var(--color-accent)" }}
            />
            APRÈS LA LIVRAISON · MAINTENANCE
          </div>
          <h2 className="serif">
            Un site vivant,
            <br />
            <em className="serif-i">pas un site oublié.</em>
          </h2>
          <p
            className="text-[15px] leading-[1.6] max-w-[560px] mt-4"
            style={{ color: "var(--color-muted)" }}
          >
            Hébergement, sécurité, évolutions. Forfaits mensuels indépendants du projet — vous choisissez le niveau qui colle à votre usage.
          </p>
        </div>

        <div className="plan-grid">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`plan-card${p.featured ? " is-featured" : ""}`}
            >
              {p.featured && (
                <div className="plan-badge mono uppercase">Recommandé</div>
              )}
              <div
                className="mono uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: p.featured ? "var(--color-paper)" : "var(--color-accent)",
                  opacity: p.featured ? 0.7 : 1,
                }}
              >
                {p.id.toUpperCase()}
              </div>
              <h3
                className="serif"
                style={{
                  fontSize: 38,
                  letterSpacing: "-0.02em",
                  margin: "16px 0 4px",
                  lineHeight: 1,
                  color: p.featured ? "var(--color-paper)" : "var(--color-ink)",
                }}
              >
                {p.name}
              </h3>
              <p
                className="text-[13px] leading-[1.5]"
                style={{
                  color: p.featured
                    ? "color-mix(in oklab, var(--color-paper) 75%, transparent)"
                    : "var(--color-muted)",
                  marginBottom: 24,
                }}
              >
                {p.tagline}
              </p>

              <div
                className="serif"
                style={{
                  fontSize: 64,
                  lineHeight: 0.9,
                  letterSpacing: "-0.035em",
                  color: p.featured ? "var(--color-paper)" : "var(--color-ink)",
                }}
              >
                {p.price}
                <em
                  className="serif-i"
                  style={{
                    color: p.featured ? "#FFD84D" : "var(--color-accent)",
                  }}
                >
                  €
                </em>
                <span
                  className="mono"
                  style={{
                    fontSize: 13,
                    marginLeft: 6,
                    color: p.featured
                      ? "color-mix(in oklab, var(--color-paper) 65%, transparent)"
                      : "var(--color-muted)",
                    letterSpacing: "0.02em",
                  }}
                >
                  / mois HTVA
                </span>
              </div>

              <ul className="plan-features">
                {p.features.map((f, i) => (
                  <li key={i}>
                    <Check
                      size={14}
                      style={{
                        color: p.featured ? "#FFD84D" : "var(--color-accent)",
                        flexShrink: 0,
                        marginTop: 3,
                      }}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="btn"
                style={{
                  marginTop: "auto",
                  background: p.featured
                    ? "var(--color-paper)"
                    : "var(--color-ink)",
                  color: p.featured
                    ? "var(--color-accent-ink)"
                    : "var(--color-paper)",
                }}
              >
                Choisir {p.name}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .plan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 48px;
        }
        .plan-card {
          position: relative;
          background: color-mix(in oklab, var(--color-paper) 95%, transparent);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--color-line);
          border-radius: 16px;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .plan-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px -30px rgba(31, 63, 191, 0.25);
        }
        .plan-card.is-featured {
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-ink) 100%);
          border-color: var(--color-accent);
          color: var(--color-paper);
        }
        .plan-card.is-featured::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background-image:
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }
        .plan-card > * { position: relative; z-index: 1; }
        .plan-badge {
          position: absolute;
          top: -10px;
          left: 24px;
          background: #FFD84D;
          color: var(--color-ink);
          font-size: 10px;
          letter-spacing: 0.14em;
          padding: 5px 10px;
          border-radius: 999px;
          z-index: 2;
        }
        .plan-features {
          margin: 24px 0 28px;
          padding: 24px 0 0;
          border-top: 1px solid var(--color-line);
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 13.5px;
          line-height: 1.5;
        }
        .plan-card.is-featured .plan-features {
          border-top-color: color-mix(in oklab, var(--color-paper) 18%, transparent);
          color: color-mix(in oklab, var(--color-paper) 85%, transparent);
        }
        .plan-features li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        @media (max-width: 980px) {
          .plan-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>
    </section>
  );
}
