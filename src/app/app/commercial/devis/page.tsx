import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";

const STATUS_VISUAL: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "var(--color-subtle)" },
  SENT: { label: "Envoyé", color: "#D4A857" },
  SIGNED: { label: "Signé", color: "#13A66A" },
  LOST: { label: "Perdu", color: "#9F1239" },
};

export default async function CommercialDevisPage() {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");

  const quotes = await prisma.quote.findMany({
    where: role === "ADMIN" ? {} : { commercialId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <DashboardShell
      eyebrow="Calculateur de devis"
      title="Vos devis,"
      italic="et leur sort."
      user={{ ...session.user, role }}
      nav={COMMERCIAL_NAV}
    >
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <SectionTitle
          eyebrow={`${quotes.length} devis`}
          title="Historique,"
          italic="du plus récent."
        />
        <Link
          href="/app/commercial/devis/nouveau"
          className="btn btn-primary"
        >
          + Nouveau devis
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div
          className="p-12 text-center"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p
            className="serif-i"
            style={{ fontSize: 22, color: "var(--color-muted)" }}
          >
            Aucun devis pour le moment.
          </p>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-subtle)" }}
          >
            Cliquez sur « Nouveau devis » pour configurer votre première offre.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {quotes.map((q) => {
            const vis = STATUS_VISUAL[q.status] ?? STATUS_VISUAL.DRAFT;
            return (
              <Link
                key={q.id}
                href={`/app/commercial/devis/${q.id}`}
                className="block no-underline transition"
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  color: "var(--color-ink)",
                }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: vis.color }}
                      />
                      <span
                        className="mono uppercase"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          color: "var(--color-subtle)",
                        }}
                      >
                        {q.number} · {vis.label}
                      </span>
                    </div>
                    <p
                      className="display"
                      style={{
                        fontSize: 20,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                      }}
                    >
                      {q.clientName}
                      {q.clientCompany && (
                        <span
                          className="serif-i ml-2"
                          style={{ color: "var(--color-muted)", fontSize: 16 }}
                        >
                          · {q.clientCompany}
                        </span>
                      )}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {q.clientEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="display"
                      style={{
                        fontSize: 22,
                        color: "var(--color-accent)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatPrice(q.totalOneShot)}
                    </p>
                    {q.totalRecurring > 0 && (
                      <p
                        className="mono"
                        style={{
                          fontSize: 10,
                          color: "var(--color-subtle)",
                          letterSpacing: "0.14em",
                        }}
                      >
                        + {formatPrice(q.totalRecurring)}/MOIS
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
