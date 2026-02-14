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
        select: {
            id: true,
            slug: true,
            city: true,
            provinceSlug: true,
            subCategory: {
                include: { category: true }
            },
            analytics: true
        }
    }) as any
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
                profileViews: business.analytics?.profileViews || 0,
                phoneClicks: business.analytics?.phoneClicks || 0,
                websiteClicks: business.analytics?.websiteClicks || 0,
                directionsClicks: business.analytics?.directionsClicks || 0
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

import { supabase } from '@/lib/supabase';

async function saveBusinessFile(file: File | null, folder: string): Promise<{ url: string | null; error: string | null }> {
    if (!file) return { url: null, error: null };

    try {
        console.log('saveBusinessFile called with:', file.name, file.type, file.size);

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const path = `${folder}/${fileName}`;

        console.log('Uploading to Supabase:', path);

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(path, file);

        if (error) {
            console.error('Supabase upload error:', error);
            return { url: null, error: error.message };
        }

        console.log('Upload successful:', data);

        const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(path);

        console.log('Public URL:', publicUrl);
        return { url: publicUrl, error: null };
    } catch (error: any) {
        console.error('Error saving file:', error);
        return { url: null, error: error?.message || 'Unknown error' };
    }
}

export async function updateProfile(formData: FormData, businessId?: string) {
    try {
        console.log('=== updateProfile called ===');

        // Log all form data keys
        console.log('FormData keys:', Array.from(formData.keys()));

        // Log logo file
        const logoFile = formData.get('logo');
        console.log('Logo file in formData:', logoFile ? `File: ${(logoFile as File).name}, size: ${(logoFile as File).size}` : 'null');

        // Log cover file
        const coverFile = formData.get('coverImage');
        console.log('Cover file in formData:', coverFile ? `File: ${(coverFile as File).name}, size: ${(coverFile as File).size}` : 'null');

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
        const province = formData.get('province') as string
        const shortDescription = formData.get('shortDescription') as string
        const instagram = formData.get('instagram') as string
        const facebook = formData.get('facebook') as string
        const linkedin = formData.get('linkedin') as string
        const kvkNumber = formData.get('kvkNumber') as string
        const foundedYear = formData.get('foundedYear') as string
        const serviceArea = formData.get('serviceArea') as string
        const bookingUrl = formData.get('bookingUrl') as string
        const logoAltText = formData.get('logoAltText') as string
        const coverAltText = formData.get('coverAltText') as string

        // Parse JSON fields
        const services = formData.get('services') ? JSON.parse(formData.get('services') as string) : []
        const amenities = formData.get('amenities') ? JSON.parse(formData.get('amenities') as string) : []
        const paymentMethods = formData.get('paymentMethods') ? JSON.parse(formData.get('paymentMethods') as string) : []
        const languages = formData.get('languages') ? JSON.parse(formData.get('languages') as string) : []
        const certifications = formData.get('certifications') ? JSON.parse(formData.get('certifications') as string) : []
        const faq = formData.get('faq') ? JSON.parse(formData.get('faq') as string) : []
        const openingHours = formData.get('openingHours') ? JSON.parse(formData.get('openingHours') as string) : []

        // Handle file uploads
        const uploadedLogoFile = formData.get('logo') as File | null
        const uploadedCoverFile = formData.get('coverImage') as File | null

        let logoUrl = business.logo
        let coverImageUrl = business.coverImage
        let uploadErrors: string[] = []

        if (uploadedLogoFile && uploadedLogoFile.size > 0) {
            console.log('Uploading logo...');
            const logoResult = await saveBusinessFile(uploadedLogoFile, 'logos')
            console.log('Logo upload result:', logoResult);
            if (logoResult.url) {
                logoUrl = logoResult.url
            } else if (logoResult.error) {
                uploadErrors.push(`Logo upload failed: ${logoResult.error}`)
            }
        }

        if (uploadedCoverFile && uploadedCoverFile.size > 0) {
            console.log('Uploading cover...');
            const coverResult = await saveBusinessFile(uploadedCoverFile, 'covers')
            console.log('Cover upload result:', coverResult);
            if (coverResult.url) {
                coverImageUrl = coverResult.url
            } else if (coverResult.error) {
                uploadErrors.push(`Cover upload failed: ${coverResult.error}`)
            }
        }

        if (uploadErrors.length > 0) {
            console.error('Upload errors:', uploadErrors)
            return { success: false, error: uploadErrors.join('; ') }
        }

        console.log('Saving to database - logo:', logoUrl, 'cover:', coverImageUrl);

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
                province,
                shortDescription,
                instagram,
                facebook,
                linkedin,
                kvkNumber,
                foundedYear: foundedYear ? parseInt(foundedYear) : null,
                serviceArea,
                bookingUrl,
                services,
                amenities,
                paymentMethods,
                languages,
                openingHours,
                certifications,
                faq,
                logo: logoUrl,
                logoAltText: logoAltText || null,
                coverImage: coverImageUrl,
                coverAltText: coverAltText || null,
                updatedAt: new Date()
            }
        })

        console.log('Database updated successfully - logo:', logoUrl, 'cover:', coverImageUrl)

        revalidatePath('/dashboard/profile')
        revalidatePath('/dashboard')
        revalidatePath(`/bedrijf/${business.slug}`)
        revalidatePath(`/business/${business.slug}`)
        revalidatePath(`/bedrijven/${business.slug}`)
        revalidatePath(`/nederland`)
        revalidatePath(`/${business.provinceSlug}`)
        revalidatePath(`/${business.provinceSlug}/${business.city}`)

        return { success: true }
    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: `Failed to update profile: ${error}` }
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
                    { label: 'Bedrijfsnaam ingevuld', status: (business.name ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 5 },
                    { label: 'Telefoonnummer toegevoegd', status: (business.phone ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 5 },
                    { label: 'Adres compleet', status: ((business.street && business.city) ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 5 },
                    { label: 'Openingstijden ingesteld', status: (business.openingHours ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 5 }
                ]
            },
            {
                name: 'Content Kwaliteit',
                score: business.shortDescription && business.longDescription ? 100 : business.shortDescription || business.longDescription ? 50 : 0,
                items: [
                    { label: 'Korte beschrijving (160 tekens)', status: (business.shortDescription ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 10 },
                    { label: 'Uitgebreide beschrijving', status: (business.longDescription ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 10 },
                    {
                        label: 'Diensten toegevoegd',
                        status: ((business.services && Array.isArray(business.services) && business.services.length >= 3) ? 'complete' :
                                (business.services && Array.isArray(business.services) && business.services.length > 0) ? 'warning' : 'incomplete') as "complete" | "warning" | "incomplete",
                        points: 5,
                        message: business.services && Array.isArray(business.services) && business.services.length > 0
                            ? `${business.services.length}/3 diensten toegevoegd`
                            : 'Minimaal 3 diensten aanbevolen'
                    },
                    {
                        label: 'FAQ sectie',
                        status: ((business.faq && Array.isArray(business.faq) && business.faq.length >= 5) ? 'complete' :
                                (business.faq && Array.isArray(business.faq) && business.faq.length > 0) ? 'warning' : 'incomplete') as "complete" | "warning" | "incomplete",
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
                    { label: 'Logo geüpload', status: (business.logo ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 10 },
                    { label: 'Cover foto toegevoegd', status: (business.coverImage ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 10 },
                    {
                        label: 'Galerij foto\'s (5+ aanbevolen)',
                        status: ((business.gallery && Array.isArray(business.gallery) && (business.gallery as any[]).length >= 5) ? 'complete' : 'warning') as "complete" | "warning" | "incomplete",
                        points: 5,
                        message: `${((business.gallery as any[])?.length || 0)} van 5 foto's`,
                        actionUrl: '/dashboard/profile',
                        actionLabel: 'Voeg foto\'s toe'
                    },
                    {
                        label: 'Foto alt-teksten',
                        status: ((business.gallery && Array.isArray(business.gallery) && (business.gallery as any[]).length > 0 && (business.gallery as any[]).every((g: any) => g.altText)) ? 'complete' :
                                (business.gallery && Array.isArray(business.gallery) && (business.gallery as any[]).some((g: any) => g.altText)) ? 'warning' : 'incomplete') as "complete" | "warning" | "incomplete",
                        points: 5,
                        message: business.gallery && Array.isArray(business.gallery) && (business.gallery as any[]).length > 0
                            ? `${(business.gallery as any[]).filter((g: any) => g.altText).length}/${(business.gallery as any[]).length} foto\'s hebben alt-tekst`
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
                    { label: 'Minimaal 5 reviews', status: ((business.reviewCount && business.reviewCount >= 5) ? 'complete' : 'warning') as "complete" | "warning" | "incomplete", points: 5, message: `${business.reviewCount} van 5 reviews` },
                    { label: 'Gemiddelde rating 4+', status: ((business.rating && business.rating >= 4) ? 'complete' : 'warning') as "complete" | "warning" | "incomplete", points: 5, message: `Huidige: ${business.rating}` },
                    { label: 'Eigenaar reageert op reviews', status: 'warning' as "complete" | "warning" | "incomplete", points: 5, message: 'Controleer onbeantwoorde reviews' }
                ]
            },
            {
                name: 'Lokale SEO',
                score: (business.city ? 25 : 0) + (business.neighborhood ? 25 : 0) + (business.serviceArea ? 25 : 0) + ((business.street && business.postalCode && business.city) ? 25 : 0),
                items: [
                    { label: 'Stad en wijk ingevuld', status: ((business.city && business.neighborhood) ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 5 },
                    { label: 'Werkgebied gespecificeerd', status: (business.serviceArea ? 'complete' : 'warning') as "complete" | "warning" | "incomplete", points: 5, message: 'Voeg servicegebied toe' },
                    { label: 'Lokale keywords in beschrijving', status: (business.seoLocalText ? 'complete' : 'warning') as "complete" | "warning" | "incomplete", points: 5, message: 'AI heeft lokale tekst gegenereerd' },
                    { label: 'Google Maps integratie', status: ((business.street && business.postalCode && business.city) ? 'complete' : 'incomplete') as "complete" | "warning" | "incomplete", points: 5 }
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
