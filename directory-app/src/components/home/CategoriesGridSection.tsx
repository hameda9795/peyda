import Link from "next/link";
import { getCategories } from "@/lib/actions/categories";
import { CATEGORY_ICONS } from "@/lib/netherlands-data";
import { ArrowRight } from "lucide-react";

export async function CategoriesGridSection() {
    const categories = await getCategories();

    return (
        <section className="categories-grid-section py-20 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="section-header">
                    <h2>Categorieën</h2>
                    <p>Blader door alle categorieën om de perfecte dienst te vinden</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {categories.map((category: any) => {
                        const slug = category.slug.replace('/utrecht/', '').replace('/nederland/', '');
                        const icon = CATEGORY_ICONS[slug] || "📁";

                        return (
                            <Link
                                key={category.id}
                                href={`/categorieen/${slug}`}
                                className="category-grid-card group"
                            >
                                <div className="category-grid-icon group-hover:text-white">
                                    {icon}
                                </div>
                                <h3 className="category-grid-name group-hover:text-indigo-600 transition-colors">
                                    {category.name.replace(' in Utrecht', '').replace(' in Nederland', '')}
                                </h3>
                                <p className="category-grid-count">
                                    {category._count?.subcategories || 0} subcategorieën
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Link */}
                <div className="mt-10 text-center">
                    <Link
                        href="/categorieen"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Bekijk alle categorieën
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
