"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
    {
        id: 1,
        name: "Sophie de Vries",
        role: "Ondernemer, Amsterdam",
        rating: 5,
        text: "Geweldige ervaring! Snel een goede kapper gevonden in mijn buurt. Zeer gebruiksvriendelijk!",
        avatar: "SV"
    },
    {
        id: 2,
        name: "Mark Jansen",
        role: "Huiseigenaar, Rotterdam",
        rating: 5,
        text: "Eindelijk een platform waar je écht betrouwbare loodgieters kunt vinden. De reviews zijn heel nuttig.",
        avatar: "MJ"
    },
    {
        id: 3,
        name: "Lisa van den Berg",
        role: "Bewoner, Den Haag",
        rating: 5,
        text: "Super handig voor het vinden van lokale bedrijven. Ik gebruik het nu voor alles, van restaurants tot klussen.",
        avatar: "LB"
    },
    {
        id: 4,
        name: "Thomas Bakker",
        role: "Freelancer, Utrecht",
        rating: 5,
        text: "Als ondernemer heb ik mijn bedrijf aangemeld en krijg nu veel meer klanten. Echt aan te raden!",
        avatar: "TB"
    }
];

export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 3;

    const next = () => {
        setCurrentIndex((prev) =>
            prev + 1 >= testimonials.length - itemsPerView + 1 ? 0 : prev + 1
        );
    };

    const prev = () => {
        setCurrentIndex((prev) =>
            prev - 1 < 0 ? testimonials.length - itemsPerView : prev - 1
        );
    };

    return (
        <section className="testimonials-section py-10 px-3">
            <div className="container mx-auto max-w-6xl">
                {/* Section Header */}
                <div className="section-header mb-6">
                    <h2>Klantbeoordelingen</h2>
                    <p>Wat onze gebruikers zeggen over hun ervaring</p>
                </div>

                {/* Testimonials Slider */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prev}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={next}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Cards Container */}
                    <div className="overflow-hidden px-2">
                        <div
                            className="flex gap-4 transition-transform duration-500"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="testimonial-card flex-shrink-0 w-full md:w-[calc(33.333%-1rem)]"
                                >
                                    {/* Stars */}
                                    <div className="testimonial-stars">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="fill-current" />
                                        ))}
                                    </div>

                                    {/* Text */}
                                    <p className="testimonial-text">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Author */}
                                    <div className="testimonial-author">
                                        <div className="testimonial-avatar">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="testimonial-name">{testimonial.name}</div>
                                            <div className="testimonial-role">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-5">
                    {[...Array(testimonials.length - itemsPerView + 1)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${currentIndex === i ? "w-6 bg-emerald-600" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
