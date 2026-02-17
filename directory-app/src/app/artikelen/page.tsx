import { getArticles } from "@/lib/blog-data";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Calendar, User, ArrowRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peyda.nl';

export const metadata: Metadata = {
    title: "Artikelen & Tips voor Ondernemers | Peyda",
    description: "Ontdek tips, gidsen en verhalen over lokale bedrijven in Nederland. Van restauranttips tot ondernemersadvies - alles voor lokale professionals.",
    alternates: {
        canonical: `${BASE_URL}/artikelen`
    },
    openGraph: {
        title: "Artikelen & Tips voor Ondernemers | Peyda",
        description: "Ontdek tips, gidsen en verhalen over lokale bedrijven in Nederland.",
        url: `${BASE_URL}/artikelen`,
        type: "website",
        locale: "nl_NL",
    }
};

export default function ArticlesPage() {
    const articles = getArticles();
    const featuredArticle = articles[0];
    const otherArticles = articles.slice(1);

    // JSON-LD Schema - ItemList for articles
    const articleListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Artikelen & Tips | Peyda",
        "description": "Artikelen en tips voor ondernemers en lokale bedrijven in Nederland",
        "numberOfItems": articles.length,
        "itemListElement": articles.map((article, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Article",
                "headline": article.title,
                "description": article.excerpt,
                "image": article.image,
                "url": `${BASE_URL}/artikelen/${article.slug}`,
                "datePublished": article.date,
                "author": {
                    "@type": "Person",
                    "name": article.author.name
                }
            }
        }))
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": BASE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Artikelen",
                "item": `${BASE_URL}/artikelen`
            }
        ]
    };

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* JSON-LD Schemas */}
            <Script
                id="articlelist-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleListSchema) }}
            />
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <nav className="flex items-center justify-center gap-2 text-sm text-indigo-300 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-white">Artikelen</span>
                    </nav>
                    <h1 className="text-4xl font-bold text-white mb-4">Artikelen & Tips</h1>
                    <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                        Inspiratie, tips en verhalen voor ondernemers. Ontdek de beste lokale bedrijven en krijg waardevolle inzichten.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10">
                {/* Featured Article */}
                <Link
                    href={`/artikelen/${featuredArticle.slug}`}
                    className="block relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/50 hover:shadow-2xl transition-all duration-300 group mb-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="relative h-64 md:h-auto overflow-hidden">
                            <Image
                                src={featuredArticle.image}
                                alt={featuredArticle.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                                    {featuredArticle.category}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> {featuredArticle.date}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-zinc-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                {featuredArticle.title}
                            </h2>
                            <p className="text-zinc-600 mb-6 text-lg leading-relaxed line-clamp-2">
                                {featuredArticle.excerpt}
                            </p>
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                    <Image
                                        src={featuredArticle.author.avatar}
                                        alt={featuredArticle.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-zinc-900">{featuredArticle.author.name}</p>
                                    <p className="text-zinc-500">Redacteur</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherArticles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/artikelen/${article.slug}`}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-zinc-100"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-900 z-10">
                                    {article.category}
                                </span>
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                                    <Calendar className="h-3.5 w-3.5" /> {article.date}
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-zinc-500 text-sm line-clamp-3 mb-6">
                                    {article.excerpt}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100">
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                            <Image
                                                src={article.author.avatar}
                                                alt={article.author.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-600">{article.author.name}</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
