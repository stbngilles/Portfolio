import Image from "next/image";
import type { GuideBlock } from "./guides";

/**
 * Rendu d'un guide. Les blocs sont typés dans `guides.ts` : la rédaction ne
 * touche jamais au balisage, et le balisage ne peut pas produire une
 * hiérarchie de titres incohérente — un `h3` ne peut apparaître que là où
 * l'auteur a écrit `kind: "h3"`.
 *
 * Le `key` est l'index : les blocs d'un guide ne sont ni réordonnés ni
 * filtrés à l'exécution, la liste est figée à la compilation.
 */
export default function GuideBody({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="pb-gd-body">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h2":
            return (
              <h2 key={i} className="pb-gd-h2">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="pb-gd-h3">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="pb-gd-p">
                {b.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="pb-gd-ul">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="pb-gd-steps">
                {b.items.map((it, j) => (
                  <li key={it.title}>
                    <span className="pb-mono pb-gd-step-n">{String(j + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="pb-gd-step-t">{it.title}</h3>
                      <p className="pb-gd-step-p">{it.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            );
          case "note":
            return (
              <aside key={i} className="pb-gd-note">
                <span className="pb-label pb-gd-note-l">À retenir</span>
                <p>{b.text}</p>
              </aside>
            );
          case "proof":
            return (
              <figure key={i} className="pb-gd-proof">
                <div className="pb-proof-shot">
                  <Image
                    src={b.src}
                    alt={b.caption}
                    width={b.w}
                    height={b.h}
                    sizes="(max-width: 900px) 100vw, 760px"
                  />
                </div>
                <figcaption className="pb-proof-cap pb-cap">{b.caption}</figcaption>
              </figure>
            );
        }
      })}
    </div>
  );
}
