"use client";

import React from "react";
import { motion } from "framer-motion";
import { Paintbrush, Code, Zap, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

const features = [
  {
    title: "Design UX/UI",
    description: "Une interface pensée pour l'utilisateur, fluide et intuitive, qui guide naturellement vers la conversion.",
    icon: Paintbrush,
  },
  {
    title: "Performance maximale",
    description: "Développement Next.js pour des temps de chargement instantanés et un score Google Lighthouse optimal.",
    icon: Zap,
  },
  {
    title: "Code sur mesure",
    description: "Pas de templates limitants. Un site unique, codé de A à Z pour répondre à vos objectifs spécifiques.",
    icon: Code,
  },
  {
    title: "Optimisé conversion",
    description: "Chaque élément visuel est placé stratégiquement pour transformer vos visiteurs en clients fidèles.",
    icon: BarChart3,
  },
];

const processSteps = [
  { n: "01", title: "Stratégie", desc: "Analyse de votre marché, de votre cible et définition des objectifs de conversion." },
  { n: "02", title: "Maquettage", desc: "Création d'une structure visuelle interactive pour valider l'expérience utilisateur." },
  { n: "03", title: "Développement", desc: "Codage haute performance avec les technologies les plus modernes (React/Next.js)." },
  { n: "04", title: "Lancement", desc: "Tests rigoureux, optimisation SEO finale et mise en ligne sécurisée." },
];

export default function WebDesignPage() {
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
            EXPERTISE · WEB DESIGN
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
            Des sites qui{" "}
            <em className="serif-i" style={{ color: "var(--color-accent)" }}>
              ne font pas que briller.
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontSize: "clamp(16px, 1.5vw, 18px)",
              lineHeight: 1.6,
              color: "var(--color-muted)",
              maxWidth: 540,
              marginBottom: 36,
            }}
          >
            On crée des expériences digitales qui racontent votre histoire et rassurent vos clients,
            en alliant esthétique premium et performance technique brute.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/#contact" className="btn btn-primary">
              Discuter de mon projet
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/#devis" className="btn btn-ghost">
              Estimer mon budget
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="inline-block" style={{ width: 18, height: 1, background: "var(--color-accent)" }} />
              CE QUE L&apos;ON PROPOSE
            </div>
            <h2 className="serif">
              Un site pensé
              <br />
              <em className="serif-i">pour performer.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card"
                style={{ padding: 32 }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "var(--color-accent-soft)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <f.icon size={20} style={{ color: "var(--color-accent)" }} />
                </div>
                <h3 className="serif" style={{ fontSize: 20, letterSpacing: "-0.01em", marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-muted)" }}>{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="inline-block" style={{ width: 18, height: 1, background: "var(--color-accent)" }} />
              MÉTHODOLOGIE
            </div>
            <h2 className="serif">
              Mon processus
              <br />
              <em className="serif-i">de création.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {processSteps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="mono" style={{ fontSize: 11, color: "var(--color-accent)", letterSpacing: "0.14em", marginBottom: 16 }}>
                  {s.n}
                </div>
                <h4 className="serif" style={{ fontSize: 24, letterSpacing: "-0.015em", marginBottom: 10 }}>
                  {s.title}
                  <em className="serif-i" style={{ color: "var(--color-accent)" }}>.</em>
                </h4>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-muted)" }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Refonte focus */}
      <section className="section section-alt">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: "var(--color-accent-soft)",
              borderRadius: 16,
              padding: "clamp(40px, 5vw, 80px)",
              textAlign: "center",
              border: "1px solid var(--color-accent)",
            }}
          >
            <div className="overline mb-6" style={{ justifyContent: "center", display: "inline-flex" }}>
              <span className="dot" />
              REFONTE
            </div>
            <h2
              className="serif"
              style={{
                fontSize: "clamp(28px, 4vw, 52px)",
                letterSpacing: "-0.022em",
                lineHeight: 1.08,
                maxWidth: "18ch",
                margin: "0 auto 20px",
              }}
            >
              Votre site actuel ne vous{" "}
              <em className="serif-i" style={{ color: "var(--color-accent)" }}>
                ressemble plus ?
              </em>
            </h2>
            <p style={{ fontSize: 16, color: "var(--color-muted)", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.6 }}>
              Une refonte n'est pas qu'un changement de look. C'est l'opportunité de repartir sur des bases
              techniques saines et d'améliorer vos taux de conversion.
            </p>
            <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 32px", maxWidth: 420, margin: "0 auto 36px", textAlign: "left" }}>
              {["Vitesse de chargement ×5", "Optimisation mobile native", "Structure SEO propre", "Gestion simplifiée"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--color-ink)" }}>
                  <CheckCircle2 size={15} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/#contact" className="btn btn-primary">
              Lancer ma refonte
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <ContactForm />
    </main>
  );
}
