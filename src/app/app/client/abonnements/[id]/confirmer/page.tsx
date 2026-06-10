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
import { confirmCancellation, reactivate } from "../../actions";

export default async function CancelStep3Page({
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
    redirect(`/app/client/abonnements/${id}/annuler`);
  }

  const effective =
    sub.cancelEffectiveAt?.toLocaleDateString("fr-BE") ?? "fin du mois";

  return (
    <DashboardShell
      eyebrow="Annulation · étape 3 sur 3"
      title="Vous êtes sûr ?"
      italic="On respecte votre choix."
      user={{ ...session.user, role }}
      nav={CLIENT_NAV}
    >
      <div
        className="mb-8 p-6 rounded-lg max-w-2xl"
        style={{
          background: "#FEF2F2",
          border: "1px solid #9F1239",
        }}
      >
        <p
          className="display"
          style={{
            fontSize: 22,
            letterSpacing: "-0.01em",
            color: "#9F1239",
            lineHeight: 1.3,
          }}
        >
          Ce qui va se passer si vous confirmez :
        </p>
        <ul
          className="mt-4 space-y-2"
          style={{ fontSize: 15, lineHeight: 1.6, color: "#7A0F2E" }}
        >
          <li>
            • Votre abonnement <strong>{sub.plan}</strong> sera actif jusqu'au{" "}
            <strong>{effective}</strong>.
          </li>
          <li>• Aucune facture ne vous sera émise après cette date.</li>
          <li>
            • Les prestations associées (maintenance, mises à jour, suivi SEO…)
            s'arrêteront ce jour-là.
          </li>
          <li>
            • Votre site reste en ligne — l'hébergement n'est pas affecté.
          </li>
          <li>
            • Vous pouvez reprendre un abonnement à tout moment depuis votre
            espace client.
          </li>
        </ul>
      </div>

      <SectionTitle
        eyebrow="Étape 3 sur 3"
        title="Dernière étape,"
        italic="votre confirmation."
      />

      <p
        className="mb-6 max-w-2xl"
        style={{ color: "var(--color-muted)", fontSize: 15, lineHeight: 1.6 }}
      >
        <strong>{sub.project.name}</strong> · {sub.plan} ·{" "}
        {formatPrice(sub.monthlyAmount)} / mois
      </p>

      <div className="flex flex-wrap gap-3 max-w-2xl">
        <form action={reactivate}>
          <input type="hidden" name="subscriptionId" value={sub.id} />
          <button type="submit" className="btn btn-primary">
            Finalement, je reste
          </button>
        </form>
        <Link
          href={`/app/client/abonnements/${sub.id}/contre-offre`}
          className="btn btn-ghost"
        >
          ← Revoir les alternatives
        </Link>
        <form action={confirmCancellation}>
          <input type="hidden" name="subscriptionId" value={sub.id} />
          <button
            type="submit"
            className="btn"
            style={{
              background: "#9F1239",
              color: "white",
              border: "1px solid #9F1239",
            }}
          >
            Oui, résilier définitivement
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
