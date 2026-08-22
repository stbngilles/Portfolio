/**
 * Logo Pixelbrute : la tuile « P » (identique à public/icon.svg, déjà utilisée
 * comme favicon et dans le préchargeur du site) suivie du mot-symbole.
 *
 * Le mot-symbole est composé en Archivo (SIL OFL, chargée via next/font) et
 * non dans la police du dossier 03_BRAND : celle-ci est un Crelon Sans
 * « PERSONAL USE » de Mans Greback, sans licence commerciale.
 */
export default function Logo({ tone }: { tone?: "light" }) {
  const light = tone === "light";
  return (
    <>
      <span className="pb-mark">
        <svg viewBox="0 0 32 32" role="img" aria-label="Pixelbrute">
          <defs>
            <linearGradient id="pb-logo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3D63F5" />
              <stop offset="100%" stopColor="#1F3FBF" />
            </linearGradient>
          </defs>
          <rect
            width="32"
            height="32"
            rx="7"
            fill={light ? "var(--pb-paper)" : "url(#pb-logo-grad)"}
          />
          <text
            x="16.5"
            y="24"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="24"
            fill={light ? "var(--pb-accent)" : "#FFFFFF"}
          >
            P
          </text>
        </svg>
      </span>
      <span className="pb-wordmark" data-tone={tone}>
        Pixel<b>brute</b>
      </span>
    </>
  );
}
