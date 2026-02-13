import { createCategory } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Nieuwe Categorie</h1>
                    <p className="text-zinc-500 font-medium">Maak een nieuwe categorie aan voor de directory</p>
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
                    await createCategory(data);
                }}
                submitLabel="Categorie Aanmaken"
            />
        </div>
    );
}
