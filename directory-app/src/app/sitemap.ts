import { MetadataRoute } from 'next';
import { db as prisma } from '@/lib/db';
import { NETHERLANDS_PROVINCES } from '@/lib/netherlands-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peyda.nl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const sitemap: MetadataRoute.Sitemap = [];

    // 1. Static pages
    const staticPages = [
        { url: '', priority: 1.0, changeFrequency: 'daily' as const },
        { url: '/categorieen', priority: 0.9, changeFrequency: 'weekly' as const },
        { url: '/provincies', priority: 0.9, changeFrequency: 'weekly' as const },
        { url: '/steden', priority: 0.9, changeFrequency: 'weekly' as const },
        { url: '/wijken', priority: 0.8, changeFrequency: 'weekly' as const },
        { url: '/diensten', priority: 0.9, changeFrequency: 'weekly' as const },
        { url: '/bedrijf-aanmelden', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/over-ons', priority: 0.5, changeFrequency: 'monthly' as const },
        { url: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
        { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    ];

    for (const page of staticPages) {
        sitemap.push({
            url: `${BASE_URL}${page.url}`,
            lastModified: now,
            changeFrequency: page.changeFrequency,
            priority: page.priority,
        });
    }

    // 2. Province pages
    for (const province of NETHERLANDS_PROVINCES) {
        sitemap.push({
            url: `${BASE_URL}/provincies/${province.slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        });

        // City pages within provinces
        for (const city of province.cities) {
            sitemap.push({
                url: `${BASE_URL}/steden/${city.slug}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    }

    // 3. Category pages from database
    try {
        const categories = await prisma.category.findMany({
            include: {
                subcategories: true,
            },
        });

        for (const category of categories) {
            // Clean category slug
            const categorySlug = category.slug
                .replace(/^\/+/, '')
                .replace(/^utrecht\//, '')
                .replace(/^nederland\//, '');

            sitemap.push({
                url: `${BASE_URL}/categorieen/${categorySlug}`,
                lastModified: category.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.8,
            });

            // Subcategory pages
            for (const subcategory of category.subcategories) {
                const subSlug = subcategory.slug
                    .replace(/^\/+/, '')
                    .replace(/^utrecht\//, '')
                    .replace(/^nederland\//, '')
                    .replace(new RegExp(`^${categorySlug}/?`), '')
                    .replace(/\//g, '-');

                sitemap.push({
                    url: `${BASE_URL}/categorieen/${categorySlug}/${subSlug}`,
                    lastModified: subcategory.updatedAt,
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            }
        }
    } catch (error) {
        console.error('Error fetching categories for sitemap:', error);
    }

    // 4. Business pages from database
    try {
        const businesses = await prisma.business.findMany({
            where: {
                status: 'approved',
            },
            select: {
                slug: true,
                city: true,
                neighborhood: true,
                provinceSlug: true,
                updatedAt: true,
                subCategory: {
                    select: {
                        slug: true,
                        category: {
                            select: {
                                slug: true,
                            },
                        },
                    },
                },
            },
        });

        for (const business of businesses) {
            // Build full SEO URL: /province/city/neighborhood/category/subcategory/business
            const provinceSlug = business.provinceSlug || 'utrecht';
            const citySlug = (business.city || 'utrecht').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const neighborhoodSlug = (business.neighborhood || 'centrum').toLowerCase().replace(/[^a-z0-9]+/g, '-');

            const categorySlug = business.subCategory.category.slug
                .replace(/^\/+/, '')
                .replace(/^utrecht\//, '')
                .replace(/^nederland\//, '');

            const subSlug = business.subCategory.slug
                .replace(/^\/+/, '')
                .replace(/^utrecht\//, '')
                .replace(/^nederland\//, '')
                .replace(new RegExp(`^${categorySlug}/?`), '')
                .replace(/\//g, '-');

            sitemap.push({
                url: `${BASE_URL}/${provinceSlug}/${citySlug}/${neighborhoodSlug}/${categorySlug}/${subSlug}/${business.slug}`,
                lastModified: business.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        }
    } catch (error) {
        console.error('Error fetching businesses for sitemap:', error);
    }

    // 5. City pages from database (for neighborhoods)
    try {
        const cities = await prisma.city.findMany({
            include: {
                neighborhoods: true,
            },
        });

        for (const city of cities) {
            // Neighborhood pages
            for (const neighborhood of city.neighborhoods) {
                sitemap.push({
                    url: `${BASE_URL}/wijken/${city.slug}/${neighborhood.slug}`,
                    lastModified: neighborhood.updatedAt,
                    changeFrequency: 'weekly',
                    priority: 0.6,
                });
            }
        }
    } catch (error) {
        console.error('Error fetching cities for sitemap:', error);
    }

    // 6. Diensten pages (City + Category combinations)
    try {
        const categories = await prisma.category.findMany({
            select: { slug: true, name: true },
        });

        // Get major cities from each province (limit for performance)
        const majorCities = NETHERLANDS_PROVINCES.flatMap(province =>
            province.cities.slice(0, 3) // Top 3 cities per province
        );

        for (const city of majorCities) {
            for (const category of categories) {
                const categorySlug = category.slug
                    .replace(/^\/+/, '')
                    .replace(/^utrecht\//, '')
                    .replace(/^nederland\//, '');

                sitemap.push({
                    url: `${BASE_URL}/diensten/${city.slug}/${categorySlug}`,
                    lastModified: now,
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            }
        }
    } catch (error) {
        console.error('Error generating diensten pages for sitemap:', error);
    }

    // 7. Beste (Comparison) pages - High SEO value
    try {
        const categories = await prisma.category.findMany({
            select: { slug: true, name: true },
        });

        // Static beste page
        sitemap.push({
            url: `${BASE_URL}/beste`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        });

        // Get all cities with businesses
        const citiesWithBusinesses = await prisma.business.groupBy({
            by: ['city'],
            where: { status: 'approved' },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 50, // Top 50 cities
        });

        // Create comparison pages for each city + category combination
        for (const cityData of citiesWithBusinesses) {
            if (!cityData.city) continue;

            const citySlug = cityData.city.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            for (const category of categories) {
                // Create clean category slug for comparison pages
                const cleanCategoryName = (category.name || '')
                    .replace(' in Utrecht', '')
                    .replace(' in Nederland', '');
                const cleanCategorySlug = cleanCategoryName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');

                if (cleanCategorySlug) {
                    sitemap.push({
                        url: `${BASE_URL}/beste/${citySlug}/${cleanCategorySlug}`,
                        lastModified: now,
                        changeFrequency: 'weekly',
                        priority: 0.85, // High priority for comparison pages
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error generating beste pages for sitemap:', error);
    }

    return sitemap;
}
