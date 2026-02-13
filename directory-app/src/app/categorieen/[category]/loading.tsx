import { BusinessCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function CategoryLoading() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-4 w-12 bg-slate-700" />
                        <span className="text-slate-500">/</span>
                        <Skeleton className="h-4 w-24 bg-slate-700" />
                    </div>
                    <Skeleton className="h-10 w-64 bg-slate-700 mb-4" />
                    <Skeleton className="h-5 w-96 max-w-full bg-slate-700" />
                </div>
            </div>

            {/* Subcategories */}
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="flex gap-3 flex-wrap mb-8">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-28 rounded-full" />
                    ))}
                </div>

                {/* Business Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <BusinessCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
