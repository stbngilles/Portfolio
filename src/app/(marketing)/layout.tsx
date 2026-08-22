import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientShell from "@/components/ClientShell";
import PageLoader from "@/components/PageLoader";

/**
 * Layout du site marketing (pixelbrute.be public).
 * Ce route group `(marketing)` est invisible dans l'URL : la racine `/`,
 * `/equipe`, `/services`, `/realisations` continuent de fonctionner exactement
 * comme avant. C'est uniquement pour découpler la chrome du site vitrine
 * de celle de la plateforme `/app/*`.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*
        Preloader SSR : ce div est rendu côté serveur et visible IMMÉDIATEMENT
        dans le HTML brut, avant que React hydrate. Il couvre tout le contenu.
        PageLoader (client) s'y attache et gère la barre + la sortie animée.
      */}
      <div
        id="pb-loader"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#0F0F14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Grille */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <defs>
            <pattern id="pl-grid" width="52" height="52" patternUnits="userSpaceOnUse">
              <path d="M 52 0 L 0 0 0 52" fill="none" stroke="#1F3FBF" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pl-grid)" opacity="0.10" />
        </svg>

        {/* Cercles géométriques */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="720" cy="450" r="300" fill="none" stroke="#1F3FBF" strokeWidth="0.6" opacity="0.22" />
          <circle cx="420" cy="450" r="300" fill="none" stroke="#1F3FBF" strokeWidth="0.6" opacity="0.14" />
          <circle cx="1020" cy="450" r="300" fill="none" stroke="#1F3FBF" strokeWidth="0.6" opacity="0.14" />
          <circle cx="570" cy="191" r="300" fill="none" stroke="#1F3FBF" strokeWidth="0.5" opacity="0.11" />
          <circle cx="870" cy="191" r="300" fill="none" stroke="#1F3FBF" strokeWidth="0.5" opacity="0.11" />
          <circle cx="570" cy="709" r="300" fill="none" stroke="#1F3FBF" strokeWidth="0.5" opacity="0.08" />
          <circle cx="870" cy="709" r="300" fill="none" stroke="#1F3FBF" strokeWidth="0.5" opacity="0.08" />
          <circle cx="720" cy="450" r="500" fill="none" stroke="#1F3FBF" strokeWidth="0.4" opacity="0.06" />
        </svg>

        {/* Contenu centré */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Le tampon. Fond encre : le bloc passe en craie et le mot en bleu
              — le tampon bleu sur encre ne tient que 2,3:1 de contraste.
              `textLength` fige la largeur du mot tant qu'Archivo n'est pas
              chargée : le préchargeur s'affiche avant tout le reste. */}
          <svg
            viewBox="0 0 560 150"
            role="img"
            aria-label="Pixelbrute"
            style={{
              width: "clamp(280px, 42vw, 460px)",
              height: "auto",
              transform: "rotate(-1.4deg)",
            }}
          >
            <defs>
              <filter id="pb-stamp-loader" x="-6%" y="-18%" width="112%" height="136%">
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
            <g filter="url(#pb-stamp-loader)">
              <rect x="8" y="8" width="544" height="134" fill="#F2F1EE" />
              <text
                x="280"
                y="102"
                textAnchor="middle"
                textLength="462"
                lengthAdjust="spacingAndGlyphs"
                fontSize="68"
                letterSpacing="-2"
                fill="#1F3FBF"
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

          {/* Sous-titre */}
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(250,249,245,0.35)",
              margin: 0,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Studio Web · Liège
          </p>

          {/* Barre de progression */}
          <div
            style={{
              width: "clamp(260px, 36vw, 400px)",
              marginTop: "10px",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "1px",
                background: "rgba(250,249,245,0.08)",
                position: "relative",
              }}
            >
              <div
                id="pb-fill"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "1px",
                  width: "0%",
                  background: "linear-gradient(90deg, rgba(31,63,191,0.3), #1F3FBF)",
                  transition: "width 80ms linear",
                }}
              />
              <div
                id="pb-dot"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "0%",
                  transform: "translate(-50%, -50%)",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#1F3FBF",
                  transition: "left 80ms linear",
                  boxShadow: "0 0 8px rgba(31,63,191,0.8)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Compteur bas-droite */}
        <div
          id="pb-counter"
          style={{
            position: "absolute",
            bottom: "28px",
            right: "32px",
            fontSize: "11px",
            letterSpacing: "0.12em",
            color: "rgba(250,249,245,0.2)",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          00 / 100
        </div>

        {/* Label bas-gauche */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "32px",
            fontSize: "11px",
            letterSpacing: "0.12em",
            color: "rgba(250,249,245,0.14)",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          pixelbrute.be
        </div>
      </div>

      {/* Client component : anime la barre et supprime le preloader */}
      <PageLoader />

      <div className="noise-bg" />
      <Navbar />
      <ClientShell>{children}</ClientShell>
      <Footer />
    </>
  );
}
