const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const latest = await prisma.business.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!latest) {
            console.log('هیچ business‌ای وجود ندارد.');
            return;
        }

        console.log('\n=== بررسی محتوای longDescription ===\n');
        console.log('Business Name:', latest.name);
        console.log('\n--- محتوای longDescription ---\n');
        console.log(latest.longDescription);
        console.log('\n--- بررسی h2 ها ---\n');

        const hasH2 = latest.longDescription.includes('<h2');
        console.log('آیا h2 دارد؟', hasH2 ? '✅ بله' : '❌ خیر');

        if (hasH2) {
            const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
            const matches = [...latest.longDescription.matchAll(h2Regex)];
            console.log('تعداد h2 ها:', matches.length);
            console.log('\nعناوین h2:');
            matches.forEach((match, idx) => {
                console.log(`  ${idx + 1}. "${match[1]}"`);
            });
        }

    } catch (error) {
        console.error('خطا:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
