"use client";

import { useState, useEffect, use } from "react";
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Search, Image, Star, FileText, ArrowRight, Upload, MessageSquare, FileQuestion } from "lucide-react";
import Link from "next/link";
import { getSEOScore } from "../actions";

interface SEOItem {
    label: string;
    status: "complete" | "warning" | "incomplete";
    points: number;
    message?: string;
    actionUrl?: string;
    actionLabel?: string;
}

interface SEOCategory {
    name: string;
    score: number;
    items: SEOItem[];
}

interface SEOScoreData {
    overallScore: number;
    categories: SEOCategory[];
}

const defaultSEOChecks: SEOCategory[] = [
    {
        name: "Basis Informatie",
        score: 100,
        items: [
            { label: "Bedrijfsnaam ingevuld", status: "complete", points: 10 },
            { label: "Telefoonnummer toegevoegd", status: "complete", points: 10 },
            { label: "Adres compleet", status: "complete", points: 10 },
            { label: "Openingstijden ingesteld", status: "complete", points: 10 },
        ]
    },
    {
        name: "Content Kwaliteit",
        score: 60,
        items: [
            { label: "Korte beschrijving (160 tekens)", status: "complete", points: 15 },
            { label: "Uitgebreide beschrijving", status: "warning", points: 10, message: "Slechts 50 woorden, minimaal 150 aanbevolen" },
            { label: "Diensten toegevoegd", status: "incomplete", points: 0, message: "Voeg minimaal 3 diensten toe", actionUrl: "/dashboard/profile", actionLabel: "Voeg diensten toe" },
            { label: "FAQ sectie", status: "incomplete", points: 0, message: "Voeg minimaal 5 veelgestelde vragen toe", actionUrl: "/dashboard/profile", actionLabel: "Voeg FAQ toe" },
        ]
    },
    {
        name: "Visueel Content",
        score: 30,
        items: [
            { label: "Logo geüpload", status: "complete", points: 10 },
            { label: "Cover foto toegevoegd", status: "complete", points: 10 },
            { label: "Galerij foto's (5+ aanbevolen)", status: "warning", points: 5, message: "3 van 5 foto's", actionUrl: "/dashboard/profile", actionLabel: "Voeg foto's toe" },
            { label: "Foto alt-teksten", status: "incomplete", points: 0, message: "Voeg beschrijvingen toe aan foto's", actionUrl: "/dashboard/profile", actionLabel: "Voeg alt-teksten toe" },
        ]
    },
    {
        name: "Social Proof",
        score: 50,
        items: [
            { label: "Minimaal 5 reviews", status: "warning", points: 10, message: "3 van 5 reviews", actionUrl: "/dashboard/reviews", actionLabel: "Vraag reviews aan" },
            { label: "Gemiddelde rating 4+", status: "complete", points: 15 },
            { label: "Eigenaar reageert op reviews", status: "warning", points: 5, message: "Controleer onbeantwoorde reviews", actionUrl: "/dashboard/reviews", actionLabel: "Bekijk reviews" },
        ]
    },
    {
        name: "Lokale SEO",
        score: 70,
        items: [
            { label: "Stad en wijk ingevuld", status: "complete", points: 10 },
            { label: "Werkgebied gespecificeerd", status: "complete", points: 10 },
            { label: "Lokale keywords in beschrijving", status: "warning", points: 5, message: "Noem specifieke straten/wijken" },
            { label: "Google Maps integratie", status: "complete", points: 10 },
        ]
    }
];

const defaultOverallScore = Math.round(
    defaultSEOChecks.reduce((acc, cat) => acc + cat.score, 0) / defaultSEOChecks.length
);

export default function SEOPage({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
    const params = use(searchParams);
    const [loading, setLoading] = useState(true);
    const [seoScore, setSeoScore] = useState<SEOScoreData | null>(null);
    const [categories, setCategories] = useState<SEOCategory[]>(defaultSEOChecks);
    const [overallScore, setOverallScore] = useState(defaultOverallScore);
    const businessId = params.businessId;

    const getLink = (path: string) => {
        if (businessId) {
            return `${path}?businessId=${businessId}`;
        }
        return path;
    };

    // Fetch real SEO score
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getSEOScore(businessId);
                if (data) {
                    setSeoScore(data);
                    setCategories(data.categories);
                    setOverallScore(data.overallScore);
                }
            } catch (error) {
                console.log('Using default SEO data');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [businessId]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "complete":
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-orange-500" />;
            case "incomplete":
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 50) return "text-orange-500";
        return "text-red-500";
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return "bg-green-600";
        if (score >= 50) return "bg-orange-500";
        return "bg-red-500";
    };

    const getActionIcon = (category: string) => {
        if (category.includes("Visueel")) return <Image className="w-4 h-4" />;
        if (category.includes("Social")) return <MessageSquare className="w-4 h-4" />;
        if (category.includes("Content")) return <FileText className="w-4 h-4" />;
        return <ArrowRight className="w-4 h-4" />;
    };

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
                <h1 className="text-2xl font-bold text-slate-800 mb-2">SEO Score Dashboard</h1>
                <p className="text-slate-600">
                    Verbeter uw zichtbaarheid in Google en bereik meer klanten
                </p>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 mb-2">Uw totale SEO Score</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-6xl font-bold">{overallScore}</span>
                            <span className="text-2xl text-blue-100">/100</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            {overallScore >= 80 ? (
                                <>
                                    <CheckCircle className="w-5 h-5 text-green-300" />
                                    <span className="text-sm text-blue-100">Uitstekend! Blijf zo doorgaan</span>
                                </>
                            ) : overallScore >= 50 ? (
                                <>
                                    <AlertCircle className="w-5 h-5 text-yellow-300" />
                                    <span className="text-sm text-blue-100">Goed op weg, nog wat verbeteringen mogelijk</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 text-red-300" />
                                    <span className="text-sm text-blue-100">Er is nog veel te verbeteren</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center">
                        <div className="relative w-40 h-40">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    className="text-blue-400 opacity-30"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 70}`}
                                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - overallScore / 100)}`}
                                    className="text-white"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <Search className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-2xl font-bold text-slate-800">12</p>
                            <p className="text-xs text-slate-500">Keywords ranking</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <Image className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-2xl font-bold text-slate-800">3/10</p>
                            <p className="text-xs text-slate-500">Foto&apos;s toegevoegd</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-600" />
                        <div>
                            <p className="text-2xl font-bold text-slate-800">3/5</p>
                            <p className="text-xs text-slate-500">Reviews verzameld</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <FileQuestion className="w-8 h-8 text-purple-600" />
                        <div>
                            <p className="text-2xl font-bold text-slate-800">0/5</p>
                            <p className="text-xs text-slate-500">FAQ vragen</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Categories with Actions */}
            <div className="space-y-4">
                {categories.map((category, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 p-4 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">{category.name}</h3>
                            <div className="flex items-center gap-3">
                                <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                                    {category.score}%
                                </span>
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getScoreBgColor(category.score)} transition-all`}
                                        style={{ width: `${category.score}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {category.items.map((item, itemIdx) => (
                                <div
                                    key={itemIdx}
                                    className={`flex items-start justify-between py-3 border-b border-slate-100 last:border-0 ${item.status !== 'complete' ? 'bg-orange-50/50 rounded-lg px-3' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {getStatusIcon(item.status)}
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                {item.label}
                                            </p>
                                            {item.message && (
                                                <p className="text-xs text-slate-500 mt-1">{item.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-slate-500">+{item.points} punten</span>
                                        {item.status !== 'complete' && item.actionUrl && (
                                            <Link
                                                href={getLink(item.actionUrl)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                {getActionIcon(category.name)}
                                                <span>{item.actionLabel || "Verbeter"}</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Items */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Snelle Wins - Verbeter uw score vandaag nog
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <Link
                        href={getLink("/dashboard/profile")}
                        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-slate-800">Upload meer foto&apos;s</p>
                            <p className="text-sm text-slate-600 mt-1">+15 punten</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href={getLink("/dashboard/reviews")}
                        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <MessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-slate-800">Vraag 2 nieuwe reviews aan</p>
                            <p className="text-sm text-slate-600 mt-1">+10 punten</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href={getLink("/dashboard/profile")}
                        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <FileQuestion className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-slate-800">Voeg FAQ vragen toe</p>
                            <p className="text-sm text-slate-600 mt-1">+10 punten</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
