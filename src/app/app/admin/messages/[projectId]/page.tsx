import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV } from "@/lib/platform-nav";
import { sendMessage } from "@/app/app/dev/[projectId]/messages/actions";

export default async function AdminMessageThreadPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { session } = await requireRole("ADMIN");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      dev: { select: { name: true, email: true } },
      client: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!project) notFound();

  // Marquer les messages du dev comme lus
  await prisma.message.updateMany({
    where: { projectId, senderRole: "DEV", readAt: null },
    data: { readAt: new Date() },
  });

  return (
    <DashboardShell
      eyebrow={`Projet · ${project.name}`}
      title="Conversation avec le dev,"
      italic="canal interne."
      nav={ADMIN_NAV}
    >
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Dev : <strong>{project.dev?.name ?? project.dev?.email ?? "Non assigné"}</strong> ·
          Client (invisible ici) : {project.client.name ?? project.client.email}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/app/admin/projects/${project.id}`}
            className="btn btn-ghost"
            style={{ padding: "6px 12px", fontSize: 12 }}
          >
            Fiche projet →
          </Link>
          <Link
            href="/app/admin/messages"
            className="btn btn-ghost"
            style={{ padding: "6px 12px", fontSize: 12 }}
          >
            ← Inbox
          </Link>
        </div>
      </div>

      <SectionTitle eyebrow="Historique" title="Tous les échanges," italic="dans l'ordre." />

      <div
        className="p-6 mb-6"
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 12,
          minHeight: 240,
        }}
      >
        {project.messages.length === 0 ? (
          <p className="text-center py-12 serif-i" style={{ color: "var(--color-subtle)" }}>
            Aucun message pour ce projet.
          </p>
        ) : (
          <div className="space-y-3">
            {project.messages.map((m) => {
              const fromAdmin = m.senderRole === "ADMIN";
              return (
                <div
                  key={m.id}
                  className={`flex ${fromAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[70%] px-4 py-3"
                    style={{
                      background: fromAdmin ? "var(--color-accent)" : "var(--color-bg)",
                      border: fromAdmin ? "none" : "1px solid var(--color-line)",
                      borderRadius: 10,
                      color: fromAdmin ? "var(--color-paper)" : "var(--color-ink)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="mono uppercase"
                        style={{ fontSize: 9, letterSpacing: "0.14em", opacity: 0.7 }}
                      >
                        {fromAdmin ? "Vous (admin)" : "Dev"}
                      </span>
                      <span className="mono" style={{ fontSize: 9, opacity: 0.5 }}>
                        {m.createdAt.toLocaleDateString("fr-BE")} {m.createdAt.toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                      {m.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form action={sendMessage.bind(null, projectId)} className="flex gap-3">
        <textarea
          name="content"
          required
          rows={3}
          placeholder="Votre réponse au dev…"
          className="flex-1 px-3 py-2 outline-none"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 8,
            fontSize: 14,
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
        <button type="submit" className="btn btn-primary self-end">
          Envoyer →
        </button>
      </form>

      <p className="text-xs mt-3 serif-i" style={{ color: "var(--color-subtle)" }}>
        Connecté en tant que {session.user.email}. Le client n'a pas accès à ce canal.
      </p>
    </DashboardShell>
  );
}
