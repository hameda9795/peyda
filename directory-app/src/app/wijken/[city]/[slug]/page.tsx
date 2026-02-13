import "@/app/seo.css";
import "@/app/home.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNeighborhoodsByCitySlug } from "@/lib/actions/locations";
import { getCategories } from "@/lib/actions/categories";
import { getBusinessesByNeighborhoodGrouped } from "@/lib/actions/business";
import { stripSeoSlug } from "@/lib/seo-slug";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";
import { BusinessScrollSection } from "@/components/BusinessScrollSection";

type Props = {
    params: Promise<{ city: string; slug: string }>;
};

const findProvinceByCityName = (cityName: string) => {
    const lower = cityName.toLowerCase();
    for (const province of NETHERLANDS_PROVINCES) {
        const match = province.cities.find((city) => city.name.toLowerCase() === lower);
        if (match) return province;
    }
    return null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city, slug  } = await params;
    const { city: cityInfo, neighborhoods } = await getNeighborhoodsByCitySlug(city, { limit: 500 });
    const neighborhood = neighborhoods.find((item) => item.slug === slug);

    if (!cityInfo || !neighborhood) {
        return { title: "Wijk niet gevonden | NL Directory" };
    }

    return {
        title: `${neighborhood.name} in ${cityInfo.name} | Lokale Bedrijvengids`,
        description: `Vind lokale bedrijven en diensten in ${neighborhood.name}, ${cityInfo.name}. Ontdek restaurants, klusjesmannen en meer in jouw buurt.`,
        openGraph: {
            title: `${neighborhood.name} (${cityInfo.name}) | Wijken`,
            description: `Lokale bedrijven en populaire categorieen in ${neighborhood.name}, ${cityInfo.name}.`,
        }
    };
}

export default async function NeighborhoodPage({ params }: Props) {
    const { city, slug  } = await params;
    const { city: cityInfo, neighborhoods } = await getNeighborhoodsByCitySlug(city, { limit: 500 });

    if (!cityInfo) {
        notFound();
    }

    const neighborhood = neighborhoods.find((item) => item.slug === slug);

    if (!neighborhood) {
        notFound();
    }

    const categories = await getCategories();
    const topCategories = categories.slice(0, 12);
    const province = findProvinceByCityName(cityInfo.name);
    const otherNeighborhoods = neighborhoods.filter((n) => n.slug !== slug).slice(0, 6);

    // Get businesses grouped by category for this neighborhood
    const categoryBusinesses = await getBusinessesByNeighborhoodGrouped(neighborhood.name, 10);

    return (
        <main className="seo-shell">
            <div className="seo-container">
                {/* Breadcrumb */}
                <nav className="seo-breadcrumb">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/wijken">Wijken</Link>
                    <span>/</span>
                    <Link href={`/steden/${cityInfo.slug}`}>{cityInfo.name}</Link>
                    <span>/</span>
                    <span>{neighborhood.name}</span>
                </nav>

                {/* Hero Section */}
                <section className="seo-hero">
                    <div className="seo-hero-grid">
                        <div>
                            <span className="seo-kicker">🏘️ Wijk</span>
                            <h1 className="seo-title">{neighborhood.name}</h1>
                            <p className="seo-subtitle">
                                Welkom bij de lokale bedrijvengids voor {neighborhood.name} in {cityInfo.name}.
                                Ontdek bedrijven, diensten en specialisten in jouw directe omgeving.
                                Van restaurants en kappers tot loodgieters en schoonmakers.
                            </p>
                            <div className="seo-meta">
                                <span>🏙️ {cityInfo.name}</span>
                                {province && <span>{province.icon} {province.name}</span>}
                                <span>Lokale bedrijven</span>
                            </div>
                            <div className="seo-hero-actions">
                                <Link href="/categorieen" className="seo-cta">
                                    Zoek per categorie
                                </Link>
                                <Link href={`/steden/${cityInfo.slug}`} className="seo-chip">
                                    Alle wijken in {cityInfo.name}
                                </Link>
                            </div>
                        </div>
                        <div className="seo-hero-panel">
                            <div className="seo-icon-badge">🏘️</div>
                            <div className="seo-card-title">Wijkinfo</div>
                            <p className="seo-card-meta">
                                {neighborhood.name} is een wijk in {cityInfo.name}.
                                Vind hier lokale ondernemers en dienstverleners.
                            </p>
                            <div className="seo-stat-grid">
                                <div className="seo-stat">
                                    <span>Stad</span>
                                    {cityInfo.name}
                                </div>
                                <div className="seo-stat">
                                    <span>Categorieen</span>
                                    {categoryBusinesses.length > 0 ? categoryBusinesses.length : topCategories.length}+
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Category Business Sections - Full width for scroll */}
            {categoryBusinesses.length > 0 ? (
                categoryBusinesses.map(({ categorySlug, categoryName, businesses }, index) => (
                    <BusinessScrollSection
                        key={categorySlug}
                        title={`${categoryName} in ${neighborhood.name}`}
                        businesses={businesses}
                        viewAllHref={`/categorieen/${categorySlug}`}
                        viewAllText={`Alle ${categoryName.toLowerCase()}`}
                        accentIndex={index}
                    />
                ))
            ) : (
                <div className="seo-container">
                    <section className="seo-section">
                        <h2 className="seo-section-title">Populaire categorieen in {neighborhood.name}</h2>
                        <p className="seo-subtitle" style={{ marginBottom: '1.5rem' }}>
                            Vind bedrijven en diensten per categorie in deze wijk.
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
                </div>
            )}

            <div className="seo-container">
                {/* Other Neighborhoods */}
                {otherNeighborhoods.length > 0 && (
                    <section className="seo-section seo-surface">
                        <h2 className="seo-section-title">Andere wijken in {cityInfo.name}</h2>
                        <div className="seo-grid">
                            {otherNeighborhoods.map((n) => (
                                <Link
                                    key={n.id}
                                    href={`/wijken/${cityInfo.slug}/${n.slug}`}
                                    className="seo-card"
                                >
                                    <div className="seo-card-title">{n.name}</div>
                                    <div className="seo-card-meta">
                                        Ontdek lokale bedrijven
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related Links */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Meer ontdekken</h2>
                    <div className="seo-rail">
                        <div className="seo-rail-item">
                            <Link href={`/steden/${cityInfo.slug}`} className="seo-chip">
                                Alle wijken in {cityInfo.name}
                            </Link>
                        </div>
                        {province && (
                            <div className="seo-rail-item">
                                <Link href={`/provincies/${province.slug}`} className="seo-chip">
                                    Steden in {province.name}
                                </Link>
                            </div>
                        )}
                        <div className="seo-rail-item">
                            <Link href="/categorieen" className="seo-chip">
                                Alle categorieen
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/wijken" className="seo-chip">
                                Alle wijken in Nederland
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SEO Content */}
                <section className="seo-section">
                    <div className="seo-surface">
                        <h2 className="seo-section-title">Over {neighborhood.name}</h2>
                        <p className="seo-subtitle">
                            {neighborhood.name} is een wijk in {cityInfo.name}
                            {province ? `, gelegen in de provincie ${province.name}` : ''}.
                            In onze lokale bedrijvengids vind je diverse ondernemers en dienstverleners
                            die actief zijn in {neighborhood.name} en omgeving. Of je nu op zoek bent
                            naar een restaurant, kapper, loodgieter of andere specialist - wij helpen
                            je de beste lokale professionals te vinden.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
