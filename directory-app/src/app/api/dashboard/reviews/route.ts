import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL || process.env.DATABASE_URL
})

// Helper to get business by ID
async function getBusiness(businessId?: string) {
    if (businessId) {
        return await prisma.business.findUnique({ where: { id: businessId } })
    }
    return await prisma.business.findFirst({ where: { status: 'published' } })
}

// GET - Fetch reviews for business
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const businessId = searchParams.get('businessId') || undefined

        const business = await getBusiness(businessId)

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
        const body = await request.json()
        const { reviewId, response } = body

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
