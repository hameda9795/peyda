'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Award,
    Calendar,
    ExternalLink,
    MapPin,
    Phone,
    CalendarCheck,
    MessageSquare,
    Plus,
    X,
    HelpCircle,
} from 'lucide-react';
import { StepProps } from '@/lib/types/business-form';
import { getFaqTemplates } from '@/lib/faq-templates';

const CTA_OPTIONS = [
    { value: 'call', label: 'Bel ons', icon: Phone, description: 'Direct telefonisch contact' },
    { value: 'booking', label: 'Reserveren', icon: CalendarCheck, description: 'Online afspraak maken' },
    { value: 'quote', label: 'Offerte', icon: MessageSquare, description: 'Vrijblijvende aanvraag' },
] as const;

export function StepAdditional({ formData, updateFormData }: StepProps) {
    const [newCertification, setNewCertification] = useState('');
    const faqTemplates = useMemo(() => getFaqTemplates(formData.categorySlug), [formData.categorySlug]);

    useEffect(() => {
        // Prefill 5 vragen wanneer er nog geen FAQ is ingevuld
        if (!formData.faq || formData.faq.length === 0) {
            updateFormData({
                faq: faqTemplates.slice(0, 5).map((q) => ({ question: q, answer: '' })),
            });
        }
    }, [faqTemplates]); // eslint-disable-line react-hooks/exhaustive-deps

    const addCertification = () => {
        if (newCertification.trim()) {
            updateFormData({
                certifications: [...formData.certifications, newCertification.trim()]
            });
            setNewCertification('');
        }
    };

    const removeCertification = (index: number) => {
        updateFormData({
            certifications: formData.certifications.filter((_, i) => i !== index)
        });
    };

    const updateFaq = (index: number, data: Partial<{ question: string; answer: string }>) => {
        const next = [...(formData.faq || [])];
        if (!next[index]) next[index] = { question: '', answer: '' };
        next[index] = { ...next[index], ...data };
        updateFormData({ faq: next });
    };

    const addFaqRow = () => {
        const current = formData.faq || [];
        if (current.length >= 10) return;
        // pick next template not used yet, otherwise first default
        const unused = faqTemplates.find(
            (q) => !current.some((item) => item.question.toLowerCase() === q.toLowerCase())
        );
        const question = unused || faqTemplates[current.length % faqTemplates.length];
        updateFormData({ faq: [...current, { question, answer: '' }] });
    };

    const removeFaqRow = (index: number) => {
        const next = (formData.faq || []).filter((_, i) => i !== index);
        updateFormData({ faq: next });
    };

    const answeredFaqs = (formData.faq || []).filter(
        (item) => item.question?.trim() && item.answer?.trim()
    ).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KVK Number + Founded Year */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <FileText className="w-5 h-5" />
                    </span>
                    Extra Bedrijfsgegevens
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="premium-label">
                            KVK-nummer
                            <span className="text-slate-400 font-normal ml-2 text-xs uppercase tracking-wide">(optioneel)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.kvkNumber}
                            onChange={(e) => updateFormData({ kvkNumber: e.target.value })}
                            placeholder="12345678"
                            maxLength={8}
                            className="premium-input w-full px-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="premium-label">
                            Opgericht in
                            <span className="text-slate-400 font-normal ml-2 text-xs uppercase tracking-wide">(optioneel)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={formData.foundedYear}
                                onChange={(e) => updateFormData({ foundedYear: e.target.value })}
                                placeholder="2020"
                                min="1900"
                                max={new Date().getFullYear()}
                                className="premium-input w-full px-4 pl-10"
                            />
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Certifications */}
            <div className="space-y-6 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Award className="w-5 h-5" />
                    </span>
                    Keurmerken & Certificaten
                </h3>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                        placeholder="Bijv. ISO 9001, Erkend Leerbedrijf"
                        className="premium-input flex-1 px-4"
                    />
                    <motion.button
                        type="button"
                        onClick={addCertification}
                        disabled={!newCertification.trim()}
                        className="px-4 bg-slate-900 text-white rounded-xl font-medium shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>

                <AnimatePresence>
                    {formData.certifications.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap gap-2 pt-2"
                        >
                            {formData.certifications.map((cert, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-sm font-medium"
                                >
                                    <Award className="w-3.5 h-3.5" />
                                    {cert}
                                    <button
                                        type="button"
                                        onClick={() => removeCertification(index)}
                                        className="hover:text-rose-500 transition-colors ml-1 p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Service Area */}
            <div className="space-y-6 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <MapPin className="w-5 h-5" />
                    </span>
                    Werkgebied / Regio
                </h3>

                <div className="relative">
                    <input
                        type="text"
                        value={formData.serviceArea}
                        onChange={(e) => updateFormData({ serviceArea: e.target.value })}
                        placeholder="Bijv. Heel Utrecht, Randstad, of specifiek: Leidsche Rijn"
                        className="premium-input w-full px-4 pl-10"
                    />
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 pl-1">
                    Laat klanten weten in welke regio u actief bent.
                </p>
            </div>

            {/* Booking URL */}
            <div className="space-y-6 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <ExternalLink className="w-5 h-5" />
                    </span>
                    Externe Link
                </h3>

                <div className="relative">
                    <input
                        type="url"
                        value={formData.bookingUrl}
                        onChange={(e) => updateFormData({ bookingUrl: e.target.value })}
                        placeholder="https://www.uwbedrijf.nl/afspraak-maken"
                        className="premium-input w-full px-4 pl-10"
                    />
                    <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 pl-1">
                    Directe link naar uw contactformulier of reserveringssysteem.
                </p>
            </div>

            {/* SEO FAQ */}
            <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                            <HelpCircle className="w-5 h-5" />
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">SEO Vragen & Antwoorden</h3>
                            <p className="text-xs text-slate-500">
                                Kies tot 10 vragen, beantwoord er minimaal 5. Deze FAQ helpt Google uw pagina beter te begrijpen.
                            </p>
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                        {answeredFaqs}/5 minimaal
                    </div>
                </div>

                <div className="space-y-4">
                    {(formData.faq || []).map((item, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <div className="flex-1">
                                    <label className="premium-label text-xs">Vraag {index + 1}</label>
                                    <select
                                        value={item.question}
                                        onChange={(e) => updateFaq(index, { question: e.target.value })}
                                        className="premium-input w-full mt-1 text-sm"
                                    >
                                        {[item.question, ...faqTemplates].filter(
                                            (v, i, arr) => arr.indexOf(v) === i
                                        ).map((q) => (
                                            <option key={q} value={q}>
                                                {q}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFaqRow(index)}
                                    className="self-start md:self-center text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div>
                                <label className="premium-label text-xs">Antwoord</label>
                                <textarea
                                    value={item.answer}
                                    onChange={(e) => updateFaq(index, { answer: e.target.value })}
                                    rows={3}
                                    placeholder="Geef een concreet, uniek antwoord met zoekwoorden voor uw branche."
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm text-slate-700"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                                    <span>Tip: noem uw dienst + locatie (bijv. “kapper Utrecht Oost”).</span>
                                    <span>{item.answer.length}/320</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={addFaqRow}
                        disabled={(formData.faq || []).length >= 10}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-slate-300 text-sm font-medium text-slate-700 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        Voeg een vraag toe
                    </button>
                    <div className={`text-xs font-semibold ${answeredFaqs >= 5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {answeredFaqs >= 5 ? 'Klaar voor SEO' : 'Minstens 5 antwoorden invullen'}
                    </div>
                </div>
            </div>

            {/* CTA Type selection */}
            <div className="space-y-6 pt-6 mb-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">
                        Call-to-Action Knop
                    </h3>
                </div>
                <p className="text-sm text-slate-500">
                    Welke knop moeten we prominent tonen op uw profiel?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {CTA_OPTIONS.map((option) => (
                        <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => updateFormData({ ctaType: option.value })}
                            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${formData.ctaType === option.value
                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${formData.ctaType === option.value
                                    ? 'bg-white/20 text-white'
                                    : 'bg-indigo-50 text-indigo-600'
                                }`}>
                                <option.icon className="w-5 h-5" />
                            </div>
                            <h4 className={`font-bold ${formData.ctaType === option.value ? 'text-white' : 'text-slate-900'}`}>
                                {option.label}
                            </h4>
                            <p className={`text-xs mt-1 ${formData.ctaType === option.value ? 'text-indigo-100' : 'text-slate-500'}`}>
                                {option.description}
                            </p>

                            {formData.ctaType === option.value && (
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse" />
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Trust Banner */}
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4">
                <div className="p-2 bg-emerald-100 rounded-full shrink-0">
                    <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-emerald-800">SEO-Optimalisatie inbegrepen</h4>
                    <p className="text-xs text-emerald-600 mt-1">
                        Op basis van uw gegevens genereren wij automatisch de juiste meta-tags en structuur zodat uw bedrijf goed gevonden wordt in Google.
                    </p>
                </div>
            </div>

        </div>
    );
}
