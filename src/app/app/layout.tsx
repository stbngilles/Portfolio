import Link from "next/link";
import { getEffectiveSession } from "@/lib/auth-guard";
import { ImpersonationBanner } from "@/components/platform/ImpersonationBanner";
import { WorkspaceSwitcher } from "@/components/platform/WorkspaceSwitcher";
import { UserMenu } from "@/components/platform/UserMenu";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrateur",
  COMMERCIAL: "Commercial",
  CLIENT: "Client",
  DEV: "Développeur",
  COMPTABLE: "Comptable",
};

/**
 * Quels espaces un rôle peut visiter.
 *  - ADMIN voit tout (super-utilisateur)
 *  - les autres ne voient que le leur
 *  - quand on impersonate, on utilise le rôle effectif (donc l'admin
 *    impersonant un CLIENT ne voit que l'espace client → cohérent avec
 *    « voir comme »).
 */
function workspacesForRole(role: string): Array<"admin" | "commercial" | "client" | "dev" | "comptable"> {
  switch (role) {
    case "ADMIN":
      return ["admin", "commercial", "client", "dev", "comptable"];
    case "COMMERCIAL":
      return ["commercial"];
    case "CLIENT":
      return ["client"];
    case "DEV":
      return ["dev"];
    case "COMPTABLE":
      return ["comptable"];
    default:
      return [];
  }
}

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getEffectiveSession();

  const workspaces = session ? workspacesForRole(session.user.role) : [];
  const canImpersonate =
    !!session &&
    !session.isImpersonating &&
    (session.realUser.role === "ADMIN" || session.realUser.role === "DEV");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}
    >
      {session?.isImpersonating && (
        <ImpersonationBanner
          realName={session.realUser.name ?? session.realUser.email}
          asName={session.user.name ?? session.user.email}
          asRole={ROLE_LABEL[session.user.role] ?? session.user.role}
        />
      )}

      <header
        className="sticky z-40 backdrop-blur-md"
        style={{
          top: session?.isImpersonating ? 42 : 0,
          background: "color-mix(in srgb, var(--color-paper) 88%, transparent)",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <div
          className="wrap flex items-center gap-6"
          style={{ paddingTop: 14, paddingBottom: 14 }}
        >
          {/* Logo */}
          <Link
            href="/app"
            className="flex items-baseline gap-[2px] no-underline shrink-0"
            style={{
              color: "var(--color-ink)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              fontSize: 18,
            }}
          >
            <span
              className="inline-block w-[10px] h-[10px] mr-[10px] rounded-[2px]"
              style={{ background: "var(--color-accent)", translate: "0 -2px" }}
            />
            Pixelbrute
          </Link>

          {/* Séparateur fin */}
          {session && (
            <span
              aria-hidden
              style={{
                width: 1,
                height: 20,
                background: "var(--color-line)",
              }}
            />
          )}

          {/* Switcher d'espace */}
          {session && <WorkspaceSwitcher availableKeys={workspaces} />}

          <div className="flex-1" />

          {/* Menu user */}
          {session && (
            <UserMenu
              name={session.user.name}
              email={session.user.email}
              role={session.user.role}
              canImpersonate={canImpersonate}
            />
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ borderTop: "1px solid var(--color-line)" }}>
        <div
          className="wrap flex justify-between items-center"
          style={{ paddingTop: 24, paddingBottom: 24 }}
        >
          <p
            className="mono uppercase"
            style={{ fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.1em" }}
          >
            © 2026 · Pixelbrute · OS
          </p>
          <p className="serif-i" style={{ fontSize: 13, color: "var(--color-subtle)" }}>
            le studio qui tourne tout seul.
          </p>
        </div>
      </footer>
    </div>
  );
}
