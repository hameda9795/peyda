import { getBusinessBySlug } from "@/lib/actions/business";
import { BusinessHero } from "@/components/business/BusinessHero";
import { BusinessInfoSidebar } from "@/components/business/BusinessInfoSidebar";
import { BusinessContent } from "@/components/business/BusinessContent";
import { TrackPageView } from "@/components/business/TrackPageView";
import { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nldirectory.nl';

type Props = {
    params: Promise<{
        category: string;
        subcategory: string;
        business: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category, subcategory, business: slug } = await params;
    const business = await getBusinessBySlug(slug);

    if (!business) {
        return {
            title: 'Pagina niet gevonden',
        };
    }

    const title = (business.seo.title || `${business.name} – ${business.category} in ${business.address.city}`).trim();
    const description = (business.seo.metaDescription || business.shortDescription || `${business.category} in ${business.address.city}`).trim();
    const canonical = `${BASE_URL}/nederland/${category}/${subcategory}/${slug}`;
    const ogImage = business.images.cover || business.images.logo || '';
    const ogAlt = `${business.name} in ${business.address.city} ${business.address.neighborhood}`;

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            images: ogImage ? [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: ogAlt,
                }
            ] : undefined,
            locale: 'nl_NL',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        }
    };
}

export default async function BusinessPage({ params }: Props) {
    const { category, subcategory, business: slug } = await params;
    const business = await getBusinessBySlug(slug);

    if (!business) {
        notFound();
    }

    const currentUrl = `${BASE_URL}/nederland/${category}/${subcategory}/${slug}`;

    // JSON-LD Schema - LocalBusiness
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business.name,
        "image": business.images.gallery,
        "@id": currentUrl,
        "url": business.contact.website || currentUrl,
        "telephone": business.contact.phone,
        "priceRange": "€€",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": business.address.street,
            "addressLocality": business.address.city,
            "postalCode": business.address.postalCode,
            "addressCountry": "NL"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": business.address.coordinates.lat,
            "longitude": business.address.coordinates.lng
        },
        "openingHoursSpecification": business.openingHours?.map(h => ({
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": h.day,
            "opens": h.open,
            "closes": h.close
        })) || [],
        ...(business.reviews.count > 0 && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": business.reviews.average,
                "reviewCount": business.reviews.count,
                "bestRating": 5,
                "worstRating": 1
            }
        }),
        "sameAs": [
            business.contact.socials.facebook,
            business.contact.socials.instagram,
            business.contact.socials.linkedin,
            business.contact.socials.twitter
        ].filter(Boolean)
    };

    // JSON-LD Schema - BreadcrumbList
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": BASE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Nederland",
                "item": `${BASE_URL}/nederland`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": decodeURIComponent(category).replace(/-/g, ' '),
                "item": `${BASE_URL}/categorieen/${category}`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": decodeURIComponent(subcategory).replace(/-/g, ' '),
                "item": `${BASE_URL}/categorieen/${category}/${subcategory}`
            },
            {
                "@type": "ListItem",
                "position": 5,
                "name": business.name,
                "item": currentUrl
            }
        ]
    };

    // JSON-LD Schema - FAQPage (if FAQ exists)
    const faqSchema = business.faq && business.faq.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": business.faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Track page view */}
            <TrackPageView business={business} />

            {/* LocalBusiness Schema */}
            <Script
                id="business-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />

            {/* BreadcrumbList Schema */}
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* FAQPage Schema */}
            {faqSchema && (
                <Script
                    id="faq-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                        <Link href="/" className="hover:text-slate-900">Home</Link>
                        <span>/</span>
                        <Link href={`/categorieen/${category}`} className="hover:text-slate-900 capitalize">
                            {decodeURIComponent(category).replace(/-/g, ' ')}
                        </Link>
                        <span>/</span>
                        <Link href={`/categorieen/${category}/${subcategory}`} className="hover:text-slate-900 capitalize">
                            {decodeURIComponent(subcategory).replace(/-/g, ' ')}
                        </Link>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">{business.name}</span>
                    </nav>
                </div>
            </div>

            <BusinessHero business={business} />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content Column */}
                    <main className="flex-1 bg-white rounded-xl shadow-xl p-6 md:p-10 border border-slate-100 min-h-[500px]">
                        <BusinessContent business={business} />
                    </main>

                    {/* Sticky Sidebar Column */}
                    <aside className="lg:w-[380px] shrink-0 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <BusinessInfoSidebar business={business} />
                        </div>
                    </aside>

                </div>
            </div>

            {/* Footer Navigation */}
            <div className="container mx-auto px-4 mt-16 text-center">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">NL Business Directory</h3>
                <div className="flex justify-center gap-4 text-sm text-slate-500 flex-wrap">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span>•</span>
                    <Link href={`/categorieen/${category}`} className="hover:text-blue-600">{business.category}</Link>
                    <span>•</span>
                    <Link href={`/steden/${business.address.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-blue-600">{business.address.city}</Link>
                    {business.address.neighborhood && (
                        <>
                            <span>•</span>
                            <span className="text-slate-400">{business.address.neighborhood}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
