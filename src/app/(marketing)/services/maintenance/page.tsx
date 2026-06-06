"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Server, Zap, RefreshCw, CheckCircle2, LifeBuoy } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

const features = [
  {
    title: "Hébergement haute performance",
    description: "Serveurs optimisés pour Next.js avec CDN global pour une vitesse instantanée partout dans le monde.",
    icon: Server,
  },
  {
    title: "Sécurité & SSL",
    description: "Protection contre les attaques DDoS, pare-feu applicatif et certificats SSL inclus pour rassurer vos clients.",
    icon: ShieldCheck,
  },
  {
    title: "Mises à jour continues",
    description: "On veille à ce que votre site utilise toujours les dernières versions des langages et librairies.",
    icon: RefreshCw,
  },
  {
    title: "Support réactif",
    description: "Une question ou un changement urgent ? On intervient rapidement sur votre infrastructure.",
    icon: LifeBuoy,
  },
];

export default function MaintenancePage() {
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
            MAINTENANCE · SÉRÉNITÉ
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
            Dormez sur vos{" "}
            <em className="serif-i" style={{ color: "var(--color-accent)" }}>
              deux oreilles.
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
            Votre site web est un actif précieux. On s'assure qu'il reste rapide, sécurisé et opérationnel
            24h/24, pendant que vous vous concentrez sur votre cœur de métier.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/#contact" className="btn btn-primary">
              Discuter de la maintenance
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-alt">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
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

      {/* Why outsource */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="inline-block" style={{ width: 18, height: 1, background: "var(--color-accent)" }} />
              POURQUOI EXTERNALISER
            </div>
            <h2 className="serif">
              Libérez-vous
              <br />
              <em className="serif-i">du technique.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card"
              style={{ padding: 32 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, background: "var(--color-accent-soft)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Zap size={18} style={{ color: "var(--color-accent)" }} />
                </div>
                <h4 className="serif" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>Performance constante</h4>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-muted)" }}>
                Sans entretien, un site peut s'alourdir de requêtes inutiles ou de librairies obsolètes. On garde votre code propre et léger.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card"
              style={{ padding: 32 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, background: "var(--color-accent-soft)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldCheck size={18} style={{ color: "var(--color-accent)" }} />
                </div>
                <h4 className="serif" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>Zéro stress technique</h4>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-muted)" }}>
                En cas de bug ou de tentative d'intrusion, on est notifié en temps réel et on intervient avant même que vous ne le remarquiez.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Migration CTA */}
      <section className="section section-alt">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: "var(--color-accent-soft)",
              borderRadius: 16,
              padding: "clamp(40px, 5vw, 72px)",
              textAlign: "center",
              border: "1px solid var(--color-accent)",
            }}
          >
            <div className="overline mb-6" style={{ justifyContent: "center", display: "inline-flex" }}>
              <span className="dot" />
              TRANSFERT D'HÉBERGEMENT
            </div>
            <h2 className="serif" style={{ fontSize: "clamp(24px, 3.5vw, 44px)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>
              Besoin de migrer votre site{" "}
              <em className="serif-i" style={{ color: "var(--color-accent)" }}>existant ?</em>
            </h2>
            <p style={{ fontSize: 16, color: "var(--color-muted)", maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.6 }}>
              On s'occupe de migrer votre site vers nos serveurs haute performance sans interruption de service.
            </p>
            <ul style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, marginBottom: 32 }}>
              {["Sauvegardes quotidiennes", "Monitoring 24/7", "Certificats SSL", "Emails Pro"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-ink)" }}>
                  <CheckCircle2 size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/#contact" className="btn btn-primary">
              Parler de mon hébergement
            </Link>
          </motion.div>
        </div>
      </section>

      <ContactForm />
    </main>
  );
}
