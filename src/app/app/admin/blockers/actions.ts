"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

export async function resolveBlocker(blockerId: string, formData: FormData) {
  const { session } = await requireRole("ADMIN");
  const adminNote = String(formData.get("adminNote") ?? "").trim();
  if (adminNote.length < 10) throw new Error("Note de résolution trop courte.");

  const blocker = await prisma.blockerReport.findUnique({
    where: { id: blockerId },
    select: { id: true, projectId: true, status: true },
  });
  if (!blocker) throw new Error("Blocage introuvable.");
  if (blocker.status === "RESOLVED") throw new Error("Déjà résolu.");

  await prisma.blockerReport.update({
    where: { id: blockerId },
    data: {
      status: "RESOLVED",
      adminNote,
      resolvedAt: new Date(),
      resolvedBy: session.user.id,
    },
  });

  // S'il n'y a plus de blocage ouvert sur le projet, on dégèle.
  const stillOpen = await prisma.blockerReport.count({
    where: { projectId: blocker.projectId, status: "OPEN" },
  });
  if (stillOpen === 0) {
    await prisma.project.update({
      where: { id: blocker.projectId },
      data: { status: "DEV", blockedAt: null },
    });
  }

  revalidatePath("/app/admin/blockers");
  revalidatePath(`/app/admin/projects/${blocker.projectId}`);
  revalidatePath(`/app/dev/${blocker.projectId}`);
  revalidatePath(`/app/dev/${blocker.projectId}/bloquer`);
  revalidatePath("/app/admin");
}
