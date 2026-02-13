import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeGeneratedContent } from '@/lib/validators/highlights-validator';

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id  } = await params;

        // Get submission
        const submission = await db.businessSubmission.findUnique({
            where: { id },
        });

        if (!submission) {
            return NextResponse.json(
                { error: 'Submission not found' },
                { status: 404 }
            );
        }

        const formData = submission.formData as any;
        const rawGeneratedContent = submission.generatedContent as any;
        const images = formData.images || {};

        // Sanitize generated content to remove fabricated claims
        const generatedContent = sanitizeGeneratedContent(rawGeneratedContent, formData);

        // Generate unique slug
        let slug = generateSlug(formData.name);
        let slugExists = await db.business.findUnique({ where: { slug } });
        let counter = 1;

        while (slugExists) {
            slug = `${generateSlug(formData.name)}-${counter}`;
            slugExists = await db.business.findUnique({ where: { slug } });
            counter++;
        }

        // Get first subcategory ID (or create a relation differently)
        const subcategoryId = formData.subcategories[0];

        // Create business
        const business = await db.business.create({
            data: {
                name: formData.name,
                slug,
                shortDescription: formData.shortDescription,
                longDescription: generatedContent?.longDescription,

                // Address
                street: formData.street,
                postalCode: formData.postalCode,
                city: formData.city,
                neighborhood: formData.neighborhood,

                // Contact
                phone: formData.phone,
                email: formData.email,
                website: formData.website || null,
                instagram: formData.instagram || null,
                facebook: formData.facebook || null,
                linkedin: formData.linkedin || null,

                // Media
                logo: images.logo || null,
                coverImage: images.coverImage || null,
                gallery: images.gallery || [],
                videoUrl: formData.videoUrl || null,

                // Business info
                kvkNumber: formData.kvkNumber || null,
                foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : null,
                serviceArea: formData.serviceArea || null,
                bookingUrl: formData.bookingUrl || null,
                ctaType: formData.ctaType || 'call',

                // Arrays and JSON
                services: generatedContent?.services || formData.services,
                amenities: formData.amenities || [],
                paymentMethods: formData.paymentMethods || [],
                languages: formData.languages || [],
                openingHours: formData.openingHours,
                certifications: formData.certifications || [],
                highlights: generatedContent?.highlights || [],
                tags: generatedContent?.tags || [],
                faq: generatedContent?.faq || [],

                // SEO
                seoTitle: generatedContent?.seo?.title,
                seoDescription: generatedContent?.seo?.metaDescription,
                seoKeywords: generatedContent?.seo?.keywords || [],
                seoLocalText: generatedContent?.seo?.localSeoText,

                // Status
                status: 'pending', // Admin needs to approve
                isActive: false,

                // Relations
                subCategoryId: subcategoryId,
            },
        });

        // Update submission with business reference
        await db.businessSubmission.update({
            where: { id },
            data: {
                businessId: business.id,
                status: 'approved',
            },
        });

        return NextResponse.json({
            success: true,
            businessId: business.id,
            slug: business.slug,
        });
    } catch (error) {
        console.error('Error approving business:', error);
        return NextResponse.json(
            { error: 'Failed to approve business' },
            { status: 500 }
        );
    }
}
