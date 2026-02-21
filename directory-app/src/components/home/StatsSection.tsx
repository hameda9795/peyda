"use client";

import { useEffect, useState, useRef } from "react";
import { Building2, FolderOpen, MapPin, Sparkles } from "lucide-react";

interface StatItemProps {
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
    delay?: number;
}

function StatItem({ icon, value, suffix, label, delay = 0 }: StatItemProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setTimeout(() => {
                        setHasAnimated(true);
                        animateValue(0, value, 2000);
                    }, delay);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value, hasAnimated, delay]);

    const animateValue = (start: number, end: number, duration: number) => {
        const startTime = performance.now();

        const updateValue = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setCount(Math.floor(start + (end - start) * easeOutQuart));

            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };

        requestAnimationFrame(updateValue);
    };

    return (
        <div ref={ref} className="group relative bg-white rounded-[2rem] p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(11,42,60,0.08)]">
            {/* Subtle Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glossy Reflection */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-gradient-to-bl from-white/60 to-transparent rotate-45 pointer-events-none" />

            <div className="relative flex items-center justify-center w-20 h-20 bg-[#F3F6F8] rounded-2xl mb-6 shadow-sm group-hover:bg-[#0B2A3C] text-[#0B2A3C] group-hover:text-white transition-all duration-500 group-hover:shadow-[0_10px_25px_rgba(11,42,60,0.25)] group-hover:scale-110">
                {icon}
            </div>

            <div className="relative text-4xl sm:text-5xl font-bold text-zinc-900 mb-2 tracking-tight display-font group-hover:text-[#0B2A3C] transition-colors duration-300">
                {count.toLocaleString('nl-NL')}{suffix}
            </div>

            <div className="relative text-sm font-semibold text-zinc-400 uppercase tracking-[0.15em] group-hover:text-zinc-600 transition-colors duration-300">
                {label}
            </div>
        </div>
    );
}

type StatsSectionProps = {
    businessCount: number;
    categoryCount: number;
    cityCount: number;
};

export function StatsSection({ businessCount, categoryCount, cityCount }: StatsSectionProps) {
    // Demo values if stats are 0, to prevent the site looking empty
    const displayBusinessCount = businessCount > 0 ? businessCount : 15420;
    const displayCategoryCount = categoryCount > 0 ? categoryCount : 142;
    const displayCityCount = cityCount > 0 ? cityCount : 35;

    return (
        <section className="relative py-24 px-4 overflow-hidden bg-[#F9FAFB] border-t border-zinc-100">
            {/* Decorative background blurs */}
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2A9D8F]/10 to-transparent blur-[80px] pointer-events-none" />
            <div className="absolute top-[40%] -right-[15%] w-[40%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E07A3F]/10 to-transparent blur-[100px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-sm font-semibold text-[#0B2A3C] mb-6 shadow-sm animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-[#E07A3F]" />
                        Groeiend Platform
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0B2A3C] mb-4 tracking-tight display-font animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        Nederland in Cijfers
                    </h2>
                    <p className="text-lg text-zinc-500 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        Ontdek het grootste netwerk van lokale ondernemers, beoordeeld door echte klanten uit heel Nederland.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <StatItem
                        icon={<Building2 className="w-8 h-8" />}
                        value={displayBusinessCount}
                        suffix="+"
                        label="Geverifieerde Bedrijven"
                        delay={200}
                    />
                    <StatItem
                        icon={<FolderOpen className="w-8 h-8" />}
                        value={displayCategoryCount}
                        suffix="+"
                        label="Categorieën"
                        delay={400}
                    />
                    <StatItem
                        icon={<MapPin className="w-8 h-8" />}
                        value={displayCityCount}
                        suffix="+"
                        label="Steden in Nederland"
                        delay={600}
                    />
                </div>
            </div>
        </section>
    );
}
