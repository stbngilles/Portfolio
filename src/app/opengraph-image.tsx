import { ImageResponse } from "next/og";

/**
 * Carte de partage par défaut du site. Sans elle, `twitter:card` valait
 * `summary_large_image` sans image : tout partage rendait un cadre vide.
 *
 * Générée à la volée plutôt que déposée en PNG, le texte reste modifiable
 * sans repasser par un outil de design, et la DA (tampon Klein sur craie)
 * suit celle du site.
 */
export const alt = "Pixelbrute · création de sites internet à Liège";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F2F1EE",
          padding: "72px 76px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Le tampon : bloc Klein, mot en craie. Repris du logo du site. */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              background: "#1F3FBF",
              padding: "16px 26px 20px",
              transform: "rotate(-1.4deg)",
            }}
          >
            <div
              style={{
                fontSize: 46,
                fontWeight: 900,
                letterSpacing: "-1px",
                color: "#F2F1EE",
                lineHeight: 1,
              }}
            >
              PIXELBRUTE
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              letterSpacing: "-2.5px",
              lineHeight: 1.03,
              color: "#0F0F14",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Création de sites internet</span>
            <span>à Liège.</span>
          </div>
          <div style={{ fontSize: 28, color: "#5A5D6E", lineHeight: 1.35, display: "flex" }}>
            Conception, design et code par la même personne.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #C9C6BE",
            paddingTop: 22,
            fontSize: 21,
            color: "#5A5D6E",
          }}
        >
          <span>Studio web solo · Liège, Belgique</span>
          <span>pixelbrute.be</span>
        </div>
      </div>
    ),
    size
  );
}
