import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL || process.env.DATABASE_URL
})

// Helper to get business
async function getBusiness(businessId?: string) {
    if (businessId) {
        return await prisma.business.findUnique({
            where: { id: businessId }
        })
    }
    return await prisma.business.findFirst({
        where: { status: 'published' }
    })
}

// PUT - Update gallery with alt-texts
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const businessId = searchParams.get('businessId') || undefined

        const business = await getBusiness(businessId)

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
