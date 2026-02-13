import Link from "next/link";
import { getCategories, deleteCategory } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash, Layers } from "lucide-react";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-1">Dategoriën</h1>
                    <p className="text-zinc-500">Beheer alle categorieën en hun subcategorieën voor de directory.</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-200">
                        <Plus className="mr-2 h-4 w-4" /> Nieuwe Categorie
                    </Button>
                </Link>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="h-14 px-6 text-left align-middle font-semibold text-zinc-900">Naam</th>
                                <th className="h-14 px-6 text-left align-middle font-semibold text-zinc-900">Slug</th>
                                <th className="h-14 px-6 text-center align-middle font-semibold text-zinc-900">Subcategorieën</th>
                                <th className="h-14 px-6 text-right align-middle font-semibold text-zinc-900">Acties</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {categories.map((category) => (
                                <tr key={category.id} className="transition-colors hover:bg-zinc-50/50 group">
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            {category.image ? (
                                                <img src={category.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-zinc-100 shadow-sm" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                                                    <Layers className="h-5 w-5" />
                                                </div>
                                            )}
                                            <span className="font-semibold text-zinc-900">{category.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle font-mono text-xs text-zinc-500">{category.slug}</td>
                                    <td className="px-6 py-4 align-middle text-center text-zinc-600">
                                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
                                            {category._count.subcategories}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Link href={`/admin/categories/${category.id}`}>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                "use server";
                                                await deleteCategory(category.id);
                                            }}>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                                        Geen categorieën gevonden.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
