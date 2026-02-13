const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const latestBusiness = await prisma.business.findFirst({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                subCategory: {
                    include: {
                        category: true
                    }
                }
            }
        });

        if (!latestBusiness) {
            console.log('هیچ business‌ای وجود ندارد.');
            return;
        }

        // Clean slugs
        const createSlug = (text) => {
            return text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        };

        const provinceSlug = latestBusiness.provinceSlug || 'utrecht';
        const citySlug = createSlug(latestBusiness.city);
        const neighborhoodSlug = createSlug(latestBusiness.neighborhood || 'centrum');

        const rawCategorySlug = latestBusiness.subCategory.category.slug || 'categorie';
        const cleanCategorySlug = rawCategorySlug
            .replace(/^\/?utrecht\//, '')
            .replace(/^\/?nederland\//, '')
            .replace(/^\/?/, '')
            .replace(/\//g, '-');

        const rawSubCategorySlug = latestBusiness.subCategory.slug || 'subcategorie';
        const cleanSubCategorySlug = rawSubCategorySlug
            .replace(/^\/?utrecht\//, '')
            .replace(/^\/?nederland\//, '')
            .replace(new RegExp(`^/?${rawCategorySlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?`), '')
            .replace(new RegExp(`^/?${cleanCategorySlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?`), '')
            .replace(/^\/?/, '')
            .replace(/\//g, '-');

        const businessSlug = latestBusiness.slug;

        const url = `/${provinceSlug}/${citySlug}/${neighborhoodSlug}/${cleanCategorySlug}/${cleanSubCategorySlug}/${businessSlug}`;

        console.log('\n=== URL Business ===\n');
        console.log('Business Name:', latestBusiness.name);
        console.log('URL:', url);
        console.log('\nاین URL را در مرورگر باز کنید:');
        console.log(`http://localhost:3000${url}`);
        console.log('\n--- جزئیات URL ---');
        console.log('Province:', provinceSlug);
        console.log('City:', citySlug);
        console.log('Neighborhood:', neighborhoodSlug);
        console.log('Category:', cleanCategorySlug);
        console.log('Subcategory:', cleanSubCategorySlug);
        console.log('Business:', businessSlug);

    } catch (error) {
        console.error('خطا:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
