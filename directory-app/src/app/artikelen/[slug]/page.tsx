import { getArticleBySlug, getArticles } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Calendar, ChevronLeft, Share2, Clock, Facebook, Twitter, Linkedin } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nldirectory.nl';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) return { title: "Artikel niet gevonden" };

    return {
        title: `${article.title} | NL Directory`,
        description: article.excerpt,
        alternates: {
            canonical: `${BASE_URL}/artikelen/${slug}`
        },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: [article.image],
            type: "article",
            locale: "nl_NL",
            url: `${BASE_URL}/artikelen/${slug}`,
            publishedTime: article.date,
            authors: [article.author.name],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.excerpt,
            images: [article.image],
        }
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) notFound();

    // Find related businesses - TODO: Implement with real database query
    const relatedBusinesses: any[] = [];

    // JSON-LD Schema - Article
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "image": article.image,
        "datePublished": article.date,
        "dateModified": article.date,
        "author": {
            "@type": "Person",
            "name": article.author.name,
            "image": article.author.avatar
        },
        "publisher": {
            "@type": "Organization",
            "name": "NL Directory",
            "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/images/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${BASE_URL}/artikelen/${slug}`
        },
        "articleSection": article.category,
        "inLanguage": "nl-NL"
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
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `${BASE_URL}/artikelen/${slug}`
            }
        ]
    };

    return (
        <article className="min-h-screen bg-white pb-20">
            {/* JSON-LD Schemas */}
            <Script
                id="article-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Hero Image */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full z-20 pb-12 pt-32 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <Link
                            href="/artikelen"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full text-sm font-medium"
                        >
                            <ChevronLeft className="h-4 w-4" /> Terug naar overzicht
                        </Link>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                                    <Image
                                        src={article.author.avatar}
                                        alt={article.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">{article.author.name}</span>
                                    <span className="text-xs opacity-80">Redacteur</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/20" />
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 opacity-80" />
                                <span>{article.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 opacity-80" />
                                <span>5 min leestijd</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">

                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-img:rounded-3xl prose-img:shadow-lg">
                            {/* Render HTML content safely */}
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </div>

                        {/* Social Share */}
                        <div className="mt-12 pt-8 border-t border-zinc-100 flex items-center justify-between">
                            <span className="font-bold text-zinc-900">Deel dit artikel:</span>
                            <div className="flex gap-3">
                                <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-blue-600 hover:text-white transition-colors">
                                    <Facebook className="h-4 w-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-sky-500 hover:text-white transition-colors">
                                    <Twitter className="h-4 w-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-blue-700 hover:text-white transition-colors">
                                    <Linkedin className="h-4 w-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-indigo-600 hover:text-white transition-colors">
                                    <Share2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3 space-y-8">
                        {relatedBusinesses.length > 0 && (
                            <div className="bg-zinc-50 rounded-2xl p-6 lg:sticky lg:top-24">
                                <h3 className="font-bold text-lg text-zinc-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-indigo-600 rounded-full" />
                                    Genoemd in dit artikel
                                </h3>
                                <div className="space-y-4">
                                    {relatedBusinesses.map(business => (
                                        <Link
                                            key={business.id}
                                            href={`/utrecht/bedrijf/${business.id}`} // Should use slug in real app
                                            className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                                        >
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                                <Image
                                                    src={business.image}
                                                    alt={business.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                    {business.name}
                                                </h4>
                                                <div className="flex items-center gap-1 text-yellow-500 text-xs mb-1">
                                                    <span className="font-bold text-zinc-900">{business.rating}</span>
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className={`w-3 h-3 ${i < Math.floor(business.rating) ? "fill-current" : "text-zinc-200 fill-current"}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                    ))}
                                                    <span className="text-zinc-400 ml-1">({business.reviewCount})</span>
                                                </div>
                                                <p className="text-xs text-zinc-500 line-clamp-1">{business.category}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-xl mb-3">Blijf op de hoogte</h3>
                                <p className="text-indigo-200 text-sm mb-6">Ontvang wekelijks tips over lokale bedrijven en ondernemerschap.</p>
                                <input type="email" placeholder="Jouw emailadres" className="w-full px-4 py-3 rounded-xl text-zinc-900 text-sm mb-3 outline-none focus:ring-2 focus:ring-white/50" />
                                <button className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">Inschrijven</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}
