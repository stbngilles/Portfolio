"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

const ACTIVE_STATUSES = ["BRIEFING", "DESIGN", "DEV", "CONTENT"] as const;

/**
 * Réclame un projet du pool.
 * - Règle pour DEV : un seul projet actif à la fois.
 * - ADMIN : exempté de la règle (peut piloter plusieurs projets en parallèle).
 */
export async function claimProject(formData: FormData) {
  const { session, role } = await requireRole("DEV", "ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Projet requis.");

  if (role !== "ADMIN") {
    const current = await prisma.project.findFirst({
      where: {
        devId: session.user.id,
        status: { in: [...ACTIVE_STATUSES] },
      },
    });
    if (current) {
      throw new Error(
        `Vous avez déjà un projet en cours : "${current.name}". Demandez à le relâcher avant d'en prendre un autre.`,
      );
    }
  }

  const target = await prisma.project.findUnique({ where: { id: projectId } });
  if (!target) throw new Error("Projet introuvable.");
  if (target.devId && target.devId !== session.user.id) {
    throw new Error("Ce projet a déjà été pris par un autre dev.");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      devId: session.user.id,
      // Passer en BRIEFING dès que quelqu'un prend la mission,
      // sinon le projet reste en READY_FOR_DEV et n'apparaît pas dans "Mes projets".
      status: "BRIEFING",
      startedAt: new Date(),
      // Quand l'admin prend lui-même un projet, pas de rémunération dev.
      ...(role === "ADMIN" ? { devPaymentAmount: 0, devPaymentStatus: "PAID" } : {}),
    },
  });

  revalidatePath("/app/dev");
  revalidatePath("/app/dev/disponibles");
  revalidatePath("/app/admin/projects");
  redirect("/app/dev");
}

/**
 * Le dev DEMANDE à relâcher son projet — il ne peut pas le faire seul.
 * Crée une ReleaseRequest en statut PENDING. L'admin l'examine ensuite.
 *
 * L'admin peut, lui, relâcher directement sans passer par ce flux (raccourci
 * en bas de la fonction).
 */
export async function requestRelease(formData: FormData) {
  const { session, role } = await requireRole("DEV", "ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!projectId) throw new Error("Projet requis.");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projet introuvable.");

  // L'admin a un raccourci : il peut libérer directement.
  if (role === "ADMIN") {
    await prisma.project.update({
      where: { id: projectId },
      data: { devId: null },
    });
    revalidatePath("/app/admin/projects");
    revalidatePath(`/app/admin/projects/${projectId}`);
    revalidatePath("/app/dev/disponibles");
    return;
  }

  if (project.devId !== session.user.id) {
    throw new Error("Ce n'est pas votre projet.");
  }
  if (reason.length < 20) {
    throw new Error(
      "Merci de détailler votre rapport (au moins 20 caractères) : où en êtes-vous, ce qui bloque, etc.",
    );
  }

  // Pas de doublon : si une demande PENDING existe déjà, on l'écrase.
  const existing = await prisma.releaseRequest.findFirst({
    where: { projectId, devId: session.user.id, status: "PENDING" },
  });
  if (existing) {
    await prisma.releaseRequest.update({
      where: { id: existing.id },
      data: { reason, updatedAt: new Date() },
    });
  } else {
    await prisma.releaseRequest.create({
      data: {
        projectId,
        devId: session.user.id,
        reason,
        status: "PENDING",
      },
    });
  }

  revalidatePath("/app/dev");
  revalidatePath("/app/admin/release-requests");
}

export async function cancelReleaseRequest(formData: FormData) {
  const { session } = await requireRole("DEV", "ADMIN");
  const requestId = String(formData.get("requestId") ?? "");
  const req = await prisma.releaseRequest.findUnique({
    where: { id: requestId },
  });
  if (!req) throw new Error("Demande introuvable.");
  if (req.devId !== session.user.id) throw new Error("Pas votre demande.");
  if (req.status !== "PENDING")
    throw new Error("Cette demande a déjà été tranchée.");

  await prisma.releaseRequest.delete({ where: { id: requestId } });
  revalidatePath("/app/dev");
  revalidatePath("/app/admin/release-requests");
}
