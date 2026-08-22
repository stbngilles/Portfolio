/**
 * Logo Pixelbrute : le tampon.
 *
 * Le mot entier, encré d'un coup — bloc plein légèrement de travers, bords
 * rongés par un déplacement de turbulence. Il n'y a plus de tuile « P » à
 * côté du mot : la marque EST le mot, donc plus rien à aligner avec lui.
 *
 * Sous 24 px (favicon, onglet), c'est `public/icon.svg` qui prend le relais
 * avec « PB » sans grain : à cette taille le grain ne fait que salir.
 *
 * `tone="light"` sert quand la barre flotte au-dessus d'un panneau bleu ou
 * encre : le bloc passe alors en craie et le mot en bleu. Le tampon bleu posé
 * sur l'encre ne tient que 2,3:1 de contraste — d'où le retournement.
 *
 * `textLength` est figé à la largeur réelle d'Archivo 900 à 68 px (461,9 u) :
 * tant que la police n'est pas chargée, le mot garde la largeur du bloc au
 * lieu de rétrécir dans la fonte de secours.
 *
 * `idSuffix` évite deux `id` de filtre identiques quand l'en-tête et le pied
 * de page rendent le logo dans le même document.
 */
export default function Logo({
  tone,
  idSuffix = "hdr",
}: {
  tone?: "light";
  idSuffix?: string;
}) {
  const light = tone === "light";
  const filterId = `pb-stamp-${idSuffix}`;

  return (
    <span className="pb-stamp">
      <svg viewBox="0 0 560 150" role="img" aria-label="Pixelbrute">
        <defs>
          <filter id={filterId} x="-6%" y="-18%" width="112%" height="136%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.055 0.09"
              numOctaves="4"
              seed="11"
              result="n"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="n"
              scale="7"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <rect
            x="8"
            y="8"
            width="544"
            height="134"
            fill={light ? "var(--pb-paper)" : "var(--pb-accent)"}
          />
          <text
            x="280"
            y="102"
            textAnchor="middle"
            textLength="462"
            lengthAdjust="spacingAndGlyphs"
            fontSize="68"
            letterSpacing="-2"
            fill={light ? "var(--pb-accent)" : "var(--pb-paper)"}
            style={{
              fontFamily:
                "var(--font-archivo), Archivo, 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 900,
            }}
          >
            PIXELBRUTE
          </text>
        </g>
      </svg>
    </span>
  );
}
