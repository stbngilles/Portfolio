import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { CLIENT_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { requestCancellation } from "../../actions";

const REASONS: { key: string; label: string; hint: string }[] = [
  {
    key: "PRICE",
    label: "C'est trop cher pour moi en ce moment",
    hint: "On peut en parler — on a souvent une solution.",
  },
  {
    key: "NO_NEED",
    label: "Je n'en ai plus l'utilité",
    hint: "Saisonnier, projet en pause, autre priorité…",
  },
  {
    key: "QUALITY",
    label: "Le service ne me convient pas",
    hint: "C'est précieux à savoir, vraiment.",
  },
  {
    key: "OTHER",
    label: "Autre raison",
    hint: "Dites-nous en quelques mots, c'est anonyme côté équipe.",
  },
];

export default async function CancelStep1Page({
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
  if (sub.status === "CANCELLED") {
    notFound();
  }

  return (
    <DashboardShell
      eyebrow="Annulation · étape 1 sur 3"
      title="Pourquoi voulez-vous"
      italic="partir ?"
      user={{ ...session.user, role }}
      nav={CLIENT_NAV}
    >
      <p
        className="mb-8 max-w-2xl"
        style={{ color: "var(--color-muted)", fontSize: 16, lineHeight: 1.6 }}
      >
        Vous pouvez arrêter quand vous voulez. On vous demande la raison pour
        deux choses : voir si on peut faire mieux, et apprendre. Pas pour vous
        retenir contre votre gré.
      </p>

      <div
        className="mb-8 p-5 rounded-lg"
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
        }}
      >
        <p
          className="mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--color-subtle)",
          }}
        >
          Abonnement concerné
        </p>
        <p
          className="display mt-1"
          style={{ fontSize: 20, letterSpacing: "-0.01em" }}
        >
          {sub.plan} — {formatPrice(sub.monthlyAmount)} / mois
        </p>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-muted)" }}
        >
          Projet : {sub.project.name}
        </p>
      </div>

      <SectionTitle
        eyebrow="Étape 1 sur 3"
        title="Choisissez la raison"
        italic="la plus juste."
      />

      <form action={requestCancellation} className="grid gap-3 max-w-2xl">
        <input type="hidden" name="subscriptionId" value={sub.id} />

        {REASONS.map((r, i) => (
          <label
            key={r.key}
            className="flex items-start gap-4 p-5 cursor-pointer transition"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 12,
            }}
          >
            <input
              type="radio"
              name="reason"
              value={r.key}
              required
              defaultChecked={i === 0}
              className="mt-1"
            />
            <div>
              <p className="display" style={{ fontSize: 16, lineHeight: 1.3 }}>
                {r.label}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-subtle)" }}
              >
                {r.hint}
              </p>
            </div>
          </label>
        ))}

        <div className="mt-3">
          <label
            className="mono uppercase block mb-2"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "var(--color-subtle)",
            }}
          >
            Quelques mots (optionnel)
          </label>
          <textarea
            name="reasonText"
            rows={3}
            placeholder="Ce qui vous a poussé à prendre cette décision…"
            className="w-full p-3 rounded-lg"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              fontFamily: "inherit",
              fontSize: 14,
            }}
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <Link href="/app/client/abonnements" className="btn btn-ghost">
            Finalement non, je reste
          </Link>
          <button type="submit" className="btn btn-primary">
            Continuer →
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}
