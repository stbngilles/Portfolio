import Image from "next/image";
import { STUDIO } from "./data";
import { Lines } from "./Text";

/**
 * Qui fait le travail. Portrait pleine hauteur à gauche (scale au scroll),
 * texte à droite.
 */
export default function Studio() {
  return (
    <section id="studio" className="pb-studio">
      <div className="pb-studio-img">
        <Image
          src={STUDIO.img}
          alt={`Portrait de ${STUDIO.name}`}
          fill
          sizes="(max-width: 900px) 100vw, 46vw"
          style={{ objectFit: "cover", filter: "grayscale(1) contrast(1.04)" }}
          data-scale=""
        />
      </div>

      <div className="pb-studio-txt">
        <div className="pb-over" data-reveal="">Qui fait le travail</div>
        <Lines className="pb-d-l pb-studio-name" lines={[STUDIO.name + ".", "Une personne,", "pas une agence."]} muteFrom={1} />

        <div data-reveal-group="">
          {STUDIO.body.map((p) => (
            <p key={p} className="pb-studio-p">
              {p}
            </p>
          ))}
        </div>

        <dl className="pb-studio-facts" data-reveal-group="">
          {STUDIO.facts.map((f) => (
            <div key={f.lbl}>
              <dt className="pb-label">{f.lbl}</dt>
              <dd>{f.val}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
