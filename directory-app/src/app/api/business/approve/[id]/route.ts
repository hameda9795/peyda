import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeGeneratedContent } from '@/lib/validators/highlights-validator';
import { slugify } from '@/lib/slugify';

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Helper to ensure city exists in database
async function ensureCityExists(cityName: string, provinceName?: string): Promise<{ id: string; name: string; slug: string }> {
    const citySlug = slugify(cityName);
    
    // Try to find existing city
    let city = await db.city.findFirst({
        where: {
            OR: [
                { slug: citySlug },
                { name: { equals: cityName, mode: 'insensitive' } }
            ]
        }
    });

    // Create city if not exists
    if (!city) {
        city = await db.city.create({
            data: {
                name: cityName,
                slug: citySlug,
                province: provinceName || null,
                contentStatus: 'pending'
            }
        });
    }

    return city;
}

// Helper to ensure neighborhood exists
async function ensureNeighborhoodExists(
    neighborhoodName: string, 
    cityId: string
): Promise<{ id: string; name: string; slug: string }> {
    const neighborhoodSlug = slugify(neighborhoodName);
    
    // Try to find existing neighborhood
    let neighborhood = await db.neighborhood.findFirst({
        where: {
            cityId,
            OR: [
                { slug: neighborhoodSlug },
                { name: { equals: neighborhoodName, mode: 'insensitive' } }
            ]
        }
    });

    // Create neighborhood if not exists
    if (!neighborhood) {
        neighborhood = await db.neighborhood.create({
            data: {
                name: neighborhoodName,
                slug: neighborhoodSlug,
                cityId
            }
        });
    }

    return neighborhood;
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

        // Ensure city and neighborhood exist in database
        const city = await ensureCityExists(formData.city, formData.province);
        const neighborhood = formData.neighborhood 
            ? await ensureNeighborhoodExists(formData.neighborhood, city.id)
            : null;

        // Generate province slug for URL - use form province or default to 'nederland'
        const provinceSlug = formData.province 
            ? slugify(formData.province)
            : 'nederland';

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
                province: formData.province || null,
                provinceSlug: provinceSlug,
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
                status: 'approved',
                isActive: true,
                publishStatus: 'PUBLISHED',

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

        // Link business to owner (by email)
        const ownerEmail = formData.email?.toLowerCase()?.trim();
        let oldBusinessId: string | null = null;
        
        if (ownerEmail) {
            let owner = await db.businessOwner.findUnique({
                where: { email: ownerEmail }
            });
            
            // Create owner if doesn't exist
            if (!owner) {
                owner = await db.businessOwner.create({
                    data: {
                        email: ownerEmail,
                        name: formData.name || ownerEmail.split('@')[0],
                    }
                });
            }
            
            // Always update owner's businessId to the new published business
            // This handles both new owners and owners with existing DRAFT businesses
            if (owner) {
                // Store old business ID for cleanup
                oldBusinessId = owner.businessId;
                
                await db.businessOwner.update({
                    where: { id: owner.id },
                    data: { businessId: business.id }
                });
                
                // Clean up old DRAFT business if exists
                if (oldBusinessId && oldBusinessId !== business.id) {
                    const oldBusiness = await db.business.findUnique({
                        where: { id: oldBusinessId }
                    });
                    if (oldBusiness && oldBusiness.publishStatus === 'DRAFT') {
                        await db.business.delete({
                            where: { id: oldBusinessId }
                        });
                    }
                }
            }
        }

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
