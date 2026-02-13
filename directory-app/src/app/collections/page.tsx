
// import { getCategories } from "@/lib/data";
import { getCategories } from "@/lib/actions/categories";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";

export const metadata: Metadata = {
    title: "Collecties | Utrecht Business Directory",
    description: "Ontdek alle categorieën en bedrijvencollecties in Utrecht.",
};

export default async function CollectionsPage() {
    const categories: any = await getCategories();

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header */}
            <div className="bg-indigo-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Onze Collecties</h1>
                    <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                        Verken alle categorieën en vind precies wat u zoekt in Utrecht.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category: any) => (
                        <Link
                            key={category.slug}
                            href={category.slug}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-zinc-100"
                        >
                            <div className="relative h-48 overflow-hidden bg-zinc-100">
                                {category.image || category.thumbnail ? (
                                    <Image
                                        src={category.image || category.thumbnail}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-zinc-300">
                                        <Layers className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {category.name}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {category.subcategories.slice(0, 3).map((sub: any, idx: number) => (
                                        <span
                                            key={idx}
                                            className="text-xs font-medium px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md"
                                        >
                                            {sub.name || sub}
                                        </span>
                                    ))}
                                    {category.subcategories.length > 3 && (
                                        <span className="text-xs font-medium px-2 py-1 bg-zinc-50 text-zinc-400 rounded-md">
                                            +{category.subcategories.length - 3}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-50">
                                    <span className="text-sm font-medium text-zinc-500">
                                        Bekijk collectie
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
