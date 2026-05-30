"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Member = {
  n: string;
  role: string;
  q: string;
  img: string;
  href: string;
  stats: { n: string; l: string }[];
};

const members: Member[] = [
  {
    n: "Amandine",
    role: "Direction de projet · Relation client",
    q: "J'écoute, je traduis vos enjeux, je m'assure que le livré colle exactement à ce que vous vendez.",
    img: "/amandine.jpg",
    href: "/equipe/amandine",
    stats: [
      { n: "J+2", l: "réponse garantie" },
      { n: "A–Z", l: "suivi projet" },
    ],
  },
  {
    n: "Esteban",
    role: "Design & développement",
    q: "Un site, c'est du code propre, des images qui pèsent rien, du texte qui vend. Tout le reste, c'est du vent.",
    img: "/esteban.jpg",
    href: "/equipe/esteban",
    stats: [
      { n: "Next.js", l: "stack moderne" },
      { n: "SEO", l: "intégré nativement" },
    ],
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const memberRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

      // Each member card
      memberRefs.current.forEach((member, i) => {
        if (!member) return;

        const img = member.querySelector(".duo-img");
        const textEls = member.querySelectorAll("h3, .mono.uppercase, p.serif-i, .flex.gap-6");

        // Member entrance
        gsap.fromTo(
          member,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: i * 0.12,
            scrollTrigger: {
              trigger: member,
              start: "top 85%",
              once: true,
            },
          }
        );

        // Image scale scrub: 0.88 → 1.0
        if (img) {
          gsap.fromTo(
            img,
            { scale: 0.88 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: member,
                start: "top 90%",
                end: "center 20%",
                scrub: 1.4,
              },
            }
          );
        }

        // Text elements stagger below image
        if (textEls.length) {
          gsap.fromTo(
            textEls,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.07,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: member,
                start: "top 75%",
                once: true,
              },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section section-alt" id="duo">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">
            <span
              className="inline-block"
              style={{ width: 18, height: 1, background: "var(--color-accent)" }}
            />
            L&apos;ÉQUIPE · DEUX PERSONNES, ZÉRO INTERMÉDIAIRE
          </div>
          <h2 className="serif">
            Vous parlez aux
            <br />
            gens qui <em className="serif-i">font</em>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {members.map((m, i) => (
            <Link
              href={m.href}
              key={i}
              ref={(el) => { memberRefs.current[i] = el; }}
              className="group block no-underline"
            >
              <div
                className="duo-img relative aspect-[4/5] mb-6 rounded overflow-hidden transition-[filter] duration-500"
                style={{
                  background: "var(--color-line-soft)",
                  filter: "grayscale(20%) contrast(1.02)",
                }}
              >
                <span
                  className="absolute top-4 left-4 mono"
                  style={{
                    fontSize: 11,
                    color: "var(--color-paper)",
                    letterSpacing: "0.12em",
                    mixBlendMode: "difference",
                  }}
                >
                  0{i + 1} / 02
                </span>
                <span
                  className="absolute bottom-4 left-4 mono uppercase"
                  style={{
                    background: "var(--color-paper)",
                    color: "var(--color-ink)",
                    padding: "6px 10px",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                  }}
                >
                  {m.role.split("·")[0].trim()}
                </span>
                <Image
                  src={m.img}
                  alt={m.n}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <h3
                className="serif m-0 mb-1"
                style={{ fontSize: 48, lineHeight: 1, letterSpacing: "-0.025em" }}
              >
                {m.n}
                <em className="serif-i" style={{ color: "var(--color-accent)" }}>.</em>
              </h3>
              <div
                className="mono uppercase mb-4"
                style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--color-muted)" }}
              >
                {m.role}
              </div>
              <p
                className="serif-i mb-5"
                style={{ fontSize: 22, lineHeight: 1.35, color: "var(--color-ink-soft)", letterSpacing: "-0.01em" }}
              >
                « {m.q} »
              </p>
              <div
                className="flex gap-6 pt-4 border-t"
                style={{ borderColor: "var(--color-line)" }}
              >
                {m.stats.map((s, j) => (
                  <div key={j}>
                    <div className="serif" style={{ fontSize: 28 }}>{s.n}</div>
                    <div
                      className="mono uppercase"
                      style={{ fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.1em" }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .group:hover .duo-img { filter: grayscale(0) contrast(1) !important; }
      `}</style>
    </section>
  );
}
