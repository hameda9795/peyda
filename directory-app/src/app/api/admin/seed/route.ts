import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL || process.env.DATABASE_URL
})

export async function POST(request: NextRequest) {
    try {
        const { secret } = await request.json()

        // Simple security check
        if (secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('Seeding test business data...')

        // First get or create a subcategory
        const restaurantSub = await prisma.subCategory.findFirst({
            where: {
                slug: '/utrecht/eten-drinken/restaurant'
            }
        })

        let subCategory = restaurantSub

        if (!restaurantSub) {
            console.log('Creating category and subcategory first...')
            const category = await prisma.category.upsert({
                where: { slug: '/utrecht/eten-drinken' },
                update: { name: 'Eten & Drinken in Utrecht' },
                create: {
                    name: 'Eten & Drinken in Utrecht',
                    slug: '/utrecht/eten-drinken',
                }
            })

            const newSub = await prisma.subCategory.upsert({
                where: { slug: '/utrecht/eten-drinken/restaurant' },
                update: { name: 'Restaurant' },
                create: {
                    name: 'Restaurant',
                    slug: '/utrecht/eten-drinken/restaurant',
                    categoryId: category.id
                }
            })
            subCategory = newSub
        }

        if (!subCategory) {
            return NextResponse.json({ error: 'SubCategory not found' }, { status: 400 })
        }

        // Create or update the test business
        const business = await prisma.business.upsert({
            where: { slug: 'de-koffie-kamer-utrecht' },
            update: {
                name: 'De Koffie Kamer Utrecht',
                description: 'De gezelligste koffiebar in hartje Utrecht',
                shortDescription: 'De gezelligste koffiebar in hartje Utrecht met ambachtelijke gebakjes en specialty coffee.',
                longDescription: `
                    <p>Welkom bij De Koffie Kamer Utrecht, dé plek waar passie voor koffie en gezelligheid samenkomen.</p>
                    <p>Onze barista's werken uitsluitend met fair-trade bonen van lokale branderijen.</p>
                `,
                street: 'Biltstraat 123',
                postalCode: '3572 AA',
                city: 'Utrecht',
                neighborhood: 'Wittevrouwen',
                phone: '+31 30 123 4567',
                email: 'hallo@koffiekamer-utrecht.nl',
                website: 'https://koffiekamer-utrecht.nl',
                instagram: 'https://instagram.com/koffiekamer',
                facebook: 'https://facebook.com/koffiekamer',
                logo: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?q=80&w=200',
                coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1920',
                gallery: [
                    { url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800', altText: 'Barista maakt koffie achter de counter' },
                    { url: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=800', altText: 'Gezellige inrichting met natuurlijk licht' },
                    { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800', altText: 'Ambachtelijke gebakjes in de vitrine' },
                    { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', altText: 'Sfeerimpressie van het restaurant' }
                ],
                kvkNumber: '12345678',
                foundedYear: 2018,
                serviceArea: 'Utrecht Stad, Wittevrouwen, Biltstraat',
                bookingUrl: 'https://koffiekamer-utrecht.nl/reserveren',
                ctaType: 'booking',
                services: [
                    { name: 'Koffie op locatie', description: 'Professionele barista service voor evenementen.', price: 'Op aanvraag' },
                    { name: 'Workshops', description: 'Leer de kunst van latte art en filterkoffie.', price: '€45 p.p.' },
                    { name: 'High Tea', description: 'Onbeperkt thee en etagères vol lekkernijen.', price: '€27,50 p.p.' }
                ],
                amenities: ['Wi-Fi', 'Toilet', 'Rolstoeltoegankelijk', 'Diervriendelijk', 'Airconditioning'],
                paymentMethods: ['Pin', 'Creditcard', 'Contant', 'Apple Pay'],
                languages: ['Nederlands', 'Engels'],
                highlights: [
                    'Beste Koffie van Utrecht 2025 publieksprijs',
                    'Gratis snelle Wi-Fi & laptopvriendelijk',
                    'Zonnig terras aan de gracht',
                    '100% biologische & fair-trade bonen'
                ],
                tags: ['Specialty Coffee', 'Vegan Opties', 'Terras', 'Werkplek'],
                faq: [
                    { question: 'Kan ik met mijn laptop werken?', answer: 'Ja zeker! Doordeweeks zijn laptops van harte welkom.' },
                    { question: 'Hebben jullie glutenvrije opties?', answer: 'Ja, we hebben altijd minimaal 2 glutenvrije taartjes.' }
                ],
                seoTitle: 'De Koffie Kamer Utrecht | Specialty Coffee & Lunch in Wittevrouwen',
                seoDescription: 'Ontdek De Koffie Kamer in Utrecht. Dé plek voor specialty coffee, huisgemaakte taart en gezonde lunch.',
                seoKeywords: ['koffie utrecht', 'lunch wittevrouwen', 'specialty coffee'],
                rating: 4.8,
                reviewCount: 342,
                isVerified: true,
                status: 'published',
                subCategoryId: subCategory.id
            },
            create: {
                name: 'De Koffie Kamer Utrecht',
                slug: 'de-koffie-kamer-utrecht',
                description: 'De gezelligste koffiebar in hartje Utrecht',
                shortDescription: 'De gezelligste koffiebar in hartje Utrecht met ambachtelijke gebakjes en specialty coffee.',
                longDescription: `
                    <p>Welkom bij De Koffie Kamer Utrecht, dé plek waar passie voor koffie en gezelligheid samenkomen.</p>
                    <p>Onze barista's werken uitsluitend met fair-trade bonen van lokale branderijen.</p>
                `,
                street: 'Biltstraat 123',
                postalCode: '3572 AA',
                city: 'Utrecht',
                neighborhood: 'Wittevrouwen',
                phone: '+31 30 123 4567',
                email: 'hallo@koffiekamer-utrecht.nl',
                website: 'https://koffiekamer-utrecht.nl',
                instagram: 'https://instagram.com/koffiekamer',
                facebook: 'https://facebook.com/koffiekamer',
                logo: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?q=80&w=200',
                coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1920',
                gallery: [
                    { url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800', altText: 'Barista maakt koffie achter de counter' },
                    { url: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=800', altText: 'Gezellige inrichting met natuurlijk licht' },
                    { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800', altText: 'Ambachtelijke gebakjes in de vitrine' },
                    { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', altText: 'Sfeerimpressie van het restaurant' }
                ],
                kvkNumber: '12345678',
                foundedYear: 2018,
                serviceArea: 'Utrecht Stad, Wittevrouwen, Biltstraat',
                bookingUrl: 'https://koffiekamer-utrecht.nl/reserveren',
                ctaType: 'booking',
                services: [
                    { name: 'Koffie op locatie', description: 'Professionele barista service voor evenementen.', price: 'Op aanvraag' },
                    { name: 'Workshops', description: 'Leer de kunst van latte art en filterkoffie.', price: '€45 p.p.' },
                    { name: 'High Tea', description: 'Onbeperkt thee en etagères vol lekkernijen.', price: '€27,50 p.p.' }
                ],
                amenities: ['Wi-Fi', 'Toilet', 'Rolstoeltoegankelijk', 'Diervriendelijk', 'Airconditioning'],
                paymentMethods: ['Pin', 'Creditcard', 'Contant', 'Apple Pay'],
                languages: ['Nederlands', 'Engels'],
                highlights: [
                    'Beste Koffie van Utrecht 2025 publieksprijs',
                    'Gratis snelle Wi-Fi & laptopvriendelijk',
                    'Zonnig terras aan de gracht',
                    '100% biologische & fair-trade bonen'
                ],
                tags: ['Specialty Coffee', 'Vegan Opties', 'Terras', 'Werkplek'],
                faq: [
                    { question: 'Kan ik met mijn laptop werken?', answer: 'Ja zeker! Doordeweeks zijn laptops van harte welkom.' },
                    { question: 'Hebben jullie glutenvrije opties?', answer: 'Ja, we hebben altijd minimaal 2 glutenvrije taartjes.' }
                ],
                seoTitle: 'De Koffie Kamer Utrecht | Specialty Coffee & Lunch in Wittevrouwen',
                seoDescription: 'Ontdek De Koffie Kamer in Utrecht. Dé plek voor specialty coffee, huisgemaakte taart en gezonde lunch.',
                seoKeywords: ['koffie utrecht', 'lunch wittevrouwen', 'specialty coffee'],
                rating: 4.8,
                reviewCount: 342,
                isVerified: true,
                status: 'published',
                subCategoryId: subCategory.id
            }
        })

        console.log(`Created/Updated business: ${business.name}`)

        // Create opening hours
        const openingHours = [
            { day: 'Maandag', open: '08:00', close: '18:00', closed: false },
            { day: 'Dinsdag', open: '08:00', close: '18:00', closed: false },
            { day: 'Woensdag', open: '08:00', close: '18:00', closed: false },
            { day: 'Donderdag', open: '08:00', close: '21:00', closed: false },
            { day: 'Vrijdag', open: '08:00', close: '21:00', closed: false },
            { day: 'Zaterdag', open: '09:00', close: '18:00', closed: false },
            { day: 'Zondag', open: '10:00', close: '17:00', closed: false }
        ]

        await prisma.business.update({
            where: { id: business.id },
            data: { openingHours }
        })

        // Create reviews
        const reviews = [
            {
                author: 'Sophie de Vries',
                email: 'sophie@example.nl',
                rating: 5,
                content: 'Geweldige sfeer en de beste havermelk cappuccino van Utrecht! Het personeel is altijd vriendelijk.',
                ownerResponse: 'Bedankt Sophie! Wat fijn om te horen dat je van onze koffie geniet. Tot snel!',
                isPublished: true
            },
            {
                author: 'Jan Jansen',
                email: 'jan@example.nl',
                rating: 4,
                content: 'Lekkere taart en goede koffie. In het weekend wel erg druk, dus reserveren is handig.',
                ownerResponse: null,
                isPublished: true
            },
            {
                author: 'Maria van der Berg',
                email: 'maria@example.nl',
                rating: 5,
                content: 'Absolute aanrader! De beste lunchroom in Utrecht.',
                ownerResponse: 'Dank je wel Maria! Fijn dat je langs bent geweest.',
                isPublished: true
            }
        ]

        for (const review of reviews) {
            await prisma.review.upsert({
                where: {
                    id: `${business.id}-${review.author.toLowerCase().replace(/ /g, '-')}`
                },
                update: review,
                create: {
                    id: `${business.id}-${review.author.toLowerCase().replace(/ /g, '-')}`,
                    ...review,
                    businessId: business.id
                }
            })
        }

        // Create analytics for current month
        const now = new Date()
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        await prisma.businessAnalytics.upsert({
            where: {
                businessId_month: {
                    businessId: business.id,
                    month: firstOfMonth
                }
            },
            update: {
                profileViews: 342,
                phoneClicks: 28,
                websiteClicks: 15,
                directionsClicks: 45,
                emailClicks: 8,
                bookingClicks: 12
            },
            create: {
                businessId: business.id,
                month: firstOfMonth,
                profileViews: 342,
                phoneClicks: 28,
                websiteClicks: 15,
                directionsClicks: 45,
                emailClicks: 8,
                bookingClicks: 12
            }
        })

        // Create owner
        await prisma.businessOwner.upsert({
            where: { email: 'owner@koffiekamer-utrecht.nl' },
            update: {
                name: 'Piet de eigenaar',
                businessId: business.id
            },
            create: {
                email: 'owner@koffiekamer-utrecht.nl',
                name: 'Piet de eigenaar',
                businessId: business.id
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            business: {
                id: business.id,
                slug: business.slug
            }
        })
    } catch (error) {
        console.error('Error seeding database:', error)
        return NextResponse.json(
            { error: 'Failed to seed database', details: String(error) },
            { status: 500 }
        )
    }
}
