import OpenAI from 'openai';
import { CATEGORY_KEYWORDS, getCategoryKeywords } from './category-keywords';
import { CITY_KEYWORDS, getCityKeywords } from './city-keywords';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedContent {
  intro: string;
  history: string;
  types: string;
  tips: string;
  local: string;
  fullHtml: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
}

export interface CityGeneratedContent {
  intro: string;
  history: string;
  economy: string;
  landmarks: string;
  localTips: string;
  fullHtml: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
}

export interface ContentGenerationParams {
  categorySlug: string;
  city?: string;
  generateFaqs?: boolean;
  language?: 'nl' | 'en';
}

export async function generateCategoryContent(params: ContentGenerationParams): Promise<GeneratedContent> {
  const { categorySlug, city = 'Utrecht', generateFaqs = true, language = 'nl' } = params;

  const categoryKeywords = getCategoryKeywords(categorySlug);
  if (!categoryKeywords) {
    throw new Error(`Category not found: ${categorySlug}`);
  }

  const categoryName = categoryKeywords.name;
  const keywords = [
    ...categoryKeywords.primaryKeywords,
    ...categoryKeywords.longTailKeywords.slice(0, 10),
    // Add city-specific keywords
    ...categoryKeywords.primaryKeywords.map(k => `${k} ${city}`),
  ];

  const systemPrompt = `Je bent een ervaren SEO-content writer gespecialiseerd in Nederlandse lokale bedrijvengidsen.
Je schrijft unieke, informatieve en SEO-geoptimaliseerde content voor categorie-pagina's.
De toon is vriendelijk, informatief en professioneel.
Gebruik relevante trefwoorden op natuurlijke wijze.
Schrijf in het Nederlands (tenzij anders aangegeven).
Formateer de content met HTML-tags voor een webpagina.`;

  const userPrompt = `Schrijf uitgebreide SEO-content voor de categorie "${categoryName}" in ${city}.

## Eisen:
1. **Introductie**: 80-100 woorden over ${categoryName} in ${city}, met relevante trefwoorden
2. **Geschiedenis/Background**: 60-80 woorden over de geschiedenis en ontwikkeling van deze sector
3. **Soorten/Diensten**: 120-150 woorden met een overzicht van verschillende soorten ${categoryName.toLowerCase()} diensten
4. **Tips**: 80-100 woorden met praktische tips voor consumenten
5. **Lokaal**: 80-100 woorden over specifieke aspecten in ${city}
6. **FAQs**: ${generateFaqs ? '5-7 veelgestelde vragen' : 'geen FAQs'}

## Trefwoorden om te gebruiken:
${keywords.slice(0, 15).join(', ')}

## Output formaat (JSON):
{
  "intro": "...",
  "history": "...",
  "types": "...",
  "tips": "...",
  "local": "...",
  "faqs": [
    {"question": "...", "answer": "..."}
  ]
}

Schrijf uitsluitend de JSON, zonder extra tekst of formatting.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');

    // Generate full HTML
    const fullHtml = generateFullHtml({
      name: categoryName,
      city,
      ...content,
      keywords,
    });

    return {
      intro: content.intro || '',
      history: content.history || '',
      types: content.types || '',
      tips: content.tips || '',
      local: content.local || '',
      fullHtml,
      keywords,
      faqs: content.faqs || [],
    };
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content');
  }
}

export async function generateSubcategoryContent(
  categoryName: string,
  subcategoryName: string,
  city: string = 'Utrecht'
): Promise<string> {
  const systemPrompt = `Je bent een ervaren SEO-content writer. Schrijf korte maar informatieve content voor een subcategorie-pagina in het Nederlands.`;

  const userPrompt = `Schrijf 150-200 woorden over "${subcategoryName}" in de categorie "${categoryName}" in ${city}.

Focus op:
- Wat deze dienst/service inhoudt
- Waarom klanten dit zoeken
- Lokale tips voor ${city}

Gebruik trefwoorden zoals: ${subcategoryName.toLowerCase()}, ${categoryName.toLowerCase()}, ${city}, service, professionals.

Output als JSON: { "content": "..." }`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.content || '';
  } catch (error) {
    console.error('Error generating subcategory content:', error);
    throw new Error('Failed to generate subcategory content');
  }
}

function generateFullHtml(params: {
  name: string;
  city: string;
  intro: string;
  history: string;
  types: string;
  tips: string;
  local: string;
  keywords: string[];
}): string {
  const { name, city, intro, history, types, tips, local, keywords } = params;

  return `
<section class="category-content" aria-label="Informatie over ${name.toLowerCase()} in ${city}">
  <div class="content-block">
    <h2>Over ${name} in ${city}</h2>
    <p>${intro}</p>
  </div>

  <div class="content-block">
    <h3>Geschiedenis en Achtergrond</h3>
    <p>${history}</p>
  </div>

  <div class="content-block">
    <h3>Soorten ${name}</h3>
    <p>${types}</p>
  </div>

  <div class="content-block">
    <h3>Praktische Tips</h3>
    <p>${tips}</p>
  </div>

  <div class="content-block">
    <h3>Lokaal in ${city}</h3>
    <p>${local}</p>
  </div>
</section>

<meta name="keywords" content="${keywords.join(', ')}" />
`;
}

// Batch generate content for multiple categories
export async function generateBatchContent(
  categorySlugs: string[],
  city: string = 'Utrecht',
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, GeneratedContent>> {
  const results = new Map<string, GeneratedContent>();

  for (let i = 0; i < categorySlugs.length; i++) {
    const slug = categorySlugs[i];
    try {
      const content = await generateCategoryContent({ categorySlug: slug, city });
      results.set(slug, content);
      onProgress?.(i + 1, categorySlugs.length);
    } catch (error) {
      console.error(`Error generating content for ${slug}:`, error);
    }
  }

  return results;
}

// Generate content for city + category combinations
export async function generateCityCategoryContent(
  categorySlug: string,
  citySlug: string
): Promise<string> {
  const categoryKeywords = getCategoryKeywords(categorySlug);
  if (!categoryKeywords) {
    throw new Error(`Category not found: ${categorySlug}`);
  }

  const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const prompt = `Schrijf 200-300 woorden over ${categoryKeywords.name.toLowerCase()} in ${cityName}.

Inclusief:
- Specifieke informatie over ${cityName}
- Lokale bedrijven en dienstverleners
- Tips voor het vinden van goede ${categoryKeywords.name.toLowerCase()} in ${cityName}

Format: HTML met <p> tags.

Output als JSON: { "content": "..." }`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.content || '';
  } catch (error) {
    console.error('Error generating city category content:', error);
    throw new Error('Failed to generate city category content');
  }
}

// Generate city-specific content
export async function generateCityContent(
  citySlug: string,
  generateFaqs: boolean = true
): Promise<CityGeneratedContent> {
  const cityKeywords = getCityKeywords(citySlug);
  if (!cityKeywords) {
    throw new Error(`City not found: ${citySlug}`);
  }

  const cityName = cityKeywords.name;
  const keywords = [
    ...cityKeywords.primaryKeywords,
    ...cityKeywords.longTailKeywords.slice(0, 10),
  ];

  const systemPrompt = `Je bent een ervaren SEO-content writer gespecialiseerd in Nederlandse steden en regio's.
Je schrijft unieke, informatieve en SEO-geoptimaliseerde content voor stadspagina's.
De toon is vriendelijk, informatief en professioneel.
Gebruik relevante trefwoorden op natuurlijke wijze.
Schrijf in het Nederlands.`;

  const userPrompt = `Schrijf uitgebreide SEO-content voor de stad "${cityName}" in Nederland.

## Eisen:
1. **Introductie**: 80-100 woorden over ${cityName}, met relevante trefwoorden
2. **Geschiedenis**: 80-100 woorden over de geschiedenis en ontwikkeling van de stad
3. **Economie**: 80-100 woorden over de economie en zakelijke kansen
4. **Bezienswaardigheden**: 80-100 woorden over belangrijke bezienswaardigheden
5. **Lokale Tips**: 80-100 woorden met praktische tips voor bezoekers en ondernemers
6. **FAQs**: ${generateFaqs ? '5-6 veelgestelde vragen' : 'geen FAQs'}

## Trefwoorden om te gebruiken:
${keywords.slice(0, 15).join(', ')}

## Output formaat (JSON):
{
  "intro": "...",
  "history": "...",
  "economy": "...",
  "landmarks": "...",
  "localTips": "...",
  "faqs": [
    {"question": "...", "answer": "..."}
  ]
}

Schrijf uitsluitend de JSON, zonder extra tekst of formatting.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');

    // Generate full HTML
    const fullHtml = generateCityFullHtml({
      name: cityName,
      ...content,
      keywords,
    });

    return {
      intro: content.intro || '',
      history: content.history || '',
      economy: content.economy || '',
      landmarks: content.landmarks || '',
      localTips: content.localTips || '',
      fullHtml,
      keywords,
      faqs: content.faqs || [],
    };
  } catch (error) {
    console.error('Error generating city content:', error);
    throw new Error('Failed to generate city content');
  }
}

function generateCityFullHtml(params: {
  name: string;
  intro: string;
  history: string;
  economy: string;
  landmarks: string;
  localTips: string;
  keywords: string[];
}): string {
  const { name, intro, history, economy, landmarks, localTips, keywords } = params;

  return `
<section class="city-content" aria-label="Informatie over ${name}">
  <div class="content-block">
    <h2>Over ${name}</h2>
    <p>${intro}</p>
  </div>

  <div class="content-block">
    <h3>Geschiedenis</h3>
    <p>${history}</p>
  </div>

  <div class="content-block">
    <h3>Economie en Zakelijke Kansen</h3>
    <p>${economy}</p>
  </div>

  <div class="content-block">
    <h3>Bezienswaardigheden</h3>
    <p>${landmarks}</p>
  </div>

  <div class="content-block">
    <h3>Lokale Tips</h3>
    <p>${localTips}</p>
  </div>
</section>

<meta name="keywords" content="${keywords.join(', ')}" />
`;
}

// Batch generate content for multiple cities
export async function generateBatchCityContent(
  citySlugs: string[],
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, CityGeneratedContent>> {
  const results = new Map<string, CityGeneratedContent>();

  for (let i = 0; i < citySlugs.length; i++) {
    const slug = citySlugs[i];
    try {
      const content = await generateCityContent(slug);
      results.set(slug, content);
      onProgress?.(i + 1, citySlugs.length);
    } catch (error) {
      console.error(`Error generating content for city ${slug}:`, error);
    }
  }

  return results;
}
