"use client";

import type { ReactNode } from "react";
import { trackEvent, type PbEvent } from "./track";

/**
 * Un lien ordinaire qui signale son clic. Sert aux voies directes, téléphone,
 * WhatsApp, e-mail, que les composants serveur ne peuvent pas écouter.
 * Le `href` reste natif : sans JavaScript, le lien reste un lien.
 */
type Props = React.ComponentPropsWithoutRef<"a"> & {
  event: PbEvent;
  children: ReactNode;
};

export default function TrackLink({ event, children, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
