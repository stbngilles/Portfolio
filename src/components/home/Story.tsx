import Image from "next/image";
import type { Chapter } from "./data";

/**
 * Le récit en images d'un dossier : un titre, deux lignes, une ou deux
 * grandes captures, et on recommence. Le texte reste court parce que la
 * capture fait le travail ; c'est l'inverse des sections « Décisions » et
 * « Ce qui est en ligne », qui viennent après pour qui veut lire.
 *
 * Partagé entre la page (`CaseStudy`, titres en `h2`) et la modale
 * (`ProjectModal`, titres en `h3`, le nom du projet y étant déjà un `h2`).
 */
export default function Story({
  name,
  story,
  heading,
}: {
  name: string;
  story: Chapter[];
  heading: "h2" | "h3";
}) {
  const H = heading;
  return (
    <div className="pb-story">
      {story.map((c) => {
        const layout = c.layout ?? "one";
        /* Deux colonnes sur grand écran : chaque image fait la moitié de la
           colonne de lecture. Sinon, toute la colonne. */
        const sizes =
          layout === "two"
            ? "(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 520px"
            : layout === "phones"
              ? "(max-width: 720px) 50vw, 300px"
              : layout === "narrow"
                ? "(max-width: 720px) 100vw, 560px"
                : "(max-width: 1120px) 100vw, 1050px";
        return (
          <section key={c.title} className="pb-story-ch">
            <div className="pb-story-txt">
              <H className="pb-story-t">{c.title}</H>
              {c.text.map((t) => (
                <p key={t} className="pb-story-p">
                  {t}
                </p>
              ))}
            </div>
            <div className="pb-story-imgs" data-layout={layout}>
              {c.images.map((g) => (
                <figure key={g.src} className="pb-story-shot">
                  <Image src={g.src} alt={`${name}, ${g.caption}`} width={g.w} height={g.h} sizes={sizes} />
                </figure>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
