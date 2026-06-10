"use client";

import { useMemo, useState, useTransition } from "react";
import {
  SITES,
  OPTIONS,
  RECURRING,
  BUNDLES,
  LAUNCH_PACK,
  COMMISSION_RATES,
  formatPrice,
  getOptionUnitPrice,
  type SiteKey,
  type OptionKey,
  type RecurringKey,
  type Bundle,
} from "@/lib/pricing";

const SHORT_OPTION_LABELS: Record<OptionKey, string> = {
  seo_basic: "SEO base",
  seo_advanced: "SEO avancé",
  extra_page: "Page sup.",
  writing_per_page: "Rédaction",
  extra_language: "Multilangue",
  reservation_manual: "Résa. manuelle",
  reservation_synced: "Résa. agenda",
  stripe_payment: "Paiement",
  logo_simple: "Logo",
  migration: "Migration",
  photo_session: "Photo",
};

const SHORT_RECURRING_LABELS: Record<RecurringKey, string> = {
  maintenance_basic: "Maintenance /mois",
  social_posts: "Posts /mois",
  social_video_edited: "Vidéos montées /mois",
  social_video_onsite: "Tournage /mois",
  ads_management: "Meta Ads /mois",
};
import { createQuote, type QuoteDraft } from "../actions";

interface OptionEntry {
  qty: number;
  customPrice?: number;
  enabled: boolean;
}

export function QuoteCalculator() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Client — coordonnées de base
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [notes, setNotes] = useState("");

  // Client — coordonnées de facturation
  const [clientPhone, setClientPhone] = useState("");
  const [clientVat, setClientVat] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPostalCode, setClientPostalCode] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientCountry, setClientCountry] = useState("BE");

  // Site
  const [siteKey, setSiteKey] = useState<SiteKey | null>(null);
  const [siteCustomPrice, setSiteCustomPrice] = useState<number>(0);

  // Options
  const [options, setOptions] = useState<Record<OptionKey, OptionEntry>>(() => {
    const init = {} as Record<OptionKey, OptionEntry>;
    for (const o of OPTIONS) init[o.key] = { qty: o.defaultQty, enabled: false };
    return init;
  });

  // Récurrent — maintenance_basic est obligatoire et toujours activée
  const [recurring, setRecurring] = useState<Record<RecurringKey, boolean>>(
    () => {
      const init = {} as Record<RecurringKey, boolean>;
      for (const r of RECURRING) init[r.key] = r.key === "maintenance_basic";
      return init;
    },
  );

  // Pack lancement
  const [launchPack, setLaunchPack] = useState(false);

  // Bundle métier actif
  const [bundleKey, setBundleKey] = useState<string | null>(null);

  // Services récurrents exécutés par le commercial lui-même (100 % commission)
  const [selfProducedServices, setSelfProducedServices] = useState<Partial<Record<RecurringKey, boolean>>>(() => {
    const init: Partial<Record<RecurringKey, boolean>> = {};
    for (const r of RECURRING) if (r.producerRate > 0) init[r.key] = true;
    return init;
  });

  // Verrouillages conditionnels — chaque option à risque génère une question
  // obligatoire pour éviter les fausses promesses au client.
  const [stripeProductType, setStripeProductType] = useState("");
  const [reservationBuffer, setReservationBuffer] = useState("");
  const [reservationTool, setReservationTool] = useState("");
  const [migrationFrom, setMigrationFrom] = useState("");

  // ===== Application d'un bundle =====
  function applyBundle(bundle: Bundle) {
    if (bundleKey === bundle.key) {
      // Désélectionner le bundle (garde le formulaire tel quel, retire la remise)
      setBundleKey(null);
      return;
    }
    setBundleKey(bundle.key);
    setSiteKey(bundle.site);
    setOptions((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next) as OptionKey[]) {
        next[key] = { ...next[key], enabled: bundle.options.includes(key) };
      }
      return next;
    });
    setRecurring((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next) as RecurringKey[]) {
        next[key] = bundle.recurring.includes(key);
      }
      return next;
    });
  }

  // ===== Calculs live =====
  const totals = useMemo(() => {
    let oneShot = 0;
    let monthly = 0;

    if (siteKey) {
      const s = SITES.find((x) => x.key === siteKey)!;
      oneShot += siteKey === "sur_mesure" ? siteCustomPrice : s.basePrice;
    }

    for (const o of OPTIONS) {
      const e = options[o.key];
      if (!e.enabled) continue;
      const unit = getOptionUnitPrice(o.key, siteKey, e.customPrice);
      oneShot += unit * Math.max(1, e.qty);
    }

    if (launchPack) oneShot += LAUNCH_PACK.price;

    for (const r of RECURRING) {
      if (recurring[r.key]) monthly += r.monthlyPrice;
    }

    const bundle = bundleKey ? BUNDLES.find((b) => b.key === bundleKey) : null;
    const discount = bundle?.discountCents ?? 0;

    // Commission récurrente : 100 % si self-produced, 15 % sinon
    let monthlyCommission = 0;
    for (const r of RECURRING) {
      if (!recurring[r.key]) continue;
      if (r.producerRate > 0 && selfProducedServices[r.key]) {
        monthlyCommission += r.monthlyPrice; // 100 %
      } else {
        monthlyCommission += Math.round(r.monthlyPrice * COMMISSION_RATES.RECURRING);
      }
    }

    return { oneShot: Math.max(0, oneShot - discount), monthly, discount, monthlyCommission };
  }, [siteKey, siteCustomPrice, options, recurring, launchPack, bundleKey, selfProducedServices]);

  const draft: QuoteDraft = {
    clientName,
    clientEmail,
    clientCompany:    clientCompany    || undefined,
    clientPhone:      clientPhone      || undefined,
    clientVat:        clientVat        || undefined,
    clientAddress:    clientAddress    || undefined,
    clientPostalCode: clientPostalCode || undefined,
    clientCity:       clientCity       || undefined,
    clientCountry:    clientCountry    || "BE",
    notes: notes || undefined,
    site: siteKey
      ? {
          key: siteKey,
          customPrice: siteKey === "sur_mesure" ? siteCustomPrice : undefined,
        }
      : null,
    options: (Object.keys(options) as OptionKey[])
      .filter((k) => options[k].enabled)
      .map((k) => ({ key: k, qty: options[k].qty, customPrice: options[k].customPrice })),
    recurring: (Object.keys(recurring) as RecurringKey[]).filter(
      (k) => recurring[k],
    ),
    launchPack,
    selfProducedServices: (Object.keys(selfProducedServices) as RecurringKey[]).filter(
      (k) => selfProducedServices[k] && recurring[k],
    ),
  };

  // Verrouillages conditionnels
  const stripeOn = options.stripe_payment?.enabled;
  const reservationManualOn = options.reservation_manual?.enabled;
  const reservationSyncedOn = options.reservation_synced?.enabled;
  const reservationOn = reservationManualOn || reservationSyncedOn;
  const migrationOn = options.migration?.enabled;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!clientName || !clientEmail) {
      setError("Renseignez au moins le nom et l'email du prospect.");
      return;
    }
    if (!siteKey && !launchPack && !Object.values(recurring).some(Boolean)) {
      setError("Sélectionnez au moins un site, un récurrent ou le pack lancement.");
      return;
    }
    if (stripeOn && stripeProductType.trim().length < 5) {
      setError("Paiement en ligne coché — précisez le type de produit vendu.");
      return;
    }
    if (reservationOn && !reservationBuffer) {
      setError("Réservation activée — choisissez la pause minimum entre deux créneaux.");
      return;
    }
    if (reservationSyncedOn && reservationTool.trim().length < 3) {
      setError("Réservation synchronisée — précisez l'outil tiers (Google Calendar, Cal.com, etc.).");
      return;
    }
    if (migrationOn && migrationFrom.trim().length < 3) {
      setError("Migration cochée — précisez la techno actuelle du site à migrer.");
      return;
    }

    // On enrichit les notes internes avec les verrouillages conditionnels —
    // ils deviennent traçables pour le brief technique.
    const verrouillages: string[] = [];
    if (stripeOn) verrouillages.push(`[Stripe] Produit : ${stripeProductType}`);
    if (reservationOn)
      verrouillages.push(
        `[Réservation] Pause min : ${reservationBuffer}${reservationSyncedOn ? ` · Outil : ${reservationTool}` : ""}`,
      );
    if (migrationOn) verrouillages.push(`[Migration] Techno actuelle : ${migrationFrom}`);

    const enrichedNotes = [notes, ...(verrouillages.length ? ["", "— Verrouillages :", ...verrouillages] : [])]
      .filter(Boolean)
      .join("\n");

    const finalDraft: QuoteDraft = { ...draft, notes: enrichedNotes || undefined };

    startTransition(async () => {
      await createQuote(JSON.stringify(finalDraft));
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-8">
      {/* ===== Colonne principale ===== */}
      <div className="space-y-10">
        {/* Prospect */}
        <Card title="Prospect" italic="à qui on vend ?">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nom du contact *">
              <Input value={clientName} onChange={setClientName} required placeholder="Marie Dupont" />
            </Field>
            <Field label="Email *">
              <Input
                value={clientEmail}
                onChange={setClientEmail}
                type="email"
                required
                placeholder="marie@boulangerie.be"
              />
            </Field>
            <Field label="Société / Raison sociale">
              <Input value={clientCompany} onChange={setClientCompany} placeholder="Boulangerie Demoulin SPRL" />
            </Field>
            <Field label="Téléphone">
              <Input value={clientPhone} onChange={setClientPhone} type="tel" placeholder="+32 470 12 34 56" />
            </Field>
          </div>

          {/* Coordonnées de facturation */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid var(--color-line)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--color-muted)",
                fontFamily: "var(--font-geist)",
                marginBottom: 12,
              }}
            >
              Coordonnées de facturation
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Numéro de TVA">
                <Input
                  value={clientVat}
                  onChange={setClientVat}
                  placeholder="BE0123.456.789"
                />
              </Field>
              <Field label="Rue + numéro">
                <Input value={clientAddress} onChange={setClientAddress} placeholder="Rue de la Paix 12" />
              </Field>
              <Field label="Code postal">
                <Input value={clientPostalCode} onChange={setClientPostalCode} placeholder="4000" />
              </Field>
              <Field label="Ville">
                <Input value={clientCity} onChange={setClientCity} placeholder="Liège" />
              </Field>
              <Field label="Pays">
                <select
                  value={clientCountry}
                  onChange={(e) => setClientCountry(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-line)",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    color: "var(--color-ink)",
                  }}
                >
                  <option value="BE">🇧🇪 Belgique</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="LU">🇱🇺 Luxembourg</option>
                  <option value="NL">🇳🇱 Pays-Bas</option>
                  <option value="DE">🇩🇪 Allemagne</option>
                  <option value="OTHER">Autre</option>
                </select>
              </Field>
              <Field label="Notes internes">
                <Input
                  value={notes}
                  onChange={setNotes}
                  placeholder="Rencontré au salon, réservation en ligne souhaitée…"
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* Bundles métier */}
        <Card title="Bundles métier" italic="partir d'un kit prêt à l'emploi.">
          <div className="grid sm:grid-cols-2 gap-3">
            {BUNDLES.map((b) => {
              const isActive = bundleKey === b.key;
              const site = SITES.find((s) => s.key === b.site)!;
              return (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => applyBundle(b)}
                  className="text-left p-4 transition"
                  style={{
                    background: isActive ? "var(--color-accent-soft)" : "var(--color-bg)",
                    border: `1px solid ${isActive ? "var(--color-accent)" : "var(--color-line)"}`,
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{b.emoji}</div>
                  <p style={{ fontWeight: 600, color: isActive ? "var(--color-accent-ink)" : "var(--color-ink)" }}>
                    {b.label}
                  </p>
                  <p className="text-xs mb-3" style={{ color: "var(--color-muted)", lineHeight: 1.4 }}>
                    {b.targetSector}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 7px",
                        background: isActive ? "color-mix(in srgb, var(--color-accent) 15%, transparent)" : "var(--color-paper)",
                        border: "1px solid var(--color-line)",
                        borderRadius: 4,
                        color: isActive ? "var(--color-accent-ink)" : "var(--color-ink)",
                      }}
                    >
                      {site.label}
                    </span>
                    {b.options.map((k) => (
                      <span
                        key={k}
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          background: isActive ? "color-mix(in srgb, var(--color-accent) 15%, transparent)" : "var(--color-paper)",
                          border: "1px solid var(--color-line)",
                          borderRadius: 4,
                          color: isActive ? "var(--color-accent-ink)" : "var(--color-ink)",
                        }}
                      >
                        {SHORT_OPTION_LABELS[k]}
                      </span>
                    ))}
                    {b.recurring.map((k) => (
                      <span
                        key={k}
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          background: isActive ? "color-mix(in srgb, var(--color-accent) 20%, transparent)" : "color-mix(in srgb, var(--color-accent) 8%, transparent)",
                          border: `1px solid ${isActive ? "var(--color-accent)" : "color-mix(in srgb, var(--color-accent) 25%, transparent)"}`,
                          borderRadius: 4,
                          color: "var(--color-accent-ink)",
                          fontWeight: 500,
                        }}
                      >
                        {SHORT_RECURRING_LABELS[k]}
                      </span>
                    ))}
                  </div>
                  <p
                    className="mono"
                    style={{ fontSize: 11, color: isActive ? "var(--color-accent-ink)" : "var(--color-accent)", fontWeight: 600 }}
                  >
                    Remise −{formatPrice(b.discountCents)} incluse
                  </p>
                </button>
              );
            })}
          </div>
          <p className="serif-i text-xs mt-3" style={{ color: "var(--color-subtle)" }}>
            Cliquer sur un bundle pré-remplit le formulaire. Vous pouvez ensuite ajuster les options.
          </p>
        </Card>

        {/* Site */}
        <Card title="Site web" italic="la ligne principale.">
          <div className="grid sm:grid-cols-2 gap-3">
            {SITES.map((s) => (
              <SelectableCard
                key={s.key}
                selected={siteKey === s.key}
                onClick={() => setSiteKey(s.key)}
                title={s.label}
                description={s.description}
                price={
                  s.key === "sur_mesure"
                    ? "Sur devis"
                    : formatPrice(s.basePrice)
                }
              />
            ))}
          </div>
          {siteKey === "sur_mesure" && (
            <div className="mt-4">
              <Field label="Prix négocié (€ HTVA)">
                <Input
                  type="number"
                  value={String(siteCustomPrice / 100 || "")}
                  onChange={(v) => setSiteCustomPrice(Math.max(0, Number(v) * 100))}
                  placeholder="ex. 9500"
                />
              </Field>
            </div>
          )}
        </Card>

        {/* Options */}
        <Card title="Options" italic="à la carte.">
          <div className="space-y-2">
            {OPTIONS.map((o) => {
              const e = options[o.key];
              const unit = getOptionUnitPrice(o.key, siteKey, e.customPrice);
              const isPhoto = o.key === "photo_session";
              return (
                <div
                  key={o.key}
                  className="flex items-center justify-between gap-4 px-4 py-3 flex-wrap"
                  style={{
                    background: e.enabled ? "var(--color-accent-soft)" : "var(--color-bg)",
                    border: `1px solid ${
                      e.enabled ? "var(--color-accent)" : "var(--color-line)"
                    }`,
                    borderRadius: 10,
                    transition: "all 120ms",
                  }}
                >
                  <label className="flex items-start gap-3 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={e.enabled}
                      onChange={(ev) =>
                        setOptions((p) => ({
                          ...p,
                          [o.key]: { ...p[o.key], enabled: ev.target.checked },
                        }))
                      }
                      className="mt-1"
                      style={{ accentColor: "var(--color-accent)" }}
                    />
                    <div>
                      <p style={{ fontWeight: 500 }}>{o.label}</p>
                      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                        {o.description}
                      </p>
                    </div>
                  </label>

                  <div className="flex items-center gap-3">
                    {o.quantifiable && e.enabled && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setOptions((p) => ({
                              ...p,
                              [o.key]: { ...p[o.key], qty: Math.max(1, p[o.key].qty - 1) },
                            }))
                          }
                          className="w-7 h-7 rounded"
                          style={{ background: "var(--color-paper)", border: "1px solid var(--color-line)" }}
                        >
                          –
                        </button>
                        <span className="w-8 text-center mono">{e.qty}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setOptions((p) => ({
                              ...p,
                              [o.key]: { ...p[o.key], qty: p[o.key].qty + 1 },
                            }))
                          }
                          className="w-7 h-7 rounded"
                          style={{ background: "var(--color-paper)", border: "1px solid var(--color-line)" }}
                        >
                          +
                        </button>
                      </div>
                    )}

                    {isPhoto && e.enabled ? (
                      <div>
                        <Field label="Prix (€)">
                          <input
                            type="number"
                            value={String((e.customPrice ?? 0) / 100 || "")}
                            onChange={(ev) =>
                              setOptions((p) => ({
                                ...p,
                                [o.key]: {
                                  ...p[o.key],
                                  customPrice: Math.max(0, Number(ev.target.value) * 100),
                                },
                              }))
                            }
                            className="px-2 py-1 text-sm w-24"
                            style={{
                              background: "var(--color-paper)",
                              border: "1px solid var(--color-line)",
                              borderRadius: 6,
                            }}
                          />
                        </Field>
                      </div>
                    ) : (
                      <p className="mono text-right" style={{ minWidth: 90, color: "var(--color-ink)" }}>
                        {unit > 0 ? formatPrice(unit) : "—"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Verrouillages conditionnels — n'apparaissent que si pertinent */}
        {(stripeOn || reservationOn || migrationOn) && (
          <Card title="Verrouillages" italic="à confirmer avant de signer.">
            <div className="space-y-4">
              {stripeOn && (
                <Field label="Type de produit vendu en ligne (Stripe) *">
                  <textarea
                    value={stripeProductType}
                    onChange={(e) => setStripeProductType(e.target.value)}
                    required
                    rows={2}
                    placeholder="ex. abonnement mensuel + boutique de produits physiques avec livraison BE/FR"
                    className="w-full px-3 py-2 outline-none"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 6,
                      fontSize: 14,
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </Field>
              )}
              {reservationOn && (
                <>
                  <Field label="Pause minimum entre 2 réservations *">
                    <select
                      value={reservationBuffer}
                      onChange={(e) => setReservationBuffer(e.target.value)}
                      required
                      className="w-full px-3 py-2 outline-none"
                      style={{
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-line)",
                        borderRadius: 6,
                        fontSize: 14,
                      }}
                    >
                      <option value="">— choisir —</option>
                      <option>0 minute</option>
                      <option>15 minutes (standard)</option>
                      <option>30 minutes</option>
                      <option>1 heure</option>
                      <option>Personnalisé — voir notes</option>
                    </select>
                  </Field>
                  {reservationSyncedOn && (
                    <Field label="Outil de synchronisation tiers *">
                      <input
                        value={reservationTool}
                        onChange={(e) => setReservationTool(e.target.value)}
                        required
                        placeholder="ex. Google Calendar, Cal.com, Outlook"
                        className="w-full px-3 py-2 outline-none"
                        style={{
                          background: "var(--color-bg)",
                          border: "1px solid var(--color-line)",
                          borderRadius: 6,
                          fontSize: 14,
                        }}
                      />
                    </Field>
                  )}
                </>
              )}
              {migrationOn && (
                <Field label="Site actuel à migrer (techno + URL) *">
                  <input
                    value={migrationFrom}
                    onChange={(e) => setMigrationFrom(e.target.value)}
                    required
                    placeholder="ex. WordPress sur ovh.com/client.be"
                    className="w-full px-3 py-2 outline-none"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 6,
                      fontSize: 14,
                    }}
                  />
                </Field>
              )}
              <p
                className="serif-i text-xs"
                style={{ color: "var(--color-subtle)" }}
              >
                Ces réponses sont injectées dans les notes du devis et serviront
                au brief technique côté admin.
              </p>
            </div>
          </Card>
        )}

        {/* Récurrent */}
        <Card title="Récurrent mensuel" italic="le cœur du business.">
          <div className="grid sm:grid-cols-2 gap-3">
            {RECURRING.map((r) => {
              const isMandatory = r.key === "maintenance_basic";
              const isProducer = r.producerRate > 0;
              const isSelf = selfProducedServices[r.key] ?? false;
              return (
                <div key={r.key} style={{ position: "relative" }}>
                  <SelectableCard
                    selected={recurring[r.key]}
                    onClick={isMandatory ? () => {} : () => setRecurring((p) => ({ ...p, [r.key]: !p[r.key] }))}
                    title={r.label}
                    description={r.description}
                    price={`${formatPrice(r.monthlyPrice)} / mois`}
                    pitch={r.pitch}
                    locked={isMandatory}
                  />
                  {isProducer && recurring[r.key] && (
                    <label
                      className="flex items-center gap-2 mt-2 cursor-pointer"
                      style={{ fontSize: 12, color: "var(--color-muted)", paddingLeft: 2 }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelf}
                        onChange={(e) =>
                          setSelfProducedServices((p) => ({ ...p, [r.key]: e.target.checked }))
                        }
                        style={{ accentColor: "var(--color-accent)" }}
                      />
                      <span>
                        J&apos;exécute ce service moi-même —{" "}
                        <strong style={{ color: isSelf ? "var(--color-accent)" : "inherit" }}>
                          {isSelf ? "commission 100 %" : "commission 15 % (+ 85 % producteur)"}
                        </strong>
                      </span>
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pack lancement */}
        <Card title="Pack publicité de lancement" italic="boost de visibilité.">
          <SelectableCard
            selected={launchPack}
            onClick={() => setLaunchPack((p) => !p)}
            title={LAUNCH_PACK.label}
            description={LAUNCH_PACK.description}
            price={formatPrice(LAUNCH_PACK.price)}
          />
        </Card>
      </div>

      {/* ===== Sidebar totaux ===== */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <div
          className="p-6"
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 12,
          }}
        >
          <p
            className="mono uppercase mb-4"
            style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
          >
            · Totaux estimés
          </p>

          <p className="mono uppercase text-xs mb-1" style={{ color: "var(--color-muted)" }}>
            ONE-SHOT
          </p>
          <p
            className="display mb-2"
            style={{
              fontSize: 36,
              letterSpacing: "-0.03em",
              color: "var(--color-accent)",
              lineHeight: 1,
            }}
          >
            {formatPrice(totals.oneShot)}
          </p>
          {totals.discount > 0 && (
            <p className="mono text-xs mb-4" style={{ color: "var(--color-accent)", opacity: 0.7 }}>
              dont remise bundle −{formatPrice(totals.discount)}
            </p>
          )}

          {totals.monthly > 0 && (
            <>
              <p
                className="mono uppercase text-xs mb-1 mt-2"
                style={{ color: "var(--color-muted)" }}
              >
                + RÉCURRENT
              </p>
              <p
                className="display mb-6"
                style={{
                  fontSize: 24,
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                  lineHeight: 1,
                }}
              >
                {formatPrice(totals.monthly)}
                <span
                  className="serif-i text-sm ml-2"
                  style={{ color: "var(--color-muted)" }}
                >
                  /mois
                </span>
              </p>
            </>
          )}

          <div
            className="pt-5 mt-5"
            style={{ borderTop: "1px solid var(--color-line)" }}
          >
            <p
              className="mono uppercase mb-2"
              style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-subtle)" }}
            >
              Votre commission estimée
            </p>
            <p className="text-sm" style={{ color: "var(--color-ink)" }}>
              <strong>{formatPrice(Math.round(totals.oneShot * 0.2))}</strong>{" "}
              <span style={{ color: "var(--color-muted)" }}>one-shot (20 %)</span>
            </p>
            {totals.monthly > 0 && (
              <p className="text-sm mt-1" style={{ color: "var(--color-ink)" }}>
                <strong>{formatPrice(totals.monthlyCommission)}</strong>{" "}
                <span style={{ color: "var(--color-muted)" }}>/mois récurrent</span>
              </p>
            )}
          </div>

          {error && (
            <div
              className="text-sm px-3 py-2 rounded mt-5"
              style={{
                background: "color-mix(in srgb, #DC2626 8%, transparent)",
                color: "#991B1B",
                border: "1px solid color-mix(in srgb, #DC2626 20%, transparent)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary w-full justify-center mt-6"
            style={{ opacity: pending ? 0.5 : 1 }}
          >
            {pending ? "Création…" : "Enregistrer le devis →"}
          </button>

          <p
            className="serif-i mt-4 text-xs text-center"
            style={{ color: "var(--color-subtle)" }}
          >
            Statut « Brouillon » par défaut, vous l'enverrez ensuite.
          </p>
        </div>
      </aside>
    </form>
  );
}

// ===== Sous-composants UI =====

function Card({
  title,
  italic,
  children,
}: {
  title: string;
  italic: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="display mb-5"
        style={{ fontSize: 24, letterSpacing: "-0.02em", lineHeight: 1.1 }}
      >
        {title}{" "}
        <em className="serif-i" style={{ color: "var(--color-accent)" }}>
          {italic}
        </em>
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="mono uppercase block mb-2"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-muted)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 outline-none transition"
      style={{
        background: "var(--color-bg)",
        border: "1px solid var(--color-line)",
        borderRadius: 8,
        fontSize: 15,
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line)")}
    />
  );
}

function SelectableCard({
  selected,
  onClick,
  title,
  description,
  price,
  pitch,
  locked,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  price: string;
  pitch?: string;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      className="text-left p-4 transition"
      style={{
        background: selected ? "var(--color-accent-soft)" : "var(--color-bg)",
        border: `1px solid ${selected ? "var(--color-accent)" : "var(--color-line)"}`,
        borderRadius: 10,
        cursor: locked ? "default" : "pointer",
        opacity: 1,
      }}
    >
      <div className="flex justify-between items-start gap-3 mb-1">
        <div className="flex items-center gap-2">
          <p style={{ fontWeight: 500, color: selected ? "var(--color-accent-ink)" : "var(--color-ink)" }}>
            {title}
          </p>
          {locked && (
            <span
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: 4,
                background: "var(--color-accent)",
                color: "#fff",
              }}
            >
              Obligatoire
            </span>
          )}
        </div>
        <p
          className="mono shrink-0"
          style={{
            fontSize: 13,
            color: selected ? "var(--color-accent-ink)" : "var(--color-ink)",
          }}
        >
          {price}
        </p>
      </div>
      <p className="text-xs" style={{ color: "var(--color-muted)", lineHeight: 1.5 }}>
        {description}
      </p>
      {pitch && (
        <p
          className="serif-i text-xs mt-2 pt-2"
          style={{
            color: selected ? "var(--color-accent-ink)" : "var(--color-subtle)",
            borderTop: `1px solid ${selected ? "color-mix(in srgb, var(--color-accent) 25%, transparent)" : "var(--color-line)"}`,
            lineHeight: 1.5,
            opacity: 0.85,
          }}
        >
          → {pitch}
        </p>
      )}
    </button>
  );
}
