"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { maybePublishToDevPool } from "@/lib/automations";

/**
 * Sauvegarde les notes de brief (auto-save partiel).
 * Ne marque pas le brief comme complet.
 */
export async function saveBriefNotes(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Projet requis.");

  const brief = {
    callNotes: String(formData.get("callNotes") ?? ""),
    brandColors: String(formData.get("brandColors") ?? ""),
    brandPersonality: String(formData.get("brandPersonality") ?? ""),
    siteReferences: String(formData.get("siteReferences") ?? ""),
    sitesToAvoid: String(formData.get("sitesToAvoid") ?? ""),
    technicalRequirements: String(formData.get("technicalRequirements") ?? ""),
    specificRequests: String(formData.get("specificRequests") ?? ""),
    estimatedDays: Number(formData.get("estimatedDays") ?? 0) || null,
  };

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { briefData: true },
  });
  if (!project) throw new Error("Projet introuvable.");

  let existing: Record<string, unknown> = {};
  try { existing = JSON.parse(project.briefData ?? "{}"); } catch { /* ignore */ }

  await prisma.project.update({
    where: { id: projectId },
    data: { briefData: JSON.stringify({ ...existing, brief }) },
  });

  revalidatePath(`/app/admin/brief/${projectId}`);
  revalidatePath(`/app/admin/projects/${projectId}`);
  revalidatePath(`/app/dev/${projectId}`);
}

/**
 * Marque le brief comme complet → publie dans le pool si acompte aussi payé.
 */
export async function completeBrief(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Projet requis.");

  // Sauvegarder les notes en même temps
  await saveBriefNotes(formData);

  // Marquer le kick-off (= brief) comme fait
  await prisma.project.update({
    where: { id: projectId },
    data: { kickoffDone: true, kickoffAt: new Date() },
  });

  // Tenter de publier dans le pool (si acompte aussi payé)
  await maybePublishToDevPool(projectId);

  revalidatePath(`/app/admin/brief/${projectId}`);
  revalidatePath(`/app/admin/projects/${projectId}`);
  revalidatePath("/app/admin/kickoff");
  revalidatePath("/app/dev/disponibles");

  redirect(`/app/admin/projects/${projectId}`);
}
