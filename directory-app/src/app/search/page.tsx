import { Metadata } from "next";
import { db } from "@/lib/db";
import { SearchContent } from "./SearchContent";

type Props = {
    searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    const query = params.q;
    
    if (query) {
        return {
            title: `Zoekresultaten voor "${query}" | Peyda`,
            description: `Bekijk ${query} bedrijven en diensten in Utrecht. Vergelijk beoordelingen, prijzen en contactgegevens.`,
        };
    }
    
    return {
        title: "Zoeken | Peyda - Vind Lokale Bedrijven",
        description: "Doorzoek alle bedrijven in Utrecht. Vind restaurants, winkels, dienstverleners en meer in jouw buurt.",
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams;
    const { q, category, sort } = params;
    const query = q?.toLowerCase() || "";

    // Get categories for filter
    const categories = await db.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
        },
        orderBy: {
            name: 'asc'
        }
    });

    // Build where clause
    const whereClause: any = {};
    
    if (query) {
        whereClause.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { shortDescription: { contains: query, mode: 'insensitive' } },
            { longDescription: { contains: query, mode: 'insensitive' } }
        ];
    }

    if (category && category !== 'all') {
        whereClause.subCategory = {
            category: {
                slug: category
            }
        };
    }

    // Build orderBy based on sort parameter
    let orderBy: any = { name: 'asc' };
    if (sort === 'rating') {
        orderBy = { rating: 'desc' };
    } else if (sort === 'newest') {
        orderBy = { createdAt: 'desc' };
    } else if (sort === 'reviews') {
        orderBy = { reviewCount: 'desc' };
    }

    // Search businesses in database
    const rawResults = await db.business.findMany({
        where: whereClause,
        include: {
            subCategory: {
                include: {
                    category: true
                }
            }
        },
        orderBy,
        take: 50
    });

    // Map to Business type format
    const results = rawResults.map(b => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        category: b.subCategory.category.name,
        subcategories: [b.subCategory.name],
        tags: b.tags,
        shortDescription: b.shortDescription || '',
        longDescription: b.longDescription || '',
        highlights: (b.highlights as string[]) || [],
        services: (b.services as { name: string; description?: string; price?: string }[]) || [],
        products: [],
        images: {
            logo: b.logo || '/placeholder.jpg',
            cover: b.coverImage || '/placeholder.jpg',
            gallery: (b.gallery as string[]) || []
        },
        videoUrl: b.videoUrl || undefined,
        address: {
            street: b.street || '',
            city: b.city,
            postalCode: b.postalCode || '',
            neighborhood: b.neighborhood || '',
            coordinates: { lat: 0, lng: 0 }
        },
        contact: {
            phone: b.phone || '',
            email: b.email || '',
            website: b.website || '',
            socials: {
                instagram: b.instagram || undefined,
                facebook: b.facebook || undefined,
                linkedin: b.linkedin || undefined
            }
        },
        openingHours: (b.openingHours as any[]) || [],
        paymentMethods: (b.paymentMethods as string[]) || [],
        languages: (b.languages as string[]) || [],
        amenities: (b.amenities as string[]) || [],
        serviceArea: b.serviceArea || '',
        bookingUrl: b.bookingUrl || undefined,
        cta: {
            text: 'Bekijk',
            link: `/utrecht/bedrijf/${b.slug}`,
            type: 'call' as const
        },
        reviews: {
            average: b.rating,
            count: b.reviewCount,
            items: []
        },
        faq: (b.faq as { question: string; answer: string }[]) || [],
        certifications: (b.certifications as string[]) || [],
        kvk: b.kvkNumber || undefined,
        foundedYear: b.foundedYear || undefined,
        details: {
            policies: '',
            lastUpdate: b.updatedAt.toISOString(),
            status: 'published' as const
        },
        seo: {
            title: b.seoTitle || b.name,
            metaDescription: b.seoDescription || b.shortDescription || '',
            h1: b.name,
            keywords: (b.seoKeywords as string[]) || [],
            canonicalUrl: '',
            localSeoText: b.seoLocalText || ''
        }
    }));

    return (
        <SearchContent 
            initialQuery={q || ""}
            initialCategory={category || "all"}
            initialSort={sort || "relevance"}
            results={results}
            categories={categories}
            totalCount={rawResults.length}
        />
    );
}
