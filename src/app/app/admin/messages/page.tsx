import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";

export default async function AdminMessagesPage() {
  await requireRole("ADMIN");

  const projects = await prisma.project.findMany({
    where: { messages: { some: {} } },
    include: {
      dev: { select: { name: true, email: true } },
      client: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: {
          messages: { where: { senderRole: "DEV", readAt: null } },
        },
      },
    },
  });

  projects.sort((a, b) => {
    const ta = a.messages[0]?.createdAt.getTime() ?? 0;
    const tb = b.messages[0]?.createdAt.getTime() ?? 0;
    return tb - ta;
  });

  const totalUnread = projects.reduce((acc, p) => acc + p._count.messages, 0);

  return (
    <DashboardShell
      eyebrow="Messagerie interne"
      title="Vos devs vous parlent,"
      italic="ici."
      nav={ADMIN_NAV}
    >
      <SectionTitle
        eyebrow={totalUnread > 0 ? `${totalUnread} non lu${totalUnread > 1 ? "s" : ""}` : "Tout est lu"}
        title="Conversations actives,"
        italic="par projet."
      />

      {projects.length === 0 ? (
        <div
          className="p-10 text-center"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="serif-i" style={{ fontSize: 22, color: "var(--color-muted)" }}>
            Aucun message pour le moment.
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--color-subtle)" }}>
            Les devs vous écrivent depuis leur espace projet — coupé du client.
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
                href={`/app/admin/messages/${p.id}`}
                className="block p-5 no-underline transition"
                style={{
                  background: unread > 0 ? "#FFF8E1" : "var(--color-paper)",
                  border: `1px solid ${unread > 0 ? "#D4A857" : "var(--color-line)"}`,
                  borderRadius: 10,
                  color: "var(--color-ink)",
                }}
              >
                <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="display"
                      style={{ fontSize: 18, letterSpacing: "-0.02em" }}
                    >
                      {p.name}
                    </span>
                    {unread > 0 && (
                      <span
                        className="mono uppercase px-2 py-1"
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          background: "#D4A857",
                          color: "white",
                          borderRadius: 4,
                        }}
                      >
                        {unread} non lu{unread > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: "var(--color-subtle)",
                    }}
                  >
                    {last
                      ? `${last.senderRole === "DEV" ? "← " : "→ "}${last.createdAt.toLocaleDateString("fr-BE")}`
                      : "—"}
                  </span>
                </div>
                <p className="text-sm mb-1" style={{ color: "var(--color-muted)" }}>
                  Dev : {p.dev?.name ?? p.dev?.email ?? "Non assigné"} ·
                  Client : {p.client.name ?? p.client.email}
                </p>
                {last && (
                  <p
                    className="serif-i text-sm"
                    style={{
                      color: "var(--color-ink-soft)",
                      lineHeight: 1.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    « {last.content} »
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
