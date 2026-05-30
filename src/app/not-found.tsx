"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ease = [0.2, 0.8, 0.2, 1] as const;

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/services/web-design", label: "Services" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <main
      className="relative overflow-hidden flex flex-col items-center justify-center text-center"
      style={{
        minHeight: "100vh",
        padding: "120px 24px 80px",
        background: "var(--color-ink)",
        color: "var(--color-paper)",
      }}
    >
      {/* Grid background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,.7), transparent 72%)",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,.7), transparent 72%)",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 18%, transparent) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
        }}
      />

      <div className="relative z-[1] max-w-[860px]">
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="overline mb-10 justify-center"
          style={{
            display: "inline-flex",
            color: "color-mix(in oklab, var(--color-paper) 50%, transparent)",
          }}
        >
          <span className="dot" />
          ERREUR 404 · PAGE INTROUVABLE
        </motion.div>

        {/* 404 */}
        <h1
          className="m-0 select-none"
          style={{
            fontSize: "clamp(100px, 24vw, 300px)",
            lineHeight: 0.82,
            letterSpacing: "-0.04em",
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
          }}
        >
          <motion.span
            className="inline-block"
            style={{ color: "var(--color-paper)" }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease }}
          >
            4
          </motion.span>
          <motion.span
            className="serif-i inline-block"
            style={{
              color: "var(--color-accent)",
              animationName: "float404",
              animationDuration: "3.6s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              display: "inline-block",
            }}
            initial={{ y: 100, opacity: 0, rotate: -12 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
          >
            0
          </motion.span>
          <motion.span
            className="inline-block"
            style={{ color: "var(--color-paper)" }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease, delay: 0.22 }}
          >
            4
          </motion.span>
        </h1>

        {/* Copy */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.55 }}
          className="serif mt-8 mx-auto"
          style={{
            fontSize: "clamp(22px, 2.6vw, 34px)",
            letterSpacing: "-0.015em",
            lineHeight: 1.25,
            maxWidth: 560,
            color: "color-mix(in oklab, var(--color-paper) 85%, transparent)",
          }}
        >
          Cette page n&apos;existe pas.
          <br />
          <em
            className="serif-i"
            style={{ color: "var(--color-accent)" }}
          >
            Votre site,
          </em>{" "}
          lui, pourrait.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
          className="mt-10 flex gap-3 flex-wrap justify-center"
        >
          <Link
            href="/"
            className="btn"
            style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/#contact"
            className="btn"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-paper)",
            }}
          >
            Nous contacter
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Quick nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mt-16 pt-8"
          style={{
            borderTop: "1px solid color-mix(in oklab, var(--color-paper) 12%, transparent)",
          }}
        >
          <div
            className="mono uppercase mb-5"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "color-mix(in oklab, var(--color-paper) 40%, transparent)",
            }}
          >
            Où aller ?
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="mono uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: "color-mix(in oklab, var(--color-paper) 65%, transparent)",
                  textDecoration: "none",
                  transition: "color 160ms",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-paper)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "color-mix(in oklab, var(--color-paper) 65%, transparent)")
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes float404 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          40%       { transform: translateY(-14px) rotate(-4deg); }
          70%       { transform: translateY(-6px) rotate(-1.5deg); }
        }
        @media (max-width: 540px) {
          .flex.gap-3.flex-wrap.justify-center {
            flex-direction: column;
            align-items: center;
          }
          .flex.gap-3.flex-wrap.justify-center .btn {
            width: 100%;
            max-width: 320px;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
