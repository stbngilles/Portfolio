import { prisma } from "@/lib/db";
import { COMMISSION_RATES } from "@/lib/pricing";

/**
 * Calcule le MRR récurrent personnel d'un commercial.
 * Source : somme des abonnements ACTIFS dont le projet a ce commercial assigné.
 * Multiplié par le taux de commission récurrent.
 *
 * C'est la valeur qui doit grimper mois après mois et motiver le commercial :
 * « tant que ces clients restent abonnés, je touche ça tous les mois ».
 */
export async function getCommercialRecurringMRR(
  commercialId: string,
): Promise<{ mrrBase: number; commission: number; subscriptions: number }> {
  const subs = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      project: { commercialId },
    },
    select: { monthlyAmount: true },
  });
  const mrrBase = subs.reduce((acc, s) => acc + s.monthlyAmount, 0);
  return {
    mrrBase,
    commission: Math.round(mrrBase * COMMISSION_RATES.RECURRING),
    subscriptions: subs.length,
  };
}

/**
 * Récap des commissions d'un commercial (cumulé, à payer, payées).
 * On regroupe par type pour distinguer one-shot / pack / mensuel.
 */
export async function getCommercialCommissionStats(commercialId: string) {
  const [pending, paid] = await Promise.all([
    prisma.commission.aggregate({
      where: { commercialId, status: "PENDING" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.commission.aggregate({
      where: { commercialId, status: "PAID" },
      _sum: { amount: true },
      _count: true,
    }),
  ]);
  return {
    pendingTotal: pending._sum.amount ?? 0,
    pendingCount: pending._count,
    paidTotal: paid._sum.amount ?? 0,
    paidCount: paid._count,
  };
}

/**
 * MRR total de l'agence (toutes souscriptions actives confondues).
 */
export async function getAgencyMRR(): Promise<number> {
  const agg = await prisma.subscription.aggregate({
    where: { status: "ACTIVE" },
    _sum: { monthlyAmount: true },
  });
  return agg._sum.monthlyAmount ?? 0;
}
