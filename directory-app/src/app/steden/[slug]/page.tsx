import "@/app/seo.css";
import "@/app/home.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCityBySlug, getNeighborhoodsByCitySlug } from "@/lib/actions/locations";
import { getCategories } from "@/lib/actions/categories";
import { getBusinessesByNeighborhood } from "@/lib/actions/business";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";
import { stripSeoSlug } from "@/lib/seo-slug";
import { BusinessScrollSection } from "@/components/BusinessScrollSection";
import { CityContent } from "@/components/CityContent";
import { CITY_KEYWORDS } from "@/lib/city-keywords";
import { generateBreadcrumbSchema, generateFaqSchema, generatePlaceSchema, generateWebPageSchema } from "@/lib/json-ld-schema";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peyda.nl';

type Props = {
    params: Promise<{ slug: string }>;
};

// Find province by city name
const findProvinceByCityName = (cityName: string) => {
    const lower = cityName.toLowerCase();
    for (const province of NETHERLANDS_PROVINCES) {
        const match = province.cities.find((city) => city.name.toLowerCase() === lower);
        if (match) return province;
    }
    return null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const cityKeywords = CITY_KEYWORDS[slug];

    if (!cityKeywords) {
        return { title: "Stad niet gevonden | NL Directory" };
    }

    const cityName = cityKeywords.name;
    const province = findProvinceByCityName(cityName);

    return {
        title: cityKeywords.contentSections.intro.split('.')[0] + ' | Lokale Bedrijvengids',
        description: `Ontdek lokale bedrijven en diensten in ${cityName}. ${cityKeywords.primaryKeywords.slice(0, 3).join(', ')}.`,
        openGraph: {
            title: `${cityName} | Stadspagina`,
            description: `Lokale bedrijven en diensten in ${cityName}`,
        }
    };
}

export default async function CityPage({ params }: Props) {
    const { slug } = await params;
    const cityKeywords = CITY_KEYWORDS[slug];

    if (!cityKeywords) {
        notFound();
    }

    const cityName = cityKeywords.name;
    const province = findProvinceByCityName(cityName);

    // Try to get city from database (for neighborhoods)
    let dbCity = null;
    let neighborhoods: any[] = [];
    let neighborhoodsWithBusinesses: any[] = [];

    try {
        dbCity = await getCityBySlug(slug);
        if (dbCity) {
            const { neighborhoods: dbNeighborhoods } = await getNeighborhoodsByCitySlug(dbCity.slug, { limit: 200 });
            neighborhoods = dbNeighborhoods;

            // Get top neighborhoods
            const topNeighborhoods = neighborhoods.slice(0, 8);

            // Fetch businesses for each neighborhood
            const neighborhoodBusinessesPromises = topNeighborhoods.map(async (neighborhood) => {
                const businesses = await getBusinessesByNeighborhood(neighborhood.name, 10);
                return {
                    neighborhood,
                    businesses
                };
            });
            const neighborhoodBusinesses = await Promise.all(neighborhoodBusinessesPromises);
            neighborhoodsWithBusinesses = neighborhoodBusinesses.filter(nb => nb.businesses.length > 0);
        }
    } catch (error) {
        console.error('Error fetching city data:', error);
    }

    const categories = await getCategories();
    const topCategories = categories.slice(0, 12);

    // Prepare generated content
    const generatedContent = {
        intro: cityKeywords.contentSections.intro,
        history: cityKeywords.contentSections.history,
        economy: cityKeywords.contentSections.economy,
        landmarks: cityKeywords.contentSections.landmarks,
        localTips: cityKeywords.contentSections.localTips,
        keywords: cityKeywords.primaryKeywords,
        faqs: [] as { question: string; answer: string }[],
    };

    // Generate JSON-LD schemas
    const pageUrl = `${BASE_URL}/steden/${slug}`;
    const breadcrumbs = [
        { name: "Home", url: BASE_URL, position: 1 },
        { name: "Steden", url: `${BASE_URL}/steden`, position: 2 },
        ...(province ? [{ name: province.name, url: `${BASE_URL}/provincies/${province.slug}`, position: 3 }] : []),
        { name: cityName, url: pageUrl, position: 4 },
    ];

    // Sample FAQs for the city
    const faqs = [
        {
            question: `Wat zijn de beste bedrijven in ${cityName}?`,
            answer: cityKeywords.contentSections.intro
        },
        {
            question: `Welke wijken zijn er in ${cityName}?`,
            answer: neighborhoods.length > 0
                ? `${cityName} heeft ${neighborhoods.length} wijken. Ontdek lokale bedrijven en diensten in elke wijk.`
                : `Informatie over wijken in ${cityName} binnenkort beschikbaar.`
        },
        {
            question: `Hoe vind ik een goede professional in ${cityName}?`,
            answer: `Gebruik onze bedrijvengids om eenvoudig lokale bedrijven en dienstverleners te vinden in ${cityName}. U kunt zoeken per categorie of per wijk.`
        },
        {
            question: `Welke categorieën zijn populair in ${cityName}?`,
            answer: `Populaire categorieën in ${cityName} zijn onder andere ${topCategories.slice(0, 5).map((c: any) => c.name).join(', ')} en meer.`
        }
    ];

    const schemaScripts = JSON.stringify([
        generateWebPageSchema({
            name: `${cityName} | Lokale Bedrijvengids`,
            description: `Ontdek lokale bedrijven en diensten in ${cityName}. ${cityKeywords.primaryKeywords.slice(0, 3).join(', ')}.`,
            url: pageUrl
        }),
        generateBreadcrumbSchema(breadcrumbs),
        generatePlaceSchema({
            name: cityName,
            description: `Lokale bedrijven en diensten in ${cityName}`,
            url: pageUrl,
            address: {
                addressLocality: cityName,
                addressRegion: province?.name || "Utrecht",
                addressCountry: "NL"
            }
        }),
        generateFaqSchema(faqs)
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaScripts }}
            />
            <main className="seo-shell">
                <div className="seo-container">
                    {/* Breadcrumb */}
                    <nav className="seo-breadcrumb">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <Link href="/steden">Steden</Link>
                        {province && (
                            <>
                                <span>/</span>
                                <Link href={`/provincies/${province.slug}`}>{province.name}</Link>
                            </>
                        )}
                        <span>/</span>
                        <span>{cityName}</span>
                    </nav>

                    {/* Hero Section */}
                    <section className="seo-hero">
                        <div className="seo-hero-grid">
                            <div>
                                <span className="seo-kicker">{province?.icon || '🏙️'} Stad</span>
                                <h1 className="seo-title">{cityName}</h1>
                                <p className="seo-subtitle">
                                    Welkom bij de lokale bedrijvengids voor {cityName}
                                    {province ? ` in ${province.name}` : ''}.
                                    {neighborhoods.length > 0
                                        ? ` Ontdek ${neighborhoods.length} wijken met lokale bedrijven, diensten en specialisten.`
                                        : ' Ontdek lokale bedrijven, winkels en diensten.'}
                                </p>
                                <div className="seo-meta">
                                    {province && <span>{province.icon} {province.name}</span>}
                                    {neighborhoods.length > 0 && <span>{neighborhoods.length} wijken</span>}
                                    <span>Lokale diensten</span>
                                </div>
                                <div className="seo-hero-actions">
                                    <Link href="/categorieen" className="seo-cta">
                                        Zoek per categorie
                                    </Link>
                                </div>
                            </div>
                            <div className="seo-hero-panel">
                                <div className="seo-icon-badge">{province?.icon || '🏙️'}</div>
                                <div className="seo-card-title">{cityName}</div>
                                <p className="seo-card-meta">
                                    {cityKeywords.contentSections.intro.split('.')[0]}.
                                </p>
                                <div className="seo-stat-grid">
                                    <div className="seo-stat">
                                        <span>Wijken</span>
                                        {neighborhoods.length || 'Alle'}
                                    </div>
                                    <div className="seo-stat">
                                        <span>Categorieën</span>
                                        {topCategories.length}+
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Generated City Content */}
                    <CityContent
                        citySlug={slug}
                        cityName={cityName}
                        province={province?.name}
                        initialContent={generatedContent}
                    />
                </div>

                {/* Neighborhood Business Sections */}
                {neighborhoodsWithBusinesses.length > 0 ? (
                    neighborhoodsWithBusinesses.map(({ neighborhood, businesses }, index) => (
                        <BusinessScrollSection
                            key={neighborhood.id}
                            title={`Bedrijven in ${neighborhood.name}`}
                            businesses={businesses}
                            viewAllHref={`/wijken/${slug}/${neighborhood.slug}`}
                            viewAllText={`Alle bedrijven in ${neighborhood.name}`}
                            accentIndex={index}
                        />
                    ))
                ) : neighborhoods.length > 0 ? (
                    <div className="seo-container">
                        <section className="seo-section">
                            <h2 className="seo-section-title">Wijken in {cityName}</h2>
                            <div className="seo-grid">
                                {neighborhoods.map((neighborhood) => (
                                    <Link
                                        key={neighborhood.id}
                                        href={`/wijken/${slug}/${neighborhood.slug}`}
                                        className="seo-card"
                                    >
                                        <div className="seo-card-title">{neighborhood.name}</div>
                                        <div className="seo-card-meta">
                                            Ontdek lokale bedrijven en diensten
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="seo-container">
                        <section className="seo-section">
                            <div className="seo-empty">
                                <div className="seo-empty-icon">🏘️</div>
                                <div className="seo-empty-title">Wijken binnenkort beschikbaar</div>
                                <p className="seo-empty-text">
                                    We voegen binnenkort wijken toe voor {cityName}.
                                </p>
                            </div>
                        </section>
                    </div>
                )}

                <div className="seo-container">
                    {/* All Neighborhoods */}
                    {neighborhoods.length > 8 && (
                        <section className="seo-section">
                            <h2 className="seo-section-title">Alle wijken in {cityName}</h2>
                            <div className="seo-chip-row">
                                {neighborhoods.map((neighborhood) => (
                                    <Link
                                        key={neighborhood.id}
                                        href={`/wijken/${slug}/${neighborhood.slug}`}
                                        className="seo-chip"
                                    >
                                        {neighborhood.name}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Categories */}
                    <section className="seo-section seo-surface">
                        <h2 className="seo-section-title">Populaire categorieën in {cityName}</h2>
                        <div className="seo-chip-row">
                            {topCategories.map((category: any) => {
                                const categorySlug = stripSeoSlug(category.slug);
                                return (
                                    <Link
                                        key={category.id}
                                        href={`/categorieen/${categorySlug}`}
                                        className="seo-chip"
                                    >
                                        {category.name.replace(" in Utrecht", "").replace(" in Nederland", "")}
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* Related Links */}
                    <section className="seo-section">
                        <h2 className="seo-section-title">Meer ontdekken</h2>
                        <div className="seo-rail">
                            {province && (
                                <div className="seo-rail-item">
                                    <Link href={`/provincies/${province.slug}`} className="seo-chip">
                                        Alle steden in {province.name}
                                    </Link>
                                </div>
                            )}
                            <div className="seo-rail-item">
                                <Link href="/steden" className="seo-chip">
                                    Overzicht alle steden
                                </Link>
                            </div>
                            <div className="seo-rail-item">
                                <Link href="/categorieen" className="seo-chip">
                                    Alle categorieën
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
