"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

const VALID_ROLES = ["ADMIN", "COMMERCIAL", "CLIENT", "DEV"] as const;

export async function changeUserRole(formData: FormData) {
  const { session } = await requireRole("ADMIN");

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId || !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    throw new Error("Données invalides.");
  }
  if (userId === session.user.id) {
    throw new Error("Vous ne pouvez pas changer votre propre rôle.");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/app/admin/users");
}
