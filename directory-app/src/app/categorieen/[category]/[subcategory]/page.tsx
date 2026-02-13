import "@/app/seo.css";
import "@/app/home.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/lib/actions/categories";
import { getBusinessesBySubcategory } from "@/lib/data";
import { cleanCategoryName, cleanSubcategorySlug, stripSeoSlug } from "@/lib/seo-slug";
import { CATEGORY_ICONS, getTopCities } from "@/lib/netherlands-data";
import { BusinessScrollSection } from "@/components/BusinessScrollSection";

type Props = {
    params: Promise<{ category: string; subcategory: string }>;
};

const buildDescription = (subcategory: string, city?: string) =>
    `Lokale bedrijven en specialisten voor ${subcategory.toLowerCase()}${city ? ` in ${city}` : ""}.`;

const buildBusinessHref = (business: any, categorySlug: string, subcategorySlug: string) => {
    // Build full SEO URL: /province/city/neighborhood/category/subcategory/business
    const provinceSlug = business.provinceSlug || 'utrecht';
    const citySlug = business.citySlug || 'utrecht';
    const neighborhoodSlug = business.neighborhoodSlug || 'centrum';

    return `/${provinceSlug}/${citySlug}/${neighborhoodSlug}/${categorySlug}/${subcategorySlug}/${business.slug}`;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category, subcategory  } = await params;
    const sub = await getSubcategoryBySlug(category, subcategory);

    if (!sub) {
        return { title: "Subcategorie niet gevonden | NL Directory" };
    }

    const categoryDisplayName = cleanCategoryName(sub.category.name);

    return {
        title: sub.seoTitle || `${sub.name} | ${categoryDisplayName} - Lokale Bedrijvengids`,
        description: sub.seoDescription || `Vind ${sub.name.toLowerCase()} specialisten in jouw regio. Bekijk lokale bedrijven en dienstverleners.`,
        openGraph: {
            title: `${sub.name} | ${categoryDisplayName}`,
            description: buildDescription(sub.name),
        }
    };
}

export default async function SubcategoryPage({ params }: Props) {
    const { category, subcategory  } = await params;
    const sub = await getSubcategoryBySlug(category, subcategory);

    if (!sub) {
        notFound();
    }

    const categorySlug = stripSeoSlug(sub.category.slug);
    const subcategorySlug = cleanSubcategorySlug(sub.slug, categorySlug);
    const categoryDisplayName = cleanCategoryName(sub.category.name);
    const icon = CATEGORY_ICONS[categorySlug] || "📁";
    const businesses = await getBusinessesBySubcategory(sub.category.name, sub.name);
    const categoryData = await getCategoryBySlug(categorySlug);
    const relatedSubcategories = categoryData?.subcategories?.filter(
        (item: any) => item.slug !== sub.slug
    )?.slice(0, 8) || [];
    const topCities = getTopCities(8);

    return (
        <main className="seo-shell">
            <div className="seo-container">
                {/* Breadcrumb */}
                <nav className="seo-breadcrumb">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/categorieen">Categorieen</Link>
                    <span>/</span>
                    <Link href={`/categorieen/${categorySlug}`}>{categoryDisplayName}</Link>
                    <span>/</span>
                    <span>{sub.name}</span>
                </nav>

                {/* Hero Section */}
                <section className="seo-hero">
                    <div className="seo-hero-grid">
                        <div>
                            <span className="seo-kicker">{icon} Subcategorie</span>
                            <h1 className="seo-title">{sub.name}</h1>
                            <p className="seo-subtitle">
                                Vind de beste {sub.name.toLowerCase()} specialisten en bedrijven in Nederland.
                                Bekijk lokale professionals in jouw regio en vergelijk diensten, reviews en prijzen.
                            </p>
                            <div className="seo-meta">
                                <span>📂 {categoryDisplayName}</span>
                                <span>{businesses.length}+ bedrijven</span>
                                <span>Lokale experts</span>
                            </div>
                            <div className="seo-hero-actions">
                                <Link href={`/nederland/${categorySlug}/${subcategorySlug}`} className="seo-cta">
                                    Bekijk alle bedrijven
                                </Link>
                                <Link href={`/categorieen/${categorySlug}`} className="seo-chip">
                                    Terug naar {categoryDisplayName}
                                </Link>
                            </div>
                        </div>
                        <div className="seo-hero-panel">
                            <div className="seo-icon-badge">{icon}</div>
                            <div className="seo-card-title">{sub.name}</div>
                            <p className="seo-card-meta">
                                {sub.description || `Gespecialiseerde ${sub.name.toLowerCase()} dienstverleners in heel Nederland.`}
                            </p>
                            <div className="seo-stat-grid">
                                <div className="seo-stat">
                                    <span>Categorie</span>
                                    {categoryDisplayName}
                                </div>
                                <div className="seo-stat">
                                    <span>Bedrijven</span>
                                    {businesses.length}+
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Businesses Section - Full width scroll */}
            {businesses.length > 0 ? (
                <BusinessScrollSection
                    title={`Bedrijven in ${sub.name}`}
                    businesses={businesses as any}
                    viewAllHref={`/categorieen/${categorySlug}/${subcategorySlug}`}
                    viewAllText="Bekijk alle bedrijven"
                    accentIndex={0}
                />
            ) : (
                <div className="seo-container">
                    <section className="seo-section">
                        <div className="seo-empty">
                            <div className="seo-empty-icon">🏢</div>
                            <div className="seo-empty-title">Nog geen bedrijven</div>
                            <p className="seo-empty-text">
                                We voegen binnenkort {sub.name.toLowerCase()} bedrijven toe.
                            </p>
                        </div>
                    </section>
                </div>
            )}

            <div className="seo-container">
                {/* Cities */}
                <section className="seo-section seo-surface">
                    <h2 className="seo-section-title">Zoek {sub.name} per stad</h2>
                    <div className="seo-chip-row">
                        {topCities.map((city) => (
                            <Link key={city.slug} href={`/steden/${city.slug}`} className="seo-chip">
                                {city.name}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Related Subcategories */}
                {relatedSubcategories.length > 0 && (
                    <section className="seo-section">
                        <h2 className="seo-section-title">Andere {categoryDisplayName.toLowerCase()} subcategorieen</h2>
                        <div className="seo-chip-row">
                            {relatedSubcategories.map((item: any) => {
                                const relatedSlug = cleanSubcategorySlug(item.slug, categorySlug);
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/categorieen/${categorySlug}/${relatedSlug}`}
                                        className="seo-chip"
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Related Links */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Meer ontdekken</h2>
                    <div className="seo-rail">
                        <div className="seo-rail-item">
                            <Link href={`/categorieen/${categorySlug}`} className="seo-chip">
                                Alle {categoryDisplayName.toLowerCase()} subcategorieen
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/categorieen" className="seo-chip">
                                Alle categorieen
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/steden" className="seo-chip">
                                Zoek per stad
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
                        <h2 className="seo-section-title">Over {sub.name}</h2>
                        <p className="seo-subtitle">
                            {sub.name} is een subcategorie binnen {categoryDisplayName.toLowerCase()}.
                            In onze bedrijvengids vind je {businesses.length > 0 ? `${businesses.length}+ gespecialiseerde` : 'diverse'}
                            {' '}{sub.name.toLowerCase()} professionals en bedrijven in heel Nederland.
                            Of je nu in een grote stad of een kleinere gemeente woont - wij helpen je de beste
                            lokale dienstverleners te vinden.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
