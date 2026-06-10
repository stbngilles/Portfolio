"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";

/**
 * Flow d'annulation éthique en 3 étapes :
 *   1. requestCancellation  → raison du départ (PENDING_CANCEL)
 *   2. acceptCounterOffer   → contre-offre contextuelle (DISCOUNT_3M | PAUSE_*  | CALL)
 *      OU skipCounterOffer  → le client refuse, passe à l'étape 3
 *   3. confirmCancellation  → confirmation finale (CANCELLED, effectif fin de période)
 *
 * Le client peut TOUJOURS revenir en arrière avant l'étape 3 via reactivate().
 * La friction est de l'information, pas du blocage.
 */

export type CancelReason = "PRICE" | "QUALITY" | "NO_NEED" | "OTHER";
export type CounterOfferType =
  | "DISCOUNT_3M"
  | "PAUSE_1M"
  | "PAUSE_3M"
  | "CALL";

const VALID_REASONS: CancelReason[] = ["PRICE", "QUALITY", "NO_NEED", "OTHER"];
const VALID_OFFERS: CounterOfferType[] = [
  "DISCOUNT_3M",
  "PAUSE_1M",
  "PAUSE_3M",
  "CALL",
];

function endOfCurrentMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

async function loadOwnedSubscription(subId: string) {
  const { session, role } = await requireRole("CLIENT", "ADMIN");
  const sub = await prisma.subscription.findUnique({
    where: { id: subId },
    include: { project: { select: { id: true, name: true } } },
  });
  if (!sub) throw new Error("Abonnement introuvable.");
  if (role !== "ADMIN" && sub.clientId !== session.user.id) {
    throw new Error("Cet abonnement ne vous appartient pas.");
  }
  return sub;
}

/** Étape 1 — Le client déclare vouloir partir + sa raison. */
export async function requestCancellation(formData: FormData) {
  const subId = String(formData.get("subscriptionId") ?? "");
  const reason = String(formData.get("reason") ?? "") as CancelReason;
  const reasonText = String(formData.get("reasonText") ?? "").trim() || null;

  if (!VALID_REASONS.includes(reason)) {
    throw new Error("Veuillez choisir une raison.");
  }

  const sub = await loadOwnedSubscription(subId);
  if (sub.status === "CANCELLED") {
    throw new Error("Cet abonnement est déjà résilié.");
  }

  await prisma.subscription.update({
    where: { id: subId },
    data: {
      status: "PENDING_CANCEL",
      cancelReason: reason,
      cancelReasonText: reasonText,
      cancelRequestedAt: new Date(),
      cancelEffectiveAt: endOfCurrentMonth(),
      // On efface une éventuelle contre-offre précédente
      counterOfferType: null,
      counterOfferAcceptedAt: null,
    },
  });

  revalidatePath("/app/client/abonnements");
  revalidatePath("/app/admin/recurring");
  redirect(`/app/client/abonnements/${subId}/contre-offre`);
}

/** Étape 2 — Le client accepte une contre-offre. L'abonnement repart. */
export async function acceptCounterOffer(formData: FormData) {
  const subId = String(formData.get("subscriptionId") ?? "");
  const offerType = String(formData.get("offerType") ?? "") as CounterOfferType;

  if (!VALID_OFFERS.includes(offerType)) {
    throw new Error("Offre inconnue.");
  }

  const sub = await loadOwnedSubscription(subId);
  if (sub.status !== "PENDING_CANCEL") {
    throw new Error("Aucune annulation en cours sur cet abonnement.");
  }

  const now = new Date();
  let pausedUntil: Date | null = null;
  let newStatus: "ACTIVE" | "PAUSED" = "ACTIVE";

  if (offerType === "PAUSE_1M") {
    pausedUntil = new Date(now);
    pausedUntil.setMonth(pausedUntil.getMonth() + 1);
    newStatus = "PAUSED";
  } else if (offerType === "PAUSE_3M") {
    pausedUntil = new Date(now);
    pausedUntil.setMonth(pausedUntil.getMonth() + 3);
    newStatus = "PAUSED";
  }
  // DISCOUNT_3M et CALL ne changent pas le statut — c'est traité côté admin
  // (remise appliquée à la prochaine facture, ou prise de rdv).

  await prisma.subscription.update({
    where: { id: subId },
    data: {
      status: newStatus,
      counterOfferType: offerType,
      counterOfferAcceptedAt: now,
      pausedUntil,
      cancelRequestedAt: null,
      cancelEffectiveAt: null,
    },
  });

  revalidatePath("/app/client/abonnements");
  revalidatePath("/app/admin/recurring");
  redirect(`/app/client/abonnements?offer=${offerType}`);
}

/** Étape 3 — Confirmation finale. Aucune contre-offre acceptée. */
export async function confirmCancellation(formData: FormData) {
  const subId = String(formData.get("subscriptionId") ?? "");

  const sub = await loadOwnedSubscription(subId);
  if (sub.status !== "PENDING_CANCEL") {
    throw new Error("Aucune annulation à confirmer.");
  }

  await prisma.subscription.update({
    where: { id: subId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancelEffectiveAt: sub.cancelEffectiveAt ?? endOfCurrentMonth(),
    },
  });

  revalidatePath("/app/client/abonnements");
  revalidatePath("/app/admin/recurring");
  redirect("/app/client/abonnements?cancelled=1");
}

/** Le client change d'avis avant la fin de période → on remet ACTIVE. */
export async function reactivate(formData: FormData) {
  const subId = String(formData.get("subscriptionId") ?? "");
  const sub = await loadOwnedSubscription(subId);

  if (sub.status !== "PENDING_CANCEL" && sub.status !== "PAUSED") {
    throw new Error("Abonnement déjà actif ou résilié.");
  }

  await prisma.subscription.update({
    where: { id: subId },
    data: {
      status: "ACTIVE",
      cancelRequestedAt: null,
      cancelEffectiveAt: null,
      pausedUntil: null,
      // On garde cancelReason / counterOffer pour l'historique côté admin
    },
  });

  revalidatePath("/app/client/abonnements");
  revalidatePath("/app/admin/recurring");
}
