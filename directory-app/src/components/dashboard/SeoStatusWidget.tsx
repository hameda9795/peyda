"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

interface SeoStatusWidgetProps {
    status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED' | null | undefined;
    lastUpdate?: Date | string | null;
    onGenerate?: () => void;
    onRegenerate?: () => void;
    isGenerating?: boolean;
}

export function SeoStatusWidget({
    status,
    lastUpdate,
    onGenerate,
    onRegenerate,
    isGenerating = false
}: SeoStatusWidgetProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    // Convert to Date if it's a string
    const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : null;

    // Format date for Dutch locale
    const formattedDate = lastUpdateDate?.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const handleGenerate = () => {
        if (onGenerate) {
            onGenerate();
        } else if (onRegenerate) {
            onRegenerate();
        }
    };

    // PENDING - Not yet generated
    if (!status || status === 'PENDING') {
        return (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <div className="p-2 bg-amber-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-amber-900">AI Optimalisatie</h4>
                    <p className="text-sm text-amber-700">
                        Laat AI uw SEO automatisch genereren
                    </p>
                </div>
                {onGenerate && (
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Genereren...
                            </span>
                        ) : (
                            'Start AI'
                        )}
                    </button>
                )}
            </div>
        );
    }

    // GENERATING - AI is currently working
    if (status === 'GENERATING') {
        return (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-blue-900">AI Analyseert</h4>
                    <p className="text-sm text-blue-700">
                        Bezig met genereren van SEO-titel, beschrijving en schema...
                    </p>
                </div>
                <div className="text-sm text-blue-500">
                    Even geduld
                </div>
            </div>
        );
    }

    // COMPLETED - Successfully generated
    if (status === 'COMPLETED') {
        return (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-green-900">Geoptimaliseerd</h4>
                    <p className="text-sm text-green-700">
                        {formattedDate ? `Laatst bijgewerkt: ${formattedDate}` : 'AI SEO succesvol gegenereerd'}
                    </p>
                </div>
                {onRegenerate && (
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-3 py-1.5 text-sm text-green-700 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                            </span>
                        ) : (
                            'Vernieuwen'
                        )}
                    </button>
                )}
            </div>
        );
    }

    // FAILED - Generation failed
    if (status === 'FAILED') {
        return (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
                <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-red-900">Optimalisatie Mislukt</h4>
                    <p className="text-sm text-red-700">
                        Er is iets misgegaan bij het genereren van SEO
                    </p>
                </div>
                {onRegenerate && (
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </span>
                        ) : (
                            'Opnieuw Proberen'
                        )}
                    </button>
                )}
            </div>
        );
    }

    return null;
}
