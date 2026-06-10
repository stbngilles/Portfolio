import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { CLIENT_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { acceptCounterOffer } from "../../actions";

interface Offer {
  key: string;
  label: string;
  description: string;
  cta: string;
}

const PAUSE_1M: Offer = {
  key: "PAUSE_1M",
  label: "Mettre en pause 1 mois",
  description:
    "Zéro prélèvement pendant un mois. Tout reprend automatiquement après — vous pouvez prolonger ou résilier à tout moment.",
  cta: "Je mets en pause 1 mois",
};
const PAUSE_3M: Offer = {
  key: "PAUSE_3M",
  label: "Mettre en pause 3 mois",
  description:
    "Trois mois de respiration, sans facture. On reprend exactement où vous étiez. Idéal pour les périodes creuses.",
  cta: "Je mets en pause 3 mois",
};
const DISCOUNT_3M: Offer = {
  key: "DISCOUNT_3M",
  label: "Bénéficier de -25 % pendant 3 mois",
  description:
    "Une remise immédiate appliquée à vos 3 prochaines factures. Si le service vous redonne satisfaction, on continue ensemble.",
  cta: "J'accepte la remise",
};
const CALL: Offer = {
  key: "CALL",
  label: "Parler à Gilles directement",
  description:
    "15 minutes en visio, sans engagement. Si quelque chose ne va pas dans la livraison ou le service, on veut comprendre — et corriger.",
  cta: "Je veux qu'on me rappelle",
};

function offersForReason(reason: string | null): Offer[] {
  switch (reason) {
    case "PRICE":
      return [DISCOUNT_3M, PAUSE_3M, PAUSE_1M];
    case "NO_NEED":
      return [PAUSE_3M, PAUSE_1M, DISCOUNT_3M];
    case "QUALITY":
      return [CALL, PAUSE_1M];
    default:
      return [DISCOUNT_3M, PAUSE_1M, PAUSE_3M, CALL];
  }
}

export default async function CancelStep2Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { session, role } = await requireRole("CLIENT", "ADMIN");
  const { id } = await params;

  const sub = await prisma.subscription.findUnique({
    where: { id },
    include: { project: { select: { name: true } } },
  });
  if (!sub || (role !== "ADMIN" && sub.clientId !== session.user.id)) {
    notFound();
  }
  if (sub.status !== "PENDING_CANCEL") {
    // L'utilisateur arrive ici sans avoir validé l'étape 1 — on redirige.
    redirect(`/app/client/abonnements/${id}/annuler`);
  }

  const offers = offersForReason(sub.cancelReason);

  return (
    <DashboardShell
      eyebrow="Annulation · étape 2 sur 3"
      title="Avant que vous partiez,"
      italic="on a peut-être mieux."
      user={{ ...session.user, role }}
      nav={CLIENT_NAV}
    >
      <p
        className="mb-8 max-w-2xl"
        style={{ color: "var(--color-muted)", fontSize: 16, lineHeight: 1.6 }}
      >
        Ce sont de vraies options, pas un piège pour vous garder. Choisissez ce
        qui vous arrange — ou continuez vers l'annulation si rien ne colle.
      </p>

      <SectionTitle
        eyebrow={`Étape 2 sur 3 · raison : ${
          sub.cancelReason ?? "—"
        }`}
        title="Trois alternatives"
        italic="possibles."
      />

      <div className="grid gap-4 max-w-2xl">
        {offers.map((o) => (
          <form key={o.key} action={acceptCounterOffer}>
            <input type="hidden" name="subscriptionId" value={sub.id} />
            <input type="hidden" name="offerType" value={o.key} />
            <div
              className="p-6"
              style={{
                background: "var(--color-paper)",
                border: "1px solid var(--color-line)",
                borderRadius: 12,
              }}
            >
              <p
                className="display"
                style={{
                  fontSize: 22,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                {o.label}
              </p>
              <p
                className="mt-2"
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--color-muted)",
                }}
              >
                {o.description}
              </p>
              <button type="submit" className="btn btn-primary mt-4">
                {o.cta}
              </button>
            </div>
          </form>
        ))}
      </div>

      <div
        className="mt-10 pt-6 max-w-2xl flex flex-wrap gap-3 items-center"
        style={{ borderTop: "1px solid var(--color-line)" }}
      >
        <p
          className="text-sm flex-1"
          style={{ color: "var(--color-subtle)" }}
        >
          Aucune de ces options ne vous convient ?
        </p>
        <Link
          href={`/app/client/abonnements/${sub.id}/confirmer`}
          className="btn btn-ghost text-sm"
        >
          Continuer vers l'annulation →
        </Link>
      </div>

      <p
        className="mt-6 text-sm"
        style={{ color: "var(--color-subtle)" }}
      >
        Votre abonnement <strong>{sub.plan}</strong> ({formatPrice(sub.monthlyAmount)} / mois) du projet{" "}
        <strong>{sub.project.name}</strong> reste actif jusqu'à votre confirmation finale.
      </p>
    </DashboardShell>
  );
}
