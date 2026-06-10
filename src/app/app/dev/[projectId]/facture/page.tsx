import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/pricing";
import { uploadDevInvoice } from "./actions";

const ALLOWED_STATUS = ["VALIDATED", "LIVE", "CLOSED"];

export default async function DevInvoicePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { session, role } = await requireRole("DEV", "ADMIN");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      status: true,
      devId: true,
      devPaymentAmount: true,
      devPaymentStatus: true,
      devPaymentPaidAt: true,
      devInvoiceUrl: true,
      devInvoiceFilename: true,
      devInvoiceUploadedAt: true,
    },
  });
  if (!project) notFound();
  if (role !== "ADMIN" && project.devId !== session.user.id) notFound();

  const unlocked = ALLOWED_STATUS.includes(project.status);

  return (
    <div className="wrap py-8 max-w-2xl">
      <p
        className="mono uppercase mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
      >
        · Facture freelance
      </p>
      <h2 className="display" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>
        Votre facture,{" "}
        <em className="serif-i" style={{ color: "var(--color-accent)" }}>
          une fois la mission validée.
        </em>
      </h2>

      <div
        className="mt-6 p-5"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-line)",
          borderRadius: 10,
        }}
      >
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Rémunération nette :{" "}
          <strong style={{ color: "var(--color-ink)" }}>
            {project.devPaymentAmount != null
              ? formatPrice(project.devPaymentAmount)
              : "À convenir"}
          </strong>
          {project.devPaymentStatus === "PAID" && project.devPaymentPaidAt && (
            <> · Virée le {project.devPaymentPaidAt.toLocaleDateString("fr-BE")}</>
          )}
        </p>
      </div>

      {!unlocked ? (
        <div
          className="mt-6 p-8 text-center"
          style={{
            background: "var(--color-paper)",
            border: "1px dashed var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="serif-i" style={{ fontSize: 20, color: "var(--color-muted)" }}>
            En attente de validation par l'agence.
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--color-subtle)" }}>
            Le formulaire d'upload apparaîtra dès que votre livraison sera approuvée.
          </p>
        </div>
      ) : project.devInvoiceUrl ? (
        <div
          className="mt-6 p-6"
          style={{
            background: "var(--color-accent-soft)",
            border: "1px solid var(--color-accent)",
            borderRadius: 12,
          }}
        >
          <p
            className="mono uppercase mb-2"
            style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-accent-ink)" }}
          >
            · Déposée le {project.devInvoiceUploadedAt?.toLocaleDateString("fr-BE")}
          </p>
          <p className="mb-3" style={{ fontWeight: 500 }}>
            {project.devInvoiceFilename}
          </p>
          <a
            href={project.devInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Ouvrir la facture →
          </a>

          {/* Remplacement autorisé tant que le paiement n'est pas viré */}
          {project.devPaymentStatus !== "PAID" && (
            <details className="mt-6">
              <summary
                className="text-sm cursor-pointer"
                style={{ color: "var(--color-accent)" }}
              >
                Remplacer la facture (erreur de montant ou de TVA…)
              </summary>
              <UploadForm projectId={projectId} />
            </details>
          )}
        </div>
      ) : (
        <div
          className="mt-6 p-6"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p className="serif-i mb-5" style={{ color: "var(--color-muted)" }}>
            Mission validée — vous pouvez maintenant déposer votre facture.
          </p>
          <UploadForm projectId={projectId} />
          <p className="text-xs mt-4" style={{ color: "var(--color-subtle)" }}>
            Format conseillé : PDF, nommé avec votre référence et le n° de mission.
            Déposez le fichier sur votre Drive/Dropbox et collez le lien partage public.
          </p>
        </div>
      )}
    </div>
  );
}

function UploadForm({ projectId }: { projectId: string }) {
  return (
    <form action={uploadDevInvoice.bind(null, projectId)} className="grid gap-4 mt-4">
      <label className="block">
        <span
          className="mono uppercase block mb-2"
          style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}
        >
          Nom du fichier *
        </span>
        <input
          name="invoiceFilename"
          required
          placeholder="ex. PB-2026-0042-MartinDupont.pdf"
          className="w-full px-3 py-2 outline-none"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-line)",
            borderRadius: 6,
            fontSize: 14,
          }}
        />
      </label>
      <label className="block">
        <span
          className="mono uppercase block mb-2"
          style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}
        >
          Lien public vers la facture (https://…) *
        </span>
        <input
          name="invoiceUrl"
          required
          type="url"
          placeholder="https://drive.google.com/..."
          className="w-full px-3 py-2 outline-none"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-line)",
            borderRadius: 6,
            fontSize: 14,
          }}
        />
      </label>
      <button type="submit" className="btn btn-primary justify-self-start">
        Déposer la facture →
      </button>
    </form>
  );
}
