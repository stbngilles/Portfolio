"use client";

import React, { useMemo, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Item = { cat: string; q: string; a: string };

const FAQ_DATA: Item[] = [
  {
    cat: "Acquisition",
    q: "Pourquoi un site <em>sans pubs</em> ne suffit pas&nbsp;?",
    a: "Un site, c'est comme un magasin. S'il est sur une rue où personne ne passe, il peut être magnifique, il ne rapporte rien. Les pubs Meta, c'est ce qui amène les gens jusqu'à votre porte. Sans, vous misez tout sur Google et le bouche-à-oreille — c'est lent, incertain, et ça ne marche pas pour tout le monde.",
  },
  {
    cat: "Acquisition",
    q: "Combien coûtent les <em>Meta Ads</em> en plus du site&nbsp;?",
    a: "Le budget pub vous appartient et vous le pilotez : à partir de 15 €/jour ça fonctionne déjà — on a un client en Belgique à ~5 000 visites/jour avec ce budget-là. Notre service de pilotage (gestion + reporting) est sur abonnement, on chiffre selon votre cible et vos volumes. Aucun engagement long.",
  },
  {
    cat: "Acquisition",
    q: "Vous <em>gérez les pubs</em> ou vous nous formez&nbsp;?",
    a: "Les deux options. Soit on gère tout (vous regardez les leads arriver via un dashboard hebdo), soit on vous forme à le faire vous-même (3 h de coaching, vous gardez la main). La plupart des clients veulent qu'on gère — c'est ce qu'on fait le mieux, et ça vous libère du temps.",
  },
  {
    cat: "Prix",
    q: "C'est <em>plus cher</em> qu'un site Wix ou qu'un freelance Fiverr.",
    a: "Oui. Et votre image, votre ergonomie, votre référencement aussi sont plus importants. Un template remplit un cahier des charges. Un site fait sur mesure remplit un carnet de commandes. On n'est pas là pour les projets 'juste pour être en ligne' — on est là pour ceux qui cherchent un retour sur investissement.",
  },
  {
    cat: "Prix",
    q: "Je n'ai pas de budget <em>défini</em>.",
    a: "Normal. Utilisez le simulateur juste au-dessus : en 30 secondes vous avez une fourchette claire. Si ça colle, on discute. Sinon, aucun engagement.",
  },
  {
    cat: "Prix",
    q: "Est-ce que <em>le paiement peut être échelonné</em> ?",
    a: "Oui. Par défaut : 40% au lancement, 30% à la validation du design, 30% à la mise en ligne. On peut aussi discuter d'un étalement plus long pour les projets plus importants.",
  },
  {
    cat: "Délai",
    q: "Combien de temps ça prend, <em>vraiment</em> ?",
    a: "4 semaines pour un site vitrine classique, du premier appel à la mise en ligne. 2 semaines en mode express (+25%). Si on vous dit 'c'est prêt demain', méfiez-vous.",
  },
  {
    cat: "Délai",
    q: "Et si <em>je n'ai pas le temps</em> de suivre le projet ?",
    a: "On prend ça en charge. Vous avez 3 rendez-vous à caler : le brief (30 min), la validation des maquettes (45 min), la recette finale (1 h). Le reste, c'est nous.",
  },
  {
    cat: "Technique",
    q: "Je ne comprends <em>rien au code</em>, est-ce un problème ?",
    a: "Non, c'est même l'idée. Notre job c'est de vous débarrasser de ces questions. Vous gardez la main sur les textes et images via un back-office simple si vous le souhaitez. Le code, c'est notre cuisine.",
  },
  {
    cat: "Technique",
    q: "Qu'est-ce qui se passe si <em>vous disparaissez</em> ?",
    a: "Le code vous appartient. Il est hébergé sur votre compte, en infrastructure standard (Vercel / Next.js). N'importe quel développeur peut reprendre derrière nous. On ne fait pas de prison technique.",
  },
  {
    cat: "Technique",
    q: "Mon site apparaîtra-t-il sur <em>Google</em> ?",
    a: "Le SEO technique est inclus : structure propre, vitesse, balises, sitemap, données structurées. Pour le SEO de contenu (ranker sur des mots-clés précis), c'est un service à part — on vous dit franchement si c'est pertinent pour votre business.",
  },
  {
    cat: "Confiance",
    q: "Pourquoi <em>vous</em> et pas une agence de 20 personnes ?",
    a: "Parce qu'on est deux, et qu'on est les deux personnes qui touchent votre projet. Pas de commercial qui vend, de chef de projet qui traduit, de junior qui exécute. Moins cher, plus direct, plus responsable.",
  },
  {
    cat: "Confiance",
    q: "Et si <em>le résultat ne me plaît pas</em> ?",
    a: "On ne passe pas en phase de développement tant que le design ne vous convient pas à 100%. Si, malgré ça, vous voulez arrêter après la phase de design, vous repartez avec les maquettes et c'est tout — aucun engagement sur la suite.",
  },
];

export default function FAQ() {
  const cats = useMemo(
    () => ["Toutes", ...Array.from(new Set(FAQ_DATA.map((f) => f.cat)))],
    []
  );
  const [cat, setCat] = useState("Toutes");
  const [open, setOpen] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  const filtered =
    cat === "Toutes" ? FAQ_DATA : FAQ_DATA.filter((f) => f.cat === cat);

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

      // Filters + list entrance
      gsap.fromTo(
        ".faq-filters",
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".faq-wrap",
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".faq-list",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".faq-wrap",
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section" id="faq">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">
            <span
              className="inline-block"
              style={{ width: 18, height: 1, background: "var(--color-accent)" }}
            />
            OBJECTIONS · ON RÉPOND CASH
          </div>
          <h2 className="serif">
            Ce que nos clients
            <br />
            nous demandent <em className="serif-i">avant</em>.
          </h2>
        </div>

        <div className="faq-wrap">
          <div className="faq-filters">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => { setCat(c); setOpen(0); }}
                className="faq-filter"
                data-on={cat === c}
              >
                <span>{c}</span>
                <span className="mono" style={{ fontSize: 11 }}>
                  {c === "Toutes"
                    ? FAQ_DATA.length
                    : FAQ_DATA.filter((f) => f.cat === c).length}
                </span>
              </button>
            ))}
          </div>
          <div className="faq-list">
            {filtered.map((f, i) => (
              <div
                key={`${cat}-${i}`}
                className={`faq-item ${open === i ? "open" : ""}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <div className="faq-q">
                  <span dangerouslySetInnerHTML={{ __html: f.q }} />
                  <span className="ind mono">+</span>
                </div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .faq-wrap {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 80px;
          align-items: start;
        }
        .faq-filters {
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: sticky;
          top: 100px;
          will-change: opacity, transform;
        }
        .faq-filter {
          text-align: left;
          background: transparent;
          border: none;
          padding: 14px 0;
          font-size: 14px;
          color: var(--color-muted);
          border-bottom: 1px solid var(--color-line);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: color 160ms;
          letter-spacing: -0.01em;
          font-family: inherit;
        }
        .faq-filter:hover { color: var(--color-ink); }
        .faq-filter[data-on="true"] { color: var(--color-accent); }
        .faq-list {
          display: flex;
          flex-direction: column;
          will-change: opacity, transform;
        }
        .faq-item {
          border-bottom: 1px solid var(--color-line);
          padding: 28px 0;
          cursor: pointer;
        }
        .faq-item:first-child { border-top: 1px solid var(--color-line); }
        .faq-q {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: start;
          font-family: var(--font-serif);
          font-size: 26px;
          line-height: 1.15;
          letter-spacing: -0.015em;
        }
        .faq-q em {
          font-style: italic;
          color: var(--color-accent);
          font-weight: 400;
          background: var(--color-accent-soft);
          padding: 0 4px;
          margin: 0 -2px;
          border-radius: 2px;
        }
        .faq-q .ind {
          flex-shrink: 0;
          font-size: 14px;
          color: var(--color-muted);
          transition: transform 260ms;
        }
        .faq-item.open .faq-q .ind {
          transform: rotate(45deg);
          color: var(--color-accent);
        }
        .faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 320ms ease, padding 320ms ease;
          color: var(--color-muted);
          line-height: 1.6;
          font-size: 15px;
        }
        .faq-item.open .faq-a {
          max-height: 400px;
          padding-top: 18px;
        }
        @media (max-width: 860px) {
          .faq-wrap { grid-template-columns: 1fr; gap: 32px; }
          .faq-filters {
            position: static;
            flex-direction: row;
            overflow-x: auto;
            gap: 20px;
          }
          .faq-filter {
            border: none;
            padding: 8px 0;
            white-space: nowrap;
          }
          .faq-q { font-size: 20px; }
        }
      `}</style>
    </section>
  );
}
