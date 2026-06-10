"use client";

import { useEffect } from "react";

const MIN_MS = 1600;

export default function PageLoader() {
  useEffect(() => {
    const loader  = document.getElementById("pb-loader");
    const fill    = document.getElementById("pb-fill")   as HTMLElement | null;
    const dot     = document.getElementById("pb-dot")    as HTMLElement | null;
    const counter = document.getElementById("pb-counter") as HTMLElement | null;
    if (!loader) return;

    const startedAt = Date.now();
    let current = 0;

    const setProgress = (p: number) => {
      const pct = `${p}%`;
      if (fill)    fill.style.width = pct;
      if (dot)     dot.style.left   = pct;
      if (counter) counter.textContent = `${String(p).padStart(2, "0")} / 100`;
    };

    const interval = setInterval(() => {
      const step = current < 70 ? Math.random() * 9 + 3 : Math.random() * 2;
      current = Math.min(current + step, 88);
      setProgress(Math.round(current));
      if (current >= 88) clearInterval(interval);
    }, 90);

    const dismiss = () => {
      clearInterval(interval);
      setProgress(100);
      const elapsed = Date.now() - startedAt;
      const delay   = Math.max(0, MIN_MS - elapsed) + 220;
      setTimeout(() => {
        loader.style.transition = "opacity 0.75s ease, transform 0.75s ease";
        loader.style.opacity    = "0";
        loader.style.transform  = "scale(1.015)";
        loader.style.pointerEvents = "none";
        setTimeout(() => loader.remove(), 780);
      }, delay);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", dismiss);
    };
  }, []);

  return null;
}
