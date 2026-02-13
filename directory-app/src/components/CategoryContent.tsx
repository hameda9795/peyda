'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Star, Info } from 'lucide-react';

interface CategoryContentProps {
  categorySlug: string;
  categoryName: string;
  city?: string;
  initialContent?: {
    intro: string;
    history: string;
    types: string;
    tips: string;
    local: string;
    keywords: string[];
    faqs?: { question: string; answer: string }[];
  };
}

export function CategoryContent({
  categorySlug,
  categoryName,
  city = 'Utrecht',
  initialContent,
}: CategoryContentProps) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(!initialContent);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!content) {
      fetchContent();
    }
  }, [categorySlug]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/generate-category-content?categorySlug=${categorySlug}&city=${city}`);
      const data = await response.json();
      if (data.success) {
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="category-content-loading py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="category-content bg-white rounded-xl shadow-lg p-6 md:p-10 my-8">
      {/* SEO Content Sections */}
      <div className="space-y-8">
        {/* Introduction */}
        <section className="content-block">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Over {categoryName.toLowerCase()} in {city}
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {content.intro}
          </p>
        </section>

        {/* History */}
        <section className="content-block border-l-4 border-blue-500 pl-6 py-2">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Geschiedenis en Achtergrond
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {content.history}
          </p>
        </section>

        {/* Types */}
        <section className="content-block">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Soorten {categoryName.toLowerCase()}
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>{content.types}</p>
          </div>
        </section>

        {/* Tips */}
        <section className="content-block bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-green-600" />
            Praktische Tips
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {content.tips}
          </p>
        </section>

        {/* Local */}
        <section className="content-block border-l-4 border-orange-500 pl-6 py-2">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Lokaal in {city}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {content.local}
          </p>
        </section>

        {/* FAQs */}
        {content.faqs && content.faqs.length > 0 && (
          <section className="content-block mt-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Veelgestelde Vragen
            </h3>
            <div className="space-y-3">
              {content.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-4 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 py-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Keywords */}
        {content.keywords && content.keywords.length > 0 && (
          <section className="content-block mt-8 pt-8 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Gerelateerde zoektermen:
            </h4>
            <div className="flex flex-wrap gap-2">
              {content.keywords.slice(0, 20).map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Loading skeleton component
export function CategoryContentSkeleton() {
  return (
    <div className="category-content bg-white rounded-xl shadow-lg p-6 md:p-10 my-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mt-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mt-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}
