"use client";

import React from "react";

const items = [
  "Sites livrés en < 4 semaines",
  "Développement sur-mesure",
  "SEO technique inclus",
  "Hébergement & maintenance",
  "Accompagnement humain",
  "Basés à Liège, BE",
  "< 2s de chargement",
  "100% sur-mesure",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div
      className="overflow-hidden py-[22px]"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-paper)",
        borderTop: "1px solid var(--color-ink)",
        borderBottom: "1px solid var(--color-ink)",
      }}
    >
      <div className="flex items-center gap-16 whitespace-nowrap marquee-track">
        {row.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3.5 serif-i"
            style={{
              fontSize: 26,
              color: "var(--color-paper)",
              letterSpacing: "-0.01em",
            }}
          >
            {t}
            <span
              className="not-italic font-sans"
              style={{ color: "var(--color-accent)" }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
