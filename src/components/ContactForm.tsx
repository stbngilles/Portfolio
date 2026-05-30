"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ContactForm() {
  const [state, handleSubmit] = useForm("xdaawkyd");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const left = sectionRef.current!.querySelector(".cf-left");
      const right = sectionRef.current!.querySelector(".cf-right");

      // Left column: slide from left
      if (left) {
        gsap.fromTo(
          left,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
            },
          }
        );
      }

      // Form card: slide from right
      if (right) {
        gsap.fromTo(
          right,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
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
      id="contact"
      className="section"
      style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
    >
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          <div className="cf-left" style={{ willChange: "opacity, transform" }}>
            <div
              className="overline mb-4"
              style={{ color: "color-mix(in oklab, var(--color-paper) 70%, transparent)" }}
            >
              <span className="dot" />
              CONTACT
            </div>
            <h2
              className="display mb-6"
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                lineHeight: 1.06,
                letterSpacing: "-0.024em",
                color: "var(--color-paper)",
              }}
            >
              Votre prochain site
              <br />
              <span style={{ color: "color-mix(in oklab, var(--color-paper) 42%, transparent)" }}>
                commence ici.
              </span>
            </h2>
            <p
              className="text-lg leading-relaxed mb-10"
              style={{ color: "color-mix(in oklab, var(--color-paper) 65%, transparent)" }}
            >
              Décrivez votre projet en quelques mots. Nous revenons vers vous
              sous 48h avec une première réponse honnête. Aucun engagement.
            </p>

            <div
              className="grid grid-cols-2 gap-6 pt-8 mt-4 border-t"
              style={{ borderColor: "color-mix(in oklab, var(--color-paper) 12%, transparent)" }}
            >
              <div>
                <div
                  className="mono uppercase mb-2"
                  style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
                >
                  Email
                </div>
                <div className="text-sm select-all" style={{ color: "var(--color-paper)" }}>
                  contact@pixelbrute.be
                </div>
              </div>
              <div>
                <div
                  className="mono uppercase mb-2"
                  style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
                >
                  Studio
                </div>
                <div className="text-sm" style={{ color: "var(--color-paper)" }}>
                  Liège, Belgique
                </div>
              </div>
            </div>
          </div>

          <div
            className="cf-right p-8 md:p-10"
            style={{
              background: "var(--color-paper)",
              color: "var(--color-ink)",
              borderRadius: 4,
              boxShadow: "0 24px 60px -30px rgba(31,63,191,.35)",
              willChange: "opacity, transform",
            }}
          >
            {state.succeeded ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "var(--color-accent)" }}
                >
                  <CheckCircle2 className="w-8 h-8" style={{ color: "var(--color-paper)" }} />
                </div>
                <h4 className="serif mb-3" style={{ fontSize: 32, letterSpacing: "-0.02em" }}>
                  Message envoyé.
                </h4>
                <p className="mb-8" style={{ color: "var(--color-muted)" }}>
                  Nous revenons vers vous sous 48h.
                </p>
                <button onClick={() => window.location.reload()} className="btn btn-ghost">
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Nom" id="name">
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      className="cf-input"
                      placeholder="Votre nom"
                    />
                    <ValidationError prefix="Nom" field="name" errors={state.errors} />
                  </Field>
                  <Field label="Email" id="email">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      className="cf-input"
                      placeholder="email@domaine.com"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                  </Field>
                </div>
                <Field label="Téléphone (optionnel)" id="phone">
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className="cf-input"
                    placeholder="+32 XXX XX XX XX"
                  />
                </Field>
                <Field label="Message" id="message">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="cf-input resize-none"
                    placeholder="Décrivez votre projet en quelques mots..."
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} />
                </Field>
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="btn btn-accent w-full justify-center"
                  style={{ padding: "16px" }}
                >
                  {state.submitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Envoyer ma demande
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .cf-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid var(--color-line);
          border-radius: 8px;
          font-size: 14px;
          color: var(--color-ink);
          font-family: var(--font-sans);
          background: transparent;
          transition: border-color 160ms;
        }
        .cf-input::placeholder { color: var(--color-subtle); }
        .cf-input:focus { outline: none; border-color: var(--color-accent); }
      `}</style>
    </section>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mono uppercase block mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
