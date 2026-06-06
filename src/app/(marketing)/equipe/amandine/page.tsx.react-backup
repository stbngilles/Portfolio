"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ease = [0.2, 0.8, 0.2, 1] as const;

const SECTIONS = [
  {
    n: "01",
    t: "Le parcours",
    p: "Actuellement en études de psychologie — ma véritable passion — j'ai aussi forgé mon expérience de terrain en boucherie. Ce contact direct avec la clientèle m'a beaucoup apporté, et c'est ce qui m'a poussée à m'investir comme commerciale indépendante. J'aime comprendre les gens, écouter leurs besoins et les accompagner dans leurs projets.",
  },
  {
    n: "02",
    t: "Mon rôle au quotidien",
    p: "Je suis votre interlocutrice principale. Je gère l'entièreté de la relation, de nos premiers échanges jusqu'au lancement de votre site, en passant par sa maintenance. Ce qui me passionne le plus, c'est cette communication constante avec vous, pour m'assurer que votre vision prenne vie de manière parfaite et transparente.",
  },
];

const FACTS: { lbl: string; val: string }[] = [
  { lbl: "Rôle", val: "Direction de projet" },
  { lbl: "Basée à", val: "Liège, BE" },
  { lbl: "Formation", val: "Psychologie" },
  { lbl: "Réponse", val: "Sous 48h" },
];

export default function AmandinePage() {
  const prefersReduced = useReducedMotion();
  return (
    <main
      className="relative overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="wrap pt-[160px] pb-[120px] max-[720px]:pt-[120px] max-[720px]:pb-[80px]">
        <Link
          href="/#duo"
          className="inline-flex items-center gap-2 mono uppercase mb-14 no-underline transition-colors"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "var(--color-muted)",
          }}
        >
          <ArrowLeft className="w-3 h-3" />
          Retour à l&apos;équipe
        </Link>

        <div className="member-head">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="member-head-meta"
          >
            <div className="overline mb-6">
              <span className="dot" />
              MEMBRE 01 / 02 · L&apos;ÉQUIPE
            </div>
            <h1
              className="serif m-0"
              style={{
                fontSize: "clamp(72px, 12vw, 200px)",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                fontWeight: 400,
              }}
            >
              Amandine
              <em
                className="serif-i"
                style={{ color: "var(--color-accent)" }}
              >
                .
              </em>
            </h1>
            <div
              className="mono uppercase mt-5"
              style={{
                fontSize: 12,
                letterSpacing: "0.14em",
                color: "var(--color-muted)",
              }}
            >
              Direction de projet · Relation client
            </div>
          </motion.div>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="member-head-img relative aspect-[4/5] overflow-hidden rounded"
            style={{
              background: "var(--color-line-soft)",
              filter: "grayscale(15%) contrast(1.02)",
            }}
          >
            <Image
              src="/amandine.jpg"
              alt="Portrait d'Amandine"
              fill
              priority
              sizes="(max-width: 860px) 100vw, 38vw"
              className="object-cover"
            />
            <span
              className="absolute top-4 left-4 mono"
              style={{
                fontSize: 10,
                color: "var(--color-paper)",
                letterSpacing: "0.14em",
                mixBlendMode: "difference",
                textTransform: "uppercase",
              }}
            >
              01 / 02
            </span>
            <span
              className="absolute bottom-4 left-4 mono uppercase"
              style={{
                background: "var(--color-paper)",
                color: "var(--color-ink)",
                padding: "6px 10px",
                fontSize: 10,
                letterSpacing: "0.12em",
              }}
            >
              Direction de projet
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="facts-grid"
        >
          {FACTS.map((f, i) => (
            <div key={i} className="fact-item">
              <div
                className="mono uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: "var(--color-subtle)",
                }}
              >
                {f.lbl}
              </div>
              <div
                className="serif mt-1"
                style={{ fontSize: 22, letterSpacing: "-0.01em" }}
              >
                {f.val}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="member-body">
          {SECTIONS.map((s, i) => (
            <motion.section
              key={i}
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.05 * i }}
              className="member-section"
            >
              <div className="member-section-num">
                <span
                  className="mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    color: "var(--color-accent)",
                  }}
                >
                  {s.n} /
                </span>
              </div>
              <div className="member-section-body">
                <h2
                  className="serif m-0"
                  style={{
                    fontSize: "clamp(28px, 3.4vw, 44px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.025em",
                    marginBottom: 18,
                    fontWeight: 400,
                  }}
                >
                  {s.t}
                </h2>
                <p
                  className="text-[16px] leading-[1.65]"
                  style={{ color: "var(--color-ink-soft)", maxWidth: 680 }}
                >
                  {s.p}
                </p>
              </div>
            </motion.section>
          ))}
        </div>

        <motion.section
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="quote-block"
        >
          <span
            aria-hidden
            className="serif quote-mark"
            style={{
              color: "var(--color-accent-soft)",
            }}
          >
            &ldquo;
          </span>
          <div className="overline mb-6 relative z-10">
            <span
              className="inline-block"
              style={{
                width: 18,
                height: 1,
                background: "var(--color-accent)",
                marginRight: 12,
              }}
            />
            MA PHILOSOPHIE
          </div>
          <blockquote
            className="serif relative z-10 m-0"
            style={{
              fontSize: "clamp(28px, 4.6vw, 56px)",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              color: "var(--color-ink)",
            }}
          >
            «&nbsp;Rien n&apos;est impossible tant que vous n&apos;avez{" "}
            <em className="serif-i" style={{ color: "var(--color-accent)" }}>
              rien essayé
            </em>
            . Lancez-vous, osez faire des choses.&nbsp;»
          </blockquote>
          <div
            className="mono uppercase mt-8 relative z-10"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "var(--color-muted)",
            }}
          >
            ↳ Amandine, dans la vie
          </div>
        </motion.section>

        <div className="member-footer">
          <Link href="/equipe/esteban" className="member-next">
            <div
              className="mono uppercase mb-2"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "var(--color-subtle)",
              }}
            >
              Suivant · 02 / 02
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className="serif"
                style={{
                  fontSize: "clamp(36px, 5vw, 56px)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                Esteban
              </span>
              <ArrowRight className="w-5 h-5 member-next-arrow" />
            </div>
            <div
              className="mono uppercase mt-2"
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                color: "var(--color-muted)",
              }}
            >
              Design & développement
            </div>
          </Link>

          <Link href="/#contact" className="btn btn-primary member-cta">
            Discuter avec Amandine
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <style>{`
        .member-head {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 64px;
          align-items: end;
          padding-bottom: 72px;
          border-bottom: 1px solid var(--color-line);
        }
        .member-head-img { max-width: 480px; width: 100%; justify-self: end; }

        .facts-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          padding: 32px 0;
          border-bottom: 1px solid var(--color-line);
        }
        .fact-item {
          padding: 8px 28px 8px 0;
          border-right: 1px solid var(--color-line);
        }
        .fact-item:last-child { border-right: none; }

        .member-body { padding: 24px 0; }
        .member-section {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 32px;
          padding: 56px 0;
          border-bottom: 1px solid var(--color-line);
        }
        .member-section-num { padding-top: 8px; }

        .quote-block {
          position: relative;
          padding: 100px 56px 80px;
          margin: 80px 0 64px;
          background: var(--color-paper);
          border: 1px solid var(--color-line);
          border-radius: 4px;
          overflow: hidden;
        }
        .quote-mark {
          position: absolute;
          top: -40px;
          left: 24px;
          font-size: 320px;
          line-height: 1;
          pointer-events: none;
          z-index: 0;
        }

        .member-footer {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          align-items: end;
          padding-top: 48px;
          border-top: 1px solid var(--color-line);
        }
        .member-next { text-decoration: none; color: var(--color-ink); }
        .member-next-arrow { transition: transform 240ms; color: var(--color-accent); }
        .member-next:hover .member-next-arrow { transform: translateX(6px); }
        .member-cta { align-self: end; }

        @media (max-width: 860px) {
          .member-head {
            grid-template-columns: 1fr;
            gap: 36px;
            padding-bottom: 48px;
          }
          .member-head-img { max-width: 100%; justify-self: stretch; }

          .facts-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 20px 0;
          }
          .fact-item {
            padding: 14px 16px 14px 0;
            border-right: 1px solid var(--color-line);
            border-bottom: 1px solid var(--color-line);
          }
          .fact-item:nth-child(2n) { border-right: none; }
          .fact-item:nth-last-child(-n+2) { border-bottom: none; }

          .member-section {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 40px 0;
          }
          .quote-block { padding: 60px 28px 50px; margin: 56px 0 48px; }
          .quote-mark { font-size: 200px; top: -20px; }

          .member-footer {
            grid-template-columns: 1fr;
            gap: 24px;
            align-items: stretch;
          }
          .member-cta { align-self: stretch; justify-content: center; }
        }
      `}</style>
    </main>
  );
}
