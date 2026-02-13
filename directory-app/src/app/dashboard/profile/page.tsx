"use client";

import { useState, useEffect, useRef, use } from "react";
import { Save, Upload, X, Sparkles, Wand2 } from "lucide-react";
import { updateProfile as updateProfileAction, updateOpeningHours } from "../actions";

const defaultOpeningHours = [
    { day: "Maandag", open: "08:00", close: "18:00", closed: false },
    { day: "Dinsdag", open: "08:00", close: "18:00", closed: false },
    { day: "Woensdag", open: "08:00", close: "18:00", closed: false },
    { day: "Donderdag", open: "08:00", close: "18:00", closed: false },
    { day: "Vrijdag", open: "08:00", close: "18:00", closed: false },
    { day: "Zaterdag", open: "09:00", close: "18:00", closed: false },
    { day: "Zondag", open: "10:00", close: "17:00", closed: false },
];

const defaultFormData = {
    name: "Voorbeeld Restaurant",
    phone: "+31 20 123 4567",
    email: "info@voorbeeld.nl",
    website: "https://voorbeeld.nl",
    street: "Kalverstraat 123",
    postalCode: "1012 NX",
    city: "Amsterdam",
    neighborhood: "Centrum",
    shortDescription: "Authentiek Italiaans restaurant in hartje Amsterdam met huisgemaakte pasta.",
    openingHours: defaultOpeningHours
};

export default function ProfilePage({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
    const params = use(searchParams);
    const [formData, setFormData] = useState(defaultFormData);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [images, setImages] = useState<Array<{ id: string; url: string; altText: string; isGeneratingAlt: boolean }>>([]);
    const [generatingAllAltTexts, setGeneratingAllAltTexts] = useState(false);
    const businessId = params.businessId;
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                        shortDescription: data.shortDescription || "",
                        openingHours: data.openingHours?.length ? data.openingHours : defaultOpeningHours,
                    });

                    // Load gallery images with alt-texts
                    if (data.gallery && Array.isArray(data.gallery)) {
                        setImages(data.gallery.map((img: any, index: number) => ({
                            id: `img_${index}`,
                            url: img.url,
                            altText: img.altText || "",
                            isGeneratingAlt: false
                        })));
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
        const newImages = Array.from(files).map((file, index) => ({
            id: `img_${Date.now()}_${index}`,
            url: URL.createObjectURL(file),
            altText: "",
            isGeneratingAlt: false
        }));

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

    // Generate AI alt-text for a single image
    const generateAltText = async (imageId: string) => {
        const image = images.find(img => img.id === imageId);
        if (!image) return;

        setImages(images.map(img =>
            img.id === imageId ? { ...img, isGeneratingAlt: true } : img
        ));

        try {
            const response = await fetch('/api/dashboard/generate-alt-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageUrl: image.url,
                    businessName: formData.name,
                    imageType: 'default'
                })
            });

            if (response.ok) {
                const data = await response.json();
                setImages(images.map(img =>
                    img.id === imageId ? { ...img, altText: data.altText, isGeneratingAlt: false } : img
                ));
            }
        } catch (error) {
            console.error('Error generating alt-text:', error);
            // Fallback to default alt-text
            setImages(images.map(img =>
                img.id === imageId ? { ...img, altText: `${formData.name} - foto`, isGeneratingAlt: false } : img
            ));
        }
    };

    // Generate AI alt-texts for all images
    const generateAllAltTexts = async () => {
        setGeneratingAllAltTexts(true);

        const imagesWithoutAlt = images.filter(img => !img.altText);

        for (const image of imagesWithoutAlt) {
            await generateAltText(image.id);
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        setGeneratingAllAltTexts(false);
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
            form.append('shortDescription', formData.shortDescription);

            const result = await updateProfileAction(form, businessId);

            if (result.success) {
                // Also save gallery if there are images
                if (images.length > 0) {
                    await saveGallery();
                }
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Profiel Bewerken</h1>
                        <p className="text-slate-600 mt-1">
                            Update uw bedrijfsinformatie om meer klanten te bereiken
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? "Opslaan..." : "Wijzigingen Opslaan"}
                    </button>
                </div>
                {success && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                        ✅ Wijzigingen zijn succesvol opgeslagen!
                    </div>
                )}
            </div>

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
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Korte Omschrijving (max 160 tekens) *
                        </label>
                        <textarea
                            value={formData.shortDescription}
                            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                            rows={3}
                            maxLength={160}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {formData.shortDescription.length}/160 tekens
                        </p>
                    </div>
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
                    {images.length > 0 && (
                        <button
                            onClick={generateAllAltTexts}
                            disabled={generatingAllAltTexts}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                        >
                            <Sparkles className="w-4 h-4" />
                            {generatingAllAltTexts ? 'Genereren...' : 'AI Alt-teksten'}
                        </button>
                    )}
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
                                    onClick={() => generateAltText(image.id)}
                                    disabled={image.isGeneratingAlt}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white text-slate-800 rounded-lg text-xs font-medium hover:bg-slate-100"
                                >
                                    <Wand2 className="w-3 h-3" />
                                    AI Label
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

                {/* AI Tip */}
                {images.length > 0 && images.some(img => !img.altText) && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-purple-900">💡 SEO Tip</p>
                                <p className="text-sm text-purple-700 mt-1">
                                    Alt-teksten helpen Google uw foto&apos;s beter te begrijpen. Klik op "AI Label" om automatisch
                                    beschrijvingen te genereren met AI.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
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
