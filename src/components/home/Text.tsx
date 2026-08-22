import type { ReactNode } from "react";

/**
 * Découpages typographiques pour les animations. Les lignes sont données
 * explicitement (pas de mesure côté client) : on décide où le titre casse.
 */
export function Lines({
  lines,
  as: Tag = "h2",
  className = "",
  muteFrom,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** À partir de cet index, les lignes passent en encre atténuée. */
  muteFrom?: number;
}) {
  return (
    <Tag className={className} data-lines="">
      {lines.map((l, i) => (
        <span key={i} className="pb-line" data-mute={muteFrom !== undefined && i >= muteFrom ? "" : undefined}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

export function Words({ text, className = "", children }: { text: string; className?: string; children?: ReactNode }) {
  return (
    <p className={className} data-words="">
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="pb-w">{w}</span>{" "}
        </span>
      ))}
      {children}
    </p>
  );
}
