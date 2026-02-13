import "@/app/seo.css";
import Link from "next/link";
import { Metadata } from "next";
import { NETHERLANDS_PROVINCES, getTopCities } from "@/lib/netherlands-data";

export const metadata: Metadata = {
    title: "Provincies van Nederland | Lokale Bedrijvengids",
    description: "Ontdek alle 12 provincies van Nederland. Vind lokale bedrijven per provincie, stad en wijk. Van Noord-Holland tot Limburg.",
    openGraph: {
        title: "Provincies van Nederland | Lokale Bedrijvengids",
        description: "Ontdek alle provincies van Nederland met steden, regio's en lokale bedrijvencategorieen.",
    }
};

export default function ProvincesIndexPage() {
    const totalCities = NETHERLANDS_PROVINCES.reduce((sum, p) => sum + p.cities.length, 0);
    const topCities = getTopCities(8);

    return (
        <main className="seo-shell">
            <div className="seo-container">
                {/* Breadcrumb */}
                <nav className="seo-breadcrumb">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <span>Provincies</span>
                </nav>

                {/* Hero Section */}
                <section className="seo-hero">
                    <div className="seo-hero-grid">
                        <div>
                            <span className="seo-kicker">Nederland</span>
                            <h1 className="seo-title">Provincies van Nederland</h1>
                            <p className="seo-subtitle">
                                Ontdek alle 12 provincies van Nederland. Van het bruisende Noord-Holland met Amsterdam
                                tot het heuvelachtige Limburg. Vind lokale bedrijven, diensten en specialisten per
                                provincie, stad of wijk.
                            </p>
                            <div className="seo-meta">
                                <span>12 provincies</span>
                                <span>{totalCities}+ steden</span>
                                <span>Duizenden bedrijven</span>
                            </div>
                            <div className="seo-hero-actions">
                                <Link href="/steden" className="seo-cta">
                                    Bekijk alle steden
                                </Link>
                                <Link href="/categorieen" className="seo-chip">
                                    Categorieen
                                </Link>
                            </div>
                        </div>
                        <div className="seo-hero-panel">
                            <div className="seo-icon-badge">NL</div>
                            <div className="seo-card-title">Lokale bedrijvengids</div>
                            <p className="seo-card-meta">
                                Vind bedrijven en diensten in heel Nederland, georganiseerd per provincie, stad en wijk.
                            </p>
                            <div className="seo-stat-grid">
                                <div className="seo-stat">
                                    <span>Provincies</span>
                                    12
                                </div>
                                <div className="seo-stat">
                                    <span>Steden</span>
                                    {totalCities}+
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Provinces Grid */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Alle provincies</h2>
                    <div className="seo-grid">
                        {NETHERLANDS_PROVINCES.map((province) => {
                            const topCity = province.cities.find(c => c.isCapital) || province.cities[0];
                            return (
                                <Link
                                    key={province.slug}
                                    href={`/provincies/${province.slug}`}
                                    className="seo-card"
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{province.icon}</div>
                                    <div className="seo-card-title">{province.name}</div>
                                    <div className="seo-card-meta">
                                        Hoofdstad: {province.capital}
                                    </div>
                                    <div className="seo-card-meta">
                                        {province.cities.length} steden en gemeenten
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Top Cities Quick Links */}
                <section className="seo-section seo-surface">
                    <h2 className="seo-section-title">Grootste steden van Nederland</h2>
                    <p className="seo-subtitle" style={{ marginBottom: '1.5rem' }}>
                        Direct naar de populairste steden met de meeste lokale bedrijven.
                    </p>
                    <div className="seo-chip-row">
                        {topCities.map((city) => (
                            <Link
                                key={city.slug}
                                href={`/steden/${city.slug}`}
                                className="seo-chip"
                            >
                                {city.name}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Navigation Links */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Meer ontdekken</h2>
                    <div className="seo-rail">
                        <div className="seo-rail-item">
                            <Link href="/steden" className="seo-chip">
                                Alle steden in Nederland
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/wijken" className="seo-chip">
                                Zoek per wijk of buurt
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/categorieen" className="seo-chip">
                                Bedrijven per categorie
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SEO Content */}
                <section className="seo-section">
                    <div className="seo-surface">
                        <h2 className="seo-section-title">Over de provincies</h2>
                        <p className="seo-subtitle">
                            Nederland is verdeeld in 12 provincies, elk met een uniek karakter en diverse steden.
                            Van de drukke Randstad met Noord-Holland, Zuid-Holland en Utrecht, tot de rustigere
                            noordelijke provincies Groningen, Friesland en Drenthe. In onze bedrijvengids vind je
                            lokale ondernemers in elke provincie, georganiseerd per stad en wijk.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
