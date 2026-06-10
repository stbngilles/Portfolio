-- CreateTable
CREATE TABLE "ReleaseRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "devId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "decidedAt" DATETIME,
    "decidedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReleaseRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReleaseRequest_devId_fkey" FOREIGN KEY ("devId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "startedAt" DATETIME,
    "liveAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_commercialId_fkey" FOREIGN KEY ("commercialId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_devId_fkey" FOREIGN KEY ("devId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("briefData", "clientId", "commercialId", "createdAt", "devId", "id", "liveAt", "name", "quoteId", "startedAt", "status", "updatedAt") SELECT "briefData", "clientId", "commercialId", "createdAt", "devId", "id", "liveAt", "name", "quoteId", "startedAt", "status", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_quoteId_key" ON "Project"("quoteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
