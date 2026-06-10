-- AlterTable
ALTER TABLE "ProjectStage" ADD COLUMN "devNote" TEXT;
ALTER TABLE "ProjectStage" ADD COLUMN "devUrl" TEXT;
ALTER TABLE "ProjectStage" ADD COLUMN "validationNote" TEXT;
ALTER TABLE "ProjectStage" ADD COLUMN "validationUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "address" TEXT;
ALTER TABLE "User" ADD COLUMN "city" TEXT;
ALTER TABLE "User" ADD COLUMN "country" TEXT DEFAULT 'BE';
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "User" ADD COLUMN "vatNumber" TEXT;

-- CreateTable
CREATE TABLE "ProjectCredential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "service" TEXT NOT NULL DEFAULT 'OTHER',
    "username" TEXT,
    "password" TEXT,
    "url" TEXT,
    "apiKey" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectCredential_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlockerReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "devId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "adminNote" TEXT,
    "resolvedAt" DATETIME,
    "resolvedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BlockerReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlockerReport_devId_fkey" FOREIGN KEY ("devId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeliverySubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "devId" TEXT NOT NULL,
    "preprodUrl" TEXT NOT NULL,
    "deploymentNotes" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "round" INTEGER NOT NULL DEFAULT 1,
    "adminFeedback" TEXT,
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DeliverySubmission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DeliverySubmission_devId_fkey" FOREIGN KEY ("devId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QAItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "order" INTEGER NOT NULL DEFAULT 0,
    "attachmentUrls" TEXT,
    "fixedAt" DATETIME,
    "fixedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QAItem_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "DeliverySubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaintenanceTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "month" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "doneAt" DATETIME,
    "doneBy" TEXT,
    "report" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MaintenanceTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteId" TEXT,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "commercialId" TEXT,
    "devId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'BRIEFING',
    "briefData" TEXT,
    "devPaymentAmount" INTEGER,
    "devPaymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "devPaymentPaidAt" DATETIME,
    "deadline" DATETIME,
    "kickoffDone" BOOLEAN NOT NULL DEFAULT false,
    "kickoffAt" DATETIME,
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "techStack" TEXT,
    "assetsState" TEXT,
    "devInvoiceUrl" TEXT,
    "devInvoiceFilename" TEXT,
    "devInvoiceUploadedAt" DATETIME,
    "startedAt" DATETIME,
    "liveAt" DATETIME,
    "blockedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_commercialId_fkey" FOREIGN KEY ("commercialId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_devId_fkey" FOREIGN KEY ("devId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("briefData", "clientId", "commercialId", "createdAt", "deadline", "devId", "devPaymentAmount", "devPaymentPaidAt", "devPaymentStatus", "id", "liveAt", "name", "quoteId", "startedAt", "status", "updatedAt") SELECT "briefData", "clientId", "commercialId", "createdAt", "deadline", "devId", "devPaymentAmount", "devPaymentPaidAt", "devPaymentStatus", "id", "liveAt", "name", "quoteId", "startedAt", "status", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_quoteId_key" ON "Project"("quoteId");
CREATE TABLE "new_Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "commercialId" TEXT,
    "clientId" TEXT,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientCompany" TEXT,
    "clientPhone" TEXT,
    "clientVat" TEXT,
    "clientAddress" TEXT,
    "clientPostalCode" TEXT,
    "clientCity" TEXT,
    "clientCountry" TEXT DEFAULT 'BE',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalOneShot" INTEGER NOT NULL DEFAULT 0,
    "totalRecurring" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "producerServices" TEXT,
    "needsAdminReview" BOOLEAN NOT NULL DEFAULT false,
    "adminReviewedAt" DATETIME,
    "adminReviewNote" TEXT,
    "sentAt" DATETIME,
    "signedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Quote" ("clientCompany", "clientEmail", "clientId", "clientName", "commercialId", "createdAt", "id", "notes", "number", "sentAt", "signedAt", "status", "totalOneShot", "totalRecurring", "updatedAt") SELECT "clientCompany", "clientEmail", "clientId", "clientName", "commercialId", "createdAt", "id", "notes", "number", "sentAt", "signedAt", "status", "totalOneShot", "totalRecurring", "updatedAt" FROM "Quote";
DROP TABLE "Quote";
ALTER TABLE "new_Quote" RENAME TO "Quote";
CREATE UNIQUE INDEX "Quote_number_key" ON "Quote"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
