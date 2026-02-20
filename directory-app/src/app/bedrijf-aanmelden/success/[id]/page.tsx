'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';
import {
    CheckCircle,
    Mail,
    Clock,
    ArrowRight,
    Home,
    Sparkles,
    LayoutDashboard
} from 'lucide-react';

export default function SuccessPage() {
    // Dispatch auth change event to update navbar
    useEffect(() => {
        // Trigger auth check in navbar immediately and after a delay
        const triggerAuthChange = () => {
            window.dispatchEvent(new Event('auth-change'));
        };
        
        // Trigger immediately
        triggerAuthChange();
        
        // Trigger again after a short delay to ensure state is updated
        const timeout1 = setTimeout(triggerAuthChange, 500);
        const timeout2 = setTimeout(triggerAuthChange, 1500);
        
        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-200/30 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-lg w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl shadow-emerald-200/50 p-8 text-center"
                >
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-slate-800 mb-3"
                    >
                        Gelukt!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-slate-600 mb-8"
                    >
                        Uw bedrijfspagina is ingediend voor goedkeuring
                    </motion.p>

                    {/* Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4 mb-8"
                    >
                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl text-left">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Verificatie</h3>
                                <p className="text-sm text-slate-600">
                                    Ons team bekijkt uw aanvraag binnen 24 uur. We controleren de gegevens en zorgen voor kwaliteit.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl text-left">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">E-mail bevestiging</h3>
                                <p className="text-sm text-slate-600">
                                    U ontvangt een e-mail zodra uw pagina is goedgekeurd en live staat.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-2xl text-left">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Online zichtbaarheid</h3>
                                <p className="text-sm text-slate-600">
                                    Na goedkeuring is uw SEO-geoptimaliseerde pagina direct vindbaar in Google.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            Naar homepage
                        </Link>
                        <Link
                            href="/dashboard"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Naar dashboard
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Footer text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center text-slate-500 text-sm mt-6"
                >
                    Heeft u vragen? Neem contact met ons op via{' '}
                    <a href="mailto:info@peyda.nl" className="text-emerald-600 hover:underline">
                        info@peyda.nl
                    </a>
                </motion.p>
            </div>
        </div>
    );
}
