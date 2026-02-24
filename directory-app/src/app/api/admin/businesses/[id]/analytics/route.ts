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
        const searchParams = request.nextUrl.searchParams;
        const period = searchParams.get('period') || '12'; // months

        const months = parseInt(period);

        // Get date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        // Get business
        const business = await db.business.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                city: true,
            },
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
                businessId: id,
                month: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { month: 'asc' },
        });

        // Generate all months in range with zero values for missing months
        const monthlyData: Array<{
            month: string;
            profileViews: number;
            phoneClicks: number;
            whatsappClicks: number;
            websiteClicks: number;
            directionsClicks: number;
            emailClicks: number;
            bookingClicks: number;
        }> = [];

        for (let i = 0; i < months; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthKey = monthStart.toISOString().slice(0, 7);

            const existingData = analytics.find(
                (a) => a.month.toISOString().slice(0, 7) === monthKey
            );

            monthlyData.push({
                month: monthKey,
                profileViews: existingData?.profileViews || 0,
                phoneClicks: existingData?.phoneClicks || 0,
                whatsappClicks: existingData?.whatsappClicks || 0,
                websiteClicks: existingData?.websiteClicks || 0,
                directionsClicks: existingData?.directionsClicks || 0,
                emailClicks: existingData?.emailClicks || 0,
                bookingClicks: existingData?.bookingClicks || 0,
            });
        }

        // Calculate totals
        const totals = {
            profileViews: analytics.reduce((sum, a) => sum + a.profileViews, 0),
            phoneClicks: analytics.reduce((sum, a) => sum + a.phoneClicks, 0),
            whatsappClicks: analytics.reduce((sum, a) => sum + a.whatsappClicks, 0),
            websiteClicks: analytics.reduce((sum, a) => sum + a.websiteClicks, 0),
            directionsClicks: analytics.reduce((sum, a) => sum + a.directionsClicks, 0),
            emailClicks: analytics.reduce((sum, a) => sum + a.emailClicks, 0),
            bookingClicks: analytics.reduce((sum, a) => sum + a.bookingClicks, 0),
        };

        // Calculate total contacts (phone + whatsapp + email + booking)
        const totalContacts = totals.phoneClicks + totals.whatsappClicks + totals.emailClicks + totals.bookingClicks;

        // Get last month vs previous month comparison
        const lastMonth = monthlyData[monthlyData.length - 1];
        const prevMonth = monthlyData[monthlyData.length - 2];

        const getTrend = (current: number, previous: number) => {
            if (previous === 0) return null;
            const change = ((current - previous) / previous) * 100;
            return {
                value: change.toFixed(1),
                isPositive: change >= 0,
            };
        };

        const trends = {
            profileViews: getTrend(lastMonth?.profileViews || 0, prevMonth?.profileViews || 0),
            phoneClicks: getTrend(lastMonth?.phoneClicks || 0, prevMonth?.phoneClicks || 0),
            whatsappClicks: getTrend(lastMonth?.whatsappClicks || 0, prevMonth?.whatsappClicks || 0),
            websiteClicks: getTrend(lastMonth?.websiteClicks || 0, prevMonth?.websiteClicks || 0),
            directionsClicks: getTrend(lastMonth?.directionsClicks || 0, prevMonth?.directionsClicks || 0),
        };

        return NextResponse.json({
            business,
            monthlyData: monthlyData.reverse(),
            totals,
            totalContacts,
            trends,
        });
    } catch (error) {
        console.error('Error fetching business analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
