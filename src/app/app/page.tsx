import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Point d'entrée /app
 * - Non connecté → redirige vers /app/login
 * - Connecté → redirige vers l'espace correspondant au rôle
 */
export default async function PlatformHome() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/app/login");
  }

  const role = (session.user as { role?: string }).role ?? "CLIENT";

  switch (role) {
    case "ADMIN":
      redirect("/app/admin");
    case "COMMERCIAL":
      redirect("/app/commercial");
    case "DEV":
      redirect("/app/dev");
    case "CLIENT":
    default:
      redirect("/app/client");
  }

  // Inatteignable, mais TS rassuré
  return (
    <div className="wrap py-20">
      <Link href="/app/login">Se connecter</Link>
    </div>
  );
}
