"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "MotoDistri",
    category: "E-commerce moto · Berloz, BE",
    description: "E-commerce moto avec campagnes Meta Ads intégrées. ~5 000 visites/jour avec 15 €/jour de budget pub — ROI documenté et reproductible.",
    image: "/projects/motodistri.jpg",
    link: "https://motodistri.com",
    chips: ["~5K visites / jour", "15€ / jour de pubs", "ROI éprouvé"],
  },
  {
    title: "Zen Harmonie",
    category: "Massothérapie · Hélécine",
    description: "Site vitrine premium pour thérapeute. Design apaisant, réservation en ligne, SEO local — ★ 5.0 sur Google dès le lancement.",
    image: "/projects/zen_harmonie.jpg",
    link: "https://zenharmoniehélécine.be",
    chips: ["★ 5.0 Google", "Réservation en ligne", "SEO local"],
  },
  {
    title: "Detail Wave",
    category: "Detailing automobile",
    description: "Vitrine premium pour expert en esthétique automobile. Un design sombre et percutant qui souligne chaque détail et génère des leads qualifiés.",
    image: "/projects/detail_wave.jpg",
    link: "https://detailwave.be",
    chips: ["★ 5.0 Google", "Vitrine premium", "Lead generation"],
  },
];

export default function RealisationsPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Hero */}
      <section className="section" style={{ paddingTop: 160 }}>
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overline mb-6"
          >
            <span className="dot" />
            NOS RÉALISATIONS · EN LIGNE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="serif"
            style={{
              fontSize: "clamp(44px, 7vw, 96px)",
              lineHeight: 1.02,
              letterSpacing: "-0.032em",
              fontWeight: 400,
              maxWidth: "18ch",
              margin: "0 0 28px",
            }}
          >
            Projets qui font{" "}
            <em className="serif-i" style={{ color: "var(--color-accent)" }}>
              la différence.
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(16px, 1.5vw, 18px)",
              lineHeight: 1.6,
              color: "var(--color-muted)",
              maxWidth: 540,
            }}
          >
            Pas des maquettes. Pas des templates. Des sites livrés, en ligne, avec des vrais clients derrière.
          </motion.p>
        </div>
      </section>

      {/* Project list */}
      <section className="section section-alt">
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 80 }}>
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "1.2fr 1fr" : "1fr 1.2fr",
                gap: "clamp(32px, 5vw, 72px)",
                alignItems: "center",
              }}
              className="rl-row"
            >
              {/* image — always first in DOM, direction via CSS order */}
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rl-img-wrap group"
                style={{ order: i % 2 === 0 ? 0 : 1 }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/10",
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid var(--color-line)",
                  }}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 860px) 100vw, 55vw"
                    style={{ objectFit: "cover", objectPosition: "top center", transition: "transform 600ms cubic-bezier(.2,.8,.2,1)" }}
                    className="rl-img"
                  />
                  <div
                    className="rl-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(15,15,20,.45)",
                      opacity: 0,
                      transition: "opacity 300ms",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "var(--color-paper)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ExternalLink size={20} style={{ color: "var(--color-ink)" }} />
                    </div>
                  </div>
                </div>
              </a>

              {/* text */}
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <div className="overline mb-4">{p.category}</div>
                <h2 className="serif" style={{ fontSize: "clamp(28px, 3.5vw, 52px)", letterSpacing: "-0.022em", lineHeight: 1.05, marginBottom: 16 }}>
                  {p.title}
                  <em className="serif-i" style={{ color: "var(--color-accent)" }}>.</em>
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--color-muted)", marginBottom: 24 }}>
                  {p.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                  {p.chips.map((c, j) => (
                    <span
                      key={j}
                      className="mono uppercase"
                      style={{
                        padding: "5px 11px",
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        border: "1px solid var(--color-line)",
                        borderRadius: 999,
                        color: "var(--color-muted)",
                        background: "var(--color-paper)",
                        lineHeight: 1.2,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  style={{ display: "inline-flex" }}
                >
                  Visiter le site
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="wrap" style={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: "var(--color-ink)",
              color: "var(--color-paper)",
              borderRadius: 16,
              padding: "clamp(48px, 6vw, 96px)",
            }}
          >
            <div className="overline mb-6" style={{ justifyContent: "center", display: "inline-flex", color: "var(--color-subtle)" }}>
              <span className="dot" />
              VOTRE PROJET
            </div>
            <h2
              className="display"
              style={{
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: 1.05,
                letterSpacing: "-0.024em",
                marginBottom: 20,
                color: "var(--color-paper)",
              }}
            >
              Votre entreprise mérite
              <br />
              <span style={{ color: "color-mix(in oklab, var(--color-paper) 45%, transparent)" }}>
                un site d'exception.
              </span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "color-mix(in oklab, var(--color-paper) 65%, transparent)", maxWidth: 480, margin: "0 auto 36px" }}>
              30 minutes d'appel suffisent pour savoir si on peut vous aider — et combien ça coûterait.
            </p>
            <Link href="/#contact" className="btn" style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}>
              Parlons de votre projet
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .rl-row { grid-template-columns: 1fr !important; }
          .rl-img-wrap { order: 0 !important; }
          .rl-row > div:last-child { order: 1 !important; }
        }
        .group:hover .rl-img { transform: scale(1.03); }
        .group:hover .rl-overlay { opacity: 1 !important; }
      `}</style>
    </main>
  );
}
