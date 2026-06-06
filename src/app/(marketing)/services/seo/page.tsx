"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, BarChart3, Globe, CheckCircle2, TrendingUp } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import LineChart from "@/components/LineChart";
import Link from "next/link";

const seoServices = [
  {
    title: "Référencement local",
    description: "Dominez les résultats de recherche dans votre région. Idéal pour attirer les clients locaux.",
    icon: MapPin,
  },
  {
    title: "Audit technique",
    description: "Analyse profonde de la structure de votre site pour éliminer tout frein à l'indexation Google.",
    icon: Search,
  },
  {
    title: "Stratégie de contenu",
    description: "Rédaction et optimisation de contenus pertinents qui répondent aux intentions de recherche de vos clients.",
    icon: TrendingUp,
  },
  {
    title: "Référencement international",
    description: "Étendez votre portée au-delà des frontières avec une structure multilingue et optimisée.",
    icon: Globe,
  },
];

export default function SEOPage() {
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
            VISIBILITÉ · SEO
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
            Soyez là où vos{" "}
            <em className="serif-i" style={{ color: "var(--color-accent)" }}>
              clients vous cherchent.
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
            On optimise votre présence sur les moteurs de recherche pour que votre entreprise
            soit bien positionnée dans les résultats locaux — sans attendre des mois.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/#contact" className="btn btn-primary">
              Demander un audit gratuit
            </Link>
            <Link href="#services" className="btn btn-ghost">
              Voir les services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Results with chart */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="inline-block" style={{ width: 18, height: 1, background: "var(--color-accent)" }} />
              RÉSULTATS
            </div>
            <h2 className="serif">
              Des résultats
              <br />
              <em className="serif-i">basés sur la donnée.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p style={{ fontSize: 16, color: "var(--color-muted)", lineHeight: 1.6, marginBottom: 28 }}>
                Le SEO n'est pas une science occulte. C'est un mélange de structure technique propre,
                de contenu de qualité et d'analyse de données.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Augmentation du trafic organique (+150% en moyenne)",
                  "Amélioration des positions sur les mots-clés stratégiques",
                  "Réduction du coût d'acquisition client",
                  "Visibilité accrue sur Google Maps",
                ].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle2 size={15} style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: "var(--color-ink)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <LineChart />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section id="services" className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="inline-block" style={{ width: 18, height: 1, background: "var(--color-accent)" }} />
              SERVICES
            </div>
            <h2 className="serif">
              Une approche complète
              <br />
              <em className="serif-i">de la visibilité.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {seoServices.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card"
                style={{ padding: 32, display: "flex", gap: 20, alignItems: "flex-start" }}
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
                    flexShrink: 0,
                  }}
                >
                  <s.icon size={20} style={{ color: "var(--color-accent)" }} />
                </div>
                <div>
                  <h3 className="serif" style={{ fontSize: 20, letterSpacing: "-0.01em", marginBottom: 8 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-muted)" }}>{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactForm />
    </main>
  );
}
