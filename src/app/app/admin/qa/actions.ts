"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

export async function approveDelivery(formData: FormData) {
  const { session } = await requireRole("ADMIN");
  const submissionId = String(formData.get("submissionId") ?? "");
  if (!submissionId) throw new Error("ID requis.");

  const sub = await prisma.deliverySubmission.findUnique({ where: { id: submissionId }, include: { project: true } });
  if (!sub) throw new Error("Soumission introuvable.");

  await prisma.$transaction(async (tx) => {
    await tx.deliverySubmission.update({
      where: { id: submissionId },
      data: { status: "APPROVED", reviewedAt: new Date(), reviewedBy: session.user.id },
    });
    await tx.project.update({
      where: { id: sub.projectId },
      data: { status: "VALIDATED" },
    });
  });

  revalidatePath("/app/admin/qa");
  revalidatePath(`/app/dev/${sub.projectId}/livraison`);
}

export async function requestChanges(formData: FormData) {
  const { session } = await requireRole("ADMIN");
  const submissionId = String(formData.get("submissionId") ?? "");
  const feedback = String(formData.get("feedback") ?? "").trim();
  const itemsRaw = String(formData.get("qaItems") ?? "");

  if (!submissionId) throw new Error("ID requis.");

  const sub = await prisma.deliverySubmission.findUnique({
    where: { id: submissionId },
    include: { project: true },
  });
  if (!sub) throw new Error("Soumission introuvable.");

  // Parse items — un par ligne. Format :
  //   Description | https://loom.com/... | https://drive.google.com/...
  // Tout ce qui suit le premier "|" sont des URLs d'attachements (captures, vidéos).
  const items = itemsRaw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((raw, i) => {
      const parts = raw.split("|").map((p) => p.trim());
      const description = parts[0];
      const attachmentUrls = parts
        .slice(1)
        .filter((p) => /^https?:\/\//.test(p))
        .join("\n");
      return {
        submissionId,
        description,
        priority: description.toUpperCase().startsWith("[BLOQUANT]") ? "BLOCKING" : "NORMAL",
        order: i,
        attachmentUrls: attachmentUrls || null,
      };
    });

  await prisma.$transaction(async (tx) => {
    await tx.deliverySubmission.update({
      where: { id: submissionId },
      data: {
        status: "NEEDS_CHANGES",
        adminFeedback: feedback || null,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });
    if (items.length > 0) {
      await tx.qAItem.createMany({ data: items });
    }
    await tx.project.update({
      where: { id: sub.projectId },
      data: { status: "DEV" },
    });
  });

  revalidatePath("/app/admin/qa");
  revalidatePath(`/app/dev/${sub.projectId}/livraison`);
  revalidatePath(`/app/dev/${sub.projectId}/qa`);
}
