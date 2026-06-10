"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

export async function sendMessage(projectId: string, formData: FormData) {
  const { session, role } = await requireRole("DEV", "ADMIN");
  if (role !== "ADMIN" && role !== "DEV") throw new Error("Accès refusé.");

  const content = String(formData.get("content") ?? "").trim();
  if (!content || content.length < 2) throw new Error("Message vide.");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projet introuvable.");
  if (role !== "ADMIN" && project.devId !== session.user.id) throw new Error("Accès refusé.");

  await prisma.message.create({
    data: { projectId, senderId: session.user.id, senderRole: role, content },
  });

  // Marquer les messages non lus de l'autre partie comme lus
  const otherRole = role === "ADMIN" ? "DEV" : "ADMIN";
  await prisma.message.updateMany({
    where: { projectId, senderRole: otherRole, readAt: null },
    data: { readAt: new Date() },
  });

  revalidatePath(`/app/dev/${projectId}/messages`);
  revalidatePath(`/app/admin/messages/${projectId}`);
  revalidatePath(`/app/admin/messages`);
  revalidatePath(`/app/dev`);
}
