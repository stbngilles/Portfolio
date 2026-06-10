"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getRealSession } from "@/lib/auth-guard";
import { setImpersonatedUserId } from "@/lib/impersonation";

/**
 * Bascule en mode "Voir comme" un autre user.
 * Réservé aux ADMIN et DEV. Le user réel garde sa session ; on superpose
 * l'identité cible via le cookie d'impersonation.
 */
export async function startImpersonation(formData: FormData) {
  const real = await getRealSession();
  if (!real) throw new Error("Non connecté.");
  const realRole = ((real.user as { role?: string }).role ?? "CLIENT");
  if (realRole !== "ADMIN" && realRole !== "DEV") {
    throw new Error("Impersonation interdite pour ce rôle.");
  }

  const userId = String(formData.get("userId") ?? "");
  if (!userId) throw new Error("Cible requise.");
  if (userId === real.user.id) {
    // No-op : on revient sur soi.
    await setImpersonatedUserId(null);
    redirect("/app");
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw new Error("Utilisateur cible introuvable.");

  await setImpersonatedUserId(userId);
  revalidatePath("/", "layout");
  redirect("/app");
}

export async function stopImpersonation() {
  await setImpersonatedUserId(null);
  revalidatePath("/", "layout");
  redirect("/app");
}
