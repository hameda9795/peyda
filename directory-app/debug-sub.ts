
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const sub = await prisma.subCategory.findFirst({
        where: {
            name: {
                contains: 'Autogarage',
                mode: 'insensitive'
            }
        },
        include: {
            category: true
        }
    })
    console.log('SUB_IMAGE_DEBUG:', JSON.stringify(sub, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
