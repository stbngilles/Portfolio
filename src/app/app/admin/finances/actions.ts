"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { onInvoicePaid } from "@/lib/automations";
import { sendInvoiceReminder } from "@/lib/email";
import { formatPrice } from "@/lib/pricing";

export async function markInvoicePaid(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("invoiceId") ?? "");
  if (!id) throw new Error("Facture requise.");

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) throw new Error("Facture introuvable.");
  if (invoice.status === "PAID") return;

  await prisma.invoice.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });

  await onInvoicePaid(id);

  revalidatePath("/app/admin/finances");
  revalidatePath("/app/client/factures");
  if (invoice.projectId) revalidatePath(`/app/admin/projects/${invoice.projectId}`);
}

export async function relanceInvoice(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("invoiceId") ?? "");
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { project: { select: { name: true } } },
  });
  if (!invoice) throw new Error("Facture introuvable.");
  const client = await prisma.user.findUnique({
    where: { id: invoice.clientId },
    select: { email: true, name: true },
  });
  if (!client) throw new Error("Client introuvable.");

  await sendInvoiceReminder({
    clientEmail: client.email,
    clientName: client.name ?? client.email,
    invoiceNumber: invoice.number,
    amountEuros: formatPrice(invoice.amount),
    dueDate: invoice.dueDate?.toLocaleDateString("fr-BE") ?? "—",
  });

  revalidatePath("/app/admin/finances");
}
