"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slugify";
import { ImageUpload } from "./ImageUpload";
import { Save, Globe, Info, Settings } from "lucide-react";

interface CategoryFormProps {
    action: (formData: FormData) => Promise<void>;
    defaultValues?: {
        name?: string;
        slug?: string;
        description?: string;
        icon?: string;
        image?: string;
        seoTitle?: string;
        seoDescription?: string;
    };
    submitLabel?: string;
}

export function CategoryForm({ action, defaultValues = {}, submitLabel = "Opslaan" }: CategoryFormProps) {
    const [name, setName] = useState(defaultValues.name || "");
    const [slug, setSlug] = useState(defaultValues.slug || "");
    const [image, setImage] = useState(defaultValues.image || "");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        setSlug(slugify(newName));
    };

    async function handleSubmit(formData: FormData) {
        try {
            setLoading(true);
            setError(null);
            // Append the image value manually as it's state-managed
            formData.set("image", image);
            await action(formData);
        } catch (e: any) {
            console.error("Submission error:", e);
            if (e.message !== "NEXT_REDIRECT" && !e.digest?.includes("NEXT_REDIRECT")) {
                setError(e.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 w-full" suppressHydrationWarning>
            {error && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-center gap-3 text-sm text-red-600 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-3xl border border-zinc-200 p-10 shadow-sm space-y-10 transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-4 mb-2 text-zinc-900 font-extrabold text-2xl uppercase tracking-tight">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Info className="h-6 w-6" />
                            </div>
                            Algemene Informatie
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="grid gap-3">
                                <Label htmlFor="name" className="text-zinc-900 font-bold text-base ml-1">Naam</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Bijv. Restaurants & Cafés"
                                    value={name}
                                    onChange={handleNameChange}
                                    className="bg-zinc-50/50 border-zinc-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all h-16 text-lg px-6 rounded-2xl font-semibold placeholder:text-zinc-400 border-2"
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="slug" className="text-zinc-900 font-bold text-base ml-1">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    required
                                    placeholder="bijv: restaurants-cafes"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-zinc-100/50 border-zinc-200 text-zinc-500 font-mono text-base h-16 px-6 rounded-2xl transition-all border-2"
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="description" className="text-zinc-900 font-bold text-base ml-1">Beschrijving</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Vertel meer over deze categorie..."
                                defaultValue={defaultValues.description || ""}
                                className="min-h-[250px] bg-zinc-50/50 border-zinc-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none p-6 rounded-2xl text-lg leading-relaxed font-medium border-2"
                            />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="icon" className="text-zinc-900 font-bold text-base ml-1">Icoon (Lucide Naam)</Label>
                            <Input
                                id="icon"
                                name="icon"
                                placeholder="e.g. Utensils, Coffee, MapPin..."
                                defaultValue={defaultValues.icon || ""}
                                className="bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all h-16 px-6 rounded-2xl text-base font-medium border-2"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-zinc-200 p-10 shadow-sm space-y-10 transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-4 mb-2 text-zinc-900 font-extrabold text-2xl uppercase tracking-tight">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Globe className="h-6 w-6" />
                            </div>
                            SEO Instellingen
                        </div>

                        <div className="grid gap-10">
                            <div className="grid gap-3">
                                <Label htmlFor="seoTitle" className="text-zinc-900 font-bold text-base ml-1">Meta Titel</Label>
                                <Input
                                    id="seoTitle"
                                    name="seoTitle"
                                    placeholder="Beste Restaurants in Utrecht | Directory"
                                    defaultValue={defaultValues.seoTitle || ""}
                                    className="bg-zinc-50/50 border-zinc-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all h-16 text-lg px-6 rounded-2xl font-semibold border-2"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="seoDescription" className="text-zinc-900 font-bold text-base ml-1">Meta Beschrijving</Label>
                                <Textarea
                                    id="seoDescription"
                                    name="seoDescription"
                                    placeholder="Korte samenvatting voor Google..."
                                    defaultValue={defaultValues.seoDescription || ""}
                                    className="min-h-[150px] bg-zinc-50/50 border-zinc-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none p-6 rounded-2xl text-lg font-medium border-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm sticky top-10 transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-4 mb-8 text-zinc-900 font-extrabold text-xl uppercase tracking-tight border-b border-zinc-100 pb-6">
                            <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Settings className="h-5 w-5" />
                            </div>
                            Media & Publicatie
                        </div>

                        <div className="space-y-10">
                            <ImageUpload
                                label="Omslagafbeelding"
                                value={image}
                                onChange={setImage}
                            />

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black h-20 rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-[0.98] text-xl flex items-center justify-center gap-4"
                                >
                                    <Save className="h-8 w-8" />
                                    {submitLabel}
                                </Button>
                                <p className="text-center text-xs text-zinc-400 mt-6 font-bold uppercase tracking-[0.2em]">Klik om wijzigingen op te slaan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
