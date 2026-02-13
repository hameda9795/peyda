const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getBusinessBySlug(slug) {
    const business = await prisma.business.findUnique({
        where: { slug },
        include: {
            subCategory: {
                include: {
                    category: true
                }
            }
        }
    });

    if (!business) return null;

    // Simulate the mapping in getBusinessBySlug
    const result = {
        id: business.id,
        name: business.name,
        slug: business.slug,
        category: business.subCategory.category.name,
        images: {
            logo: business.logo || '',
            cover: business.coverImage || '',
            gallery: business.gallery
        },
        address: {
            street: business.street,
            city: business.city,
            postalCode: business.postalCode,
            neighborhood: business.neighborhood
        }
    };

    return result;
}

async function main() {
    try {
        // Get latest business
        const latest = await prisma.business.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!latest) {
            console.log('هیچ business‌ای وجود ندارد.');
            return;
        }

        console.log('\n=== تست getBusinessBySlug ===\n');
        console.log('Testing with slug:', latest.slug);

        const businessData = await getBusinessBySlug(latest.slug);

        console.log('\n--- نتیجه getBusinessBySlug ---\n');
        console.log('Name:', businessData.name);
        console.log('Category:', businessData.category);
        console.log('\nImages Object:');
        console.log('  logo:', businessData.images.logo);
        console.log('  cover:', businessData.images.cover);
        console.log('  gallery:', businessData.images.gallery);

        if (!businessData.images.cover) {
            console.log('\n❌ مشکل: images.cover خالی است!');
        } else {
            console.log('\n✅ images.cover مقدار دارد:', businessData.images.cover);
        }

    } catch (error) {
        console.error('خطا:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
