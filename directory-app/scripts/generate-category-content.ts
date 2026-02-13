/**
 * Seed script for generating AI content for all categories
 * Usage: npx tsx scripts/generate-category-content.ts
 */

import { config } from 'dotenv';
config(); // Load environment variables from .env

import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { CATEGORY_KEYWORDS } from '../src/lib/category-keywords';

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mapping between keyword file slugs and database slugs (only for mismatches)
const SLUG_MAPPING: Record<string, string> = {
  // Add mappings only if keyword file key differs from database slug
};

interface GeneratedContent {
  intro: string;
  history: string;
  types: string;
  tips: string;
  local: string;
  faqs: { question: string; answer: string }[];
}

async function generateContent(categorySlug: string, categoryName: string, city: string = 'Utrecht'): Promise<GeneratedContent> {
  const keywords = CATEGORY_KEYWORDS[categorySlug];
  const keywordList = keywords
    ? [...keywords.primaryKeywords, ...keywords.longTailKeywords.slice(0, 10)]
    : [categoryName.toLowerCase()];

  const prompt = `Schrijf uitgebreide SEO-content voor de categorie "${categoryName}" in ${city}.

## Eisen:
1. **Introductie**: 80-100 woorden
2. **Geschiedenis**: 60-80 woorden
3. **Soorten/Diensten**: 120-150 woorden
4. **Tips**: 80-100 woorden
5. **Lokaal**: 80-100 woorden
6. **FAQs**: 5 vragen met antwoorden

Trefwoorden: ${keywordList.slice(0, 15).join(', ')}

Output als JSON:
{
  "intro": "...",
  "history": "...",
  "types": "...",
  "tips": "...",
  "local": "...",
  "faqs": [{"question": "...", "answer": "..."}]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    return {
      intro: content.intro || '',
      history: content.history || '',
      types: content.types || '',
      tips: content.tips || '',
      local: content.local || '',
      faqs: content.faqs || [],
    };
  } catch (error) {
    console.error(`Error generating content for ${categorySlug}:`, error);
    throw error;
  }
}

function generateFullHtml(content: GeneratedContent, categoryName: string, city: string, keywords: string[]): string {
  return `
<section class="category-content" aria-label="Informatie over ${categoryName.toLowerCase()} in ${city}">
  <div class="content-block">
    <h2>Over ${categoryName} in ${city}</h2>
    <p>${content.intro}</p>
  </div>

  <div class="content-block">
    <h3>Geschiedenis en Achtergrond</h3>
    <p>${content.history}</p>
  </div>

  <div class="content-block">
    <h3>Soorten ${categoryName}</h3>
    <p>${content.types}</p>
  </div>

  <div class="content-block">
    <h3>Praktische Tips</h3>
    <p>${content.tips}</p>
  </div>

  <div class="content-block">
    <h3>Lokaal in ${city}</h3>
    <p>${content.local}</p>
  </div>
</section>
<meta name="keywords" content="${keywords.join(', ')}" />
`;
}

async function findCategoryInDb(keywordSlug: string): Promise<any> {
  // First try direct mapping
  const mappedSlug = SLUG_MAPPING[keywordSlug];
  if (mappedSlug) {
    const dbCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: `/utrecht/${mappedSlug}` },
          { slug: `/nederland/${mappedSlug}` },
          { slug: mappedSlug },
          { slug: { contains: mappedSlug, mode: 'insensitive' } },
        ],
      },
    });
    if (dbCategory) return dbCategory;
  }

  // Try original slug
  const dbCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: `/utrecht/${keywordSlug}` },
        { slug: `/nederland/${keywordSlug}` },
        { slug: keywordSlug },
        { slug: { contains: keywordSlug, mode: 'insensitive' } },
        // Try searching by name
        { name: { contains: keywordSlug.split('-').join(' '), mode: 'insensitive' } },
      ],
    },
  });

  return dbCategory;
}

async function generateAllContent() {
  console.log('Starting content generation...\n');

  const categorySlugs = Object.keys(CATEGORY_KEYWORDS);
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < categorySlugs.length; i++) {
    const slug = categorySlugs[i];
    const category = CATEGORY_KEYWORDS[slug];
    const categoryName = category.name;

    console.log(`[${i + 1}/${categorySlugs.length}] Generating content for: ${categoryName}...`);

    try {
      // Generate content
      const content = await generateContent(slug, categoryName);

      // Generate full HTML
      const fullHtml = generateFullHtml(content, categoryName, 'Nederland', category.primaryKeywords);

      // Find category in database
      const dbCategory = await findCategoryInDb(slug);

      if (dbCategory) {
        // Update category with generated content
        await prisma.category.update({
          where: { id: dbCategory.id },
          data: {
            contentIntro: content.intro,
            contentHistory: content.history,
            contentTypes: content.types,
            contentTips: content.tips,
            contentLocal: content.local,
            contentFull: fullHtml,
            faqs: content.faqs,
            keywords: category.primaryKeywords,
            contentGeneratedAt: new Date(),
            contentStatus: 'completed',
          },
        });
        console.log(`  ✓ Saved to database (slug: ${dbCategory.slug})`);
        successCount++;
      } else {
        console.log(`  ✗ Category not found in database`);
        // Log all categories for debugging
        const allCategories = await prisma.category.findMany({
          select: { slug: true, name: true },
        });
        console.log('  Available categories:', allCategories.map(c => c.slug).join(', '));
        failCount++;
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`  ✗ Error: ${error}`);
      failCount++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Total categories: ${categorySlugs.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  await prisma.$disconnect();
}

// Run if called directly
generateAllContent()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
