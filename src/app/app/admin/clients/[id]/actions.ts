"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { setImpersonatedUserId } from "@/lib/impersonation";
import { getRealSession } from "@/lib/auth-guard";

/** Met à jour les informations de contact et de facturation du client. */
export async function updateClientInfo(formData: FormData) {
  await requireRole("ADMIN");

  const userId = String(formData.get("userId") ?? "");
  if (!userId) throw new Error("Utilisateur requis.");

  await prisma.user.update({
    where: { id: userId },
    data: {
      name:        String(formData.get("name")        ?? "").trim() || undefined,
      phone:       String(formData.get("phone")       ?? "").trim() || null,
      vatNumber:   String(formData.get("vatNumber")   ?? "").trim() || null,
      address:     String(formData.get("address")     ?? "").trim() || null,
      postalCode:  String(formData.get("postalCode")  ?? "").trim() || null,
      city:        String(formData.get("city")        ?? "").trim() || null,
      country:     String(formData.get("country")     ?? "").trim() || null,
    },
  });

  revalidatePath(`/app/admin/clients/${userId}`);
  revalidatePath("/app/admin/clients");
}

/** Génère un nouveau mot de passe temporaire pour le client. */
export async function resetClientPassword(formData: FormData) {
  await requireRole("ADMIN");

  const userId = String(formData.get("userId") ?? "");
  if (!userId) throw new Error("Utilisateur requis.");

  const newPassword = [
    randomBytes(2).toString("hex"),
    randomBytes(2).toString("hex"),
    randomBytes(2).toString("hex"),
  ].join("-");

  // Hash avec le même algo que Better-Auth (scrypt N=16384, r=16, p=1, dkLen=64)
  const salt = randomBytes(16).toString("hex");
  const key = await new Promise<Buffer>((resolve, reject) => {
    const { scrypt } = require("node:crypto");
    scrypt(
      newPassword.normalize("NFKC"),
      salt,
      64,
      { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
      (err: Error | null, derived: Buffer) => {
        if (err) reject(err);
        else resolve(derived);
      },
    );
  });

  await prisma.account.updateMany({
    where: { userId, providerId: "credential" },
    data: { password: `${salt}:${key.toString("hex")}` },
  });

  const params = new URLSearchParams({ reset: "1", tempPwd: newPassword });
  redirect(`/app/admin/clients/${userId}?${params.toString()}`);
}

/** Bascule en mode "Voir comme ce client". */
export async function viewAsClient(formData: FormData) {
  const real = await getRealSession();
  if (!real) throw new Error("Non connecté.");

  const userId = String(formData.get("userId") ?? "");
  if (!userId) throw new Error("Client requis.");

  await setImpersonatedUserId(userId);
  revalidatePath("/", "layout");
  redirect("/app");
}
