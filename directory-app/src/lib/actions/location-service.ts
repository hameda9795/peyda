"use server";

import { db as prisma } from "@/lib/db";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";

// Helper to create URL-safe slug
const createSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Helper to find province by city name
const findProvinceByCity = (cityName: string) => {
    const lower = cityName.toLowerCase();
    for (const province of NETHERLANDS_PROVINCES) {
        const match = province.cities.find((city) => city.name.toLowerCase() === lower);
        if (match) return { province, city: match };
    }
    return null;
};

// Helper to normalize slug
const normalizeSlug = (value?: string | null) => {
    if (!value) return "";
    return value
        .replace(/^\/+/, "")
        .replace(/^utrecht\//, "")
        .replace(/^nederland\//, "")
        .replace(/\//g, '-');
};

const stripCategoryPrefix = (subSlug: string, categorySlug: string) => {
    if (!subSlug || !categorySlug) return subSlug;
    let result = subSlug;
    if (result.startsWith(`${categorySlug}/`)) {
        result = result.slice(categorySlug.length + 1);
    }
    const cleanCat = categorySlug.replace(/^utrecht\//, '').replace(/^nederland\//, '');
    if (result.startsWith(`${cleanCat}/`)) {
        result = result.slice(cleanCat.length + 1);
    }
    return result.replace(/\//g, '-');
};

// Get city info from slug
export async function getCityBySlug(citySlug: string) {
    for (const province of NETHERLANDS_PROVINCES) {
        const city = province.cities.find(c => c.slug === citySlug);
        if (city) {
            return {
                name: city.name,
                slug: city.slug,
                province: {
                    name: province.name,
                    slug: province.slug
                }
            };
        }
    }
    return null;
}

// Get category info from slug
export async function getCategoryBySlug(categorySlug: string) {
    const category = await prisma.category.findFirst({
        where: {
            OR: [
                { slug: categorySlug },
                { slug: { contains: categorySlug } },
                { slug: `/nederland/${categorySlug}` },
                { slug: `/utrecht/${categorySlug}` }
            ]
        },
        include: {
            subcategories: true
        }
    });

    if (!category) return null;

    return {
        id: category.id,
        name: category.name.replace(' in Utrecht', '').replace(' in Nederland', ''),
        slug: normalizeSlug(category.slug),
        icon: category.icon,
        description: category.description,
        subcategories: category.subcategories.map(sub => ({
            id: sub.id,
            name: sub.name,
            slug: stripCategoryPrefix(normalizeSlug(sub.slug), normalizeSlug(category.slug))
        }))
    };
}

// Get businesses by city and category
export async function getBusinessesByCityAndCategory(
    citySlug: string,
    categorySlug: string,
    limit: number = 20
) {
    try {
        // Find city name from slug
        let cityName = '';
        for (const province of NETHERLANDS_PROVINCES) {
            const city = province.cities.find(c => c.slug === citySlug);
            if (city) {
                cityName = city.name;
                break;
            }
        }

        if (!cityName) return [];

        // Find category
        const category = await prisma.category.findFirst({
            where: {
                OR: [
                    { slug: categorySlug },
                    { slug: { contains: categorySlug } },
                    { slug: `/nederland/${categorySlug}` },
                    { slug: `/utrecht/${categorySlug}` }
                ]
            }
        });

        if (!category) return [];

        const businesses = await prisma.business.findMany({
            where: {
                city: {
                    equals: cityName,
                    mode: 'insensitive'
                },
                subCategory: {
                    categoryId: category.id
                },
                status: 'approved'
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
                shortDescription: b.shortDescription || '',
                rating: b.reviewCount > 0 ? b.rating : null,
                reviewCount: b.reviewCount || 0,
                images: {
                    cover: b.coverImage || '',
                    logo: b.logo || ''
                },
                address: {
                    street: b.street || '',
                    city: b.city || 'Nederland',
                    neighborhood: b.neighborhood || '',
                    postalCode: b.postalCode || ''
                },
                contact: {
                    phone: b.phone || '',
                    website: b.website || ''
                },
                provinceSlug: locationData?.province.slug || 'utrecht',
                citySlug: locationData?.city.slug || createSlug(b.city || 'utrecht'),
                neighborhoodSlug: createSlug(b.neighborhood || 'centrum')
            };
        });
    } catch (error) {
        console.error("Failed to fetch businesses by city and category:", error);
        return [];
    }
}

// Get business count by city and category
export async function getBusinessCountByCityAndCategory(citySlug: string, categorySlug: string) {
    try {
        let cityName = '';
        for (const province of NETHERLANDS_PROVINCES) {
            const city = province.cities.find(c => c.slug === citySlug);
            if (city) {
                cityName = city.name;
                break;
            }
        }

        if (!cityName) return 0;

        const category = await prisma.category.findFirst({
            where: {
                OR: [
                    { slug: categorySlug },
                    { slug: { contains: categorySlug } },
                    { slug: `/nederland/${categorySlug}` },
                    { slug: `/utrecht/${categorySlug}` }
                ]
            }
        });

        if (!category) return 0;

        return await prisma.business.count({
            where: {
                city: {
                    equals: cityName,
                    mode: 'insensitive'
                },
                subCategory: {
                    categoryId: category.id
                },
                status: 'approved'
            }
        });
    } catch (error) {
        console.error("Failed to count businesses:", error);
        return 0;
    }
}

// Get all city-category combinations for sitemap
export async function getAllCityCategoryCombinations() {
    try {
        const categories = await prisma.category.findMany({
            select: { slug: true }
        });

        const combinations: { city: string; category: string }[] = [];

        for (const province of NETHERLANDS_PROVINCES) {
            for (const city of province.cities) {
                for (const category of categories) {
                    combinations.push({
                        city: city.slug,
                        category: normalizeSlug(category.slug)
                    });
                }
            }
        }

        return combinations;
    } catch (error) {
        console.error("Failed to get combinations:", error);
        return [];
    }
}
