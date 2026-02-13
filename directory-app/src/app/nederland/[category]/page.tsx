import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBusinessesByCategory } from "@/lib/data";
import { getCategoryBySlug } from "@/lib/actions/categories";
import { CategoryHero } from "@/components/CategoryHero";
import { SubCategoryList } from "@/components/SubCategoryList";
import { BusinessGrid } from "@/components/BusinessGrid";
import { getSubcategoryImage } from "@/lib/subcategory-images";

type Props = {
    params: Promise<{ category: string }>;
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: categorySlug } = await params;

    const category = await getCategoryBySlug(categorySlug);

    if (!category) {
        return {
            title: "Categorie niet gevonden | Utrecht Business Directory",
        };
    }

    const description = category.seoDescription || category.description || `Ontdek de beste ${category.name} in Utrecht.`;
    const image = category.image || "";

    return {
        title: category.seoTitle || `${category.name.replace(' in Utrecht', '')} in Utrecht | Beste Adressen & Reviews`,
        description: description,
        openGraph: {
            title: category.seoTitle || `${category.name.replace(' in Utrecht', '')} in Utrecht | Utrecht Business Directory`,
            description: description,
            images: image ? [image] : [],
        },
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { category: categorySlug } = await params;
    const resolvedSearchParams = searchParams;

    const category = await getCategoryBySlug(categorySlug);

    if (!category) {
        notFound();
    }

    const subcategories = category.subcategories.map((sub: any) => ({
        name: sub.name,
        slug: sub.slug,
        image: sub.image
    }));

    // Get businesses (Mock only for now as DB businesses not fully requested/implemented)
    // Get businesses
    const businesses = await getBusinessesByCategory(category.name);

    // Filter Logic can be moved to server action or Prisma query later.
    // For now we return all businesses in category.

    return (
        <main className="min-h-screen bg-zinc-50">
            <CategoryHero
                title={category.name.replace(' in Utrecht', '')}
                description={category.description || `Ontdek de beste ${category.name.toLowerCase()} en meer.`}
                image={category.image || undefined}
                breadcrumbs={[
                    { label: category.name.replace(' in Utrecht', ''), href: `/utrecht/${categorySlug}` }
                ]}
            />

            <div className="container mx-auto px-4 py-8">
                <SubCategoryList
                    parentSlug={`/utrecht/${categorySlug}`}
                    subcategories={subcategories}
                />

                <div className="mt-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-zinc-900">
                            {businesses.length} {businesses.length === 1 ? 'bedrijf' : 'bedrijven'} gevonden
                        </h2>
                    </div>

                    <BusinessGrid
                        businesses={businesses}
                        title=""
                    />

                    {businesses.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl border border-zinc-200 border-dashed animate-in fade-in zoom-in duration-500">
                            <p className="text-zinc-500">Geen bedrijven gevonden in deze categorie.</p>
                            <a href={`/utrecht/${categorySlug}`} className="text-indigo-600 hover:underline mt-2 inline-block font-medium">
                                Filters wissen
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
