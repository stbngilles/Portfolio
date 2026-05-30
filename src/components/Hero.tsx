"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const lineEase = [0.2, 0.8, 0.2, 1] as const;

function RevealLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <span className="block">{children}</span>;
  return (
    <span className="block overflow-hidden pb-[0.04em]">
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.95, ease: lineEase, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-[140px] pb-[80px] max-[720px]:pt-[110px] max-[720px]:pb-[48px]"
    >
      <div className="wrap relative z-[1] text-center">
        {/* Pill overline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 mb-8 hero-pill"
          style={{
            padding: "7px 14px 7px 12px",
            border: "1px solid var(--color-line)",
            background:
              "color-mix(in oklab, var(--color-paper) 70%, transparent)",
            borderRadius: 999,
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-accent)",
              display: "inline-block",
            }}
          />
          <span
            className="mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "var(--color-ink-soft)",
            }}
          >
            Studio web · Liège, BE
          </span>
          <span
            aria-hidden
            style={{
              width: 1,
              height: 10,
              background: "var(--color-line)",
            }}
          />
          <span
            className="mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "var(--color-subtle)",
            }}
          >
            EST. 2025
          </span>
        </motion.div>

        <h1
          className="serif text-[var(--color-ink)] m-0 mx-auto"
          style={{
            fontSize: "clamp(44px, 7.5vw, 104px)",
            lineHeight: 1.0,
            letterSpacing: "-0.035em",
            fontWeight: 400,
            maxWidth: "18ch",
          }}
        >
          <RevealLine delay={0.05}>
            Un site qui{" "}
            <em
              className="serif-i"
              style={{ color: "var(--color-accent)" }}
            >
              bosse.
            </em>
          </RevealLine>
          <RevealLine delay={0.22}>
            Des pubs qui{" "}
            <em
              className="serif-i relative inline-block"
              style={{ color: "var(--color-accent)" }}
            >
              ramènent.
              <svg
                aria-hidden
                viewBox="0 0 600 24"
                preserveAspectRatio="none"
                className="absolute left-0 right-0"
                style={{
                  bottom: "-0.08em",
                  width: "100%",
                  height: "0.18em",
                  overflow: "visible",
                }}
              >
                <motion.path
                  d="M3 14 C 90 4, 200 22, 300 12 S 520 4, 597 14"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={
                    prefersReduced ? { pathLength: 1 } : { pathLength: 0 }
                  }
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.2,
                    ease: lineEase,
                    delay: 1.05,
                  }}
                />
              </svg>
            </em>
          </RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
          className="mt-7 mx-auto hero-sub"
          style={{
            fontSize: "clamp(18px, 2vw, 22px)",
            lineHeight: 1.5,
            color: "var(--color-ink)",
            maxWidth: 600,
          }}
        >
          On code votre site. On lance vos pubs Meta. Vous récupérez les{" "}
          <em
            className="serif-i"
            style={{
              color: "var(--color-accent)",
              fontSize: "1.18em",
              letterSpacing: "-0.01em",
            }}
          >
            clients.
          </em>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
          className="mt-9 flex gap-3 flex-wrap justify-center hero-cta-row"
        >
          <Link href="#devis" className="btn btn-primary">
            Estimer mon projet
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="#work" className="btn btn-ghost">
            Voir nos projets
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.05 }}
          className="mt-8 flex items-center justify-center gap-4 flex-wrap hero-proof"
        >
          <div className="flex items-center gap-2">
            <span
              className="serif"
              style={{
                color: "var(--color-accent)",
                fontSize: 14,
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
              aria-hidden
            >
              ★★★★★
            </span>
            <span
              className="mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "var(--color-muted)",
              }}
            >
              5.0 sur Google
            </span>
          </div>
          <span
            aria-hidden
            style={{
              width: 1,
              height: 11,
              background: "var(--color-line)",
            }}
          />
          <span
            className="mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "var(--color-muted)",
            }}
          >
            Sites dès 900 € HTVA
          </span>
          <span
            aria-hidden
            style={{
              width: 1,
              height: 11,
              background: "var(--color-line)",
            }}
          />
          <span
            className="mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "var(--color-muted)",
            }}
          >
            Réponse sous 48h
          </span>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .hero-proof { gap: 10px !important; }
          .hero-pill { padding: 6px 12px 6px 10px !important; gap: 8px !important; }
        }
        @media (max-width: 540px) {
          .hero-cta-row {
            flex-direction: column;
            align-items: stretch;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
            width: 100%;
          }
          .hero-cta-row .btn {
            justify-content: center;
            width: 100%;
          }
          .hero-sub { font-size: 15.5px !important; }
        }
      `}</style>
    </section>
  );
}
