import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSubcategoryBySlug } from "@/lib/actions/categories";
import { getBusinessesBySubcategory } from "@/lib/data";
import { CategoryHero } from "@/components/CategoryHero";
import { BusinessGrid } from "@/components/BusinessGrid";

type Props = {
    params: Promise<{ category: string; subcategory: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: categorySlug, subcategory: subCategorySlug } = await params;
    const subcategory = await getSubcategoryBySlug(categorySlug, subCategorySlug);

    if (!subcategory) {
        return {
            title: "Subcategorie niet gevonden",
        };
    }

    const description = subcategory.seoDescription || subcategory.description || `Vind de beste ${subcategory.name.toLowerCase()} in Utrecht.`;

    return {
        title: subcategory.seoTitle || `${subcategory.name} in Utrecht | Beste Reviews & Info`,
        description: description,
        openGraph: {
            title: subcategory.seoTitle || `${subcategory.name} in Utrecht | Utrecht Business Directory`,
            description: description,
            images: subcategory.image ? [subcategory.image] : [],
        },
    };
}

export default async function SubCategoryPage({ params }: Props) {
    const { category: categorySlug, subcategory: subCategorySlug } = await params;

    const subcategory = await getSubcategoryBySlug(categorySlug, subCategorySlug);

    if (!subcategory) {
        notFound();
    }

    // Still using mock businesses for now as requested/appropriate for current state
    const businesses = await getBusinessesBySubcategory(subcategory.category.name, subcategory.name);

    return (
        <main className="min-h-screen bg-white">
            <CategoryHero
                title={subcategory.name}
                description={subcategory.description || `De beste ${subcategory.name.toLowerCase()} in Utrecht. Bekijk reviews, foto's en meer.`}
                image={subcategory.image || subcategory.category.image || undefined}
                breadcrumbs={[
                    { label: subcategory.category.name.replace(' in Utrecht', ''), href: `/utrecht/${categorySlug}` },
                    { label: subcategory.name, href: `/utrecht/${categorySlug}/${subCategorySlug}` }
                ]}
            />

            <div className="container mx-auto px-4 py-8">
                <BusinessGrid
                    businesses={businesses}
                    title={`Alle ${subcategory.name.toLowerCase()} in Utrecht`}
                />

                {businesses.length === 0 && (
                    <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed border-spacing-4">
                        <p className="text-zinc-500">Nog geen bedrijven gevonden in deze subcategorie.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
