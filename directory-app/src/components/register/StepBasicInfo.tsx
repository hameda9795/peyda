'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Tag, FileText, Check, ChevronDown, Search } from 'lucide-react';
import { StepProps } from '@/lib/types/business-form';
import { Label } from '@/components/ui/label';

type Category = {
    id: string;
    name: string;
    slug: string;
    subcategories: { id: string; name: string; slug: string }[];
};

export function StepBasicInfo({ formData, updateFormData }: StepProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    console.error('Failed to load categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const selectedCategory = categories.find(c => c.id === formData.category);

    console.log('Selected Category:', selectedCategory);

    const toggleSubcategory = (subId: string) => {
        if (formData.subcategories.includes(subId)) {
            updateFormData({
                subcategories: formData.subcategories.filter(id => id !== subId)
            });
        } else {
            updateFormData({
                subcategories: [...formData.subcategories, subId]
            });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Business Name */}
            <div className="space-y-3">
                <label className="premium-label flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    Bedrijfsnaam <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        placeholder="Bijv. De Koffie Kamer Utrecht"
                        className="premium-input w-full pl-4 pr-4"
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-900/5 group-focus-within:ring-2 group-focus-within:ring-indigo-500 pointer-events-none transition-all" />
                </div>
                <p className="text-xs text-slate-500 pl-1">Dit is de naam zoals die op uw pagina wordt getoond</p>
            </div>

            {/* Category */}
            <div className="space-y-3">
                <label className="premium-label flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-500" />
                    Hoofdcategorie <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setCategoryOpen(!categoryOpen)}
                        disabled={loading}
                        className={`w-full h-12 px-4 rounded-xl border bg-white text-left flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${categoryOpen ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-300 hover:border-slate-400'
                            }`}
                    >
                        <span className={`font-medium ${selectedCategory ? 'text-slate-900' : 'text-slate-400'}`}>
                            {loading ? 'Categorieën laden...' : selectedCategory?.name || 'Selecteer een categorie'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${categoryOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {categoryOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden max-h-72 overflow-y-auto outline-none" // Scroll fix
                            >
                                <div className="p-2 space-y-1">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => {
                                                updateFormData({
                                                    category: category.id,
                                                    categorySlug: category.slug,
                                                    categoryName: category.name,
                                                    subcategories: [] // Reset subcategories
                                                });
                                                setCategoryOpen(false);
                                            }}
                                            className={`w-full px-4 py-3 text-left rounded-lg transition-all flex items-center justify-between group ${formData.category === category.id
                                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                                : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {category.name}
                                            {formData.category === category.id && <Check className="w-4 h-4 text-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Subcategories */}
            <AnimatePresence mode="wait">
                {selectedCategory && selectedCategory.subcategories?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2"
                    >
                        <label className="premium-label text-slate-700">
                            Subcategorieën <span className="text-rose-500">*</span>
                            <span className={`font-normal ml-2 text-xs uppercase tracking-wide ${formData.subcategories.length === 0 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                                (minimaal 1 selecteren)
                            </span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {selectedCategory.subcategories.map((sub) => {
                                const isSelected = formData.subcategories.includes(sub.id);
                                return (
                                    <motion.button
                                        key={sub.id}
                                        type="button"
                                        onClick={() => toggleSubcategory(sub.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isSelected
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 scale-105'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isSelected && <Check className="w-3.5 h-3.5" />}
                                        {sub.name}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Short Description */}
            <div className="space-y-3">
                <label className="premium-label flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Korte omschrijving <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                    <textarea
                        value={formData.shortDescription}
                        onChange={(e) => updateFormData({ shortDescription: e.target.value })}
                        placeholder="Beschrijf uw bedrijf in een paar pakkende zinnen..."
                        rows={4}
                        maxLength={500}
                        className="w-full p-4 rounded-xl bg-white border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 resize-none text-slate-700 placeholder:text-slate-400 font-medium"
                    />
                    <div className="flex justify-between text-xs mt-2 px-1">
                        <p className="text-slate-400">Wordt getoond in de zoekresultaten</p>
                        <span className={`font-mono ${formData.shortDescription.length > 450 ? 'text-amber-500' : 'text-slate-400'}`}>
                            {formData.shortDescription.length}/500
                        </span>
                    </div>
                </div>
            </div>

            {/* Click outside handler for dropdown */}
            {categoryOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setCategoryOpen(false)}
                />
            )}
        </div>
    );
}
