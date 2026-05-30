"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
