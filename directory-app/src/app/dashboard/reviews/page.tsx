"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { Star, Send, Copy, Check, MessageSquare, AlertCircle } from "lucide-react";
import { respondToReview } from "../actions";

const mockReviews = [
    {
        id: "1",
        author: "Jan de Vries",
        rating: 5,
        content: "Geweldige service en uitstekend eten! De pasta was perfect bereid en het personeel was zeer vriendelijk.",
        date: "2 dagen geleden",
        hasResponse: false
    },
    {
        id: "2",
        author: "Maria Jansen",
        rating: 4,
        content: "Goed restaurant, iets lange wachttijd maar het eten maakte het goed. Zeker een aanrader!",
        date: "5 dagen geleden",
        hasResponse: true,
        ownerResponse: "Bedankt voor uw review Maria! We werken aan kortere wachttijden."
    },
    {
        id: "3",
        author: "Pieter Bakker",
        rating: 5,
        content: "Beste Italiaanse restaurant in Amsterdam! Al jaren vaste klant.",
        date: "1 week geleden",
        hasResponse: true,
        ownerResponse: "Dank u wel Pieter! Fijn dat u al zo lang bij ons komt."
    },
    {
        id: "4",
        author: "Sophie Vermeer",
        rating: 3,
        content: "Eten was prima, maar de prijs-kwaliteitverhouding kan beter.",
        date: "2 weken geleden",
        hasResponse: false
    },
];

export default function ReviewsPage({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
    const params = use(searchParams);
    const searchParamsHook = useSearchParams();
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState(mockReviews);
    const [stats, setStats] = useState({
        totalReviews: mockReviews.length,
        avgRating: 4.5,
        pendingResponses: mockReviews.filter(r => !r.hasResponse).length
    });
    // Use either the resolved params or searchParams hook
    const businessId = params.businessId || searchParamsHook?.get("businessId") || undefined;

    const reviewLink = "https://peyda.nl/review/voorbeeld-restaurant";

    // Fetch real data
    useEffect(() => {
        async function fetchData() {
            try {
                const url = businessId
                    ? `/api/dashboard/reviews?businessId=${businessId}`
                    : '/api/dashboard/reviews';
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data.reviews.map((r: any) => ({
                        ...r,
                        date: new Date(r.date).toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' })
                    })));
                    setStats(data.stats);
                }
            } catch (error) {
                console.log('Using mock data');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [businessId]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(reviewLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmitResponse = async (reviewId: string) => {
        if (!responses[reviewId]?.trim()) return;

        try {
            const result = await respondToReview(reviewId, responses[reviewId]);
            if (result.success) {
                // Update local state
                setReviews(reviews.map(r =>
                    r.id === reviewId
                        ? { ...r, hasResponse: true, ownerResponse: responses[reviewId] }
                        : r
                ));
                setStats({ ...stats, pendingResponses: stats.pendingResponses - 1 });
                setResponses({ ...responses, [reviewId]: "" });
            } else {
                alert(result.error || 'Er is iets misgegaan');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Er is iets misgegaan');
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Beoordelingen</h1>
                        <p className="text-slate-600 mt-1">
                            Beheer uw reviews en vraag nieuwe beoordelingen aan
                        </p>
                    </div>
                    <button
                        onClick={() => setShowRequestForm(!showRequestForm)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Vraag Review Aan
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-yellow-600 fill-current" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{avgRating}</p>
                            <p className="text-sm text-slate-500">Gemiddelde</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">Gebaseerd op {stats.totalReviews} reviews</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.totalReviews}</p>
                            <p className="text-sm text-slate-500">Totaal Reviews</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">Laatste 30 dagen: +3</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            stats.pendingResponses > 0 ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                            <AlertCircle className={`w-5 h-5 ${
                                stats.pendingResponses > 0 ? 'text-red-600' : 'text-green-600'
                            }`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.pendingResponses}</p>
                            <p className="text-sm text-slate-500">Nog te beantwoorden</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">
                        {stats.pendingResponses > 0 ? 'Reageer snel!' : 'Alles up-to-date'}
                    </p>
                </div>
            </div>

            {/* Request Review Form */}
            {showRequestForm && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-bold text-slate-800 mb-4">Vraag een beoordeling aan</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Deel deze link met tevreden klanten. Ze kunnen direct een review achterlaten.
                    </p>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={reviewLink}
                            readOnly
                            className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Gekopieerd!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    Kopieer Link
                                </>
                            )}
                        </button>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-slate-800 mb-2">💡 Tip</p>
                        <p className="text-sm text-slate-600">
                            Vraag reviews binnen 24 uur na een positieve ervaring. Klanten zijn dan nog enthousiast!
                        </p>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800">Alle Beoordelingen</h2>
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        id={review.id}
                        className="bg-white rounded-xl p-6 border border-slate-200"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="font-medium text-slate-800">{review.author}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < review.rating
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-slate-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-400">{review.date}</span>
                                </div>
                            </div>
                            {!review.hasResponse && (
                                <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                    Nog niet beantwoord
                                </span>
                            )}
                        </div>

                        <p className="text-slate-700 mb-4">{review.content}</p>

                        {review.hasResponse && review.ownerResponse && (
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                                <p className="text-sm font-medium text-blue-900 mb-1">
                                    Uw reactie:
                                </p>
                                <p className="text-sm text-blue-800">{review.ownerResponse}</p>
                            </div>
                        )}

                        {!review.hasResponse && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Schrijf een reactie
                                </label>
                                <textarea
                                    value={responses[review.id] || ""}
                                    onChange={(e) =>
                                        setResponses({ ...responses, [review.id]: e.target.value })
                                    }
                                    placeholder="Bedank de klant en reageer op hun feedback..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-slate-500">
                                        💡 Tip: Reageer binnen 24 uur voor de beste indruk
                                    </p>
                                    <button
                                        onClick={() => handleSubmitResponse(review.id)}
                                        disabled={!responses[review.id]?.trim()}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        Verzenden
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State if no reviews */}
            {reviews.length === 0 && (
                <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
                    <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Nog geen beoordelingen
                    </h3>
                    <p className="text-slate-600 mb-6">
                        Vraag uw eerste review aan om uw profiel te verbeteren
                    </p>
                    <button
                        onClick={() => setShowRequestForm(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                        Vraag Review Aan
                    </button>
                </div>
            )}
        </div>
    );
}
