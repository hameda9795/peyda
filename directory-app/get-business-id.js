// Run with: node get-business-id.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('\n📋 لیست کسب‌وکارها:\n');

    const businesses = await prisma.business.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            status: true,
        },
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    if (businesses.length === 0) {
        console.log('❌ هیچ کسب‌وکاری پیدا نشد!');
        console.log('\n💡 ابتدا یک کسب‌وکار بسازید از طریق:');
        console.log('   http://localhost:3000/bedrijf-aanmelden\n');
        return;
    }

    businesses.forEach((business, index) => {
        console.log(`${index + 1}. ${business.name}`);
        console.log(`   ID: ${business.id}`);
        console.log(`   Slug: ${business.slug}`);
        console.log(`   City: ${business.city}`);
        console.log(`   Status: ${business.status}`);
        console.log(`   Dashboard: http://localhost:3000/dashboard?businessId=${business.id}\n`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
