"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const overline = sectionRef.current!.querySelector(".cta-overline");
      const h2 = sectionRef.current!.querySelector(".cta-h2");
      const p = sectionRef.current!.querySelector(".cta-p");
      const btns = sectionRef.current!.querySelector(".cta-btns");
      const metaItems = sectionRef.current!.querySelectorAll(".cta-meta-item");

      // Cinematic stagger entrance: overline → h2 → p → CTA
      gsap.fromTo(
        [overline, h2, p, btns].filter(Boolean),
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // Meta grid: scrub reveal from bottom
      if (metaItems.length) {
        gsap.fromTo(
          metaItems,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".cta-meta-grid",
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-[140px] max-[720px]:py-[80px]"
      style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
    >
      <div className="wrap">
        <div style={{ maxWidth: 980 }}>
          <span
            className="cta-overline overline"
            style={{ color: "color-mix(in oklab, var(--color-paper) 60%, transparent)" }}
          >
            <span className="dot" />
            PRÊT À LANCER ?
          </span>
          <h2
            className="cta-h2 display"
            style={{
              fontSize: "clamp(36px, 5vw, 68px)",
              lineHeight: 1.04,
              letterSpacing: "-0.024em",
              margin: "32px 0 40px",
            }}
          >
            On discute de votre projet
            <br />
            <span style={{ color: "color-mix(in oklab, var(--color-paper) 42%, transparent)" }}>
              autour d&apos;un café ?
            </span>
          </h2>
          <p
            className="cta-p mb-12"
            style={{
              fontSize: 18,
              color: "color-mix(in oklab, var(--color-paper) 70%, transparent)",
              maxWidth: 560,
              lineHeight: 1.5,
            }}
          >
            30 minutes, en visio ou dans un café à Liège. On vous dit franchement
            si on peut vous aider, et combien ça coûterait. Aucun engagement, et
            un devis écrit sous 48h si ça matche.
          </p>
          <div className="cta-btns flex gap-3 flex-wrap">
            <Link
              href="#contact"
              className="btn"
              style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
            >
              Remplir le formulaire
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="#devis"
              className="btn btn-ghost"
              style={{
                background: "transparent",
                color: "var(--color-paper)",
                borderColor: "color-mix(in oklab, var(--color-paper) 30%, transparent)",
              }}
            >
              Estimer d&apos;abord
            </Link>
          </div>
        </div>

        <div
          className="cta-meta-grid grid gap-8 mt-24 pt-12 border-t"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            borderColor: "color-mix(in oklab, var(--color-paper) 12%, transparent)",
          }}
        >
          <FinalMeta lbl="Email">
            <span>contact@pixelbrute.be</span>
          </FinalMeta>
          <FinalMeta lbl="Studio">
            Liège, Belgique
            <br />
            <span style={{ color: "color-mix(in oklab, var(--color-paper) 55%, transparent)" }}>
              On se déplace aussi en visio
            </span>
          </FinalMeta>
          <FinalMeta lbl="Réponse">
            Sous 48h ouvrées
            <br />
            <span style={{ color: "color-mix(in oklab, var(--color-paper) 55%, transparent)" }}>
              Lun–Ven · 9:00 → 18:00
            </span>
          </FinalMeta>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          section .cta-meta-grid { grid-template-columns: 1fr !important; }
        }
        .cta-overline,
        .cta-h2,
        .cta-p,
        .cta-btns,
        .cta-meta-item {
          will-change: opacity, transform;
        }
      `}</style>
    </section>
  );
}

function FinalMeta({ lbl, children }: { lbl: string; children: React.ReactNode }) {
  return (
    <div className="cta-meta-item">
      <div
        className="mono uppercase mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
      >
        {lbl}
      </div>
      <div style={{ fontSize: 15, color: "var(--color-paper)", lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}
