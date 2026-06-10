import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/stripe";
import { onInvoicePaid } from "@/lib/automations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!verifyWebhookSignature(payload, sig)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const obj = event.data.object as {
        id?: string;
        payment_status?: string;
        metadata?: { invoiceId?: string };
      };
      const invoiceId = obj.metadata?.invoiceId;
      if (invoiceId && obj.payment_status === "paid") {
        const invoice = await prisma.invoice.findUnique({
          where: { id: invoiceId },
        });
        if (invoice && invoice.status !== "PAID") {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
              status: "PAID",
              paidAt: new Date(),
              stripeId: obj.id ?? invoice.stripeId,
            },
          });
          await onInvoicePaid(invoiceId);
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe:webhook:error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
