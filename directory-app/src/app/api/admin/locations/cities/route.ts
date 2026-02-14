import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
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
