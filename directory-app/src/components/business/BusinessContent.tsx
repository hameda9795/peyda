"use client";

import { Business } from "@/lib/types";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewForm } from "./ReviewForm";
import Image from "next/image";

interface BusinessContentProps {
    business: Business;
}

export function BusinessContent({ business }: BusinessContentProps) {
    return (
        <div className="space-y-12">
            {/* Short Description, trust signals & highlights */}
            <section>
                <p className="text-base sm:text-xl md:text-2xl text-slate-800 leading-relaxed mb-6 sm:mb-8 font-medium">
                    {business.shortDescription}
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
                    {business.serviceArea && (
                        <span className="px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-medium shadow-sm max-w-full">
                            <span className="line-clamp-2">Bezorging: {business.serviceArea}</span>
                        </span>
                    )}
                    {business.foundedYear ? (
                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700 text-sm font-medium shadow-sm">
                            Sinds {business.foundedYear} actief
                        </span>
                    ) : null}
                    {business.certifications && business.certifications.length > 0 && (
                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 text-sm font-medium shadow-sm">
                            Certificering: {business.certifications[0]}
                        </span>
                    )}
                    {business.reviews.count > 0 && (
                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 text-sm font-medium shadow-sm">
                            {business.reviews.count}+ klantreviews
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                    {business.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-1.5 sm:p-2 rounded-full bg-emerald-500 text-white shrink-0 shadow-sm">
                                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <span className="text-slate-800 font-semibold text-sm sm:text-base leading-relaxed">{highlight}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    {(() => {
                        // Check for h2 or h3 tags
                        const hasH2 = business.longDescription.includes('<h2');
                        const hasH3 = business.longDescription.includes('<h3');

                        if (!hasH2 && !hasH3) {
                            // No heading tags, show all content in one box
                            return (
                                <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-slate-200 shadow-md">
                                    <div
                                        className="prose prose-base sm:prose-lg prose-slate max-w-none
                                        prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mb-3 sm:prose-headings:mb-4 prose-headings:mt-4 sm:prose-headings:mt-6
                                        prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 sm:prose-h2:pb-3
                                        prose-h3:text-lg sm:prose-h3:text-xl prose-h3:text-slate-800
                                        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4
                                        prose-a:text-blue-600 prose-a:font-medium hover:prose-a:text-blue-700
                                        prose-ul:my-3 sm:prose-ul:my-4 prose-li:text-slate-700 prose-li:my-1 sm:prose-li:my-2
                                        prose-strong:text-slate-900 prose-strong:font-semibold"
                                        dangerouslySetInnerHTML={{ __html: business.longDescription }}
                                    />
                                </div>
                            );
                        }

                        // Use h2 if available, otherwise use h3
                        const headingTag = hasH2 ? 'h2' : 'h3';
                        const headingRegex = hasH2 ? /<h2[^>]*>(.*?)<\/h2>/gi : /<h3[^>]*>(.*?)<\/h3>/gi;
                        const matches = [...business.longDescription.matchAll(headingRegex)];

                        if (matches.length === 0) {
                            // Fallback: show all content
                            return (
                                <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-2xl p-8 md:p-10 border border-slate-200 shadow-md">
                                    <div
                                        className="prose prose-lg prose-slate max-w-none"
                                        dangerouslySetInnerHTML={{ __html: business.longDescription }}
                                    />
                                </div>
                            );
                        }

                        const sections: { title: string; content: string }[] = [];
                        let lastIndex = 0;

                        matches.forEach((match, idx) => {
                            const fullMatch = match[0];
                            const titleText = match[1];
                            const startIndex = business.longDescription.indexOf(fullMatch, lastIndex);

                            // Get content between this heading and next heading (or end)
                            const nextMatch = matches[idx + 1];
                            const endIndex = nextMatch
                                ? business.longDescription.indexOf(nextMatch[0], startIndex + fullMatch.length)
                                : business.longDescription.length;

                            const content = business.longDescription.substring(startIndex + fullMatch.length, endIndex);

                            // Bold business name in title if it contains "over"
                            let displayTitle = titleText;
                            if (titleText.toLowerCase().includes('over') && titleText.includes(business.name)) {
                                displayTitle = titleText.replace(
                                    business.name,
                                    `<span class="font-black text-3xl">${business.name}</span>`
                                );
                            }

                            sections.push({ title: displayTitle, content });
                            lastIndex = endIndex;
                        });

                        return sections.map((section, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                                <h2
                                    className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-300"
                                    dangerouslySetInnerHTML={{ __html: section.title }}
                                />
                                <div
                                    className="prose prose-lg prose-slate max-w-none
                                    prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mb-4 prose-headings:mt-6
                                    prose-h3:text-xl prose-h3:text-slate-800
                                    prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
                                    prose-a:text-blue-600 prose-a:font-medium hover:prose-a:text-blue-700
                                    prose-ul:my-4 prose-li:text-slate-700 prose-li:my-2
                                    prose-strong:text-slate-900 prose-strong:font-semibold"
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </div>
                        ));
                    })()}
                </div>
            </section>

            {/* Services Section */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 flex items-center gap-2">
                    Diensten & Producten
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {business.services.map((service, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                            <div className="flex justify-between items-start gap-4 mb-3">
                                <h3 className="font-bold text-xl text-slate-900 leading-tight">{service.name}</h3>
                                {service.price && (
                                    <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold rounded-lg shrink-0 shadow-md">
                                        {service.price}
                                    </span>
                                )}
                            </div>
                            {service.description && (
                                <p className="text-slate-600 text-base leading-relaxed">{service.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Gallery Section */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Galerij</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {business.images.gallery.map((img: any, idx: number) => {
                        // Handle both string URLs and objects with url property
                        const imageUrl = typeof img === 'string' ? img : img?.url;
                        if (!imageUrl) return null;
                        return (
                            <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 bg-slate-100">
                                <Image
                                    src={imageUrl}
                                    alt={img?.altText || `${business.name} ${business.address.city} ${business.address.neighborhood} foto ${idx + 1} - ${business.category}`}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                        // If image fails to load, show a fallback
                                        (e.target as HTMLImageElement).src = '/images/placeholder-business.svg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* FAQ Accordion */}
            {business.faq && business.faq.length > 0 && (
                <section>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Veelgestelde Vragen</h2>
                    <div className="space-y-4">
                        {business.faq.map((item, idx) => (
                            <details key={idx} className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md open:shadow-lg open:border-blue-300 transition-all">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-slate-900 select-none group-hover:text-blue-600 transition-colors">
                                    {item.question}
                                    <ChevronDown className="w-6 h-6 text-slate-400 group-open:rotate-180 group-open:text-blue-600 transition-all duration-300" />
                                </summary>
                                <div className="px-6 pb-6 text-slate-700 text-base leading-relaxed border-t border-slate-200 mt-2 pt-4 animate-in fade-in slide-in-from-top-1">
                                    {item.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
            )}

            {/* Reviews Section */}
            <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Reviews</h2>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                        Bekijk alle {business.reviews.count} reviews
                    </button>
                </div>

                <ReviewForm businessId={business.id} />
                <div className="h-8" /> {/* Spacer */}

                <div className="space-y-6">
                    {business.reviews.items.map((review) => (
                        <div key={review.id} className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900">{review.author}</h4>
                                    <span className="text-sm text-slate-500">{review.date}</span>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={cn("w-5 h-5", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300")}>★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-700 text-base leading-relaxed">{review.content}</p>

                            {review.ownerResponse && (
                                <div className="mt-5 pl-5 border-l-4 border-emerald-500 bg-emerald-50/50 py-3 rounded-r-lg">
                                    <p className="text-sm font-bold text-emerald-900 mb-2">💬 Reactie van de eigenaar</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">"{review.ownerResponse}"</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

