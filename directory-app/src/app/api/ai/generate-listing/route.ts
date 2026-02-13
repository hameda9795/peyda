import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type GeneratedPayload = {
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  faq: { question: string; answer: string }[];
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
    localSeoText: string;
    tags: string[];
    ogTitle: string;
    ogDescription: string;
    canonicalSuggestion: string;
  };
  media: {
    altTexts: string[];
  };
  brand: {
    overviewSentence: string;
    trustSignals: string[];
  };
  localRelevance: {
    nearbyLandmarks: string[];
    serviceRadius: string;
    localTip: string;
  };
  competitiveEdge: {
    uniqueFactor: string;
    pricePosition: 'budget' | 'middensegment' | 'premium';
    specialization: string;
  };
  human_review_required: boolean;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { formData } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const services = (formData?.services || []).map((s: any) => s.name).filter(Boolean);
    const amenities = formData?.amenities || [];
    const certs = formData?.certifications || [];
    const neighborhood = formData?.neighborhood ? `, ${formData.neighborhood}` : '';
    const province = formData?.province ? `, ${formData.province}` : '';
    const locationLine = `${formData?.street || ''} ${formData?.postalCode || ''} ${formData?.city || ''}${neighborhood}${province}`.trim();

    const prompt = `
Je bent een EXPERT Nederlandse local SEO copywriter die schrijft volgens Google's E-E-A-T richtlijnen (Experience, Expertise, Authoritativeness, Trustworthiness).

=== KRITIEKE REGELS OM UNIEKE CONTENT TE GENEREREN ===
1. VERBODEN: Generieke zinnen zoals "beste service", "hoge kwaliteit", "jarenlange ervaring", "klant staat centraal"
2. VERPLICHT: Noem SPECIFIEKE lokale landmarks, straten, of bekende plekken in de buurt
3. VERPLICHT: Schrijf alsof je de ondernemer hebt geïnterviewd - persoonlijk en authentiek
4. VERPLICHT: Beantwoord de vraag "Waarom dit bedrijf en niet de 50 andere in de buurt?"
5. VERPLICHT: Gebruik "near me" zoekpatronen in keywords (bijv. "loodgieter bij mij in de buurt")

=== BEDRIJFSGEGEVENS ===
- Naam: ${formData?.name}
- Categorie: ${formData?.category} | Diensten: ${services.join(', ') || '—'}
- Locatie: ${locationLine || 'niet opgegeven'}
- Wijk/Buurt: ${formData?.neighborhood || 'niet opgegeven'}
- Stad: ${formData?.city || 'niet opgegeven'}
- Werkgebied: ${formData?.serviceArea || 'niet opgegeven'}
- Opgericht: ${formData?.foundedYear || 'niet opgegeven'}
- Certificaten: ${certs.join(', ') || 'niet opgegeven'}
- Kenmerken: ${amenities.join(', ') || 'niet opgegeven'}

=== OPDRACHT ===

1) shortDescription (max 160 tekens):
   - Begin met een UNIEK feit over dit bedrijf
   - Eindig met zachte CTA
   - NOOIT beginnen met "Welkom bij" of "Wij zijn"

2) longDescription (3-4 alinea's HTML):
   <h3>Over ${formData?.name}</h3>
   <p>Eerste alinea: Wat maakt dit bedrijf UNIEK? Noem concrete feiten.</p>
   <h3>Onze diensten in ${formData?.neighborhood || formData?.city}</h3>
   <p>Tweede alinea: Beschrijf diensten met lokale context - noem straten/wijken.</p>
   <h3>Waarom klanten ons kiezen</h3>
   <ul><li>Drie SPECIFIEKE redenen - geen generieke USPs</li></ul>
   <p>Slotparagraaf: Lokale verbinding - "Als uw buren in [wijk]..."</p>

3) highlights (4-6 bullets):
   - ALLEEN feiten uit BEDRIJFSGEGEVENS - NOOIT cijfers verzinnen!
   - GOED: "Gelegen aan ${formData?.street || '[straat]'}", "${certs.length > 0 ? certs[0] + ' gecertificeerd' : 'Specialist in [dienst]'}"
   - GOED: "${formData?.foundedYear ? `Sinds ${formData.foundedYear} actief` : 'Gevestigd in ' + (formData?.neighborhood || formData?.city)}"
   - FOUT: "Reactie binnen X uur" (geen data), "X klanten geholpen" (geen data)
   - GEBRUIK ALLEEN: locatie, certificeringen (als gegeven), faciliteiten (als gegeven), specialisatie

4) faq (5 vragen):
   - Vraag 1: "Wat kost [dienst] in ${formData?.city}?" met prijsindicatie
   - Vraag 2: "Hoe snel kan ik terecht bij ${formData?.name}?"
   - Vraag 3: "Werkt ${formData?.name} ook in [nabije wijk]?"
   - Vraag 4: Specifieke technische vraag over de dienst
   - Vraag 5: "Wat zeggen klanten over ${formData?.name}?"

5) seo object:
   - title (<=60 tekens): "${formData?.category} ${formData?.city} | ${formData?.name}"
   - metaDescription (<=155 tekens): Begin met voordeel voor klant, eindig met CTA
   - keywords (12 items) MOET BEVATTEN:
     * "[dienst] bij mij in de buurt"
     * "[dienst] ${formData?.city}"
     * "[dienst] ${formData?.neighborhood}"
     * "beste [dienst] ${formData?.city}"
     * "[dienst] in de buurt ${formData?.city}"
     * Long-tail varianten
   - localSeoText: 2 zinnen met straatnaam/wijk EN een lokaal herkenningspunt
   - tags: 8 tags inclusief wijk-specifieke
   - ogTitle: Krachtige headline met locatie
   - ogDescription: Social proof + locatie + CTA
   - canonicalSuggestion: /[provincie]/[stad]/[wijk]/[categorie]/[naam-slug]

6) media.altTexts (3 verschillende):
   - Formaat: "[Dienst] door [bedrijfsnaam] in [wijk], [stad]"
   - Elke alt-text uniek en beschrijvend

7) brand object:
   - overviewSentence: 1 zin voor Google AI Overviews - feitelijk en citeerbaar (GEEN gefabriceerde cijfers)
   - trustSignals: 3 bullets ALLEEN met feiten uit BEDRIJFSGEGEVENS:
     * Certificeringen ALLEEN als in formData.certifications
     * Jaar opgericht ALLEEN als foundedYear gegeven
     * Locatie/wijk feiten
     * NOOIT: "X klanten", "X jaar", "X% tevreden" tenzij expliciet gegeven

8) localRelevance (NIEUW):
   - nearbyLandmarks: 2-3 bekende plekken in de buurt
   - serviceRadius: "Wij bedienen ${formData?.city} en omliggende wijken zoals..."
   - localTip: Een insider-tip die alleen een lokaal bedrijf zou weten

9) competitiveEdge (NIEUW):
   - uniqueFactor: WAT maakt dit bedrijf anders dan concurrenten?
   - pricePosition: "budget" / "middensegment" / "premium"
   - specialization: Specifieke niche of specialisatie

10) human_review_required = true

=== OUTPUT FORMAT ===
Alleen valide JSON. Geen markdown. Alle tekst in correct Nederlands.
`;


    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.4,
      messages: [
        { role: 'system', content: `Je bent een Nederlandse local SEO expert die content schrijft volgens Google's E-E-A-T richtlijnen.

KERNPRINCIPES:
1. UNIEKHEID: Elke tekst moet zo specifiek zijn dat deze alleen voor DIT bedrijf kan gelden
2. LOKAAL: Noem altijd straten, wijken, of lokale herkenningspunten
3. AUTHENTIEK: Schrijf alsof je de ondernemer persoonlijk hebt gesproken
4. ANTI-GENERIEK: Als een zin ook voor een concurrent zou kunnen gelden, herschrijf het

=== KRITIEK: GEEN FABRICATIE VAN CIJFERS ===
Je mag NOOIT cijfers, statistieken of meetbare claims verzinnen die niet in BEDRIJFSGEGEVENS staan.
VERBODEN in highlights/trustSignals/content:
- "X klanten geholpen/bediend" → NIET GEBRUIKEN (geen data)
- "Reactie binnen X uur/minuten" → NIET GEBRUIKEN (geen data)
- "X jaar ervaring" → ALLEEN als foundedYear gegeven, bereken dan correct
- "X% tevreden klanten" → NIET GEBRUIKEN (geen data)
- Elke claim met cijfers die je niet kunt verifiëren uit BEDRIJFSGEGEVENS

TOEGESTAAN:
- Locatie feiten uit BEDRIJFSGEGEVENS
- Certificeringen ALLEEN als ze in formData staan
- Faciliteiten ALLEEN als ze in formData staan
- Jaar opgericht ALLEEN als foundedYear gegeven is

Je output is ALLEEN valide JSON. Geen markdown, geen uitleg, alleen JSON.` },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(completion.choices[0].message.content || '{}') as GeneratedPayload;

    return NextResponse.json(content);
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
