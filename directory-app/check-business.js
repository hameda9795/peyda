const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        // Get the most recent business
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
            console.log('هیچ business‌ای در دیتابیس وجود ندارد.');
            return;
        }

        console.log('\n=== آخرین Business ثبت شده ===\n');
        console.log('Name:', latestBusiness.name);
        console.log('Slug:', latestBusiness.slug);
        console.log('Category:', latestBusiness.subCategory.category.name);
        console.log('Subcategory:', latestBusiness.subCategory.name);
        console.log('\n--- تصاویر ---');
        console.log('Logo:', latestBusiness.logo || '❌ وجود ندارد');
        console.log('Cover Image:', latestBusiness.coverImage || '❌ وجود ندارد');
        console.log('Gallery:', latestBusiness.gallery.length > 0 ? `${latestBusiness.gallery.length} عکس` : '❌ وجود ندارد');

        if (latestBusiness.gallery.length > 0) {
            console.log('\nGallery URLs:');
            latestBusiness.gallery.forEach((url, idx) => {
                console.log(`  ${idx + 1}. ${url}`);
            });
        }

        console.log('\n--- اطلاعات دیگر ---');
        console.log('Status:', latestBusiness.status);
        console.log('Created At:', latestBusiness.createdAt);
        console.log('City:', latestBusiness.city);
        console.log('Neighborhood:', latestBusiness.neighborhood);

        // Check if files exist
        if (latestBusiness.coverImage) {
            const fs = require('fs');
            const path = require('path');
            const coverPath = path.join(process.cwd(), 'public', latestBusiness.coverImage);
            const exists = fs.existsSync(coverPath);
            console.log('\n⚠️ بررسی وجود فایل Cover Image:');
            console.log('   Path:', coverPath);
            console.log('   وجود دارد؟', exists ? '✅ بله' : '❌ خیر');
        }

    } catch (error) {
        console.error('خطا:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
