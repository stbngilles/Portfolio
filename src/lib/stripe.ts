/**
 * Intégration Stripe — Checkout pour factures one-shot, webhook pour
 * marquer payé. No-op si STRIPE_SECRET_KEY est absent.
 *
 * On garde Stripe en HTTP direct (pas de SDK) pour éviter d'ajouter une
 * dépendance lourde et de devoir patcher encore plus de modules pour Turbopack.
 */

import crypto from "node:crypto";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const APP_URL = process.env.APP_URL ?? "https://pixelbrute.be";

export const STRIPE_ENABLED = !!STRIPE_SECRET_KEY;

async function stripeFetch(path: string, body: URLSearchParams) {
  if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY manquant.");
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Stripe ${res.status}: ${t}`);
  }
  return res.json();
}

export type CheckoutInput = {
  invoiceId: string;
  invoiceNumber: string;
  amountCents: number;
  customerEmail: string;
  description: string;
};

/**
 * Crée une session de Checkout et renvoie l'URL hosted Stripe.
 * Renvoie `null` si Stripe n'est pas configuré (le caller fera un fallback).
 */
export async function createCheckoutSession(
  input: CheckoutInput,
): Promise<{ url: string; sessionId: string } | null> {
  if (!STRIPE_ENABLED) return null;

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("payment_method_types[]", "card");
  body.set("customer_email", input.customerEmail);
  body.set("success_url", `${APP_URL}/app/client/factures?paid=${input.invoiceId}`);
  body.set("cancel_url", `${APP_URL}/app/client/factures?cancelled=${input.invoiceId}`);
  body.set("metadata[invoiceId]", input.invoiceId);
  body.set("metadata[invoiceNumber]", input.invoiceNumber);

  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "eur");
  body.set("line_items[0][price_data][unit_amount]", String(input.amountCents));
  body.set("line_items[0][price_data][product_data][name]", input.description);

  const session = await stripeFetch("/checkout/sessions", body);
  return { url: session.url as string, sessionId: session.id as string };
}

/**
 * Vérifie la signature Stripe d'un payload webhook (header `stripe-signature`).
 * Algorithme : v1=HMAC_SHA256(secret, timestamp + "." + payload).
 */
export function verifyWebhookSignature(
  payload: string,
  signatureHeader: string | null,
): boolean {
  if (!STRIPE_WEBHOOK_SECRET) {
    // En dev sans secret, on accepte. À durcir en prod.
    console.warn("[stripe] STRIPE_WEBHOOK_SECRET manquant — webhook non vérifié.");
    return true;
  }
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => p.split("=") as [string, string]),
  );
  const timestamp = parts["t"];
  const expected = parts["v1"];
  if (!timestamp || !expected) return false;

  // Tolérance 5 minutes
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (Number.isNaN(age) || age > 300) return false;

  const signed = `${timestamp}.${payload}`;
  const mac = crypto
    .createHmac("sha256", STRIPE_WEBHOOK_SECRET)
    .update(signed)
    .digest("hex");

  // Comparaison constante
  try {
    return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
  } catch {
    return false;
  }
}
