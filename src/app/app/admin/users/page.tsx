import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { changeUserRole } from "./actions";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrateur",
  COMMERCIAL: "Commercial",
  CLIENT: "Client",
  DEV: "Développeur",
};

export default async function AdminUsersPage() {
  const { session, role } = await requireRole("ADMIN");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <DashboardShell
      eyebrow="Utilisateurs"
      title="Les gens,"
      italic="et leurs rôles."
      user={{ ...session.user, role }}
      nav={[
        { href: "/app/admin", label: "Vue d'ensemble" },
        { href: "/app/admin/projects", label: "Projets" },
        { href: "/app/admin/clients", label: "Clients" },
        { href: "/app/admin/recurring", label: "Récurrent" },
        { href: "/app/admin/commissions", label: "Commissions" },
        { href: "/app/admin/users", label: "Utilisateurs" },
      ]}
    >
      <SectionTitle
        eyebrow={`${users.length} compte${users.length > 1 ? "s" : ""}`}
        title="Tout le monde,"
        italic="en un endroit."
      />

      <div
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="mono uppercase text-left"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "var(--color-subtle)",
                background: "var(--color-bg)",
              }}
            >
              <th className="px-5 py-3">Nom</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Inscrit le</th>
              <th className="px-5 py-3">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                style={{ borderTop: "1px solid var(--color-line)" }}
              >
                <td className="px-5 py-4">
                  <span style={{ fontWeight: 500 }}>{u.name ?? "—"}</span>
                </td>
                <td className="px-5 py-4" style={{ color: "var(--color-muted)" }}>
                  {u.email}
                </td>
                <td
                  className="px-5 py-4 mono"
                  style={{ fontSize: 12, color: "var(--color-subtle)" }}
                >
                  {u.createdAt.toLocaleDateString("fr-BE")}
                </td>
                <td className="px-5 py-4">
                  <form action={changeUserRole} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <select
                      name="role"
                      defaultValue={u.role}
                      disabled={u.id === session.user.id}
                      title={
                        u.id === session.user.id
                          ? "Vous ne pouvez pas changer votre propre rôle"
                          : ""
                      }
                      className="px-3 py-1.5 outline-none transition"
                      style={{
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-line)",
                        borderRadius: 6,
                        fontSize: 13,
                        color: "var(--color-ink)",
                      }}
                    >
                      {Object.entries(ROLE_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                    {u.id !== session.user.id && (
                      <button
                        type="submit"
                        className="text-xs no-underline"
                        style={{ color: "var(--color-accent)" }}
                      >
                        Enregistrer
                      </button>
                    )}
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p
        className="mt-6 text-sm serif-i"
        style={{ color: "var(--color-subtle)" }}
      >
        L'invitation par email (création d'un compte sans signup public) arrive en
        phase 1bis.
      </p>
    </DashboardShell>
  );
}
