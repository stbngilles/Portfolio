/**
 * Flèches et croix en SVG inline. Les glyphes (↗ → ← ↓ ✕) étaient rendus par
 * la police de repli : graisse et ligne de base changeaient selon l'OS.
 * Ici : même trait (1.6), même grille (16), même couleur que le texte.
 */
type Dir = "ne" | "e" | "w" | "s" | "x";

const PATHS: Record<Dir, string> = {
  ne: "M4 12 L12 4 M5.5 4 H12 V10.5",
  e: "M2.5 8 H13 M9 3.5 L13.5 8 L9 12.5",
  w: "M13.5 8 H3 M7 3.5 L2.5 8 L7 12.5",
  s: "M8 2.5 V13 M3.5 9 L8 13.5 L12.5 9",
  x: "M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5",
};

export default function Arrow({ dir = "ne" }: { dir?: Dir }) {
  return (
    <svg
      className="pb-arw"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[dir]} />
    </svg>
  );
}
