import "@/app/seo.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategories } from "@/lib/actions/categories";
import { CATEGORY_ICONS } from "@/lib/netherlands-data";
import { getCities } from "@/lib/actions/locations";
import { NETHERLANDS_PROVINCES, getTopCities } from "@/lib/netherlands-data";
import { cleanCategoryName, stripSeoSlug } from "@/lib/seo-slug";
import { generateWebPageSchema, generateBreadcrumbSchema, generateCollectionPageSchema } from "@/lib/json-ld-schema";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nldirectory.nl';

export const metadata: Metadata = {
    title: "Bedrijfscategorieen | Lokale Bedrijvengids Nederland",
    description: "Ontdek alle bedrijfscategorieen in Nederland. Van restaurants en kappers tot loodgieters en advocaten. Vind lokale professionals per categorie.",
    openGraph: {
        title: "Bedrijfscategorieen | Lokale Bedrijvengids",
        description: "Ontdek alle bedrijvencategorieen, subcategorieen en lokale diensten in Nederland.",
    }
};

const buildCategorySummary = (name: string) =>
    `Ontdek ${name.toLowerCase()} en vind lokale professionals.`;

export default async function CategoriesIndexPage() {
    const categories = await getCategories();
    const totalSubcategories = categories.reduce(
        (sum: number, category: any) => sum + (category._count?.subcategories ?? category.subcategories?.length ?? 0),
        0
    );
    const topCities = getTopCities(12);

    // Generate JSON-LD schemas
    const pageUrl = `${BASE_URL}/categorieen`;
    const breadcrumbs = [
        { name: "Home", url: BASE_URL, position: 1 },
        { name: "Categorieën", url: pageUrl, position: 2 },
    ];

    const schemaScripts = JSON.stringify([
        generateWebPageSchema({
            name: "Bedrijfscategorieën | Lokale Bedrijvengids",
            description: "Ontdek alle bedrijfscategorieën in Nederland. Van restaurants en kappers tot loodgieters en advocaten.",
            url: pageUrl
        }),
        generateBreadcrumbSchema(breadcrumbs),
        generateCollectionPageSchema({
            name: "Bedrijfscategorieën",
            description: "Alle bedrijfscategorieën in Nederland",
            url: pageUrl,
            itemCount: categories.length
        })
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
                    <span>Categorieen</span>
                </nav>

                {/* Hero Section */}
                <section className="seo-hero">
                    <div className="seo-hero-grid">
                        <div>
                            <span className="seo-kicker">Nederland</span>
                            <h1 className="seo-title">Bedrijfscategorieen</h1>
                            <p className="seo-subtitle">
                                Vind lokale professionals in elke categorie. Van restaurants en schoonheidssalons
                                tot aannemers en advocaten. Blader door alle categorieen en ontdek de beste
                                bedrijven en dienstverleners in jouw regio.
                            </p>
                            <div className="seo-meta">
                                <span>{categories.length} categorieen</span>
                                <span>{totalSubcategories} subcategorieen</span>
                                <span>Lokale bedrijven</span>
                            </div>
                            <div className="seo-hero-actions">
                                <Link href="/steden" className="seo-cta">
                                    Zoek per stad
                                </Link>
                                <Link href="/provincies" className="seo-chip">
                                    Provincies
                                </Link>
                            </div>
                        </div>
                        <div className="seo-hero-panel">
                            <div className="seo-icon-badge">📋</div>
                            <div className="seo-card-title">Categorie overzicht</div>
                            <p className="seo-card-meta">
                                Elke categorie bevat subcategorieen met gespecialiseerde bedrijven en diensten.
                            </p>
                            <div className="seo-stat-grid">
                                <div className="seo-stat">
                                    <span>Categorieen</span>
                                    {categories.length}
                                </div>
                                <div className="seo-stat">
                                    <span>Subcategorieen</span>
                                    {totalSubcategories}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Alle categorieen</h2>
                    <div className="seo-grid">
                        {categories.map((category: any) => {
                            const cleanSlug = stripSeoSlug(category.slug);
                            const displayName = cleanCategoryName(category.name);
                            const icon = CATEGORY_ICONS[cleanSlug] || "📁";
                            const subCount = category._count?.subcategories ?? category.subcategories?.length ?? 0;
                            const summary = category.description || buildCategorySummary(displayName);

                            return (
                                <Link
                                    key={category.id}
                                    href={`/categorieen/${cleanSlug}`}
                                    className="seo-card"
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                                    <div className="seo-card-title">{displayName}</div>
                                    <div className="seo-card-meta">{subCount} subcategorieen</div>
                                    <div className="seo-card-meta" style={{ marginTop: '0.5rem' }}>{summary}</div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Top Cities */}
                <section className="seo-section seo-surface">
                    <h2 className="seo-section-title">Populaire steden</h2>
                    <p className="seo-subtitle" style={{ marginBottom: '1.5rem' }}>
                        Combineer een categorie met een stad voor gerichte resultaten.
                    </p>
                    <div className="seo-chip-row">
                        {topCities.map((city) => (
                            <Link key={city.slug} href={`/steden/${city.slug}`} className="seo-chip">
                                {city.name}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Provinces */}
                <section className="seo-section">
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
                            <Link href="/wijken" className="seo-chip">
                                Zoek per wijk
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SEO Content */}
                <section className="seo-section">
                    <div className="seo-surface">
                        <h2 className="seo-section-title">Over onze categorieen</h2>
                        <p className="seo-subtitle">
                            Onze bedrijvengids bevat {categories.length} hoofdcategorieen met in totaal
                            {' '}{totalSubcategories} gespecialiseerde subcategorieen. Elke categorie groepeert
                            gerelateerde bedrijven en dienstverleners, waardoor je snel de juiste professional
                            vindt. Of je nu zoekt naar een restaurant, kapper, aannemer of advocaat - in onze
                            uitgebreide gids vind je altijd wat je nodig hebt.
                        </p>
                    </div>
                </section>
            </div>
        </main>
        </>
    );
}
