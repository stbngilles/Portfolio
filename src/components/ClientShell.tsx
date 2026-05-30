"use client";

import React from "react";
import PageTransition from "./PageTransition";
import CommandPalette from "./CommandPalette";
import KonamiEgg from "./KonamiEgg";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTransition>{children}</PageTransition>
      <CommandPalette />
      <KonamiEgg />
    </>
  );
}
