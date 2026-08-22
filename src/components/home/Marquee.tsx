/**
 * Bande défilante. Même contenu dupliqué deux fois pour une boucle continue ;
 * la seconde copie est cachée aux lecteurs d'écran.
 */
export default function Marquee({ items, tone }: { items: string[]; tone?: "ink" | "paper" }) {
  const row = (hidden?: boolean) => (
    <div className="pb-marquee-row" aria-hidden={hidden ? "true" : undefined}>
      {items.map((t, i) => (
        <span key={i}>
          {t}
          <i aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="pb-marquee" data-tone={tone}>
      <div className="pb-marquee-track">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
