'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Briefcase,
    Plus,
    Trash2,
    Wifi,
    CreditCard,
    Languages
} from 'lucide-react';
import {
    StepProps,
    AMENITIES_OPTIONS,
    PAYMENT_METHODS,
    LANGUAGES,
    Service
} from '@/lib/types/business-form';

export function StepHoursServices({ formData, updateFormData }: StepProps) {

    const updateOpeningHour = (index: number, field: string, value: string | boolean) => {
        const newHours = [...formData.openingHours];
        newHours[index] = { ...newHours[index], [field]: value };
        updateFormData({ openingHours: newHours });
    };

    const addService = () => {
        updateFormData({
            services: [...formData.services, { name: '', description: '', price: '' }]
        });
    };

    const removeService = (index: number) => {
        if (formData.services.length > 1) {
            updateFormData({
                services: formData.services.filter((_, i) => i !== index)
            });
        }
    };

    const updateService = (index: number, field: keyof Service, value: string) => {
        const newServices = [...formData.services];
        newServices[index] = { ...newServices[index], [field]: value };
        updateFormData({ services: newServices });
    };

    const toggleArrayItem = (array: string[], item: string, key: 'amenities' | 'paymentMethods' | 'languages') => {
        if (array.includes(item)) {
            updateFormData({ [key]: array.filter(i => i !== item) });
        } else {
            updateFormData({ [key]: [...array, item] });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Opening Hours */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Clock className="w-5 h-5" />
                    </span>
                    Openingstijden
                </h3>

                <div className="grid grid-cols-1 gap-2">
                    {formData.openingHours.map((hour, index) => (
                        <motion.div
                            key={hour.day}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all ${hour.closed
                                ? 'bg-slate-50 border-slate-100 opacity-70'
                                : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'
                                }`}
                        >
                            <span className="w-32 font-semibold text-slate-700">
                                {hour.day}
                            </span>

                            <div className="flex-1 flex items-center gap-4">
                                {!hour.closed ? (
                                    <div className="flex items-center gap-3 flex-1">
                                        <input
                                            type="time"
                                            value={hour.open}
                                            onChange={(e) => updateOpeningHour(index, 'open', e.target.value)}
                                            className="px-3 py-2 bg-slate-50 border border-slate-300 shadow-sm rounded-lg text-slate-900 font-medium text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                        <span className="text-slate-400 font-medium">-</span>
                                        <input
                                            type="time"
                                            value={hour.close}
                                            onChange={(e) => updateOpeningHour(index, 'close', e.target.value)}
                                            className="px-3 py-2 bg-slate-50 border border-slate-300 shadow-sm rounded-lg text-slate-900 font-medium text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                ) : (
                                    <span className="flex-1 text-sm font-medium text-slate-400 italic">Gesloten</span>
                                )}

                                <label className="flex items-center gap-2 cursor-pointer ml-auto">
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${hour.closed ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${hour.closed ? 'translate-x-4' : ''}`} />
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={hour.closed}
                                        onChange={(e) => updateOpeningHour(index, 'closed', e.target.checked)}
                                        className="hidden"
                                    />
                                    <span className="text-xs font-medium text-slate-500 w-12">{hour.closed ? 'Gesloten' : 'Open'}</span>
                                </label>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Services */}
            <div className="space-y-6 pt-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                            <Briefcase className="w-5 h-5" />
                        </span>
                        Diensten / Producten <span className="text-rose-500 ml-1">*</span>
                    </h3>
                    <motion.button
                        type="button"
                        onClick={addService}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-4 h-4" />
                        Dienst toevoegen
                    </motion.button>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {formData.services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="col-span-1 md:col-span-2 space-y-1">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Naam</label>
                                                <input
                                                    type="text"
                                                    value={service.name}
                                                    onChange={(e) => updateService(index, 'name', e.target.value)}
                                                    placeholder="Bijv. Knippen & Wassen"
                                                    className="premium-input w-full px-4"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prijs</label>
                                                <input
                                                    type="text"
                                                    value={service.price || ''}
                                                    onChange={(e) => updateService(index, 'price', e.target.value)}
                                                    placeholder="€ 35,00"
                                                    className="premium-input w-full px-4"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Omschrijving</label>
                                            <input
                                                type="text"
                                                value={service.description || ''}
                                                onChange={(e) => updateService(index, 'description', e.target.value)}
                                                placeholder="Korte toelichting (optioneel)"
                                                className="premium-input w-full px-4"
                                            />
                                        </div>
                                    </div>
                                    {formData.services.length > 1 && (
                                        <motion.button
                                            type="button"
                                            onClick={() => removeService(index)}
                                            className="mt-6 p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Amenities */}
            <div className="space-y-6 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Wifi className="w-5 h-5" />
                    </span>
                    Faciliteiten
                </h3>
                <div className="flex flex-wrap gap-2.5">
                    {AMENITIES_OPTIONS.map((amenity) => (
                        <motion.button
                            key={amenity}
                            type="button"
                            onClick={() => toggleArrayItem(formData.amenities, amenity, 'amenities')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${formData.amenities.includes(amenity)
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {amenity}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-6 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <CreditCard className="w-5 h-5" />
                    </span>
                    Betaalmethoden
                </h3>
                <div className="flex flex-wrap gap-2.5">
                    {PAYMENT_METHODS.map((method) => (
                        <motion.button
                            key={method}
                            type="button"
                            onClick={() => toggleArrayItem(formData.paymentMethods, method, 'paymentMethods')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${formData.paymentMethods.includes(method)
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {method}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Languages */}
            <div className="space-y-6 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Languages className="w-5 h-5" />
                    </span>
                    Talen
                </h3>
                <div className="flex flex-wrap gap-2.5">
                    {LANGUAGES.map((language) => (
                        <motion.button
                            key={language}
                            type="button"
                            onClick={() => toggleArrayItem(formData.languages, language, 'languages')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${formData.languages.includes(language)
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {language}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
