import Image from "next/image";
import Link from "next/link";
import Arrow from "./Arrow";
import ProjectChart from "./ProjectChart";
import type { Project } from "./data";
import { pad } from "./data";

/**
 * Étude de cas en page. Même contenu que la modale (`ProjectModal`), même
 * source dans `data.ts`, mais une hiérarchie de titres de page : `h1` sur le
 * nom du projet, `h2` sur les sections, `h3` sur les décisions.
 *
 * C'est cette hiérarchie qui justifie un composant distinct plutôt qu'un
 * `variant` sur la modale : dans une boîte de dialogue, le nom du projet est
 * un `h2` parmi le reste de la page ; ici, c'est le titre du document.
 *
 * Les classes `.pb-modal-*` sont réutilisées telles quelles : ce sont des
 * règles de typographie et de grille, pas du chrome de modale.
 */
export default function CaseStudy({
  project: p,
  index,
  prev,
  next,
}: {
  project: Project;
  index: number;
  prev: Project;
  next: Project;
}) {
  return (
    <article className="pb-case">
      <header className="pb-case-head">
        <div className="pb-case-crumb pb-label">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <Link href="/projets">Projets</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{p.name}</span>
        </div>

        <div className="pb-case-id pb-mono">
          <span className="pb-case-num">{pad(index)}</span>
          <span>{p.sector}</span>
        </div>

        <h1 className="pb-case-title">{p.name}</h1>
        <p className="pb-modal-lede">{p.lede}</p>

        <div className="pb-modal-meta">
          <div>
            <div style={{ color: "var(--pb-accent)", marginBottom: 7 }}>Rôle</div>
            {p.role}
          </div>
          <div>
            <div style={{ color: "var(--pb-accent)", marginBottom: 7 }}>Livré</div>
            {p.stack}
          </div>
          <div>
            <div style={{ color: "var(--pb-accent)", marginBottom: 7 }}>Résultat</div>
            {p.result}
          </div>
        </div>
      </header>

      {/* Les chiffres se lisent sur le site du client : ils sont là pour être
          recomptés, pas pour impressionner. */}
      <div className="pb-modal-facts">
        {p.facts.map((f) => (
          <div key={f.label} className="pb-modal-fact">
            <div className="pb-modal-fact-v">{f.value}</div>
            <div className="pb-cap">{f.label}</div>
          </div>
        ))}
      </div>

      {p.chart && <ProjectChart chart={p.chart} />}

      <div className="pb-modal-cols">
        <h2 className="pb-modal-lbl pb-case-h2" style={{ paddingTop: 8 }}>
          Contexte
        </h2>
        <div className="pb-modal-prose">
          {p.context.map((t) => (
            <p key={t} className="pb-modal-p">
              {t}
            </p>
          ))}
        </div>

        <h2 className="pb-modal-lbl pb-case-h2 pb-rule" style={{ paddingTop: 34 }}>
          Le problème
        </h2>
        <div className="pb-modal-prose pb-rule" style={{ paddingTop: 26 }}>
          {p.problem.map((t) => (
            <p key={t} className="pb-modal-p">
              {t}
            </p>
          ))}
        </div>

        <h2 className="pb-modal-lbl pb-case-h2 pb-rule" style={{ paddingTop: 34 }}>
          Décisions
        </h2>
        <div className="pb-rule" style={{ paddingTop: 8, display: "flex", flexDirection: "column" }}>
          {p.decisions.map((d, i) => (
            <div key={d.title} className="pb-modal-dec">
              <span className="pb-mono" style={{ fontSize: 11.5, color: "var(--pb-accent)", paddingTop: 7 }}>
                {pad(i)}
              </span>
              <div>
                <h3 className="pb-modal-dec-t">{d.title}</h3>
                <p className="pb-modal-dec-p">{d.text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="pb-modal-lbl pb-case-h2 pb-rule" style={{ paddingTop: 34 }}>
          Ce qui est en ligne
        </h2>
        <div className="pb-rule" style={{ paddingTop: 8 }}>
          <dl className="pb-modal-built">
            {p.built.map((b) => (
              <div key={b.label} className="pb-modal-built-row">
                <dt>{b.label}</dt>
                <dd>{b.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <h2 className="pb-modal-lbl pb-case-h2 pb-rule" style={{ paddingTop: 34 }}>
          Résultat
        </h2>
        <div className="pb-modal-prose pb-rule" style={{ paddingTop: 26 }}>
          {p.outcome.map((t) => (
            <p key={t} className="pb-modal-p">
              {t}
            </p>
          ))}

          {/* Deux sorties : la requête à retaper, et le site lui-même.
              L'une vérifie l'affirmation, l'autre vérifie le travail. */}
          <div className="pb-modal-links">
            {p.query && (
              <a
                className="pb-verify pb-label"
                href={`https://www.google.com/search?q=${encodeURIComponent(p.query)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i aria-hidden="true" />
                Vérifier « {p.query} » <Arrow dir="ne" />
              </a>
            )}
            {p.url && (
              <a className="pb-modal-visit pb-label" href={p.url} target="_blank" rel="noopener noreferrer">
                Ouvrir le site <Arrow dir="ne" />
              </a>
            )}
          </div>
        </div>
      </div>

      {p.proof && (
        <figure className="pb-modal-proof">
          <div className="pb-proof-shot">
            <Image
              src={p.proof.src}
              alt={`Capture d'écran, ${p.name}, ${p.metric}`}
              width={p.proof.w}
              height={p.proof.h}
              sizes="(max-width: 1120px) 100vw, 1050px"
            />
          </div>
          <figcaption className="pb-proof-cap pb-cap">{p.proof.caption}</figcaption>
        </figure>
      )}

      <div className="pb-case-cta">
        <h2 className="pb-d-s">Un projet du même genre&nbsp;?</h2>
        <p>
          Décrivez ce qui coince en trois questions. Je réponds sous 24&nbsp;h ouvrées, par la
          personne qui dessinera et codera le site.
        </p>
        <Link href="/contact" className="pb-btn-line">
          Parler de votre projet <Arrow dir="ne" />
        </Link>
      </div>

      <nav className="pb-case-nav" aria-label="Autres études de cas">
        <Link href={`/projets/${prev.slug}`} className="pb-case-nav-l">
          <span className="pb-cap">
            <Arrow dir="w" /> Projet précédent
          </span>
          <span className="pb-d-s">{prev.name}</span>
        </Link>
        <Link href={`/projets/${next.slug}`} className="pb-case-nav-l pb-case-nav-r">
          <span className="pb-cap">
            Projet suivant <Arrow dir="e" />
          </span>
          <span className="pb-d-s">{next.name}</span>
        </Link>
      </nav>
    </article>
  );
}
