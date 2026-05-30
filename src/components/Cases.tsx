"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

type Fact = { label: string; value: string };

type Case = {
  num: string;
  title: string;
  cat: string;
  link: string;
  status: "live" | "demo";
  facts: Fact[];
  img: string;
};

const CASES: Case[] = [
  {
    num: "001",
    title: "Zen Harmonie",
    cat: "Massothérapie · Hélécine",
    link: "https://zenharmoniehélécine.be",
    status: "live",
    img: "/projects/zen_harmonie.png",
    facts: [
      { label: "Type", value: "Vitrine + réservation" },
      { label: "Stack", value: "Next.js / TypeScript" },
      { label: "Note Google", value: "★★★★★ 5.0" },
    ],
  },
  {
    num: "002",
    title: "Detail Wave",
    cat: "Detailing automobile",
    link: "https://detailwave.be",
    status: "live",
    img: "/projects/detail_wave.png",
    facts: [
      { label: "Type", value: "Vitrine premium" },
      { label: "Stack", value: "Next.js / TypeScript" },
      { label: "Note Google", value: "★★★★★ 5.0" },
    ],
  },
];


export default function Cases() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (previewRef.current) {
        // Smoothly position the container centered on the cursor
        previewRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">
            <span
              className="inline-block"
              style={{
                width: 18,
                height: 1,
                background: "var(--color-accent)",
              }}
            />
            RÉALISATIONS · SÉLECTION
          </div>
          <h2 className="serif">
            Des projets qui
            <br />
            <em className="serif-i">parlent d&apos;eux-mêmes.</em>
          </h2>
        </div>

        <div className="flex flex-col">
          {CASES.map((c, i) => (
            <a
              key={i}
              href={c.link}
              target={c.link.startsWith("http") ? "_blank" : "_self"}
              rel={c.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className="case-row"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div
                className="mono case-num"
                style={{ color: "var(--color-muted)" }}
              >
                {c.num}/
              </div>
              <div className="case-main">
                <div className="case-title-row">
                  <h3
                    className="serif case-title"
                    style={{
                      fontSize: 36,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      margin: 0,
                    }}
                  >
                    {c.title}
                  </h3>
                  {c.status === "demo" && (
                    <span className="case-tag-demo mono uppercase">Démo</span>
                  )}
                </div>
                <div
                  className="mono case-cat"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                  }}
                >
                  {c.cat}
                </div>
              </div>

              <div className="case-facts">
                {c.facts.map((f, j) => (
                  <div key={j} className="case-fact">
                    <div className="case-fact-label">{f.label}</div>
                    <div className="case-fact-value">{f.value}</div>
                  </div>
                ))}
              </div>

              <div
                className="case-cta inline-flex items-center gap-2 justify-end text-[13px] font-medium"
                style={{ color: "var(--color-ink)" }}
              >
                {c.status === "live" ? "Voir le site" : "Voir la démo"}
                <ArrowRight className="w-3.5 h-3.5 case-cta-arrow" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Floating Project Preview (follows the cursor) */}
      <div
        ref={previewRef}
        className={`hover-preview-container ${hoverIndex !== null ? "active" : ""}`}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          transform: "translate3d(0, 0, 0) translate(-50%, -50%)",
        }}
      >
        {CASES.map((c, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: hoverIndex === idx ? 1 : 0,
              backgroundImage: `url(${c.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      <style>{`
        .case-row {
          display: grid;
          grid-template-columns: 80px 1.4fr 1.6fr 140px;
          gap: 32px;
          padding: 36px 0;
          border-top: 1px solid var(--color-line);
          align-items: center;
          cursor: pointer;
          transition: padding 360ms cubic-bezier(.2,.8,.2,1), background 240ms;
          text-decoration: none;
          color: var(--color-ink);
          position: relative;
        }
        .case-row:last-child { border-bottom: 1px solid var(--color-line); }
        .case-row::before {
          content: "";
          position: absolute;
          left: 0; right: 0; top: -1px;
          height: 1px;
          background: var(--color-accent);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 600ms cubic-bezier(.2,.8,.2,1);
        }
        .case-row:hover::before { transform: scaleX(1); }
        .case-row:hover { padding-left: 20px; padding-right: 20px; }
        .case-row:hover .case-cta-arrow { transform: translateX(6px); }
        .case-row:hover .case-title { color: var(--color-accent); }
        .case-cta-arrow { transition: transform 240ms; }
        .case-title { transition: color 240ms; }

        .case-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .case-tag-demo {
          font-size: 9px;
          letter-spacing: 0.16em;
          padding: 3px 8px;
          border: 1px solid var(--color-line);
          color: var(--color-muted);
          border-radius: 999px;
          white-space: nowrap;
          line-height: 1.4;
        }

        .case-facts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .case-fact-label {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-subtle);
          margin-bottom: 6px;
        }
        .case-fact-value {
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          font-size: 13px;
          color: var(--color-ink);
          letter-spacing: -0.01em;
        }

        @media (max-width: 1080px) {
          .case-row { grid-template-columns: 60px 1fr 1fr 80px; gap: 20px; }
          .case-facts { gap: 10px; }
          .case-fact-label { font-size: 9px; }
          .case-fact-value { font-size: 12px; }
        }
        @media (max-width: 860px) {
          .case-row {
            grid-template-columns: 1fr;
            gap: 18px;
            padding: 32px 0;
          }
          .case-row:hover { padding-left: 0; padding-right: 0; }
          .case-title { font-size: 28px !important; }
          .case-cta { justify-content: flex-start !important; }
          .case-facts {
            grid-template-columns: 1fr;
            gap: 10px;
            padding-top: 6px;
            border-top: 1px dashed var(--color-line);
          }
          .case-fact { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
          .case-fact-label { margin-bottom: 0; }
          .case-fact-value { font-size: 13px; }
        }
      `}</style>
    </section>
  );
}
