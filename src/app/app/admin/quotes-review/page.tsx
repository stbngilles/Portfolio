import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { approveQuoteReview } from "@/app/app/commercial/devis/actions";

export default async function QuotesReviewPage() {
  await requireRole("ADMIN");

  const pending = await prisma.quote.findMany({
    where: { needsAdminReview: true, adminReviewedAt: null },
    orderBy: { createdAt: "asc" },
    include: {
      lines: true,
    },
  });

  const recent = await prisma.quote.findMany({
    where: { needsAdminReview: true, adminReviewedAt: { not: null } },
    orderBy: { adminReviewedAt: "desc" },
    take: 10,
  });

  return (
    <DashboardShell
      eyebrow="Revue admin"
      title="Les devis sur-mesure,"
      italic="à valider avant envoi."
      nav={ADMIN_NAV}
    >
      <SectionTitle
        eyebrow={`${pending.length} en attente`}
        title="À trancher,"
        italic="d'abord."
      />

      {pending.length === 0 ? (
        <div
          className="p-10 text-center mb-12"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="serif-i" style={{ fontSize: 22, color: "var(--color-muted)" }}>
            Aucun devis sur-mesure en attente.
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--color-subtle)" }}>
            Tant qu'un commercial n'a pas coché « sur-mesure », il peut envoyer
            directement.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 mb-12">
          {pending.map((q) => (
            <article
              key={q.id}
              className="p-6"
              style={{
                background: "#FFF8E1",
                border: "1px solid #D4A857",
                borderRadius: 12,
              }}
            >
              <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p
                    className="mono uppercase mb-1"
                    style={{ fontSize: 10, letterSpacing: "0.14em", color: "#8A6914" }}
                  >
                    · {q.number}
                  </p>
                  <Link
                    href={`/app/commercial/devis/${q.id}`}
                    className="display no-underline"
                    style={{ fontSize: 22, letterSpacing: "-0.02em", color: "var(--color-ink)" }}
                  >
                    {q.clientCompany ?? q.clientName}
                  </Link>
                  <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                    {q.clientName} · {q.clientEmail}
                  </p>
                </div>
                <p
                  className="display"
                  style={{ fontSize: 22, color: "var(--color-accent)", letterSpacing: "-0.02em" }}
                >
                  {formatPrice(q.totalOneShot)}
                </p>
              </div>

              <ul className="mb-4 space-y-1">
                {q.lines.map((l) => (
                  <li
                    key={l.id}
                    className="text-sm"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    · {l.label}
                    {l.quantity > 1 && ` × ${l.quantity}`} —{" "}
                    {formatPrice(l.unitPrice * l.quantity)}
                    {l.isRecurring && " /mois"}
                  </li>
                ))}
              </ul>

              {q.notes && (
                <p
                  className="serif-i p-3 mb-4 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: 6,
                    color: "var(--color-ink-soft)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  « {q.notes} »
                </p>
              )}

              <form action={approveQuoteReview} className="grid gap-3">
                <input type="hidden" name="id" value={q.id} />
                <label className="block">
                  <span
                    className="mono uppercase block mb-2"
                    style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}
                  >
                    Note interne (optionnel) — coût dev suggéré, contraintes…
                  </span>
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="ex. coût dev ≤ 1 200 €, deadline 6 sem. min."
                    className="w-full px-3 py-2 outline-none"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 6,
                      fontSize: 14,
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </label>
                <button type="submit" className="btn btn-primary justify-self-start">
                  Valider — le commercial peut l'envoyer ✓
                </button>
              </form>
            </article>
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <>
          <SectionTitle eyebrow="Historique" title="Devis validés," italic="récemment." />
          <div className="grid gap-2">
            {recent.map((q) => (
              <Link
                key={q.id}
                href={`/app/commercial/devis/${q.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 no-underline"
                style={{
                  background: "var(--color-accent-soft)",
                  border: "1px solid var(--color-accent)",
                  borderRadius: 8,
                  color: "var(--color-ink)",
                }}
              >
                <div>
                  <span style={{ fontWeight: 500 }}>{q.number}</span>
                  <span style={{ color: "var(--color-muted)", marginLeft: 8 }}>
                    {q.clientCompany ?? q.clientName}
                  </span>
                </div>
                <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                  {formatPrice(q.totalOneShot)} ·{" "}
                  {q.adminReviewedAt?.toLocaleDateString("fr-BE")}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
