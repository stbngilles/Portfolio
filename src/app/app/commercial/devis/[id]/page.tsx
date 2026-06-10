import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";
import { formatPrice, COMMISSION_RATES } from "@/lib/pricing";
import {
  markQuoteSent,
  markQuoteSigned,
  markQuoteLost,
  convertQuoteToProject,
} from "../actions";

const STATUS_VISUAL: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: "Brouillon", color: "var(--color-subtle)", bg: "var(--color-bg)" },
  SENT: { label: "Envoyé", color: "#D4A857", bg: "#FFF8E1" },
  SIGNED: { label: "Signé", color: "#13A66A", bg: "#E6F5EC" },
  LOST: { label: "Perdu", color: "#9F1239", bg: "#FEE2E2" },
};

export default async function QuoteDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { lines: true, project: true },
  });
  if (!quote) notFound();
  if (role !== "ADMIN" && quote.commercialId !== session.user.id) {
    notFound(); // pas le sien
  }

  const vis = STATUS_VISUAL[quote.status];
  const oneShotComm = Math.round(
    (quote.totalOneShot - (quote.lines.find((l) => l.category === "LAUNCH_PACK")?.unitPrice ?? 0)) *
      COMMISSION_RATES.ONE_SHOT_SITE_AND_OPTIONS,
  );
  const launchComm = Math.round(
    (quote.lines.find((l) => l.category === "LAUNCH_PACK")?.unitPrice ?? 0) *
      COMMISSION_RATES.LAUNCH_PACK,
  );
  const recComm = Math.round(quote.totalRecurring * COMMISSION_RATES.RECURRING);

  const siteLines = quote.lines.filter((l) => l.category === "SITE");
  const optionLines = quote.lines.filter((l) => l.category === "OPTION");
  const launchLines = quote.lines.filter((l) => l.category === "LAUNCH_PACK");
  const recurringLines = quote.lines.filter((l) => l.category === "RECURRING");

  return (
    <DashboardShell
      eyebrow={quote.number}
      title={quote.clientName}
      italic={quote.clientCompany ? `· ${quote.clientCompany}` : undefined}
      user={{ ...session.user, role }}
      nav={COMMERCIAL_NAV}
    >
      {/* Bandeau de statut + actions */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 mb-10 flex-wrap"
        style={{
          background: vis.bg,
          border: `1px solid ${vis.color}`,
          borderRadius: 10,
        }}
      >
        <div>
          <p
            className="mono uppercase"
            style={{ fontSize: 10, letterSpacing: "0.14em", color: vis.color }}
          >
            Statut · {vis.label}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink)" }}>
            {quote.clientEmail}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {quote.status === "DRAFT" && (
            <form action={markQuoteSent}>
              <input type="hidden" name="id" value={quote.id} />
              <button type="submit" className="btn btn-accent" style={{ padding: "8px 16px", fontSize: 13 }}>
                Marquer comme envoyé →
              </button>
            </form>
          )}
          {quote.status === "SENT" && (
            <>
              <form action={markQuoteSigned}>
                <input type="hidden" name="id" value={quote.id} />
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                  Marquer signé ✓
                </button>
              </form>
              <form action={markQuoteLost}>
                <input type="hidden" name="id" value={quote.id} />
                <button type="submit" className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>
                  Marquer perdu
                </button>
              </form>
            </>
          )}
          {quote.status === "SIGNED" && !quote.project && (
            <form action={convertQuoteToProject}>
              <input type="hidden" name="id" value={quote.id} />
              <button
                type="submit"
                className="btn btn-accent"
                style={{ padding: "8px 16px", fontSize: 13 }}
                title="Crée le compte client, le projet avec ses 6 étapes, la facture d'acompte, l'abonnement récurrent et les commissions."
              >
                Convertir en projet →
              </button>
            </form>
          )}
          {quote.status === "SIGNED" && quote.project && (
            <Link
              href={`/app/admin/projects/${quote.project.id}`}
              className="btn btn-ghost"
              style={{ padding: "8px 16px", fontSize: 13 }}
            >
              Voir le projet →
            </Link>
          )}
        </div>
      </div>

      {/* Lignes */}
      <SectionTitle eyebrow="Détail du devis" title="Tout," italic="ligne par ligne." />

      <div
        className="mb-10"
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {siteLines.length > 0 && (
          <LineGroup title="Site" lines={siteLines} formatCell="oneshot" />
        )}
        {optionLines.length > 0 && (
          <LineGroup title="Options" lines={optionLines} formatCell="oneshot" />
        )}
        {launchLines.length > 0 && (
          <LineGroup
            title="Pack publicité de lancement"
            lines={launchLines}
            formatCell="oneshot"
          />
        )}
        {recurringLines.length > 0 && (
          <LineGroup
            title="Récurrent mensuel"
            lines={recurringLines}
            formatCell="recurring"
          />
        )}

        {/* Totaux */}
        <div
          className="px-5 py-5"
          style={{
            background: "var(--color-bg)",
            borderTop: "1px solid var(--color-line)",
          }}
        >
          <div className="flex justify-between items-baseline">
            <span className="mono uppercase" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
              TOTAL ONE-SHOT
            </span>
            <span
              className="display"
              style={{
                fontSize: 24,
                color: "var(--color-accent)",
                letterSpacing: "-0.02em",
              }}
            >
              {formatPrice(quote.totalOneShot)}
            </span>
          </div>
          {quote.totalRecurring > 0 && (
            <div className="flex justify-between items-baseline mt-2">
              <span
                className="mono uppercase"
                style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}
              >
                + RÉCURRENT
              </span>
              <span style={{ fontWeight: 500 }}>
                {formatPrice(quote.totalRecurring)}{" "}
                <span className="serif-i" style={{ color: "var(--color-muted)" }}>
                  /mois
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Commissions */}
      {role !== "CLIENT" && (
        <>
          <SectionTitle eyebrow="Vos commissions" title="À la signature," italic="et après." />
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            <CommissionCard
              label="One-shot (20 %)"
              value={oneShotComm}
              note="site + options"
            />
            {launchComm > 0 && (
              <CommissionCard
                label="Pack lancement (15 %)"
                value={launchComm}
                note="versé à la signature"
              />
            )}
            <CommissionCard
              label="Récurrent (15 %)"
              value={recComm}
              note="par mois, tant que le client reste"
              accent
            />
          </div>
        </>
      )}

      {quote.notes && (
        <>
          <SectionTitle eyebrow="Notes internes" title="Ce qu'il faut" italic="se rappeler." />
          <div
            className="p-5 mb-10 serif-i"
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 10,
              fontSize: 15,
              color: "var(--color-ink-soft)",
            }}
          >
            « {quote.notes} »
          </div>
        </>
      )}

      <Link
        href="/app/commercial/devis"
        className="text-sm no-underline"
        style={{ color: "var(--color-muted)" }}
      >
        ← Retour aux devis
      </Link>
    </DashboardShell>
  );
}

function LineGroup({
  title,
  lines,
  formatCell,
}: {
  title: string;
  lines: { id: string; label: string; quantity: number; unitPrice: number }[];
  formatCell: "oneshot" | "recurring";
}) {
  return (
    <div style={{ borderTop: "1px solid var(--color-line)" }}>
      <p
        className="mono uppercase px-5 pt-4 pb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
      >
        · {title}
      </p>
      {lines.map((l) => (
        <div
          key={l.id}
          className="flex justify-between items-center px-5 py-3"
          style={{ borderTop: "1px solid var(--color-line)" }}
        >
          <div>
            <p>{l.label}</p>
            {l.quantity > 1 && (
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                {l.quantity} × {formatPrice(l.unitPrice)}
              </p>
            )}
          </div>
          <p className="mono">
            {formatPrice(l.unitPrice * l.quantity)}
            {formatCell === "recurring" && (
              <span className="serif-i ml-1 text-xs" style={{ color: "var(--color-muted)" }}>
                /mois
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

function CommissionCard({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: number;
  note: string;
  accent?: boolean;
}) {
  return (
    <div
      className="p-5"
      style={{
        background: accent ? "var(--color-accent-soft)" : "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 10,
      }}
    >
      <p
        className="mono uppercase mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
      >
        {label}
      </p>
      <p
        className="display"
        style={{
          fontSize: 22,
          letterSpacing: "-0.02em",
          color: accent ? "var(--color-accent-ink)" : "var(--color-ink)",
          lineHeight: 1,
        }}
      >
        {formatPrice(value)}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
        {note}
      </p>
    </div>
  );
}
