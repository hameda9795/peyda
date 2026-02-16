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
        where: { id: sessionToken.value }
    })
}

// Helper to get user's business
async function getUserBusiness(businessId?: string, userId?: string) {
    if (!userId) return null

    if (businessId) {
        const business = await prisma.business.findUnique({ where: { id: businessId } })
        const owner = await prisma.businessOwner.findFirst({
            where: { id: userId, businessId: businessId }
        })
        if (!owner) return null
        return business
    }

    const user = await prisma.businessOwner.findUnique({
        where: { id: userId },
        include: { business: true }
    })
    return user?.business || null
}

// GET - Fetch reviews for business
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
            return NextResponse.json({ error: 'Business not found' }, { status: 404 })
        }

        const reviews = await prisma.review.findMany({
            where: { businessId: business.id },
            orderBy: { createdAt: 'desc' }
        })

        // Calculate stats
        const totalReviews = reviews.length
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0
        const pendingResponses = reviews.filter(r => !r.ownerResponse).length

        return NextResponse.json({
            reviews,
            stats: {
                totalReviews,
                avgRating: Math.round(avgRating * 10) / 10,
                pendingResponses
            }
        })
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }
}

// POST - Submit owner response to a review
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const currentUser = await getAuthenticatedUser()
        if (!currentUser || !currentUser.businessId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { reviewId, response } = body

        // Verify the review belongs to user's business
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        })

        if (!review || review.businessId !== currentUser.businessId) {
            return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 })
        }

        const updated = await prisma.review.update({
            where: { id: reviewId },
            data: {
                ownerResponse: response,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({ success: true, review: updated })
    } catch (error) {
        console.error('Error responding to review:', error)
        return NextResponse.json({ error: 'Failed to respond to review' }, { status: 500 })
    }
}
