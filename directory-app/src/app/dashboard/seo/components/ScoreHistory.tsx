"use client";

import { TrendingUp } from "lucide-react";

interface ScoreHistoryProps {
    history: { date: string; score: number }[];
}

export function ScoreHistory({ history }: ScoreHistoryProps) {
    if (!history || history.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <h3 className="font-medium text-slate-700 text-sm sm:text-base">Score Geschiedenis</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 text-center py-4">
                    Nog geen geschiedenis beschikbaar
                </p>
            </div>
        );
    }

    const maxScore = 100;
    const minScore = Math.min(...history.map(h => h.score)) - 10;
    const range = maxScore - minScore;

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#22c55e';
        if (score >= 50) return '#eab308';
        return '#ef4444';
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
    };

    const points = history.map((h, idx) => ({
        x: (idx / (history.length - 1 || 1)) * 100,
        y: ((maxScore - h.score) / range) * 100,
        score: h.score,
        date: formatDate(h.date)
    }));

    const pathD = points.map((p, idx) =>
        `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    const scoreDiff = history[history.length - 1].score - history[0].score;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <h3 className="font-medium text-slate-700 text-sm sm:text-base">Score Geschiedenis</h3>
                </div>
                {history.length > 1 && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                        <span className={`font-semibold ${
                            scoreDiff >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {scoreDiff >= 0 ? '+' : ''}{scoreDiff}
                        </span>
                        <span className="text-slate-500 hidden sm:inline">laatste 30 dagen</span>
                        <span className="text-slate-500 sm:hidden">30d</span>
                    </div>
                )}
            </div>

            <div className="relative h-28 sm:h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke="#e2e8f0"
                            strokeWidth="0.5"
                        />
                    ))}

                    {/* Area fill */}
                    <path
                        d={`${pathD} L 100 100 L 0 100 Z`}
                        fill="url(#gradient)"
                        opacity="0.2"
                    />

                    {/* Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {points.map((p, idx) => (
                        <circle
                            key={idx}
                            cx={p.x}
                            cy={p.y}
                            r="2.5"
                            fill={getScoreColor(p.score)}
                            stroke="white"
                            strokeWidth="1"
                        />
                    ))}

                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500">
                    {history.map((h, idx) => (
                        <span key={idx} className="truncate max-w-[60px] text-center">{formatDate(h.date)}</span>
                    ))}
                </div>
            </div>

            <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>0</span>
                <span className="hidden sm:inline">50</span>
                <span>100</span>
            </div>
        </div>
    );
}
