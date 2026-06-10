"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

/**
 * Bascule entre PAID / PENDING. Idempotent : on lit l'état actuel et on inverse.
 * Le bouton sur la page envoie juste l'id ; pas besoin de stocker une intention.
 */
export async function toggleCommissionStatus(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Id requis.");

  const current = await prisma.commission.findUnique({ where: { id } });
  if (!current) throw new Error("Commission introuvable.");

  await prisma.commission.update({
    where: { id },
    data:
      current.status === "PAID"
        ? { status: "PENDING", paidAt: null }
        : { status: "PAID", paidAt: new Date() },
  });

  revalidatePath("/app/admin/commissions");
  revalidatePath("/app/commercial/commissions");
}

export async function markCommissionPaid(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("commissionId") ?? "");
  if (!id) throw new Error("Id requis.");
  await prisma.commission.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/app/admin/finances");
  revalidatePath("/app/admin/commissions");
  revalidatePath("/app/commercial/commissions");
  revalidatePath("/app/comptable");
}
