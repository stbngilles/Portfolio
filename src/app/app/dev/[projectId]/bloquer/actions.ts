"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

export async function reportBlocker(projectId: string, formData: FormData) {
  const { session, role } = await requireRole("DEV", "ADMIN");
  const type = String(formData.get("type") ?? "OTHER");
  const description = String(formData.get("description") ?? "").trim();
  if (description.length < 20) throw new Error("Décrivez le blocage en au moins 20 caractères.");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projet introuvable.");
  if (role !== "ADMIN" && project.devId !== session.user.id) throw new Error("Accès refusé.");

  await prisma.blockerReport.create({
    data: { projectId, devId: session.user.id, type, description, status: "OPEN" },
  });

  // Gèle le projet si pas déjà BLOCKED
  if (project.status !== "BLOCKED") {
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "BLOCKED", blockedAt: new Date() },
    });
  }

  revalidatePath(`/app/dev/${projectId}/bloquer`);
  revalidatePath(`/app/dev/${projectId}`);
  revalidatePath(`/app/admin/blockers`);
  revalidatePath(`/app/admin`);
}
