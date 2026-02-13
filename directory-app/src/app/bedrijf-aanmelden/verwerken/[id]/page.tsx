'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Check, Loader2, FileText, Wand2, Search, CheckCircle } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Gegevens ontvangen', icon: FileText },
    { id: 2, label: 'AI analyseert uw bedrijf', icon: Wand2 },
    { id: 3, label: 'SEO optimalisatie', icon: Search },
    { id: 4, label: 'Pagina genereren', icon: Sparkles },
];

export default function ProcessingPage() {
    const params = useParams();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processSubmission = async () => {
            try {
                // Simulate step progression for visual effect
                const stepInterval = setInterval(() => {
                    setCurrentStep(prev => {
                        if (prev < 4) return prev + 1;
                        return prev;
                    });
                }, 2000);

                // Call the AI generation endpoint
                const response = await fetch('/api/business/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ submissionId: params.id }),
                });

                clearInterval(stepInterval);

                if (!response.ok) {
                    throw new Error('Failed to generate content');
                }

                const data = await response.json();

                // Complete all steps
                setCurrentStep(5);

                // Redirect to preview page after a short delay
                setTimeout(() => {
                    router.push(`/bedrijf-aanmelden/preview/${params.id}`);
                }, 1500);
            } catch (err) {
                setError('Er is een fout opgetreden. Probeer het later opnieuw.');
                console.error(err);
            }
        };

        processSubmission();
    }, [params.id, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            <div className="relative max-w-lg w-full">
                {/* Main card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/30 mb-6"
                        >
                            <Sparkles className="w-10 h-10 text-white" />
                        </motion.div>

                        <h1 className="text-2xl font-bold text-white mb-2">
                            AI maakt uw bedrijfspagina
                        </h1>
                        <p className="text-blue-200/80">
                            Even geduld, we creëren een professionele pagina voor u
                        </p>
                    </div>

                    {/* Progress steps */}
                    <div className="space-y-4">
                        {STEPS.map((step, index) => {
                            const isCompleted = currentStep > step.id;
                            const isActive = currentStep === step.id;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${isCompleted
                                            ? 'bg-emerald-500/20 border border-emerald-500/30'
                                            : isActive
                                                ? 'bg-blue-500/20 border border-blue-500/30'
                                                : 'bg-white/5 border border-white/10'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isCompleted
                                            ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                                            : isActive
                                                ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                                                : 'bg-white/10'
                                        }`}>
                                        {isCompleted ? (
                                            <Check className="w-6 h-6 text-white" />
                                        ) : isActive ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <Loader2 className="w-6 h-6 text-white" />
                                            </motion.div>
                                        ) : (
                                            <step.icon className="w-6 h-6 text-white/50" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <span className={`font-medium ${isCompleted
                                                ? 'text-emerald-300'
                                                : isActive
                                                    ? 'text-white'
                                                    : 'text-white/50'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>

                                    {isActive && (
                                        <motion.div
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="text-xs text-blue-300"
                                        >
                                            Bezig...
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Completion message */}
                    {currentStep === 5 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-center"
                        >
                            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                            <p className="text-emerald-300 font-medium">
                                Pagina succesvol gegenereerd!
                            </p>
                            <p className="text-emerald-200/70 text-sm mt-1">
                                U wordt doorgestuurd naar de preview...
                            </p>
                        </motion.div>
                    )}

                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-center"
                        >
                            <p className="text-red-300">{error}</p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Bottom text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-white/40 text-sm mt-6"
                >
                    Powered by AI voor de beste resultaten
                </motion.p>
            </div>
        </div>
    );
}
