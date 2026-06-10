"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

export async function markMaintenanceDone(taskId: string, formData: FormData) {
  const { session } = await requireRole("DEV", "ADMIN");
  const report = String(formData.get("report") ?? "").trim();
  if (report.length < 20) throw new Error("Rapport trop court (min. 20 caractères).");

  await prisma.maintenanceTask.update({
    where: { id: taskId },
    data: { status: "DONE", doneAt: new Date(), doneBy: session.user.id, report },
  });

  revalidatePath("/app/dev/maintenance");
  revalidatePath("/app/admin");
}
