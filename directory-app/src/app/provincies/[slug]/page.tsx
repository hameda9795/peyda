import "@/app/seo.css";
import "@/app/home.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProvinceBySlug, NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";
import { getCategories } from "@/lib/actions/categories";
import { getBusinessesByCity } from "@/lib/actions/business";
import { stripSeoSlug } from "@/lib/seo-slug";
import { BusinessScrollSection } from "@/components/BusinessScrollSection";

type Props = {
    params: Promise<{ slug: string }>;
};

const buildDescription = (provinceName: string) =>
    `Ontdek steden, wijken en populaire categorieen in ${provinceName}. Vind lokale bedrijven en diensten per regio.`;

const getTotalPopulation = (cities: { population?: number }[]) =>
    cities.reduce((sum, city) => sum + (city.population || 0), 0);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug  } = await params;
    const province = getProvinceBySlug(slug);

    if (!province) {
        return {
            title: "Provincie niet gevonden | NL Directory",
        };
    }

    return {
        title: `${province.name} | Bedrijvengids per stad en wijk`,
        description: `Vind lokale bedrijven in ${province.name}. Bekijk ${province.cities.length} steden waaronder ${province.capital}. Ontdek diensten per categorie en wijk.`,
        openGraph: {
            title: `${province.name} | Lokale Bedrijvengids`,
            description: buildDescription(province.name),
        }
    };
}

export async function generateStaticParams() {
    return NETHERLANDS_PROVINCES.map((province) => ({
        slug: province.slug,
    }));
}

export default async function ProvincePage({ params }: Props) {
    const { slug  } = await params;
    const province = getProvinceBySlug(slug);

    if (!province) {
        notFound();
    }

    const categories = await getCategories();
    const topCategories = categories.slice(0, 12);
    const totalPopulation = getTotalPopulation(province.cities);
    const capitalCity = province.cities.find(c => c.isCapital);
    const topCities = [...province.cities].sort((a, b) => (b.population || 0) - (a.population || 0)).slice(0, 8);

    // Fetch businesses for each top city
    const cityBusinessesPromises = topCities.map(async (city) => {
        const businesses = await getBusinessesByCity(city.name, 10);
        return {
            city,
            businesses
        };
    });
    const cityBusinesses = await Promise.all(cityBusinessesPromises);

    // Filter cities that have businesses
    const citiesWithBusinesses = cityBusinesses.filter(cb => cb.businesses.length > 0);

    return (
        <main className="seo-shell">
            <div className="seo-container">
                {/* Breadcrumb */}
                <nav className="seo-breadcrumb">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/provincies">Provincies</Link>
                    <span>/</span>
                    <span>{province.name}</span>
                </nav>

                {/* Hero Section */}
                <section className="seo-hero">
                    <div className="seo-hero-grid">
                        <div>
                            <span className="seo-kicker">{province.icon} Provincie</span>
                            <h1 className="seo-title">{province.name}</h1>
                            <p className="seo-subtitle">
                                Welkom bij de lokale bedrijvengids voor {province.name}. Ontdek {province.cities.length} steden
                                en gemeenten, van de hoofdstad {province.capital} tot kleinere kernen. Vind lokale bedrijven,
                                diensten en specialisten in elke regio.
                            </p>
                            <div className="seo-meta">
                                <span>{province.icon} {province.capital}</span>
                                <span>{province.cities.length} steden</span>
                                <span>{totalPopulation > 0 ? `${(totalPopulation / 1000).toFixed(0)}K+ inwoners` : 'Lokale bedrijven'}</span>
                            </div>
                            <div className="seo-hero-actions">
                                <Link href={`/steden/${capitalCity?.slug || province.cities[0].slug}`} className="seo-cta">
                                    Bekijk {capitalCity?.name || province.cities[0].name}
                                </Link>
                                <Link href="/categorieen" className="seo-chip">
                                    Alle categorieen
                                </Link>
                            </div>
                        </div>
                        <div className="seo-hero-panel">
                            <div className="seo-icon-badge">{province.icon}</div>
                            <div className="seo-card-title">Provincie info</div>
                            <p className="seo-card-meta">
                                {province.name} is een van de 12 provincies van Nederland met {province.capital} als hoofdstad.
                            </p>
                            <div className="seo-stat-grid">
                                <div className="seo-stat">
                                    <span>Steden</span>
                                    {province.cities.length}
                                </div>
                                <div className="seo-stat">
                                    <span>Hoofdstad</span>
                                    {province.capital}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* City Business Sections - Full width for scroll */}
            {citiesWithBusinesses.length > 0 ? (
                citiesWithBusinesses.map(({ city, businesses }, index) => (
                    <BusinessScrollSection
                        key={city.slug}
                        title={`Bedrijven in ${city.name}`}
                        businesses={businesses}
                        viewAllHref={`/steden/${city.slug}`}
                        viewAllText={`Alle bedrijven in ${city.name}`}
                        accentIndex={index}
                    />
                ))
            ) : (
                <div className="seo-container">
                    <section className="seo-section">
                        <h2 className="seo-section-title">Bedrijven per stad</h2>
                        <div className="seo-grid">
                            {topCities.map((city, index) => (
                                <Link
                                    key={city.slug}
                                    href={`/steden/${city.slug}`}
                                    className="seo-card"
                                >
                                    <div className="seo-card-title">
                                        {index + 1}. {city.name}
                                    </div>
                                    <div className="seo-card-meta">
                                        {city.population ? `${city.population.toLocaleString("nl-NL")} inwoners` : "Gemeente"}
                                        {city.isCapital && " • Hoofdstad"}
                                    </div>
                                    <div className="seo-card-meta">
                                        Bekijk wijken en lokale bedrijven
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            <div className="seo-container">
                {/* All Cities Section */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Alle steden in {province.name}</h2>
                    <div className="seo-chip-row">
                        {province.cities.map((city) => (
                            <Link
                                key={city.slug}
                                href={`/steden/${city.slug}`}
                                className="seo-chip"
                            >
                                {city.name}
                                {city.isCapital && " *"}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Categories Section */}
                <section className="seo-section seo-surface">
                    <h2 className="seo-section-title">Populaire categorieen in {province.name}</h2>
                    <p className="seo-subtitle" style={{ marginBottom: '1.5rem' }}>
                        Vind bedrijven en diensten in elke categorie. Selecteer een categorie om lokale aanbieders te ontdekken.
                    </p>
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

                {/* Related Links Section */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Ontdek meer</h2>
                    <div className="seo-rail">
                        <div className="seo-rail-item">
                            <Link href="/provincies" className="seo-chip">
                                Alle 12 provincies bekijken
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/steden" className="seo-chip">
                                Overzicht van alle steden
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/wijken" className="seo-chip">
                                Zoek per wijk of buurt
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/categorieen" className="seo-chip">
                                Alle bedrijfscategorieen
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SEO Content Section */}
                <section className="seo-section">
                    <div className="seo-surface">
                        <h2 className="seo-section-title">Over {province.name}</h2>
                        <p className="seo-subtitle">
                            {province.name} is een provincie in Nederland met {province.capital} als hoofdstad.
                            De provincie telt {province.cities.length} belangrijke steden en gemeenten waar je diverse
                            lokale bedrijven en diensten kunt vinden. Of je nu op zoek bent naar restaurants,
                            klusjesmannen, schoonheidsspecialisten of andere dienstverleners - in onze gids vind je
                            altijd de juiste professional in jouw regio.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
