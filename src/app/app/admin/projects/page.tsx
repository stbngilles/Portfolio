import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import {
  DashboardShell,
  SectionTitle,
} from "@/components/platform/DashboardShell";
import { createProject } from "./actions";

const STATUS_COLOR: Record<string, string> = {
  BRIEFING: "#94949D",
  DESIGN: "#D4A857",
  DEV: "#1F3FBF",
  CONTENT: "#7B5BFF",
  LIVE: "#13A66A",
  CLOSED: "#65656E",
};

export default async function AdminProjectsPage() {
  const { session, role } = await requireRole("ADMIN");

  const [projects, clients, commerciaux, devs] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { name: true, email: true } },
        commercial: { select: { name: true } },
        dev: { select: { name: true } },
        stages: { select: { status: true } },
      },
    }),
    prisma.user.findMany({ where: { role: "CLIENT" }, select: { id: true, name: true, email: true } }),
    prisma.user.findMany({ where: { role: "COMMERCIAL" }, select: { id: true, name: true, email: true } }),
    prisma.user.findMany({ where: { role: "DEV" }, select: { id: true, name: true, email: true } }),
  ]);

  return (
    <DashboardShell
      eyebrow="Projets"
      title="Toute la production,"
      italic="d'un coup d'œil."
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
      {/* Formulaire de création */}
      <div
        className="p-7 mb-12"
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 12,
        }}
      >
        <SectionTitle eyebrow="Nouveau projet" title="On démarre" italic="quoi ?" />

        <form action={createProject} className="grid md:grid-cols-2 gap-4">
          <FormField label="Nom du projet">
            <input
              type="text"
              name="name"
              required
              placeholder="Boulangerie Demoulin — site vitrine"
              className="w-full px-4 py-3 outline-none"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
                borderRadius: 8,
                fontSize: 15,
              }}
            />
          </FormField>

          <FormField label="Client (obligatoire)">
            <select
              name="clientId"
              required
              defaultValue=""
              className="w-full px-4 py-3 outline-none"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
                borderRadius: 8,
                fontSize: 15,
              }}
            >
              <option value="" disabled>
                Sélectionner un client…
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? c.email}
                </option>
              ))}
            </select>
            {clients.length === 0 && (
              <p className="text-xs mt-2" style={{ color: "var(--color-muted)" }}>
                Aucun client. Crée d'abord un compte CLIENT depuis{" "}
                <Link
                  href="/app/admin/users"
                  className="no-underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  Utilisateurs
                </Link>
                .
              </p>
            )}
          </FormField>

          <FormField label="Commercial (optionnel)">
            <select
              name="commercialId"
              defaultValue=""
              className="w-full px-4 py-3 outline-none"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
                borderRadius: 8,
                fontSize: 15,
              }}
            >
              <option value="">Aucun</option>
              {commerciaux.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? c.email}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Développeur (optionnel)">
            <select
              name="devId"
              defaultValue=""
              className="w-full px-4 py-3 outline-none"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
                borderRadius: 8,
                fontSize: 15,
              }}
            >
              <option value="">Aucun</option>
              {devs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name ?? d.email}
                </option>
              ))}
            </select>
          </FormField>

          <div className="md:col-span-2 mt-2">
            <button type="submit" className="btn btn-primary">
              Créer le projet →
            </button>
            <p
              className="serif-i mt-3 text-xs"
              style={{ color: "var(--color-subtle)" }}
            >
              Les 6 étapes seront générées automatiquement, la première en cours.
            </p>
          </div>
        </form>
      </div>

      {/* Liste */}
      <SectionTitle
        eyebrow={`${projects.length} projet${projects.length > 1 ? "s" : ""}`}
        title="L'historique,"
        italic="du plus récent."
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
          <p className="serif-i" style={{ fontSize: 20, color: "var(--color-muted)" }}>
            Aucun projet pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => {
            const total = p.stages.length;
            const done = p.stages.filter((s) => s.status === "VALIDATED").length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Link
                key={p.id}
                href={`/app/admin/projects/${p.id}`}
                className="block no-underline transition"
                style={{
                  background: "var(--color-paper)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  color: "var(--color-ink)",
                }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: STATUS_COLOR[p.status] ?? "#65656E" }}
                      />
                      <span
                        className="mono uppercase"
                        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p
                      className="display"
                      style={{ fontSize: 20, letterSpacing: "-0.01em", lineHeight: 1.2 }}
                    >
                      {p.name}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                      {p.client.name ?? p.client.email}
                      {p.commercial?.name && ` · ${p.commercial.name}`}
                      {p.dev?.name && ` · ${p.dev.name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="display"
                      style={{ fontSize: 22, color: "var(--color-accent)" }}
                    >
                      {pct}%
                    </p>
                    <p
                      className="mono"
                      style={{ fontSize: 10, color: "var(--color-subtle)", letterSpacing: "0.14em" }}
                    >
                      {done}/{total} ÉTAPES
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="mono uppercase block mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
