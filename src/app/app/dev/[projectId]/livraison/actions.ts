"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

export async function submitDelivery(projectId: string, formData: FormData) {
  const { session, role } = await requireRole("DEV", "ADMIN");
  const preprodUrl = String(formData.get("preprodUrl") ?? "").trim();
  const deploymentNotes = String(formData.get("deploymentNotes") ?? "").trim();

  if (!preprodUrl) throw new Error("URL de pré-production requise.");
  if (deploymentNotes.length < 20) throw new Error("Notes de déploiement trop courtes (min. 20 caractères).");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projet introuvable.");
  if (role !== "ADMIN" && project.devId !== session.user.id) throw new Error("Accès refusé.");

  // Récupère le round précédent
  const last = await prisma.deliverySubmission.findFirst({
    where: { projectId },
    orderBy: { round: "desc" },
  });
  const round = (last?.round ?? 0) + 1;

  await prisma.deliverySubmission.create({
    data: {
      projectId,
      devId: session.user.id,
      preprodUrl,
      deploymentNotes,
      round,
      status: "PENDING",
    },
  });

  // Met à jour le statut projet
  await prisma.project.update({
    where: { id: projectId },
    data: { status: "QA_REVIEW" },
  });

  revalidatePath(`/app/dev/${projectId}/livraison`);
  revalidatePath(`/app/dev/${projectId}`);
  revalidatePath(`/app/admin/qa`);
}

export async function markQAItemFixed(itemId: string, userId: string) {
  await requireRole("DEV", "ADMIN");
  await prisma.qAItem.update({
    where: { id: itemId },
    data: { fixedAt: new Date(), fixedBy: userId },
  });
  const item = await prisma.qAItem.findUnique({
    where: { id: itemId },
    include: { submission: true },
  });
  if (item) {
    revalidatePath(`/app/dev/${item.submission.projectId}/livraison`);
    revalidatePath(`/app/dev/${item.submission.projectId}/qa`);
    revalidatePath(`/app/admin/qa`);
  }
}
