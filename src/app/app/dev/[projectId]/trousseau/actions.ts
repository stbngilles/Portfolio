"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { encryptSecret } from "@/lib/crypto";

export async function addCredential(projectId: string, formData: FormData) {
  // Admin ET Dev peuvent ajouter des accès (le dev installe Vercel, configure le domaine, etc.)
  const { session, role } = await requireRole("DEV", "ADMIN");

  // Le dev ne peut ajouter que sur ses propres projets
  if (role === "DEV") {
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { devId: true } });
    if (!project || project.devId !== session.user.id) throw new Error("Ce n'est pas votre projet.");
  }
  const data = {
    projectId,
    label: String(formData.get("label") ?? "").trim(),
    service: String(formData.get("service") ?? "OTHER"),
    url: String(formData.get("url") ?? "").trim() || null,
    username: String(formData.get("username") ?? "").trim() || null,
    // Secrets chiffrés au repos.
    password: encryptSecret(String(formData.get("password") ?? "").trim() || null),
    apiKey: encryptSecret(String(formData.get("apiKey") ?? "").trim() || null),
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
  if (!data.label) throw new Error("Libellé requis.");
  await prisma.projectCredential.create({ data });
  revalidatePath(`/app/dev/${projectId}/trousseau`);
  revalidatePath(`/app/admin/coffre-fort`);
}

export async function deleteCredential(credentialId: string) {
  await requireRole("ADMIN");
  const c = await prisma.projectCredential.findUnique({ where: { id: credentialId } });
  if (!c) throw new Error("Introuvable.");
  await prisma.projectCredential.delete({ where: { id: credentialId } });
  revalidatePath(`/app/dev/${c.projectId}/trousseau`);
  revalidatePath(`/app/admin/coffre-fort`);
}
