"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-bg)" }}>
      <div className="wrap">
        <div
          className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          style={{ borderTop: "1px solid var(--color-line)" }}
        >
          <div>
            <Link
              href="/"
              className="flex items-baseline gap-[2px] text-[18px] tracking-tight no-underline"
              style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              <span
                className="inline-block w-[10px] h-[10px] mr-[10px] rounded-[2px]"
                style={{ background: "var(--color-accent)", translate: "0 -2px" }}
              />
              Pixelbrute
            </Link>
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              Studio site + acquisition à Liège. On code votre site, on lance
              vos pubs Meta, vous récupérez les clients.
            </p>
          </div>

          <div>
            <h4
              className="mono uppercase mb-4"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "var(--color-subtle)",
              }}
            >
              Ressources
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/#work">Réalisations</FooterLink>
              <FooterLink href="/#faq">FAQ</FooterLink>
              <FooterLink href="/#duo">L&apos;équipe</FooterLink>
              <FooterLink href="/#devis">Devis</FooterLink>
            </ul>
          </div>

          <div>
            <h4
              className="mono uppercase mb-4"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "var(--color-subtle)",
              }}
            >
              Contact
            </h4>
            <ul className="space-y-3">
              <li
                className="text-sm select-all"
                style={{ color: "var(--color-muted)" }}
              >
                contact@pixelbrute.be
              </li>
              <li className="text-sm" style={{ color: "var(--color-muted)" }}>
                Liège, Belgique
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-sm font-medium no-underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  Demander un devis →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="py-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{
            borderTop: "1px solid var(--color-line)",
          }}
        >
          <p
            className="mono uppercase"
            style={{
              fontSize: 11,
              color: "var(--color-muted)",
              letterSpacing: "0.1em",
            }}
          >
            © 2026 · Pixelbrute · Liège, BE
          </p>
          <div className="flex gap-6">
            <Link
              href="/#contact"
              className="text-xs no-underline"
              style={{ color: "var(--color-muted)" }}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm no-underline transition-colors"
        style={{ color: "var(--color-muted)" }}
      >
        {children}
      </Link>
    </li>
  );
}
