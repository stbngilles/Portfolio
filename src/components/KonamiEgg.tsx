"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function KonamiEgg() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (
        tgt &&
        (tgt.tagName === "INPUT" ||
          tgt.tagName === "TEXTAREA" ||
          tgt.isContentEditable)
      ) {
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buf = [...buf, key].slice(-SEQUENCE.length);
      if (
        buf.length === SEQUENCE.length &&
        buf.every((k, i) => k === SEQUENCE[i])
      ) {
        setUnlocked(true);
        buf = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {unlocked && (
        <motion.div
          key="egg"
          className="fixed inset-0 z-[300] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "color-mix(in oklab, var(--color-ink) 70%, transparent)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setUnlocked(false)}
          />

          <Sparks />

          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative max-w-[560px] w-full p-10 text-center"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 8,
              boxShadow: "0 30px 80px -20px rgba(15,15,20,.5)",
            }}
          >
            <div
              className="mono uppercase mb-6"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "var(--color-accent)",
              }}
            >
              ◆ Code secret activé ◆
            </div>
            <h3
              className="serif"
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                margin: "0 0 18px",
              }}
            >
              Bien vu.
              <br />
              <em
                className="serif-i"
                style={{ color: "var(--color-accent)" }}
              >
                Tu cherches le détail.
              </em>
            </h3>
            <p
              className="text-[15px] leading-relaxed mb-8"
              style={{ color: "var(--color-muted)" }}
            >
              Le détail, c&apos;est ce qui sépare un site qui plaît
              d&apos;un site qui convertit. Si tu en es là, on devrait
              probablement se parler.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="#devis"
                className="btn btn-primary"
                onClick={() => setUnlocked(false)}
              >
                Estimer mon projet
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                className="btn btn-ghost"
                onClick={() => setUnlocked(false)}
              >
                Plus tard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Sparks() {
  const sparks = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparks.map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i % 6) * 0.12;
        return (
          <motion.span
            key={i}
            className="serif-i absolute"
            style={{
              left: `${left}%`,
              top: "100%",
              color: "var(--color-accent)",
              fontSize: 22 + ((i * 7) % 14),
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -700 - (i % 5) * 60, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.4 + (i % 4) * 0.3,
              delay,
              ease: "easeOut",
            }}
          >
            ✦
          </motion.span>
        );
      })}
    </div>
  );
}
