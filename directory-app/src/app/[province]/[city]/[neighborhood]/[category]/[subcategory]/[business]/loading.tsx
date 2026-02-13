import {
    BusinessHeroSkeleton,
    BusinessContentSkeleton,
    BusinessSidebarSkeleton,
    BusinessCardSkeleton
} from "@/components/ui/Skeleton";

export default function BusinessLoading() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Breadcrumb Skeleton */}
            <div className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-12 bg-slate-200 rounded animate-shimmer" />
                        <span className="text-slate-300">/</span>
                        <div className="h-4 w-20 bg-slate-200 rounded animate-shimmer" />
                        <span className="text-slate-300">/</span>
                        <div className="h-4 w-24 bg-slate-200 rounded animate-shimmer" />
                        <span className="text-slate-300">/</span>
                        <div className="h-4 w-32 bg-slate-200 rounded animate-shimmer" />
                    </div>
                </div>
            </div>

            <BusinessHeroSkeleton />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <main className="flex-1 bg-white rounded-xl shadow-xl p-6 md:p-10 border border-slate-100 min-h-[500px]">
                        <BusinessContentSkeleton />
                    </main>

                    {/* Sidebar */}
                    <aside className="lg:w-[380px] shrink-0">
                        <div className="sticky top-24">
                            <BusinessSidebarSkeleton />
                        </div>
                    </aside>
                </div>

                {/* Related Businesses */}
                <section className="mt-16 border-t border-slate-200 pt-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-2">
                            <div className="h-7 w-48 bg-slate-200 rounded animate-shimmer" />
                            <div className="h-4 w-64 bg-slate-200 rounded animate-shimmer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <BusinessCardSkeleton />
                        <BusinessCardSkeleton />
                        <BusinessCardSkeleton />
                        <BusinessCardSkeleton />
                    </div>
                </section>
            </div>
        </div>
    );
}
