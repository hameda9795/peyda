"use server";

import { db as prisma } from "@/lib/db";
import { getCurrentUser } from "@/app/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BusinessFormData } from "@/lib/types/business-form";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { Business } from "@/lib/types";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";

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

const normalizeSlug = (value?: string | null) => {
    if (!value) return "";
    return value
        .replace(/^\/+/, "")
        .replace(/^utrecht\//, "")
        .replace(/^nederland\//, "")
        .replace(/\//g, '-'); // Replace remaining slashes with dashes
};

const stripCategoryPrefix = (subSlug: string, categorySlug: string) => {
    if (!subSlug || !categorySlug) return subSlug;
    let result = subSlug;
    if (result.startsWith(`${categorySlug}/`)) {
        result = result.slice(categorySlug.length + 1);
    }
    // Also try without the prefix parts
    const cleanCat = categorySlug.replace(/^utrecht\//, '').replace(/^nederland\//, '');
    if (result.startsWith(`${cleanCat}/`)) {
        result = result.slice(cleanCat.length + 1);
    }
    // Replace any remaining slashes with dashes
    return result.replace(/\//g, '-');
};

async function saveFile(file: File | null, folder: string): Promise<string | null> {
    if (!file) return null;

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const relativePath = `/uploads/${folder}/${filename}`;
        const absoluteDir = join(process.cwd(), "public", "uploads", folder);
        const absolutePath = join(absoluteDir, filename);

        // Ensure directory exists
        await mkdir(absoluteDir, { recursive: true });

        // Write file
        await writeFile(absolutePath, buffer);

        return relativePath;
    } catch (error) {
        console.error(`Error saving file ${file.name}:`, error);
        return null;
    }
}

export async function createBusiness(data: FormData) {
    try {
        // Check if user already has a business - prevent multiple businesses per user
        const existingUser = await getCurrentUser();
        if (existingUser?.businessId) {
            return {
                success: false,
                error: "Je hebt al een bedrijf geregistreerd. Je kunt maar één bedrijf per account hebben."
            };
        }

        // Extract basic fields
        const name = data.get('name') as string;
        const categoryId = data.get('category') as string;
        // Handle subcategories - expecting JSON string or separate processing
        const subcategoriesJson = data.get('subcategories');
        const subcategoryIds = subcategoriesJson ? JSON.parse(subcategoriesJson as string) : [];

        // For the schema, we need ONE subCategoryId. We'll take the first one.
        let subCategoryId = subcategoryIds.length > 0 ? subcategoryIds[0] : null;

        if (!subCategoryId && categoryId) {
            // Fallback: fetch first subcategory of the main category
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
                include: { subcategories: true }
            });
            if (category && category.subcategories.length > 0) {
                subCategoryId = category.subcategories[0].id;
            }
        }

        if (!subCategoryId) {
            throw new Error("Minimaal één subcategorie is verplicht.");
        }

        // Generate slug if not present (simple version)
        let slug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Check for uniqueness
        let uniqueSlug = slug;
        let counter = 1;
        while (await prisma.business.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        slug = uniqueSlug;

        // Save images
        const logo = await saveFile(data.get('logo') as File, 'logos');
        const coverImage = await saveFile(data.get('coverImage') as File, 'covers');

        const galleryFiles = data.getAll('gallery') as File[];
        const galleryPromises = galleryFiles.map(f => saveFile(f, 'gallery'));
        const galleryUrls = (await Promise.all(galleryPromises)).filter(Boolean) as string[];

        // Get AI-generated altTexts if available
        let galleryAltTexts: string[] = [];
        try {
            const altTextsData = data.get('galleryAltTexts');
            if (altTextsData) {
                galleryAltTexts = JSON.parse(altTextsData as string);
            }
        } catch (e) {
            console.warn('Could not parse gallery alt texts:', e);
        }

        // Create gallery objects with altTexts
        const gallery = galleryUrls.map((url, index) => ({
            url,
            altText: galleryAltTexts[index] || ''
        }));

        // Extract other data (some might need JSON parsing if sent as stringified JSON)
        // Helper to get string or null
        const getStr = (key: string) => {
            const val = data.get(key);
            return val ? String(val) : null;
        };

        // Determine province from form data (provided by user in StepAddress)
        const cityName = getStr('city') || '';
        const provinceFromForm = getStr('province');

        // If province is provided in form (from custom city input), use it
        // Otherwise try to find it from known cities list
        let provinceName: string | null = null;
        let provinceSlugValue: string | null = null;
        let locationData = null;

        if (provinceFromForm) {
            // Use province from form data (user selected it in dropdown)
            provinceName = provinceFromForm;
            provinceSlugValue = createSlug(provinceFromForm);
            // Also try to find city slug from known cities
            locationData = findProvinceByCity(cityName);
        } else {
            // Fallback: try to find from known cities
            locationData = findProvinceByCity(cityName);
            provinceName = locationData?.province.name || null;
            provinceSlugValue = locationData?.province.slug || null;
        }

        // Get user email from session for security (don't trust form data)
        // We already have existingUser from the check above
        const userEmail = existingUser?.email;

        if (!userEmail) {
            throw new Error("Je moet ingelogd zijn om een bedrijf te registreren.");
        }

        const business = await prisma.business.create({
            data: {
                name,
                slug,
                description: getStr('shortDescription'), // Mapping shortDescription to description main field for now? Or shortDescription
                shortDescription: getStr('shortDescription'),
                longDescription: getStr('longDescription') || getStr('seoLocalText'), // Maybe map from hidden fields

                // Address
                street: getStr('street'),
                postalCode: getStr('postalCode'),
                city: cityName,
                province: provinceName,
                provinceSlug: provinceSlugValue,
                neighborhood: getStr('neighborhood'),

                // Contact - use session email for security
                phone: getStr('phone'),
                email: userEmail,
                website: getStr('website'),
                instagram: getStr('instagram'),
                facebook: getStr('facebook'),
                linkedin: getStr('linkedin'),

                // Media
                logo,
                coverImage,
                gallery,
                videoUrl: getStr('videoUrl'),

                // Business Info
                kvkNumber: getStr('kvkNumber'),
                foundedYear: data.get('foundedYear') ? parseInt(data.get('foundedYear') as string) : null,
                serviceArea: getStr('serviceArea'),
                bookingUrl: getStr('bookingUrl'),
                ctaType: getStr('ctaType') || 'call',

                // Arrays (JSON)
                services: data.get('services') ? JSON.parse(data.get('services') as string) : [],
                openingHours: data.get('openingHours') ? JSON.parse(data.get('openingHours') as string) : [],

                // Arrays (String[])
                amenities: data.get('amenities') ? JSON.parse(data.get('amenities') as string) : [],
                paymentMethods: data.get('paymentMethods') ? JSON.parse(data.get('paymentMethods') as string) : [],
                languages: data.get('languages') ? JSON.parse(data.get('languages') as string) : [],
                certifications: data.get('certifications') ? JSON.parse(data.get('certifications') as string) : [],

                // AI/SEO Data (if present)
                seoTitle: getStr('seoTitle'),
                seoDescription: getStr('seoDescription'),
                seoKeywords: data.get('seoKeywords') ? JSON.parse(data.get('seoKeywords') as string) : [],
                seoLocalText: getStr('seoLocalText'),
                highlights: data.get('highlights') ? JSON.parse(data.get('highlights') as string) : [],
                faq: data.get('faq') ? JSON.parse(data.get('faq') as string) : [],

                status: 'pending',
                publishStatus: 'PUBLISHED',
                seoStatus: 'COMPLETED',
                lastSeoUpdate: new Date(),

                // Relation
                subCategoryId,
            } as any
        });

        // Link business to the current user (owner) - we already have existingUser from above
        try {
            if (existingUser) {
                await prisma.businessOwner.update({
                    where: { id: existingUser.id },
                    data: { businessId: business.id }
                });
            }
        } catch (e) {
            console.error("Failed to link business to owner:", e);
            // Continue anyway - business is created
        }

        // Fetch categorization details for redirection
        const subCategoryDetails = await prisma.subCategory.findUnique({
            where: { id: subCategoryId },
            include: { category: true }
        });

        revalidatePath('/dashboard');

        // Get neighborhood from form data
        const neighborhoodName = getStr('neighborhood') || '';

        // Use the already computed province data from above
        // Default to 'nederland' only if no province was selected
        const provinceSlug = provinceSlugValue || 'nederland';
        const citySlug = locationData?.city.slug || createSlug(cityName);
        const neighborhoodSlug = createSlug(neighborhoodName);

        // Clean category slugs to ensure no path duplication
        const rawCategorySlug = subCategoryDetails?.category.slug || 'categorie';
        const cleanCategorySlug = rawCategorySlug
            .replace(/^\/?utrecht\//, '')
            .replace(/^\/?nederland\//, '')
            .replace(/^\/?/, '')
            .replace(/\//g, '-'); // Replace any remaining slashes with dashes

        const rawSubCategorySlug = subCategoryDetails?.slug || 'subcategorie';
        // If subcategory slug starts with the category slug (nested path), strip it
        // Then replace any remaining slashes with dashes to avoid URL issues
        const cleanSubCategorySlug = rawSubCategorySlug
            .replace(/^\/?utrecht\//, '')
            .replace(/^\/?nederland\//, '')
            .replace(new RegExp(`^/?${rawCategorySlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?`), '')
            .replace(new RegExp(`^/?${cleanCategorySlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?`), '')
            .replace(/^\/?/, '')
            .replace(/\//g, '-'); // Replace any remaining slashes with dashes

        return {
            success: true,
            slug: business.slug,
            provinceSlug,
            citySlug,
            neighborhoodSlug,
            categorySlug: cleanCategorySlug,
            subCategorySlug: cleanSubCategorySlug
        };

    } catch (error: any) {
        console.error("Failed to create business:", error);
        return {
            success: false,
            error: error.message || "Er is een fout opgetreden bij het opslaan."
        };
    }
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
    // 1. Fetch business without reviews first to avoid potential invalid include error if schema is outdated
    const business = await prisma.business.findUnique({
        where: { slug },
        include: {
            subCategory: {
                include: {
                    category: true
                }
            }
        }
    }) as any;

    if (!business) return null;

    // 2. Try to fetch reviews separately. 
    // We treat prisma as any to avoid TS errors.
    // We also wrap in try/catch to gracefully handle runtime errors if the model doesn't exist on the client.
    let reviews: any[] = [];
    try {
        // Use raw query as a fallback that works even if client is outdated but DB is updated
        // Or try the client model if available
        if ((prisma as any).review) {
            reviews = await (prisma as any).review.findMany({
                where: { businessId: business.id },
                orderBy: { createdAt: 'desc' },
                take: 50
            });
        } else {
            // Fallback: Fetch via Raw SQL if client is outdated
            reviews = await prisma.$queryRaw`
                SELECT * FROM "reviews" 
                WHERE "businessId" = ${business.id} 
                ORDER BY "createdAt" DESC 
                LIMIT 50
             ` as any[];
        }
    } catch (e) {
        console.warn("Could not fetch reviews (schema might be outdated):", e);
    }

    // Map Prisma result to Business interface
    return {
        id: business.id,
        name: business.name,
        slug: business.slug,
        category: business.subCategory.category.name,
        subcategories: [business.subCategory.name], // Current schema supports only one
        tags: business.tags,
        shortDescription: business.shortDescription || '',
        longDescription: business.longDescription || '',
        highlights: business.highlights,
        services: business.services as any[], // Cast appropriately
        products: [], // Not in schema yet
        images: {
            logo: business.logo || '',
            cover: business.coverImage || '',
            gallery: business.gallery
        },
        address: {
            street: business.street || '',
            city: business.city,
            postalCode: business.postalCode || '',
            neighborhood: business.neighborhood || '',
            coordinates: { lat: 52.09, lng: 5.12 } // Mock coordinates for now
        },
        contact: {
            phone: business.phone || '',
            email: business.email || '',
            website: business.website || '',
            socials: {
                instagram: business.instagram || undefined,
                facebook: business.facebook || undefined,
                linkedin: business.linkedin || undefined,
            }
        },
        openingHours: business.openingHours as any[],
        paymentMethods: business.paymentMethods,
        languages: business.languages,
        amenities: business.amenities,
        serviceArea: business.serviceArea || '',
        bookingUrl: business.bookingUrl || '',
        cta: {
            text: business.ctaType === 'booking' ? 'Reserveren' : business.ctaType === 'quote' ? 'Offerte Aanvragen' : 'Bellen',
            link: business.ctaType === 'booking' ? (business.bookingUrl || '#') : business.ctaType === 'call' ? `tel:${business.phone}` : '#',
            type: business.ctaType as any
        },
        reviews: {
            average: business.rating,
            count: business.reviewCount,
            items: reviews.map((r: any) => ({
                id: r.id,
                author: r.author,
                rating: r.rating,
                date: r.createdAt.toLocaleString('nl-NL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                content: r.content,
                ownerResponse: r.ownerResponse
            }))
        },
        faq: business.faq as any[] || [],
        certifications: business.certifications,
        kvk: business.kvkNumber || '',
        foundedYear: business.foundedYear || 0,
        details: {
            policies: '',
            lastUpdate: business.updatedAt.toLocaleDateString('nl-NL'),
            status: 'published'
        },
        seo: {
            title: business.seoTitle || '',
            metaDescription: business.seoDescription || '',
            h1: business.name,
            keywords: business.seoKeywords,
            canonicalUrl: `https://utrecht-directory.nl/utrecht/bedrijf/${business.slug}`,
            localSeoText: business.seoLocalText || '',
            structuredData: business.structuredData
        }
    };
}

// Get businesses by category slug for homepage sections
export async function getBusinessesByCategorySlug(categorySlug: string, limit: number = 10) {
    try {
        // Normalize slug
        const normalizedSlug = categorySlug.startsWith('/')
            ? categorySlug
            : `/utrecht/${categorySlug}`;

        const businesses = await prisma.business.findMany({
            where: {
                subCategory: {
                    category: {
                        slug: {
                            contains: categorySlug.replace('/utrecht/', '').replace('/', ''),
                            mode: 'insensitive'
                        }
                    }
                },
                status: 'approved',
                publishStatus: 'PUBLISHED'
            },
            take: limit,
            orderBy: [
                { rating: 'desc' },
                { reviewCount: 'desc' }
            ],
            include: {
                subCategory: {
                    include: {
                        category: true
                    }
                }
            }
        });

        return businesses.map((b: any) => {
            const locationData = findProvinceByCity(b.city || 'Utrecht');
            return {
                id: b.id,
                name: b.name,
                slug: b.slug,
                category: b.subCategory.category.name.replace(' in Utrecht', '').replace(' in Nederland', ''),
                categorySlug: normalizeSlug(b.subCategory.category.slug),
                subcategorySlug: stripCategoryPrefix(
                    normalizeSlug(b.subCategory.slug),
                    normalizeSlug(b.subCategory.category.slug)
                ),
                subcategories: [b.subCategory.name],
                shortDescription: b.shortDescription || '',
                rating: b.reviewCount > 0 ? b.rating : null,
                reviewCount: b.reviewCount || 0,
                images: {
                    cover: b.coverImage || '',
                    logo: b.logo || ''
                },
                address: {
                    city: b.city || 'Nederland',
                    neighborhood: b.neighborhood || ''
                },
                provinceSlug: locationData?.province.slug || 'utrecht',
                citySlug: locationData?.city.slug || createSlug(b.city || 'utrecht'),
                neighborhoodSlug: createSlug(b.neighborhood || 'centrum')
            };
        });
    } catch (error) {
        console.error("Failed to fetch businesses by category:", error);
        return [];
    }
}

// Get businesses by city name
export async function getBusinessesByCity(cityName: string, limit: number = 10) {
    try {
        const businesses = await prisma.business.findMany({
            where: {
                city: {
                    equals: cityName,
                    mode: 'insensitive'
                },
                status: 'approved',
                publishStatus: 'PUBLISHED'
            },
            take: limit,
            orderBy: [
                { createdAt: 'desc' },
                { rating: 'desc' }
            ],
            include: {
                subCategory: {
                    include: {
                        category: true
                    }
                }
            }
        });

        return businesses.map((b: any) => {
            const locationData = findProvinceByCity(b.city || 'Utrecht');
            return {
                id: b.id,
                name: b.name,
                slug: b.slug,
                category: b.subCategory.category.name.replace(' in Utrecht', '').replace(' in Nederland', ''),
                categorySlug: normalizeSlug(b.subCategory.category.slug),
                subcategorySlug: stripCategoryPrefix(
                    normalizeSlug(b.subCategory.slug),
                    normalizeSlug(b.subCategory.category.slug)
                ),
                subcategories: [b.subCategory.name],
                shortDescription: b.shortDescription || '',
                rating: b.reviewCount > 0 ? b.rating : null,
                reviewCount: b.reviewCount || 0,
                images: {
                    cover: b.coverImage || '',
                    logo: b.logo || ''
                },
                address: {
                    city: b.city || 'Nederland',
                    neighborhood: b.neighborhood || ''
                },
                provinceSlug: locationData?.province.slug || 'utrecht',
                citySlug: locationData?.city.slug || createSlug(b.city || 'utrecht'),
                neighborhoodSlug: createSlug(b.neighborhood || 'centrum')
            };
        });
    } catch (error) {
        console.error("Failed to fetch businesses by city:", error);
        return [];
    }
}

// Get businesses by neighborhood name
export async function getBusinessesByNeighborhood(neighborhoodName: string, limit: number = 10) {
    try {
        const businesses = await prisma.business.findMany({
            where: {
                neighborhood: {
                    equals: neighborhoodName,
                    mode: 'insensitive'
                },
                status: 'approved',
                publishStatus: 'PUBLISHED'
            },
            take: limit,
            orderBy: [
                { createdAt: 'desc' },
                { rating: 'desc' }
            ],
            include: {
                subCategory: {
                    include: {
                        category: true
                    }
                }
            }
        });

        return businesses.map((b: any) => {
            const locationData = findProvinceByCity(b.city || 'Utrecht');
            return {
                id: b.id,
                name: b.name,
                slug: b.slug,
                category: b.subCategory.category.name.replace(' in Utrecht', '').replace(' in Nederland', ''),
                categorySlug: normalizeSlug(b.subCategory.category.slug),
                subcategorySlug: stripCategoryPrefix(
                    normalizeSlug(b.subCategory.slug),
                    normalizeSlug(b.subCategory.category.slug)
                ),
                subcategories: [b.subCategory.name],
                shortDescription: b.shortDescription || '',
                rating: b.reviewCount > 0 ? b.rating : null,
                reviewCount: b.reviewCount || 0,
                images: {
                    cover: b.coverImage || '',
                    logo: b.logo || ''
                },
                address: {
                    city: b.city || 'Nederland',
                    neighborhood: b.neighborhood || ''
                },
                provinceSlug: locationData?.province.slug || 'utrecht',
                citySlug: locationData?.city.slug || createSlug(b.city || 'utrecht'),
                neighborhoodSlug: createSlug(b.neighborhood || 'centrum')
            };
        });
    } catch (error) {
        console.error("Failed to fetch businesses by neighborhood:", error);
        return [];
    }
}

// Get businesses grouped by category for a neighborhood
export async function getBusinessesByNeighborhoodGrouped(neighborhoodName: string, limitPerCategory: number = 10) {
    try {
        // First get all businesses in this neighborhood
        const businesses = await prisma.business.findMany({
            where: {
                neighborhood: {
                    equals: neighborhoodName,
                    mode: 'insensitive'
                },
                status: 'approved',
                publishStatus: 'PUBLISHED'
            },
            orderBy: [
                { createdAt: 'desc' },
                { rating: 'desc' }
            ],
            include: {
                subCategory: {
                    include: {
                        category: true
                    }
                }
            }
        });

        // Group by category
        const grouped: Record<string, any[]> = {};

        for (const b of businesses) {
            const categoryName = b.subCategory.category.name.replace(' in Utrecht', '').replace(' in Nederland', '');
            const categorySlug = normalizeSlug(b.subCategory.category.slug);
            const key = `${categorySlug}|${categoryName}`;

            if (!grouped[key]) {
                grouped[key] = [];
            }

            if (grouped[key].length < limitPerCategory) {
                const locationData = findProvinceByCity(b.city || 'Utrecht');
                grouped[key].push({
                    id: b.id,
                    name: b.name,
                    slug: b.slug,
                    category: categoryName,
                    categorySlug: categorySlug,
                    subcategorySlug: stripCategoryPrefix(
                        normalizeSlug(b.subCategory.slug),
                        normalizeSlug(b.subCategory.category.slug)
                    ),
                    subcategories: [b.subCategory.name],
                    shortDescription: b.shortDescription || '',
                    rating: b.reviewCount > 0 ? b.rating : null,
                    reviewCount: b.reviewCount || 0,
                    images: {
                        cover: b.coverImage || '',
                        logo: b.logo || ''
                    },
                    address: {
                        city: b.city || 'Nederland',
                        neighborhood: b.neighborhood || ''
                    },
                    provinceSlug: locationData?.province.slug || 'utrecht',
                    citySlug: locationData?.city.slug || createSlug(b.city || 'utrecht'),
                    neighborhoodSlug: createSlug(b.neighborhood || 'centrum')
                });
            }
        }

        // Convert to array format
        return Object.entries(grouped).map(([key, businesses]) => {
            const [slug, name] = key.split('|');
            return {
                categorySlug: slug,
                categoryName: name,
                businesses
            };
        });
    } catch (error) {
        console.error("Failed to fetch grouped businesses:", error);
        return [];
    }
}

// Get business counts per city
export async function getBusinessCountsByCity() {
    try {
        const cityCounts = await prisma.business.groupBy({
            by: ['city'],
            where: {
                status: 'approved',
                publishStatus: 'PUBLISHED',
            },
            _count: { id: true }
        });

        return cityCounts.map(c => ({
            city: c.city || 'Onbekend',
            count: c._count.id
        }));
    } catch (error) {
        console.error("Failed to fetch city counts:", error);
        return [];
    }
}

// Get province stats with business counts
export async function getProvinceStats() {
    try {
        // Get business counts directly by provinceSlug from database
        const provinceCounts = await prisma.business.groupBy({
            by: ['provinceSlug'],
            where: {
                status: 'approved',
                publishStatus: 'PUBLISHED',
                provinceSlug: { not: null }
            },
            _count: { id: true }
        });

        // Create a map of slug -> count
        const countMap: Record<string, number> = {};
        for (const pc of provinceCounts) {
            if (pc.provinceSlug) {
                countMap[pc.provinceSlug] = pc._count.id;
            }
        }

        // Get top cities for each province
        const topCitiesPerProvince = await prisma.business.groupBy({
            by: ['provinceSlug', 'city'],
            where: {
                status: 'approved',
                publishStatus: 'PUBLISHED',
                provinceSlug: { not: null },
            },
            _count: { id: true },
            orderBy: {
                _count: { id: 'desc' }
            }
        });

        // Group cities by province
        const citiesByProvince: Record<string, string[]> = {};
        for (const item of topCitiesPerProvince) {
            if (item.provinceSlug && item.city) {
                if (!citiesByProvince[item.provinceSlug]) {
                    citiesByProvince[item.provinceSlug] = [];
                }
                if (citiesByProvince[item.provinceSlug].length < 3) {
                    citiesByProvince[item.provinceSlug].push(item.city);
                }
            }
        }

        // Build province stats from NETHERLANDS_PROVINCES
        const provinceStats = NETHERLANDS_PROVINCES.map(province => ({
            name: province.name,
            slug: province.slug,
            icon: province.icon,
            image: province.image,
            cities: citiesByProvince[province.slug] || province.cities.slice(0, 3).map(c => c.name),
            businessCount: countMap[province.slug] || 0
        }));

        return provinceStats;
    } catch (error) {
        console.error("Failed to fetch province stats:", error);
        return [];
    }
}

// Get top cities by business count
export async function getTopCitiesByBusinessCount(limit: number = 6) {
    try {
        const cityCounts = await prisma.business.groupBy({
            by: ['city'],
            where: {
                status: 'approved',
                publishStatus: 'PUBLISHED',
            },
            _count: { id: true },
            orderBy: {
                _count: { id: 'desc' }
            },
            take: limit
        });

        return cityCounts.map(c => {
            // Find province for this city
            let provinceName = 'Nederland';
            let citySlug = createSlug(c.city || 'onbekend');

            for (const province of NETHERLANDS_PROVINCES) {
                const foundCity = province.cities.find(pc =>
                    pc.name.toLowerCase() === (c.city || '').toLowerCase()
                );
                if (foundCity) {
                    provinceName = province.name;
                    citySlug = foundCity.slug;
                    break;
                }
            }

            return {
                name: c.city || 'Onbekend',
                slug: citySlug,
                province: provinceName,
                businessCount: c._count.id
            };
        });
    } catch (error) {
        console.error("Failed to fetch top cities:", error);
        return [];
    }
}

// Get total business count
export async function getTotalBusinessCount() {
    try {
        const count = await prisma.business.count({
            where: { status: 'approved', publishStatus: 'PUBLISHED' }
        });
        return count;
    } catch (error) {
        console.error("Failed to fetch total count:", error);
        return 0;
    }
}

// Get all businesses for homepage (featured)
export async function getAllFeaturedBusinesses(limit: number = 8) {
    try {
        const businesses = await prisma.business.findMany({
            where: {
                status: 'approved',
                publishStatus: 'PUBLISHED'
            },
            take: limit,
            orderBy: [
                { rating: 'desc' },
                { reviewCount: 'desc' }
            ],
            include: {
                subCategory: {
                    include: {
                        category: true
                    }
                }
            }
        });

        return businesses.map((b: any) => {
            const locationData = findProvinceByCity(b.city || 'Utrecht');
            return {
                id: b.id,
                name: b.name,
                slug: b.slug,
                category: b.subCategory.category.name.replace(' in Utrecht', '').replace(' in Nederland', ''),
                categorySlug: normalizeSlug(b.subCategory.category.slug),
                subcategorySlug: stripCategoryPrefix(
                    normalizeSlug(b.subCategory.slug),
                    normalizeSlug(b.subCategory.category.slug)
                ),
                subcategories: [b.subCategory.name],
                shortDescription: b.shortDescription || '',
                rating: b.reviewCount > 0 ? b.rating : null,
                reviewCount: b.reviewCount || 0,
                images: {
                    cover: b.coverImage || '',
                    logo: b.logo || ''
                },
                address: {
                    city: b.city || 'Nederland',
                    neighborhood: b.neighborhood || ''
                },
                provinceSlug: locationData?.province.slug || 'utrecht',
                citySlug: locationData?.city.slug || createSlug(b.city || 'utrecht'),
                neighborhoodSlug: createSlug(b.neighborhood || 'centrum')
            };
        });
    } catch (error) {
        console.error("Failed to fetch featured businesses:", error);
        return [];
    }
}

// Get related businesses by slug (same subcategory or category, excluding current business)
export async function getRelatedBusinessesBySlug(slug: string, limit: number = 4) {
    try {
        // Get the current business
        const currentBusiness = await prisma.business.findUnique({
            where: { slug },
            select: { id: true, subCategoryId: true }
        });

        if (!currentBusiness) return [];

        return getRelatedBusinessesById(currentBusiness.id, currentBusiness.subCategoryId, limit);
    } catch (error) {
        console.error("Failed to fetch related businesses:", error);
        return [];
    }
}

// Get related businesses by ID (same subcategory or category, excluding current business)
export async function getRelatedBusinessesById(businessId: string, subCategoryId: string, limit: number = 4) {
    try {
        // Get subcategory to find the category
        const subCategory = await prisma.subCategory.findUnique({
            where: { id: subCategoryId },
            select: { categoryId: true }
        });

        if (!subCategory) return [];

        // First try: same subcategory
        let businesses = await prisma.business.findMany({
            where: {
                subCategoryId,
                id: { not: businessId },
                status: 'approved',
                publishStatus: 'PUBLISHED'
            },
            take: limit,
            orderBy: [
                { rating: 'desc' },
                { reviewCount: 'desc' }
            ],
            include: {
                subCategory: {
                    include: {
                        category: true
                    }
                }
            }
        });

        // If not enough, get from same category
        if (businesses.length < limit) {
            const remaining = limit - businesses.length;
            const existingIds = businesses.map(b => b.id);
            existingIds.push(businessId);

            const moreBusinesses = await prisma.business.findMany({
                where: {
                    subCategory: {
                        categoryId: subCategory.categoryId
                    },
                    id: { notIn: existingIds },
                    status: 'approved',
                    publishStatus: 'PUBLISHED'
                },
                take: remaining,
                orderBy: [
                    { rating: 'desc' },
                    { reviewCount: 'desc' }
                ],
                include: {
                    subCategory: {
                        include: {
                            category: true
                        }
                    }
                }
            });

            businesses = [...businesses, ...moreBusinesses];
        }

        return businesses.map((b: any) => {
            const locationData = findProvinceByCity(b.city || 'Utrecht');
            return {
                id: b.id,
                name: b.name,
                slug: b.slug,
                category: b.subCategory.category.name.replace(' in Utrecht', '').replace(' in Nederland', ''),
                categorySlug: normalizeSlug(b.subCategory.category.slug),
                subcategorySlug: stripCategoryPrefix(
                    normalizeSlug(b.subCategory.slug),
                    normalizeSlug(b.subCategory.category.slug)
                ),
                subcategories: [b.subCategory.name],
                shortDescription: b.shortDescription || '',
                rating: b.reviewCount > 0 ? b.rating : null,
                reviewCount: b.reviewCount || 0,
                images: {
                    cover: b.coverImage || '',
                    logo: b.logo || ''
                },
                address: {
                    city: b.city || 'Nederland',
                    neighborhood: b.neighborhood || ''
                },
                provinceSlug: locationData?.province.slug || 'utrecht',
                citySlug: locationData?.city.slug || createSlug(b.city || 'utrecht'),
                neighborhoodSlug: createSlug(b.neighborhood || 'centrum')
            };
        });
    } catch (error) {
        console.error("Failed to fetch related businesses:", error);
        return [];
    }
}

// Publish business - change from DRAFT to PUBLISHED
export async function publishBusiness(): Promise<{ success: boolean; error?: string }> {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || !currentUser.businessId) {
            return { success: false, error: 'Geen bedrijf gevonden om te publiceren.' };
        }

        await prisma.business.update({
            where: { id: currentUser.businessId },
            data: {
                publishStatus: 'PUBLISHED',
                publishedAt: new Date()
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/profile');

        return { success: true };
    } catch (error) {
        console.error("Failed to publish business:", error);
        return { success: false, error: 'Er is iets misgegaan bij het publiceren.' };
    }
}

// Check if business is published
export async function isBusinessPublished(): Promise<boolean> {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.businessId) return false;

    const business = await prisma.business.findUnique({
        where: { id: currentUser.businessId },
        select: { publishStatus: true }
    });

    return business?.publishStatus === 'PUBLISHED';
}

// Get current user's business (for dashboard)
export async function getCurrentUserBusiness() {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.businessId) return null;

    return await prisma.business.findUnique({
        where: { id: currentUser.businessId }
    });
}
