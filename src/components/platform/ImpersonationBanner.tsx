import { stopImpersonation } from "@/app/app/impersonate/actions";

export function ImpersonationBanner({
  realName,
  asName,
  asRole,
}: {
  realName: string;
  asName: string;
  asRole: string;
}) {
  return (
    <div
      style={{
        background: "#0F0F14",
        color: "#FAF9F5",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "2px solid var(--color-accent)",
      }}
    >
      <div className="wrap flex items-center justify-between gap-4 py-2 flex-wrap">
        <p className="text-sm">
          <span
            className="mono uppercase mr-3"
            style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-accent)" }}
          >
            · VOIR COMME
          </span>
          <span style={{ fontWeight: 500 }}>{asName}</span>{" "}
          <span style={{ opacity: 0.6 }}>· {asRole}</span>
          <span className="serif-i ml-3" style={{ opacity: 0.5 }}>
            (vous êtes {realName})
          </span>
        </p>
        <form action={stopImpersonation}>
          <button
            type="submit"
            className="text-xs no-underline"
            style={{ color: "var(--color-accent)" }}
          >
            ← Revenir à mon compte
          </button>
        </form>
      </div>
    </div>
  );
}
