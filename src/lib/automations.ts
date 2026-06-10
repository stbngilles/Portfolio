/**
 * Hooks d'automatisation côté serveur — déclenchés depuis les actions métier.
 *
 * Chaque fonction est idempotente et défensive : un mail échoué ne bloque pas
 * la suite, et une transition déjà faite ne refait pas le travail.
 */
import { prisma } from "@/lib/db";
import {
  sendQuoteSigned,
  sendDepositReceived,
  sendOnboardingComplete,
  sendDevTicketReady,
} from "@/lib/email";

/**
 * Après création du projet à partir d'un devis signé :
 *  - Envoie le mail de bienvenue avec mot de passe temporaire (si fourni).
 *  - Bascule le projet en SIGNED_DEPOSIT (en attente acompte).
 */
export async function onProjectCreatedFromQuote(args: {
  projectId: string;
  clientEmail: string;
  clientName: string;
  projectName: string;
  tempPassword?: string;
}) {
  await prisma.project.update({
    where: { id: args.projectId },
    data: { status: "SIGNED_DEPOSIT" },
  });

  await sendQuoteSigned({
    clientEmail: args.clientEmail,
    clientName: args.clientName,
    projectName: args.projectName,
    tempPassword: args.tempPassword,
  });
}

/**
 * Quand une facture passe à PAID :
 *  - Si c'est l'acompte d'un projet en SIGNED_DEPOSIT, on bascule en ONBOARDING
 *    et on envoie le lien d'onboarding.
 */
export async function onInvoicePaid(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      project: {
        include: {
          client: { select: { email: true, name: true } },
        },
      },
    },
  });
  if (!invoice || !invoice.project) return;

  const project = invoice.project;
  if (project.status !== "SIGNED_DEPOSIT") return;

  await prisma.project.update({
    where: { id: project.id },
    data: { status: "ONBOARDING" },
  });

  await sendDepositReceived({
    clientEmail: project.client.email,
    clientName: project.client.name ?? project.client.email,
    projectName: project.name,
  });

  // Si le brief est déjà fait, publier dans le pool immédiatement
  await maybePublishToDevPool(project.id);
}

/**
 * Quand le client soumet son onboarding :
 *  - Bascule le projet en COLLECTING_ASSETS si pas encore avancé.
 *  - Notifie le client.
 */
export async function onOnboardingSubmitted(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: { select: { email: true, name: true } } },
  });
  if (!project) return;

  await sendOnboardingComplete({
    clientEmail: project.client.email,
    clientName: project.client.name ?? project.client.email,
    projectName: project.name,
  });
}

/**
 * Tente de publier un projet dans le pool dev.
 *
 * Conditions requises (les DEUX) :
 *  1. Brief complété (kickoffDone = true)
 *  2. Acompte payé (status !== "SIGNED_DEPOSIT")
 *
 * L'onboarding client et les assets peuvent arriver après —
 * le dev a accès au projet dès que le brief est fait et l'acompte encaissé.
 */
export async function maybePublishToDevPool(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) return;

  // Déjà publié ou en production → rien à faire
  const pastPool = ["READY_FOR_DEV", "BRIEFING", "DESIGN", "DEV", "CONTENT", "QA_REVIEW", "LIVE", "CLOSED"];
  if (pastPool.includes(project.status)) return;

  // Verrou 1 : brief complété
  if (!project.kickoffDone) return;

  // Verrou 2 : acompte payé (status a avancé au-delà de SIGNED_DEPOSIT)
  if (project.status === "SIGNED_DEPOSIT") return;

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "READY_FOR_DEV" },
  });

  await sendDevTicketReady({
    projectName: project.name,
    techStack: project.techStack ?? "",
  });
}
