"use client";

import React, { useRef } from "react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const OFFERS = [
  {
    id: "ads_setup",
    name: "Setup campagne",
    price: 500,
    unit: "one-shot",
    tagline: "On lance proprement, vous êtes tranquille.",
    features: [
      "Audit ciblage + audiences",
      "Création des visuels & copy",
      "Tracking Pixel + conversions",
    ],
    featured: false,
  },
  {
    id: "ads_pack",
    name: "Pack lancement",
    price: 1450,
    unit: "setup + 3 mois",
    tagline: "Setup + 3 mois de gestion. Économisez 100 €.",
    features: [
      "Setup complet inclus",
      "3 mois de gestion mensuelle",
      "Rapport hebdo + ajustements live",
    ],
    featured: true,
    saving: 100,
  },
  {
    id: "ads_gestion",
    name: "Gestion mensuelle",
    price: 350,
    unit: "/ mois",
    tagline: "Pilotage continu, optimisation chaque semaine.",
    features: [
      "Optimisation hebdo des campagnes",
      "A/B tests sur visuels & audiences",
      "Rapport mensuel détaillé",
    ],
    featured: false,
  },
];

export default function MetaAds() {
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
        ".ads-card",
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".ads-grid",
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".ads-notice",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".ads-notice",
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section" id="ads">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">
            <span
              className="inline-block"
              style={{ width: 18, height: 1, background: "var(--color-accent)" }}
            />
            PUBLICITÉ DIGITALE · META ADS
          </div>
          <h2 className="serif">
            Du trafic qui
            <br />
            <em className="serif-i">convertit.</em>
          </h2>
          <p
            className="text-[15px] leading-[1.6] max-w-[560px] mt-4"
            style={{ color: "var(--color-muted)" }}
          >
            Campagnes Facebook & Instagram pilotées de A à Z. On cible, on teste, on optimise — vous voyez les leads arriver.
          </p>
        </div>

        <div className="ads-grid">
          {OFFERS.map((o) => (
            <div
              key={o.id}
              className={`ads-card${o.featured ? " is-featured" : ""}`}
            >
              {o.featured && o.saving && (
                <div className="ads-badge mono uppercase">
                  −{o.saving} € économisés
                </div>
              )}
              <div
                className="mono uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: o.featured ? "var(--color-paper)" : "var(--color-accent)",
                  opacity: o.featured ? 0.7 : 1,
                }}
              >
                {o.unit.toUpperCase()}
              </div>
              <h3
                className="serif"
                style={{
                  fontSize: 32,
                  letterSpacing: "-0.02em",
                  margin: "14px 0 4px",
                  lineHeight: 1,
                  color: o.featured ? "var(--color-paper)" : "var(--color-ink)",
                }}
              >
                {o.name}
              </h3>
              <p
                className="text-[13px] leading-[1.5]"
                style={{
                  color: o.featured
                    ? "color-mix(in oklab, var(--color-paper) 75%, transparent)"
                    : "var(--color-muted)",
                  marginBottom: 22,
                }}
              >
                {o.tagline}
              </p>

              <div
                className="serif"
                style={{
                  fontSize: 56,
                  lineHeight: 0.9,
                  letterSpacing: "-0.035em",
                  color: o.featured ? "var(--color-paper)" : "var(--color-ink)",
                }}
              >
                {o.price.toLocaleString("fr-BE")}
                <em
                  className="serif-i"
                  style={{
                    color: o.featured ? "#FFD84D" : "var(--color-accent)",
                  }}
                >
                  €
                </em>
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  marginTop: 4,
                  color: o.featured
                    ? "color-mix(in oklab, var(--color-paper) 65%, transparent)"
                    : "var(--color-muted)",
                  letterSpacing: "0.06em",
                }}
              >
                HTVA · {o.unit}
              </div>

              <ul className="ads-features">
                {o.features.map((f, i) => (
                  <li key={i}>
                    <Check
                      size={14}
                      style={{
                        color: o.featured ? "#FFD84D" : "var(--color-accent)",
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
                  background: o.featured
                    ? "var(--color-paper)"
                    : "var(--color-ink)",
                  color: o.featured
                    ? "var(--color-accent-ink)"
                    : "var(--color-paper)",
                }}
              >
                {o.featured ? "Lancer mon pack" : `Choisir ${o.name}`}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        <div className="ads-notice">
          <AlertCircle
            size={18}
            style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: 2 }}
          />
          <p>
            <strong>Budget publicitaire facturé directement par Meta</strong> au client — jamais géré ni avancé par Pixel Brut. Vous gardez le contrôle total de votre carte et de votre dépense.
          </p>
        </div>
      </div>

      <style>{`
        .ads-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 48px;
        }
        .ads-card {
          position: relative;
          background: color-mix(in oklab, var(--color-paper) 95%, transparent);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--color-line);
          border-radius: 16px;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .ads-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px -30px rgba(31, 63, 191, 0.25);
        }
        .ads-card.is-featured {
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-ink) 100%);
          border-color: var(--color-accent);
          color: var(--color-paper);
        }
        .ads-card.is-featured::before {
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
        .ads-card > * { position: relative; z-index: 1; }
        .ads-badge {
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
        .ads-features {
          margin: 22px 0 26px;
          padding: 22px 0 0;
          border-top: 1px solid var(--color-line);
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 13.5px;
          line-height: 1.5;
        }
        .ads-card.is-featured .ads-features {
          border-top-color: color-mix(in oklab, var(--color-paper) 18%, transparent);
          color: color-mix(in oklab, var(--color-paper) 85%, transparent);
        }
        .ads-features li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .ads-notice {
          margin-top: 40px;
          padding: 18px 22px;
          background: color-mix(in oklab, var(--color-accent-soft, var(--color-accent)) 12%, var(--color-paper));
          border: 1px solid color-mix(in oklab, var(--color-accent) 25%, transparent);
          border-radius: 12px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--color-ink-soft, var(--color-ink));
          will-change: opacity, transform;
        }
        .ads-notice strong { color: var(--color-ink); }
        @media (max-width: 980px) {
          .ads-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>
    </section>
  );
}
