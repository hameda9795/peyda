'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Check,
    X,
    MapPin,
    Phone,
    Mail,
    Globe,
    Clock,
    Star,
    ChevronDown,
    Instagram,
    Facebook,
    Linkedin,
    CreditCard,
    Languages,
    Award,
    Sparkles,
    Edit3,
    Send,
    ArrowLeft
} from 'lucide-react';

type Submission = {
    id: string;
    formData: any;
    generatedContent: any;
    status: string;
};

export default function PreviewPage() {
    const params = useParams();
    const router = useRouter();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const response = await fetch(`/api/business/submission/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSubmission(data);
                }
            } catch (error) {
                console.error('Error fetching submission:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [params.id]);

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            const response = await fetch(`/api/business/approve/${params.id}`, {
                method: 'POST',
            });

            if (response.ok) {
                router.push(`/bedrijf-aanmelden/success/${params.id}`);
            }
        } catch (error) {
            console.error('Error approving:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-600">Submission niet gevonden.</p>
            </div>
        );
    }

    const { formData, generatedContent } = submission;
    const images = formData.images || {};

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Preview Banner */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Preview van uw bedrijfspagina</h2>
                            <p className="text-sm text-blue-100">
                                Bekijk en controleer de gegenereerde content voordat u indient
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Terug
                        </motion.button>
                        <motion.button
                            onClick={handleApprove}
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {submitting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Goedkeuren & Indienen
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-80 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                {images.coverImage && (
                    <img
                        src={images.coverImage}
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-7xl mx-auto flex items-end gap-6">
                        {/* Logo */}
                        <div className="w-28 h-28 rounded-2xl bg-white shadow-xl overflow-hidden flex-shrink-0 border-4 border-white">
                            {images.logo ? (
                                <img src={images.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                                    {formData.name?.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-white pb-2">
                            <h1 className="text-3xl font-bold mb-2">
                                {generatedContent?.seo?.h1 || formData.name}
                            </h1>
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {formData.neighborhood}, Utrecht
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    Nieuw
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column */}
                    <div className="flex-1 space-y-6">
                        {/* Highlights */}
                        {generatedContent?.highlights?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                            >
                                <div className="flex flex-wrap gap-3">
                                    {generatedContent.highlights.map((highlight: string, i: number) => (
                                        <span
                                            key={i}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium"
                                        >
                                            <Check className="w-4 h-4" />
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                        >
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Over ons</h2>
                            <div
                                className="prose prose-slate max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: generatedContent?.longDescription || formData.shortDescription
                                }}
                            />
                        </motion.div>

                        {/* Services */}
                        {generatedContent?.services?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                            >
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Onze diensten</h2>
                                <div className="grid gap-4">
                                    {generatedContent.services.map((service: any, i: number) => (
                                        <div
                                            key={i}
                                            className="p-4 bg-slate-50 rounded-xl"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">{service.name}</h3>
                                                    <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                                                </div>
                                                {formData.services?.find((s: any) => s.name === service.name)?.price && (
                                                    <span className="text-blue-600 font-semibold">
                                                        {formData.services.find((s: any) => s.name === service.name)?.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* FAQ */}
                        {generatedContent?.faq?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                            >
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Veelgestelde vragen</h2>
                                <div className="space-y-3">
                                    {generatedContent.faq.map((item: any, i: number) => (
                                        <div
                                            key={i}
                                            className="border border-slate-200 rounded-xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="font-medium text-slate-800">{item.question}</span>
                                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedFaq === i ? 'rotate-180' : ''
                                                    }`} />
                                            </button>
                                            {expandedFaq === i && (
                                                <div className="px-4 pb-4 text-slate-600">
                                                    {item.answer}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Gallery */}
                        {images.gallery?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                            >
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Foto's</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {images.gallery.map((img: any, i: number) => {
                                        const imageUrl = typeof img === 'string' ? img : img?.url;
                                        if (!imageUrl) return null;
                                        return (
                                            <img
                                                key={i}
                                                src={imageUrl}
                                                alt={img?.altText || `Gallery ${i + 1}`}
                                                className="w-full h-48 object-cover rounded-xl"
                                            />
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:w-96 space-y-6">
                        {/* Contact Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-28"
                        >
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Contactgegevens</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-slate-800">{formData.street}</p>
                                        <p className="text-sm text-slate-500">{formData.postalCode} {formData.city}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    <a href={`tel:${formData.phone}`} className="text-slate-800 hover:text-blue-600">
                                        {formData.phone}
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <a href={`mailto:${formData.email}`} className="text-slate-800 hover:text-blue-600">
                                        {formData.email}
                                    </a>
                                </div>

                                {formData.website && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                        <a href={formData.website} target="_blank" className="text-slate-800 hover:text-blue-600 truncate">
                                            {formData.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Google Maps */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    Locatie
                                </h4>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${formData.street}, ${formData.postalCode} ${formData.city}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block rounded-xl overflow-hidden border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group"
                                >
                                    <div className="relative">
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(`${formData.street}, ${formData.postalCode} ${formData.city}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                            width="100%"
                                            height="200"
                                            style={{ border: 0, pointerEvents: 'none' }}
                                            allowFullScreen={false}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Locatie op kaart"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-blue-600">
                                                Openen in Google Maps
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            {/* Social Media */}
                            {(formData.instagram || formData.facebook || formData.linkedin) && (
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex gap-3">
                                        {formData.instagram && (
                                            <a href="#" className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center">
                                                <Instagram className="w-5 h-5" />
                                            </a>
                                        )}
                                        {formData.facebook && (
                                            <a href="#" className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                                                <Facebook className="w-5 h-5" />
                                            </a>
                                        )}
                                        {formData.linkedin && (
                                            <a href="#" className="w-10 h-10 bg-blue-700 text-white rounded-xl flex items-center justify-center">
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Opening Hours */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    Openingstijden
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {formData.openingHours?.map((hour: any) => (
                                        <div key={hour.day} className="flex justify-between">
                                            <span className="text-slate-600">{hour.day}</span>
                                            <span className="font-medium text-slate-800">
                                                {hour.closed ? 'Gesloten' : `${hour.open} - ${hour.close}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            {formData.amenities?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <h4 className="font-semibold text-slate-800 mb-3">Faciliteiten</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.amenities.map((amenity: string) => (
                                            <span key={amenity} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payment Methods */}
                            {formData.paymentMethods?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-blue-600" />
                                        Betaalmethoden
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.paymentMethods.map((method: string) => (
                                            <span key={method} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                                                {method}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certifications */}
                            {formData.certifications?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                        <Award className="w-4 h-4 text-amber-500" />
                                        Certificeringen
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.certifications.map((cert: string) => (
                                            <span key={cert} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* SEO Preview */}
            <div className="bg-slate-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Google Preview</h3>
                    <div className="bg-white rounded-xl p-6 max-w-2xl">
                        <div className="text-blue-600 text-xl hover:underline cursor-pointer">
                            {generatedContent?.seo?.title}
                        </div>
                        <div className="text-green-700 text-sm mt-1">
                            utrechtbusiness.nl › bedrijf › {formData.name?.toLowerCase().replace(/\s+/g, '-')}
                        </div>
                        <p className="text-slate-600 text-sm mt-2">
                            {generatedContent?.seo?.metaDescription}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
