import { NextRequest, NextResponse } from 'next/server';
import { generateBatchContent } from '@/lib/ai-content-generator';
import { db as prisma } from '@/lib/db';
import { CATEGORY_KEYWORDS } from '@/lib/category-keywords';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { city = 'Utrecht', limit, saveToDb = true } = body;

    // Get all category slugs
    const categorySlugs = Object.keys(CATEGORY_KEYWORDS);
    const slugsToProcess = limit ? categorySlugs.slice(0, limit) : categorySlugs;

    const results = {
      success: [] as string[],
      failed: [] as { slug: string; error: string }[],
    };

    console.log(`Starting content generation for ${slugsToProcess.length} categories...`);

    const generatedContent = await generateBatchContent(
      slugsToProcess,
      city,
      (current, total) => {
        console.log(`Progress: ${current}/${total}`);
      }
    );

    // Save to database if requested
    if (saveToDb) {
      for (const [slug, content] of generatedContent.entries()) {
        try {
          // Find category by slug (with or without prefix)
          const category = await prisma.category.findFirst({
            where: {
              OR: [
                { slug: `/utrecht/${slug}` },
                { slug: `/nederland/${slug}` },
                { slug: slug },
                { slug: { contains: slug, mode: 'insensitive' } },
              ],
            },
          });

          if (category) {
            await prisma.category.update({
              where: { id: category.id },
              data: {
                contentIntro: content.intro,
                contentHistory: content.history,
                contentTypes: content.types,
                contentTips: content.tips,
                contentLocal: content.local,
                contentFull: content.fullHtml,
                keywords: content.keywords,
                contentGeneratedAt: new Date(),
                contentStatus: 'completed',
              },
            });
            results.success.push(slug);
          } else {
            results.failed.push({ slug, error: 'Category not found in database' });
          }
        } catch (error) {
          results.failed.push({ slug, error: String(error) });
        }
      }
    }

    return NextResponse.json({
      success: true,
      total: slugsToProcess.length,
      generated: generatedContent.size,
      saved: results.success.length,
      failed: results.failed.length,
      results,
    });
  } catch (error) {
    console.error('Error in batch generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate content batch' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Get status of content generation
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        contentGeneratedAt: true,
        contentStatus: true,
        keywords: true,
      },
    });

    const stats = {
      total: categories.length,
      completed: categories.filter(c => c.contentStatus === 'completed').length,
      pending: categories.filter(c => c.contentStatus === 'pending' || !c.contentStatus).length,
      generating: categories.filter(c => c.contentStatus === 'generating').length,
    };

    const categoriesWithContent = categories.filter(c => c.contentStatus === 'completed');

    return NextResponse.json({
      stats,
      categoriesWithContent: categoriesWithContent.map(c => ({
        name: c.name,
        slug: c.slug,
        generatedAt: c.contentGeneratedAt,
        keywordCount: c.keywords?.length || 0,
      })),
    });
  } catch (error) {
    console.error('Error getting content status:', error);
    return NextResponse.json(
      { error: 'Failed to get content status' },
      { status: 500 }
    );
  }
}
