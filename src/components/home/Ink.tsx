/**
 * L'encre du tampon, mise à disposition du reste de la page.
 *
 * `Logo.tsx` porte son propre filtre : le mot est dessiné en SVG, à 146 px de
 * large, avec un grain proportionnellement grossier (0,055/0,09, déplacement
 * de 7 u sur un bloc de 544 u). Ce filtre-ci sert aux éléments HTML — un
 * libellé mono de 11 px dans un bloc de ~150 px : à cette échelle il faut un
 * grain plus fin et un déplacement bien plus court, sinon les lettres se
 * mangent au lieu de s'encrer. Les deux réglages donnent la même morsure
 * relative sur les bords, c'est ce qui compte pour que ce soit le même tampon.
 *
 * Monté une fois dans `(home)/layout.tsx` : `filter: url(#pb-ink)` (voir
 * `.pb-inked` dans home.css) ne résout son fragment que dans le document.
 */
export default function Ink() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <filter id="pb-ink" x="-8%" y="-24%" width="116%" height="148%">
        <feTurbulence type="fractalNoise" baseFrequency="0.16 0.26" numOctaves="3" seed="11" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
