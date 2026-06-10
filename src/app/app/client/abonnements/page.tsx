import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { CLIENT_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { reactivate } from "./actions";

const STATUS_VISUAL: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  ACTIVE: { label: "Actif", color: "#0D6E46", bg: "#F0FAF5" },
  PAUSED: { label: "En pause", color: "#8A6914", bg: "#FFF8E1" },
  PENDING_CANCEL: {
    label: "Annulation en cours",
    color: "#9F1239",
    bg: "#FEF2F2",
  },
  CANCELLED: { label: "Résilié", color: "#6B7280", bg: "#F3F4F6" },
};

const OFFER_FLASH: Record<string, string> = {
  DISCOUNT_3M: "Parfait. Une remise de 25 % est appliquée pour les 3 prochains mois.",
  PAUSE_1M: "C'est noté. Votre abonnement est en pause pour 1 mois.",
  PAUSE_3M: "C'est noté. Votre abonnement est en pause pour 3 mois.",
  CALL: "Reçu. On vous rappelle dans les 48h pour comprendre ce qui ne va pas.",
};

export default async function ClientSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ offer?: string; cancelled?: string }>;
}) {
  const { session, role } = await requireRole("CLIENT", "ADMIN");
  const sp = await searchParams;

  const subs = await prisma.subscription.findMany({
    where: { clientId: session.user.id },
    orderBy: [{ status: "asc" }, { startedAt: "desc" }],
    include: {
      project: { select: { id: true, name: true } },
    },
  });

  return (
    <DashboardShell
      eyebrow="Mes abonnements"
      title="Vos services récurrents,"
      italic="en toute transparence."
      user={{ ...session.user, role }}
      nav={CLIENT_NAV}
    >
      {sp.offer && OFFER_FLASH[sp.offer] && (
        <div
          className="mb-6 p-4 rounded-lg"
          style={{
            background: "#F0FAF5",
            border: "1px solid #13A66A",
            color: "#0D6E46",
          }}
        >
          {OFFER_FLASH[sp.offer]}
        </div>
      )}
      {sp.cancelled && (
        <div
          className="mb-6 p-4 rounded-lg"
          style={{
            background: "#FEF2F2",
            border: "1px solid #9F1239",
            color: "#9F1239",
          }}
        >
          Votre abonnement a bien été résilié. Il restera actif jusqu'à la fin
          de la période en cours.
        </div>
      )}

      <SectionTitle
        eyebrow="Vos abonnements"
        title="Ce qui tourne,"
        italic="mois après mois."
      />

      {subs.length === 0 ? (
        <div
          className="p-10 text-center"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p
            className="serif-i"
            style={{ fontSize: 20, color: "var(--color-muted)" }}
          >
            Vous n'avez aucun abonnement en cours.
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--color-subtle)" }}>
            Une fois votre site livré, vous pourrez activer une maintenance ou
            un suivi SEO depuis ici.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {subs.map((s) => {
            const v = STATUS_VISUAL[s.status] ?? STATUS_VISUAL.ACTIVE;
            const canCancel = s.status === "ACTIVE" || s.status === "PAUSED";
            const isPending = s.status === "PENDING_CANCEL";

            return (
              <div
                key={s.id}
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  padding: "24px 28px",
                }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full mono uppercase"
                        style={{
                          background: v.bg,
                          color: v.color,
                          fontSize: 10,
                          letterSpacing: "0.14em",
                        }}
                      >
                        {v.label}
                      </span>
                      <span
                        className="mono"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          color: "var(--color-subtle)",
                        }}
                      >
                        depuis le {s.startedAt.toLocaleDateString("fr-BE")}
                      </span>
                    </div>
                    <p
                      className="display"
                      style={{
                        fontSize: 22,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                      }}
                    >
                      {s.plan}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Projet · {s.project.name}
                    </p>

                    {isPending && s.cancelEffectiveAt && (
                      <p
                        className="text-sm mt-3 serif-i"
                        style={{ color: "#9F1239" }}
                      >
                        Sera résilié le{" "}
                        {s.cancelEffectiveAt.toLocaleDateString("fr-BE")} — vous
                        pouvez encore changer d'avis.
                      </p>
                    )}
                    {s.status === "PAUSED" && s.pausedUntil && (
                      <p
                        className="text-sm mt-3 serif-i"
                        style={{ color: "#8A6914" }}
                      >
                        Reprise prévue le{" "}
                        {s.pausedUntil.toLocaleDateString("fr-BE")}.
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p
                      className="display"
                      style={{
                        fontSize: 26,
                        color: "var(--color-accent)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatPrice(s.monthlyAmount)}
                    </p>
                    <p
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "var(--color-subtle)",
                        letterSpacing: "0.14em",
                      }}
                    >
                      / MOIS
                    </p>
                  </div>
                </div>

                {(canCancel || isPending) && (
                  <div
                    className="mt-5 pt-5 flex flex-wrap gap-3"
                    style={{ borderTop: "1px solid var(--color-line)" }}
                  >
                    {canCancel && (
                      <Link
                        href={`/app/client/abonnements/${s.id}/annuler`}
                        className="btn btn-ghost text-sm"
                      >
                        Arrêter cet abonnement
                      </Link>
                    )}
                    {isPending && (
                      <>
                        <Link
                          href={`/app/client/abonnements/${s.id}/contre-offre`}
                          className="btn btn-ghost text-sm"
                        >
                          Voir les alternatives
                        </Link>
                        <form action={reactivate}>
                          <input
                            type="hidden"
                            name="subscriptionId"
                            value={s.id}
                          />
                          <button
                            type="submit"
                            className="btn btn-primary text-sm"
                          >
                            Finalement, je reste
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
