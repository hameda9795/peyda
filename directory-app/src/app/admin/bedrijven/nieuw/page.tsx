'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    MapPin,
    Clock,
    Camera,
    FileText,
    ChevronRight,
    Sparkles,
    Check,
    Loader2,
    ArrowLeft,
    Shield,
    LayoutDashboard
} from 'lucide-react';
import { StepBasicInfo } from '@/components/register/StepBasicInfo';
import { StepAddress } from '@/components/register/StepAddress';
import { StepHoursServices } from '@/components/register/StepHoursServices';
import { StepImages } from '@/components/register/StepImages';
import { StepAdditional } from '@/components/register/StepAdditional';
import { BusinessPreview } from '@/components/register/BusinessPreview';
import { BusinessFormData } from '@/lib/types/business-form';
import { createBusinessAsAdmin } from '@/lib/actions/business';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const STEPS = [
    { id: 1, title: 'Basisgegevens', description: 'Naam & Categorie', icon: Building2 },
    { id: 2, title: 'Locatie', description: 'Adres & Contact', icon: MapPin },
    { id: 3, title: 'Diensten', description: 'Aanbod & Tijden', icon: LayoutDashboard },
    { id: 4, title: 'Media', description: "Foto's & Branding", icon: Camera },
    { id: 5, title: 'Details', description: 'KVK & Socials', icon: FileText },
];

const initialFormData: BusinessFormData = {
    name: '',
    category: '',
    categorySlug: '',
    categoryName: '',
    subcategories: [],
    shortDescription: '',
    street: '',
    postalCode: '',
    city: '',
    province: '',
    neighborhood: '',
    phone: '',
    email: '',
    website: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    openingHours: [
        { day: 'Maandag', open: '09:00', close: '17:00', closed: false },
        { day: 'Dinsdag', open: '09:00', close: '17:00', closed: false },
        { day: 'Woensdag', open: '09:00', close: '17:00', closed: false },
        { day: 'Donderdag', open: '09:00', close: '17:00', closed: false },
        { day: 'Vrijdag', open: '09:00', close: '17:00', closed: false },
        { day: 'Zaterdag', open: '10:00', close: '16:00', closed: false },
        { day: 'Zondag', open: '', close: '', closed: true },
    ],
    services: [
        { name: '', description: '', price: '' },
        { name: '', description: '', price: '' },
        { name: '', description: '', price: '' }
    ],
    amenities: [],
    paymentMethods: [],
    languages: ['Nederlands'],
    logo: null,
    coverImage: null,
    gallery: [],
    videoUrl: '',
    kvkNumber: '',
    foundedYear: '',
    certifications: [],
    bookingUrl: '',
    ctaType: 'call',
    serviceArea: '',
    faq: [],
};

export default function AdminNewBusinessPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
    const [direction, setDirection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiData, setAiData] = useState<any>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const updateFormData = (data: Partial<BusinessFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const validateStep = (step: number) => {
        let isValid = true;
        let errorMessage = '';

        switch (step) {
            case 1:
                if (!formData.name) { isValid = false; errorMessage = 'Bedrijfsnaam is verplicht.'; }
                else if (!formData.category) { isValid = false; errorMessage = 'Selecteer een categorie.'; }
                else if (!formData.subcategories || formData.subcategories.length === 0) { isValid = false; errorMessage = 'Selecteer minimaal één subcategorie.'; }
                else if (!formData.shortDescription) { isValid = false; errorMessage = 'Korte omschrijving is verplicht.'; }
                break;
            case 2:
                if (!formData.street) { isValid = false; errorMessage = 'Straat en huisnummer zijn verplicht.'; }
                else if (!formData.postalCode) { isValid = false; errorMessage = 'Postcode is verplicht.'; }
                else if (!formData.city) { isValid = false; errorMessage = 'Stad is verplicht.'; }
                else if (!formData.province) { isValid = false; errorMessage = 'Provincie is verplicht.'; }
                else if (!formData.phone) { isValid = false; errorMessage = 'Telefoonnummer is verplicht.'; }
                else if (!formData.email) { isValid = false; errorMessage = 'E-mailadres is verplicht.'; }
                else if (!formData.website) { isValid = false; errorMessage = 'Website is verplicht.'; }
                else {
                    try {
                        new URL(formData.website.startsWith('http') ? formData.website : `https://${formData.website}`);
                    } catch {
                        isValid = false; errorMessage = 'Voer een geldige website URL in.';
                    }
                }
                break;
            case 3:
                if (formData.services.filter(s => s.name.trim().length > 0).length < 3) {
                    isValid = false; errorMessage = 'Voeg minimaal 3 diensten of producten toe.';
                }
                break;
            case 4:
                if (!formData.coverImage) { isValid = false; errorMessage = 'Een omslagfoto is verplicht.'; }
                break;
            case 5:
                if ((formData.faq || []).filter(i => i.question?.trim() && i.answer?.trim()).length < 5) {
                    isValid = false; errorMessage = 'Beantwoord minimaal 5 SEO-vragen.';
                } else if (!formData.kvkNumber) {
                    isValid = false; errorMessage = 'KVK-nummer is verplicht.';
                } else if (formData.ctaType === 'booking' && !formData.bookingUrl) {
                    isValid = false; errorMessage = "Vul een reserveringslink in wanneer u 'Reserveren' als actieknop kiest.";
                }
                break;
        }

        if (!isValid) setError(errorMessage);
        else setError(null);
        return isValid;
    };

    const nextStep = () => {
        if (!validateStep(currentStep)) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        if (currentStep < STEPS.length) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setError(null);
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleGeneratePage = async () => {
        const answeredFaqs = (formData.faq || []).filter(i => i.question?.trim() && i.answer?.trim());
        if (answeredFaqs.length < 5) { setError('Beantwoord minimaal 5 SEO-vragen voordat u de pagina genereert.'); return; }
        if (formData.ctaType === 'booking' && !formData.bookingUrl) { setError("Vul een reserveringslink in."); return; }

        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/generate-listing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formData }),
            });
            if (!response.ok) throw new Error('Genereren mislukt');
            const data = await response.json();
            setAiData(data);
            setShowPreview(true);
        } catch (err) {
            setError('Er is een fout opgetreden bij het genereren. Probeer het opnieuw.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const manualFaq = (formData.faq || []).filter(i => i.question?.trim() && i.answer?.trim());
            const submissionData = { ...formData, ...aiData };
            if (manualFaq.length > 0) submissionData.faq = manualFaq;

            const data = new FormData();

            Object.keys(submissionData).forEach(key => {
                const value = submissionData[key as keyof typeof submissionData];
                if (value === null || value === undefined) return;
                if (key === 'logo' || key === 'coverImage' || key === 'gallery') return;
                if (Array.isArray(value) || typeof value === 'object') data.append(key, JSON.stringify(value));
                else data.append(key, String(value));
            });

            const uploadToSupabase = async (file: File, folder: string) => {
                const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const { error } = await supabase.storage.from('uploads').upload(`${folder}/${fileName}`, file);
                if (error) throw new Error(`Upload mislukt: ${error.message}`);
                return supabase.storage.from('uploads').getPublicUrl(`${folder}/${fileName}`).data.publicUrl;
            };

            if (formData.logo) data.append('logo', await uploadToSupabase(formData.logo, 'logos'));
            if (formData.coverImage) data.append('coverImage', await uploadToSupabase(formData.coverImage, 'covers'));
            if (formData.gallery?.length) {
                for (const file of formData.gallery) {
                    data.append('gallery', await uploadToSupabase(file, 'gallery'));
                }
            }
            if (aiData?.media?.altTexts) data.append('galleryAltTexts', JSON.stringify(aiData.media.altTexts));

            const result = await createBusinessAsAdmin(data);

            if (result.success && result.slug) {
                router.push('/admin/businesses');
                router.refresh();
            } else {
                throw new Error(result.error || 'Er is een fout opgetreden.');
            }
        } catch (err: any) {
            setError(err.message || 'Er is een fout opgetreden bij het opslaan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepBasicInfo formData={formData} updateFormData={updateFormData} />;
            case 2: return <StepAddress formData={formData} updateFormData={updateFormData} />;
            case 3: return <StepHoursServices formData={formData} updateFormData={updateFormData} />;
            case 4: return <StepImages formData={formData} updateFormData={updateFormData} />;
            case 5: return <StepAdditional formData={formData} updateFormData={updateFormData} />;
            default: return null;
        }
    };

    if (showPreview && aiData) {
        return (
            <BusinessPreview
                formData={formData}
                aiData={aiData}
                onBack={() => setShowPreview(false)}
                onConfirm={handleFinalSubmit}
                isSubmitting={isSubmitting}
                error={error}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link
                        href="/admin/businesses"
                        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Terug naar bedrijven
                    </Link>
                    <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                        Nieuw bedrijf registreren
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Bedrijf wordt direct gepubliceerd en goedgekeurd (admin-registratie)
                    </p>
                </div>

                {/* Step indicator */}
                <div className="hidden md:flex items-center gap-1">
                    {STEPS.map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                            <div key={step.id} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isActive ? 'bg-indigo-600 text-white' :
                                    isCompleted ? 'bg-emerald-500 text-white' :
                                    'bg-zinc-200 text-zinc-500'
                                }`}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                                </div>
                                {step.id < STEPS.length && (
                                    <div className={`w-6 h-0.5 ${isCompleted ? 'bg-emerald-400' : 'bg-zinc-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step title */}
            <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-2">
                    Stap {currentStep} van {STEPS.length} — {STEPS[currentStep - 1].title}
                </div>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 md:p-8">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction < 0 ? 20 : -20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600"
                >
                    <Shield className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </motion.div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-6">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        currentStep === 1
                            ? 'text-zinc-300 cursor-not-allowed'
                            : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                >
                    Vorige
                </button>

                {currentStep < STEPS.length ? (
                    <button
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 px-7 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md"
                    >
                        Volgende stap
                        <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleGeneratePage}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-2 px-7 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md disabled:opacity-60"
                    >
                        {isGenerating ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Pagina genereren...</>
                        ) : (
                            <><Sparkles className="w-4 h-4" /> Bedrijfspagina aanmaken</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
