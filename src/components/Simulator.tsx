"use client";

import React, { useMemo, useState, useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const SIM_DATA = {
  type: [
    { id: "vitrine", label: "Site vitrine", base: 1800 },
    { id: "refonte", label: "Refonte", base: 2400 },
    { id: "ecom", label: "E-commerce", base: 3800 },
    { id: "landing", label: "Landing page", base: 900 },
  ],
  pages: [
    { id: "1-5", label: "1–5 pages", mult: 1 },
    { id: "6-10", label: "6–10 pages", mult: 1.35 },
    { id: "10+", label: "10+ pages", mult: 1.75 },
  ],
  features: [
    { id: "seo", label: "SEO technique +", add: 400 },
    { id: "blog", label: "Blog / CMS", add: 500 },
    { id: "multi", label: "Multilingue", add: 600 },
    { id: "resa", label: "Réservation en ligne", add: 700 },
    { id: "copy", label: "Rédaction des textes", add: 450 },
    { id: "photo", label: "Shooting photo", add: 800 },
  ],
  delay: [
    { id: "4w", label: "4 semaines", mult: 1 },
    { id: "2w", label: "2 semaines (express)", mult: 1.25 },
  ],
};

export default function Simulator() {
  const [type, setType] = useState("vitrine");
  const [pages, setPages] = useState("1-5");
  const [features, setFeatures] = useState<string[]>(["seo"]);
  const [delay, setDelay] = useState("4w");
  const sectionRef = useRef<HTMLElement>(null);

  const est = useMemo(() => {
    const t = SIM_DATA.type.find((x) => x.id === type)!;
    const p = SIM_DATA.pages.find((x) => x.id === pages)!;
    const d = SIM_DATA.delay.find((x) => x.id === delay)!;
    const base = t.base * p.mult * d.mult;
    const addOns = features.reduce((s, id) => {
      const f = SIM_DATA.features.find((x) => x.id === id);
      return s + (f ? f.add : 0);
    }, 0);
    const total = Math.round((base + addOns) / 50) * 50;
    return {
      total,
      low: Math.round(((total * 0.9) / 50) * 50),
      high: Math.round(((total * 1.15) / 50) * 50),
    };
  }, [type, pages, features, delay]);

  const toggleFeature = (id: string) =>
    setFeatures((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const fmt = (n: number) => n.toLocaleString("fr-BE").replace(",", " ");

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

      // Simulator card: scale up from 0.95 + fade
      gsap.fromTo(
        ".sim-wrap",
        { opacity: 0, scale: 0.95, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".sim-wrap",
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section section-alt" id="devis">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">
            <span
              className="inline-block"
              style={{ width: 18, height: 1, background: "var(--color-accent)" }}
            />
            SIMULATEUR · ESTIMATION EN DIRECT
          </div>
          <h2 className="serif">
            Combien ça
            <br />
            <em className="serif-i">coûte ?</em> Vous voyez.
          </h2>
        </div>

        <div className="sim-wrap">
          <div className="sim-grid">
            <div className="sim-left">
              <SimStep label="Type de projet" num="01">
                {SIM_DATA.type.map((o) => (
                  <SimOpt key={o.id} on={type === o.id} onClick={() => setType(o.id)}>
                    {o.label}
                  </SimOpt>
                ))}
              </SimStep>
              <SimStep label="Nombre de pages" num="02">
                {SIM_DATA.pages.map((o) => (
                  <SimOpt key={o.id} on={pages === o.id} onClick={() => setPages(o.id)}>
                    {o.label}
                  </SimOpt>
                ))}
              </SimStep>
              <SimStep label="Options (cumulables)" num="03">
                {SIM_DATA.features.map((o) => (
                  <SimOpt
                    key={o.id}
                    on={features.includes(o.id)}
                    multi
                    onClick={() => toggleFeature(o.id)}
                  >
                    {features.includes(o.id) && (
                      <Check size={12} style={{ marginRight: 6, translate: "0 1px" }} />
                    )}
                    {o.label}
                  </SimOpt>
                ))}
              </SimStep>
              <SimStep label="Délai souhaité" num="04">
                {SIM_DATA.delay.map((o) => (
                  <SimOpt key={o.id} on={delay === o.id} onClick={() => setDelay(o.id)}>
                    {o.label}
                  </SimOpt>
                ))}
              </SimStep>
            </div>

            <div className="sim-right">
              <div
                className="mono uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: "color-mix(in oklab, var(--color-paper) 65%, transparent)",
                  marginBottom: 16,
                }}
              >
                — Estimation indicative
              </div>
              <h3
                className="serif"
                style={{
                  fontSize: 92,
                  lineHeight: 0.9,
                  letterSpacing: "-0.035em",
                  margin: 0,
                  color: "var(--color-paper)",
                }}
              >
                {fmt(est.total)}
                <em className="serif-i" style={{ color: "#FFD84D" }}>€</em>
              </h3>
              <div
                className="mono mt-4"
                style={{
                  fontSize: 13,
                  color: "color-mix(in oklab, var(--color-paper) 65%, transparent)",
                }}
              >
                Fourchette : {fmt(est.low)}€ → {fmt(est.high)}€ HTVA
              </div>

              <div
                className="mt-8 pt-5 border-t"
                style={{ borderColor: "color-mix(in oklab, var(--color-paper) 18%, transparent)" }}
              >
                <SumRow k="Type" v={SIM_DATA.type.find((x) => x.id === type)!.label} />
                <SumRow k="Volume" v={SIM_DATA.pages.find((x) => x.id === pages)!.label} />
                <SumRow
                  k="Options"
                  v={features.length > 0 ? `${features.length} activée${features.length > 1 ? "s" : ""}` : "aucune"}
                />
                <SumRow k="Délai" v={SIM_DATA.delay.find((x) => x.id === delay)!.label} />
              </div>

              <div className="mt-8 flex gap-2.5 flex-wrap">
                <a
                  href="#contact"
                  className="btn"
                  style={{ background: "var(--color-paper)", color: "var(--color-accent-ink)" }}
                >
                  Recevoir un devis précis
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div
                className="mono mt-5"
                style={{
                  fontSize: 11,
                  color: "color-mix(in oklab, var(--color-paper) 60%, transparent)",
                  letterSpacing: "0.1em",
                }}
              >
                ↳ Devis définitif gratuit · sans engagement · sous 48h
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sim-wrap {
          background: color-mix(in oklab, var(--color-paper) 95%, transparent);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--color-line);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 30px 70px -30px rgba(31,63,191,.25), 0 10px 30px -15px rgba(15,15,20,.08);
          will-change: opacity, transform;
        }
        .sim-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          min-height: 560px;
        }
        .sim-left {
          padding: 48px;
          border-right: 1px solid var(--color-line);
        }
        .sim-right {
          padding: 48px;
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-ink) 100%);
          color: var(--color-paper);
          position: relative;
          overflow: hidden;
        }
        .sim-right::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }
        .sim-right > * { position: relative; z-index: 1; }
        @media (max-width: 860px) {
          .sim-grid { grid-template-columns: 1fr; }
          .sim-left, .sim-right { padding: 32px 24px; }
          .sim-left { border-right: none; border-bottom: 1px solid var(--color-line); }
        }
      `}</style>
    </section>
  );
}

function SimStep({ label, num, children }: { label: string; num: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div
        className="mono uppercase flex items-center gap-2.5 mb-3"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}
      >
        <span style={{ color: "var(--color-accent)" }}>{num}/</span>
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SimOpt({
  on,
  multi = false,
  children,
  onClick,
}: {
  on: boolean;
  multi?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const onBg = multi ? "var(--color-accent)" : "var(--color-ink)";
  return (
    <button
      type="button"
      onClick={onClick}
      className="sim-opt transition-all duration-300 transform active:scale-95 hover:scale-[1.02]"
      style={{
        padding: "10px 18px",
        background: on ? onBg : "color-mix(in oklab, var(--color-paper) 60%, transparent)",
        border: `1px solid ${on ? onBg : "var(--color-line)"}`,
        borderRadius: 999,
        fontSize: 13,
        fontWeight: on ? 500 : 400,
        color: on ? "var(--color-paper)" : "var(--color-ink-soft)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        boxShadow: on ? "0 8px 16px -4px rgba(31,63,191,0.3)" : "0 2px 4px rgba(15,15,20,0.02)",
      }}
    >
      {children}
    </button>
  );
}

function SumRow({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="mono flex justify-between py-2"
      style={{ fontSize: 13, color: "color-mix(in oklab, var(--color-paper) 65%, transparent)" }}
    >
      <span>{k}</span>
      <span style={{ color: "var(--color-paper)" }}>{v}</span>
    </div>
  );
}
