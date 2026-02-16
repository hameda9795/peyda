"use client";

import { useState, useEffect, use } from "react";
import { Search, Image, Star, FileQuestion, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { getSEOScore } from "../actions";
import { ScoreGauge } from "./components/ScoreGauge";
import { SERPPreview } from "./components/SERPPreview";
import { ScoreHistory } from "./components/ScoreHistory";
import { PriorityActions } from "./components/PriorityActions";
import { AuditList } from "./components/AuditList";
import { InfoIcon } from "./components/SEOTooltip";

interface SEOItem {
    name: string;
    status: 'pass' | 'warning' | 'fail';
    score: number;
    maxScore: number;
    message: string;
    suggestion: string;
    actionUrl?: string;
    actionLabel?: string;
}

interface SEOCategory {
    name: string;
    score: number;
    maxScore: number;
    items: SEOItem[];
}

interface SEOScoreData {
    overallScore: number;
    categories: SEOCategory[];
    history: { date: string; score: number }[];
    serpPreview: {
        title: string;
        url: string;
        description: string;
    };
}

export default function SEOPage({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
    const params = use(searchParams);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [seoScore, setSeoScore] = useState<SEOScoreData | null>(null);
    const businessId = params.businessId;

    // Fetch real SEO score
    const fetchSEOScore = async () => {
        try {
            const data = await getSEOScore(businessId);
            if (data) {
                setSeoScore(data);
            }
        } catch (error) {
            console.error('Error fetching SEO score:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSEOScore();
    }, [businessId]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchSEOScore();
    };

    const getScoreMessage = (score: number) => {
        if (score >= 80) {
            return {
                text: 'Uitstekend! Uw bedrijf is goed geoptimaliseerd',
                subtext: 'Blijf zo doorgaan en monitor regelmatig uw score'
            };
        }
        if (score >= 50) {
            return {
                text: 'Goed op weg, nog verbeteringen mogelijk',
                subtext: 'Focus op de rode en gele items hieronder'
            };
        }
        return {
            text: 'Aandacht nodig - immediate actie vereist',
            subtext: 'Begin met de belangrijkste verbeteringen'
        };
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return {
            gradient: 'from-green-500 to-emerald-600',
            text: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200'
        };
        if (score >= 50) return {
            gradient: 'from-yellow-500 to-orange-500',
            text: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200'
        };
        return {
            gradient: 'from-red-500 to-rose-600',
            text: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200'
        };
    };

    // Collect all items for priority actions
    const allItems = seoScore?.categories.flatMap(cat => cat.items) || [];

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

    const scoreData = getScoreColor(seoScore?.overallScore || 0);
    const messageData = getScoreMessage(seoScore?.overallScore || 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">SEO Score Dashboard</h1>
                        <p className="text-slate-600">
                            Verbeter uw zichtbaarheid in Google en bereik meer klanten
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Vernieuwen...' : 'Vernieuwen'}
                    </button>
                </div>
            </div>

            {/* Main Score Display */}
            <div className={`bg-gradient-to-br ${scoreData.gradient} text-white rounded-xl p-8`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-white/80 mb-2">Uw totale SEO Score</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-7xl font-bold">{seoScore?.overallScore || 0}</span>
                            <span className="text-2xl text-white/70">/100</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            {seoScore?.overallScore && seoScore.overallScore >= 80 ? (
                                <>
                                    <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm text-white/80">{messageData.text}</span>
                                </>
                            ) : seoScore?.overallScore && seoScore.overallScore >= 50 ? (
                                <>
                                    <AlertCircle className="w-5 h-5 text-yellow-300" />
                                    <span className="text-sm text-white/80">{messageData.text}</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-5 h-5 text-red-300" />
                                    <span className="text-sm text-white/80">{messageData.text}</span>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-white/60 mt-1">{messageData.subtext}</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="relative">
                            <ScoreGauge score={seoScore?.overallScore || 0} size="lg" showLabel={false} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-4xl font-bold text-white">
                                        {seoScore?.overallScore || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <Search className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-2xl font-bold text-slate-800">
                                {seoScore?.categories.find(c => c.name === 'Content Kwaliteit')?.score || 0}
                            </p>
                            <p className="text-xs text-slate-500">Content</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">
                                {seoScore?.categories.find(c => c.name === 'Technische SEO')?.score || 0}
                            </p>
                            <p className="text-xs text-slate-500">Technisch</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">
                                {seoScore?.categories.find(c => c.name === 'Lokale SEO')?.score || 0}
                            </p>
                            <p className="text-xs text-slate-500">Lokaal</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-600" />
                        <div>
                            <p className="text-2xl font-bold text-slate-800">
                                {seoScore?.categories.find(c => c.name === 'Social Proof')?.score || 0}
                            </p>
                            <p className="text-xs text-slate-500">Reviews</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* SERP Preview */}
                <div>
                    {seoScore?.serpPreview && (
                        <SERPPreview
                            title={seoScore.serpPreview.title}
                            url={seoScore.serpPreview.url}
                            description={seoScore.serpPreview.description}
                        />
                    )}
                </div>

                {/* Score History */}
                <div>
                    {seoScore?.history && (
                        <ScoreHistory history={seoScore.history} />
                    )}
                </div>
            </div>

            {/* Priority Actions */}
            <div className={`${scoreData.bg} rounded-xl p-6 border ${scoreData.border}`}>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Snelle Wins - Verbeter uw score vandaag nog
                    <InfoIcon content="Dit zijn de belangrijkste verbeterpunten gesorteerd op potentiële impact" />
                </h3>
                <PriorityActions items={allItems} businessId={businessId} />
            </div>

            {/* Detailed Audit List */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Detailed SEO Audit</h2>
                {seoScore?.categories && (
                    <AuditList categories={seoScore.categories} businessId={businessId} />
                )}
            </div>
        </div>
    );
}
