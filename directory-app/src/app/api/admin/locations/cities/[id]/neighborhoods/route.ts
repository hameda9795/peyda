import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await params;

        const neighborhoods = await db.neighborhood.findMany({
            where: { cityId: id },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ neighborhoods });
    } catch (error) {
        console.error('Error fetching neighborhoods:', error);
        return NextResponse.json(
            { error: 'Failed to fetch neighborhoods' },
            { status: 500 }
        );
    }
}
