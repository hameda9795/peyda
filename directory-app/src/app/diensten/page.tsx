import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { getCategories } from "@/lib/actions/categories";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";

export const metadata: Metadata = {
    title: "Diensten per Stad - Vind Lokale Bedrijven | Peyda",
    description: "Zoek bedrijven per stad en dienst. Vind de beste lokale professionals in jouw stad - van restaurants tot loodgieters, kappers en meer.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://peyda.nl'}/diensten`
    }
};

export default async function DienstenPage() {
    const categories = await getCategories();

    // Get major cities from each province
    const majorCities = NETHERLANDS_PROVINCES.flatMap(province =>
        province.cities.slice(0, 2).map(city => ({
            ...city,
            province: province.name
        }))
    ).slice(0, 12);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Diensten per Stad
                        </h1>
                        <p className="text-xl text-slate-300">
                            Vind de beste lokale bedrijven in jouw stad. Selecteer een stad en categorie
                            om direct te zoeken naar professionals in de buurt.
                        </p>
                    </div>
                </div>
            </div>

            {/* Popular Cities */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                        Populaire Steden
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {majorCities.map((city) => (
                            <Link
                                key={city.slug}
                                href={`/steden/${city.slug}`}
                                className="group bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {city.name}
                                        </h3>
                                        <p className="text-xs text-slate-500">{city.province}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-12 md:py-16 bg-white border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                        Categorieën
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categories.slice(0, 12).map((category: any) => (
                            <Link
                                key={category.id}
                                href={`/categorieen/${category.slug}`}
                                className="group bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {category.icon && (
                                            <span className="text-3xl">{category.icon}</span>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {category.businessCount || 0} bedrijven
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Search Grid */}
            <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                        Populaire Zoekopdrachten
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                        {majorCities.slice(0, 6).flatMap((city) =>
                            categories.slice(0, 2).map((category: any) => (
                                <Link
                                    key={`${city.slug}-${category.slug}`}
                                    href={`/diensten/${city.slug}/${category.slug}`}
                                    className="bg-white rounded-lg px-4 py-3 border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-sm text-slate-700 transition-colors text-center"
                                >
                                    {category.name} in {city.name}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* SEO Content */}
            <section className="py-12 md:py-16 bg-white border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-slate">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Lokale Bedrijven Vinden in Nederland
                        </h2>
                        <p className="text-slate-600">
                            Peyda is de meest complete bedrijvengids van Nederland. Of je nu op zoek bent naar
                            een restaurant in Amsterdam, een kapper in Utrecht, of een loodgieter in Rotterdam - wij
                            helpen je de beste lokale professionals te vinden.
                        </p>
                        <p className="text-slate-600">
                            Gebruik onze diensten per stad pagina's om snel bedrijven te vinden in jouw buurt.
                            Bekijk beoordelingen, vergelijk diensten en neem direct contact op met lokale ondernemers.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
