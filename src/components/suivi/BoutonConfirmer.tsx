"use client";

import type { ReactNode } from "react";

/** Bouton de formulaire qui demande confirmation avant d'envoyer. */
export function BoutonConfirmer({
  message,
  formAction,
  className,
  children,
}: {
  message: string;
  formAction: (f: FormData) => void | Promise<void>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      formAction={formAction}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
