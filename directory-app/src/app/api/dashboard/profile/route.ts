import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

// Helper to get authenticated user
async function getAuthenticatedUser() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')

    if (!sessionToken) {
        return null
    }

    return await db.businessOwner.findUnique({
        where: { id: sessionToken.value }
    })
}

export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const currentUser = await getAuthenticatedUser()
        if (!currentUser || !currentUser.businessId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Use user's business ID
        const businessId = currentUser.businessId

        const business = await db.business.findUnique({
            where: { id: businessId }
        });

        if (!business) {
            return NextResponse.json(
                { error: 'Business not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(business);
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const businessId = searchParams.get('businessId');

        if (!businessId) {
            return NextResponse.json(
                { error: 'Missing businessId' },
                { status: 400 }
            );
        }

        const data = await request.json();

        // Update business
        const updated = await db.business.update({
            where: { id: businessId },
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                website: data.website,
                street: data.street,
                postalCode: data.postalCode,
                city: data.city,
                neighborhood: data.neighborhood,
                shortDescription: data.shortDescription,
                openingHours: data.openingHours,
                instagram: data.instagram,
                facebook: data.facebook,
                linkedin: data.linkedin,
            }
        });

        return NextResponse.json({ success: true, business: updated });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
