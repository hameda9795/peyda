import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { businessId, type } = await request.json();

        if (!businessId || !type) {
            return NextResponse.json(
                { error: 'Missing businessId or type' },
                { status: 400 }
            );
        }

        // Validate type
        const validTypes = ['view', 'phone_click', 'website_click', 'directions_click', 'email_click', 'booking_click'];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { error: 'Invalid interaction type' },
                { status: 400 }
            );
        }

        // Get metadata from request
        const userAgent = request.headers.get('user-agent') || undefined;
        const referrer = request.headers.get('referer') || undefined;
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : realIp || undefined;

        // Create interaction record
        await db.businessInteraction.create({
            data: {
                businessId,
                type,
                userAgent,
                ipAddress,
                referrer,
            }
        });

        // Update monthly analytics
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Upsert analytics record for this month
        const fieldMap: Record<string, string> = {
            'view': 'profileViews',
            'phone_click': 'phoneClicks',
            'website_click': 'websiteClicks',
            'directions_click': 'directionsClicks',
            'email_click': 'emailClicks',
            'booking_click': 'bookingClicks',
        };

        const fieldToIncrement = fieldMap[type];

        if (fieldToIncrement) {
            await db.businessAnalytics.upsert({
                where: {
                    businessId_month: {
                        businessId,
                        month: monthStart,
                    }
                },
                create: {
                    businessId,
                    month: monthStart,
                    [fieldToIncrement]: 1,
                },
                update: {
                    [fieldToIncrement]: {
                        increment: 1
                    }
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
