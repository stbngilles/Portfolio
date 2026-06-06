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

  const stage = await prisma.projectStage.update({
    where: { id: stageId },
    data: {
      status,
      validatedAt: status === "VALIDATED" ? new Date() : null,
    },
  });

  revalidatePath(`/app/admin/projects/${stage.projectId}`);
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
  });

  revalidatePath("/app/client");
  revalidatePath(`/app/admin/projects/${stage.projectId}`);
}
