"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ExternalLink, MousePointer2, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  title: string;
  domain: string;
  href: string;
  cat: string;
  img?: string;
  placeholder?: { tint: string; sub: string };
  chips: string[];
};

const PROJECTS: Project[] = [
  {
    title: "Zen Harmonie",
    domain: "zenharmoniehélécine.be",
    href: "https://zenharmoniehélécine.be",
    cat: "Massothérapie · Hélécine",
    img: "/projects/zen_harmonie.jpg",
    chips: ["★ 5.0 Google", "Réservation en ligne", "SEO local"],
  },
  {
    title: "MotoDistri",
    domain: "motodistri.com",
    href: "https://motodistri.com",
    cat: "E-commerce moto · Berloz, BE",
    img: "/projects/motodistri.jpg",
    chips: ["~5K visites / jour", "15€ / jour de pubs", "ROI éprouvé"],
  },
  {
    title: "Detail Wave",
    domain: "detailwave.be",
    href: "https://detailwave.be",
    cat: "Detailing automobile",
    img: "/projects/detail_wave.jpg",
    chips: ["★ 5.0 Google", "Vitrine premium", "Lead generation"],
  },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(
    () => {
      cardRefs.current.forEach((card) => {
        if (!card) return;

        const imgWrap = card.querySelector<HTMLElement>(".ps-img-wrap");

        // Entrance: slide up + fade in
        gsap.fromTo(
          card,
          { opacity: 0, y: 56 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );

        if (imgWrap) {
          // Scale scrub: 0.87 → 1.0 as card enters viewport
          gsap.fromTo(
            imgWrap,
            { scale: 0.87 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "center 35%",
                scrub: 1.5,
              },
            }
          );

          // Exit: darken & fade as card scrolls past viewport top
          gsap.to(imgWrap, {
            opacity: 0.22,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top -5%",
              end: "top -45%",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="ps-section" aria-label="Sites en ligne">
      <div className="wrap">
        <div className="ps-layout">
          {/* Sticky left panel */}
          <div className="ps-left">
            <div className="overline">
              <span className="dot" />
              EN LIGNE · MAINTENANT
            </div>
            <h2
              className="display ps-h2"
              style={{
                fontSize: "clamp(28px, 3.5vw, 52px)",
                letterSpacing: "-0.028em",
                margin: "18px 0 0",
                lineHeight: 1.05,
              }}
            >
              Voilà à quoi ça{" "}
              <em className="serif-i" style={{ color: "var(--color-accent)" }}>
                ressemble.
              </em>
            </h2>
            <p className="ps-sub">
              Pas une démo, pas un template. Ce qu&apos;on a livré, en ligne,
              aujourd&apos;hui.
            </p>
            <a href="#devis" className="btn btn-ghost ps-cta">
              Estimer mon projet
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Scrolling cards column */}
          <div className="ps-right">
            {PROJECTS.map((p, i) => (
              <a
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ps-card group"
                aria-label={`Voir ${p.title} — ${p.domain}`}
              >
                <div className="ps-browser">
                  <div className="ps-browser-bar">
                    <span className="ps-dot ps-dot-r" />
                    <span className="ps-dot ps-dot-y" />
                    <span className="ps-dot ps-dot-g" />
                    <div className="ps-url">
                      <span className="ps-url-text mono">{p.domain}</span>
                    </div>
                    <ExternalLink className="ps-ext" aria-hidden size={12} />
                  </div>
                  <div className="ps-screen">
                    <div className="ps-img-wrap">
                      <div className="ps-cursor-hint" aria-hidden>
                        <MousePointer2 size={12} strokeWidth={2} />
                        <span>Voir le site</span>
                      </div>
                      {p.img ? (
                        <Image
                          src={p.img}
                          alt={`Aperçu du site ${p.title}`}
                          fill
                          sizes="(max-width: 900px) 100vw, 55vw"
                          className="ps-img"
                        />
                      ) : (
                        <div
                          className="ps-placeholder"
                          style={{
                            background: `linear-gradient(135deg, ${
                              p.placeholder?.tint ?? "#0F0F14"
                            } 0%, color-mix(in oklab, ${
                              p.placeholder?.tint ?? "#0F0F14"
                            } 80%, #1F3FBF) 100%)`,
                          }}
                        >
                          <div className="ps-placeholder-title">{p.title}</div>
                          <div className="ps-placeholder-sub mono">
                            {p.placeholder?.sub}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ps-meta">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3
                      className="serif m-0"
                      style={{
                        fontSize: 24,
                        letterSpacing: "-0.012em",
                        lineHeight: 1.1,
                      }}
                    >
                      {p.title}
                    </h3>
                    <span
                      className="mono uppercase"
                      style={{
                        fontSize: 10.5,
                        letterSpacing: "0.12em",
                        color: "var(--color-muted)",
                      }}
                    >
                      {p.cat}
                    </span>
                  </div>
                  <div className="ps-chips">
                    {p.chips.map((c, j) => (
                      <span key={j} className="ps-chip mono">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ps-section {
          padding: 100px 0 80px;
          background: var(--color-bg);
          position: relative;
        }

        /* ── Layout: sticky-left + scrolling-right ── */
        .ps-layout {
          display: flex;
          align-items: flex-start;
          gap: 80px;
        }
        .ps-left {
          position: sticky;
          top: 140px;
          width: 300px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .ps-cta { margin-top: 32px; }
        .ps-sub {
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-muted);
          margin: 18px 0 0;
        }
        .ps-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 56px;
          padding-bottom: 80px;
          min-width: 0;
        }

        /* ── Card ── */
        .ps-card {
          display: block;
          text-decoration: none;
          color: var(--color-ink);
          will-change: opacity, transform;
        }
        .ps-card:hover .ps-browser {
          box-shadow:
            0 30px 60px -28px rgba(31, 63, 191, .25),
            0 10px 24px -12px rgba(15, 15, 20, .08);
          border-color: var(--color-accent);
        }

        /* ── Browser mockup ── */
        .ps-browser {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--color-line);
          background: var(--color-paper);
          box-shadow: 0 22px 44px -24px rgba(15, 15, 20, .15),
                      0 6px 16px -8px rgba(15, 15, 20, .05);
          transition: box-shadow 360ms, border-color 360ms;
        }
        .ps-browser-bar {
          height: 34px;
          background: var(--color-bg-deep);
          border-bottom: 1px solid var(--color-line);
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 6px;
          position: relative;
        }
        .ps-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
        .ps-dot-r { background: #ff5f56; }
        .ps-dot-y { background: #ffbd2e; }
        .ps-dot-g { background: #27c93f; }
        .ps-url {
          position: absolute; left: 50%; transform: translateX(-50%);
          background: var(--color-paper); border: 1px solid var(--color-line);
          padding: 4px 14px; border-radius: 999px; max-width: 62%; overflow: hidden; line-height: 1;
        }
        .ps-url-text { font-size: 11px; color: var(--color-muted); letter-spacing: 0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
        .ps-ext { margin-left: auto; color: var(--color-subtle); }

        .ps-screen {
          aspect-ratio: 16 / 10;
          position: relative;
          background: var(--color-line-soft);
          overflow: hidden;
        }

        /* GSAP target — overflow: hidden traps the scale animation */
        .ps-img-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          will-change: transform, opacity;
          transform-origin: center center;
        }
        .ps-img { object-fit: cover; object-position: top center; }

        .ps-cursor-hint {
          position: absolute; bottom: 14px; right: 14px; z-index: 10;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 10px 6px 8px;
          background: var(--color-accent); color: var(--color-paper);
          border-radius: 999px;
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
          opacity: 0; transform: translateY(4px) scale(0.92);
          transition: opacity 240ms cubic-bezier(.2,.8,.2,1), transform 240ms cubic-bezier(.2,.8,.2,1);
          pointer-events: none; white-space: nowrap;
        }
        .ps-card:hover .ps-cursor-hint { opacity: 1; transform: translateY(0) scale(1); }

        .ps-placeholder {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px; padding: 24px; color: var(--color-paper); text-align: center;
        }
        .ps-placeholder-title { font-family: var(--font-geist), sans-serif; font-weight: 600; font-size: clamp(28px, 3vw, 40px); line-height: 1; letter-spacing: -0.024em; }
        .ps-placeholder-sub { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: color-mix(in oklab, var(--color-paper) 70%, transparent); }

        /* ── Meta ── */
        .ps-meta { padding: 22px 4px 0; }
        .ps-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
        .ps-chip { padding: 5px 11px; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid var(--color-line); border-radius: 999px; color: var(--color-muted); background: var(--color-paper); line-height: 1.2; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .ps-layout { flex-direction: column; gap: 40px; }
          .ps-left { position: static; width: 100%; }
          .ps-right { gap: 40px; padding-bottom: 40px; }
        }
        @media (max-width: 720px) {
          .ps-section { padding: 64px 0 56px; }
          .ps-browser-bar { height: 28px; padding: 0 10px; }
          .ps-url { padding: 3px 10px; max-width: 60%; }
          .ps-url-text { font-size: 10px; }
          .ps-dot { width: 7px; height: 7px; }
          .ps-meta { padding: 18px 2px 0; }
        }
        @media (max-width: 480px) {
          .ps-sub { font-size: 14px; }
          .ps-chip { font-size: 9.5px; padding: 4px 9px; }
          .ps-right { gap: 32px; }
        }
      `}</style>
    </section>
  );
}
