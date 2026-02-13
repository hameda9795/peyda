-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "contentEconomy" TEXT,
ADD COLUMN     "contentFull" TEXT,
ADD COLUMN     "contentGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "contentHistory" TEXT,
ADD COLUMN     "contentIntro" TEXT,
ADD COLUMN     "contentLandmarks" TEXT,
ADD COLUMN     "contentLocalTips" TEXT,
ADD COLUMN     "contentStatus" TEXT DEFAULT 'pending',
ADD COLUMN     "faqs" JSONB,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "province" TEXT;

-- CreateIndex
CREATE INDEX "cities_slug_idx" ON "cities"("slug");
