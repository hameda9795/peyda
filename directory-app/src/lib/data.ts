import { db as prisma } from "@/lib/db";
import { Business } from "./types"; // Use shared types
import { NETHERLANDS_PROVINCES } from "./netherlands-data";

// Helper to find province by city name
const findProvinceByCity = (cityName: string) => {
    const lower = cityName.toLowerCase();
    for (const province of NETHERLANDS_PROVINCES) {
        const match = province.cities.find((city) => city.name.toLowerCase() === lower);
        if (match) return { province, city: match };
    }
    return null;
};

// Helper to create URL-safe slug
const createSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Since this file is used in Server Components (page.tsx), we can directly use Prisma if we mark functions as async.

export async function getBusinessesByCategory(categoryName: string): Promise<Business[]> {
    const businesses = await prisma.business.findMany({
        where: {
            subCategory: {
                category: {
                    name: categoryName
                }
            },
            // status: 'approved' // filter disabled temporarily to fix Prisma sync issue
        },
        include: {
            subCategory: {
                include: {
                    category: true
                }
            }
        }
    });

    return mapPrismaBusinessToBusiness(businesses);
}

export async function getBusinessesBySubcategory(categoryName: string, subcategoryName: string): Promise<Business[]> {
    // Note: Category matching might need to be by slug or looser string matching
    const businesses = await prisma.business.findMany({
        where: {
            subCategory: {
                name: subcategoryName,
                category: {
                    name: categoryName
                }
            }
        },
        include: {
            subCategory: {
                include: {
                    category: true
                }
            }
        }
    });

    // If strict match fails, try looser match or just by subcategory if unique enough
    if (businesses.length === 0) {
        const looseBusinesses = await prisma.business.findMany({
            where: {
                subCategory: {
                    name: {
                        contains: subcategoryName,
                        mode: 'insensitive'
                    }
                }
            },
            include: {
                subCategory: {
                    include: {
                        category: true
                    }
                }
            }
        });
        return mapPrismaBusinessToBusiness(looseBusinesses);
    }

    return mapPrismaBusinessToBusiness(businesses);
}

export async function getFeaturedBusinesses(): Promise<Business[]> {
    const businesses = await prisma.business.findMany({
        take: 8,
        orderBy: {
            rating: 'desc'
        },
        include: {
            subCategory: {
                include: {
                    category: true
                }
            }
        }
    });

    // If no real businesses, return empty or fallback
    if (businesses.length === 0) return [];

    return mapPrismaBusinessToBusiness(businesses);
}

function mapPrismaBusinessToBusiness(prismaBusinesses: any[]): Business[] {
    return prismaBusinesses.map(b => {
        // Get location data for SEO URLs
        const locationData = findProvinceByCity(b.city || 'Utrecht');

        return {
            id: b.id,
            name: b.name,
            slug: b.slug,
            category: b.subCategory.category.name,
            subcategories: [b.subCategory.name],
            tags: b.tags,
            shortDescription: b.shortDescription || '',
            longDescription: b.longDescription || '',
            highlights: b.highlights,
            services: b.services || [],
            products: [],
            images: {
                logo: b.logo || '',
                cover: b.coverImage || '',
                gallery: b.gallery || []
            },
            address: {
                street: b.street || '',
                city: b.city,
                postalCode: b.postalCode || '',
                neighborhood: b.neighborhood || '',
                coordinates: { lat: 0, lng: 0 }
            },
            // Location slugs for SEO URLs
            provinceSlug: locationData?.province.slug || 'utrecht',
            citySlug: locationData?.city.slug || createSlug(b.city || 'utrecht'),
            neighborhoodSlug: createSlug(b.neighborhood || 'centrum'),
            contact: {
                phone: b.phone || '',
                email: b.email || '',
                website: b.website || '',
                socials: {
                    instagram: b.instagram,
                    facebook: b.facebook,
                    linkedin: b.linkedin
                }
            },
            openingHours: b.openingHours || [],
            paymentMethods: b.paymentMethods,
            languages: b.languages,
            amenities: b.amenities,
            serviceArea: b.serviceArea || '',
            bookingUrl: b.bookingUrl,
            cta: {
                text: 'Bekijk',
                link: `/utrecht/bedrijf/${b.slug}`,
                type: 'call'
            },
            reviews: {
                average: b.rating,
                count: b.reviewCount,
                items: []
            },
            faq: b.faq || [],
            certifications: b.certifications,
            kvk: b.kvkNumber,
            foundedYear: b.foundedYear,
            details: {
                policies: '',
                lastUpdate: b.updatedAt.toISOString(),
                status: b.status
            },
            seo: {
                title: b.seoTitle || '',
                metaDescription: b.seoDescription || '',
                h1: b.name,
                keywords: b.seoKeywords,
                canonicalUrl: '',
                localSeoText: b.seoLocalText || ''
            }
        };
    });
}


