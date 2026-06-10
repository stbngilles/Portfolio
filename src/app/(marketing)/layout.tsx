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
          {/* Icône logo Pixelbrute */}
          <div
            style={{
              width: "66px",
              height: "66px",
              borderRadius: "15px",
              background: "linear-gradient(135deg, #3D63F5, #1F3FBF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 1px rgba(63,95,255,0.3), 0 8px 32px rgba(31,63,191,0.35)",
              flexShrink: 0,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="38" height="38">
              <text
                x="16.5" y="24"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontStyle="italic"
                fontWeight="400"
                fontSize="24"
                fill="#FFFFFF"
              >
                P
              </text>
            </svg>
          </div>

          {/* Titre */}
          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 92px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              margin: 0,
              color: "#FAF9F5",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            PIXEL<span style={{ color: "#1F3FBF" }}>BRUTE</span>
          </h1>

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
