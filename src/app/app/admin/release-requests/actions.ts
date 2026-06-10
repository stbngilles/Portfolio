"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

export async function acceptReleaseRequest(formData: FormData) {
  const { session } = await requireRole("ADMIN");
  const requestId = String(formData.get("requestId") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim() || null;

  const req = await prisma.releaseRequest.findUnique({
    where: { id: requestId },
    include: { project: true },
  });
  if (!req) throw new Error("Demande introuvable.");
  if (req.status !== "PENDING")
    throw new Error("Cette demande a déjà été tranchée.");

  await prisma.$transaction(async (tx) => {
    // 1) Libère le projet (s'il est encore assigné à ce dev)
    if (req.project.devId === req.devId) {
      await tx.project.update({
        where: { id: req.projectId },
        data: { devId: null },
      });
    }
    // 2) Marque la demande comme acceptée
    await tx.releaseRequest.update({
      where: { id: requestId },
      data: {
        status: "ACCEPTED",
        adminNote,
        decidedAt: new Date(),
        decidedBy: session.user.id,
      },
    });
  });

  revalidatePath("/app/admin/release-requests");
  revalidatePath("/app/admin/projects");
  revalidatePath("/app/dev");
  revalidatePath("/app/dev/disponibles");
}

export async function refuseReleaseRequest(formData: FormData) {
  const { session } = await requireRole("ADMIN");
  const requestId = String(formData.get("requestId") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim();

  if (adminNote.length < 5) {
    throw new Error(
      "Précisez une raison de refus (au moins 5 caractères) pour le dev.",
    );
  }

  const req = await prisma.releaseRequest.findUnique({
    where: { id: requestId },
  });
  if (!req) throw new Error("Demande introuvable.");
  if (req.status !== "PENDING")
    throw new Error("Cette demande a déjà été tranchée.");

  await prisma.releaseRequest.update({
    where: { id: requestId },
    data: {
      status: "REFUSED",
      adminNote,
      decidedAt: new Date(),
      decidedBy: session.user.id,
    },
  });

  revalidatePath("/app/admin/release-requests");
  revalidatePath("/app/dev");
}
