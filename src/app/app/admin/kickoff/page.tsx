import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
  StatCard,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { markKickoffDone, scheduleKickoff } from "./actions";

export default async function KickoffPage() {
  await requireRole("ADMIN");

  const toDo = await prisma.project.findMany({
    where: { kickoffDone: false },
    orderBy: [{ kickoffAt: "asc" }, { createdAt: "asc" }],
    include: {
      client: { select: { name: true, email: true } },
      commercial: { select: { name: true, email: true } },
      quote: { select: { totalOneShot: true, totalRecurring: true } },
    },
  });

  const done = await prisma.project.findMany({
    where: { kickoffDone: true },
    orderBy: { kickoffAt: "desc" },
    take: 10,
    include: { client: { select: { name: true, email: true } } },
  });

  const scheduled = toDo.filter((p) => p.kickoffAt).length;
  const unscheduled = toDo.length - scheduled;

  return (
    <DashboardShell
      eyebrow="Planificateur de kick-off"
      title="Caler l'appel technique,"
      italic="avant d'envoyer au dev."
      nav={ADMIN_NAV}
    >
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="À planifier" value={String(unscheduled)} hint="sans date" accent />
        <StatCard label="Planifiés" value={String(scheduled)} hint="à tenir" />
        <StatCard label="Faits (récent)" value={String(done.length)} hint="dernières semaines" />
        <StatCard
          label="Total kick-offs"
          value={String(toDo.length + done.length)}
          hint="depuis toujours"
        />
      </section>

      <SectionTitle
        eyebrow={`${toDo.length} à traiter`}
        title="Les projets,"
        italic="en attente du cadrage."
      />

      <p className="serif-i text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        Tout projet fraîchement signé doit passer par un appel de cadrage technique de 30 minutes
        avant que le ticket parte chez un freelance. Aucun brief ne s'échappe sans validation.
      </p>

      {toDo.length === 0 ? (
        <div
          className="p-10 text-center mb-14"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="serif-i" style={{ fontSize: 22, color: "var(--color-muted)" }}>
            Aucun kick-off en attente. Beau travail.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 mb-14">
          {toDo.map((p) => {
            const scheduled = !!p.kickoffAt;
            return (
              <article
                key={p.id}
                className="p-6"
                style={{
                  background: "var(--color-paper)",
                  border: `1px solid ${scheduled ? "var(--color-accent)" : "#D4A857"}`,
                  borderRadius: 12,
                }}
              >
                <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <Link
                      href={`/app/admin/projects/${p.id}`}
                      className="display no-underline"
                      style={{ fontSize: 22, letterSpacing: "-0.02em", color: "var(--color-ink)" }}
                    >
                      {p.name}
                    </Link>
                    <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                      Client : <strong style={{ color: "var(--color-ink)" }}>{p.client.name ?? p.client.email}</strong>
                      {p.commercial && ` · vendu par ${p.commercial.name ?? p.commercial.email}`}
                    </p>
                  </div>
                  <span
                    className="mono uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: scheduled ? "var(--color-accent)" : "#8A6914",
                    }}
                  >
                    {scheduled
                      ? `Prévu ${p.kickoffAt!.toLocaleDateString("fr-BE")} ${p.kickoffAt!.toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}`
                      : "À planifier"}
                  </span>
                </div>

                {p.quote && (
                  <p className="text-xs mb-4 mono" style={{ color: "var(--color-subtle)", letterSpacing: "0.08em" }}>
                    DEVIS : {(p.quote.totalOneShot / 100).toLocaleString("fr-BE")} € one-shot
                    {p.quote.totalRecurring > 0 && ` + ${(p.quote.totalRecurring / 100).toLocaleString("fr-BE")} €/mois`}
                  </p>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-end">
                    <Link
                      href={`/app/admin/brief/${p.id}`}
                      className="btn btn-accent w-full text-center"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    >
                      📝 Ouvrir le brief →
                    </Link>
                  </div>
                  <form action={scheduleKickoff} className="flex gap-2 items-end">
                    <input type="hidden" name="projectId" value={p.id} />
                    <label className="flex-1">
                      <span
                        className="mono uppercase block mb-1"
                        style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--color-muted)" }}
                      >
                        {scheduled ? "Repositionner" : "Planifier"}
                      </span>
                      <input
                        type="datetime-local"
                        name="kickoffAt"
                        required
                        className="w-full px-3 py-2 outline-none"
                        style={{
                          background: "var(--color-bg)",
                          border: "1px solid var(--color-line)",
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      />
                    </label>
                    <button type="submit" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 12 }}>
                      OK
                    </button>
                  </form>

                  <form action={markKickoffDone} className="flex items-end">
                    <input type="hidden" name="projectId" value={p.id} />
                    <button type="submit" className="btn btn-accent w-full justify-center">
                      Kick-off réalisé ✓
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {done.length > 0 && (
        <>
          <SectionTitle eyebrow="Historique" title="Les derniers cadrages," italic="faits." />
          <div className="grid gap-2">
            {done.map((p) => (
              <Link
                key={p.id}
                href={`/app/admin/projects/${p.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 no-underline"
                style={{
                  background: "var(--color-accent-soft)",
                  border: "1px solid var(--color-accent)",
                  borderRadius: 8,
                  color: "var(--color-ink)",
                }}
              >
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                  {p.client.name ?? p.client.email}
                  {p.kickoffAt && ` · ${p.kickoffAt.toLocaleDateString("fr-BE")}`}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
