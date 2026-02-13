-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "contentFull" TEXT,
ADD COLUMN     "contentGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "contentHistory" TEXT,
ADD COLUMN     "contentIntro" TEXT,
ADD COLUMN     "contentLocal" TEXT,
ADD COLUMN     "contentStatus" TEXT DEFAULT 'pending',
ADD COLUMN     "contentTips" TEXT,
ADD COLUMN     "contentTypes" TEXT,
ADD COLUMN     "keywords" TEXT[];

-- AlterTable
ALTER TABLE "subcategories" ADD COLUMN     "contentFull" TEXT,
ADD COLUMN     "contentGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "contentIntro" TEXT,
ADD COLUMN     "contentStatus" TEXT DEFAULT 'pending',
ADD COLUMN     "keywords" TEXT[];
