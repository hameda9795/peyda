"use client";

import { useState } from "react";
import { createSubcategory, deleteSubcategory } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Pencil, Search, Layers, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
}

interface SubcategoryManagerProps {
    categoryId: string;
    initialSubcategories: Subcategory[];
}

export function SubcategoryManager({ categoryId, initialSubcategories }: SubcategoryManagerProps) {
    const router = useRouter();
    const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
    const [isAdding, setIsAdding] = useState(false);
    const [newSub, setNewSub] = useState({ name: "", slug: "" });
    const [searchTerm, setSearchTerm] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setNewSub({ name, slug: slugify(name) });
    };

    const handleAdd = async () => {
        if (!newSub.name || !newSub.slug) return;

        try {
            await createSubcategory(categoryId, newSub);
            setNewSub({ name: "", slug: "" });
            setIsAdding(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to add subcategory");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) return;

        try {
            await deleteSubcategory(id);
            setSubcategories(subcategories.filter((s) => s.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Failed to delete subcategory");
        }
    };

    const filteredSubcategories = subcategories.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Layers className="h-4 w-4" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900">Subcategorieën</h2>
                        <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-medium ml-1">
                            {subcategories.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Zoeken..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 w-full md:w-64 bg-white border-zinc-200 rounded-xl text-sm"
                            />
                        </div>
                        <Button
                            onClick={() => setIsAdding(!isAdding)}
                            variant={isAdding ? "ghost" : "default"}
                            size="sm"
                            className={cn(
                                "h-10 rounded-xl transition-all font-semibold",
                                !isAdding && "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                            )}
                        >
                            {isAdding ? "Annuleren" : <><Plus className="mr-2 h-4 w-4" /> Toevoegen</>}
                        </Button>
                    </div>
                </div>

                {isAdding && (
                    <div className="mt-8 p-8 rounded-3xl border-2 border-indigo-100 bg-indigo-50/20 animate-in fade-in slide-in-from-top-4 shadow-inner">
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="grid gap-3">
                                <Label htmlFor="sub-name" className="text-indigo-900 font-bold text-base ml-1">Naam</Label>
                                <Input
                                    id="sub-name"
                                    value={newSub.name}
                                    onChange={handleNameChange}
                                    placeholder="Bijv. Italiaanse Restaurants"
                                    className="bg-white border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 h-14 rounded-2xl text-base px-6 font-semibold"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sub-slug" className="text-indigo-900 font-bold text-base ml-1">Slug (URL)</Label>
                                <Input
                                    id="sub-slug"
                                    value={newSub.slug}
                                    onChange={(e) => setNewSub({ ...newSub, slug: e.target.value })}
                                    className="bg-zinc-100/50 border-indigo-50 text-indigo-500 font-mono text-sm h-14 px-6 rounded-2xl"
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={handleAdd}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-14 px-10 rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95 text-lg"
                            >
                                Subcategorie Opslaan
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-0">
                {filteredSubcategories.length === 0 ? (
                    <div className="py-20 text-center text-zinc-400">
                        <Layers className="h-12 w-12 mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-medium">Geen subcategorieën gevonden.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {filteredSubcategories.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex-shrink-0">
                                        {sub.image ? (
                                            <img src={sub.image} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 text-zinc-300">
                                                <Layers className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-zinc-900 truncate">{sub.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-zinc-100 text-zinc-500 font-mono px-1.5 py-0.5 rounded uppercase tracking-tighter">slug</span>
                                            <p className="text-xs text-zinc-400 font-mono truncate">{sub.slug}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/subcategories/${sub.id}`}>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-transparent hover:border-indigo-100">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                        onClick={() => handleDelete(sub.id, sub.name)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
