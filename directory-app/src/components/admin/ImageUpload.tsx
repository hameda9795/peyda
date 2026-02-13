"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            setUploading(true);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            onChange(publicUrl);
        } catch (error: any) {
            console.error("Error uploading image:", error.message);
            alert("Upload mislukt. Zorg ervoor dat je een 'images' bucket hebt in Supabase.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Label className="text-zinc-900 font-bold text-sm tracking-tight">{label}</Label>
            <div className="flex flex-col gap-4">
                {value ? (
                    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-sm group bg-zinc-50">
                        <img src={value} alt="Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="rounded-full bg-white p-3 text-red-600 hover:bg-red-50 shadow-xl transition-all scale-75 group-hover:scale-100 font-bold"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/30 transition-all hover:bg-zinc-50 hover:border-indigo-300 group">
                        <div className="text-center p-6">
                            <div className="mx-auto h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300 border border-zinc-100">
                                <ImageIcon className="h-6 w-6 text-zinc-400" />
                            </div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Geen afbeelding</p>
                            <p className="text-[10px] text-zinc-400 mt-1">PNG, JPG of WebP (max 2MB)</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden"
                            id={`image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                        />
                        <Button
                            asChild
                            type="button"
                            variant="outline"
                            className="w-full cursor-pointer bg-white border-zinc-200 hover:bg-zinc-50 hover:border-indigo-200 shadow-sm h-11 rounded-xl transition-all"
                            disabled={uploading}
                        >
                            <label htmlFor={`image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}>
                                {uploading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-600" />
                                ) : (
                                    <Upload className="mr-2 h-4 w-4 text-indigo-600" />
                                )}
                                <span className="font-bold text-zinc-700">{uploading ? "Bezig..." : "Uploaden"}</span>
                            </label>
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">URL</div>
                        <Input
                            placeholder="https://images.unsplash.com/..."
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="bg-zinc-50/50 border-zinc-200 shadow-sm focus-visible:ring-indigo-500 h-11 rounded-xl pl-10 text-xs"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
