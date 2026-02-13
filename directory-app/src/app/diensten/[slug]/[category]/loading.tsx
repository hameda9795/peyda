import { Skeleton } from "@/components/ui/Skeleton";

export default function CityServiceLoading() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="flex items-center gap-2 mb-6">
                        <Skeleton className="h-4 w-12 bg-slate-700" />
                        <Skeleton className="h-4 w-4 bg-slate-700" />
                        <Skeleton className="h-4 w-20 bg-slate-700" />
                        <Skeleton className="h-4 w-4 bg-slate-700" />
                        <Skeleton className="h-4 w-24 bg-slate-700" />
                    </div>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
                            <Skeleton className="h-12 w-80 bg-slate-700" />
                        </div>
                        <Skeleton className="h-6 w-full max-w-2xl bg-slate-700 mb-2" />
                        <Skeleton className="h-6 w-3/4 max-w-xl bg-slate-700 mb-6" />

                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 bg-slate-700" />
                                <Skeleton className="h-5 w-32 bg-slate-700" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 bg-slate-700" />
                                <Skeleton className="h-5 w-24 bg-slate-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-24 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Business Listings */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <Skeleton className="w-full md:w-64 h-48" />
                                <div className="flex-1 p-5 md:p-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                        <Skeleton className="h-8 w-20 rounded-lg" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
