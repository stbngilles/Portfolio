import { ImageResponse } from "next/og";

/**
 * La carte de partage, une seule fois.
 *
 * Chaque page qui compte a sa propre image : le titre de la page, pas celui
 * du site. Sur LinkedIn, où sont les dirigeants visés, l'aperçu est la
 * première chose lue, avant le titre et avant le texte. Trois pages qui
 * partagent le même mockup racontent trois fois la même chose.
 *
 * Générée à la volée plutôt que déposée en PNG : le texte suit la page sans
 * repasser par un outil de design, et la DA (tampon Klein sur craie) reste
 * celle du site. Les polices du site ne sont pas chargées ici, `next/og` ne
 * lit pas les fichiers de police du build, et un `fetch` par rendu coûterait
 * plus qu'il ne rapporte : sans-serif système, graisse forte, c'est net.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

type Card = {
  /** Surtitre, petit, en bleu. Facultatif. */
  over?: string;
  /** Titre, une ligne par entrée. Deux à trois lignes, pas plus. */
  title: string[];
  /** Sous-titre, une phrase. */
  sub: string;
  /** Pied gauche. */
  foot?: string;
};

export function ogCard({ over, title, sub, foot = "Studio web solo · Liège, Belgique" }: Card) {
  // Un titre long descend d'un cran : la carte ne doit jamais couper une ligne.
  const longest = Math.max(...title.map((t) => t.length));
  const size = longest > 26 ? 58 : longest > 20 ? 66 : 74;

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
          padding: "64px 76px 60px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              display: "flex",
              background: "#1F3FBF",
              padding: "16px 26px 20px",
              transform: "rotate(-1.4deg)",
            }}
          >
            <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: "-1px", color: "#F2F1EE", lineHeight: 1 }}>
              PIXELBRUTE
            </div>
          </div>
          {over ? (
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#1F3FBF",
                paddingTop: 18,
              }}
            >
              {over}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: size,
              fontWeight: 800,
              letterSpacing: "-2.5px",
              lineHeight: 1.04,
              color: "#0F0F14",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {title.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div style={{ fontSize: 27, color: "#5A5D6E", lineHeight: 1.35, display: "flex", maxWidth: 960 }}>
            {sub}
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
          <span>{foot}</span>
          <span>pixelbrute.be</span>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
