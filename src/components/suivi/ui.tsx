import type { ReactNode } from "react";

/**
 * Briques visuelles de l'espace de suivi client. Design volontairement
 * classique : cartes blanches sur fond craie, un seul bleu pour l'action,
 * des pastilles de couleur toujours doublées d'un mot.
 */

type Ton = "vert" | "ambre" | "bleu" | "gris" | "rouge";

const TONS: Record<Ton, string> = {
  vert: "bg-[#E4F2E7] text-[#1B5E2E] ring-[#BFDFC7]",
  ambre: "bg-[#FCEFD6] text-[#7A4A00] ring-[#F0D59E]",
  bleu: "bg-accent-soft text-accent-ink ring-[#BCC7EC]",
  gris: "bg-[#ECEBE7] text-[#45454D] ring-[#D9D8D2]",
  rouge: "bg-[#FBE3E0] text-[#962318] ring-[#F1C2BC]",
};

export function tonStatut(statut?: string | null): Ton {
  switch (statut) {
    case "Fait":
    case "Validée":
      return "vert";
    case "Attente client":
    case "Attente confirmation":
    case "En attente":
      return "ambre";
    case "En cours":
    case "Reçue":
      return "bleu";
    case "Refusée":
      return "rouge";
    default:
      return "gris";
  }
}

/**
 * Le même statut ne se dit pas pareil selon qui lit. « Attente client » dit
 * peu au client, « J'attends de toi » dit tout ; l'admin, lui, veut savoir
 * qui tient la balle.
 */
export function libelleStatut(statut?: string | null, lecteur: "client" | "admin" = "client", prenom = "le client") {
  const client = lecteur === "client";
  switch (statut) {
    case "Attente client":
      return client ? "J'attends de toi" : `Attente ${prenom}`;
    case "Attente confirmation":
      return client ? "À valider par toi" : `À valider par ${prenom}`;
    case "En attente":
      return client ? "À faire" : `Chez ${prenom}`;
    default:
      return statut ?? "";
  }
}

export function tonPriorite(p?: string | null): Ton {
  return p === "Bloquant" ? "rouge" : p === "Plus tard" ? "gris" : "bleu";
}

export function Badge({ ton, children }: { ton: Ton; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-medium ring-1 ring-inset ${TONS[ton]}`}
    >
      {children}
    </span>
  );
}

export function Carte({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-white ${className}`}>{children}</div>;
}

export function TitreSection({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <h2 className="text-lg font-semibold tracking-[-0.01em]">{children}</h2>
      {action}
    </div>
  );
}

export function Vide({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-muted">{children}</p>;
}

/** Texte qui peut contenir une URL : l'URL devient un lien cliquable. */
export function AvecLiens({ texte }: { texte: string }) {
  const parts = texte.split(/(https?:\/\/[^\s,]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a
            key={i}
            href={p}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-accent/30 underline-offset-2 [overflow-wrap:anywhere] hover:decoration-accent"
          >
            {p.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

// Icônes au trait (famille Lucide), 1.75 px, décoratives : le texte à côté porte le sens.
const ICONES = {
  check: <path d="M20 6 9 17l-5-5" />,
  horloge: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  main: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  fichier: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </>
  ),
  telecharger: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />,
  externe: <path d="M7 17 17 7M9 7h8v8" />,
  sortie: <path d="M15 17l5-5-5-5M20 12H9M11 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  envoi: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />,
  oeil: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  cadenas: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  serveur: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
} as const;

export function Icone({ nom, className = "size-4" }: { nom: keyof typeof ICONES; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {ICONES[nom]}
    </svg>
  );
}

export const champ =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export const boutonPrimaire =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50";

export const boutonSecondaire =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-[15px] font-medium text-ink transition-colors hover:border-ink/40 hover:bg-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
