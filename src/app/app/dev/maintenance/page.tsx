import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell, SectionTitle } from "@/components/platform/DashboardShell";
import { DEV_NAV } from "@/lib/platform-nav";
import { markMaintenanceDone } from "./actions";

export default async function MaintenancePage() {
  const { session, role } = await requireRole("DEV", "ADMIN");

  const tasks = await prisma.maintenanceTask.findMany({
    where: {
      project: { devId: session.user.id },
    },
    orderBy: [{ status: "asc" }, { month: "desc" }],
    include: {
      project: { select: { id: true, name: true } },
    },
  });

  const pending = tasks.filter((t) => t.status === "PENDING");
  const done = tasks.filter((t) => t.status === "DONE");

  return (
    <DashboardShell
      eyebrow="Maintenance MRR"
      title="Les tâches mensuelles,"
      italic="qui assurent le récurrent."
      nav={DEV_NAV}
    >
      {pending.length > 0 && (
        <>
          <SectionTitle eyebrow={`${pending.length} en attente`} title="À compléter," italic="ce mois-ci." />
          <div className="grid gap-3 mb-12">
            {pending.map((t) => (
              <div
                key={t.id}
                className="p-5"
                style={{ background: "#FFF8E1", border: "1px solid #D4A857", borderRadius: 10 }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="mono uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#8A6914" }}>
                      · {t.month.toLocaleDateString("fr-BE", { month: "long", year: "numeric" })}
                    </p>
                    <p style={{ fontWeight: 500 }}>{t.project.name}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                      Mises à jour CMS, vérification uptime, sauvegardes, optimisations.
                    </p>
                  </div>
                  <details className="flex-shrink-0">
                    <summary className="btn btn-ghost cursor-pointer" style={{ padding: "8px 14px", fontSize: 13 }}>
                      Marquer comme faite
                    </summary>
                    <form action={markMaintenanceDone.bind(null, t.id)} className="mt-3 space-y-3 p-3" style={{ background: "white", border: "1px solid var(--color-line)", borderRadius: 8, minWidth: 280 }}>
                      <label className="block">
                        <span className="mono uppercase block mb-1" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                          Rapport de maintenance
                        </span>
                        <textarea
                          name="report"
                          rows={4}
                          required
                          minLength={20}
                          placeholder="Ce qui a été fait : plugins mis à jour, backup vérifié, temps de réponse, etc."
                          className="w-full px-2 py-1 outline-none"
                          style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", borderRadius: 4, fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
                        />
                      </label>
                      <button type="submit" className="btn btn-primary w-full justify-center" style={{ fontSize: 13 }}>
                        Confirmer la maintenance ✓
                      </button>
                    </form>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {pending.length === 0 && (
        <div className="p-10 text-center mb-12" style={{ background: "#E6F5EC", border: "1px solid #13A66A", borderRadius: 12 }}>
          <p className="serif-i" style={{ fontSize: 22, color: "#0D6E46" }}>
            Toutes les maintenances sont à jour. ✓
          </p>
        </div>
      )}

      {done.length > 0 && (
        <>
          <SectionTitle eyebrow="Historique" title="Les maintenances" italic="réalisées." />
          <div className="grid gap-2">
            {done.slice(0, 10).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between px-4 py-3 flex-wrap gap-2"
                style={{ background: "var(--color-paper)", border: "1px solid var(--color-line)", borderRadius: 8 }}
              >
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{t.project.name}</p>
                  <p className="mono text-xs" style={{ color: "var(--color-subtle)" }}>
                    {t.month.toLocaleDateString("fr-BE", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className="mono uppercase text-xs" style={{ color: "#13A66A" }}>
                  ✓ {t.doneAt?.toLocaleDateString("fr-BE")}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
