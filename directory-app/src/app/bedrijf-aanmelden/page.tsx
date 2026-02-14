'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    Star,
    LayoutDashboard
} from 'lucide-react';
import { StepBasicInfo } from '@/components/register/StepBasicInfo';
import { StepAddress } from '@/components/register/StepAddress';
import { StepHoursServices } from '@/components/register/StepHoursServices';
import { StepImages } from '@/components/register/StepImages';
import { StepAdditional } from '@/components/register/StepAdditional';
import { BusinessPreview } from '@/components/register/BusinessPreview';
import { BusinessFormData } from '@/lib/types/business-form';
import { createBusiness } from '@/lib/actions/business';

const STEPS = [
    { id: 1, title: 'Basisgegevens', description: 'Naam & Categorie', icon: Building2 },
    { id: 2, title: 'Locatie', description: 'Adres & Contact', icon: MapPin },
    { id: 3, title: 'Diensten', description: 'Aanbod & Tijden', icon: LayoutDashboard },
    { id: 4, title: 'Media', description: 'Foto\'s & Branding', icon: Camera },
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

export default function BusinessRegistrationPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
    const [direction, setDirection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const [aiData, setAiData] = useState<any>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const updateFormData = (data: Partial<BusinessFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const validateStep = (step: number) => {
        let isValid = true;
        let errorMessage = "";

        switch (step) {
            case 1:
                if (!formData.name) {
                    isValid = false;
                    errorMessage = "Bedrijfsnaam is verplicht.";
                } else if (!formData.category) {
                    isValid = false;
                    errorMessage = "Selecteer een categorie.";
                } else if (!formData.subcategories || formData.subcategories.length === 0) {
                    isValid = false;
                    errorMessage = "Selecteer minimaal één subcategorie.";
                } else if (!formData.shortDescription) {
                    isValid = false;
                    errorMessage = "Korte omschrijving is verplicht.";
                }
                break;
            case 2:
                if (!formData.street) {
                    isValid = false;
                    errorMessage = "Straat en huisnummer zijn verplicht.";
                } else if (!formData.postalCode) {
                    isValid = false;
                    errorMessage = "Postcode is verplicht.";
                } else if (!formData.city) {
                    isValid = false;
                    errorMessage = "Stad is verplicht.";
                } else if (!formData.province) {
                    isValid = false;
                    errorMessage = "Provincie is verplicht.";
                } else if (!formData.phone) {
                    isValid = false;
                    errorMessage = "Telefoonnummer is verplicht.";
                } else if (!formData.email) {
                    isValid = false;
                    errorMessage = "E-mailadres is verplicht.";
                } else if (!formData.website) {
                    isValid = false;
                    errorMessage = "Website is verplicht.";
                } else {
                    // Simple URL validation
                    try {
                        new URL(formData.website.startsWith('http') ? formData.website : `https://${formData.website}`);
                    } catch (_) {
                        isValid = false;
                        errorMessage = "Voer een geldige website URL in.";
                    }
                }
                break;
            case 3:
                const validServices = formData.services.filter(s => s.name.trim().length > 0);
                if (validServices.length < 3) {
                    isValid = false;
                    errorMessage = "Voeg minimaal 3 diensten of producten toe.";
                }
                break;
            case 4:
                // Check if cover image is provided
                if (!formData.coverImage) {
                    isValid = false;
                    errorMessage = "Een omslagfoto is verplicht.";
                }
                break;
            case 5:
                const answeredFaqs = (formData.faq || []).filter(
                    item => item.question?.trim() && item.answer?.trim()
                );
                if (answeredFaqs.length < 5) {
                    isValid = false;
                    errorMessage = "Beantwoord minimaal 5 SEO-vragen.";
                } else if (!formData.kvkNumber) {
                    isValid = false;
                    errorMessage = "KVK-nummer is verplicht.";
                }
                break;
            default:
                break;
        }

        if (!isValid) {
            setError(errorMessage);
        } else {
            setError(null);
        }

        return isValid;
    };

    const nextStep = () => {
        if (!validateStep(currentStep)) {
            // Shake effect or scroll to error could come here
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (currentStep < STEPS.length) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setError(null); // Clear error when going back
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleGeneratePage = async () => {
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
            console.error(err);
            setError('Er is een fout opgetreden bij het genereren van de pagina. Probeer het opnieuw.');
        } finally {
            setIsGenerating(false);
        }
    };

    // ... (other imports)

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Combine formData with standard fields and hidden SEO data
            const manualFaq = (formData.faq || []).filter(
                item => item.question?.trim() && item.answer?.trim()
            );

            const submissionData = {
                ...formData,
                ...aiData, // Includes detailed description, highlights, and SEO data (hidden)
            };

            // Manual FAQ answers override AI FAQ
            if (manualFaq.length > 0) {
                submissionData.faq = manualFaq;
            }

            const data = new FormData();

            // Append simple fields
            Object.keys(submissionData).forEach(key => {
                const value = submissionData[key as keyof typeof submissionData];
                if (value === null || value === undefined) return;

                if (key === 'logo' || key === 'coverImage' || key === 'gallery') return; // Handle files separately

                if (Array.isArray(value) || typeof value === 'object') {
                    data.append(key, JSON.stringify(value));
                } else {
                    data.append(key, String(value));
                }
            });

            // Append files
            if (formData.logo) data.append('logo', formData.logo);
            if (formData.coverImage) data.append('coverImage', formData.coverImage);
            if (formData.gallery) {
                formData.gallery.forEach((file) => {
                    data.append('gallery', file);
                });
            }

            // Append AI-generated altTexts for gallery images
            if (aiData?.media?.altTexts) {
                data.append('galleryAltTexts', JSON.stringify(aiData.media.altTexts));
            }

            const result = await createBusiness(data);

            if (result.success && result.slug) {
                // Construct the URL: /[province]/[city]/[neighborhood]/[category]/[subcategory]/[business]
                const provinceSlug = result.provinceSlug || 'utrecht';
                const citySlug = result.citySlug || 'utrecht';
                const neighborhoodSlug = result.neighborhoodSlug || 'centrum';
                const categorySlug = result.categorySlug || 'categorie';
                const subCategorySlug = result.subCategorySlug || 'subcategorie';

                router.refresh();
                router.push(`/${provinceSlug}/${citySlug}/${neighborhoodSlug}/${categorySlug}/${subCategorySlug}/${result.slug}`);
            } else {
                throw new Error(result.error || 'Er is een fout opgetreden.');
            }
        } catch (err: any) {
            console.error(err);
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

    if (!mounted) return null;

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
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans selection:bg-indigo-500/30">

            {/* LEFT SIDEBAR - PREMIUM VISUAL */}
            <div className="hidden lg:flex lg:w-[400px] xl:w-[480px] bg-[#0F172A] relative flex-col justify-between overflow-hidden shrink-0 transition-all duration-500">

                {/* Abstract Background Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4338ca] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3b82f6] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000" />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
                </div>

                {/* Header Brand */}
                <div className="relative z-10 p-10">
                    <Link href="/" className="inline-flex items-center gap-3 group mb-12">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-all duration-300">
                            <span className="text-white font-bold text-xl">U</span>
                        </div>
                        <div>
                            <span className="block text-white font-bold text-lg tracking-tight leading-none">Utrecht</span>
                            <span className="block text-indigo-200/60 text-xs font-medium tracking-widest uppercase mt-0.5">Business Directory</span>
                        </div>
                    </Link>

                    <div className="mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wide">Business Partner</span>
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                            Zet uw bedrijf <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                op de kaart.
                            </span>
                        </h1>
                        <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                            Word onderdeel van het snelst groeiende zakelijke netwerk in Utrecht. Professioneel, vindbaar en lokaal.
                        </p>
                    </div>

                    {/* Vertical Progress */}
                    <div className="space-y-0.5 relative">
                        {/* Connecting Line Backdrop */}
                        <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-slate-800/50 rounded-full" />

                        {/* Fluid Progress Line */}
                        <motion.div
                            className="absolute left-[19px] top-6 w-[2px] bg-indigo-500 rounded-full origin-top"
                            initial={{ height: '0%' }}
                            animate={{ height: `${((currentStep - 1) / (STEPS.length - 1)) * 80}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />

                        {STEPS.map((step, idx) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div key={step.id} className="group flex items-center gap-5 relative py-3">
                                    <div
                                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110'
                                            : isCompleted
                                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                                                : 'bg-slate-900 border-slate-700 text-slate-500'
                                            }`}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                {step.title}
                                            </span>
                                            {isActive && (
                                                <motion.span
                                                    layoutId="active-indicator"
                                                    className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                                                />
                                            )}
                                        </div>
                                        <p className={`text-xs transition-colors duration-300 mt-0.5 ${isActive ? 'text-indigo-200/70' : 'text-slate-600'}`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Testimonial / Trust */}
                <div className="relative z-10 p-10 mt-auto bg-slate-900/50 backdrop-blur-md border-t border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border border-slate-800 bg-indigo-900/40 flex items-center justify-center text-[10px] text-white overflow-hidden">
                                    {/* Placeholder avatars */}
                                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                            </div>
                            <span className="text-xs text-slate-400 font-medium mt-0.5">Vertrouwd door 500+ bedrijven</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN CONTENT - FORM */}
            <div className="flex-1 flex flex-col relative h-full min-h-screen overflow-hidden">

                {/* Mobile Header (Only visible on small screens) */}
                <div className="lg:hidden p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
                    <Link href="/" className="font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold">U</span>
                        </div>
                        <span className="text-sm">Utrecht Directory</span>
                    </Link>
                    <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        Stap {currentStep} van {STEPS.length}
                    </div>
                </div>

                {/* Main Scrollable Area */}
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="max-w-2xl mx-auto px-6 py-10 lg:py-16">

                        {/* Top Navigation */}
                        <div className="flex items-center justify-between mb-10">
                            <Link href="/" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-800 transition-colors">
                                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 group-hover:shadow-sm transition-all">
                                    <ArrowLeft className="w-4 h-4" />
                                </span>
                                Terug
                            </Link>

                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                                Hulp nodig?
                            </button>
                        </div>

                        {/* Step Title & Animation */}
                        <div className="mb-10">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
                                    STAP {currentStep}
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                                    {STEPS[currentStep - 1].title}
                                </h2>
                                <p className="text-lg text-slate-500 font-light">
                                    {currentStep === 1 && "Laten we beginnen met de basis van uw bedrijf."}
                                    {currentStep === 2 && "Waar kunnen klanten u vinden of bereiken?"}
                                    {currentStep === 3 && "Wanneer bent u open en wat biedt u aan?"}
                                    {currentStep === 4 && "Een goede eerste indruk is goud waard."}
                                    {currentStep === 5 && "Bijna klaar! Nog enkele details."}
                                </p>
                            </motion.div>
                        </div>

                        {/* Form Content */}
                        <div className="relative">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    initial={{ opacity: 0, x: direction > 0 ? 30 : -30, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, x: direction < 0 ? 30 : -30, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-8"
                                >
                                    {renderStep()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Error Handling */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600"
                            >
                                <Shield className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}

                        {/* Footer Controls */}
                        <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-200/60">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${currentStep === 1
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                Vorige
                            </button>

                            {currentStep < STEPS.length ? (
                                <button
                                    onClick={nextStep}
                                    className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F172A] text-white rounded-xl text-sm font-semibold shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:scale-[1.02] transition-all active:scale-[0.98] overflow-hidden"
                                >
                                    <span className="relative z-10">Volgende Stap</span>
                                    <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleGeneratePage}
                                    disabled={isGenerating}
                                    className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Pagina Genereren...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            <span>Maak mijn bedrijfspagina</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
