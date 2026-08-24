"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Moteur de mouvement de la homepage. Un seul composant client monté une fois
 * par le layout : smooth scroll (Lenis) + ScrollTrigger branché sur son ticker.
 *
 * Les sections restent des composants serveur et déclarent leurs intentions
 * par attributs :
 *   data-reveal            → entrée (translateY + opacity), once
 *   data-reveal-group      → enfants directs en cascade
 *   data-lines             → titre découpé en lignes qui montent depuis un clip
 *   data-words             → phrase dont les mots s'allument au scroll (scrub court)
 *   data-scale             → image qui passe de 1.18 → 1 pendant qu'elle traverse l'écran (scrub)
 *   data-parallax="0.15"   → décalage vertical proportionnel (scrub)
 *   data-mask              → image révélée par clip-path depuis le bas
 */
export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Les liens d'ancre passent par Lenis, sinon le saut natif casse le lissage.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!a) return;
      const id = a.getAttribute("href")!.replace(/^\/?#/, "");
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    const ctx = gsap.context(() => {
      const ease = "power4.out";

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease, scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((el) => {
        gsap.fromTo(
          el.children,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease, stagger: 0.09, scrollTrigger: { trigger: el, start: "top 86%", once: true } }
        );
      });

      // Le hero a sa propre timeline d'entrée (plus bas) : s'il passait aussi
      // ici, ses lignes joueraient deux fois — deux tweens concurrents sur le
      // même yPercent, l'un décalé de 0.15 s. C'est le titre qui semblait
      // rejouer au chargement.
      const lineTitles = gsap.utils
        .toArray<HTMLElement>("[data-lines]")
        .filter((el) => !el.closest(".pb-hero"));

      lineTitles.forEach((el) => {
        const lines = el.querySelectorAll<HTMLElement>(".pb-line > span");
        gsap.fromTo(
          lines,
          { yPercent: 110, rotate: 2 },
          { yPercent: 0, rotate: 0, duration: 1.2, ease, stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%", once: true } }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
        const words = el.querySelectorAll<HTMLElement>(".pb-w");
        gsap.fromTo(
          words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: "none",
            // Le scrub long (1.2) faisait traîner l'éclairage loin derrière le
            // scroll — et ce retard s'ajoutait au lissage de Lenis. Ici le
            // scrub est quasi immédiat (Lenis fournit déjà la douceur), et la
            // phrase finit de s'allumer quand elle arrive au centre de l'écran,
            // pas quand elle en sort.
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 40%", scrub: 0.25 },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-scale]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.18 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: 1.4 } }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const k = parseFloat(el.dataset.parallax || "0.15");
        gsap.fromTo(
          el,
          { yPercent: -k * 100 },
          { yPercent: k * 100, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: 1.3 } }
        );
      });

      // Hero : l'image arrive après le titre, une seule fois au chargement.
      const hero = document.querySelector<HTMLElement>(".pb-hero");
      if (hero) {
        const tl = gsap.timeline({ defaults: { ease } });
        tl.fromTo(hero.querySelectorAll(".pb-hero .pb-line > span"), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.09 }, 0.15)
          .fromTo(hero.querySelectorAll(".pb-hero-meta > *"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.7)
          .fromTo(hero.querySelector(".pb-hero-visual"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.5, ease: "power4.inOut" }, 0.55);
      }
    });

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
