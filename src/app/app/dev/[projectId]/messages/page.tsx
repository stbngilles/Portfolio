import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { sendMessage } from "./actions";

export default async function DevMessagesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { session, role } = await requireRole("DEV", "ADMIN");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!project) notFound();
  if (role !== "ADMIN" && project.devId !== session.user.id) notFound();

  const messages = project.messages;

  return (
    <div className="wrap py-8 max-w-3xl">
      <p
        className="serif-i mb-6 text-sm"
        style={{ color: "var(--color-muted)" }}
      >
        Canal interne — uniquement visible par vous et l'administrateur. Le client n'y a pas accès.
      </p>

      <div className="space-y-3 mb-8 min-h-[200px]">
        {messages.length === 0 ? (
          <p className="text-center py-12 serif-i" style={{ color: "var(--color-subtle)" }}>
            Aucun message pour le moment.
          </p>
        ) : (
          messages.map((m) => {
            const isMe =
              m.senderId === session.user.id ||
              (role === "ADMIN" && m.senderRole === "ADMIN") ||
              (role === "DEV" && m.senderRole === "DEV");
            const fromAdmin = m.senderRole === "ADMIN";
            return (
              <div
                key={m.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[70%] px-4 py-3"
                  style={{
                    background: isMe ? "var(--color-accent)" : "var(--color-paper)",
                    border: isMe ? "none" : "1px solid var(--color-line)",
                    borderRadius: 10,
                    color: isMe ? "var(--color-paper)" : "var(--color-ink)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="mono uppercase"
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.14em",
                        opacity: 0.7,
                      }}
                    >
                      {fromAdmin ? "Admin" : "Dev"}
                    </span>
                    <span
                      className="mono"
                      style={{ fontSize: 9, opacity: 0.5 }}
                    >
                      {m.createdAt.toLocaleDateString("fr-BE")} {m.createdAt.toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                    {m.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form action={sendMessage.bind(null, projectId)} className="flex gap-3">
        <textarea
          name="content"
          required
          rows={3}
          placeholder="Votre message à l'admin…"
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
    </div>
  );
}
