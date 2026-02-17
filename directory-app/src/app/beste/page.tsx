import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";
import { Award, MapPin, ArrowRight, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
    title: "Beste Bedrijven per Stad - Top 10 Vergelijkingen | Peyda",
    description: "Vind de beste bedrijven in jouw stad. Vergelijk top-rated restaurants, loodgieters, kappers en meer. Gebaseerd op echte klantbeoordelingen.",
    keywords: [
        "beste bedrijven nederland",
        "top bedrijven vergelijken",
        "beste restaurants",
        "beste loodgieters",
        "bedrijven bij mij in de buurt",
        "lokale bedrijven vergelijken"
    ],
    alternates: {
        canonical: "https://peyda.nl/beste",
    },
};

// Helper to create slug
const createSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export default async function BestePage() {
    // Get all categories
    const categories = await db.category.findMany({
        orderBy: { name: 'asc' }
    });

    // Get top cities by business count
    const topCities = await db.business.groupBy({
        by: ['city'],
        where: { status: 'approved' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 12
    });

    // Clean category names
    const cleanCategories = categories.map(cat => ({
        ...cat,
        name: cat.name?.replace(' in Utrecht', '').replace(' in Nederland', '') || cat.name,
        slug: createSlug(cat.name?.replace(' in Utrecht', '').replace(' in Nederland', '') || '')
    }));

    // Map cities with province info
    const citiesWithInfo = topCities.map(c => {
        let provinceInfo = null;
        for (const province of NETHERLANDS_PROVINCES) {
            const city = province.cities.find(pc =>
                pc.name.toLowerCase() === (c.city || '').toLowerCase()
            );
            if (city) {
                provinceInfo = { city, province };
                break;
            }
        }
        return {
            name: c.city || 'Onbekend',
            slug: provinceInfo?.city.slug || createSlug(c.city || ''),
            province: provinceInfo?.province.name || 'Nederland',
            count: c._count.id
        };
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-2 text-amber-200 mb-4">
                            <Award className="w-5 h-5" />
                            <span>Top 10 Vergelijkingen</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Beste Bedrijven in Nederland
                        </h1>
                        <p className="text-xl text-amber-100 mb-6">
                            Vergelijk de beste bedrijven in jouw stad. Van restaurants tot loodgieters,
                            van kappers tot advocaten. Gebaseerd op echte klantbeoordelingen.
                        </p>
                    </div>
                </div>
            </section>

            {/* Popular Cities */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    Populaire Steden
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {citiesWithInfo.map((city) => (
                        <div
                            key={city.slug}
                            className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="font-bold text-slate-800 mb-1">{city.name}</h3>
                            <p className="text-sm text-slate-500 mb-3">{city.province}</p>
                            <p className="text-xs text-slate-400 mb-3">{city.count} bedrijven</p>
                            <div className="space-y-1">
                                {cleanCategories.slice(0, 3).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/beste/${city.slug}/${cat.slug}`}
                                        className="block text-sm text-blue-600 hover:text-blue-800 truncate"
                                    >
                                        Beste {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Grid */}
            <section className="bg-slate-50 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        Alle Categorieën
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cleanCategories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                            >
                                <h3 className="font-bold text-slate-800 mb-4 text-lg">
                                    {category.name}
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-600 mb-3">
                                        Vind de beste {category.name} in:
                                    </p>
                                    {citiesWithInfo.slice(0, 5).map((city) => (
                                        <Link
                                            key={`${category.id}-${city.slug}`}
                                            href={`/beste/${city.slug}/${category.slug}`}
                                            className="flex items-center justify-between text-sm text-slate-700 hover:text-blue-600 py-1"
                                        >
                                            <span>Beste {category.name} in {city.name}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Content */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto prose prose-slate">
                    <h2>Waarom onze vergelijkingen gebruiken?</h2>
                    <p>
                        Op Peyda helpen we je de beste lokale bedrijven te vinden in jouw stad.
                        Onze vergelijkingen zijn gebaseerd op echte klantbeoordelingen, zodat je een
                        weloverwogen keuze kunt maken.
                    </p>
                    <h3>Hoe werken onze Top 10 lijsten?</h3>
                    <p>
                        We verzamelen beoordelingen en reviews van echte klanten. Bedrijven worden
                        gerangschikt op basis van hun gemiddelde score, het aantal reviews, en de
                        kwaliteit van hun dienstverlening.
                    </p>
                    <h3>Bedrijven bij mij in de buurt</h3>
                    <p>
                        Kies je stad en categorie om de beste bedrijven in jouw omgeving te vinden.
                        Van Amsterdam tot Maastricht, van restaurants tot loodgieters - wij hebben
                        de informatie die je nodig hebt.
                    </p>
                </div>
            </section>
        </div>
    );
}
