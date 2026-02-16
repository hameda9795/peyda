"use client";

import { useState, useEffect, useRef, use } from "react";
import { Save, Upload, X, Instagram, Facebook, Linkedin, Globe, Plus, Trash2 } from "lucide-react";
import { updateProfile as updateProfileAction, updateOpeningHours, generateSeoData } from "../actions";
import { SeoStatusWidget } from "@/components/dashboard/SeoStatusWidget";

const defaultOpeningHours = [
    { day: "Maandag", open: "08:00", close: "18:00", closed: false },
    { day: "Dinsdag", open: "08:00", close: "18:00", closed: false },
    { day: "Woensdag", open: "08:00", close: "18:00", closed: false },
    { day: "Donderdag", open: "08:00", close: "18:00", closed: false },
    { day: "Vrijdag", open: "08:00", close: "18:00", closed: false },
    { day: "Zaterdag", open: "09:00", close: "18:00", closed: false },
    { day: "Zondag", open: "10:00", close: "17:00", closed: false },
];

const AMENITIES_OPTIONS = [
    'Wi-Fi', 'Parkeren', 'Rolstoeltoegankelijk', 'Toilet', 'Airconditioning',
    'Terras', 'Kinderen welkom', 'Huisdieren welkom', 'Reserveren mogelijk',
    'Afhalen mogelijk', 'Bezorging',
];

const PAYMENT_METHODS = [
    'Contant', 'PIN', 'Creditcard', 'Apple Pay', 'Google Pay', 'iDEAL', 'Tikkie', 'Op rekening',
];

const LANGUAGES = [
    'Nederlands', 'Engels', 'Duits', 'Frans', 'Spaans', 'Turks', 'Arabisch', 'Pools',
];

type Service = {
    name: string;
    description?: string;
    price?: string;
};

const defaultFormData = {
    name: "Voorbeeld Restaurant",
    phone: "+31 20 123 4567",
    email: "info@voorbeeld.nl",
    website: "https://voorbeeld.nl",
    street: "Kalverstraat 123",
    postalCode: "1012 NX",
    city: "Amsterdam",
    neighborhood: "Centrum",
    province: "Noord-Holland",
    shortDescription: "Authentiek Italiaans restaurant in hartje Amsterdam met huisgemaakte pasta.",
    openingHours: defaultOpeningHours,
    services: [{ name: "", description: "", price: "" }] as Service[],
    amenities: [] as string[],
    paymentMethods: [] as string[],
    languages: ["Nederlands"] as string[],
    instagram: "",
    facebook: "",
    linkedin: "",
    kvkNumber: "",
    foundedYear: "",
    serviceArea: "",
    bookingUrl: "",
    certifications: [] as string[],
    logo: null as File | null,
    coverImage: null as File | null,
};

type FAQ = {
    question: string;
    answer: string;
};

export default function ProfilePage({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
    const params = use(searchParams);
    const [formData, setFormData] = useState(defaultFormData);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [images, setImages] = useState<Array<{ id: string; url: string; altText: string }>>([]);
    const businessId = params.businessId;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Logo and cover image state
    const [logoPreview, setLogoPreview] = useState<string>("");
    const [coverPreview, setCoverPreview] = useState<string>("");
    const [existingLogo, setExistingLogo] = useState<string>("");
    const [existingCover, setExistingCover] = useState<string>("");
    const [logoAltText, setLogoAltText] = useState<string>("");
    const [coverAltText, setCoverAltText] = useState<string>("");
    const [faqList, setFaqList] = useState<FAQ[]>([]);

    // SEO State
    const [seoStatus, setSeoStatus] = useState<'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED' | null>(null);
    const [seoLastUpdate, setSeoLastUpdate] = useState<Date | null>(null);
    const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
    const [seoData, setSeoData] = useState({
        title: '',
        description: '',
        keywords: [] as string[]
    });

    // Function to handle SEO generation
    const handleGenerateSeo = async () => {
        setIsGeneratingSeo(true);
        setSeoStatus('GENERATING');

        try {
            const result = await generateSeoData(businessId);
            if (result.success) {
                setSeoStatus('COMPLETED');
                setSeoLastUpdate(new Date());
                // Refresh the page after successful generation
                window.location.reload();
            } else {
                setSeoStatus('FAILED');
                alert('SEO generatie mislukt: ' + (result.error || 'Onbekende fout'));
            }
        } catch (error) {
            console.error('Error generating SEO:', error);
            setSeoStatus('FAILED');
            alert('Er is een fout opgetreden bij het genereren van SEO');
        } finally {
            setIsGeneratingSeo(false);
        }
    };

    // Fetch real data from API
    useEffect(() => {
        async function fetchData() {
            try {
                const url = businessId
                    ? `/api/dashboard/business?businessId=${businessId}`
                    : '/api/dashboard/business';
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        name: data.name || "",
                        phone: data.contact?.phone || "",
                        email: data.contact?.email || "",
                        website: data.contact?.website || "",
                        street: data.address?.street || "",
                        postalCode: data.address?.postalCode || "",
                        city: data.address?.city || "",
                        neighborhood: data.address?.neighborhood || "",
                        province: data.address?.province || "",
                        shortDescription: data.shortDescription || "",
                        openingHours: data.openingHours?.length ? data.openingHours : defaultOpeningHours,
                        services: data.services?.length ? data.services : [{ name: "", description: "", price: "" }],
                        amenities: data.amenities || [],
                        paymentMethods: data.paymentMethods || [],
                        languages: data.languages?.length ? data.languages : ["Nederlands"],
                        instagram: data.contact?.instagram || "",
                        facebook: data.contact?.facebook || "",
                        linkedin: data.contact?.linkedin || "",
                        kvkNumber: data.kvk || "",
                        foundedYear: data.foundedYear?.toString() || "",
                        serviceArea: data.serviceArea || "",
                        bookingUrl: data.bookingUrl || "",
                        certifications: data.certifications || [],
                        logo: null,
                        coverImage: null,
                    });

                    // Load gallery images with alt-texts
                    if (data.images?.gallery && Array.isArray(data.images.gallery)) {
                        setImages(data.images.gallery.map((img: any, index: number) => ({
                            id: `img_${index}`,
                            url: img.url,
                            altText: img.altText || ""
                        })));
                    }

                    // Load logo and cover image
                    if (data.images?.logo) {
                        setExistingLogo(data.images.logo);
                    }
                    if (data.images?.logoAltText) {
                        setLogoAltText(data.images.logoAltText);
                    }
                    if (data.images?.cover) {
                        setExistingCover(data.images.cover);
                    }
                    if (data.images?.coverAltText) {
                        setCoverAltText(data.images.coverAltText);
                    }

                    // Load FAQ
                    if (data.faq && Array.isArray(data.faq)) {
                        setFaqList(data.faq);
                    }

                    // Load SEO status
                    if (data.seo?.status) {
                        setSeoStatus(data.seo.status);
                        if (data.seo.lastUpdate) {
                            setSeoLastUpdate(new Date(data.seo.lastUpdate));
                        }
                    }

                    // Load SEO data
                    if (data.seo) {
                        setSeoData({
                            title: data.seo.title || '',
                            description: data.seo.description || '',
                            keywords: data.seo.keywords || []
                        });
                    }
                }
            } catch (error) {
                console.log('Using mock data');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [businessId]);

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // In production, upload to cloud storage (Supabase Storage, S3, etc.)
        // For now, create local URLs
        const newImages: Array<{ id: string; url: string; altText: string }> = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const objectUrl = URL.createObjectURL(file);

            // Generate AI alt-text automatically
            const altText = await generateAltText(objectUrl, 'default');

            newImages.push({
                id: `img_${Date.now()}_${i}`,
                url: objectUrl,
                altText
            });
        }

        setImages([...images, ...newImages]);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Update image alt text
    const updateImageAltText = (imageId: string, altText: string) => {
        setImages(images.map(img =>
            img.id === imageId ? { ...img, altText } : img
        ));
    };

    // Generate AI alt-text for an image
    const generateAltText = async (imageUrl: string, imageType: string = 'default'): Promise<string> => {
        try {
            const response = await fetch('/api/dashboard/generate-alt-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageUrl,
                    businessName: formData.name,
                    imageType
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.altText || `${formData.name} - foto`;
            }
        } catch (error) {
            console.error('Error generating alt-text:', error);
        }
        return `${formData.name} - foto`;
    };

    // Handle logo upload
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setFormData({ ...formData, logo: file });
            setLogoPreview(objectUrl);
            // Generate AI alt-text automatically
            const altText = await generateAltText(objectUrl, 'logo');
            setLogoAltText(altText);
        }
    };

    // Handle cover image upload
    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setFormData({ ...formData, coverImage: file });
            setCoverPreview(objectUrl);
            // Generate AI alt-text automatically
            const altText = await generateAltText(objectUrl, 'cover');
            setCoverAltText(altText);
        }
    };

    // Add new FAQ
    const addFaq = () => {
        setFaqList([...faqList, { question: "", answer: "" }]);
    };

    // Update FAQ
    const updateFaq = (index: number, field: "question" | "answer", value: string) => {
        const newFaqList = [...faqList];
        newFaqList[index] = { ...newFaqList[index], [field]: value };
        setFaqList(newFaqList);
    };

    // Remove FAQ
    const removeFaq = (index: number) => {
        setFaqList(faqList.filter((_, i) => i !== index));
    };

    // Save gallery to database
    const saveGallery = async () => {
        try {
            const galleryData = images.map(img => ({
                url: img.url,
                altText: img.altText || ""
            }));

            const url = businessId
                ? `/api/dashboard/gallery?businessId=${businessId}`
                : '/api/dashboard/gallery';

            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gallery: galleryData })
            });

            if (!response.ok) {
                throw new Error('Failed to save gallery');
            }
        } catch (error) {
            console.error('Error saving gallery:', error);
            throw error;
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);

        try {
            const form = new FormData();
            form.append('name', formData.name);
            form.append('phone', formData.phone);
            form.append('email', formData.email);
            form.append('website', formData.website);
            form.append('street', formData.street);
            form.append('postalCode', formData.postalCode);
            form.append('city', formData.city);
            form.append('neighborhood', formData.neighborhood);
            form.append('province', formData.province);
            form.append('shortDescription', formData.shortDescription);
            form.append('openingHours', JSON.stringify(formData.openingHours));
            form.append('services', JSON.stringify(formData.services.filter(s => s.name.trim())));
            form.append('amenities', JSON.stringify(formData.amenities));
            form.append('paymentMethods', JSON.stringify(formData.paymentMethods));
            form.append('languages', JSON.stringify(formData.languages));
            form.append('instagram', formData.instagram);
            form.append('facebook', formData.facebook);
            form.append('linkedin', formData.linkedin);
            form.append('kvkNumber', formData.kvkNumber);
            form.append('foundedYear', formData.foundedYear);
            form.append('serviceArea', formData.serviceArea);
            form.append('bookingUrl', formData.bookingUrl);
            form.append('certifications', JSON.stringify(formData.certifications));
            form.append('faq', JSON.stringify(faqList.filter(f => f.question.trim() && f.answer.trim())));

            // Add logo if new one uploaded
            if (formData.logo) {
                form.append('logo', formData.logo);
            }

            // Add logo alt text
            if (logoAltText) {
                form.append('logoAltText', logoAltText);
            }

            // Add cover image if new one uploaded
            if (formData.coverImage) {
                form.append('coverImage', formData.coverImage);
            }

            // Add cover alt text
            if (coverAltText) {
                form.append('coverAltText', coverAltText);
            }

            // Add SEO data if available
            if (seoData.title) {
                form.append('seoTitle', seoData.title);
            }
            if (seoData.description) {
                form.append('seoDescription', seoData.description);
            }
            if (seoData.keywords.length > 0) {
                form.append('seoKeywords', JSON.stringify(seoData.keywords));
            }

            const result = await updateProfileAction(form, businessId);

            if (result.success) {
                // Always save gallery (even if empty to handle deletions)
                await saveGallery();
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                alert(result.error || 'Er is iets misgegaan');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Er is iets misgegaan bij het opslaan');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Profiel Bewerken</h1>
                        <p className="text-slate-600 mt-1">
                            Update uw bedrijfsinformatie om meer klanten te bereiken
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? "Opslaan..." : "Wijzigingen Opslaan"}
                        </button>
                    </div>
                </div>
                {success && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                        ✅ Wijzigingen zijn succesvol opgeslagen!
                    </div>
                )}
            </div>

            {/* SEO Status Widget */}
            <SeoStatusWidget
                status={seoStatus}
                lastUpdate={seoLastUpdate}
                onGenerate={handleGenerateSeo}
                onRegenerate={handleGenerateSeo}
                isGenerating={isGeneratingSeo}
            />

            {/* SEO Edit Section */}
            {seoStatus === 'COMPLETED' && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">AI Gegenereerde SEO</h2>
                    <p className="text-sm text-slate-600 mb-4">
                        Dit is automatisch gegenereerd door AI. U kunt het handmatig aanpassen.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                SEO Titel (max 60 tekens)
                            </label>
                            <input
                                type="text"
                                value={seoData.title}
                                onChange={(e) => setSeoData({ ...seoData, title: e.target.value.slice(0, 60) })}
                                maxLength={60}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="text-xs text-slate-500 mt-1 text-left">
                                {seoData.title.length}/60 tekens
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Meta Beschrijving (max 160 tekens)
                            </label>
                            <textarea
                                value={seoData.description}
                                onChange={(e) => setSeoData({ ...seoData, description: e.target.value.slice(0, 160) })}
                                maxLength={160}
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="text-xs text-slate-500 mt-1 text-left">
                                {seoData.description.length}/160 tekens
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                SEO Keywords (gescheiden door komma)
                            </label>
                            <input
                                type="text"
                                value={seoData.keywords.join(', ')}
                                onChange={(e) => setSeoData({
                                    ...seoData,
                                    keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                                })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="keyword1, keyword2, keyword3"
                            />
                            <div className="text-xs text-slate-500 mt-1 text-left">
                                {seoData.keywords.length} keywords
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Basis Informatie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Bedrijfsnaam *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Telefoonnummer *
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            E-mailadres
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Website
                        </label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Logo & Cover Image */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Logo & Cover Afbeelding</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Logo
                        </label>
                        <input
                            type="file"
                            ref={logoInputRef}
                            onChange={handleLogoUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={() => logoInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center min-h-[160px]"
                        >
                            {logoPreview || existingLogo ? (
                                <img
                                    src={logoPreview || existingLogo}
                                    alt="Logo preview"
                                    className="max-h-32 max-w-full object-contain"
                                />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-600">Klik om logo te uploaden</span>
                                </>
                            )}
                        </div>
                        {(logoPreview || existingLogo) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLogoPreview("");
                                    setLogoAltText("");
                                    setFormData({ ...formData, logo: null });
                                }}
                                className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                                <X className="w-4 h-4" /> Verwijderen
                            </button>
                        )}
                        {/* Logo Alt Text */}
                        {(logoPreview || existingLogo) && (
                            <div className="mt-3">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Alt-tekst (SEO)
                                </label>
                                <input
                                    type="text"
                                    value={logoAltText}
                                    onChange={(e) => setLogoAltText(e.target.value)}
                                    placeholder="Beschrijvende alt-tekst voor SEO..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cover Afbeelding
                        </label>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={handleCoverUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={() => coverInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center min-h-[160px]"
                        >
                            {coverPreview || existingCover ? (
                                <img
                                    src={coverPreview || existingCover}
                                    alt="Cover preview"
                                    className="max-h-32 max-w-full object-cover rounded-lg"
                                />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-600">Klik om cover te uploaden</span>
                                </>
                            )}
                        </div>
                        {(coverPreview || existingCover) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCoverPreview("");
                                    setCoverAltText("");
                                    setFormData({ ...formData, coverImage: null });
                                }}
                                className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                                <X className="w-4 h-4" /> Verwijderen
                            </button>
                        )}
                        {/* Cover Alt Text */}
                        {(coverPreview || existingCover) && (
                            <div className="mt-3">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Alt-tekst (SEO)
                                </label>
                                <input
                                    type="text"
                                    value={coverAltText}
                                    onChange={(e) => setCoverAltText(e.target.value)}
                                    placeholder="Beschrijvende alt-tekst voor SEO..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Veelgestelde Vragen (FAQ)</h2>
                        <p className="text-sm text-slate-600">Veelgestelde vragen helpen klanten en verbeteren SEO</p>
                    </div>
                    <button
                        onClick={addFaq}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                        <Plus className="w-4 h-4" /> Vraag toevoegen
                    </button>
                </div>
                <div className="space-y-4">
                    {faqList.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <p>Nog geen vragen toegevoegd</p>
                            <button
                                onClick={addFaq}
                                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                                + Voeg je eerste vraag toe
                            </button>
                        </div>
                    ) : (
                        faqList.map((faq, index) => (
                            <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Vraag (bijv. Wat zijn jullie openingstijden?)"
                                            value={faq.question}
                                            onChange={(e) => updateFaq(index, "question", e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium"
                                        />
                                        <textarea
                                            placeholder="Antwoord"
                                            value={faq.answer}
                                            onChange={(e) => updateFaq(index, "answer", e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeFaq(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Adresgegevens</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Straat en huisnummer *
                        </label>
                        <input
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Postcode *
                        </label>
                        <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Stad *
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Wijk/Buurt
                        </label>
                        <input
                            type="text"
                            value={formData.neighborhood}
                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Provincie
                        </label>
                        <input
                            type="text"
                            value={formData.province}
                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Openingstijden</h2>
                <div className="space-y-3">
                    {formData.openingHours.map((day, index) => (
                        <div key={day.day} className="flex items-center gap-4">
                            <div className="w-32">
                                <span className="text-sm font-medium text-slate-700">{day.day}</span>
                            </div>
                            {day.closed ? (
                                <div className="flex-1 flex items-center gap-4">
                                    <span className="text-sm text-slate-500">Gesloten</span>
                                    <button
                                        onClick={() => {
                                            const newHours = [...formData.openingHours];
                                            newHours[index].closed = false;
                                            setFormData({ ...formData, openingHours: newHours });
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Open maken
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center gap-4">
                                    <input
                                        type="time"
                                        value={day.open}
                                        onChange={(e) => {
                                            const newHours = [...formData.openingHours];
                                            newHours[index].open = e.target.value;
                                            setFormData({ ...formData, openingHours: newHours });
                                        }}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    />
                                    <span className="text-slate-500">tot</span>
                                    <input
                                        type="time"
                                        value={day.close}
                                        onChange={(e) => {
                                            const newHours = [...formData.openingHours];
                                            newHours[index].close = e.target.value;
                                            setFormData({ ...formData, openingHours: newHours });
                                        }}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            const newHours = [...formData.openingHours];
                                            newHours[index].closed = true;
                                            setFormData({ ...formData, openingHours: newHours });
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Foto&apos;s</h2>
                        <p className="text-sm text-slate-600">
                            Bedrijven met 5+ foto&apos;s krijgen 2x meer kliks.
                        </p>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                        <Upload className="w-8 h-8 text-slate-400" />
                        <span className="text-sm text-slate-600">Upload foto</span>
                    </button>

                    {images.map((image) => (
                        <div key={image.id} className="aspect-square bg-slate-100 rounded-lg relative group overflow-hidden">
                            <img
                                src={image.url}
                                alt={image.altText || "Bedrijfsfoto"}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => {
                                        setImages(images.filter(img => img.id !== image.id));
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                </button>
                            </div>
                            {image.altText && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                                    <input
                                        type="text"
                                        value={image.altText}
                                        onChange={(e) => updateImageAltText(image.id, e.target.value)}
                                        className="w-full bg-transparent text-white text-xs placeholder:text-slate-400 border-none focus:ring-0 p-0"
                                        placeholder="Alt-tekst..."
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Diensten & Producten</h2>
                        <p className="text-sm text-slate-600">Wat biedt uw bedrijf aan?</p>
                    </div>
                    <button
                        onClick={() => setFormData({
                            ...formData,
                            services: [...formData.services, { name: "", description: "", price: "" }]
                        })}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                        <Plus className="w-4 h-4" /> Dienst toevoegen
                    </button>
                </div>
                <div className="space-y-4">
                    {formData.services.map((service, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    placeholder="Naam (bijv. Reparatie)"
                                    value={service.name}
                                    onChange={(e) => {
                                        const newServices = [...formData.services];
                                        newServices[index].name = e.target.value;
                                        setFormData({ ...formData, services: newServices });
                                    }}
                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Beschrijving"
                                    value={service.description || ""}
                                    onChange={(e) => {
                                        const newServices = [...formData.services];
                                        newServices[index].description = e.target.value;
                                        setFormData({ ...formData, services: newServices });
                                    }}
                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Prijs (bijv. €50)"
                                    value={service.price || ""}
                                    onChange={(e) => {
                                        const newServices = [...formData.services];
                                        newServices[index].price = e.target.value;
                                        setFormData({ ...formData, services: newServices });
                                    }}
                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                            {formData.services.length > 1 && (
                                <button
                                    onClick={() => {
                                        const newServices = formData.services.filter((_, i) => i !== index);
                                        setFormData({ ...formData, services: newServices });
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Social Media</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Instagram className="w-4 h-4 text-pink-500" /> Instagram
                        </label>
                        <input
                            type="text"
                            placeholder="@uwbedrijf"
                            value={formData.instagram}
                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                        </label>
                        <input
                            type="text"
                            placeholder="facebook.com/uwbedrijf"
                            value={formData.facebook}
                            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
                        </label>
                        <input
                            type="text"
                            placeholder="linkedin.com/company/..."
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Amenities & Extra Info */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Extra Informatie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Amenities */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Faciliteiten</label>
                        <div className="flex flex-wrap gap-2">
                            {AMENITIES_OPTIONS.map((amenity) => (
                                <button
                                    key={amenity}
                                    onClick={() => {
                                        const newAmenities = formData.amenities.includes(amenity)
                                            ? formData.amenities.filter(a => a !== amenity)
                                            : [...formData.amenities, amenity];
                                        setFormData({ ...formData, amenities: newAmenities });
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                        formData.amenities.includes(amenity)
                                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                    }`}
                                >
                                    {amenity}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Betaalmethoden</label>
                        <div className="flex flex-wrap gap-2">
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    key={method}
                                    onClick={() => {
                                        const newMethods = formData.paymentMethods.includes(method)
                                            ? formData.paymentMethods.filter(m => m !== method)
                                            : [...formData.paymentMethods, method];
                                        setFormData({ ...formData, paymentMethods: newMethods });
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                        formData.paymentMethods.includes(method)
                                            ? 'bg-green-100 text-green-700 border border-green-300'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                    }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Talen</label>
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        const newLangs = formData.languages.includes(lang)
                                            ? formData.languages.filter(l => l !== lang)
                                            : [...formData.languages, lang];
                                        setFormData({ ...formData, languages: newLangs });
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                        formData.languages.includes(lang)
                                            ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                    }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* KVK & Founded Year */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">KVK-nummer</label>
                            <input
                                type="text"
                                placeholder="12345678"
                                value={formData.kvkNumber}
                                onChange={(e) => setFormData({ ...formData, kvkNumber: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Opgericht in</label>
                            <input
                                type="text"
                                placeholder="2020"
                                value={formData.foundedYear}
                                onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Service Area */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Werkgebied</label>
                        <input
                            type="text"
                            placeholder="bijv. Heel Nederland of Amsterdam en omgeving"
                            value={formData.serviceArea}
                            onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        />
                    </div>

                    {/* Booking URL */}
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Globe className="w-4 h-4" /> Boekingslink (optioneel)
                        </label>
                        <input
                            type="url"
                            placeholder="https://booking.uwbedrijf.nl"
                            value={formData.bookingUrl}
                            onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Save Button Bottom */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? "Opslaan..." : "Wijzigingen Opslaan"}
                </button>
            </div>
        </div>
    );
}
