'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Phone,
    Mail,
    Instagram,
    Facebook,
    Linkedin,
    ChevronDown,
    Globe,
    Plus,
    Building2,
    Home,
    Check,
    AlertCircle
} from 'lucide-react';
import { StepProps } from '@/lib/types/business-form';
import { useEffect, useState } from 'react';
import { NETHERLANDS_PROVINCES } from '@/lib/netherlands-data';

type CityOption = {
    id: string;
    name: string;
    slug: string;
    _count?: { neighborhoods: number };
};

type NeighborhoodOption = {
    id: string;
    name: string;
    slug: string;
};

// Type for custom location input
export type CustomLocation = {
    city: string;
    neighborhood: string;
    province: string;
    isCustom: true;
};

export function StepAddress({ formData, updateFormData }: StepProps) {
    // Dropdown states
    const [provinceOpen, setProvinceOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);
    const [neighborhoodOpen, setNeighborhoodOpen] = useState(false);
    
    // Search queries
    const [provinceQuery, setProvinceQuery] = useState('');
    const [cityQuery, setCityQuery] = useState('');
    const [neighborhoodQuery, setNeighborhoodQuery] = useState('');
    
    // Options
    const [provinceOptions] = useState(NETHERLANDS_PROVINCES);
    const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
    const [neighborhoodOptions, setNeighborhoodOptions] = useState<NeighborhoodOption[]>([]);
    
    // Loading states
    const [cityLoading, setCityLoading] = useState(false);
    const [neighborhoodLoading, setNeighborhoodLoading] = useState(false);
    const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);
    
    // Custom input mode states
    const [cityInputMode, setCityInputMode] = useState<'dropdown' | 'custom'>('dropdown');
    const [neighborhoodInputMode, setNeighborhoodInputMode] = useState<'dropdown' | 'custom'>('dropdown');
    const [customCityName, setCustomCityName] = useState('');
    const [customNeighborhoodName, setCustomNeighborhoodName] = useState('');
    
    // Custom location submission
    const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
    const [customLocationSubmitted, setCustomLocationSubmitted] = useState(false);

    // Filter provinces based on search
    const filteredProvinces = provinceQuery
        ? provinceOptions.filter(p => p.name.toLowerCase().includes(provinceQuery.toLowerCase()))
        : provinceOptions;

    // Check if we should show custom city option
    const showCustomCityOption = cityQuery.length >= 2 && !cityLoading && 
        cityOptions.length === 0 && cityQuery.toLowerCase() !== formData.city?.toLowerCase();

    // Check if we should show custom neighborhood option
    // For custom cities: always allow custom neighborhood input
    // For existing cities: show only when search returns no results
    const showCustomNeighborhoodOption = formData.city && (
        cityInputMode === 'custom' || 
        (selectedCitySlug && neighborhoodQuery.length >= 2 && neighborhoodOptions.length === 0)
    ) && !neighborhoodLoading &&
        neighborhoodQuery.toLowerCase() !== formData.neighborhood?.toLowerCase();

    // Fetch city by name when needed
    useEffect(() => {
        if (!formData.city) return;
        if (selectedCitySlug) return;

        let isActive = true;
        const controller = new AbortController();

        const fetchCity = async () => {
            try {
                const response = await fetch(`/api/cities?q=${encodeURIComponent(formData.city)}&limit=20`, {
                    signal: controller.signal,
                });
                if (!response.ok) return;
                const data: CityOption[] = await response.json();
                const match = data.find(
                    (city) => city.name.toLowerCase() === formData.city.toLowerCase()
                );
                if (match && isActive) {
                    setSelectedCitySlug(match.slug);
                    setCityInputMode('dropdown');
                } else if (!match && isActive) {
                    // City not found in database, switch to custom mode
                    setCityInputMode('custom');
                    setCustomCityName(formData.city);
                }
            } catch {
                // ignore
            }
        };

        fetchCity();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [formData.city, selectedCitySlug]);

    // Fetch cities from API
    useEffect(() => {
        if (!cityOpen && !cityQuery) return;

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            setCityLoading(true);
            try {
                const response = await fetch(`/api/cities?q=${encodeURIComponent(cityQuery)}&limit=50`, {
                    signal: controller.signal,
                });
                if (!response.ok) return;
                const data: CityOption[] = await response.json();
                setCityOptions(data);
            } catch {
                // ignore
            } finally {
                setCityLoading(false);
            }
        }, 250);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [cityOpen, cityQuery]);

    // Fetch neighborhoods when city slug changes or dropdown opens
    useEffect(() => {
        if (!selectedCitySlug) return;

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            setNeighborhoodLoading(true);
            try {
                const response = await fetch(
                    `/api/cities/${selectedCitySlug}/neighborhoods?q=${encodeURIComponent(neighborhoodQuery)}&limit=200`,
                    { signal: controller.signal }
                );
                if (!response.ok) {
                    console.error('Failed to fetch neighborhoods:', response.status);
                    return;
                }
                const data: { neighborhoods: NeighborhoodOption[] } = await response.json();
                setNeighborhoodOptions(data.neighborhoods || []);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('Error fetching neighborhoods:', err);
                }
            } finally {
                setNeighborhoodLoading(false);
            }
        }, 150);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [selectedCitySlug, neighborhoodQuery]);

    // Handle custom city submission
    const handleCustomCitySubmit = () => {
        if (!customCityName.trim() || !formData.province) return;
        
        updateFormData({ 
            city: customCityName.trim(),
            neighborhood: '' 
        });
        setCityInputMode('custom');
        setCityOpen(false);
        setCustomLocationSubmitted(true);
    };

    // Handle custom neighborhood submission
    const handleCustomNeighborhoodSubmit = () => {
        if (!customNeighborhoodName.trim()) return;
        
        updateFormData({ neighborhood: customNeighborhoodName.trim() });
        setNeighborhoodInputMode('custom');
        setNeighborhoodOpen(false);
    };

    // Switch back to dropdown mode
    const switchToDropdownMode = () => {
        setCityInputMode('dropdown');
        setNeighborhoodInputMode('dropdown');
        setCustomCityName('');
        setCustomNeighborhoodName('');
        updateFormData({ city: '', neighborhood: '' });
        setSelectedCitySlug(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Address Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <MapPin className="w-5 h-5" />
                    </span>
                    Adresgegevens
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Street */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="premium-label">
                            Straat en huisnummer <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.street}
                            onChange={(e) => updateFormData({ street: e.target.value })}
                            placeholder="Bijv. Oudegracht 123"
                            className="premium-input w-full px-4"
                        />
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-2">
                        <label className="premium-label">
                            Postcode <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => updateFormData({ postalCode: e.target.value.toUpperCase() })}
                            placeholder="1234 AB"
                            maxLength={7}
                            className="premium-input w-full px-4 uppercase"
                        />
                    </div>

                    {/* Province */}
                    <div className="space-y-2">
                        <label className="premium-label">
                            Provincie <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setProvinceOpen(!provinceOpen)}
                                className={`w-full h-12 px-4 rounded-xl border bg-white text-left flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${provinceOpen ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <span className={`font-medium ${formData.province ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {formData.province || 'Selecteer uw provincie'}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${provinceOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {provinceOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden max-h-72 overflow-y-auto"
                                    >
                                        <div className="p-2 space-y-2">
                                            <input
                                                type="text"
                                                value={provinceQuery}
                                                onChange={(e) => setProvinceQuery(e.target.value)}
                                                placeholder="Zoek provincie..."
                                                className="premium-input w-full px-4 h-10"
                                            />
                                            {filteredProvinces.map((province) => (
                                                <button
                                                    key={province.slug}
                                                    type="button"
                                                    onClick={() => {
                                                        updateFormData({ province: province.name, city: '', neighborhood: '' });
                                                        setSelectedCitySlug(null);
                                                        setCityInputMode('dropdown');
                                                        setNeighborhoodInputMode('dropdown');
                                                        setProvinceQuery('');
                                                        setProvinceOpen(false);
                                                    }}
                                                    className={`w-full px-4 py-2.5 text-left rounded-lg transition-all text-sm font-medium ${formData.province === province.name
                                                        ? 'bg-indigo-50 text-indigo-700'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <span className="ml-2">{province.icon}</span> {province.name}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* City - With Dynamic Input Support */}
                    <div className="space-y-2">
                        <label className="premium-label">
                            Plaats <span className="text-rose-500">*</span>
                        </label>
                        
                        {/* Custom City Input Mode */}
                        {cityInputMode === 'custom' ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                    <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                    <span className="text-sm text-amber-800">
                                        Aangepaste stad: <strong>{formData.city}</strong>
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={switchToDropdownMode}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                    Toch uit lijst selecteren
                                </button>
                            </div>
                        ) : (
                            /* Dropdown City Input Mode */
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setCityOpen(!cityOpen)}
                                    className={`w-full h-12 px-4 rounded-xl border bg-white text-left flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${cityOpen ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <span className={`font-medium ${formData.city ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {formData.city || 'Selecteer uw stad'}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${cityOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {cityOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden max-h-80 overflow-y-auto"
                                        >
                                            <div className="p-2 space-y-2">
                                                <input
                                                    type="text"
                                                    value={cityQuery}
                                                    onChange={(e) => setCityQuery(e.target.value)}
                                                    placeholder="Zoek stad..."
                                                    className="premium-input w-full px-4 h-10"
                                                />
                                                {cityLoading && (
                                                    <div className="px-4 py-2 text-xs text-slate-400">Laden...</div>
                                                )}
                                                {!cityLoading && cityOptions.length === 0 && !showCustomCityOption && (
                                                    <div className="px-4 py-2 text-xs text-slate-400">
                                                        Typ om te zoeken...
                                                    </div>
                                                )}
                                                
                                                {/* City Options */}
                                                {cityOptions.map((city) => (
                                                    <button
                                                        key={city.id}
                                                        type="button"
                                                        onClick={() => {
                                                            updateFormData({ city: city.name, neighborhood: '' });
                                                            setSelectedCitySlug(city.slug);
                                                            setNeighborhoodQuery('');
                                                            setNeighborhoodOptions([]);
                                                            setCityOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-2.5 text-left rounded-lg transition-all text-sm font-medium ${formData.city === city.name
                                                            ? 'bg-indigo-50 text-indigo-700'
                                                            : 'text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {city.name}
                                                        {city._count?.neighborhoods ? (
                                                            <span className="ml-2 text-xs text-slate-400">
                                                                {city._count.neighborhoods} wijken
                                                            </span>
                                                        ) : null}
                                                    </button>
                                                ))}

                                                {/* Custom City Option */}
                                                {showCustomCityOption && (
                                                    <div className="border-t border-slate-100 pt-2 mt-2">
                                                        <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                            Stad niet gevonden?
                                                        </div>
                                                        <div className="px-2 pb-2">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={customCityName || cityQuery}
                                                                    onChange={(e) => setCustomCityName(e.target.value)}
                                                                    placeholder="Voer stad in..."
                                                                    className="flex-1 premium-input px-3 h-10 text-sm"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCustomCitySubmit();
                                                                    }}
                                                                    disabled={!customCityName.trim() && !cityQuery.trim()}
                                                                    className="px-3 h-10 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                    Toevoegen
                                                                </button>
                                                            </div>
                                                            <p className="mt-1.5 px-1 text-xs text-slate-500">
                                                                Deze stad wordt toegevoegd aan onze database
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Neighborhood - With Dynamic Input Support */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="premium-label">
                            Wijk <span className="text-rose-500">*</span>
                        </label>
                        
                        {/* When city is custom, show simple text input for neighborhood */}
                        {cityInputMode === 'custom' ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={formData.neighborhood}
                                    onChange={(e) => updateFormData({ neighborhood: e.target.value })}
                                    placeholder="Voer wijk in (bijv. Centrum)"
                                    className="premium-input w-full px-4"
                                />
                                <p className="text-xs text-slate-500">
                                    Omdat u een nieuwe stad heeft toegevoegd, kunt u de wijk zelf invullen.
                                </p>
                            </div>
                        ) : (
                            /* Dropdown Neighborhood Input Mode */
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!formData.city) return;
                                        setNeighborhoodOpen(!neighborhoodOpen);
                                    }}
                                    disabled={!formData.city}
                                    className={`w-full h-12 px-4 rounded-xl border bg-white text-left flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${neighborhoodOpen ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                                        } ${!formData.city ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className={`font-medium ${formData.neighborhood ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {formData.neighborhood || (formData.city ? 'Selecteer uw wijk' : 'Kies eerst een stad')}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${neighborhoodOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {neighborhoodOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden max-h-80 overflow-y-auto"
                                        >
                                            <div className="p-2 space-y-1">
                                                <input
                                                    type="text"
                                                    value={neighborhoodQuery}
                                                    onChange={(e) => setNeighborhoodQuery(e.target.value)}
                                                    placeholder="Zoek wijk..."
                                                    className="premium-input w-full px-4 h-10"
                                                />
                                                {neighborhoodLoading && (
                                                    <div className="px-4 py-2 text-xs text-slate-400">Laden...</div>
                                                )}
                                                {!neighborhoodLoading && neighborhoodOptions.length === 0 && !showCustomNeighborhoodOption && (
                                                    <div className="px-4 py-2 text-xs text-slate-400">
                                                        Geen wijken gevonden
                                                    </div>
                                                )}

                                                {/* Neighborhood Options */}
                                                {neighborhoodOptions.map((neighborhood) => (
                                                    <button
                                                        key={neighborhood.id}
                                                        type="button"
                                                        onClick={() => {
                                                            updateFormData({ neighborhood: neighborhood.name });
                                                            setNeighborhoodOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-2.5 text-left rounded-lg transition-all text-sm font-medium ${formData.neighborhood === neighborhood.name
                                                            ? 'bg-indigo-50 text-indigo-700'
                                                            : 'text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {neighborhood.name}
                                                    </button>
                                                ))}

                                                {/* Custom Neighborhood Option */}
                                                {showCustomNeighborhoodOption && (
                                                    <div className="border-t border-slate-100 pt-2 mt-2">
                                                        <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                            Wijk niet gevonden?
                                                        </div>
                                                        <div className="px-2 pb-2">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={customNeighborhoodName || neighborhoodQuery}
                                                                    onChange={(e) => setCustomNeighborhoodName(e.target.value)}
                                                                    placeholder="Voer wijk in..."
                                                                    className="flex-1 premium-input px-3 h-10 text-sm"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCustomNeighborhoodSubmit();
                                                                    }}
                                                                    disabled={!customNeighborhoodName.trim() && !neighborhoodQuery.trim()}
                                                                    className="px-3 h-10 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                    Toevoegen
                                                                </button>
                                                            </div>
                                                            <p className="mt-1.5 px-1 text-xs text-slate-500">
                                                                Deze wijk wordt toegevoegd aan onze database
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Location Notice */}
                {(cityInputMode === 'custom' || neighborhoodInputMode === 'custom') && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-blue-900">
                                Nieuwe locatie gedetecteerd
                            </p>
                            <p className="text-sm text-blue-700">
                                De door u ingevoerde stad of wijk staat nog niet in onze database. 
                                Deze wordt automatisch opgeslagen en na goedkeuring toegevoegd.
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Contact Section */}
            <div className="space-y-6 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Phone className="w-5 h-5" />
                    </span>
                    Contactgegevens
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="premium-label">
                            Telefoonnummer <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData({ phone: e.target.value })}
                            placeholder="+31 30 123 4567"
                            className="premium-input w-full px-4"
                        />
                    </div>

                    {/* Email - Read-only, set from account */}
                    <div className="space-y-2">
                        <label className="premium-label">
                            E-mailadres <span className="text-rose-500">*</span>
                            <span className="ml-2 text-xs font-normal text-slate-500">(van je account)</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            readOnly
                            className="premium-input w-full px-4 bg-slate-50 cursor-not-allowed"
                        />
                    </div>

                    {/* Website */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="premium-label">
                            Website <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => updateFormData({ website: e.target.value })}
                                placeholder="https://www.uwbedrijf.nl"
                                className="premium-input w-full pl-10 pr-4"
                            />
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-6 pt-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Instagram className="w-5 h-5" />
                    </span>
                    Social Media
                    <span className="text-sm font-normal text-slate-500 ml-2">(optioneel)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Instagram */}
                    <div className="space-y-2">
                        <label className="premium-label flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-pink-500" />
                            Instagram
                        </label>
                        <input
                            type="text"
                            value={formData.instagram}
                            onChange={(e) => updateFormData({ instagram: e.target.value })}
                            placeholder="@uwbedrijf"
                            className="premium-input w-full px-4"
                        />
                    </div>

                    {/* Facebook */}
                    <div className="space-y-2">
                        <label className="premium-label flex items-center gap-2">
                            <Facebook className="w-4 h-4 text-blue-600" />
                            Facebook
                        </label>
                        <input
                            type="text"
                            value={formData.facebook}
                            onChange={(e) => updateFormData({ facebook: e.target.value })}
                            placeholder="facebook.com/uwbedrijf"
                            className="premium-input w-full px-4"
                        />
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-2">
                        <label className="premium-label flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            LinkedIn
                        </label>
                        <input
                            type="text"
                            value={formData.linkedin}
                            onChange={(e) => updateFormData({ linkedin: e.target.value })}
                            placeholder="linkedin.com/company/..."
                            className="premium-input w-full px-4"
                        />
                    </div>
                </div>
            </div>

            {/* Click outside handler */}
            {(neighborhoodOpen || cityOpen || provinceOpen) && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => {
                        setNeighborhoodOpen(false);
                        setCityOpen(false);
                        setProvinceOpen(false);
                    }}
                />
            )}
        </div>
    );
}
