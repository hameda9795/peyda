import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Simple rate limit: max 30 track events per IP per 60 seconds
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

export async function POST(request: NextRequest) {
    try {
        const { businessId, type, visitorId } = await request.json();

        if (!businessId || !type) {
            return NextResponse.json(
                { error: 'Missing businessId or type' },
                { status: 400 }
            );
        }

        // Validate type
        const validTypes = ['view', 'phone_click', 'whatsapp_click', 'website_click', 'directions_click', 'email_click', 'booking_click'];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { error: 'Invalid interaction type' },
                { status: 400 }
            );
        }

        // Get visitor ID from cookie or generate one
        // The visitorId should be passed from the client (localStorage)
        // or we can use a combination of IP + UserAgent as a fallback
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : realIp || undefined;
        const userAgent = request.headers.get('user-agent') || undefined;
        const referrer = request.headers.get('referer') || undefined;

        // Rate limiting: count recent requests from this IP
        if (ipAddress) {
            const recentCount = await db.businessInteraction.count({
                where: {
                    ipAddress,
                    createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
                },
            });
            if (recentCount >= RATE_LIMIT_MAX) {
                return NextResponse.json(
                    { error: 'Too many requests' },
                    { status: 429 }
                );
            }
        }

        // Use provided visitorId or create a fallback identifier
        const uniqueVisitorId = visitorId || `${ipAddress}-${userAgent?.slice(0, 50)}`;

        // Get current month
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Check if this visitor has already performed this action this month
        // We check the interactions table for existing records
        const existingInteraction = await db.businessInteraction.findFirst({
            where: {
                businessId,
                type,
                createdAt: {
                    gte: monthStart,
                },
                // Note: In production, you'd want to store and check visitorId properly
                // For now, we'll just log all interactions
            },
        });

        // Map interaction types to analytics fields
        const fieldMap: Record<string, string> = {
            'view': 'profileViews',
            'phone_click': 'phoneClicks',
            'whatsapp_click': 'whatsappClicks',
            'website_click': 'websiteClicks',
            'directions_click': 'directionsClicks',
            'email_click': 'emailClicks',
            'booking_click': 'bookingClicks',
        };

        const fieldToIncrement = fieldMap[type];

        // Only create interaction and update analytics (we track all interactions)
        // The unique visitor tracking is handled client-side with localStorage
        await db.businessInteraction.create({
            data: {
                businessId,
                type,
                userAgent,
                ipAddress,
                referrer,
            }
        });

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
