"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Réalisations", href: "/#work" },
  { name: "Méthode", href: "/#process" },
  { name: "L'équipe", href: "/#duo" },
  { name: "Devis", href: "/#devis" },
  { name: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "top-4 mx-auto max-w-[90%] md:max-w-[1000px] rounded-full border border-[var(--color-line)] py-3 px-2 shadow-[0_12px_40px_-12px_rgba(31,63,191,0.15)]"
          : "top-0 py-[18px] border-b border-transparent"
      }`}
      style={{
        background: scrolled
          ? "color-mix(in oklab, var(--color-bg) 75%, rgba(250, 249, 245, 0.8))"
          : "color-mix(in oklab, var(--color-bg) 85%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className={`w-full flex items-center justify-between gap-6 transition-all duration-300 ${scrolled ? "px-6" : "wrap"}`}>
        <Link
          href="/"
          className="flex items-baseline gap-[2px] text-[20px] tracking-tight text-[var(--color-ink)] no-underline group/logo"
          style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          <span
            className="inline-block w-[10px] h-[10px] mr-[10px] rounded-[2px] transition-transform duration-500 group-hover/logo:rotate-45"
            style={{ background: "var(--color-accent)", translate: "0 -2px" }}
          />
          Pixelbrute
        </Link>
 
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-[13px] font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition-colors tracking-tight group/link"
            >
              {link.name}
              <span className="absolute bottom-[-4px] left-0 w-full h-[1.5px] bg-[var(--color-accent)] scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left duration-200" />
            </Link>
          ))}
        </div>
 
        <Link
          href="/#devis"
          className="hidden lg:inline-flex btn btn-accent"
          style={{ padding: "10px 18px" }}
        >
          Prendre contact
        </Link>
 
        <button
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="lg:hidden p-2 text-[var(--color-ink)]"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 overflow-hidden"
            style={{
              background: "var(--color-bg)",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            <div className="wrap py-6 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="py-2 text-base font-medium text-[var(--color-ink-soft)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/#devis"
                className="btn btn-accent justify-center mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Prendre contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
