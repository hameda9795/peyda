import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ businessId: string }> }
) {
    try {
        const { businessId } = await params;
        const searchParams = request.nextUrl.searchParams;
        const period = searchParams.get('period') || '12'; // months

        const months = parseInt(period);

        // Get date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        // Verify business exists
        const business = await db.business.findUnique({
            where: { id: businessId },
            select: { id: true, name: true, slug: true, city: true },
        });

        if (!business) {
            return NextResponse.json(
                { error: 'Business not found' },
                { status: 404 }
            );
        }

        // Get analytics for this business
        const analytics = await db.businessAnalytics.findMany({
            where: {
                businessId,
                month: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { month: 'asc' },
        });

        // Aggregate by month
        const monthlyData: Record<string, {
            month: string;
            profileViews: number;
            phoneClicks: number;
            whatsappClicks: number;
            websiteClicks: number;
            directionsClicks: number;
            emailClicks: number;
            bookingClicks: number;
        }> = {};

        // Initialize all months
        for (let i = 0; i < months; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toISOString().slice(0, 7);
            monthlyData[monthKey] = {
                month: monthKey,
                profileViews: 0,
                phoneClicks: 0,
                whatsappClicks: 0,
                websiteClicks: 0,
                directionsClicks: 0,
                emailClicks: 0,
                bookingClicks: 0,
            };
        }

        // Fill in data
        analytics.forEach((a) => {
            const monthKey = a.month.toISOString().slice(0, 7);
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].profileViews += a.profileViews;
                monthlyData[monthKey].phoneClicks += a.phoneClicks;
                monthlyData[monthKey].whatsappClicks += a.whatsappClicks;
                monthlyData[monthKey].websiteClicks += a.websiteClicks;
                monthlyData[monthKey].directionsClicks += a.directionsClicks;
                monthlyData[monthKey].emailClicks += a.emailClicks;
                monthlyData[monthKey].bookingClicks += a.bookingClicks;
            }
        });

        // Get totals
        const totals = {
            profileViews: analytics.reduce((sum, a) => sum + a.profileViews, 0),
            phoneClicks: analytics.reduce((sum, a) => sum + a.phoneClicks, 0),
            whatsappClicks: analytics.reduce((sum, a) => sum + a.whatsappClicks, 0),
            websiteClicks: analytics.reduce((sum, a) => sum + a.websiteClicks, 0),
            directionsClicks: analytics.reduce((sum, a) => sum + a.directionsClicks, 0),
            emailClicks: analytics.reduce((sum, a) => sum + a.emailClicks, 0),
            bookingClicks: analytics.reduce((sum, a) => sum + a.bookingClicks, 0),
        };

        // Calculate totals clicks
        const totalClicks =
            totals.phoneClicks +
            totals.whatsappClicks +
            totals.websiteClicks +
            totals.directionsClicks +
            totals.emailClicks +
            totals.bookingClicks;

        // Calculate trends (compare last month to previous month)
        const monthlyArray = Object.values(monthlyData).reverse();
        const lastMonth = monthlyArray[monthlyArray.length - 1];
        const prevMonth = monthlyArray[monthlyArray.length - 2];

        const getTrend = (current: number, previous: number) => {
            if (previous === 0) return null;
            const change = ((current - previous) / previous) * 100;
            return {
                value: parseFloat(change.toFixed(1)),
                isPositive: change >= 0,
            };
        };

        const trend = {
            views: getTrend(lastMonth?.profileViews || 0, prevMonth?.profileViews || 0),
            clicks: getTrend(
                (lastMonth?.phoneClicks || 0) +
                (lastMonth?.whatsappClicks || 0) +
                (lastMonth?.websiteClicks || 0) +
                (lastMonth?.directionsClicks || 0) +
                (lastMonth?.emailClicks || 0) +
                (lastMonth?.bookingClicks || 0),
                (prevMonth?.phoneClicks || 0) +
                (prevMonth?.whatsappClicks || 0) +
                (prevMonth?.websiteClicks || 0) +
                (prevMonth?.directionsClicks || 0) +
                (prevMonth?.emailClicks || 0) +
                (prevMonth?.bookingClicks || 0)
            ),
        };

        return NextResponse.json({
            business: {
                id: business.id,
                name: business.name,
                slug: business.slug,
                city: business.city,
            },
            monthlyData: monthlyArray,
            totals,
            totalClicks,
            conversionRate: totals.profileViews > 0
                ? parseFloat(((totalClicks / totals.profileViews) * 100).toFixed(1))
                : 0,
            trend,
            dateRange: {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
            },
        });
    } catch (error) {
        console.error('Error fetching business analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch business analytics' },
            { status: 500 }
        );
    }
}
