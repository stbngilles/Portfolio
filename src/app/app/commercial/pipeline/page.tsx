import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { COMMERCIAL_NAV } from "@/lib/platform-nav";
import { formatPrice } from "@/lib/pricing";
import { advanceQuoteStatus } from "./actions";
import { QUOTE_TRANSITIONS, QUOTE_STATUS_LABEL } from "./pipeline-config";

type ColKey =
  | "DRAFT"
  | "SENT"
  | "SIGNED_AWAITING_DEPOSIT"
  | "COLLECTING_ASSETS"
  | "READY_FOR_DEV"
  | "SIGNED"
  | "LOST";

function quoteColumn(status: string): ColKey {
  if (status === "SIGNED_AWAITING_DEPOSIT") return "SIGNED_AWAITING_DEPOSIT";
  if (status === "COLLECTING_ASSETS") return "COLLECTING_ASSETS";
  if (status === "READY_FOR_DEV") return "READY_FOR_DEV";
  if (status === "SIGNED") return "SIGNED";
  if (status === "SENT") return "SENT";
  if (status === "LOST") return "LOST";
  return "DRAFT";
}

function projectColumn(status: string): ColKey {
  if (status === "SIGNED_DEPOSIT") return "SIGNED_AWAITING_DEPOSIT";
  if (status === "ONBOARDING" || status === "COLLECTING_ASSETS") return "COLLECTING_ASSETS";
  if (status === "READY_FOR_DEV") return "READY_FOR_DEV";
  return "SIGNED";
}

const COLUMNS: { key: ColKey; label: string; hint: string; nextLabel?: string }[] = [
  { key: "DRAFT",                    label: "Brouillon",       hint: "à finaliser",         nextLabel: "Envoyer →" },
  { key: "SENT",                     label: "Devis envoyé",    hint: "en attente client",   nextLabel: "Signé ?" },
  { key: "SIGNED_AWAITING_DEPOSIT",  label: "Signé — Acompte", hint: "en attente paiement", nextLabel: "Acompte reçu →" },
  { key: "COLLECTING_ASSETS",        label: "Collecte contenu",hint: "le client envoie",    nextLabel: "Contenu reçu →" },
  { key: "READY_FOR_DEV",            label: "Prêt pour le dev",hint: "dans le pool" },
  { key: "SIGNED",                   label: "En production",   hint: "le dev bosse" },
];

const COL_STYLE: Record<ColKey, { border: string; headBg: string; ink: string }> = {
  DRAFT:                   { border: "var(--color-line)",  headBg: "var(--color-bg)",       ink: "var(--color-subtle)" },
  SENT:                    { border: "#D4A857",             headBg: "#FFFBEF",               ink: "#8A6914" },
  SIGNED_AWAITING_DEPOSIT: { border: "#D4A857",             headBg: "#FFFBEF",               ink: "#8A6914" },
  COLLECTING_ASSETS:       { border: "var(--color-accent)", headBg: "var(--color-accent-soft)", ink: "var(--color-accent-ink)" },
  READY_FOR_DEV:           { border: "#13A66A",             headBg: "#E6F5EC",               ink: "#0D6E46" },
  SIGNED:                  { border: "var(--color-line)",   headBg: "var(--color-paper)",    ink: "var(--color-ink)" },
  LOST:                    { border: "#9F1239",             headBg: "#FEE2E2",               ink: "#7B1024" },
};

type Card = {
  id: string;
  quoteId?: string; // présent seulement si c'est un devis (pas encore projet)
  href: string;
  title: string;
  subtitle: string;
  amount: number;
  col: ColKey;
  currentStatus?: string;
};

export default async function CommercialPipelinePage() {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");

  const isAdmin = role === "ADMIN";
  const filter = isAdmin ? {} : { commercialId: session.user.id };

  const [quotes, projects] = await Promise.all([
    prisma.quote.findMany({
      where: { ...filter, project: null },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        number: true,
        clientName: true,
        clientCompany: true,
        status: true,
        totalOneShot: true,
      },
    }),
    prisma.project.findMany({
      where: isAdmin ? {} : { commercialId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        client: { select: { name: true, email: true } },
        quote: { select: { number: true, totalOneShot: true } },
      },
    }),
  ]);

  const cards: Card[] = [
    ...quotes.map<Card>((q) => ({
      id: `q-${q.id}`,
      quoteId: q.id,
      href: `/app/commercial/devis/${q.id}`,
      title: q.clientCompany || q.clientName,
      subtitle: q.number,
      amount: q.totalOneShot,
      col: quoteColumn(q.status),
      currentStatus: q.status,
    })),
    ...projects.map<Card>((p) => ({
      id: `p-${p.id}`,
      href: isAdmin ? `/app/admin/projects/${p.id}` : `/app/commercial/devis`,
      title: p.name,
      subtitle: `${p.quote?.number ?? "—"} · ${p.client.name ?? p.client.email}`,
      amount: p.quote?.totalOneShot ?? 0,
      col: projectColumn(p.status),
    })),
  ];

  const byCol: Record<ColKey, Card[]> = {
    DRAFT: [], SENT: [], SIGNED_AWAITING_DEPOSIT: [],
    COLLECTING_ASSETS: [], READY_FOR_DEV: [], SIGNED: [], LOST: [],
  };
  for (const c of cards) byCol[c.col].push(c);

  const totalPipeline = cards.reduce((s, c) => s + c.amount, 0);

  return (
    <DashboardShell
      eyebrow={isAdmin ? "Pipeline global" : "Mon pipeline"}
      title="Tous les deals,"
      italic="en un coup d'œil."
      nav={COMMERCIAL_NAV}
    >
      {/* KPIs rapides */}
      <div className="flex items-center gap-6 mb-10 flex-wrap">
        <div>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 4 }}>
            Deals en cours
          </p>
          <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {cards.filter((c) => c.col !== "LOST").length}
          </p>
        </div>
        <div style={{ width: 1, height: 40, background: "var(--color-line)" }} />
        <div>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-muted)", fontFamily: "var(--font-geist)", marginBottom: 4 }}>
            Valeur pipeline
          </p>
          <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, color: "var(--color-accent)" }}>
            {formatPrice(totalPipeline)}
          </p>
        </div>
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4" style={{ marginLeft: -4, marginRight: -4 }}>
        <div className="flex gap-4 px-1" style={{ minWidth: "max-content" }}>
          {COLUMNS.map((col) => {
            const items = byCol[col.key];
            const s = COL_STYLE[col.key];
            const total = items.reduce((acc, x) => acc + x.amount, 0);

            return (
              <section key={col.key} className="shrink-0" style={{ width: 264 }}>
                {/* En-tête colonne */}
                <div
                  style={{
                    padding: "10px 14px",
                    marginBottom: 8,
                    borderRadius: 8,
                    background: s.headBg,
                    border: `1px solid ${s.border}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: s.ink }}>
                        {col.label}
                      </p>
                      <p style={{ fontSize: 11, color: s.ink, opacity: 0.7 }}>
                        {col.hint}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 20, fontWeight: 700, color: s.ink, lineHeight: 1 }}>
                        {items.length}
                      </p>
                      {total > 0 && (
                        <p style={{ fontSize: 10, color: s.ink, opacity: 0.6, fontFamily: "var(--font-geist)" }}>
                          {formatPrice(total)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 80 }}>
                  {items.length === 0 ? (
                    <p style={{ fontSize: 12, color: "var(--color-subtle)", textAlign: "center", padding: "24px 0", fontStyle: "italic" }}>
                      vide
                    </p>
                  ) : (
                    items.map((it) => {
                      const nextStatuses = it.quoteId
                        ? (QUOTE_TRANSITIONS[it.currentStatus ?? ""] ?? [])
                        : [];

                      return (
                        <div
                          key={it.id}
                          style={{
                            background: "var(--color-paper)",
                            border: "1px solid var(--color-line)",
                            borderRadius: 8,
                            overflow: "hidden",
                          }}
                        >
                          <Link
                            href={it.href}
                            className="block no-underline"
                            style={{ padding: "12px 14px", color: "var(--color-ink)" }}
                          >
                            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
                              {it.title}
                            </p>
                            <p style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-geist)", letterSpacing: "0.06em" }}>
                              {it.subtitle}
                            </p>
                            {it.amount > 0 && (
                              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-accent)", marginTop: 6 }}>
                                {formatPrice(it.amount)}
                              </p>
                            )}
                          </Link>

                          {/* Boutons de transition rapide */}
                          {nextStatuses.length > 0 && (
                            <div
                              style={{
                                borderTop: "1px solid var(--color-line)",
                                padding: "8px 14px",
                                display: "flex",
                                gap: 6,
                                flexWrap: "wrap",
                                background: "var(--color-bg)",
                              }}
                            >
                              {nextStatuses.map((next) => {
                                const isLost = next === "LOST";
                                return (
                                  <form key={next} action={advanceQuoteStatus}>
                                    <input type="hidden" name="quoteId" value={it.quoteId!} />
                                    <input type="hidden" name="nextStatus" value={next} />
                                    <button
                                      type="submit"
                                      style={{
                                        fontSize: 11,
                                        padding: "4px 10px",
                                        borderRadius: 5,
                                        cursor: "pointer",
                                        fontWeight: 500,
                                        background: isLost ? "#FEE2E2" : "var(--color-accent-soft)",
                                        border: `1px solid ${isLost ? "#9F1239" : "var(--color-accent)"}`,
                                        color: isLost ? "#9F1239" : "var(--color-accent-ink)",
                                      }}
                                    >
                                      {isLost ? "Perdu" : QUOTE_STATUS_LABEL[next] ?? next}
                                    </button>
                                  </form>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Deals perdus */}
      {byCol.LOST.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <SectionTitle
            eyebrow={`${byCol.LOST.length} perdu${byCol.LOST.length > 1 ? "s" : ""}`}
            title="Deals perdus,"
            italic="à analyser."
          />
          <div className="grid md:grid-cols-3 gap-3">
            {byCol.LOST.map((it) => (
              <Link
                key={it.id}
                href={it.href}
                className="block p-3 no-underline"
                style={{
                  background: "#FEE2E2",
                  border: "1px solid #9F1239",
                  borderRadius: 8,
                  color: "#7B1024",
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 13 }}>{it.title}</p>
                <p style={{ fontSize: 11, opacity: 0.7, fontFamily: "var(--font-geist)" }}>
                  {it.subtitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
