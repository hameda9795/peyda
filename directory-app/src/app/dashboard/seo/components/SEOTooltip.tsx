"use client";

import { Info } from "lucide-react";

interface SEOTooltipProps {
    children: React.ReactNode;
    content: string;
}

export function SEOTooltip({ children, content }: SEOTooltipProps) {
    return (
        <div className="relative group inline-block">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
                            bg-slate-800 text-white text-xs rounded-lg opacity-0
                            group-hover:opacity-100 transition-opacity w-64 z-50
                            pointer-events-none shadow-lg">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4
                                border-transparent border-t-slate-800" />
            </div>
        </div>
    );
}

interface InfoIconProps {
    content: string;
    className?: string;
}

export function InfoIcon({ content, className = '' }: InfoIconProps) {
    return (
        <div className="relative group inline-block">
            <Info className={`w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help ${className}`} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
                            bg-slate-800 text-white text-xs rounded-lg opacity-0
                            group-hover:opacity-100 transition-opacity w-56 z-50
                            pointer-events-none shadow-lg">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4
                                border-transparent border-t-slate-800" />
            </div>
        </div>
    );
}
