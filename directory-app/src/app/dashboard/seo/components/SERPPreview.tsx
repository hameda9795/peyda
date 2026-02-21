"use client";

interface SERPPreviewProps {
    title: string;
    url: string;
    description: string;
}

export function SERPPreview({ title, url, description }: SERPPreviewProps) {
    const displayTitle = title || 'Voeg een SEO titel toe';
    const displayDescription = description || 'Voeg een meta beschrijving toe voor een betere weergave in Google.';

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#4285F4"/>
                    <path d="M2 17l10 5 10-5" stroke="#4285F4" strokeWidth="2" fill="none"/>
                    <path d="M2 12l10 5 10-5" stroke="#4285F4" strokeWidth="2" fill="none"/>
                </svg>
                <span className="text-xs sm:text-sm font-medium text-slate-700">Google Preview</span>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2 min-w-0">
                <div className="text-xs text-slate-500 truncate font-mono">
                    {url.replace(/^https?:\/\//, '')}
                </div>
                <div className="text-base sm:text-lg text-[#1a0dab] hover:underline cursor-pointer break-words leading-tight">
                    {displayTitle.length > 60 ? displayTitle.substring(0, 57) + '...' : displayTitle}
                </div>
                <div className="text-xs sm:text-sm text-[#006621] truncate font-mono">
                    {url.replace(/^https?:\/\//, '')}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 leading-snug break-words">
                    {displayDescription.length > 160
                        ? displayDescription.substring(0, 157) + '...'
                        : displayDescription
                    }
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Titel: {displayTitle.length}/60</span>
                <span className="hidden sm:inline">Beschrijving: {displayDescription.length}/160</span>
                <span className="sm:hidden">Desc: {displayDescription.length}/160</span>
            </div>
        </div>
    );
}
