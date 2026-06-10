import { redirect } from "next/navigation";
import { getEffectiveSession } from "@/lib/auth-guard";

/**
 * Point d'entrée /app
 *  - Non connecté → /app/login
 *  - Connecté → espace correspondant au rôle (impersonation prise en compte)
 */
export default async function PlatformHome() {
  const session = await getEffectiveSession();
  if (!session) redirect("/app/login");

  switch (session.user.role) {
    case "ADMIN":
      redirect("/app/admin");
    case "COMMERCIAL":
      redirect("/app/commercial");
    case "DEV":
      redirect("/app/dev");
    case "COMPTABLE":
      redirect("/app/comptable");
    case "CLIENT":
    default:
      redirect("/app/client");
  }
}
