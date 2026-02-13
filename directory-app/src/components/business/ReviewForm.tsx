"use client";

import { useState } from "react";
import { Star, Send, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createReview } from "@/lib/actions/review";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
    businessId: string;
}

export function ReviewForm({ businessId }: ReviewFormProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        content: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await createReview(businessId, {
                name: formData.name,
                email: formData.email,
                rating,
                content: formData.content
            });

            if (result.success) {
                setIsSuccess(true);
                router.refresh();
                setTimeout(() => {
                    setIsOpen(false);
                    setIsSuccess(false);
                    setFormData({ name: "", email: "", content: "" });
                    setRating(0);
                }, 2000);
            } else {
                setError(result.error || "Er is iets misgegaan.");
            }
        } catch (err) {
            setError("Er is een fout opgetreden.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5"
            >
                <Star className="w-4 h-4" />
                Schrijf een review
            </button>
        );
    }

    if (isSuccess) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">Bedankt voor uw review!</h3>
                <p className="text-emerald-700">Uw beoordeling is geplaatst.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200/50 mt-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Deel uw ervaring</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Rating Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Uw beoordeling</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="p-1 transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    className={cn(
                                        "w-8 h-8 transition-colors duration-200",
                                        (hoverRating || rating) >= star
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-slate-100 text-slate-300"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Naam</label>
                        <input
                            required
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                            placeholder="Uw naam"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                            E-mailadres <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                            placeholder="uw@email.com"
                        />
                        <p className="text-xs text-slate-500">Uw e-mailadres wordt niet gepubliceerd.</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="content" className="block text-sm font-semibold text-slate-700">Uw review</label>
                    <textarea
                        required
                        id="content"
                        rows={4}
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none placeholder:text-slate-400"
                        placeholder="Vertel ons over uw ervaring..."
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Versturen...</span>
                            </>
                        ) : (
                            <>
                                <span>Review Plaatsen</span>
                                <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
