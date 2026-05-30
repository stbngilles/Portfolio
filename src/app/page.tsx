"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import Process from "@/components/Process";
import Simulator from "@/components/Simulator";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import ContactForm from "@/components/ContactForm";
import StickyCTA from "@/components/StickyCTA";

const ThreeCanvas = dynamic(() => import("@/components/ThreeCanvas"), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="overflow-x-hidden w-full max-w-full">
      <ThreeCanvas />
      <Hero />
      <ProductShowcase />
      <Stats />
      <Testimonials />
      <Simulator />
      <Process />
      <Team />
      <FAQ />
      <FinalCTA />
      <ContactForm />
      <StickyCTA />
    </main>
  );
}
