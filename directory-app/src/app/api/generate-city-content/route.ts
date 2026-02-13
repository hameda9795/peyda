import { NextResponse } from 'next/server';
import { generateCityContent } from '@/lib/ai-content-generator';
import { CITY_KEYWORDS } from '@/lib/city-keywords';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get('citySlug');

    if (!citySlug) {
      return NextResponse.json(
        { success: false, error: 'citySlug is required' },
        { status: 400 }
      );
    }

    // Check if city exists in keywords file
    const cityKeywords = CITY_KEYWORDS[citySlug];
    if (!cityKeywords) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }

    // Generate content
    const content = await generateCityContent(citySlug);

    return NextResponse.json({
      success: true,
      content: {
        intro: content.intro,
        history: content.history,
        economy: content.economy,
        landmarks: content.landmarks,
        localTips: content.localTips,
        keywords: content.keywords,
        faqs: content.faqs,
      },
    });
  } catch (error) {
    console.error('Error generating city content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
