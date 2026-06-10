"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { QUOTE_TRANSITIONS } from "./pipeline-config";

export async function advanceQuoteStatus(formData: FormData) {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");
  const quoteId = String(formData.get("quoteId") ?? "");
  const nextStatus = String(formData.get("nextStatus") ?? "");
  if (!quoteId || !nextStatus) throw new Error("Données manquantes.");

  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote) throw new Error("Devis introuvable.");

  // Un commercial ne peut avancer que ses propres devis (sauf ADMIN).
  if (role !== "ADMIN" && quote.commercialId !== session.user.id) {
    throw new Error("Ce n'est pas votre devis.");
  }

  const allowed = QUOTE_TRANSITIONS[quote.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(`Transition ${quote.status} → ${nextStatus} interdite.`);
  }

  const extra: Record<string, unknown> = {};
  if (nextStatus === "SENT") extra.sentAt = new Date();
  if (
    nextStatus === "SIGNED_AWAITING_DEPOSIT" ||
    nextStatus === "COLLECTING_ASSETS"
  ) {
    if (!quote.signedAt) extra.signedAt = new Date();
  }

  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: nextStatus, ...extra },
  });

  revalidatePath("/app/commercial/pipeline");
  revalidatePath(`/app/commercial/devis/${quoteId}`);
}
