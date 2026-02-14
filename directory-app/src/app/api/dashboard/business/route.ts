import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL || process.env.DATABASE_URL
})

// Helper to get business
async function getBusiness(businessId?: string) {
    if (businessId) {
        return await prisma.business.findUnique({
            where: { id: businessId },
            include: {
                subCategory: {
                    include: { category: true }
                },
                analytics: true
            }
        })
    }
    return await prisma.business.findFirst({
        where: { status: 'published' },
        include: {
            subCategory: {
                include: { category: true }
            },
            analytics: true
        }
    })
}

// GET - Fetch business data for dashboard
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const businessId = searchParams.get('businessId') || undefined

        const business = await getBusiness(businessId)

        if (!business) {
            return NextResponse.json({ error: 'No business found' }, { status: 404 })
        }

        return NextResponse.json({
            id: business.id,
            name: business.name,
            slug: business.slug,
            city: business.city,
            category: business.subCategory?.category?.name || '',
            subcategory: business.subCategory?.name || '',
            rating: business.rating,
            reviewCount: business.reviewCount,
            isVerified: business.isVerified,
            status: business.status,
            address: {
                street: business.street,
                postalCode: business.postalCode,
                city: business.city,
                neighborhood: business.neighborhood,
                province: business.province
            },
            contact: {
                phone: business.phone,
                email: business.email,
                website: business.website,
                instagram: business.instagram,
                facebook: business.facebook,
                linkedin: business.linkedin
            },
            images: {
                logo: business.logo,
                logoAltText: business.logoAltText,
                cover: business.coverImage,
                coverAltText: business.coverAltText,
                gallery: business.gallery
            },
            shortDescription: business.shortDescription,
            longDescription: business.longDescription,
            openingHours: business.openingHours,
            amenities: business.amenities,
            paymentMethods: business.paymentMethods,
            languages: business.languages,
            services: business.services,
            highlights: business.highlights,
            tags: business.tags,
            faq: business.faq,
            kvk: business.kvkNumber,
            foundedYear: business.foundedYear,
            serviceArea: business.serviceArea,
            bookingUrl: business.bookingUrl,
            certifications: business.certifications,
            seo: {
                title: business.seoTitle,
                description: business.seoDescription,
                keywords: business.seoKeywords
            },
            stats: {
                profileViews: business.analytics?.profileViews || 0,
                phoneClicks: business.analytics?.phoneClicks || 0,
                websiteClicks: business.analytics?.websiteClicks || 0,
                directionsClicks: business.analytics?.directionsClicks || 0
            }
        })
    } catch (error) {
        console.error('Error fetching business:', error)
        return NextResponse.json({ error: 'Failed to fetch business' }, { status: 500 })
    }
}

// PUT - Update business data
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const businessId = searchParams.get('businessId') || undefined

        const business = await getBusiness(businessId)

        if (!business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 })
        }

        const body = await request.json()

        const updated = await prisma.business.update({
            where: { id: business.id },
            data: {
                ...body,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({ success: true, business: updated })
    } catch (error) {
        console.error('Error updating business:', error)
        return NextResponse.json({ error: 'Failed to update business' }, { status: 500 })
    }
}
