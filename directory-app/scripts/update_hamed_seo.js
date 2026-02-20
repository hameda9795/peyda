const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const b = await prisma.business.updateMany({
        where: { name: 'hamed' },
        data: {
            seoStatus: 'COMPLETED',
            lastSeoUpdate: new Date()
        }
    });
    console.log('Updated:', b);
}

main()
    .then(() => prisma.$disconnect())
    .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
