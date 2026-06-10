import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell, SectionTitle } from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { resolveBlocker } from "./actions";

const TYPE_LABEL: Record<string, string> = {
  MISSING_ASSET: "Asset manquant",
  BROKEN_API: "API cassée",
  UNCLEAR_BRIEF: "Brief ambigu",
  ACCESS_DENIED: "Accès refusé",
  OTHER: "Autre",
};

export default async function AdminBlockersPage() {
  const { role } = await requireRole("ADMIN");

  const open = await prisma.blockerReport.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "asc" },
    include: {
      project: { select: { id: true, name: true } },
      dev: { select: { name: true, email: true } },
    },
  });

  const resolved = await prisma.blockerReport.findMany({
    where: { status: "RESOLVED" },
    orderBy: { resolvedAt: "desc" },
    take: 10,
    include: {
      project: { select: { id: true, name: true } },
      dev: { select: { name: true } },
    },
  });

  return (
    <DashboardShell
      eyebrow="Blocages"
      title="Les projets gelés,"
      italic="à débloquer."
      nav={ADMIN_NAV}
    >
      {open.length > 0 ? (
        <>
          <SectionTitle eyebrow={`${open.length} ouvert${open.length > 1 ? "s" : ""}`} title="Action requise," italic="maintenant." />
          <div className="grid gap-5 mb-12">
            {open.map((b) => (
              <article
                key={b.id}
                className="p-6"
                style={{ background: "#FEE2E2", border: "1px solid #9F1239", borderRadius: 12 }}
              >
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="mono uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#9F1239" }}>
                      · BLOQUÉ — {TYPE_LABEL[b.type] ?? b.type} — {b.createdAt.toLocaleDateString("fr-BE")}
                    </p>
                    <Link href={`/app/admin/projects/${b.project.id}`} className="display no-underline" style={{ fontSize: 22, letterSpacing: "-0.02em", color: "#7B1024" }}>
                      {b.project.name}
                    </Link>
                    <p className="text-sm mt-1" style={{ color: "#9F1239" }}>
                      Signalé par : {b.dev.name ?? b.dev.email}
                    </p>
                  </div>
                </div>

                <div className="p-4 mb-4" style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, fontStyle: "italic", color: "#7B1024" }}>
                  « {b.description} »
                </div>

                <details>
                  <summary className="text-sm cursor-pointer" style={{ color: "#9F1239" }}>
                    Résoudre ce blocage →
                  </summary>
                  <form action={resolveBlocker.bind(null, b.id)} className="mt-4 space-y-3">
                    <label className="block">
                      <span className="mono uppercase block mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                        Note pour le dev (ce que vous avez fait / fourni)
                      </span>
                      <textarea
                        name="adminNote"
                        rows={4}
                        required
                        minLength={10}
                        placeholder="J'ai ajouté les photos dans le Trousseau. / Le Stripe est corrigé. / Voici le brief mis à jour…"
                        className="w-full px-3 py-2 outline-none"
                        style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
                      />
                    </label>
                    <button type="submit" className="btn btn-primary">
                      Débloquer le projet ✓
                    </button>
                  </form>
                </details>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="p-10 text-center mb-12" style={{ background: "#E6F5EC", border: "1px solid #13A66A", borderRadius: 12 }}>
          <p className="serif-i" style={{ fontSize: 22, color: "#0D6E46" }}>
            Aucun projet bloqué. ✓
          </p>
        </div>
      )}

      {resolved.length > 0 && (
        <>
          <SectionTitle eyebrow="Historique" title="Les blocages" italic="résolus." />
          <div className="grid gap-2">
            {resolved.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between px-4 py-3 flex-wrap gap-2"
                style={{ background: "var(--color-paper)", border: "1px solid var(--color-line)", borderRadius: 8 }}
              >
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{b.project.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {TYPE_LABEL[b.type] ?? b.type} — {b.dev.name}
                  </p>
                </div>
                <span className="mono text-xs" style={{ color: "#13A66A" }}>
                  ✓ {b.resolvedAt?.toLocaleDateString("fr-BE")}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
