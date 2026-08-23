import Link from "next/link";
import Arrow from "./Arrow";
import Marquee from "./Marquee";
import { AVAILABILITY } from "./data";
import { Lines } from "./Text";

/**
 * Dernier écran, bleu profond : un titre immense, une seule action, et
 * l'adresse qui défile en bas.
 */
export default function FinalCta() {
  return (
    <section id="contact" className="pb-final pb-dark">
      <div className="pb-final-glow" aria-hidden="true">
        <div
          style={{
            background:
              "radial-gradient(44% 40% at 26% 28%, #3d63f5 0%, rgba(61,99,245,0) 62%), radial-gradient(38% 34% at 82% 22%, #6e8cff 0%, rgba(110,140,255,0) 58%), radial-gradient(50% 46% at 62% 78%, #081444 0%, rgba(8,20,68,0) 62%)",
            animation: "pb-drift 26s ease-in-out infinite alternate",
            filter: "blur(24px)",
          }}
        />
        <div
          style={{
            background:
              "radial-gradient(42% 40% at 14% 80%, #050d2b 0%, rgba(5,13,43,0) 64%), radial-gradient(36% 32% at 92% 60%, #1f3fbf 0%, rgba(31,63,191,0) 60%)",
            animation: "pb-drift2 34s ease-in-out infinite alternate",
            filter: "blur(30px)",
          }}
        />
      </div>

      <div className="pb-final-inner">
        {AVAILABILITY && (
          <div className="pb-final-slot" data-reveal="">
            <span className="pb-label pb-inked" data-tone="light">
              {AVAILABILITY} · Liège
            </span>
          </div>
        )}

        <Lines as="h2" className="pb-d-xl pb-final-h" lines={["On en parle", "une demi-heure\u00a0?"]} />

        <div className="pb-final-acts" data-reveal-group="">
          <Link href="/contact" className="pb-btn-paper">
            Parler de votre projet <Arrow dir="ne" />
          </Link>
          <p className="pb-final-p">
            Assez pour savoir si je peux aider — et pour que vous sachiez quoi faire, même si ce n&apos;est pas avec moi.
          </p>
        </div>
      </div>

      <a href="mailto:contact@pixelbrute.be" className="pb-final-mail" aria-label="Écrire à contact@pixelbrute.be">
        <Marquee tone="paper" items={["contact@pixelbrute.be", "+32 492 20 02 75", "contact@pixelbrute.be", "+32 492 20 02 75"]} />
      </a>
    </section>
  );
}
