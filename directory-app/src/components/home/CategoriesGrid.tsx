import Link from "next/link";
import { getCategories } from "@/lib/actions/categories";
import { ArrowUpRight } from "lucide-react";

export async function CategoriesGrid() {
    const categories = await getCategories();
    // Use all categories or limit? The original sliced to 9. Let's keep it if list is huge,
    // but usually dynamic lists should show what's available or paginate. 
    // Let's slice for now to keep layout sane if there are many.
    const featuredCategories = categories.slice(0, 9);

    return (
        <section className="py-20 px-4 md:px-8 border-b border-zinc-100 bg-white">
            <div className="flex items-end justify-between mb-10 max-w-7xl mx-auto w-full">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">Populaire Categorieën</h2>
                    <p className="text-zinc-500 text-lg">Ontdek bedrijven in de meest gezochte sectoren</p>
                </div>
                <Link href="/categorieen" className="hidden md:flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                    Alle categorieën <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {featuredCategories.map((category: any) => {
                    const cleanSlug = category.slug
                        .replace("/utrecht/", "")
                        .replace("/nederland/", "")
                        .replace(/^\//, "");
                    return (
                    <Link
                        key={category.id}
                        href={`/categorieen/${cleanSlug}`}
                        className="group relative bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-100 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-indigo-600 font-bold text-xl">
                                {category.icon ? (
                                    category.name.charAt(0)
                                ) : (
                                    category.name.charAt(0)
                                )}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-indigo-700 transition-colors">
                            {category.name}
                        </h3>

                        <p className="text-sm text-zinc-500 line-clamp-2 mb-6 h-10 leading-relaxed">
                            {category.description || `Vind de beste bedrijven in ${category.name} in Utrecht.`}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {category.subcategories.slice(0, 3).map((sub: any) => (
                                <span key={sub.id} className="text-xs px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-100 text-zinc-500 group-hover:bg-indigo-50/50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                    {sub.name}
                                </span>
                            ))}
                        </div>
                    </Link>
                );
                })}
                {featuredCategories.length === 0 && (
                    <div className="col-span-full text-center text-zinc-500 py-10">
                        Nog geen categorieën gevonden.
                    </div>
                )}
            </div>

            <div className="mt-8 text-center md:hidden">
                <Link href="/categorieen" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    Bekijk alle categorieën
                </Link>
            </div>
        </section>
    );
}
