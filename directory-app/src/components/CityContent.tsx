'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Building, Info } from 'lucide-react';

interface CityContentProps {
  citySlug: string;
  cityName: string;
  province?: string;
  initialContent?: {
    intro: string;
    history: string;
    economy: string;
    landmarks: string;
    localTips: string;
    keywords: string[];
    faqs?: { question: string; answer: string }[];
  };
}

export function CityContent({
  citySlug,
  cityName,
  province = '',
  initialContent,
}: CityContentProps) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(!initialContent);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!content) {
      fetchContent();
    }
  }, [citySlug]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/generate-city-content?citySlug=${citySlug}`);
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
      <div className="city-content-loading py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mt-8"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="city-content bg-white rounded-xl shadow-lg p-6 md:p-10 my-8">
      {/* Hero Section */}
      <div className="border-b border-gray-200 pb-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-blue-600" />
          <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            {province || 'Nederland'}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {cityName}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {content.intro}
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* History */}
        <section className="content-block">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" />
            Geschiedenis van {cityName}
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {content.history}
          </p>
        </section>

        {/* Economy */}
        <section className="content-block bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-6 h-6 text-green-600" />
            Economie en Zakelijke Kansen
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {content.economy}
          </p>
        </section>

        {/* Landmarks */}
        <section className="content-block">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-orange-500" />
            Bezienswaardigheden
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {content.landmarks}
          </p>
        </section>

        {/* Local Tips */}
        <section className="content-block border-l-4 border-purple-500 pl-6 py-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Lokale Tips
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {content.localTips}
          </p>
        </section>

        {/* FAQs */}
        {content.faqs && content.faqs.length > 0 && (
          <section className="content-block mt-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Veelgestelde Vragen over {cityName}
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
              {content.keywords.slice(0, 15).map((keyword, index) => (
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

// Loading skeleton
export function CityContentSkeleton() {
  return (
    <div className="city-content bg-white rounded-xl shadow-lg p-6 md:p-10 my-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mt-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}
