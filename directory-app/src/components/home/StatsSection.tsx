"use client";

import { useEffect, useState, useRef } from "react";
import { Building2, FolderOpen, MapPin } from "lucide-react";

interface StatItemProps {
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
}

function StatItem({ icon, value, suffix, label }: StatItemProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateValue(0, value, 2000);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value, hasAnimated]);

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
        <div ref={ref} className="stat-card">
            <div className="stat-icon">
                {icon}
            </div>
            <div className="stat-number">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

type StatsSectionProps = {
    businessCount: number;
    categoryCount: number;
    cityCount: number;
};

export function StatsSection({ businessCount, categoryCount, cityCount }: StatsSectionProps) {
    return (
        <section className="stats-section py-10 px-3">
            <div className="container mx-auto max-w-5xl">
                {/* Section Header */}
                <div className="section-header mb-6">
                    <h2>Nederland in Cijfers</h2>
                    <p>Een groeiend netwerk van lokale ondernemers</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatItem
                        icon={<Building2 className="w-8 h-8" />}
                        value={businessCount}
                        suffix={businessCount >= 1000 ? "+" : ""}
                        label="Bedrijven"
                    />
                    <StatItem
                        icon={<FolderOpen className="w-8 h-8" />}
                        value={categoryCount}
                        suffix={categoryCount >= 50 ? "+" : ""}
                        label="Categorieën"
                    />
                    <StatItem
                        icon={<MapPin className="w-8 h-8" />}
                        value={cityCount}
                        suffix={cityCount >= 10 ? "+" : ""}
                        label="Steden"
                    />
                </div>
            </div>
        </section>
    );
}
