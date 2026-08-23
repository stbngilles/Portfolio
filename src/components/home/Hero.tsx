import Link from "next/link";
import Arrow from "./Arrow";
import { Lines } from "./Text";

/**
 * Premier écran — le titre occupe la largeur, puis la scène « recherche
 * Google » : votre métier + votre ville, votre site en première position,
 * les concurrents bien plus bas. Ça se comprend sans avoir ouvert un outil
 * de design. La scène est décorative pour les lecteurs d'écran.
 */
export default function Hero() {
  return (
    <section id="top" className="pb-hero">
      <div className="pb-hero-head">
        <Lines
          as="h1"
          className="pb-d-xl"
          lines={["Votre site", "trouve des clients.", "Vous, vous décrochez."]}
          muteFrom={2}
        />

        <div className="pb-hero-meta">
          {/* Le `h1` est une accroche : il ne contient aucun terme que les gens
              tapent. Ce `h2` dit littéralement le métier et la ville — c'est
              le seul endroit de la page qui a le droit d'être plat. */}
          <h2 className="pb-hero-sub">
            Création de sites internet à Hannut, en Hesbaye et en province de Liège — pour indépendants et artisans.
          </h2>
          <p className="pb-hero-lede">
            Studio web solo à Liège. Conception, design et code par la même personne — pour des
            indépendants et des artisans qui veulent être trouvés, puis appelés.
          </p>
          <div className="pb-hero-acts">
            <Link href="/contact" className="pb-btn-solid">
              Parler de votre projet <Arrow dir="ne" />
            </Link>
            <a href="#projets" className="pb-btn-line">
              Voir le travail <Arrow dir="s" />
            </a>
          </div>
        </div>
      </div>

      <div className="pb-hero-visual">
        <div className="pb-search" aria-hidden="true">
          <div className="pb-search-bar">
            <svg className="pb-search-g" viewBox="0 0 48 48">
              <path
                fill="#4285F4"
                d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
              />
              <path
                fill="#34A853"
                d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
              />
              <path
                fill="#FBBC05"
                d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
              />
              <path
                fill="#EA4335"
                d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
              />
            </svg>
            <span className="pb-search-q">
              votre métier <span>+ votre ville</span>
            </span>
            <i className="pb-search-caret" />
            <span className="pb-search-go">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="M15.5 15.5 L21 21" />
              </svg>
            </span>
          </div>

          <div className="pb-search-hit">
            <div className="pb-search-hit-id">
              {/* Favicon du résultat : la version « PB » du tampon — à 34 px
                  le grain du bloc ne fait que salir, donc bords vifs et à plat
                  (mêmes réglages que public/icon.svg). */}
              <svg viewBox="0 0 32 32" className="pb-search-fav" aria-hidden="true">
                <rect width="32" height="32" fill="var(--pb-accent)" />
                <text
                  x="16"
                  y="23"
                  textAnchor="middle"
                  textLength="23"
                  lengthAdjust="spacingAndGlyphs"
                  fontSize="17"
                  letterSpacing="-0.5"
                  fill="var(--pb-paper)"
                  style={{
                    fontFamily:
                      "var(--font-archivo), Archivo, 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 800,
                  }}
                >
                  PB
                </text>
              </svg>
              <div className="pb-search-name">Votre site</div>
            </div>
            <span className="pb-label pb-inked">1ʳᵉ position</span>

            <span className="pb-search-cursor">
              <i />
              <svg viewBox="0 0 16 20">
                <path
                  d="M1 1.2 L1 16.6 L5 12.9 L7.6 18.6 L10.4 17.3 L7.9 11.8 L13.2 11.6 Z"
                  fill="#faf9f5"
                  stroke="#0f0f14"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="pb-search-gap">
            <i />
            <i />
            <i />
          </div>

          <div className="pb-search-miss">
            <div className="pb-search-name">Vos concurrents</div>
            <span className="pb-search-badge pb-mono">17ᵉ position</span>
          </div>
        </div>

        <div className="pb-hero-tag">
          <span className="pb-label">Deux clients en 1ʳᵉ position du pack local Google</span>
          <a href="#projets" className="pb-label pb-hero-proof">
            <i aria-hidden="true" />
            Vérifiable en dix secondes <Arrow dir="s" />
          </a>
        </div>
      </div>
    </section>
  );
}
