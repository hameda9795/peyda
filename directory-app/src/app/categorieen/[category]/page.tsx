import "@/app/seo.css";
import "@/app/home.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategoryBySlug } from "@/lib/actions/categories";
import { getBusinessesByCategorySlug } from "@/lib/actions/business";
import { CATEGORY_ICONS, getTopCities } from "@/lib/netherlands-data";
import { cleanCategoryName, cleanSubcategorySlug, stripSeoSlug } from "@/lib/seo-slug";
import { slugify } from "@/lib/slugify";
import { BusinessScrollSection } from "@/components/BusinessScrollSection";
import { db as prisma } from "@/lib/db";
import { CategoryContent } from "@/components/CategoryContent";
import { generateWebPageSchema, generateBreadcrumbSchema, generateFaqSchema, type FaqItem } from "@/lib/json-ld-schema";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peyda.nl';

type Props = {
    params: Promise<{ category: string }>;
};

const buildDescription = (name: string) =>
    `Ontdek subcategorieen, lokale bedrijven en diensten binnen ${name}.`;

const resolveCategory = async (slug: string) => {
    const direct = await getCategoryBySlug(slug);
    if (direct) return direct;
    const all = await getCategories();
    const normalized = stripSeoSlug(slug);
    return all.find((category: any) => stripSeoSlug(category.slug) === normalized) || null;
};

const buildBusinessHref = (business: any, fallbackCategorySlug: string) => {
    // Build full SEO URL: /province/city/neighborhood/category/subcategory/business
    const provinceSlug = business.provinceSlug || 'utrecht';
    const citySlug = business.citySlug || 'utrecht';
    const neighborhoodSlug = business.neighborhoodSlug || 'centrum';
    const categorySlug = business.categorySlug || fallbackCategorySlug || 'overig';
    const subcategorySlug = business.subcategorySlug || 'algemeen';

    return `/${provinceSlug}/${citySlug}/${neighborhoodSlug}/${categorySlug}/${subcategorySlug}/${business.slug}`;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category  } = await params;
    const categoryData = await resolveCategory(category);

    if (!categoryData) {
        return { title: "Categorie niet gevonden | NL Directory" };
    }

    const displayName = cleanCategoryName(categoryData.name);

    return {
        title: categoryData.seoTitle || `${displayName} | Lokale Bedrijvengids`,
        description: categoryData.seoDescription || `Vind lokale ${displayName.toLowerCase()} professionals. Bekijk subcategorieen en ontdek de beste bedrijven in jouw regio.`,
        openGraph: {
            title: `${displayName} | Bedrijfscategorie`,
            description: buildDescription(displayName),
        }
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category  } = await params;
    const categoryData = await resolveCategory(category);

    if (!categoryData) {
        notFound();
    }

    const displayName = cleanCategoryName(categoryData.name);
    const cleanCategorySlug = stripSeoSlug(categoryData.slug);
    const icon = CATEGORY_ICONS[cleanCategorySlug] || "📁";
    const subcategories = categoryData.subcategories || [];
    const businesses = await getBusinessesByCategorySlug(cleanCategorySlug, 8);
    const topCities = getTopCities(10);

    // Fetch generated content from database
    let generatedContent = null;
    try {
        const dbCategory = await prisma.category.findFirst({
            where: {
                OR: [
                    { slug: `/utrecht/${cleanCategorySlug}` },
                    { slug: `/nederland/${cleanCategorySlug}` },
                    { slug: cleanCategorySlug },
                    { slug: { contains: cleanCategorySlug, mode: 'insensitive' } },
                ],
            },
            select: {
                contentIntro: true,
                contentHistory: true,
                contentTypes: true,
                contentTips: true,
                contentLocal: true,
                keywords: true,
                faqs: true,
            },
        });

        if (dbCategory && dbCategory.contentIntro) {
            generatedContent = {
                intro: dbCategory.contentIntro,
                history: dbCategory.contentHistory || '',
                types: dbCategory.contentTypes || '',
                tips: dbCategory.contentTips || '',
                local: dbCategory.contentLocal || '',
                keywords: dbCategory.keywords || [],
                faqs: (dbCategory.faqs as any) || [],
            };
        }
    } catch (error) {
        console.error('Error fetching generated content:', error);
    }

    // Generate JSON-LD schemas
    const pageUrl = `${BASE_URL}/categorieen/${cleanCategorySlug}`;
    const breadcrumbs = [
        { name: "Home", url: BASE_URL, position: 1 },
        { name: "Categorieën", url: `${BASE_URL}/categorieen`, position: 2 },
        { name: displayName, url: pageUrl, position: 3 },
    ];

    // Generate FAQs from content
    let faqs: FaqItem[] = [];
    if (generatedContent && generatedContent.faqs && generatedContent.faqs.length > 0) {
        faqs = generatedContent.faqs;
    } else {
        faqs = [
            {
                question: `Wat is ${displayName.toLowerCase()}?`,
                answer: generatedContent?.intro || `${displayName} omvat professionals en bedrijven die gespecialiseerde diensten aanbieden binnen dit vakgebied.`
            },
            {
                question: `Hoe vind ik een goede ${displayName.toLowerCase()}?`,
                answer: `Gebruik onze gids om lokale ${displayName.toLowerCase()} professionals te vinden. U kunt zoeken per stad, provincie of wijk.`
            },
            {
                question: `Welke subcategorieën vallen onder ${displayName}?`,
                answer: `Er zijn ${subcategories.length} subcategorieën beschikbaar, waaronder ${subcategories.slice(0, 3).map((s: any) => s.name).join(', ')} en meer.`
            }
        ];
    }

    const schemaScripts = JSON.stringify([
        generateWebPageSchema({
            name: `${displayName} | Lokale Bedrijvengids`,
            description: `Vind lokale ${displayName.toLowerCase()} professionals. Bekijk subcategorieën en ontdek de beste bedrijven in jouw regio.`,
            url: pageUrl
        }),
        generateBreadcrumbSchema(breadcrumbs),
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
                    <Link href="/categorieen">Categorieen</Link>
                    <span>/</span>
                    <span>{displayName}</span>
                </nav>

                {/* Hero Section */}
                <section className="seo-hero">
                    <div className="seo-hero-grid">
                        <div>
                            <span className="seo-kicker">{icon} Categorie</span>
                            <h1 className="seo-title">{displayName}</h1>
                            <p className="seo-subtitle">
                                Vind lokale {displayName.toLowerCase()} professionals en bedrijven.
                                Bekijk {subcategories.length} gespecialiseerde subcategorieen en ontdek
                                de beste dienstverleners in jouw regio.
                            </p>
                            <div className="seo-meta">
                                <span>{subcategories.length} subcategorieen</span>
                                <span>{businesses.length}+ bedrijven</span>
                                <span>Lokale professionals</span>
                            </div>
                            <div className="seo-hero-actions">
                                <Link href={`/nederland/${cleanCategorySlug}`} className="seo-cta">
                                    Bekijk alle bedrijven
                                </Link>
                                <Link href="/categorieen" className="seo-chip">
                                    Alle categorieen
                                </Link>
                            </div>
                        </div>
                        <div className="seo-hero-panel">
                            <div className="seo-icon-badge">{icon}</div>
                            <div className="seo-card-title">{displayName}</div>
                            <p className="seo-card-meta">
                                {categoryData.description || `Ontdek ${displayName.toLowerCase()} professionals in heel Nederland.`}
                            </p>
                            <div className="seo-stat-grid">
                                <div className="seo-stat">
                                    <span>Subcategorieen</span>
                                    {subcategories.length}
                                </div>
                                <div className="seo-stat">
                                    <span>Bedrijven</span>
                                    {businesses.length}+
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Generated Content */}
                {generatedContent && (
                    <div className="seo-container">
                        <CategoryContent
                            categorySlug={cleanCategorySlug}
                            categoryName={displayName}
                            city="Nederland"
                            initialContent={generatedContent}
                        />
                    </div>
                )}

                {/* Subcategories Section */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Subcategorieen in {displayName}</h2>
                    {subcategories.length > 0 ? (
                        <div className="seo-grid">
                            {subcategories.map((sub: any) => {
                                const subSlug = cleanSubcategorySlug(sub.slug || slugify(sub.name), cleanCategorySlug);
                                return (
                                    <Link
                                        key={sub.id}
                                        href={`/categorieen/${cleanCategorySlug}/${subSlug}`}
                                        className="seo-card"
                                    >
                                        <div className="seo-card-title">{sub.name}</div>
                                        <div className="seo-card-meta">
                                            {sub.description || `Vind ${sub.name.toLowerCase()} specialisten in jouw regio.`}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="seo-empty">
                            <div className="seo-empty-icon">📂</div>
                            <div className="seo-empty-title">Nog geen subcategorieen</div>
                            <p className="seo-empty-text">
                                We voegen binnenkort subcategorieen toe.
                            </p>
                        </div>
                    )}
                </section>
            </div>

            {/* Featured Businesses - Full width scroll section */}
            {businesses.length > 0 ? (
                <BusinessScrollSection
                    title={`Populaire bedrijven in ${displayName}`}
                    businesses={businesses}
                    viewAllHref={`/categorieen/${cleanCategorySlug}`}
                    viewAllText="Bekijk alle bedrijven"
                    accentIndex={0}
                />
            ) : (
                <div className="seo-container">
                    <section className="seo-section seo-surface">
                        <div className="seo-empty">
                            <div className="seo-empty-icon">🏢</div>
                            <div className="seo-empty-title">Nog geen bedrijven</div>
                            <p className="seo-empty-text">
                                We voegen dagelijks nieuwe bedrijven toe aan deze categorie.
                            </p>
                        </div>
                    </section>
                </div>
            )}

            <div className="seo-container">
                {/* Cities */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Zoek {displayName} per stad</h2>
                    <div className="seo-chip-row">
                        {topCities.map((city) => (
                            <Link key={city.slug} href={`/steden/${city.slug}`} className="seo-chip">
                                {city.name}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Related Links */}
                <section className="seo-section">
                    <h2 className="seo-section-title">Meer ontdekken</h2>
                    <div className="seo-rail">
                        <div className="seo-rail-item">
                            <Link href="/categorieen" className="seo-chip">
                                Alle categorieen
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href={`/nederland/${cleanCategorySlug}`} className="seo-chip">
                                Alle {displayName.toLowerCase()} bedrijven
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/steden" className="seo-chip">
                                Zoek per stad
                            </Link>
                        </div>
                        <div className="seo-rail-item">
                            <Link href="/provincies" className="seo-chip">
                                Zoek per provincie
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Fallback SEO Content - Only show if no AI content */}
                {!generatedContent && (
                    <section className="seo-section">
                        <div className="seo-surface">
                            <h2 className="seo-section-title">Over {displayName}</h2>
                            <p className="seo-subtitle">
                                In onze {displayName.toLowerCase()} categorie vind je {subcategories.length} gespecialiseerde
                                subcategorieen met lokale professionals en bedrijven in heel Nederland.
                                Of je nu in Amsterdam, Rotterdam, Utrecht of een kleinere gemeente woont -
                                wij helpen je de beste {displayName.toLowerCase()} dienstverleners te vinden in jouw regio.
                            </p>
                        </div>
                    </section>
                )}
            </div>
        </main>
        </>
    );
}
