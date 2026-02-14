"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

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

interface PriorityActionsProps {
    items: SEOItem[];
    businessId?: string;
}

export function PriorityActions({ items, businessId }: PriorityActionsProps) {
    // Sort by potential points (highest first)
    const sorted = [...items]
        .filter(item => item.status !== 'pass')
        .sort((a, b) => (b.maxScore - b.score) - (a.maxScore - a.score))
        .slice(0, 6); // Show top 6

    const getLink = (path: string) => {
        if (businessId) {
            return `${path}?businessId=${businessId}`;
        }
        return path;
    };

    if (sorted.length === 0) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-green-800">Uitstekend!</h3>
                        <p className="text-sm text-green-700">Alle SEO factoren zijn geoptimaliseerd</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {sorted.map((item, idx) => (
                <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                        item.status === 'fail'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-yellow-50 border-yellow-200'
                    }`}
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className={`w-5 h-5 mt-0.5 ${
                            item.status === 'fail' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div>
                            <p className="font-medium text-slate-800">{item.name}</p>
                            <p className="text-sm text-slate-600">{item.message}</p>
                            {item.suggestion && (
                                <p className="text-xs text-slate-500 mt-1">{item.suggestion}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${
                            item.status === 'fail' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                            +{item.maxScore - item.score}
                        </span>
                        {item.actionUrl && (
                            <Link
                                href={getLink(item.actionUrl)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                    item.status === 'fail'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                }`}
                            >
                                Verbeter
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
