"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { maybePublishToDevPool } from "@/lib/automations";

export async function markKickoffDone(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Projet manquant.");

  await prisma.project.update({
    where: { id: projectId },
    data: { kickoffDone: true, kickoffAt: new Date() },
  });

  await maybePublishToDevPool(projectId);

  revalidatePath("/app/admin/kickoff");
  revalidatePath(`/app/admin/projects/${projectId}`);
  revalidatePath("/app/dev/disponibles");
}

export async function scheduleKickoff(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  const at = String(formData.get("kickoffAt") ?? "");
  if (!projectId || !at) throw new Error("Champs manquants.");

  await prisma.project.update({
    where: { id: projectId },
    data: { kickoffAt: new Date(at) },
  });

  revalidatePath("/app/admin/kickoff");
}
