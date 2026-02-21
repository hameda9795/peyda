import { db as prisma } from "@/lib/db";
import Link from "next/link";

export default async function DebugCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            subcategories: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    // Group by normalized name to find potential duplicates
    const grouped: Record<string, typeof categories> = {};
    categories.forEach((cat) => {
        const normalizedName = cat.name.toLowerCase().replace(/ in utrecht| in nederland/g, '').trim();
        if (!grouped[normalizedName]) {
            grouped[normalizedName] = [];
        }
        grouped[normalizedName].push(cat);
    });

    const duplicates = Object.entries(grouped).filter(([_, cats]) => cats.length > 1);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Debug Categories</h1>
                <Link 
                    href="/admin/categories"
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-sm font-medium"
                >
                    Back to Categories
                </Link>
            </div>

            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h2 className="font-semibold text-blue-900 mb-2">Summary</h2>
                <p className="text-blue-800">Total categories: {categories.length}</p>
                <p className="text-blue-800">Duplicate groups: {duplicates.length}</p>
            </div>

            {duplicates.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Duplicate Categories Found</h2>
                    {duplicates.map(([name, cats]) => (
                        <div key={name} className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                            <h3 className="font-semibold text-red-900 mb-2">{name}</h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left">
                                        <th className="pb-2">ID</th>
                                        <th className="pb-2">Name</th>
                                        <th className="pb-2">Slug</th>
                                        <th className="pb-2">Subcategories</th>
                                        <th className="pb-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cats.map((cat) => (
                                        <tr key={cat.id} className="border-t border-red-100">
                                            <td className="py-2 font-mono text-xs">{cat.id}</td>
                                            <td className="py-2">{cat.name}</td>
                                            <td className="py-2 font-mono text-xs">{cat.slug}</td>
                                            <td className="py-2">{cat.subcategories.length}</td>
                                            <td className="py-2">
                                                <Link 
                                                    href={`/admin/categories/${cat.id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="text-xl font-bold mb-4">All Categories</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-zinc-200 rounded-lg">
                    <thead className="bg-zinc-50">
                        <tr className="text-left">
                            <th className="px-4 py-3 font-semibold">ID</th>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Slug</th>
                            <th className="px-4 py-3 font-semibold">Subcategories</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-zinc-50">
                                <td className="px-4 py-3 font-mono text-xs">{cat.id}</td>
                                <td className="px-4 py-2">{cat.name}</td>
                                <td className="px-4 py-2 font-mono text-xs">{cat.slug}</td>
                                <td className="px-4 py-2">{cat.subcategories.length}</td>
                                <td className="px-4 py-2">
                                    <Link 
                                        href={`/admin/categories/${cat.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
