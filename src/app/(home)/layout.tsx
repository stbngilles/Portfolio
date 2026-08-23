import "./home.css";
import Ink from "@/components/home/Ink";
import Motion from "@/components/home/Motion";

/**
 * Chrome de la homepage. Séparée de `(marketing)/layout.tsx` : la home a sa
 * propre direction artistique, son header, son footer et son moteur de
 * mouvement (smooth scroll + ScrollTrigger, voir `Motion`).
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb">
      <Motion />
      <Ink />
      {children}
    </div>
  );
}
