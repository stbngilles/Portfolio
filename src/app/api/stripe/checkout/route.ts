import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { createCheckoutSession, STRIPE_ENABLED } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { session } = await requireRole("CLIENT", "ADMIN");
  const { invoiceId } = (await req.json().catch(() => ({}))) as {
    invoiceId?: string;
  };
  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId requis" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { project: { select: { name: true, clientId: true } } },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }
  if (invoice.clientId !== session.user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  if (invoice.status === "PAID") {
    return NextResponse.json({ error: "Déjà payée" }, { status: 409 });
  }
  if (!STRIPE_ENABLED) {
    return NextResponse.json(
      { error: "Paiement en ligne indisponible — contactez l'agence." },
      { status: 503 },
    );
  }

  const client = await prisma.user.findUnique({
    where: { id: invoice.clientId },
    select: { email: true },
  });
  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  const result = await createCheckoutSession({
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    amountCents: invoice.amount,
    customerEmail: client.email,
    description: invoice.project
      ? `Facture ${invoice.number} — ${invoice.project.name}`
      : `Facture ${invoice.number}`,
  });

  if (!result) {
    return NextResponse.json({ error: "Stripe désactivé" }, { status: 503 });
  }

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: { stripeId: result.sessionId },
  });

  return NextResponse.json({ url: result.url });
}
