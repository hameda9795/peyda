"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // TODO: Implement actual newsletter subscription
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setEmail("");
        }
    };

    return (
        <section className="newsletter-section py-10 px-3">
            <div className="container mx-auto max-w-3xl relative z-10 text-center">
                {/* Icon */}
                <div className="w-12 h-12 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                </div>

                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Blijf op de hoogte!
                </h2>
                <p className="text-base text-white/80 mb-6 max-w-lg mx-auto">
                    Ontvang de nieuwste aanbiedingen en tips van lokale ondernemers direct in je inbox.
                </p>

                {/* Form */}
                {submitted ? (
                    <div className="flex items-center justify-center gap-3 text-white">
                        <CheckCircle className="w-6 h-6 text-green-300" />
                        <span className="text-lg font-medium">Bedankt voor je aanmelding!</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="newsletter-form">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Je e-mailadres..."
                            required
                        />
                        <button type="submit" className="newsletter-btn">
                            Aanmelden
                        </button>
                    </form>
                )}

                {/* Privacy Note */}
                <p className="mt-4 text-sm text-white/60">
                    We respecteren je privacy. Afmelden kan op elk moment.
                </p>
            </div>
        </section>
    );
}
