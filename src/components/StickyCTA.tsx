"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const h = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShow(y > 600 && y < max - 600);
    };
    window.addEventListener("scroll", h);
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div
      className="fixed bottom-5 left-1/2 flex items-center gap-3 z-40"
      style={{
        transform: `translateX(-50%) translateY(${show ? "0" : "120%"})`,
        transition: "transform 400ms cubic-bezier(.2,.8,.2,1)",
        background: "var(--color-ink)",
        color: "var(--color-paper)",
        padding: "10px 10px 10px 20px",
        borderRadius: 999,
        boxShadow: "0 20px 60px -20px rgba(20,18,16,.4)",
        fontSize: 13,
        maxWidth: "calc(100vw - 40px)",
      }}
    >
      <span
        className="rounded-full"
        style={{ width: 8, height: 8, background: "#10b981" }}
      />
      <span className="sticky-lbl">Un projet en tête ?</span>
      <Link
        href="#devis"
        className="no-underline font-medium"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-paper)",
          padding: "10px 16px",
          borderRadius: 999,
          fontSize: 13,
        }}
      >
        Estimer mon projet
      </Link>

      <style>{`
        @media (max-width: 560px) {
          .sticky-lbl { display: none; }
        }
      `}</style>
    </div>
  );
}
