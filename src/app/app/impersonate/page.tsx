import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { ADMIN_NAV, DEV_NAV } from "@/lib/platform-nav";
import { startImpersonation } from "./actions";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrateur",
  COMMERCIAL: "Commercial",
  CLIENT: "Client",
  DEV: "Développeur",
};

const ROLE_COLOR: Record<string, string> = {
  ADMIN: "#0F0F14",
  COMMERCIAL: "var(--color-accent)",
  CLIENT: "#13A66A",
  DEV: "#7B5BFF",
};

export default async function ImpersonatePage() {
  const { session, role, realUser } = await requireRole("ADMIN", "DEV");

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true },
  });

  // On peut prendre la vue de tout le monde sauf soi-même (au sens "user réel").
  const targets = users.filter((u) => u.id !== realUser.id);

  return (
    <DashboardShell
      eyebrow="Voir comme"
      title="Prenez la vue,"
      italic="de n'importe qui."
      user={{ ...session.user, role }}
      nav={role === "ADMIN" ? ADMIN_NAV : DEV_NAV}
    >
      <p
        className="serif-i mb-10"
        style={{ fontSize: 18, color: "var(--color-muted)", maxWidth: 640 }}
      >
        Outil de QA et d'empathie : voyez la plateforme exactement comme
        l'utilisateur cible la voit, avec ses données, ses droits, sa
        navigation. Vous restez identifié comme{" "}
        <span style={{ color: "var(--color-ink)", fontStyle: "normal", fontWeight: 500 }}>
          {realUser.name ?? realUser.email}
        </span>{" "}
        en arrière-plan ; un clic suffit pour revenir.
      </p>

      <SectionTitle
        eyebrow={`${targets.length} compte${targets.length > 1 ? "s" : ""}`}
        title="Choisissez,"
        italic="qui vous voulez devenir."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {targets.map((u) => (
          <form key={u.id} action={startImpersonation}>
            <input type="hidden" name="userId" value={u.id} />
            <button
              type="submit"
              className="block w-full text-left p-5 transition"
              style={{
                background: "var(--color-paper)",
                border: "1px solid var(--color-line)",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: ROLE_COLOR[u.role] ?? "#65656E" }}
                />
                <span
                  className="mono uppercase"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    color: "var(--color-subtle)",
                  }}
                >
                  {ROLE_LABEL[u.role] ?? u.role}
                </span>
              </div>
              <p
                className="display"
                style={{ fontSize: 18, letterSpacing: "-0.01em", lineHeight: 1.2 }}
              >
                {u.name ?? u.email}
              </p>
              {u.name && (
                <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                  {u.email}
                </p>
              )}
              <p
                className="serif-i mt-3 text-sm"
                style={{ color: "var(--color-accent)" }}
              >
                Voir comme →
              </p>
            </button>
          </form>
        ))}
      </div>
    </DashboardShell>
  );
}
