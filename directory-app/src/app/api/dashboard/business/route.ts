import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL || process.env.DATABASE_URL
})

// Helper to get authenticated user
async function getAuthenticatedUser() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')

    if (!sessionToken) {
        return null
    }

    return await prisma.businessOwner.findUnique({
        where: { id: sessionToken.value },
        include: { business: true }
    })
}

// Helper to get business - only returns user's own business
async function getUserBusiness(businessId?: string, userId?: string) {
    // If no user, return nothing
    if (!userId) {
        return null
    }

    // If businessId is provided, verify it belongs to user
    if (businessId) {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            include: {
                subCategory: {
                    include: { category: true }
                },
                analytics: true
            }
        })

        // Verify this business belongs to the user
        const owner = await prisma.businessOwner.findFirst({
            where: { id: userId, businessId: businessId }
        })

        if (!owner) {
            return null // User doesn't own this business
        }

        return business
    }

    // No businessId provided, return user's business
    const user = await prisma.businessOwner.findUnique({
        where: { id: userId },
        include: {
            business: {
                include: {
                    subCategory: {
                        include: { category: true }
                    },
                    analytics: true
                }
            }
        }
    })

    return user?.business || null
}

// GET - Fetch business data for dashboard
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const currentUser = await getAuthenticatedUser()
        if (!currentUser || !currentUser.businessId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const businessId = searchParams.get('businessId') || undefined

        const business = await getUserBusiness(businessId, currentUser.id)

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
            publishStatus: business.publishStatus,
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
                keywords: business.seoKeywords,
                status: business.seoStatus,
                lastUpdate: business.lastSeoUpdate,
                hasStructuredData: !!business.structuredData
            },
            stats: {
                profileViews: business.analytics?.[0]?.profileViews || 0,
                phoneClicks: business.analytics?.[0]?.phoneClicks || 0,
                websiteClicks: business.analytics?.[0]?.websiteClicks || 0,
                directionsClicks: business.analytics?.[0]?.directionsClicks || 0
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
        // Check authentication
        const currentUser = await getAuthenticatedUser()
        if (!currentUser || !currentUser.businessId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const businessId = searchParams.get('businessId') || undefined

        const business = await getUserBusiness(businessId, currentUser.id)

        if (!business) {
            return NextResponse.json({ error: 'Business not found or unauthorized' }, { status: 404 })
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
