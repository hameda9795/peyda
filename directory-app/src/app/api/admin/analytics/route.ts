import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const period = searchParams.get('period') || '12'; // months

        const months = parseInt(period);

        // Get date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        // Get all analytics aggregated by month
        const analytics = await db.businessAnalytics.findMany({
            where: {
                month: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { month: 'asc' },
            include: {
                business: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        city: true,
                    },
                },
            },
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
            uniqueVisitors: number;
        }> = {};

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
                uniqueVisitors: 0,
            };
        }

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

        // Get top businesses by views (from current analytics)
        const topBusinesses = await db.business.findMany({
            include: {
                analytics: true,
            },
            take: 50,
        });

        const topBusinessesWithViews = topBusinesses
            .map((b) => ({
                id: b.id,
                name: b.name,
                slug: b.slug,
                city: b.city,
                totalViews: b.analytics?.reduce((sum, a) => sum + (a.profileViews || 0), 0) || 0,
            }))
            .sort((a, b) => b.totalViews - a.totalViews)
            .slice(0, 10);

        // Get business counts by status
        const [pendingCount, approvedCount, rejectedCount, draftCount, totalBusinesses] = await Promise.all([
            db.business.count({ where: { status: 'pending' } }),
            db.business.count({ where: { status: 'approved' } }),
            db.business.count({ where: { status: 'rejected' } }),
            db.business.count({ where: { status: 'draft' } }),
            db.business.count(),
        ]);

        return NextResponse.json({
            monthlyData: Object.values(monthlyData).reverse(),
            totals,
            topBusinesses: topBusinessesWithViews,
            businessStats: {
                total: totalBusinesses,
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount,
                draft: draftCount,
            },
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
