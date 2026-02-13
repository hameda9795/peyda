import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import OpenAI from 'openai';
import { sanitizeGeneratedContent } from '@/lib/validators/highlights-validator';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { submissionId } = await request.json();

        // Get submission
        const submission = await db.businessSubmission.findUnique({
            where: { id: submissionId },
        });

        if (!submission) {
            return NextResponse.json(
                { error: 'Submission not found' },
                { status: 404 }
            );
        }

        // Update status to processing
        await db.businessSubmission.update({
            where: { id: submissionId },
            data: { status: 'processing' },
        });

        const formData = submission.formData as any;

        // Get category and subcategory names
        const category = await db.category.findUnique({
            where: { id: formData.category },
        });

        const subcategories = await db.subCategory.findMany({
            where: { id: { in: formData.subcategories } },
        });

        const categoryName = category?.name.replace(' in Utrecht', '') || 'Bedrijf';
        const subcategoryNames = subcategories.map(s => s.name).join(', ');

        // Build the AI prompt
        const prompt = buildPrompt(formData, categoryName, subcategoryNames);

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `Je bent een Nederlandse local SEO expert die content schrijft volgens Google's E-E-A-T richtlijnen.

=== KERNPRINCIPES ===
1. UNIEKHEID: Elke tekst moet zo specifiek zijn dat deze ALLEEN voor DIT bedrijf kan gelden
2. LOKAAL: Noem ALTIJD straten, wijken, of lokale herkenningspunten
3. AUTHENTIEK: Schrijf alsof je de ondernemer persoonlijk hebt geïnterviewd
4. ANTI-GENERIEK: Als een zin ook voor een concurrent zou kunnen gelden, HERSCHRIJF het

=== KRITIEK: GEEN FABRICATIE ===
Je mag NOOIT cijfers, statistieken of meetbare claims verzinnen die niet in BEDRIJFSGEGEVENS staan.
VERBODEN in highlights/content:
- "X klanten geholpen" (tenzij aantal expliciet gegeven)
- "Reactie binnen X uur" (tenzij responstijd gegeven)
- "X jaar ervaring" (tenzij foundedYear gegeven - dan bereken vanaf dat jaar)
- "X% tevreden klanten"
- Elke claim met cijfers die je niet kunt verifiëren uit de gegeven data

TOEGESTAAN in highlights:
- Locatie feiten: "Gelegen aan [straat]", "In het hart van [wijk]"
- Certificeringen: ALLEEN als ze in formData.certifications staan
- Faciliteiten: ALLEEN als ze in formData.amenities staan
- Algemene niet-meetbare statements: "Specialist in [dienst]", "Bekend om [kwaliteit]"

=== VERBODEN ZINNEN (Google penalty risico) ===
- "beste service", "hoge kwaliteit", "jarenlange ervaring"
- "klant staat centraal", "persoonlijke aanpak"
- "wij zijn een", "welkom bij"
- Elke zin zonder SPECIFIEK bewijs

=== VERPLICHTE ELEMENTEN ===
- "Near me" zoektermen in keywords
- Specifieke wijk/straat namen
- Unieke differentiators van DIT bedrijf

Je output is ALLEEN valide JSON. Geen markdown, geen uitleg.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const rawGeneratedContent = JSON.parse(completion.choices[0].message.content || '{}');

        // Sanitize generated content to remove fabricated claims
        const generatedContent = sanitizeGeneratedContent(rawGeneratedContent, formData);

        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
            const removedHighlights = (rawGeneratedContent.highlights || []).filter(
                (h: string) => !(generatedContent.highlights || []).includes(h)
            );
            const removedTrustSignals = (rawGeneratedContent.brand?.trustSignals || []).filter(
                (t: string) => !(generatedContent.brand?.trustSignals || []).includes(t)
            );

            console.log('\n========== SANITIZER DEBUG ==========');
            console.log('Submission ID:', submissionId);
            console.log('Business Name:', formData.name);
            console.log('\n--- Form Data Used ---');
            console.log('Certifications:', formData.certifications || []);
            console.log('Amenities:', formData.amenities || []);
            console.log('Founded Year:', formData.foundedYear || 'NOT SET');
            console.log('\n--- RAW Highlights ---');
            console.log(rawGeneratedContent.highlights || []);
            console.log('\n--- SANITIZED Highlights ---');
            console.log(generatedContent.highlights || []);
            console.log('\n--- REMOVED Highlights ---');
            console.log(removedHighlights);
            console.log('\n--- RAW Trust Signals ---');
            console.log(rawGeneratedContent.brand?.trustSignals || []);
            console.log('\n--- SANITIZED Trust Signals ---');
            console.log(generatedContent.brand?.trustSignals || []);
            console.log('\n--- REMOVED Trust Signals ---');
            console.log(removedTrustSignals);
            console.log('======================================\n');
        }

        // Update submission with generated content
        await db.businessSubmission.update({
            where: { id: submissionId },
            data: {
                status: 'completed',
                generatedContent,
            },
        });

        return NextResponse.json({
            success: true,
            submissionId,
            generatedContent,
        });
    } catch (error) {
        console.error('Error generating content:', error);

        return NextResponse.json(
            { error: 'Er is een fout opgetreden bij het genereren van de content.' },
            { status: 500 }
        );
    }
}

function buildPrompt(formData: any, categoryName: string, subcategoryNames: string): string {
    return `=== OPDRACHT: UNIEKE BEDRIJFSCONTENT GENEREREN ===

Je genereert content voor een SPECIFIEK bedrijf. Deze content moet zo uniek zijn dat deze ALLEEN voor dit bedrijf kan gelden.

=== KRITIEK: GEEN FABRICATIE VAN CIJFERS ===
VERBODEN - Je mag deze NOOIT verzinnen:
- "X klanten geholpen/bediend" → NIET GEBRUIKEN (geen data beschikbaar)
- "Reactie binnen X uur/minuten" → NIET GEBRUIKEN (geen data beschikbaar)
- "X% tevreden klanten" → NIET GEBRUIKEN (geen data beschikbaar)
- Elke numerieke claim zonder bron in BEDRIJFSGEGEVENS

TOEGESTAAN voor highlights:
- Locatie: "Gelegen aan ${formData.street}", "In ${formData.neighborhood}"
- Certificeringen: ${formData.certifications?.length > 0 ? formData.certifications.join(', ') : 'GEEN - gebruik geen certificering highlights'}
- Faciliteiten: ${formData.amenities?.length > 0 ? formData.amenities.join(', ') : 'GEEN - gebruik geen faciliteit highlights'}
- Opgericht: ${formData.foundedYear ? `Sinds ${formData.foundedYear} (${new Date().getFullYear() - formData.foundedYear} jaar actief)` : 'NIET BEKEND - gebruik geen "jaren ervaring" claims'}

=== VERBODEN (leidt tot penalty van Google) ===
- Generieke zinnen: "beste service", "hoge kwaliteit", "klant staat centraal"
- Vage claims zonder bewijs
- Teksten die ook voor een concurrent zouden kunnen gelden
- Beginnen met "Welkom bij" of "Wij zijn een"
- GEFABRICEERDE CIJFERS

=== VERPLICHT (voor Google E-E-A-T ranking) ===
- Specifieke feiten over DIT bedrijf (alleen uit BEDRIJFSGEGEVENS)
- Lokale referenties: straatnamen, wijken, landmarks
- "Near me" zoektermen in keywords

=== BEDRIJFSGEGEVENS ===
Naam: ${formData.name}
Categorie: ${categoryName}
Subcategorieën: ${subcategoryNames}
Eigen omschrijving: ${formData.shortDescription}
Adres: ${formData.street}, ${formData.postalCode} ${formData.city}
Wijk: ${formData.neighborhood}
Diensten: ${formData.services?.map((s: any) => s.name).join(', ') || 'Niet opgegeven'}
Faciliteiten: ${formData.amenities?.join(', ') || 'Niet opgegeven'}
Betaalmethoden: ${formData.paymentMethods?.join(', ') || 'Niet opgegeven'}
Talen: ${formData.languages?.join(', ') || 'Nederlands'}
Certificeringen: ${formData.certifications?.join(', ') || 'Geen'}
Opgericht: ${formData.foundedYear || 'Niet opgegeven'}
Werkgebied: ${formData.serviceArea || formData.neighborhood}

=== GENEREER JSON MET DEZE STRUCTUUR ===

{
  "longDescription": "HTML content met 3 secties:
    <h3>Over ${formData.name} in ${formData.neighborhood}</h3>
    <p>Wat maakt DIT bedrijf uniek? Noem concrete feiten, geen generieke claims.</p>

    <h3>Onze ${categoryName} diensten</h3>
    <p>Beschrijf diensten met lokale context. Noem specifieke straten/wijken waar jullie werken.</p>

    <h3>Waarom ${formData.city} kiest voor ${formData.name}</h3>
    <ul>
      <li>SPECIFIEKE reden 1 met bewijs</li>
      <li>SPECIFIEKE reden 2 met bewijs</li>
      <li>SPECIFIEKE reden 3 met bewijs</li>
    </ul>

    <p>Slotparagraaf: Maak lokale connectie - 'Als inwoner van ${formData.neighborhood}...'</p>",

  "highlights": [
    "ALLEEN TOEGESTAAN - kies 4-6 uit deze categorieën:",
    "- LOCATIE: 'Gelegen aan ${formData.street}' of 'In het hart van ${formData.neighborhood}'",
    "- CERTIFICERING: ALLEEN als in formData.certifications (anders NIET gebruiken)",
    "- FACILITEIT: ALLEEN als in formData.amenities (anders NIET gebruiken)",
    "- SPECIALISATIE: 'Specialist in [dienst uit services]'",
    "- OPGERICHT: ALLEEN '${formData.foundedYear ? `Sinds ${formData.foundedYear}` : 'NIET GEBRUIKEN - geen jaar bekend'}'"
  ],

  "tags": ["8 tags inclusief:", "${formData.neighborhood}", "${formData.city}", "[dienst] bij mij in de buurt"],

  "services": [
    {
      "name": "Exacte dienstnaam",
      "description": "Beschrijving met LOKALE context en SPECIFIEKE voordelen voor klanten in ${formData.neighborhood}"
    }
  ],

  "faq": [
    {
      "question": "Wat kost ${categoryName} bij ${formData.name} in ${formData.city}?",
      "answer": "Geef prijsindicatie of 'vanaf' prijs indien mogelijk"
    },
    {
      "question": "Hoe snel kan ik terecht bij ${formData.name}?",
      "answer": "Concrete responstijd/beschikbaarheid"
    },
    {
      "question": "Werkt ${formData.name} ook buiten ${formData.neighborhood}?",
      "answer": "Noem specifieke wijken/gebieden"
    },
    {
      "question": "[Technische vraag specifiek voor ${categoryName}]",
      "answer": "Toon expertise met concreet antwoord"
    },
    {
      "question": "Waarom zou ik ${formData.name} kiezen boven andere ${categoryName} in ${formData.city}?",
      "answer": "UNIEKE selling points - wat maakt jullie anders?"
    }
  ],

  "seo": {
    "title": "${categoryName} ${formData.city} | ${formData.name} (max 60 tekens)",
    "metaDescription": "Begin met klantvoordeel, noem ${formData.neighborhood}, eindig met CTA (max 155 tekens)",
    "h1": "${categoryName} in ${formData.neighborhood}, ${formData.city}",
    "keywords": [
      "${categoryName} ${formData.city}",
      "${categoryName} ${formData.neighborhood}",
      "${categoryName} bij mij in de buurt",
      "beste ${categoryName} ${formData.city}",
      "${categoryName} in de buurt ${formData.neighborhood}",
      "[dienst] ${formData.city} reviews",
      "[dienst] ${formData.city} prijzen",
      "goede ${categoryName} ${formData.neighborhood}"
    ],
    "localSeoText": "2 zinnen: Noem een lokaal herkenningspunt nabij ${formData.street} en waarom lokale klanten jullie vertrouwen."
  },

  "localRelevance": {
    "nearbyLandmarks": ["2-3 bekende plekken/straten in ${formData.neighborhood}"],
    "serviceRadius": "Welke wijken/gebieden bedienen jullie vanuit ${formData.neighborhood}?",
    "localTip": "Een insider-tip die alleen een lokaal bedrijf zou weten"
  },

  "competitiveEdge": {
    "uniqueFactor": "WAT maakt ${formData.name} anders dan de 10 andere ${categoryName} bedrijven in ${formData.city}?",
    "pricePosition": "budget | middensegment | premium",
    "specialization": "Specifieke niche of expertise"
  }
}

=== OUTPUT ===
Alleen valide JSON. Alle tekst in correct Nederlands.`;
}
