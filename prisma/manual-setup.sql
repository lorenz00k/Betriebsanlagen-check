-- ============================================
-- MANUAL DATABASE SETUP
-- Betriebsanlagen-Check Document System
-- ============================================
-- Execute this SQL directly in Vercel Postgres Console
-- if `prisma db push` doesn't work
-- ============================================

-- 1. FormSession Table
CREATE TABLE IF NOT EXISTS "FormSession" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'de',
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "totalSteps" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormSession_pkey" PRIMARY KEY ("id")
);

-- Unique constraint and indexes for FormSession
CREATE UNIQUE INDEX IF NOT EXISTS "FormSession_sessionToken_key" ON "FormSession"("sessionToken");
CREATE INDEX IF NOT EXISTS "FormSession_sessionToken_idx" ON "FormSession"("sessionToken");
CREATE INDEX IF NOT EXISTS "FormSession_status_idx" ON "FormSession"("status");
CREATE INDEX IF NOT EXISTS "FormSession_createdAt_idx" ON "FormSession"("createdAt");

-- 2. FormData Table
CREATE TABLE IF NOT EXISTS "FormData" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldValue" TEXT NOT NULL,
    "section" TEXT,
    "stepNumber" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormData_pkey" PRIMARY KEY ("id")
);

-- Unique constraint and indexes for FormData
CREATE UNIQUE INDEX IF NOT EXISTS "FormData_sessionId_fieldName_key" ON "FormData"("sessionId", "fieldName");
CREATE INDEX IF NOT EXISTS "FormData_sessionId_idx" ON "FormData"("sessionId");

-- Foreign key for FormData
ALTER TABLE "FormData"
ADD CONSTRAINT "FormData_sessionId_fkey"
FOREIGN KEY ("sessionId")
REFERENCES "FormSession"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- 3. GeneratedDocument Table
CREATE TABLE IF NOT EXISTS "GeneratedDocument" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedDocument_pkey" PRIMARY KEY ("id")
);

-- Indexes for GeneratedDocument
CREATE INDEX IF NOT EXISTS "GeneratedDocument_sessionId_idx" ON "GeneratedDocument"("sessionId");
CREATE INDEX IF NOT EXISTS "GeneratedDocument_documentType_idx" ON "GeneratedDocument"("documentType");

-- Foreign key for GeneratedDocument
ALTER TABLE "GeneratedDocument"
ADD CONSTRAINT "GeneratedDocument_sessionId_fkey"
FOREIGN KEY ("sessionId")
REFERENCES "FormSession"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- 4. DocumentDownload Table (für Analytics)
CREATE TABLE IF NOT EXISTS "DocumentDownload" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentDownload_pkey" PRIMARY KEY ("id")
);

-- Indexes for DocumentDownload
CREATE INDEX IF NOT EXISTS "DocumentDownload_documentId_idx" ON "DocumentDownload"("documentId");
CREATE INDEX IF NOT EXISTS "DocumentDownload_downloadedAt_idx" ON "DocumentDownload"("downloadedAt");

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to check if everything worked:

-- Check if tables exist:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check FormSession structure:
-- \d "FormSession"

-- Check all tables are created:
-- SELECT COUNT(*) FROM "FormSession";
-- SELECT COUNT(*) FROM "FormData";
-- SELECT COUNT(*) FROM "GeneratedDocument";
-- SELECT COUNT(*) FROM "DocumentDownload";

-- ============================================
-- DONE!
-- Tables are now ready for the document system.
-- ============================================
