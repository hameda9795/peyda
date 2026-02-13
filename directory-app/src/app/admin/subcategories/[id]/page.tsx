import { CategoryForm } from "@/components/admin/CategoryForm";
import { getSubcategory, updateSubcategory } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditSubcategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id  } = await params;
    const subcategory = await getSubcategory(id);

    if (!subcategory) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/admin/categories/${subcategory.categoryId}`}>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Subcategorie Bewerken</h1>
                    <p className="text-zinc-500">Pas de details aan voor {subcategory.name}</p>
                </div>
            </div>

            <CategoryForm
                action={async (formData) => {
                    "use server";
                    const data = {
                        name: formData.get("name") as string,
                        slug: formData.get("slug") as string,
                        description: formData.get("description") as string,
                        image: formData.get("image") as string,
                        seoTitle: formData.get("seoTitle") as string,
                        seoDescription: formData.get("seoDescription") as string,
                    };
                    await updateSubcategory(id, data);
                }}
                defaultValues={{
                    name: subcategory.name,
                    slug: subcategory.slug,
                    description: subcategory.description || "",
                    image: subcategory.image || "",
                    seoTitle: subcategory.seoTitle || "",
                    seoDescription: subcategory.seoDescription || "",
                }}
                submitLabel="Subcategorie Opslaan"
            />
        </div>
    );
}
