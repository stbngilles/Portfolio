"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { DEFAULT_PROJECT_STAGES } from "@/lib/stages";

export async function createProject(formData: FormData) {
  await requireRole("ADMIN");

  const name = String(formData.get("name") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "");
  const commercialId = String(formData.get("commercialId") ?? "") || null;
  const devId = String(formData.get("devId") ?? "") || null;

  if (!name || !clientId) {
    throw new Error("Nom et client requis.");
  }

  const project = await prisma.project.create({
    data: {
      name,
      clientId,
      commercialId: commercialId || undefined,
      devId: devId || undefined,
      status: "BRIEFING",
      stages: {
        create: DEFAULT_PROJECT_STAGES.map((s, i) => ({
          key: s.key,
          label: s.label,
          order: s.order,
          status: i === 0 ? "IN_PROGRESS" : "PENDING",
        })),
      },
    },
  });

  revalidatePath("/app/admin/projects");
  redirect(`/app/admin/projects/${project.id}`);
}

export async function setStageStatus(formData: FormData) {
  await requireRole("ADMIN");

  const stageId = String(formData.get("stageId") ?? "");
  const status = String(formData.get("status") ?? "");

  const allowed = ["PENDING", "IN_PROGRESS", "NEEDS_VALIDATION", "VALIDATED"];
  if (!stageId || !allowed.includes(status)) {
    throw new Error("Données invalides.");
  }

  const note = String(formData.get("validationNote") ?? "").trim() || null;
  const url  = String(formData.get("validationUrl")  ?? "").trim() || null;

  const stage = await prisma.projectStage.update({
    where: { id: stageId },
    data: {
      status,
      validatedAt:    status === "VALIDATED" ? new Date() : null,
      // Contexte de validation — rempli quand on passe en NEEDS_VALIDATION
      ...(status === "NEEDS_VALIDATION" ? { validationNote: note, validationUrl: url } : {}),
      // Reset contexte quand validé ou repassé en travail
      ...(status === "VALIDATED" || status === "IN_PROGRESS" ? { validationNote: null, validationUrl: null } : {}),
    },
  });

  // Auto-LIVE : si l'étape "live" (key "live") est validée,
  // on marque le projet LIVE et on pré-approuve le paiement dev.
  if (status === "VALIDATED" && stage.key === "live") {
    const proj = await prisma.project.findUnique({
      where: { id: stage.projectId },
      select: { devPaymentAmount: true, devPaymentStatus: true },
    });
    await prisma.project.update({
      where: { id: stage.projectId },
      data: {
        status: "LIVE",
        liveAt: new Date(),
        // Si rémunération définie et pas encore approuvée → approuver automatiquement
        ...(proj &&
        proj.devPaymentAmount !== null &&
        proj.devPaymentAmount > 0 &&
        proj.devPaymentStatus === "PENDING"
          ? { devPaymentStatus: "APPROVED" }
          : {}),
      },
    });
  }

  revalidatePath(`/app/admin/projects/${stage.projectId}`);
  revalidatePath(`/app/dev/${stage.projectId}`);
  revalidatePath("/app/client");
}

/**
 * Sauvegarde les notes de kick-off dans le briefData du projet.
 * Les notes sont stockées sous la clé `kickoffNotes` dans le JSON.
 */
export async function saveKickoffNotes(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  const notes = String(formData.get("kickoffNotes") ?? "").trim();
  if (!projectId) throw new Error("Projet requis.");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { briefData: true },
  });
  if (!project) throw new Error("Projet introuvable.");

  let existing: Record<string, unknown> = {};
  try {
    existing = JSON.parse(project.briefData ?? "{}");
  } catch {
    existing = {};
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      briefData: JSON.stringify({ ...existing, kickoffNotes: notes }),
    },
  });

  revalidatePath(`/app/admin/projects/${projectId}`);
  revalidatePath(`/app/dev/${projectId}`);
}

/**
 * L'admin marque un projet comme LIVE (terminé et livré en production).
 */
export async function markProjectLive(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Projet requis.");

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "LIVE", liveAt: new Date() },
  });

  revalidatePath(`/app/admin/projects/${projectId}`);
  revalidatePath("/app/admin/projects");
  revalidatePath(`/app/dev/${projectId}`);
  revalidatePath("/app/client");
}

export async function clientValidateStage(formData: FormData) {
  // Action côté client : "Je valide cette étape." → horodaté + débloque la suivante.
  const { session } = await requireRole("CLIENT", "ADMIN");

  const stageId = String(formData.get("stageId") ?? "");
  if (!stageId) throw new Error("Stage requis.");

  const stage = await prisma.projectStage.findUnique({
    where: { id: stageId },
    include: { project: true },
  });
  if (!stage) throw new Error("Étape introuvable.");
  if (stage.project.clientId !== session.user.id) {
    throw new Error("Ce n'est pas votre projet.");
  }
  if (stage.status !== "NEEDS_VALIDATION") {
    throw new Error("Cette étape n'est pas en attente de validation.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.projectStage.update({
      where: { id: stageId },
      data: {
        status: "VALIDATED",
        validatedAt: new Date(),
        validatedBy: session.user.id,
      },
    });

    // Débloque l'étape suivante
    const next = await tx.projectStage.findFirst({
      where: { projectId: stage.projectId, order: { gt: stage.order } },
      orderBy: { order: "asc" },
    });
    if (next && next.status === "PENDING") {
      await tx.projectStage.update({
        where: { id: next.id },
        data: { status: "IN_PROGRESS" },
      });
    }

    // Auto-LIVE si l'étape "live" est validée par le client
    if (stage.key === "live") {
      const proj = await tx.project.findUnique({
        where: { id: stage.projectId },
        select: { devPaymentAmount: true, devPaymentStatus: true },
      });
      await tx.project.update({
        where: { id: stage.projectId },
        data: {
          status: "LIVE",
          liveAt: new Date(),
          ...(proj &&
          proj.devPaymentAmount !== null &&
          proj.devPaymentAmount > 0 &&
          proj.devPaymentStatus === "PENDING"
            ? { devPaymentStatus: "APPROVED" }
            : {}),
        },
      });
    }
  });

  revalidatePath("/app/client");
  revalidatePath(`/app/admin/projects/${stage.projectId}`);
}
