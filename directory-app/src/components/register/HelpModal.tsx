"use client";

import { X, CheckCircle2, AlertCircle, Sparkles, MapPin, Layers, Image as ImageIcon, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null;

    const sections = [
        {
            title: "1. Basisgegevens",
            icon: Layers,
            text: "Kies een categorie die het beste past. Een duidelijke korte omschrijving (min. 50 tekens) helpt klanten direct te begrijpen wat u doet.",
            tip: "Tip: Gebruik zoekwoorden in uw omschrijving waarop u gevonden wilt worden."
        },
        {
            title: "2. Locatie & Contact",
            icon: MapPin,
            text: "Adres, telefoonnummer en een werkende website zijn verplicht. Dit zorgt voor vertrouwen en directe bereikbaarheid.",
            tip: "Zorg dat uw adresgegevens overeenkomen met Google Maps."
        },
        {
            title: "3. Diensten & Tijden",
            icon: CheckCircle2,
            text: "Voeg minimaal 3 diensten toe met omschrijving en prijs. Dit geeft bezoekers een duidelijk beeld van uw aanbod.",
            tip: "Wees specifiek. Bijvoorbeeld 'Heren knippen' in plaats van 'Knippen'."
        },
        {
            title: "4. Foto's & Media",
            icon: ImageIcon,
            text: "Een professionele omslagfoto is verplicht. Het is het eerste wat klanten zien. Logo en extra galerijfoto's zijn sterk aanbevolen.",
            tip: "Gebruik lichte, scherpe foto's voor de beste uitstraling."
        },
        {
            title: "5. Details & SEO",
            icon: FileText,
            text: "Beantwoord de 5 SEO-vragen. Dit helpt uw pagina hoger te scoren in Google. KVK-nummer is verplicht voor verificatie.",
            tip: "Meer tekst = betere vindbaarheid."
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-[#0F172A] p-5 text-white shrink-0 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 rounded-full blur-2xl -translate-x-10 translate-y-10"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold">Hulp bij aanmelden</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                                    aria-label="Sluiten"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed max-w-md">
                                Een volledig profiel wordt 300% vaker bekeken.
                            </p>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50 overscroll-contain">

                        {/* Compact Alert */}
                        <div className="bg-white border border-indigo-100 rounded-lg p-3 flex gap-3 shadow-sm">
                            <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                            <div className="text-xs text-slate-600">
                                <strong className="text-slate-900 block mb-0.5">Slimme Tip</strong>
                                Onze AI vult uw pagina. Geef zoveel mogelijk details voor het beste resultaat.
                            </div>
                        </div>

                        <div className="space-y-3">
                            {sections.map((section, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <section.icon className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800 mb-1">{section.title}</h3>
                                        <p className="text-xs text-slate-500 mb-1.5 leading-relaxed">{section.text}</p>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded text-[10px] font-medium text-emerald-700">
                                            <CheckCircle2 className="w-3 h-3" />
                                            {section.tip}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 bg-white shrink-0 z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-lg hover:bg-slate-900 transition-colors active:scale-[0.99]"
                        >
                            Begrepen
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
