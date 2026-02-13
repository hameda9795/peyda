'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Video, X, UploadCloud, Info, Plus, Play } from 'lucide-react';
import { StepProps } from '@/lib/types/business-form';
import { useState, useRef } from 'react';

export function StepImages({ formData, updateFormData }: StepProps) {
    const [dragActive, setDragActive] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverImage' | 'gallery') => {
        if (e.target.files && e.target.files[0]) {
            if (field === 'gallery') {
                const newFiles = Array.from(e.target.files);
                updateFormData({
                    gallery: [...formData.gallery, ...newFiles].slice(0, 10) // Limit to 10
                });
            } else {
                updateFormData({ [field]: e.target.files[0] });
            }
        }
    };

    const removeGalleryImage = (index: number) => {
        updateFormData({
            gallery: formData.gallery.filter((_, i) => i !== index)
        });
    };

    const handleDrag = (e: React.DragEvent, field: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(field);
        } else if (e.type === "dragleave") {
            setDragActive(null);
        }
    };

    const handleDrop = (e: React.DragEvent, field: 'logo' | 'coverImage' | 'gallery') => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(null);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (field === 'gallery') {
                const newFiles = Array.from(e.dataTransfer.files);
                updateFormData({
                    gallery: [...formData.gallery, ...newFiles].slice(0, 10)
                });
            } else {
                updateFormData({ [field]: e.dataTransfer.files[0] });
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Logo Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Camera className="w-5 h-5" />
                    </span>
                    Bedrijfslogo
                </h3>

                <div
                    className={`relative grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-6 p-6 rounded-2xl border-2 border-dashed transition-all ${dragActive === 'logo'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300'
                        }`}
                    onDragEnter={(e) => handleDrag(e, 'logo')}
                    onDragLeave={(e) => handleDrag(e, 'logo')}
                    onDragOver={(e) => handleDrag(e, 'logo')}
                    onDrop={(e) => handleDrop(e, 'logo')}
                >
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center relative group mx-auto sm:mx-0">
                        {formData.logo ? (
                            <>
                                <img
                                    src={URL.createObjectURL(formData.logo)}
                                    alt="Logo preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => updateFormData({ logo: null })}
                                    className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </>
                        ) : (
                            <Camera className="w-8 h-8 text-slate-300" />
                        )}
                    </div>

                    <div className="flex flex-col justify-center space-y-3 text-center sm:text-left">
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Sleep uw logo hierheen</p>
                            <p className="text-xs text-slate-500 mt-1">
                                JPG of PNG, max 2MB. Vierkant formaat aanbevolen.
                            </p>
                        </div>
                        <label className="inline-flex mx-auto sm:mx-0 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer w-fit">
                            Bestand kiezen
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-4 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <ImageIcon className="w-5 h-5" />
                    </span>
                    Omslagfoto
                </h3>

                <div
                    className={`relative w-full h-64 rounded-2xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all ${dragActive === 'cover'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300'
                        }`}
                    onDragEnter={(e) => handleDrag(e, 'cover')}
                    onDragLeave={(e) => handleDrag(e, 'cover')}
                    onDragOver={(e) => handleDrag(e, 'cover')}
                    onDrop={(e) => handleDrop(e, 'coverImage')}
                >
                    {formData.coverImage ? (
                        <div className="relative w-full h-full group">
                            <img
                                src={URL.createObjectURL(formData.coverImage)}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => updateFormData({ coverImage: null })}
                                    className="p-2 bg-white rounded-full bg-opacity-20 hover:bg-opacity-100 transition-all"
                                >
                                    <X className="w-6 h-6 text-white hover:text-rose-500" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-6">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                                <UploadCloud className="w-6 h-6 text-indigo-500" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">Sleep uw omslagfoto hierheen</p>
                            <p className="text-xs text-slate-500 mt-1 mb-4">
                                Minimaal 1200x600px voor het beste resultaat.
                            </p>
                            <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] transition-all cursor-pointer">
                                Foto uploaden
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} />
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery */}
            <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                            <ImageIcon className="w-5 h-5" />
                        </span>
                        Sfeerimpressie
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                        {formData.gallery.length} / 10 foto's
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {formData.gallery.map((file, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="aspect-square rounded-xl overflow-hidden relative group border border-slate-200"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Gallery ${index}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <button
                                    onClick={() => removeGalleryImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-rose-500"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {formData.gallery.length < 10 && (
                        <label
                            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-300 hover:text-indigo-600 flex flex-col items-center justify-center cursor-pointer transition-all gap-2 text-slate-400 group"
                            onDragEnter={(e) => handleDrag(e, 'gallery')}
                            onDragLeave={(e) => handleDrag(e, 'gallery')}
                            onDragOver={(e) => handleDrag(e, 'gallery')}
                            onDrop={(e) => handleDrop(e, 'gallery')}
                        >
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Plus className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium">Toevoegen</span>
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'gallery')}
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Video URL */}
            <div className="space-y-4 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Video className="w-5 h-5" />
                    </span>
                    Bedrijfsvideo
                </h3>
                <div className="space-y-2">
                    <label className="premium-label">
                        YouTube of Vimeo URL
                        <span className="text-slate-400 font-normal ml-2 text-xs uppercase tracking-wide">(optioneel)</span>
                    </label>
                    <div className="relative">
                        <input
                            type="url"
                            value={formData.videoUrl}
                            onChange={(e) => updateFormData({ videoUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="premium-input w-full pl-10 pr-4"
                        />
                        <Play className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>

                    {formData.videoUrl && (
                        <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-slate-900 shadow-md">
                            {/* Simple validation/embed preview could go here */}
                            <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-100">
                                <p className="text-sm font-medium">Preview wordt geladen...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
