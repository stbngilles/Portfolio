"use client";

import React, { useState, useRef } from "react";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Testimonial = {
  n: string;
  b: string;
  q: string;
  stars: number;
  source: string;
  date: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    n: "Detailwave",
    b: "Detailing automobile",
    q: "Super expérience avec Pixelbrute. Je recommande à 100&nbsp;%. Il est <em>très à l'écoute</em>, répond rapidement à mes demandes et mon site web est <em>exactement ce que j'attendais</em>. Merci beaucoup Pixelbrute.",
    stars: 5,
    source: "Google",
    date: "il y a un mois",
  },
  {
    n: "Pierre Vanderelst",
    b: "Zen Harmonie · Massothérapeute",
    q: "Je recommande à 200&nbsp;% — très pro, <em>à l'écoute</em>, prend le temps de comprendre notre réel besoin et de se mettre à notre place. <em>Vous avez besoin d'un site&nbsp;? Foncez.</em>",
    stars: 5,
    source: "Google",
    date: "il y a un mois",
  },
];

export default function Testimonials() {
  const [sel, setSel] = useState(0);
  const t = TESTIMONIALS[sel];
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Header
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

      // Selector buttons: slide from left
      gsap.fromTo(
        ".tm-btn",
        { opacity: 0, x: -28 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".tm-grid",
            start: "top 82%",
            once: true,
          },
        }
      );

      // Quote card: slide from right
      gsap.fromTo(
        ".tm-card",
        { opacity: 0, x: 36 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".tm-grid",
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">
            <span
              className="inline-block"
              style={{ width: 18, height: 1, background: "var(--color-accent)" }}
            />
            CLIENTS · CE QU&apos;ILS EN DISENT
          </div>
          <h2 className="serif">
            Des mots
            <br />
            <em className="serif-i">qui pèsent.</em>
          </h2>
        </div>

        <div className="tm-grid">
          <div className="flex flex-col gap-2">
            {TESTIMONIALS.map((tm, i) => (
              <button
                key={i}
                onClick={() => setSel(i)}
                className="tm-btn"
                style={{
                  textAlign: "left",
                  padding: 20,
                  background: sel === i ? "var(--color-ink)" : "transparent",
                  color: sel === i ? "var(--color-paper)" : "var(--color-ink)",
                  border: `1px solid ${sel === i ? "var(--color-ink)" : "var(--color-line)"}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 200ms",
                }}
              >
                <div className="serif" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>
                  {tm.n}
                </div>
                <div
                  className="mono uppercase mt-1"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: sel === i ? "var(--color-subtle)" : "var(--color-muted)",
                  }}
                >
                  {tm.b}
                </div>
              </button>
            ))}
          </div>

          <div
            className="tm-card relative min-h-[360px] p-12"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 4,
            }}
          >
            <div
              aria-hidden
              className="absolute serif pointer-events-none"
              style={{
                top: 8,
                right: 28,
                fontSize: 160,
                lineHeight: 1,
                color: "var(--color-accent-soft)",
                zIndex: 0,
              }}
            >
              &ldquo;
            </div>
            <div className="relative z-10">
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="var(--color-accent)"
                    style={{ color: "var(--color-accent)" }}
                  />
                ))}
              </div>
              <p
                className="serif mb-8"
                style={{
                  fontSize: "clamp(24px, 2.6vw, 36px)",
                  lineHeight: 1.25,
                  letterSpacing: "-0.018em",
                  color: "var(--color-ink)",
                }}
                dangerouslySetInnerHTML={{ __html: `« ${t.q} »` }}
              />
              <div
                className="tm-author flex flex-wrap items-center gap-4 pt-5 border-t"
                style={{ borderColor: "var(--color-line)" }}
              >
                <div
                  className="serif rounded-full flex items-center justify-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "var(--color-line)",
                    fontSize: 20,
                    color: "var(--color-ink)",
                  }}
                >
                  {t.n.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="serif" style={{ fontSize: 18 }}>{t.n}</div>
                  <div
                    className="mono uppercase"
                    style={{ fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.1em" }}
                  >
                    {t.b}
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ border: "1px solid var(--color-line)", background: "var(--color-bg)" }}
                  aria-label={`Avis ${t.source}, ${t.date}`}
                >
                  <GoogleG />
                  <span
                    className="mono uppercase"
                    style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--color-muted)" }}
                  >
                    {t.source} · {t.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tm-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 56px;
          align-items: start;
        }
        .tm-btn:hover { border-color: var(--color-ink) !important; }
        .tm-author { row-gap: 14px; }
        @media (max-width: 860px) {
          .tm-grid { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 640px) {
          .tm-grid .min-h-\\[360px\\] { padding: 28px !important; }
          .tm-author { gap: 14px; }
        }
        @media (max-width: 480px) {
          .tm-author > div:last-child {
            order: 3;
            flex-basis: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </section>
  );
}

function GoogleG() {
  return (
    <svg width="13" height="13" viewBox="0 0 48 48" aria-hidden style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
