import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/home/Logo";
import { ChecklistGate, ChecklistOpen } from "@/components/home/Checklist";
import { RESSOURCES, getRessource } from "@/components/home/ressources";
import { IDENTITE } from "@/components/home/legal";
import { isValidToken } from "./token";

/**
 * `/ressources/<slug>`, le lien donné sous une vidéo YouTube. Une entrée
 * de `ressources.ts` par vidéo.
 *
 * Pleine largeur, comme la home : sans lien, le titre et le sommaire à
 * gauche, le formulaire à droite ; avec le lien, la liste et un rail qui
 * tient le score et les parties. Pas de menu, une seule chose à faire. Le
 * logo, en revanche, ramène à l'accueil : ce visiteur vient chercher un
 * document, pas une offre, et il doit pouvoir voir qui l'a écrit.
 *
 * Sans lien : le formulaire, la ressource part par e-mail. Avec le lien
 * signé de l'e-mail (`?t=`) : la version à cocher. Voir `actions.ts`.
 *
 * `noindex` et hors sitemap : derrière le formulaire, un moteur ne lit
 * qu'un titre et trois champs, la définition d'une page mince.
 */

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return RESSOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = getRessource((await params).slug);
  if (!r) return {};
  return {
    title: { absolute: `${r.title} | Pixelbrute` },
    description: r.description,
    robots: { index: false, follow: true },
  };
}

export default async function RessourcePage({ params, searchParams }: Props) {
  const r = getRessource((await params).slug);
  if (!r) notFound();
  const { t } = await searchParams;
  const open = isValidToken(r.slug, t);

  return (
    <main className="pb-ck">
      <div className="pb-ck-top">
        <Link href="/" className="pb-logo" aria-label="Pixelbrute, accueil">
          <Logo idSuffix="ck" />
        </Link>
        <span className="pb-cap">Sites web pour PME et indépendants</span>
      </div>

      {open ? (
        <ChecklistOpen slug={r.slug} token={t} title={r.title} sections={r.sections} bands={r.bands} />
      ) : (
        <div className="pb-ck-gatewrap">
          <div className="pb-ck-gate-hero">
            <div className="pb-over">{r.over}</div>
            <h1 className="pb-ck-h1">
              {r.title} <span className="pb-mute">{r.titleEnd}</span>
            </h1>
            {r.lede.map((l) => (
              <p key={l} className="pb-ck-lede">
                {l}
              </p>
            ))}
          </div>

          <div className="pb-ck-gate-r">
            <ChecklistGate slug={r.slug} expired={Boolean(t)} />
          </div>

          <ol className="pb-ck-toc" aria-label="Ce qu'il y a dedans">
            {r.sections.map((s, i) => (
              <li key={s.title}>
                <span className="pb-ck-toc-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="pb-ck-toc-t">{s.title}</span>
                <span className="pb-cap">
                  {s.items.length} point{s.items.length > 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <footer className="pb-ck-foot pb-cap">
        <span>
          © 2026 Pixelbrute · {IDENTITE.nom} · {IDENTITE.ville}, province de Liège
        </span>
        <span className="pb-foot-legal">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </span>
      </footer>
    </main>
  );
}
