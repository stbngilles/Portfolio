"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

/**
 * Le dev peut marquer une étape :
 *  - PENDING → IN_PROGRESS  (il commence)
 *  - IN_PROGRESS → NEEDS_VALIDATION  (il demande la validation au client)
 *
 * VALIDATED est réservé à l'admin et au client.
 */
export async function advanceStage(formData: FormData) {
  const { session, role } = await requireRole("DEV", "ADMIN");

  const stageId   = String(formData.get("stageId")  ?? "");
  const newStatus = String(formData.get("status")    ?? "");
  const devNote   = String(formData.get("devNote")   ?? "").trim() || null;
  const devUrl    = String(formData.get("devUrl")    ?? "").trim() || null;

  const allowed = ["IN_PROGRESS", "NEEDS_VALIDATION"];
  if (!stageId || !allowed.includes(newStatus)) {
    throw new Error("Transition non autorisée.");
  }

  const stage = await prisma.projectStage.findUnique({
    where: { id: stageId },
    include: { project: true },
  });
  if (!stage) throw new Error("Étape introuvable.");

  // Un dev ne peut avancer que ses propres projets.
  if (role !== "ADMIN" && stage.project.devId !== session.user.id) {
    throw new Error("Ce n'est pas votre projet.");
  }

  // Vérification de la transition
  const validTransitions: Record<string, string[]> = {
    PENDING: ["IN_PROGRESS"],
    IN_PROGRESS: ["NEEDS_VALIDATION"],
  };
  const current = stage.status;
  if (!(validTransitions[current] ?? []).includes(newStatus)) {
    throw new Error(`Impossible de passer de ${current} à ${newStatus}.`);
  }

  await prisma.projectStage.update({
    where: { id: stageId },
    data: {
      status: newStatus,
      // Quand le dev soumet pour validation, on sauvegarde sa note et son URL
      ...(newStatus === "NEEDS_VALIDATION" ? { devNote, devUrl } : {}),
      // Quand il redémarre, on efface
      ...(newStatus === "IN_PROGRESS" ? { devNote: null, devUrl: null } : {}),
    },
  });

  revalidatePath(`/app/dev/${stage.projectId}`);
  revalidatePath(`/app/admin/projects/${stage.projectId}`);
  revalidatePath("/app/dev");
}
