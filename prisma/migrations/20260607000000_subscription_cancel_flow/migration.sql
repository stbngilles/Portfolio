-- Flow d'annulation éthique : raison + contre-offre contextuelle + confirmation
ALTER TABLE "Subscription" ADD COLUMN "cancelReason" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "cancelReasonText" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "cancelRequestedAt" DATETIME;
ALTER TABLE "Subscription" ADD COLUMN "cancelEffectiveAt" DATETIME;
ALTER TABLE "Subscription" ADD COLUMN "counterOfferType" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "counterOfferAcceptedAt" DATETIME;
ALTER TABLE "Subscription" ADD COLUMN "pausedUntil" DATETIME;
