"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

/** Le client met à jour ses coordonnées de facturation. */
export async function updateClientBilling(formData: FormData) {
  const { session } = await requireRole("CLIENT", "ADMIN");

  const userId = String(formData.get("userId") ?? "");
  // Sécurité : un client ne peut modifier que ses propres infos
  if (userId !== session.user.id) throw new Error("Accès refusé.");

  await prisma.user.update({
    where: { id: userId },
    data: {
      name:       String(formData.get("name")       ?? "").trim() || undefined,
      phone:      String(formData.get("phone")       ?? "").trim() || null,
      vatNumber:  String(formData.get("vatNumber")   ?? "").trim() || null,
      address:    String(formData.get("address")     ?? "").trim() || null,
      postalCode: String(formData.get("postalCode")  ?? "").trim() || null,
      city:       String(formData.get("city")        ?? "").trim() || null,
      country:    String(formData.get("country")     ?? "").trim() || null,
    },
  });

  revalidatePath("/app/client/onboarding");
  revalidatePath("/app/client");
  revalidatePath("/app/admin/clients");
  redirect("/app/client?saved=1");
}
