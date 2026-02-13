import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-shimmer rounded-md bg-slate-200",
                className
            )}
        />
    );
}

export function BusinessCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

export function BusinessHeroSkeleton() {
    return (
        <div className="relative">
            <Skeleton className="w-full h-[300px] md:h-[400px] rounded-none" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="container mx-auto flex items-end gap-6">
                    <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BusinessContentSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Skeleton className="h-10 rounded-full" />
                    <Skeleton className="h-10 rounded-full" />
                    <Skeleton className="h-10 rounded-full" />
                    <Skeleton className="h-10 rounded-full" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-36" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="aspect-square rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export function BusinessSidebarSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-slate-100">
            <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div className="border-t pt-6 space-y-4">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
            <div className="border-t pt-6 space-y-4">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-2">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        </div>
    );
}

export function SearchResultsSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
