import { NextRequest, NextResponse } from 'next/server';
import { sanitizeGeneratedContent, sanitizeText } from '@/lib/validators/highlights-validator';

// Security check - only allow in development or with DEBUG_TOOLS=true
function isDebugAllowed(): boolean {
    return process.env.NODE_ENV === 'development' || process.env.DEBUG_TOOLS === 'true';
}

export async function POST(request: NextRequest) {
    // Security: Block in production unless DEBUG_TOOLS is enabled
    if (!isDebugAllowed()) {
        return NextResponse.json(
            { error: 'Debug tools not available' },
            { status: 404 }
        );
    }

    try {
        const { rawContent, formData } = await request.json();

        if (!rawContent) {
            return NextResponse.json({ error: 'rawContent is required' }, { status: 400 });
        }

        const sanitizedContent = sanitizeGeneratedContent(rawContent, formData || {});

        // Calculate what was removed from arrays
        const removedHighlights = (rawContent.highlights || []).filter(
            (h: string) => !(sanitizedContent.highlights || []).includes(h)
        );

        const removedTrustSignals = (rawContent.brand?.trustSignals || []).filter(
            (t: string) => !(sanitizedContent.brand?.trustSignals || []).includes(t)
        );

        // Check text field changes with sentence-level details
        const textFieldChanges: Record<string, { original: string; sanitized: string; removedSentences: string[] }> = {};

        if (rawContent.longDescription) {
            const result = sanitizeText(rawContent.longDescription, formData || {});
            if (result.removedSentences.length > 0 || result.original !== result.sanitized) {
                textFieldChanges.longDescription = {
                    original: rawContent.longDescription,
                    sanitized: result.sanitized,
                    removedSentences: result.removedSentences
                };
            }
        }

        if (rawContent.seo?.localSeoText) {
            const result = sanitizeText(rawContent.seo.localSeoText, formData || {});
            if (result.removedSentences.length > 0 || result.original !== result.sanitized) {
                textFieldChanges['seo.localSeoText'] = {
                    original: rawContent.seo.localSeoText,
                    sanitized: result.sanitized,
                    removedSentences: result.removedSentences
                };
            }
        }

        if (rawContent.brand?.overviewSentence) {
            const result = sanitizeText(rawContent.brand.overviewSentence, formData || {});
            if (result.removedSentences.length > 0 || result.original !== result.sanitized) {
                textFieldChanges['brand.overviewSentence'] = {
                    original: rawContent.brand.overviewSentence,
                    sanitized: result.sanitized,
                    removedSentences: result.removedSentences
                };
            }
        }

        return NextResponse.json({
            raw: {
                highlights: rawContent.highlights || [],
                trustSignals: rawContent.brand?.trustSignals || [],
            },
            sanitized: {
                highlights: sanitizedContent.highlights || [],
                trustSignals: sanitizedContent.brand?.trustSignals || [],
            },
            removed: {
                highlights: removedHighlights,
                trustSignals: removedTrustSignals,
            },
            textFieldChanges,
            formDataUsed: {
                certifications: formData?.certifications || [],
                amenities: formData?.amenities || [],
                foundedYear: formData?.foundedYear || null,
            },
            summary: {
                highlightsRemoved: removedHighlights.length,
                trustSignalsRemoved: removedTrustSignals.length,
                textFieldsModified: Object.keys(textFieldChanges).length,
                totalChanges: removedHighlights.length + removedTrustSignals.length + Object.keys(textFieldChanges).length,
            },
            featureFlags: {
                SANITIZER_REMOVE_GENERIC: process.env.SANITIZER_REMOVE_GENERIC === 'true',
            }
        });
    } catch (error) {
        console.error('Debug sanitizer error:', error);
        return NextResponse.json({ error: 'Invalid JSON or processing error' }, { status: 400 });
    }
}

// GET endpoint for testing text sanitization directly
export async function GET(request: NextRequest) {
    if (!isDebugAllowed()) {
        return NextResponse.json({ error: 'Debug tools not available' }, { status: 404 });
    }

    return NextResponse.json({
        message: 'Sanitizer Debug Endpoint',
        usage: 'POST with { rawContent: {...}, formData: {...} }',
        featureFlags: {
            SANITIZER_REMOVE_GENERIC: process.env.SANITIZER_REMOVE_GENERIC === 'true',
        },
        genericPhrases: [
            'betrouwbare partner',
            'professionele dienstverlening',
            'kwaliteit staat voorop',
            'persoonlijke aanpak',
            'klant staat centraal',
            'altijd bereikbaar',
            'snelle service',
            'beste service/kwaliteit',
            'top kwaliteit',
        ],
        dutchNumberWords: [
            'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien',
            'honderd', 'honderden', 'duizend', 'duizenden', 'talloze', 'vele'
        ],
        coveredFields: [
            'highlights (array)',
            'brand.trustSignals (array)',
            'longDescription (text)',
            'seo.localSeoText (text)',
            'brand.overviewSentence (text)',
            'faq[].answer (text array)'
        ]
    });
}
