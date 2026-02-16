"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Store, MessageSquare, TrendingUp, Settings, X, LogOut } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const getLink = (path: string) => {
        if (businessId) {
            return `${path}?businessId=${businessId}`;
        }
        return path;
    };

    const navItems = [
        { href: getLink("/dashboard"), icon: LayoutDashboard, label: "Overzicht" },
        { href: getLink("/dashboard/profile"), icon: Store, label: "Profiel Bewerken" },
        { href: getLink("/dashboard/reviews"), icon: MessageSquare, label: "Beoordelingen" },
        { href: getLink("/dashboard/seo"), icon: TrendingUp, label: "SEO Score" },
        { href: getLink("/dashboard/settings"), icon: Settings, label: "Instellingen" },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                    {/* Mobile Sidebar Overlay */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar Navigation */}
                    <aside className={`
                        fixed lg:relative inset-y-0 left-0 z-50 w-72 lg:w-64 shrink-0
                        transform transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        top-0 lg:top-auto
                    `}>
                        <div className="h-full lg:h-auto bg-white lg:bg-transparent rounded-r-xl lg:rounded-xl border-r lg:border border-slate-200 lg:border-none p-4 space-y-2 overflow-y-auto">
                            {/* Close Button (Mobile) */}
                            <div className="flex items-center justify-between mb-4 lg:hidden">
                                <span className="font-semibold text-slate-800">Menu</span>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}

                            {/* Logout Button */}
                            <button
                                onClick={async () => {
                                    await fetch('/api/auth/logout', { method: 'POST' });
                                    window.location.href = '/';
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Uitloggen</span>
                            </button>

                            {/* Quick Stats Card */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-5 mt-6">
                                <h3 className="font-bold mb-2">💡 Tip</h3>
                                <p className="text-sm text-blue-100">
                                    Bedrijven met 5+ beoordelingen krijgen 3x meer kliks!
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
