import "@/app/seo.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getCities } from "@/lib/actions/locations";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";

export const metadata: Metadata = {
    title: "Wijken en buurten in Nederland | Lokale Bedrijvengids",
    description: "Vind lokale bedrijven per wijk en buurt. Ontdek dienstverleners in jouw directe omgeving. Van Amsterdam tot Maastricht.",
    openGraph: {
        title: "Wijken en buurten | Lokale Bedrijvengids",
        description: "Bekijk wijken in Nederland en ontdek lokale bedrijven per buurt en stad.",
    }
};

export default async function NeighborhoodsIndexPage() {
    const cities = await getCities({ limit: 300 });
    const totalNeighborhoods = cities.reduce(
        (sum: number, city: any) => sum + (city._count?.neighborhoods ?? 0),
        0
    );

    // Filter cities that have neighborhoods
    const citiesWithNeighborhoods = cities.filter((city: any) => (city._count?.neighborhoods ?? 0) > 0);
    const citiesWithoutNeighborhoods = cities.filter((city: any) => (city._count?.neighborhoods ?? 0) === 0);

    return (
        <main className="seo-shell">
            <div className="seo-container">
                {/* Breadcrumb */}
                <nav className="seo-breadcrumb">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <span>Wijken</span>
                </nav>

                {/* Hero Section */}
                <section className="seo-hero">
                    <div className="seo-hero-grid">
                        <div>
                            <span className="seo-kicker">Nederland</span>
                            <h1 className="seo-title">Wijken en buurten</h1>
                            <p className="seo-subtitle">
                                Vind lokale bedrijven en diensten per wijk. Elke buurt heeft zijn eigen karakter
                                en ondernemers. Kies een stad en ontdek welke professionals in jouw directe
                                omgeving actief zijn.
                            </p>
                            <div className="seo-meta">
                                <span>{cities.length} steden</span>
                                <span>{totalNeighborhoods} wijken</span>
                                <span>Lokale bedrijven</span>
                            </div>
                            <div className="seo-hero-actions">
                                <Link href="/steden" className="seo-cta">
                                    Alle steden bekijken
                                </Link>
                                <Link href="/categorieen" className="seo-chip">
                                    Zoek per categorie
                                </Link>
                            </div>
                        </div>
                        <div className="seo-hero-panel">
                            <div className="seo-icon-badge">🏘️</div>
                            <div className="seo-card-title">Lokaal zoeken</div>
                            <p className="seo-card-meta">
                                Elke wijkpagina toont relevante bedrijven en diensten voor die specifieke buurt.
                            </p>
                            <div className="seo-stat-grid">
                                <div className="seo-stat">
                                    <span>Steden</span>
                                    {cities.length}
                                </div>
                                <div className="seo-stat">
                                    <span>Wijken</span>
                                    {totalNeighborhoods}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Province Quick Links */}
                <section className="seo-section seo-surface">
                    <h2 className="seo-section-title">Zoek per provincie</h2>
                    <div className="seo-chip-row">
                        {NETHERLANDS_PROVINCES.map((province) => (
                            <Link
                                key={province.slug}
                                href={`/provincies/${province.slug}`}
                                className="seo-chip"
                            >
                                {province.icon} {province.name}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Cities with neighborhoods */}
                {citiesWithNeighborhoods.length > 0 && (
                    <section className="seo-section">
                        <h2 className="seo-section-title">Steden met wijken</h2>
                        <div className="seo-grid">
                            {citiesWithNeighborhoods.map((city) => (
                                <Link key={city.id} href={`/steden/${city.slug}`} className="seo-card">
                                    <div className="seo-card-title">{city.name}</div>
                                    <div className="seo-card-meta">
                                        {city._count?.neighborhoods ?? 0} wijken beschikbaar
                                    </div>
                                    <div className="seo-card-meta">
                                        Bekijk lokale bedrijven per buurt
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Other cities */}
                {citiesWithoutNeighborhoods.length > 0 && (
                    <section className="seo-section">
                        <h2 className="seo-section-title">Overige steden</h2>
                        <p className="seo-subtitle" style={{ marginBottom: '1rem' }}>
                            Deze steden hebben nog geen wijken in onze gids. Klik om de stad te bekijken.
                        </p>
                        <div className="seo-chip-row">
                            {citiesWithoutNeighborhoods.map((city) => (
                                <Link key={city.id} href={`/steden/${city.slug}`} className="seo-chip">
                                    {city.name}
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
                            <Link href="/steden" className="seo-chip">
                                Overzicht alle steden
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/provincies" className="seo-chip">
                                Alle 12 provincies
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/categorieen" className="seo-chip">
                                Bedrijfscategorieen
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
