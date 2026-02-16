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

// PUT - Update gallery with alt-texts
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
            return NextResponse.json({ error: 'Business not found' }, { status: 404 })
        }

        const body = await request.json()
        const { gallery } = body

        const updated = await prisma.business.update({
            where: { id: business.id },
            data: {
                gallery,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({ success: true, gallery: updated.gallery })
    } catch (error) {
        console.error('Error updating gallery:', error)
        return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 })
    }
}
