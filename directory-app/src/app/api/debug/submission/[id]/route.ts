import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeGeneratedContent } from '@/lib/validators/highlights-validator';

// Security check - only allow in development or with DEBUG_TOOLS=true
function isDebugAllowed(): boolean {
    return process.env.NODE_ENV === 'development' || process.env.DEBUG_TOOLS === 'true';
}

// Debug endpoint to see raw vs sanitized content for a submission
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Security: Block in production unless DEBUG_TOOLS is enabled
    if (!isDebugAllowed()) {
        return NextResponse.json(
            { error: 'Not found' },
            { status: 404 }
        );
    }

    try {
        const { id } = await params;

        const submission = await db.businessSubmission.findUnique({
            where: { id },
        });

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        const formData = submission.formData as any;
        const rawContent = submission.generatedContent as any;

        if (!rawContent) {
            return NextResponse.json({
                error: 'No generated content yet',
                status: submission.status,
                formData: {
                    name: formData?.name,
                    certifications: formData?.certifications || [],
                    amenities: formData?.amenities || [],
                    foundedYear: formData?.foundedYear || null,
                }
            });
        }

        const sanitizedContent = sanitizeGeneratedContent(rawContent, formData);

        // Calculate removals - arrays
        const removedHighlights = (rawContent.highlights || []).filter(
            (h: string) => !(sanitizedContent.highlights || []).includes(h)
        );

        const removedTrustSignals = (rawContent.brand?.trustSignals || []).filter(
            (t: string) => !(sanitizedContent.brand?.trustSignals || []).includes(t)
        );

        // Calculate text field changes
        const textChanges: Record<string, boolean> = {};
        if (rawContent.longDescription !== sanitizedContent.longDescription) {
            textChanges.longDescription = true;
        }
        if (rawContent.seo?.localSeoText !== sanitizedContent.seo?.localSeoText) {
            textChanges['seo.localSeoText'] = true;
        }
        if (rawContent.brand?.overviewSentence !== sanitizedContent.brand?.overviewSentence) {
            textChanges['brand.overviewSentence'] = true;
        }

        return NextResponse.json({
            submissionId: id,
            businessName: formData?.name,
            status: submission.status,

            formData: {
                certifications: formData?.certifications || [],
                amenities: formData?.amenities || [],
                foundedYear: formData?.foundedYear || null,
                services: formData?.services?.map((s: any) => s.name) || [],
            },

            comparison: {
                highlights: {
                    raw: rawContent.highlights || [],
                    sanitized: sanitizedContent.highlights || [],
                    removed: removedHighlights,
                },
                trustSignals: {
                    raw: rawContent.brand?.trustSignals || [],
                    sanitized: sanitizedContent.brand?.trustSignals || [],
                    removed: removedTrustSignals,
                },
                textFields: {
                    longDescription: {
                        changed: textChanges.longDescription || false,
                        raw: rawContent.longDescription?.substring(0, 200) + '...',
                        sanitized: sanitizedContent.longDescription?.substring(0, 200) + '...',
                    },
                    localSeoText: {
                        changed: textChanges['seo.localSeoText'] || false,
                        raw: rawContent.seo?.localSeoText,
                        sanitized: sanitizedContent.seo?.localSeoText,
                    },
                    overviewSentence: {
                        changed: textChanges['brand.overviewSentence'] || false,
                        raw: rawContent.brand?.overviewSentence,
                        sanitized: sanitizedContent.brand?.overviewSentence,
                    }
                }
            },

            summary: {
                highlightsRemoved: removedHighlights.length,
                trustSignalsRemoved: removedTrustSignals.length,
                textFieldsModified: Object.keys(textChanges).length,
                totalChanges: removedHighlights.length + removedTrustSignals.length + Object.keys(textChanges).length,
                sanitizerWorking: (
                    removedHighlights.length > 0 ||
                    removedTrustSignals.length > 0 ||
                    Object.keys(textChanges).length > 0
                )
                    ? 'YES - Items were filtered/modified'
                    : 'NO changes needed OR AI followed rules correctly'
            }
        });
    } catch (error) {
        console.error('Debug submission error:', error);
        return NextResponse.json({ error: 'Processing error' }, { status: 500 });
    }
}
