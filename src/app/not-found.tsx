import Link from "next/link";

/**
 * 404 racine. L'ancienne page vivait dans le groupe `(marketing)`, supprimé
 * avec les pages qu'il servait ; celle-ci couvre désormais toute URL inconnue,
 * plateforme comprise. Volontairement autonome : ni home.css ni chrome de la
 * home, pour rester correcte quel que soit le segment qui l'affiche.
 */
export const metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "22px",
        padding: "80px 24px",
        textAlign: "center",
        background: "#0F0F14",
        color: "#FAF9F5",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(250,249,245,0.4)",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        Erreur 404
      </p>

      <h1
        style={{
          margin: 0,
          fontSize: "clamp(32px, 7vw, 64px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          fontWeight: 800,
          fontFamily: "var(--font-archivo), Archivo, Arial, sans-serif",
        }}
      >
        Cette page n&apos;existe pas.
      </h1>

      <p
        style={{
          margin: 0,
          maxWidth: "46ch",
          fontSize: "15px",
          lineHeight: 1.6,
          color: "rgba(250,249,245,0.62)",
        }}
      >
        Elle a peut-être été retirée, ou l&apos;adresse comporte une coquille. Le site tient
        en deux pages&nbsp;: le travail, et de quoi me joindre.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            padding: "12px 20px",
            background: "#1F3FBF",
            color: "#FAF9F5",
            fontSize: "13px",
            letterSpacing: "0.02em",
          }}
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/contact"
          style={{
            padding: "12px 20px",
            border: "1px solid rgba(250,249,245,0.24)",
            color: "#FAF9F5",
            fontSize: "13px",
            letterSpacing: "0.02em",
          }}
        >
          Me contacter
        </Link>
      </div>
    </main>
  );
}
