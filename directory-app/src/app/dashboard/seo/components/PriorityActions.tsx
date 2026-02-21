"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

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
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
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
        <div className="space-y-2 sm:space-y-3">
            {sorted.map((item, idx) => (
                <div
                    key={idx}
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border ${
                        item.status === 'fail'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-yellow-50 border-yellow-200'
                    }`}
                >
                    {/* Content */}
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${
                            item.status === 'fail' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 text-sm leading-tight">{item.name}</p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{item.message}</p>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0">
                        <span className={`text-xs font-semibold ${
                            item.status === 'fail' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                            +{item.maxScore - item.score} pts
                        </span>
                        {item.actionUrl && (
                            <Link
                                href={getLink(item.actionUrl)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                    item.status === 'fail'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                }`}
                            >
                                Fix
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
