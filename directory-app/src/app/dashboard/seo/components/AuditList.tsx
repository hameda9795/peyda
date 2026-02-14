"use client";

import Link from "next/link";
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { InfoIcon } from "./SEOTooltip";

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

interface AuditListProps {
    categories: SEOCategory[];
    businessId?: string;
}

export function AuditList({ categories, businessId }: AuditListProps) {
    const getLink = (path: string) => {
        if (businessId) {
            return `${path}?businessId=${businessId}`;
        }
        return path;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'fail':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'pass':
                return 'bg-green-50';
            case 'warning':
                return 'bg-yellow-50';
            case 'fail':
                return 'bg-red-50';
            default:
                return '';
        }
    };

    const getScoreColor = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressColor = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-4">
            {categories.map((category, catIdx) => {
                const progress = (category.score / category.maxScore) * 100;

                return (
                    <div key={catIdx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        {/* Category Header */}
                        <div className="bg-slate-50 px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-slate-800">{category.name}</h3>
                                <InfoIcon
                                    content={`Maximale score voor deze categorie: ${category.maxScore} punten`}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xl font-bold ${getScoreColor(category.score, category.maxScore)}`}>
                                    {category.score}/{category.maxScore}
                                </span>
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getProgressColor(category.score, category.maxScore)} transition-all`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-slate-100">
                            {category.items.map((item, itemIdx) => (
                                <div
                                    key={itemIdx}
                                    className={`p-4 flex items-start justify-between gap-4 ${
                                        item.status !== 'pass' ? getStatusBg(item.status) : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        {getStatusIcon(item.status)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-slate-800">{item.name}</p>
                                                <InfoIcon content={item.suggestion} />
                                            </div>
                                            <p className="text-sm text-slate-600 mt-0.5">{item.message}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-sm text-slate-500">
                                            {item.score}/{item.maxScore}
                                        </span>
                                        {item.status !== 'pass' && item.actionUrl && (
                                            <Link
                                                href={getLink(item.actionUrl)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                {item.actionLabel || 'Verbeter'}
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
