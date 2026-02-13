-- CreateTable
CREATE TABLE "business_owners" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "businessId" TEXT NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_analytics" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "phoneClicks" INTEGER NOT NULL DEFAULT 0,
    "websiteClicks" INTEGER NOT NULL DEFAULT 0,
    "directionsClicks" INTEGER NOT NULL DEFAULT 0,
    "emailClicks" INTEGER NOT NULL DEFAULT 0,
    "bookingClicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_interactions" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_owners_email_key" ON "business_owners"("email");

-- CreateIndex
CREATE UNIQUE INDEX "business_owners_businessId_key" ON "business_owners"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "business_analytics_businessId_key" ON "business_analytics"("businessId");

-- CreateIndex
CREATE INDEX "business_analytics_businessId_idx" ON "business_analytics"("businessId");

-- CreateIndex
CREATE INDEX "business_analytics_month_idx" ON "business_analytics"("month");

-- CreateIndex
CREATE UNIQUE INDEX "business_analytics_businessId_month_key" ON "business_analytics"("businessId", "month");

-- CreateIndex
CREATE INDEX "business_interactions_businessId_idx" ON "business_interactions"("businessId");

-- CreateIndex
CREATE INDEX "business_interactions_type_idx" ON "business_interactions"("type");

-- CreateIndex
CREATE INDEX "business_interactions_createdAt_idx" ON "business_interactions"("createdAt");

-- AddForeignKey
ALTER TABLE "business_owners" ADD CONSTRAINT "business_owners_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_analytics" ADD CONSTRAINT "business_analytics_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_interactions" ADD CONSTRAINT "business_interactions_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
