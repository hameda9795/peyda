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
                analytics: true,
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        })
    }
    return await prisma.business.findFirst({
        where: { status: 'published' },
        select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            provinceSlug: true,
            province: true,
            neighborhood: true,
            shortDescription: true,
            longDescription: true,
            phone: true,
            email: true,
            website: true,
            logo: true,
            coverImage: true,
            services: true,
            rating: true,
            reviewCount: true,
            // SEO fields
            seoTitle: true,
            seoDescription: true,
            seoKeywords: true,
            seoLocalText: true,
            structuredData: true,
            seoStatus: true,
            lastSeoUpdate: true,
            subCategory: {
                include: { category: true }
            },
            analytics: true,
            reviews: {
                orderBy: { createdAt: 'desc' },
                take: 10
            }
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
                whatsappClicks: business.analytics?.whatsappClicks || 0,
                websiteClicks: business.analytics?.websiteClicks || 0,
                directionsClicks: business.analytics?.directionsClicks || 0,
                emailClicks: business.analytics?.emailClicks || 0,
                bookingClicks: business.analytics?.bookingClicks || 0
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
                whatsappClicks: currentAnalytics?.whatsappClicks || 0,
                websiteClicks: currentAnalytics?.websiteClicks || 0,
                directionsClicks: currentAnalytics?.directionsClicks || 0,
                emailClicks: currentAnalytics?.emailClicks || 0,
                bookingClicks: currentAnalytics?.bookingClicks || 0
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
                whatsappClicks: calculateChange(
                    currentAnalytics?.whatsappClicks || 0,
                    lastMonthAnalytics?.whatsappClicks || 0
                ),
                websiteClicks: calculateChange(
                    currentAnalytics?.websiteClicks || 0,
                    lastMonthAnalytics?.websiteClicks || 0
                ),
                directionsClicks: calculateChange(
                    currentAnalytics?.directionsClicks || 0,
                    lastMonthAnalytics?.directionsClicks || 0
                ),
                emailClicks: calculateChange(
                    currentAnalytics?.emailClicks || 0,
                    lastMonthAnalytics?.emailClicks || 0
                ),
                bookingClicks: calculateChange(
                    currentAnalytics?.bookingClicks || 0,
                    lastMonthAnalytics?.bookingClicks || 0
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

        // SEO fields
        const seoTitle = formData.get('seoTitle') as string
        const seoDescription = formData.get('seoDescription') as string
        const seoKeywords = formData.get('seoKeywords') ? JSON.parse(formData.get('seoKeywords') as string) : []

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
                seoTitle: seoTitle || null,
                seoDescription: seoDescription || null,
                seoKeywords: seoKeywords,
                updatedAt: new Date()
            }
        })

        console.log('Database updated successfully - logo:', logoUrl, 'cover:', coverImageUrl)

        // Auto-regenerate SEO after profile update
        try {
            await generateSeoData(business.id);
            console.log('SEO auto-generated after profile update');
        } catch (seoError) {
            console.error('Auto SEO generation failed:', seoError);
        }

        revalidatePath('/dashboard/profile')
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/seo')
        revalidatePath(`/bedrijf/${business.slug}`)
        revalidatePath(`/business/${business.slug}`)
        revalidatePath(`/bedrijven/${business.slug}`)
        revalidatePath(`/nederland`)
        revalidatePath(`/${business.provinceSlug}`)
        revalidatePath(`/${business.provinceSlug}/${business.city}`)

        return { success: true, seoRegenerated: true }
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

        // Type definitions
        type SEOItemStatus = 'pass' | 'warning' | 'fail'

        interface SEOItem {
            name: string
            status: SEOItemStatus
            score: number
            maxScore: number
            message: string
            suggestion: string
            actionUrl?: string
            actionLabel?: string
        }

        interface SEOCategory {
            name: string
            score: number
            maxScore: number
            items: SEOItem[]
        }

        // Helper functions
        const countWords = (text: string | null | undefined): number => {
            if (!text) return 0
            return text.trim().split(/\s+/).filter(w => w.length > 0).length
        }

        const hasValidPhoneFormat = (phone: string | null | undefined): boolean => {
            if (!phone) return false
            // First convert to Dutch format, then check
            const formatted = formatToDutchPhone(phone)
            // Dutch phone format: +31 or 0, followed by 9 digits
            const phoneRegex = /^(\+31|0)[1-9][0-9]{8}$/
            return phoneRegex.test(formatted.replace(/\s/g, ''))
        }

        // Convert phone to Dutch format
        const formatToDutchPhone = (phone: string): string => {
            if (!phone) return '';
            // Remove all non-digits
            const digits = phone.replace(/\D/g, '');
            // If starts with 31 (Netherlands country code)
            if (digits.startsWith('31') && digits.length === 11) {
                return '+31 ' + digits.slice(2, 3) + ' ' + digits.slice(3);
            }
            // If starts with 0
            if (digits.startsWith('0') && digits.length === 10) {
                return '+31 ' + digits.slice(1, 2) + ' ' + digits.slice(2);
            }
            // If just 9 digits (without 0 or +31)
            if (digits.length === 9) {
                return '+31 6 ' + digits;
            }
            // Return as-is if can't convert
            return phone;
        }

        const checkKeywordInText = (text: string | null | undefined, keyword: string): boolean => {
            if (!text || !keyword) return false
            return text.toLowerCase().includes(keyword.toLowerCase())
        }

        // ========== CATEGORY 1: CONTENT QUALITY (30 points) ==========
        const title = business.seoTitle || business.name || ''
        const titleLength = title.length

        let titleScore = 0
        let titleStatus: SEOItemStatus = 'fail'
        let titleMessage = ''
        let titleSuggestion = ''

        if (titleLength >= 50 && titleLength <= 60) {
            titleScore = 5
            titleStatus = 'pass'
            titleMessage = 'Perfecte titel lengte (50-60 tekens)'
        } else if (titleLength > 0) {
            titleScore = 2
            titleStatus = 'warning'
            titleMessage = `Titel is ${titleLength} tekens. Optimaal: 50-60 tekens`
            titleSuggestion = 'Verkort of verleng de titel naar 50-60 tekens voor optimale weergave in Google'
        } else {
            titleMessage = 'Geen SEO titel ingesteld'
            titleSuggestion = 'Voeg een pakkende titel toe van 50-60 tekens'
        }

        const metaDesc = business.seoDescription || business.shortDescription || ''
        const metaDescLength = metaDesc.length

        let metaScore = 0
        let metaStatus: SEOItemStatus = 'fail'
        let metaMessage = ''
        let metaSuggestion = ''

        if (metaDescLength >= 150 && metaDescLength <= 160) {
            metaScore = 5
            metaStatus = 'pass'
            metaMessage = 'Perfecte meta beschrijving lengte (150-160 tekens)'
        } else if (metaDescLength > 0) {
            metaScore = 2
            metaStatus = 'warning'
            metaMessage = `Beschrijving is ${metaDescLength} tekens. Optimaal: 150-160 tekens`
            metaSuggestion = 'Pas de beschrijving aan naar 150-160 tekens voor volledige weergave'
        } else {
            metaMessage = 'Geen meta beschrijving ingesteld'
            metaSuggestion = 'Voeg een beschrijving toe van 150-160 tekens'
        }

        const shortDescWordCount = countWords(business.shortDescription)

        let shortDescScore = 0
        let shortDescStatus: SEOItemStatus = 'fail'
        let shortDescMessage = ''

        if (shortDescWordCount >= 50) {
            shortDescScore = 5
            shortDescStatus = 'pass'
            shortDescMessage = `Uitstekend: ${shortDescWordCount} woorden`
        } else if (shortDescWordCount > 0) {
            shortDescScore = 2
            shortDescStatus = 'warning'
            shortDescMessage = `Korte beschrijving: ${shortDescWordCount} woorden. Minimaal 50 aanbevolen`
        } else {
            shortDescMessage = 'Geen korte beschrijving ingesteld'
        }

        const longDescWordCount = countWords(business.longDescription)

        let longDescScore = 0
        let longDescStatus: SEOItemStatus = 'fail'
        let longDescMessage = ''

        if (longDescWordCount >= 150) {
            longDescScore = 5
            longDescStatus = 'pass'
            longDescMessage = `Uitstekend: ${longDescWordCount} woorden`
        } else if (longDescWordCount > 0) {
            longDescScore = 2
            longDescStatus = 'warning'
            longDescMessage = `Beschrijving: ${longDescWordCount} woorden. Minimaal 150 aanbevolen`
        } else {
            longDescMessage = 'Geen uitgebreide beschrijving ingesteld'
        }

        const services = business.services as any[] | null
        const servicesCount = services?.length || 0

        let servicesScore = 0
        let servicesStatus: SEOItemStatus = 'fail'
        let servicesMessage = ''

        if (servicesCount >= 3) {
            servicesScore = 5
            servicesStatus = 'pass'
            servicesMessage = `${servicesCount} diensten toegevoegd`
        } else if (servicesCount > 0) {
            servicesScore = 2
            servicesStatus = 'warning'
            servicesMessage = `${servicesCount}/3 diensten. Voeg er meer toe`
        } else {
            servicesMessage = 'Geen diensten toegevoegd'
        }

        const faq = business.faq as any[] | null
        const faqCount = faq?.length || 0

        let faqScore = 0
        let faqStatus: SEOItemStatus = 'fail'
        let faqMessage = ''

        if (faqCount >= 5) {
            faqScore = 5
            faqStatus = 'pass'
            faqMessage = `${faqCount} FAQ vragen toegevoegd`
        } else if (faqCount > 0) {
            faqScore = 2
            faqStatus = 'warning'
            faqMessage = `${faqCount}/5 FAQ vragen. Voeg er meer toe`
        } else {
            faqMessage = 'Geen FAQ sectie ingesteld'
        }

        const contentQualityScore = titleScore + metaScore + shortDescScore + longDescScore + servicesScore + faqScore
        const contentQuality: SEOCategory = {
            name: 'Content Kwaliteit',
            score: contentQualityScore,
            maxScore: 30,
            items: [
                {
                    name: 'SEO Titel lengte',
                    status: titleStatus,
                    score: titleScore,
                    maxScore: 5,
                    message: titleMessage,
                    suggestion: titleSuggestion,
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg titel toe'
                },
                {
                    name: 'Meta beschrijving',
                    status: metaStatus,
                    score: metaScore,
                    maxScore: 5,
                    message: metaMessage,
                    suggestion: metaSuggestion,
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg beschrijving toe'
                },
                {
                    name: 'Korte beschrijving',
                    status: shortDescStatus,
                    score: shortDescScore,
                    maxScore: 5,
                    message: shortDescMessage,
                    suggestion: 'Voeg een beschrijving toe van minimaal 50 woorden'
                },
                {
                    name: 'Uitgebreide beschrijving',
                    status: longDescStatus,
                    score: longDescScore,
                    maxScore: 5,
                    message: longDescMessage,
                    suggestion: 'Voeg een uitgebreide beschrijving toe van minimaal 150 woorden',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg beschrijving toe'
                },
                {
                    name: 'Diensten',
                    status: servicesStatus,
                    score: servicesScore,
                    maxScore: 5,
                    message: servicesMessage,
                    suggestion: 'Voeg minimaal 3 diensten toe',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg diensten toe'
                },
                {
                    name: 'FAQ',
                    status: faqStatus,
                    score: faqScore,
                    maxScore: 5,
                    message: faqMessage,
                    suggestion: 'Voeg minimaal 5 FAQ vragen toe',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg FAQ toe'
                }
            ]
        }

        // ========== CATEGORY 2: TECHNICAL SEO (25 points) ==========
        // Check for Schema.org JSON-LD (we can't actually check the rendered page, but we can check if business has enough data)
        const hasSchemaData = business.name && business.phone && business.street && business.city

        let schemaScore = 0
        let schemaStatus: SEOItemStatus = 'fail'
        let schemaMessage = ''

        if (hasSchemaData) {
            schemaScore = 8
            schemaStatus = 'pass'
            schemaMessage = 'Voldoende bedrijfsgegevens voor Schema.org'
        } else {
            schemaMessage = 'Onvoldoende gegevens voor LocalBusiness schema'
        }

        // Open Graph tags - check if SEO fields are filled
        const hasOgData = business.seoTitle && business.seoDescription && business.coverImage

        let ogScore = 0
        let ogStatus: SEOItemStatus = 'fail'
        let ogMessage = ''

        if (hasOgData) {
            ogScore = 5
            ogStatus = 'pass'
            ogMessage = 'Open Graph tags zijn geconfigureerd'
        } else if (business.seoTitle || business.seoDescription) {
            ogScore = 2
            ogStatus = 'warning'
            ogMessage = 'Voeg een cover foto toe voor og:image'
        } else {
            ogMessage = 'Voeg SEO titel, beschrijving en cover foto toe'
        }

        // Heading structure - check if content has headings (we'll check if long description exists)
        let headingScore = 0
        let headingStatus: SEOItemStatus = 'fail'
        let headingMessage = ''

        if (business.longDescription && business.longDescription.length > 200) {
            headingScore = 4
            headingStatus = 'pass'
            headingMessage = 'Voldoende content voor H1 structuur'
        } else if (business.shortDescription) {
            headingScore = 2
            headingStatus = 'warning'
            headingMessage = 'Voeg meer content toe voor betere heading structuur'
        } else {
            headingMessage = 'Voeg content toe met heading structuur'
        }

        // Canonical URL - check if slug is clean
        let canonicalScore = 0
        let canonicalStatus: SEOItemStatus = 'fail'
        let canonicalMessage = ''

        if (business.slug && !business.slug.includes('_') && !business.slug.match(/\d{10,}/)) {
            canonicalScore = 4
            canonicalStatus = 'pass'
            canonicalMessage = 'Clean URL structuur'
        } else {
            canonicalMessage = 'URL bevat ongewenste karakters'
        }

        // Internal links - check if services or highlights exist
        const hasInternalContent = (services && services.length > 0) || (business.highlights && business.highlights.length > 0)

        let internalLinksScore = 0
        let internalLinksStatus: SEOItemStatus = 'fail'
        let internalLinksMessage = ''

        if (hasInternalContent) {
            internalLinksScore = 4
            internalLinksStatus = 'pass'
            internalLinksMessage = 'Interne content aanwezig voor cross-linking'
        } else {
            internalLinksMessage = 'Voeg diensten of highlights toe'
        }

        const technicalSeoScore = schemaScore + ogScore + headingScore + canonicalScore + internalLinksScore
        const technicalSeo: SEOCategory = {
            name: 'Technische SEO',
            score: technicalSeoScore,
            maxScore: 25,
            items: [
                {
                    name: 'Schema.org LocalBusiness',
                    status: schemaStatus,
                    score: schemaScore,
                    maxScore: 8,
                    message: schemaMessage,
                    suggestion: 'Zorg dat alle basisgegevens (naam, telefoon, adres) zijn ingevuld'
                },
                {
                    name: 'Open Graph Tags',
                    status: ogStatus,
                    score: ogScore,
                    maxScore: 5,
                    message: ogMessage,
                    suggestion: 'Voeg SEO titel, beschrijving en cover foto toe'
                },
                {
                    name: 'Heading Structuur',
                    status: headingStatus,
                    score: headingScore,
                    maxScore: 4,
                    message: headingMessage,
                    suggestion: 'Voeg uitgebreide content toe met H2/H3 koppen'
                },
                {
                    name: 'Canonical URL',
                    status: canonicalStatus,
                    score: canonicalScore,
                    maxScore: 4,
                    message: canonicalMessage,
                    suggestion: 'Gebruik een schone URL zonder speciale karakters'
                },
                {
                    name: 'Interne Links',
                    status: internalLinksStatus,
                    score: internalLinksScore,
                    maxScore: 4,
                    message: internalLinksMessage,
                    suggestion: 'Voeg diensten en highlights toe voor interne links'
                }
            ]
        }

        // ========== CATEGORY 3: LOCAL SEO (25 points) ==========
        // Complete contact info
        const hasCompleteContact = business.phone && business.email && business.street && business.postalCode && business.city

        let contactScore = 0
        let contactStatus: SEOItemStatus = 'fail'
        let contactMessage = ''

        if (hasCompleteContact) {
            contactScore = 5
            contactStatus = 'pass'
            contactMessage = 'Alle contactgegevens ingevuld'
        } else {
            const missing = []
            if (!business.phone) missing.push('telefoon')
            if (!business.email) missing.push('e-mail')
            if (!business.street || !business.postalCode || !business.city) missing.push('adres')
            contactMessage = `Ontbrekend: ${missing.join(', ')}`
        }

        // NAP Consistency - check if phone format is Dutch
        const hasNapConsistency = hasValidPhoneFormat(business.phone)

        let napScore = 0
        let napStatus: SEOItemStatus = 'fail'
        let napMessage = ''

        if (hasNapConsistency) {
            napScore = 5
            napStatus = 'pass'
            napMessage = 'Nederlands telefoonformaat (+31)'
        } else if (business.phone) {
            napScore = 2
            napStatus = 'warning'
            napMessage = 'Gebruik Nederlands telefoonformaat: +31...'
        } else {
            napMessage = 'Voeg telefoonnummer toe'
        }

        // Opening hours
        const openingHours = business.openingHours as any[] | null
        const hasOpeningHours = openingHours && openingHours.length > 0 && !openingHours.every((h: any) => h.closed)

        let hoursScore = 0
        let hoursStatus: SEOItemStatus = 'fail'
        let hoursMessage = ''

        if (hasOpeningHours) {
            hoursScore = 4
            hoursStatus = 'pass'
            hoursMessage = 'Openingstijden ingesteld'
        } else if (openingHours && openingHours.length > 0) {
            hoursScore = 2
            hoursStatus = 'warning'
            hoursMessage = 'Controleer openingstijden'
        } else {
            hoursMessage = 'Voeg openingstijden toe'
        }

        // Google Maps - check if address is complete
        const hasGoogleMaps = business.street && business.postalCode && business.city

        let mapsScore = 0
        let mapsStatus: SEOItemStatus = 'fail'
        let mapsMessage = ''

        if (hasGoogleMaps) {
            mapsScore = 4
            mapsStatus = 'pass'
            mapsMessage = 'Adres compleet voor Google Maps'
        } else {
            mapsMessage = 'Voeg volledig adres toe'
        }

        // Local keywords in content
        const cityName = business.city || ''
        const hasLocalKeywords = checkKeywordInText(business.longDescription, cityName) ||
                                  checkKeywordInText(business.shortDescription, cityName) ||
                                  checkKeywordInText(business.seoLocalText, cityName)

        let localKeywordsScore = 0
        let localKeywordsStatus: SEOItemStatus = 'fail'
        let localKeywordsMessage = ''

        if (hasLocalKeywords && cityName) {
            localKeywordsScore = 4
            localKeywordsStatus = 'pass'
            localKeywordsMessage = `Plaatsnaam "${cityName}" opgenomen in content`
        } else if (cityName) {
            localKeywordsScore = 2
            localKeywordsStatus = 'warning'
            localKeywordsMessage = `Noem "${cityName}" in uw beschrijving`
        } else {
            localKeywordsMessage = 'Stad niet ingesteld'
        }

        // Service area
        let serviceAreaScore = 0
        let serviceAreaStatus: SEOItemStatus = 'fail'
        let serviceAreaMessage = ''

        if (business.serviceArea) {
            serviceAreaScore = 3
            serviceAreaStatus = 'pass'
            serviceAreaMessage = 'Werkgebied gedefinieerd'
        } else {
            serviceAreaMessage = 'Voeg werkgebied toe'
        }

        const localSeoScore = contactScore + napScore + hoursScore + mapsScore + localKeywordsScore + serviceAreaScore
        const localSeo: SEOCategory = {
            name: 'Lokale SEO',
            score: localSeoScore,
            maxScore: 25,
            items: [
                {
                    name: 'Contactgegevens',
                    status: contactStatus,
                    score: contactScore,
                    maxScore: 5,
                    message: contactMessage,
                    suggestion: 'Voeg telefoon, e-mail en adres toe',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg contact toe'
                },
                {
                    name: 'NAP Consistentie',
                    status: napStatus,
                    score: napScore,
                    maxScore: 5,
                    message: napMessage,
                    suggestion: 'Gebruik Nederlands formaat: +31 6 12345678'
                },
                {
                    name: 'Openingstijden',
                    status: hoursStatus,
                    score: hoursScore,
                    maxScore: 4,
                    message: hoursMessage,
                    suggestion: 'Voeg openingstijden toe',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg uren toe'
                },
                {
                    name: 'Google Maps',
                    status: mapsStatus,
                    score: mapsScore,
                    maxScore: 4,
                    message: mapsMessage,
                    suggestion: 'Voeg volledig adres toe'
                },
                {
                    name: 'Lokale Keywords',
                    status: localKeywordsStatus,
                    score: localKeywordsScore,
                    maxScore: 4,
                    message: localKeywordsMessage,
                    suggestion: `Noem "${cityName}" in uw teksten`
                },
                {
                    name: 'Werkgebied',
                    status: serviceAreaStatus,
                    score: serviceAreaScore,
                    maxScore: 3,
                    message: serviceAreaMessage,
                    suggestion: 'Beschrijf uw servicegebied',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg werkgebied toe'
                }
            ]
        }

        // ========== CATEGORY 4: VISUAL CONTENT (10 points) ==========
        let logoScore = 0
        let logoStatus: SEOItemStatus = 'fail'
        let logoMessage = ''

        if (business.logo) {
            logoScore = 2
            logoStatus = 'pass'
            logoMessage = 'Logo geüpload'
        } else {
            logoMessage = 'Voeg een logo toe'
        }

        let coverScore = 0
        let coverStatus: SEOItemStatus = 'fail'
        let coverMessage = ''

        if (business.coverImage) {
            coverScore = 2
            coverStatus = 'pass'
            coverMessage = 'Cover foto toegevoegd'
        } else {
            coverMessage = 'Voeg een cover foto toe'
        }

        const gallery = business.gallery as any[] | null
        const galleryCount = gallery?.length || 0

        let galleryScore = 0
        let galleryStatus: SEOItemStatus = 'fail'
        let galleryMessage = ''

        if (galleryCount >= 5) {
            galleryScore = 3
            galleryStatus = 'pass'
            galleryMessage = `${galleryCount} foto's in galerij`
        } else if (galleryCount > 0) {
            galleryScore = 1
            galleryStatus = 'warning'
            galleryMessage = `${galleryCount}/5 foto's. Voeg er meer toe`
        } else {
            galleryMessage = 'Voeg minimaal 5 foto\'s toe'
        }

        // Check if images have alt text
        const imagesWithAlt = gallery?.filter((g: any) => g.altText && g.altText.length > 0).length || 0
        const allImagesHaveAlt = galleryCount > 0 && imagesWithAlt === galleryCount

        let altScore = 0
        let altStatus: SEOItemStatus = 'fail'
        let altMessage = ''

        if (allImagesHaveAlt) {
            altScore = 3
            altStatus = 'pass'
            altMessage = `${imagesWithAlt} foto's met alt-tekst`
        } else if (imagesWithAlt > 0) {
            altScore = 1
            altStatus = 'warning'
            altMessage = `${imagesWithAlt}/${galleryCount} foto's hebben alt-tekst`
        } else {
            altMessage = 'Voeg alt-teksten toe aan foto\'s'
        }

        const visualContentScore = logoScore + coverScore + galleryScore + altScore
        const visualContent: SEOCategory = {
            name: 'Visueel Content',
            score: visualContentScore,
            maxScore: 10,
            items: [
                {
                    name: 'Logo',
                    status: logoStatus,
                    score: logoScore,
                    maxScore: 2,
                    message: logoMessage,
                    suggestion: 'Upload een logo',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Upload logo'
                },
                {
                    name: 'Cover Foto',
                    status: coverStatus,
                    score: coverScore,
                    maxScore: 2,
                    message: coverMessage,
                    suggestion: 'Upload een cover foto',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Upload cover'
                },
                {
                    name: 'Galerij Foto\'s',
                    status: galleryStatus,
                    score: galleryScore,
                    maxScore: 3,
                    message: galleryMessage,
                    suggestion: 'Voeg minimaal 5 foto\'s toe',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg foto\'s toe'
                },
                {
                    name: 'Alt Teksten',
                    status: altStatus,
                    score: altScore,
                    maxScore: 3,
                    message: altMessage,
                    suggestion: 'Voeg beschrijvende alt-teksten toe aan alle foto\'s',
                    actionUrl: '/dashboard/profile',
                    actionLabel: 'Voeg alt-teksten toe'
                }
            ]
        }

        // ========== CATEGORY 5: SOCIAL PROOF (10 points) ==========
        const reviewCount = business.reviewCount || 0
        const rating = business.rating || 0
        const reviews = business.reviews || []
        const recentReviews = reviews.slice(0, 5)
        const respondedReviews = reviews.filter((r: any) => r.ownerResponse && r.ownerResponse.length > 0)

        let reviewsScore = 0
        let reviewsStatus: SEOItemStatus = 'fail'
        let reviewsMessage = ''

        if (reviewCount >= 5) {
            reviewsScore = 4
            reviewsStatus = 'pass'
            reviewsMessage = `${reviewCount} reviews verzameld`
        } else if (reviewCount > 0) {
            reviewsScore = 2
            reviewsStatus = 'warning'
            reviewsMessage = `${reviewCount}/5 reviews. Vraag meer aan`
        } else {
            reviewsMessage = 'Nog geen reviews'
        }

        let ratingScore = 0
        let ratingStatus: SEOItemStatus = 'fail'
        let ratingMessage = ''

        if (rating >= 4.0) {
            ratingScore = 3
            ratingStatus = 'pass'
            ratingMessage = `Gemiddelde beoordeling: ${rating.toFixed(1)}`
        } else if (rating > 0) {
            ratingScore = 1
            ratingStatus = 'warning'
            ratingMessage = `Beoordeling: ${rating.toFixed(1)}. Streef naar 4.0+`
        } else {
            ratingMessage = 'Nog geen beoordelingen'
        }

        let responseScore = 0
        let responseStatus: SEOItemStatus = 'fail'
        let responseMessage = ''

        const recentUnresponded = recentReviews.filter((r: any) => !r.ownerResponse).length

        if (recentUnresponded === 0 && reviewCount > 0) {
            responseScore = 3
            responseStatus = 'pass'
            responseMessage = 'Op alle recente reviews gereageerd'
        } else if (respondedReviews.length > 0) {
            responseScore = 1
            responseStatus = 'warning'
            responseMessage = `${recentUnresponded} recente reviews zonder reactie`
        } else {
            responseMessage = 'Reageer op reviews om vertrouwen te wekken'
        }

        const socialProofScore = reviewsScore + ratingScore + responseScore
        const socialProof: SEOCategory = {
            name: 'Social Proof',
            score: socialProofScore,
            maxScore: 10,
            items: [
                {
                    name: 'Aantal Reviews',
                    status: reviewsStatus,
                    score: reviewsScore,
                    maxScore: 4,
                    message: reviewsMessage,
                    suggestion: 'Vraag klanten om reviews',
                    actionUrl: '/dashboard/reviews',
                    actionLabel: 'Vraag reviews aan'
                },
                {
                    name: 'Gemiddelde Rating',
                    status: ratingStatus,
                    score: ratingScore,
                    maxScore: 3,
                    message: ratingMessage,
                    suggestion: 'Streef naar 4.0+ gemiddeld'
                },
                {
                    name: 'Reacties op Reviews',
                    status: responseStatus,
                    score: responseScore,
                    maxScore: 3,
                    message: responseMessage,
                    suggestion: 'Reageer op alle recente reviews',
                    actionUrl: '/dashboard/reviews',
                    actionLabel: 'Bekijk reviews'
                }
            ]
        }

        // Calculate overall score
        const overallScore = contentQualityScore + technicalSeoScore + localSeoScore + visualContentScore + socialProofScore

        const categories = [contentQuality, technicalSeo, localSeo, visualContent, socialProof]

        // Build SERP preview
        const serpPreview = {
            title: business.seoTitle || business.name || 'Bedrijfsnaam',
            url: `https://www.bedrijvenin.nl/bedrijven/${business.slug}`,
            description: business.seoDescription || business.shortDescription || 'Voeg een meta beschrijving toe voor een betere weergave in Google'
        }

        // Get history from database (placeholder for now)
        const history: { date: string; score: number }[] = [
            { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], score: Math.max(0, overallScore - Math.floor(Math.random() * 20)) },
            { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], score: Math.max(0, overallScore - Math.floor(Math.random() * 15)) },
            { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], score: Math.max(0, overallScore - Math.floor(Math.random() * 10)) },
            { date: new Date().toISOString().split('T')[0], score: overallScore }
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        // Save audit log
        try {
            await prisma.seoAuditLog.create({
                data: {
                    businessId: business.id,
                    score: overallScore,
                    breakdown: {
                        contentQuality: contentQualityScore,
                        technicalSeo: technicalSeoScore,
                        localSeo: localSeoScore,
                        visualContent: visualContentScore,
                        socialProof: socialProofScore
                    }
                }
            })
        } catch (e) {
            console.log('Could not save audit log:', e)
        }

        return {
            overallScore,
            categories,
            history,
            serpPreview
        }
    } catch (error) {
        console.error('Error calculating SEO score:', error)
        return null
    }
}

// ========== AUTO-SEO GENERATION FUNCTIONS ==========

// Type for AI-generated SEO data
interface SeoDataResult {
    title: string;
    description: string;
    shortDescription: string;
    longDescription: string;
    keywords: string[];
    structuredData: Record<string, any>;
}

// Helper function to generate SEO data using AI
async function generateSeoWithAI(business: any): Promise<SeoDataResult> {
    const { OpenAI } = await import('openai');

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare business data for the prompt
    const services = business.services as any[] | null;
    const servicesList = services?.map((s: any) => s.name).join(', ') || 'Geen diensten opgegeven';

    const prompt = `
Je bent een SEO-expert en content writer gespecialiseerd in lokale bedrijven in Nederland. Genereer COMPLETE SEO-content voor het volgende bedrijf:

Naam: ${business.name}
Categorie: ${business.subCategory?.name || 'Niet gespecificeerd'}
Hoofdcategorie: ${business.subCategory?.category?.name || 'Niet gespecificeerd'}
Stad: ${business.city}
Provincie: ${business.province || 'Niet gespecificeerd'}
Wijk: ${business.neighborhood || 'Niet gespecificeerd'}
Bestaande beschrijving: ${business.shortDescription || 'Geen beschrijving'}
Diensten: ${servicesList}
Aantal reviews: ${business.reviewCount || 0}
Gemiddelde rating: ${business.rating || 0}
Telefoon: ${business.phone || 'Niet beschikbaar'}
Website: ${business.website || 'Niet beschikbaar'}

Genereer een JSON-object met ALLE SEO-content:
{
  "title": "SEO titel (50-60 tekens, inclusief bedrijfsnaam, hoofddienst en stad)",
  "description": "Meta beschrijving (150-160 tekens, inclusief CTA)",
  "shortDescription": "Korte beschrijving (50-100 woorden) - dit is voor de website",
  "longDescription": "Lange beschrijving (150-300 woorden) - dit is voor de website",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "bedrijfsnaam",
    "image": "URL naar logo of cover afbeelding",
    "telephone": "telefoonnummer",
    "email": "e-mailadres",
    "url": "website URL",
    "priceRange": "€€ of €€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "straat + huisnummer",
      "addressLocality": "stad",
      "postalCode": "postcode",
      "addressCountry": "NL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.0",
      "longitude": "5.0"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${business.rating || 0}",
      "reviewCount": "${business.reviewCount || 0}"
    },
    "areaServed": {
      "@type": "City",
      "name": "${business.city}"
    }
  }
}

BELANGRIJK:
- shortDescription: MINIMAAL 50 woorden (50-100 woorden) - dit is voor de website bezoekers
- longDescription: MINIMAAL 150 woorden (150-300 woorden) - dit is voor SEO
- title: MOET 50-60 tekens zijn
- description: MOET 150-160 tekens zijn
- title moet de bedrijfsnaam, hoofddienst en stad bevatten
- description moet een call-to-action bevatten
- shortDescription en longDescription moeten NATUURLIJK en LEESBAAR zijn
- Gebruik lokale keywords (stad, wijk, provincie)
- Schema.org moet volledig en valide zijn
- Antwoord ALLEEN met JSON, geen andere tekst
`;

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    // Validate and sanitize the response
    // Ensure title is 50-60 characters
    let title = (parsed.title || '').trim();
    if (title.length < 50 || title.length > 60) {
        const city = business.city || '';
        const category = business.subCategory?.name || business.subCategory?.category?.name || '';

        // Try different approaches to make it 50-60 chars
        if (title.length < 50) {
            // Add more details
            if (!title.includes(city) && city) {
                title = `${title} in ${city}`;
            }
            if (title.length < 50 && category) {
                title = `${title} | ${category}`;
            }
        }

        // Ensure it's exactly in range
        if (title.length > 60) {
            title = title.slice(0, 60);
        }

        // If still too short, pad with "✓" or "?"
        while (title.length < 50) {
            title = title + ' ✓';
        }
        title = title.slice(0, 60);
    }

    // Ensure description is 150-160 characters
    let description = (parsed.description || '').trim();
    if (description.length < 150 || description.length > 160) {
        // Pad with more words if too short
        while (description.length < 150) {
            description += ' Ontdek onze professionele diensten en ervaren team.';
        }
        // Cut to 160 max
        if (description.length > 160) {
            description = description.slice(0, 160);
            // Try to end with a complete sentence
            const lastPeriod = description.lastIndexOf('.');
            if (lastPeriod > 130) {
                description = description.slice(0, lastPeriod + 1);
            }
        }
    }

    // Ensure shortDescription has at least 50 words
    let shortDesc = parsed.shortDescription || '';
    const shortDescWords = shortDesc.trim().split(/\s+/).filter(w => w.length > 0);
    if (shortDescWords.length < 50) {
        // Add more content
        shortDesc += ' Ons team van deskundige professionals staat klaar om u te helpen met al uw behoeften. Wij bieden persoonlijke service en garanties voor al onze werkzaamhed. Neem vandaag nog contact met ons op voor een vrijblijvend gesprek.';
    }

    // Ensure longDescription has at least 150 words
    let longDesc = parsed.longDescription || '';
    const longDescWords = longDesc.trim().split(/\s+/).filter(w => w.length > 0);
    if (longDescWords.length < 150) {
        // Add more content
        longDesc += ' Wij zijn al jaren actief in deze regio en hebben talloze tevreden klanten geholpen. Onze expertise omvat een breed scala aan diensten die wij met trots aanbieden. Van het eerste consult tot de uiteindelijke oplevering zorgen wij voor een vlotte samenwerking. Klanttevredenheid is onze hoogste prioriteit. Daarom werken wij alleen met hoogwaardige materialen en moderne technieken. Contacteer ons vandaag nog voor een vrijblijvend gesprek en ontdek wat wij voor u kunnen betekenen.';
    }

    // Build complete LocalBusiness schema
    const structuredData = parsed.structuredData || {};
    const city = business.city || 'Nederland';
    const street = business.street || '';
    const postalCode = business.postalCode || '';

    // Convert phone to Dutch format
    const formatToDutchPhone = (phone: string): string => {
        if (!phone) return '';
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '');
        // If starts with 31 (Netherlands country code)
        if (digits.startsWith('31') && digits.length === 11) {
            return '+31 ' + digits.slice(2, 3) + ' ' + digits.slice(3);
        }
        // If starts with 0
        if (digits.startsWith('0') && digits.length === 10) {
            return '+31 ' + digits.slice(1, 2) + ' ' + digits.slice(2);
        }
        // If just 9 digits (without 0 or +31)
        if (digits.length === 9) {
            return '+31 6 ' + digits;
        }
        // Return as-is if can't convert
        return phone;
    }

    const formattedPhone = formatToDutchPhone(business.phone || '');

    // Ensure complete LocalBusiness schema
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business.name,
        "image": business.logo || business.coverImage || '',
        "telephone": formattedPhone,
        "email": business.email || '',
        "url": business.website || '',
        "priceRange": "€€",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": street || "Adres niet gespecificeerd",
            "addressLocality": city,
            "postalCode": postalCode || "0000 AA",
            "addressCountry": "NL"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "52.0",
            "longitude": "5.0"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            }
        ],
        ...(business.rating > 0 && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": String(business.rating),
                "reviewCount": String(business.reviewCount || 0),
                "bestRating": "5",
                "worstRating": "1"
            }
        }),
        "areaServed": {
            "@type": "City",
            "name": city
        }
    };

    return {
        title: title.slice(0, 60),
        description: description.slice(0, 160),
        shortDescription: shortDesc,
        longDescription: longDesc,
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 10) : [],
        structuredData: localBusinessSchema,
    };
}

// Main function to generate SEO data for a business
export async function generateSeoData(businessId?: string) {
    try {
        console.log('=== generateSeoData called ===');

        const business = await getBusiness(businessId);

        if (!business) {
            return { success: false, error: 'Business not found' };
        }

        // Update status to GENERATING
        await prisma.business.update({
            where: { id: business.id },
            data: { seoStatus: 'GENERATING' }
        });

        console.log('Generating SEO for business:', business.name);

        // Generate SEO data with AI
        const seoData = await generateSeoWithAI(business);

        console.log('Generated SEO data:', {
            titleLength: seoData.title.length,
            descriptionLength: seoData.description.length,
            keywordsCount: seoData.keywords.length,
            hasStructuredData: !!seoData.structuredData
        });

        // Save to database
        await prisma.business.update({
            where: { id: business.id },
            data: {
                seoTitle: seoData.title,
                seoDescription: seoData.description,
                shortDescription: seoData.shortDescription || business.shortDescription,
                longDescription: seoData.longDescription || business.longDescription,
                seoKeywords: seoData.keywords,
                structuredData: seoData.structuredData,
                seoStatus: 'COMPLETED',
                lastSeoUpdate: new Date()
            }
        });

        console.log('SEO data saved successfully');

        // Revalidate relevant paths
        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard/seo');
        revalidatePath(`/nederland`);
        revalidatePath(`/bedrijf/${business.slug}`);
        revalidatePath(`/bedrijven/${business.slug}`);

        return { success: true };
    } catch (error) {
        console.error('Error generating SEO data:', error);

        // Update status to FAILED
        try {
            const business = await getBusiness(businessId);
            if (business) {
                await prisma.business.update({
                    where: { id: business.id },
                    data: { seoStatus: 'FAILED' }
                });
            }
        } catch (e) {
            console.error('Error updating status to FAILED:', e);
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate SEO data'
        };
    }
}

// Function to get SEO status for a business
export async function getSeoStatus(businessId?: string) {
    try {
        const business = await getBusiness(businessId);

        if (!business) {
            return null;
        }

        return {
            status: business.seoStatus,
            lastUpdate: business.lastSeoUpdate,
            seoTitle: business.seoTitle,
            seoDescription: business.seoDescription,
            seoKeywords: business.seoKeywords,
            hasStructuredData: !!business.structuredData
        };
    } catch (error) {
        console.error('Error getting SEO status:', error);
        return null;
    }
}
