import { requireRole } from "@/lib/auth-guard";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";

const CHECKLIST = [
  {
    eyebrow: "Réservation en ligne",
    title: "Pause de 15 minutes,",
    italic: "par défaut.",
    body: [
      "Aucun créneau ne peut s'enchaîner sans pause — sinon le client se retrouve avec deux rendez-vous chevauchés à la première minute de retard.",
      "Si le client demande 0 min, repassez par moi — il y a presque toujours un cas métier (kiné, photographe) qui justifie le tampon.",
    ],
  },
  {
    eyebrow: "Paiement en ligne (Stripe)",
    title: "Toujours préciser",
    italic: "le type de produit.",
    body: [
      "Abonnement, produit physique, produit numérique, service ponctuel : chaque cas implique un schéma de TVA et de comptabilité différent.",
      "Si livraison physique : prévoir aussi les zones, les frais et le délai. Sinon, le dev livrera un panier qui ne sait pas calculer le port.",
    ],
  },
  {
    eyebrow: "Multilingue",
    title: "Une langue,",
    italic: "= un site à 80 %.",
    body: [
      "Le prix « langue supplémentaire » n'est pas un ajout cosmétique : on duplique presque tout le contenu, on gère les URL et le SEO par langue.",
      "Toujours vérifier que le client a les traductions, sinon on doit les commander en option rédaction.",
    ],
  },
  {
    eyebrow: "Migration depuis ancien site",
    title: "Demander toujours",
    italic: "la techno + l'URL.",
    body: [
      "WordPress, Wix, Shopify, site statique : la difficulté varie de 1 à 10. Le devis sans cette info est faux.",
      "Pensez aux redirections 301 — si vous n'en parlez pas, on perd le référencement existant.",
    ],
  },
  {
    eyebrow: "Contenu",
    title: "Pas de contenu,",
    italic: "pas de site.",
    body: [
      "Tant que le client n'a pas livré logo + textes + photos, le projet ne part PAS au dev. Cochez-le explicitement dans l'onboarding.",
      "Si le client n'a rien : vendre directement la rédaction et une séance photo, on perd moins de temps qu'à attendre.",
    ],
  },
  {
    eyebrow: "Délais réalistes",
    title: "Minimum 4 semaines,",
    italic: "à partir du dépôt complet.",
    body: [
      "Ne jamais promettre « la semaine prochaine ». Le compteur démarre quand tout le contenu est là — pas à la signature.",
      "Si le client a une deadline absolue (salon, lancement), demandez une marge d'une semaine avant la date butoir.",
    ],
  },
  {
    eyebrow: "Sur-mesure / hors-norme",
    title: "Si vous hésitez,",
    italic: "cochez « sur-mesure ».",
    body: [
      "Une fonctionnalité originale (calculateur métier, espace membre, dashboard…) doit passer par moi pour estimation.",
      "Ne tentez jamais d'inventer un prix : on a perdu deux missions à cause de promesses non tenables.",
    ],
  },
  {
    eyebrow: "Récurrent mensuel",
    title: "Toujours proposer,",
    italic: "même si refusé.",
    body: [
      "Le récurrent est la santé du studio. Si le client refuse au début, repassez à la livraison.",
      "Sans maintenance, on n'est pas responsables des bugs après 30 jours — précisez-le dès la signature.",
    ],
  },
];

const ANTI_PATTERNS = [
  "Promettre une date précise sans avoir vu un seul asset.",
  "Cocher Stripe sans demander le type de produit.",
  "Vendre du multilingue sans vérifier la disponibilité des traductions.",
  "Accepter « on verra » comme réponse sur les fonctionnalités floues.",
  "Pousser le pack pub de lancement sur un client qui n'a pas de marge — ça brûle la relation.",
];

export default async function CommercialResourcesPage() {
  await requireRole("COMMERCIAL", "ADMIN");

  return (
    <DashboardShell
      eyebrow="Ressources de vente"
      title="La checklist du bon projet,"
      italic="à relire avant chaque signature."
      nav={COMMERCIAL_NAV}
    >
      <p className="serif-i mb-10 text-sm" style={{ color: "var(--color-muted)", maxWidth: 720 }}>
        Cette page n'existe pas pour vous former à coder. Elle existe pour
        verrouiller les pièges récurrents et vous éviter de signer un truc
        qu'on regrettera tous les deux trois mois plus tard.
      </p>

      <div className="grid gap-4 mb-14">
        {CHECKLIST.map((c, i) => (
          <article
            key={i}
            className="p-6"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 12,
            }}
          >
            <p
              className="mono uppercase mb-2"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "var(--color-accent)",
              }}
            >
              · {c.eyebrow}
            </p>
            <h3
              className="display mb-3"
              style={{ fontSize: 22, letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              {c.title}{" "}
              <em className="serif-i" style={{ color: "var(--color-accent)" }}>
                {c.italic}
              </em>
            </h3>
            <ul className="space-y-2">
              {c.body.map((b, j) => (
                <li
                  key={j}
                  className="text-sm"
                  style={{ color: "var(--color-ink-soft)", lineHeight: 1.55 }}
                >
                  · {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <SectionTitle
        eyebrow="À ne JAMAIS faire"
        title="Les anti-patterns,"
        italic="par expérience."
      />
      <div
        className="p-6"
        style={{
          background: "#FEE2E2",
          border: "1px solid #9F1239",
          borderRadius: 12,
        }}
      >
        <ul className="space-y-3">
          {ANTI_PATTERNS.map((a, i) => (
            <li
              key={i}
              className="text-sm"
              style={{ color: "#7B1024", lineHeight: 1.55 }}
            >
              ✗ {a}
            </li>
          ))}
        </ul>
      </div>
    </DashboardShell>
  );
}
