"use client";

import { useState } from "react";

export function PayInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur paiement.");
        setPending(false);
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      setError(String(e));
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="btn btn-accent"
        style={{ padding: "8px 16px", fontSize: 13 }}
      >
        {pending ? "Redirection…" : "Régler en ligne →"}
      </button>
      {error && (
        <p className="text-xs" style={{ color: "#9F1239" }}>
          {error}
        </p>
      )}
    </div>
  );
}
