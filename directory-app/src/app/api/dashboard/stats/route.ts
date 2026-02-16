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

        // Get current month stats
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [currentMonth, lastMonth, business, reviews] = await Promise.all([
            db.businessAnalytics.findUnique({
                where: {
                    businessId_month: {
                        businessId,
                        month: monthStart
                    }
                }
            }),
            db.businessAnalytics.findUnique({
                where: {
                    businessId_month: {
                        businessId,
                        month: lastMonthStart
                    }
                }
            }),
            db.business.findUnique({
                where: { id: businessId },
                select: {
                    name: true,
                    slug: true,
                    city: true,
                    rating: true,
                    reviewCount: true,
                    subCategory: {
                        select: {
                            category: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }),
            db.review.findMany({
                where: {
                    businessId,
                    isPublished: true
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    author: true,
                    rating: true,
                    content: true,
                    ownerResponse: true,
                    createdAt: true
                }
            })
        ]);

        if (!business) {
            return NextResponse.json(
                { error: 'Business not found' },
                { status: 404 }
            );
        }

        // Calculate changes
        const currentStats = {
            profileViews: currentMonth?.profileViews || 0,
            phoneClicks: currentMonth?.phoneClicks || 0,
            websiteClicks: currentMonth?.websiteClicks || 0,
            directionsClicks: currentMonth?.directionsClicks || 0,
            emailClicks: currentMonth?.emailClicks || 0,
            bookingClicks: currentMonth?.bookingClicks || 0,
        };

        const lastStats = {
            profileViews: lastMonth?.profileViews || 0,
            phoneClicks: lastMonth?.phoneClicks || 0,
            websiteClicks: lastMonth?.websiteClicks || 0,
        };

        const calculateChange = (current: number, last: number) => {
            if (last === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - last) / last) * 100);
        };

        const weeklyChange = {
            profileViews: calculateChange(currentStats.profileViews, lastStats.profileViews),
            phoneClicks: calculateChange(currentStats.phoneClicks, lastStats.phoneClicks),
            websiteClicks: calculateChange(currentStats.websiteClicks, lastStats.websiteClicks),
        };

        // Format reviews
        const recentReviews = reviews.map(r => ({
            id: r.id,
            author: r.author,
            rating: r.rating,
            content: r.content,
            date: formatRelativeDate(r.createdAt),
            hasResponse: !!r.ownerResponse
        }));

        // Calculate SEO score (simplified)
        const seoScore = calculateSEOScore(business, currentStats, reviews.length);

        return NextResponse.json({
            name: business.name,
            slug: business.slug,
            city: business.city,
            category: business.subCategory.category.name,
            rating: business.rating,
            reviewCount: business.reviewCount,
            stats: currentStats,
            weeklyChange,
            seoScore,
            recentReviews
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Vandaag';
    if (diffDays === 1) return 'Gisteren';
    if (diffDays < 7) return `${diffDays} dagen geleden`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weken geleden`;
    return `${Math.floor(diffDays / 30)} maanden geleden`;
}

function calculateSEOScore(business: any, stats: any, reviewCount: number): number {
    let score = 0;

    // Base info (40 points)
    score += 40; // Assuming basic info is complete

    // Content quality (20 points)
    score += 10; // Partial

    // Photos (10 points)
    score += 5; // Partial

    // Reviews (20 points)
    if (reviewCount >= 10) score += 20;
    else if (reviewCount >= 5) score += 15;
    else if (reviewCount > 0) score += 10;

    // Engagement (10 points)
    if (stats.profileViews > 100) score += 10;
    else if (stats.profileViews > 50) score += 5;

    return Math.min(score, 100);
}
