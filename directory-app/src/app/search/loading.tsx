import { SearchResultsSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Search Header */}
            <div className="bg-white border-b border-slate-200 py-6">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="flex gap-4">
                        <Skeleton className="h-12 flex-1 max-w-md rounded-xl" />
                        <Skeleton className="h-12 w-32 rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                            <Skeleton className="h-5 w-24 mb-4" />
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                            ))}
                            <div className="border-t pt-4 mt-4">
                                <Skeleton className="h-5 w-20 mb-4" />
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 mb-2">
                                        <Skeleton className="h-5 w-5 rounded" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Results */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-10 w-40 rounded-lg" />
                        </div>
                        <SearchResultsSkeleton />
                    </main>
                </div>
            </div>
        </div>
    );
}
