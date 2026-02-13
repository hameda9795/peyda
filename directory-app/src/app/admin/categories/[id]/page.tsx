import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategory, updateCategory } from "@/lib/actions/categories";
import { SubcategoryManager } from "@/components/admin/SubcategoryManager";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id  } = await params;
    const category = await getCategory(id);

    if (!category) {
        notFound();
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Categorie Bewerken</h1>
                    <p className="text-zinc-500 font-medium">Pas de details en instellingen aan voor deze categorie</p>
                </div>
            </div>

            <CategoryForm
                action={async (formData) => {
                    "use server";
                    const data = {
                        name: formData.get("name") as string,
                        slug: formData.get("slug") as string,
                        description: formData.get("description") as string,
                        icon: formData.get("icon") as string,
                        image: formData.get("image") as string,
                        seoTitle: formData.get("seoTitle") as string,
                        seoDescription: formData.get("seoDescription") as string,
                    };
                    await updateCategory(id, data);
                }}
                defaultValues={{
                    name: category.name,
                    slug: category.slug,
                    description: category.description || "",
                    icon: category.icon || "",
                    image: category.image || "",
                    seoTitle: category.seoTitle || "",
                    seoDescription: category.seoDescription || "",
                }}
                submitLabel="Save Changes"
            />

            <div className="space-y-10">
                <SubcategoryManager
                    categoryId={category.id}
                    initialSubcategories={category.subcategories}
                />
            </div>
        </div >
    );
}
