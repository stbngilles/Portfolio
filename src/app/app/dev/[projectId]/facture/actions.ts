"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

export async function uploadDevInvoice(projectId: string, formData: FormData) {
  const { session, role } = await requireRole("DEV", "ADMIN");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projet introuvable.");
  if (role !== "ADMIN" && project.devId !== session.user.id)
    throw new Error("Accès refusé.");

  // L'upload n'est autorisé qu'une fois la mission validée par l'agence.
  const allowed = ["VALIDATED", "LIVE", "CLOSED"];
  if (!allowed.includes(project.status))
    throw new Error("Vous ne pouvez déposer votre facture qu'après validation de la mission.");

  const url = String(formData.get("invoiceUrl") ?? "").trim();
  const filename = String(formData.get("invoiceFilename") ?? "").trim();

  if (!/^https?:\/\//.test(url))
    throw new Error("URL invalide — collez un lien public (Drive, Dropbox…).");
  if (filename.length < 3)
    throw new Error("Donnez un nom de fichier reconnaissable (ex. PB-2026-0042.pdf).");

  await prisma.project.update({
    where: { id: projectId },
    data: {
      devInvoiceUrl: url,
      devInvoiceFilename: filename,
      devInvoiceUploadedAt: new Date(),
      devPaymentStatus:
        project.devPaymentStatus === "PENDING" ? "PENDING" : project.devPaymentStatus,
    },
  });

  revalidatePath(`/app/dev/${projectId}/facture`);
  revalidatePath("/app/dev/paiements");
  revalidatePath("/app/admin/finances");
  revalidatePath(`/app/admin/projects/${projectId}`);
}
