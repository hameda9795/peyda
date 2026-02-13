import { Skeleton, CategoryCardSkeleton } from "@/components/ui/Skeleton";

export default function ProvinceLoading() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-emerald-900 to-emerald-800 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-4 w-12 bg-emerald-700" />
                        <span className="text-emerald-500">/</span>
                        <Skeleton className="h-4 w-20 bg-emerald-700" />
                        <span className="text-emerald-500">/</span>
                        <Skeleton className="h-4 w-28 bg-emerald-700" />
                    </div>
                    <Skeleton className="h-10 w-56 bg-emerald-700 mb-4" />
                    <Skeleton className="h-5 w-96 max-w-full bg-emerald-700" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>

                {/* Cities */}
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-12">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
                            <Skeleton className="h-5 w-full mb-2" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>

                {/* Categories */}
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <CategoryCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
