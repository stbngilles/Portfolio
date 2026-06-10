/**
 * Couche email transactionnel — Brevo (ex-Sendinblue).
 *
 * Active si BREVO_API_KEY est défini. Sinon, no-op qui logge — utile en dev.
 * Toutes les fonctions retournent `{ ok: boolean }` pour ne jamais casser
 * l'enchaînement métier si l'envoi mail échoue (un mail raté ne doit pas
 * bloquer la création d'un projet).
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? "hello@pixelbrute.be";
const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME ?? "Pixelbrute";
const APP_URL = process.env.APP_URL ?? "https://pixelbrute.be";

type SendArgs = {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  replyTo?: string;
};

async function sendBrevo(args: SendArgs): Promise<{ ok: boolean; error?: string }> {
  if (!BREVO_API_KEY) {
    console.log("[email:noop]", args.subject, "→", args.to);
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: BREVO_FROM_NAME, email: BREVO_FROM_EMAIL },
        to: [{ email: args.to, name: args.toName ?? args.to }],
        subject: args.subject,
        htmlContent: args.html,
        replyTo: args.replyTo ? { email: args.replyTo } : undefined,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[email:brevo:error]", res.status, text);
      return { ok: false, error: text };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email:brevo:throw]", err);
    return { ok: false, error: String(err) };
  }
}

function wrap(title: string, body: string, ctaText?: string, ctaUrl?: string) {
  return `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Helvetica,sans-serif;background:#F2F1EE;margin:0;padding:32px;color:#0F0F14">
  <div style="max-width:560px;margin:0 auto;background:#FAF9F5;border:1px solid #E5E2DC;border-radius:12px;padding:32px">
    <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:.14em;color:#1F3FBF;margin:0 0 12px;text-transform:uppercase">· Pixelbrute</p>
    <h1 style="font-size:24px;line-height:1.2;letter-spacing:-.02em;margin:0 0 16px">${title}</h1>
    <div style="font-size:15px;line-height:1.6;color:#2A2A36">${body}</div>
    ${ctaText && ctaUrl ? `<p style="margin:24px 0 0"><a href="${ctaUrl}" style="display:inline-block;background:#1F3FBF;color:#FAF9F5;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:500">${ctaText} →</a></p>` : ""}
    <p style="margin:32px 0 0;font-size:12px;color:#6B6B7A">Pixelbrute — studio web · Liège</p>
  </div>
</body></html>`;
}

// =====================================================================
// Templates métier
// =====================================================================

export async function sendQuoteSigned(args: {
  clientEmail: string;
  clientName: string;
  projectName: string;
  tempPassword?: string;
}) {
  const body = `
    <p>Bonjour ${args.clientName},</p>
    <p>Merci d'avoir signé votre devis Pixelbrute. Votre projet <strong>${args.projectName}</strong> est désormais ouvert dans votre espace client.</p>
    ${
      args.tempPassword
        ? `<p>Pour vous connecter une première fois :<br>· Email : <code>${args.clientEmail}</code><br>· Mot de passe temporaire : <code>${args.tempPassword}</code></p><p>Pensez à le changer à votre première connexion.</p>`
        : "<p>Connectez-vous avec votre email habituel.</p>"
    }
    <p>Étape suivante : régler l'acompte de 50 %, puis compléter l'onboarding pour qu'on cadre votre site précisément.</p>
  `;
  return sendBrevo({
    to: args.clientEmail,
    toName: args.clientName,
    subject: "Bienvenue dans votre espace projet Pixelbrute",
    html: wrap("On démarre votre projet.", body, "Accéder à mon espace", `${APP_URL}/app/login`),
  });
}

export async function sendDepositReceived(args: {
  clientEmail: string;
  clientName: string;
  projectName: string;
}) {
  const body = `
    <p>Bonjour ${args.clientName},</p>
    <p>Votre acompte vient d'être encaissé pour <strong>${args.projectName}</strong> — merci !</p>
    <p>Pour qu'on démarre rapidement, complétez le formulaire d'onboarding (10 minutes). Vos réponses verrouillent les choix techniques et nous évitent les allers-retours.</p>
  `;
  return sendBrevo({
    to: args.clientEmail,
    toName: args.clientName,
    subject: "Acompte reçu — il nous manque vos infos d'onboarding",
    html: wrap("Acompte reçu. À vous.", body, "Compléter l'onboarding", `${APP_URL}/app/client/onboarding`),
  });
}

export async function sendOnboardingComplete(args: {
  clientEmail: string;
  clientName: string;
  projectName: string;
}) {
  const body = `
    <p>Bonjour ${args.clientName},</p>
    <p>Merci, vos réponses d'onboarding sont enregistrées pour <strong>${args.projectName}</strong>.</p>
    <p>Prochaine étape côté agence : kick-off technique avec le fondateur, puis on dépose votre brief dans le pool de freelances vérifiés.</p>
  `;
  return sendBrevo({
    to: args.clientEmail,
    toName: args.clientName,
    subject: "Onboarding reçu — on prend la suite",
    html: wrap("On prend la suite.", body, "Suivre l'avancement", `${APP_URL}/app/client`),
  });
}

export async function sendInvoiceReminder(args: {
  clientEmail: string;
  clientName: string;
  invoiceNumber: string;
  amountEuros: string;
  dueDate: string;
}) {
  const body = `
    <p>Bonjour ${args.clientName},</p>
    <p>Petit rappel pour la facture <strong>#${args.invoiceNumber}</strong> de <strong>${args.amountEuros}</strong>, échéance ${args.dueDate}.</p>
    <p>Le paiement en ligne est dispo dans votre espace client.</p>
  `;
  return sendBrevo({
    to: args.clientEmail,
    toName: args.clientName,
    subject: `Rappel facture ${args.invoiceNumber} — ${args.amountEuros}`,
    html: wrap("Rappel facture.", body, "Régler en ligne", `${APP_URL}/app/client/factures`),
  });
}

export async function sendDevTicketReady(args: {
  projectName: string;
  techStack: string;
}) {
  // Notif interne admin : un nouveau brief est dispo dans le pool.
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return { ok: true };
  return sendBrevo({
    to: adminEmail,
    subject: `Ticket dev prêt — ${args.projectName}`,
    html: wrap(
      "Un brief est prêt pour le pool dev.",
      `<p>Projet <strong>${args.projectName}</strong> · stack ${args.techStack || "à préciser"}.</p>`,
      "Voir le projet",
      `${APP_URL}/app/admin/projects`,
    ),
  });
}
