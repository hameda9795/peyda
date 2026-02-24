import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const cities = await db.city.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { neighborhoods: true },
                },
            },
        });

        return NextResponse.json({ cities });
    } catch (error) {
        console.error('Error fetching cities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cities' },
            { status: 500 }
        );
    }
}
