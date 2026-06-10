import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { DashboardShell, SectionTitle } from "@/components/platform/DashboardShell";
import { DEV_NAV } from "@/lib/platform-nav";

export default async function DevMessagesIndexPage() {
  const { session, role } = await requireRole("DEV", "ADMIN");

  const projects = await prisma.project.findMany({
    where: role === "ADMIN" ? {} : { devId: session.user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { messages: { where: { readAt: null, senderRole: "ADMIN" } } } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <DashboardShell
      eyebrow="Messages"
      title="Vos canaux,"
      italic="avec l'admin."
      nav={DEV_NAV}
    >
      <p className="serif-i mb-8" style={{ color: "var(--color-muted)", maxWidth: 600 }}>
        Communication interne uniquement : dev ↔ admin. Le client n'a jamais accès à ces échanges.
      </p>

      {projects.length === 0 ? (
        <div className="p-10 text-center" style={{ background: "var(--color-paper)", border: "1px dashed var(--color-line)", borderRadius: 12 }}>
          <p className="serif-i" style={{ fontSize: 20, color: "var(--color-muted)" }}>
            Aucun projet actif pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => {
            const unread = p._count.messages;
            const last = p.messages[0];
            return (
              <Link
                key={p.id}
                href={`/app/dev/${p.id}/messages`}
                className="block no-underline transition p-5"
                style={{
                  background: unread > 0 ? "var(--color-accent-soft)" : "var(--color-paper)",
                  border: `1px solid ${unread > 0 ? "var(--color-accent)" : "var(--color-line)"}`,
                  borderRadius: 12,
                  color: "var(--color-ink)",
                }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p style={{ fontWeight: 500 }}>{p.name}</p>
                    {last && (
                      <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                        {last.senderRole === "ADMIN" ? "Admin" : "Vous"} : {last.content.slice(0, 80)}
                        {last.content.length > 80 ? "…" : ""}
                      </p>
                    )}
                  </div>
                  {unread > 0 && (
                    <span
                      className="mono"
                      style={{
                        background: "var(--color-accent)",
                        color: "white",
                        fontSize: 11,
                        borderRadius: 999,
                        padding: "2px 10px",
                      }}
                    >
                      {unread} nouveau{unread > 1 ? "x" : ""}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
