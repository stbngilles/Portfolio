"use client";

import { useCallback, type ReactNode } from "react";
import { openCal, wantsNewTab } from "./cal";
import { BOOKING_URL } from "./data";

/**
 * Un lien qui ouvre le calendrier en modale, voir `cal.ts` pour le pourquoi
 * du chargement différé et du repli sur la page publique.
 */
type Props = Omit<React.ComponentPropsWithoutRef<"a">, "href" | "onClick"> & {
  children: ReactNode;
};

export default function BookCall({ children, ...rest }: Props) {
  const open = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (wantsNewTab(e)) return; // onglet demandé explicitement : on ne s'en mêle pas
    e.preventDefault();
    openCal();
  }, []);

  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener" {...rest} onClick={open}>
      {children}
    </a>
  );
}
