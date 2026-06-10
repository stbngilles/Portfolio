"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { requireRole } from "@/lib/auth-guard";
import { DEFAULT_PROJECT_STAGES } from "@/lib/stages";
import { onProjectCreatedFromQuote } from "@/lib/automations";
import {
  SITES,
  OPTIONS,
  RECURRING,
  LAUNCH_PACK,
  COMMISSION_RATES,
  getOptionUnitPrice,
  type SiteKey,
  type OptionKey,
  type RecurringKey,
} from "@/lib/pricing";

export interface QuoteDraft {
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientPhone?: string;
  clientVat?: string;
  clientAddress?: string;
  clientPostalCode?: string;
  clientCity?: string;
  clientCountry?: string;
  notes?: string;
  site: {
    key: SiteKey;
    customPrice?: number; // pour sur_mesure
  } | null;
  options: Array<{
    key: OptionKey;
    qty: number;
    customPrice?: number;
  }>;
  recurring: RecurringKey[];
  launchPack: boolean;
  // Services récurrents exécutés par le commercial lui-même.
  // → commission 100 % au lieu du split 15 % commercial / 85 % producteur.
  selfProducedServices: RecurringKey[];
}

async function generateQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.quote.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });
  return `PB-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function createQuote(rawDraft: string) {
  const { session } = await requireRole("COMMERCIAL", "ADMIN");
  const draft = JSON.parse(rawDraft) as QuoteDraft;

  if (!draft.clientName || !draft.clientEmail) {
    throw new Error("Nom et email du prospect requis.");
  }

  const lines: Array<{
    label: string;
    category: "SITE" | "OPTION" | "RECURRING" | "LAUNCH_PACK";
    quantity: number;
    unitPrice: number;
    isRecurring: boolean;
  }> = [];

  let totalOneShot = 0;
  let totalRecurring = 0;

  // Site
  if (draft.site) {
    const site = SITES.find((s) => s.key === draft.site!.key);
    if (site) {
      const price = draft.site.customPrice ?? site.basePrice;
      lines.push({
        label: `Site ${site.label}`,
        category: "SITE",
        quantity: 1,
        unitPrice: price,
        isRecurring: false,
      });
      totalOneShot += price;
    }
  }

  // Options
  for (const o of draft.options) {
    const opt = OPTIONS.find((x) => x.key === o.key);
    if (!opt) continue;
    const unit = getOptionUnitPrice(
      o.key,
      draft.site?.key ?? null,
      o.customPrice,
    );
    const qty = Math.max(1, o.qty | 0);
    lines.push({
      label: opt.label,
      category: "OPTION",
      quantity: qty,
      unitPrice: unit,
      isRecurring: false,
    });
    totalOneShot += unit * qty;
  }

  // Pack lancement (one-shot mais traité à part)
  if (draft.launchPack) {
    lines.push({
      label: LAUNCH_PACK.label,
      category: "LAUNCH_PACK",
      quantity: 1,
      unitPrice: LAUNCH_PACK.price,
      isRecurring: false,
    });
    totalOneShot += LAUNCH_PACK.price;
  }

  // Récurrent
  for (const key of draft.recurring) {
    const rec = RECURRING.find((r) => r.key === key);
    if (!rec) continue;
    lines.push({
      label: rec.label,
      category: "RECURRING",
      quantity: 1,
      unitPrice: rec.monthlyPrice,
      isRecurring: true,
    });
    totalRecurring += rec.monthlyPrice;
  }

  const number = await generateQuoteNumber();

  // Détection des cas qui doivent passer en revue admin avant envoi client :
  // site sur-mesure (prix négocié) ou option photo personnalisée.
  const needsAdminReview =
    draft.site?.key === "sur_mesure" ||
    draft.options.some((o) => o.key === "photo_session" && (o.customPrice ?? 0) > 0);

  const quote = await prisma.quote.create({
    data: {
      number,
      commercialId: session.user.id,
      clientName:       draft.clientName.trim(),
      clientEmail:      draft.clientEmail.trim().toLowerCase(),
      clientCompany:    draft.clientCompany?.trim()    || null,
      clientPhone:      draft.clientPhone?.trim()      || null,
      clientVat:        draft.clientVat?.trim()        || null,
      clientAddress:    draft.clientAddress?.trim()    || null,
      clientPostalCode: draft.clientPostalCode?.trim() || null,
      clientCity:       draft.clientCity?.trim()       || null,
      clientCountry:    draft.clientCountry?.trim()    || "BE",
      notes:            draft.notes?.trim()            || null,
      producerServices: draft.selfProducedServices.length
        ? JSON.stringify(draft.selfProducedServices)
        : null,
      status: "DRAFT",
      needsAdminReview,
      totalOneShot,
      totalRecurring,
      lines: { create: lines },
    },
  });

  revalidatePath("/app/commercial/devis");
  redirect(`/app/commercial/devis/${quote.id}`);
}

export async function markQuoteSent(formData: FormData) {
  const { session, role } = await requireRole("COMMERCIAL", "ADMIN");
  const id = String(formData.get("id") ?? "");
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) throw new Error("Devis introuvable.");
  if (quote.commercialId !== session.user.id && role !== "ADMIN") {
    throw new Error("Pas votre devis.");
  }
  if (quote.needsAdminReview && !quote.adminReviewedAt && role !== "ADMIN") {
    throw new Error(
      "Ce devis contient un sur-mesure : l'admin doit le valider avant l'envoi au client.",
    );
  }
  await prisma.quote.update({
    where: { id },
    data: { status: "SENT", sentAt: new Date() },
  });
  revalidatePath(`/app/commercial/devis/${id}`);
  revalidatePath(`/app/commercial/devis`);
}

// =====================================================================
// REVUE ADMIN (devis sur-mesure)
// =====================================================================

export async function approveQuoteReview(formData: FormData) {
  const { session } = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;
  await prisma.quote.update({
    where: { id },
    data: {
      adminReviewedAt: new Date(),
      adminReviewNote: note,
    },
  });
  revalidatePath(`/app/commercial/devis/${id}`);
  revalidatePath(`/app/admin/projects`);
  revalidatePath(`/app/admin/quotes-review`);
}

export async function markQuoteSigned(formData: FormData) {
  await requireRole("COMMERCIAL", "ADMIN");
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.quote.findUnique({
    where: { id },
    select: { project: { select: { id: true } } },
  });
  await prisma.quote.update({
    where: { id },
    data: { status: "SIGNED", signedAt: new Date() },
  });
  revalidatePath(`/app/commercial/devis/${id}`);
  revalidatePath(`/app/commercial/devis`);

  // Auto-conversion en projet si pas déjà fait — c'est le pivot de tout le pipeline.
  if (!existing?.project) {
    const fd = new FormData();
    fd.set("id", id);
    await convertQuoteToProject(fd);
  }
}

export async function markQuoteLost(formData: FormData) {
  await requireRole("COMMERCIAL", "ADMIN");
  const id = String(formData.get("id") ?? "");
  await prisma.quote.update({ where: { id }, data: { status: "LOST" } });
  revalidatePath(`/app/commercial/devis/${id}`);
  revalidatePath(`/app/commercial/devis`);
}

// =====================================================================
// CONVERSION DEVIS → PROJET (l'automatisation à la signature)
// =====================================================================

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });
  return `PB-INV-${year}-${String(count + 1).padStart(4, "0")}`;
}

/**
 * À la signature d'un devis : crée tout ce qui s'enchaîne.
 *  - Crée le compte client s'il n'existe pas (mot de passe temporaire)
 *  - Crée le projet + 6 étapes par défaut
 *  - Émet la première facture (50 % d'acompte)
 *  - Crée l'abonnement consolidé si récurrent
 *  - Inscrit les commissions du commercial
 *
 * Idempotent : si le devis a déjà un projet lié, on redirige vers ce projet.
 */
export async function convertQuoteToProject(formData: FormData) {
  const { session } = await requireRole("COMMERCIAL", "ADMIN");
  const id = String(formData.get("id") ?? "");

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { lines: true, project: true },
  });
  if (!quote) throw new Error("Devis introuvable.");
  if (quote.status !== "SIGNED") {
    throw new Error("Le devis doit être marqué comme signé avant conversion.");
  }
  if (quote.project) {
    // Déjà converti — on redirige simplement.
    redirect(`/app/admin/projects/${quote.project.id}`);
  }

  // 1) Trouve ou crée le compte client.
  let client = await prisma.user.findUnique({
    where: { email: quote.clientEmail },
  });
  let tempPassword: string | null = null;

  if (!client) {
    tempPassword = randomBytes(6).toString("hex"); // 12 chars
    // Via Better-Auth pour avoir l'Account credential bien créé.
    await auth.api.signUpEmail({
      body: {
        email: quote.clientEmail,
        password: tempPassword,
        name: quote.clientName,
      },
    });
    client = await prisma.user.findUniqueOrThrow({
      where: { email: quote.clientEmail },
    });
    // S'assurer du rôle CLIENT (signup par défaut peut être déjà CLIENT).
    if (client.role !== "CLIENT") {
      await prisma.user.update({
        where: { id: client.id },
        data: { role: "CLIENT" },
      });
    }
  } else if (client.role === "ADMIN") {
    // Sécurité : ne jamais rétrograder un admin.
  }

  // Synchroniser les coordonnées de facturation sur le compte client
  // (qu'il soit nouveau ou existant, on met à jour si le devis a des infos)
  const billingUpdate: Record<string, string> = {};
  if (quote.clientPhone      && !client.phone)      billingUpdate.phone      = quote.clientPhone;
  if (quote.clientVat        && !client.vatNumber)  billingUpdate.vatNumber  = quote.clientVat;
  if (quote.clientAddress    && !client.address)    billingUpdate.address    = quote.clientAddress;
  if (quote.clientPostalCode && !client.postalCode) billingUpdate.postalCode = quote.clientPostalCode;
  if (quote.clientCity       && !client.city)       billingUpdate.city       = quote.clientCity;
  if (quote.clientCountry    && !client.country)    billingUpdate.country    = quote.clientCountry;
  if (Object.keys(billingUpdate).length > 0) {
    await prisma.user.update({ where: { id: client.id }, data: billingUpdate });
    client = await prisma.user.findUniqueOrThrow({ where: { id: client.id } });
  }

  // 2) Crée le projet + étapes par défaut.
  const projectName =
    quote.clientCompany?.trim() ||
    `Projet ${quote.clientName} — ${quote.number}`;

  const project = await prisma.project.create({
    data: {
      name: projectName,
      clientId: client.id,
      commercialId: quote.commercialId ?? session.user.id,
      quoteId: quote.id,
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

  // 3) Première facture : 50 % d'acompte sur le one-shot.
  if (quote.totalOneShot > 0) {
    const invNumber = await generateInvoiceNumber();
    await prisma.invoice.create({
      data: {
        number: invNumber,
        projectId: project.id,
        clientId: client.id,
        amount: Math.round(quote.totalOneShot * 0.5),
        status: "SENT",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14j
      },
    });
  }

  // 4) Abonnement consolidé si récurrent.
  const recurringTotal = quote.lines
    .filter((l) => l.isRecurring)
    .reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);

  if (recurringTotal > 0) {
    const recurringLabels = quote.lines
      .filter((l) => l.isRecurring)
      .map((l) => l.label)
      .join(" + ");
    await prisma.subscription.create({
      data: {
        projectId: project.id,
        clientId: client.id,
        plan: recurringLabels || "MAINTENANCE",
        monthlyAmount: recurringTotal,
        status: "ACTIVE",
      },
    });
  }

  // 5) Commissions pour le commercial (20 % site+options, 15 % pack lancement,
  //    + récurrent avec split producteur si applicable).
  if (quote.commercialId) {
    const selfProduced: string[] = quote.producerServices
      ? (JSON.parse(quote.producerServices) as string[])
      : [];

    const launchPackCents = quote.lines
      .filter((l) => l.category === "LAUNCH_PACK")
      .reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);
    const oneShotMinusLaunch = quote.totalOneShot - launchPackCents;

    const commissions: {
      commercialId: string;
      source: string;
      sourceId: string;
      type: string;
      baseAmount: number;
      rate: number;
      amount: number;
      periodMonth?: Date;
    }[] = [];

    if (oneShotMinusLaunch > 0) {
      commissions.push({
        commercialId: quote.commercialId,
        source: "QUOTE",
        sourceId: quote.id,
        type: "ONE_SHOT",
        baseAmount: oneShotMinusLaunch,
        rate: COMMISSION_RATES.ONE_SHOT_SITE_AND_OPTIONS,
        amount: Math.round(
          oneShotMinusLaunch * COMMISSION_RATES.ONE_SHOT_SITE_AND_OPTIONS,
        ),
      });
    }
    if (launchPackCents > 0) {
      commissions.push({
        commercialId: quote.commercialId,
        source: "QUOTE",
        sourceId: quote.id,
        type: "LAUNCH_PACK",
        baseAmount: launchPackCents,
        rate: COMMISSION_RATES.LAUNCH_PACK,
        amount: Math.round(launchPackCents * COMMISSION_RATES.LAUNCH_PACK),
      });
    }

    // Récurrent — une commission par service pour gérer le split producteur.
    if (recurringTotal > 0) {
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      firstOfMonth.setHours(0, 0, 0, 0);

      for (const key of quote.lines
        .filter((l) => l.isRecurring)
        .map((l) => l.label)) {
        // Retrouver l'offre récurrente par label (source unique de vérité)
        const rec = RECURRING.find((r) => r.label === key);
        if (!rec) continue;

        const isProducerService = rec.producerRate > 0;
        const isSelfProduced = selfProduced.includes(rec.key);
        const lineAmount = rec.monthlyPrice;

        if (isProducerService && isSelfProduced) {
          // Commercial = producteur : il touche 100 %
          commissions.push({
            commercialId: quote.commercialId,
            source: "QUOTE",
            sourceId: quote.id,
            type: "PRODUCER",
            baseAmount: lineAmount,
            rate: 1.0,
            amount: lineAmount,
            periodMonth: firstOfMonth,
          });
        } else if (isProducerService && !isSelfProduced) {
          // Quelqu'un d'autre exécute : 15 % commercial + 85 % producteur (pending)
          commissions.push({
            commercialId: quote.commercialId,
            source: "QUOTE",
            sourceId: quote.id,
            type: "RECURRING",
            baseAmount: lineAmount,
            rate: COMMISSION_RATES.RECURRING,
            amount: Math.round(lineAmount * COMMISSION_RATES.RECURRING),
            periodMonth: firstOfMonth,
          });
          commissions.push({
            commercialId: quote.commercialId, // placeholder — admin réassigne
            source: "QUOTE",
            sourceId: quote.id,
            type: "PRODUCER_PENDING",
            baseAmount: lineAmount,
            rate: rec.producerRate,
            amount: Math.round(lineAmount * rec.producerRate),
            periodMonth: firstOfMonth,
          });
        } else {
          // Service standard (maintenance, ads) : 15 % au commercial
          commissions.push({
            commercialId: quote.commercialId,
            source: "QUOTE",
            sourceId: quote.id,
            type: "RECURRING",
            baseAmount: lineAmount,
            rate: COMMISSION_RATES.RECURRING,
            amount: Math.round(lineAmount * COMMISSION_RATES.RECURRING),
            periodMonth: firstOfMonth,
          });
        }
      }
    }

    if (commissions.length > 0) {
      await prisma.commission.createMany({ data: commissions });
    }
  }

  // 6) Automatisation : bascule en SIGNED_DEPOSIT + email bienvenue (avec mot
  //    de passe temporaire si le compte vient d'être créé).
  await onProjectCreatedFromQuote({
    projectId: project.id,
    clientEmail: quote.clientEmail,
    clientName: quote.clientName,
    projectName,
    tempPassword: tempPassword ?? undefined,
  });

  revalidatePath("/app/commercial/devis");
  revalidatePath(`/app/commercial/devis/${quote.id}`);
  revalidatePath("/app/admin/projects");
  revalidatePath("/app/admin/kickoff");

  // Si on a créé un compte → on transmet le mot de passe temporaire dans l'URL
  // de redirection (une seule fois ; la page projet l'affiche puis l'oublie).
  const target = tempPassword
    ? `/app/admin/projects/${project.id}?welcome=1&tempPwd=${encodeURIComponent(tempPassword)}&email=${encodeURIComponent(quote.clientEmail)}`
    : `/app/admin/projects/${project.id}`;
  redirect(target);
}
