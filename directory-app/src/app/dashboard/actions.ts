'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL || process.env.DATABASE_URL
})

// Helper to get business by ID or return first published
async function getBusiness(businessId?: string) {
    if (businessId) {
        return await prisma.business.findUnique({
            where: { id: businessId },
            include: {
                subCategory: {
                    include: { category: true }
                },
                analytics: true
            }
        })
    }
    return await prisma.business.findFirst({
        where: { status: 'published' },
        include: {
            subCategory: {
                include: { category: true }
            },
            analytics: true
        }
    })
}

export async function getBusinessData(businessId?: string) {
    try {
        const business = await getBusiness(businessId)

        if (!business) {
            return null
        }

        return {
            id: business.id,
            name: business.name,
            slug: business.slug,
            city: business.city,
            category: business.subCategory?.category?.name || '',
            subcategory: business.subCategory?.name || '',
            rating: business.rating,
            reviewCount: business.reviewCount,
            isVerified: business.isVerified,
            status: business.status,
            address: {
                street: business.street,
                postalCode: business.postalCode,
                city: business.city,
                neighborhood: business.neighborhood
            },
            contact: {
                phone: business.phone,
                email: business.email,
                website: business.website,
                instagram: business.instagram,
                facebook: business.facebook
            },
            logo: business.logo,
            coverImage: business.coverImage,
            shortDescription: business.shortDescription,
            longDescription: business.longDescription,
            openingHours: business.openingHours || [],
            amenities: business.amenities || [],
            paymentMethods: business.paymentMethods || [],
            languages: business.languages || [],
            services: business.services || [],
            highlights: business.highlights || [],
            tags: business.tags || [],
            faq: business.faq || [],
            seo: {
                title: business.seoTitle,
                description: business.seoDescription,
                keywords: business.seoKeywords || []
            },
            stats: {
                profileViews: business.analytics?.[0]?.profileViews || 0,
                phoneClicks: business.analytics?.[0]?.phoneClicks || 0,
                websiteClicks: business.analytics?.[0]?.websiteClicks || 0,
                directionsClicks: business.analytics?.[0]?.directionsClicks || 0
            }
        }
    } catch (error) {
        console.error('Error fetching business data:', error)
        return null
    }
}

export async function getReviewsData(businessId?: string) {
    try {
        const business = await getBusiness(businessId)

        if (!business) {
            return null
        }

        const reviews = await prisma.review.findMany({
            where: { businessId: business.id },
            orderBy: { createdAt: 'desc' }
        })

        return {
            reviews: reviews.map(r => ({
                id: r.id,
                author: r.author,
                rating: r.rating,
                content: r.content,
                date: r.createdAt.toISOString(),
                hasResponse: !!r.ownerResponse,
                ownerResponse: r.ownerResponse
            })),
            stats: {
                totalReviews: reviews.length,
                avgRating: reviews.length > 0
                    ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
                    : 0,
                pendingResponses: reviews.filter(r => !r.ownerResponse).length
            }
        }
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return null
    }
}

export async function getAnalyticsData(businessId?: string) {
    try {
        const business = await getBusiness(businessId)

        if (!business) {
            return null
        }

        const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        const lastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)

        const currentAnalytics = await prisma.businessAnalytics.findFirst({
            where: {
                businessId: business.id,
                month: currentMonth
            }
        })

        const lastMonthAnalytics = await prisma.businessAnalytics.findFirst({
            where: {
                businessId: business.id,
                month: lastMonth
            }
        })

        const calculateChange = (current: number, last: number) => {
            if (last === 0) return current > 0 ? 100 : 0
            return Math.round(((current - last) / last) * 100)
        }

        return {
            stats: {
                profileViews: currentAnalytics?.profileViews || 0,
                phoneClicks: currentAnalytics?.phoneClicks || 0,
                websiteClicks: currentAnalytics?.websiteClicks || 0,
                directionsClicks: currentAnalytics?.directionsClicks || 0
            },
            weeklyChange: {
                profileViews: calculateChange(
                    currentAnalytics?.profileViews || 0,
                    lastMonthAnalytics?.profileViews || 0
                ),
                phoneClicks: calculateChange(
                    currentAnalytics?.phoneClicks || 0,
                    lastMonthAnalytics?.phoneClicks || 0
                ),
                websiteClicks: calculateChange(
                    currentAnalytics?.websiteClicks || 0,
                    lastMonthAnalytics?.websiteClicks || 0
                )
            }
        }
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return null
    }
}

export async function updateProfile(formData: FormData, businessId?: string) {
    try {
        const business = await getBusiness(businessId)

        if (!business) {
            return { success: false, error: 'Business not found' }
        }

        const name = formData.get('name') as string
        const phone = formData.get('phone') as string
        const email = formData.get('email') as string
        const website = formData.get('website') as string
        const street = formData.get('street') as string
        const postalCode = formData.get('postalCode') as string
        const city = formData.get('city') as string
        const neighborhood = formData.get('neighborhood') as string
        const shortDescription = formData.get('shortDescription') as string

        await prisma.business.update({
            where: { id: business.id },
            data: {
                name,
                phone,
                email,
                website,
                street,
                postalCode,
                city,
                neighborhood,
                shortDescription,
                updatedAt: new Date()
            }
        })

        revalidatePath('/dashboard/profile')
        revalidatePath('/dashboard')

        return { success: true }
    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}

export async function updateOpeningHours(
    openingHours: Array<{ day: string; open: string; close: string; closed: boolean }>,
    businessId?: string
) {
    try {
        const business = await getBusiness(businessId)

        if (!business) {
            return { success: false, error: 'Business not found' }
        }

        await prisma.business.update({
            where: { id: business.id },
            data: {
                openingHours,
                updatedAt: new Date()
            }
        })

        revalidatePath('/dashboard/profile')

        return { success: true }
    } catch (error) {
        console.error('Error updating opening hours:', error)
        return { success: false, error: 'Failed to update opening hours' }
    }
}

export async function respondToReview(reviewId: string, response: string, businessId?: string) {
    try {
        await prisma.review.update({
            where: { id: reviewId },
            data: {
                ownerResponse: response,
                updatedAt: new Date()
            }
        })

        revalidatePath('/dashboard/reviews')

        return { success: true }
    } catch (error) {
        console.error('Error responding to review:', error)
        return { success: false, error: 'Failed to respond to review' }
    }
}

export async function getSEOScore(businessId?: string) {
    try {
        const business = await getBusiness(businessId)

        if (!business) {
            return null
        }

        // Calculate SEO score based on filled fields
        let score = 0
        let totalPossible = 0

        // Basic info (20 points)
        totalPossible += 20
        if (business.name) score += 5
        if (business.phone) score += 5
        if (business.email) score += 5
        if (business.street && business.postalCode && business.city) score += 5

        // Content (30 points)
        totalPossible += 30
        if (business.shortDescription) score += 10
        if (business.longDescription) score += 10
        if (business.services && Array.isArray(business.services) && business.services.length >= 3) score += 5
        if (business.faq && Array.isArray(business.faq) && business.faq.length >= 5) score += 5

        // Visuals (20 points)
        totalPossible += 20
        if (business.logo) score += 10
        if (business.coverImage) score += 10

        // Social proof (15 points)
        totalPossible += 15
        if (business.reviewCount >= 5) score += 10
        if (business.rating >= 4) score += 5

        // SEO (15 points)
        totalPossible += 15
        if (business.seoTitle) score += 5
        if (business.seoDescription) score += 5
        if (business.seoKeywords && Array.isArray(business.seoKeywords) && business.seoKeywords.length > 0) score += 5

        const categories = [
            {
                name: 'Basis Informatie',
                score: Math.min(score, 20) / 20 * 100,
                items: [
                    { label: 'Bedrijfsnaam ingevuld', status: business.name ? 'complete' : 'incomplete', points: 5 },
                    { label: 'Telefoonnummer toegevoegd', status: business.phone ? 'complete' : 'incomplete', points: 5 },
                    { label: 'Adres compleet', status: (business.street && business.city) ? 'complete' : 'incomplete', points: 5 },
                    { label: 'Openingstijden ingesteld', status: business.openingHours ? 'complete' : 'incomplete', points: 5 }
                ]
            },
            {
                name: 'Content Kwaliteit',
                score: business.shortDescription && business.longDescription ? 100 : business.shortDescription || business.longDescription ? 50 : 0,
                items: [
                    { label: 'Korte beschrijving (160 tekens)', status: business.shortDescription ? 'complete' : 'incomplete', points: 10 },
                    { label: 'Uitgebreide beschrijving', status: business.longDescription ? 'complete' : 'incomplete', points: 10 },
                    {
                        label: 'Diensten toegevoegd',
                        status: (business.services && Array.isArray(business.services) && business.services.length >= 3) ? 'complete' :
                                (business.services && Array.isArray(business.services) && business.services.length > 0) ? 'warning' : 'incomplete',
                        points: 5,
                        message: business.services && Array.isArray(business.services) && business.services.length > 0
                            ? `${business.services.length}/3 diensten toegevoegd`
                            : 'Minimaal 3 diensten aanbevolen'
                    },
                    {
                        label: 'FAQ sectie',
                        status: (business.faq && Array.isArray(business.faq) && business.faq.length >= 5) ? 'complete' :
                                (business.faq && Array.isArray(business.faq) && business.faq.length > 0) ? 'warning' : 'incomplete',
                        points: 5,
                        message: business.faq && Array.isArray(business.faq) && business.faq.length > 0
                            ? `${business.faq.length}/5 vragen beantwoord`
                            : 'Minimaal 5 SEO-vragen vereist'
                    }
                ]
            },
            {
                name: 'Visueel Content',
                score: business.coverImage && business.logo ? 100 : business.coverImage || business.logo ? 50 : 0,
                items: [
                    { label: 'Logo geüpload', status: business.logo ? 'complete' : 'incomplete', points: 10 },
                    { label: 'Cover foto toegevoegd', status: business.coverImage ? 'complete' : 'incomplete', points: 10 },
                    {
                        label: 'Galerij foto\'s (5+ aanbevolen)',
                        status: (business.gallery && Array.isArray(business.gallery) && business.gallery.length >= 5) ? 'complete' : 'warning',
                        points: 5,
                        message: `${(business.gallery?.length || 0)} van 5 foto's`,
                        actionUrl: '/dashboard/profile',
                        actionLabel: 'Voeg foto\'s toe'
                    },
                    {
                        label: 'Foto alt-teksten',
                        status: (business.gallery && Array.isArray(business.gallery) && business.gallery.length > 0 && business.gallery.every((g: any) => g.altText)) ? 'complete' :
                                (business.gallery && Array.isArray(business.gallery) && business.gallery.some((g: any) => g.altText)) ? 'warning' : 'incomplete',
                        points: 5,
                        message: business.gallery && Array.isArray(business.gallery) && business.gallery.length > 0
                            ? `${business.gallery.filter((g: any) => g.altText).length}/${business.gallery.length} foto\'s hebben alt-tekst`
                            : 'Voeg alt-teksten toe aan foto\'s',
                        actionUrl: '/dashboard/profile',
                        actionLabel: 'Voeg alt-teksten toe'
                    }
                ]
            },
            {
                name: 'Social Proof',
                score: business.reviewCount >= 5 ? 100 : business.reviewCount > 0 ? 50 : 0,
                items: [
                    { label: 'Minimaal 5 reviews', status: (business.reviewCount && business.reviewCount >= 5) ? 'complete' : 'warning', points: 5, message: `${business.reviewCount} van 5 reviews` },
                    { label: 'Gemiddelde rating 4+', status: (business.rating && business.rating >= 4) ? 'complete' : 'warning', points: 5, message: `Huidige: ${business.rating}` },
                    { label: 'Eigenaar reageert op reviews', status: 'warning', points: 5, message: 'Controleer onbeantwoorde reviews' }
                ]
            },
            {
                name: 'Lokale SEO',
                score: (business.city ? 25 : 0) + (business.neighborhood ? 25 : 0) + (business.serviceArea ? 25 : 0) + ((business.street && business.postalCode && business.city) ? 25 : 0),
                items: [
                    { label: 'Stad en wijk ingevuld', status: (business.city && business.neighborhood) ? 'complete' : 'incomplete', points: 5 },
                    { label: 'Werkgebied gespecificeerd', status: business.serviceArea ? 'complete' : 'warning', points: 5, message: 'Voeg servicegebied toe' },
                    { label: 'Lokale keywords in beschrijving', status: business.seoLocalText ? 'complete' : 'warning', points: 5, message: 'AI heeft lokale tekst gegenereerd' },
                    { label: 'Google Maps integratie', status: (business.street && business.postalCode && business.city) ? 'complete' : 'incomplete', points: 5 }
                ]
            }
        ]

        return {
            overallScore: score,
            categories
        }
    } catch (error) {
        console.error('Error calculating SEO score:', error)
        return null
    }
}
