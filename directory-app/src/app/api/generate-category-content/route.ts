import { NextRequest, NextResponse } from 'next/server';
import { generateCategoryContent } from '@/lib/ai-content-generator';
import { db as prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categorySlug, city = 'Utrecht', saveToDb = true } = body;

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    // Generate content
    const content = await generateCategoryContent({
      categorySlug,
      city,
      generateFaqs: true,
    });

    // Save to database if requested
    if (saveToDb) {
      const category = await prisma.category.findUnique({
        where: { slug: `/utrecht/${categorySlug}` },
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
      }
    }

    return NextResponse.json({
      success: true,
      categorySlug,
      content: {
        intro: content.intro,
        history: content.history,
        types: content.types,
        tips: content.tips,
        local: content.local,
        faqs: content.faqs,
        keywords: content.keywords,
      },
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('categorySlug');
    const city = searchParams.get('city') || 'Utrecht';

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    // Get existing content from database
    const category = await prisma.category.findFirst({
      where: {
        slug: {
          contains: categorySlug,
          mode: 'insensitive',
        },
      },
    });

    if (category && category.contentFull) {
      return NextResponse.json({
        success: true,
        source: 'database',
        content: {
          intro: category.contentIntro,
          history: category.contentHistory,
          types: category.contentTypes,
          tips: category.contentTips,
          local: category.contentLocal,
          fullHtml: category.contentFull,
          keywords: category.keywords,
        },
      });
    }

    // Generate new content if not in database
    const content = await generateCategoryContent({ categorySlug, city });

    return NextResponse.json({
      success: true,
      source: 'generated',
      content: {
        intro: content.intro,
        history: content.history,
        types: content.types,
        tips: content.tips,
        local: content.local,
        fullHtml: content.fullHtml,
        keywords: content.keywords,
        faqs: content.faqs,
      },
    });
  } catch (error) {
    console.error('Error getting content:', error);
    return NextResponse.json(
      { error: 'Failed to get content' },
      { status: 500 }
    );
  }
}
