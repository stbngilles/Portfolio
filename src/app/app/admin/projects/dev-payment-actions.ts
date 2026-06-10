"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

export async function setDevPayment(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  const amountEuros = Number(formData.get("amount") ?? 0);
  if (!projectId) throw new Error("Projet requis.");
  if (!Number.isFinite(amountEuros) || amountEuros < 0) {
    throw new Error("Montant invalide.");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { devPaymentAmount: Math.round(amountEuros * 100) },
  });

  revalidatePath(`/app/admin/projects/${projectId}`);
}

export async function toggleDevPaymentStatus(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Projet requis.");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) throw new Error("Projet introuvable.");

  await prisma.project.update({
    where: { id: projectId },
    data:
      project.devPaymentStatus === "PAID"
        ? { devPaymentStatus: "PENDING", devPaymentPaidAt: null }
        : { devPaymentStatus: "PAID", devPaymentPaidAt: new Date() },
  });

  revalidatePath(`/app/admin/projects/${projectId}`);
  revalidatePath("/app/admin/projects");
}

export async function approveDevPayment(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Projet requis.");
  await prisma.project.update({
    where: { id: projectId },
    data: { devPaymentStatus: "APPROVED" },
  });
  revalidatePath("/app/admin/finances");
  revalidatePath(`/app/admin/projects/${projectId}`);
}

export async function markDevPaymentPaid(formData: FormData) {
  await requireRole("ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Projet requis.");
  await prisma.project.update({
    where: { id: projectId },
    data: { devPaymentStatus: "PAID", devPaymentPaidAt: new Date() },
  });
  revalidatePath("/app/admin/finances");
  revalidatePath(`/app/admin/projects/${projectId}`);
  revalidatePath("/app/dev/paiements");
  revalidatePath("/app/comptable");
}
