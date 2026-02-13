"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutDashboard, Store, MessageSquare, TrendingUp, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");

    const getLink = (path: string) => {
        if (businessId) {
            return `${path}?businessId=${businessId}`;
        }
        return path;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Store className="w-6 h-6 text-blue-600" />
                            <Link href="/" className="text-xl font-bold text-slate-800">
                                NL Directory
                            </Link>
                            <span className="text-sm text-slate-500 ml-2">/ Dashboard</span>
                        </div>
                        <nav className="flex items-center gap-4">
                            <Link
                                href={getLink("/dashboard")}
                                className="text-sm text-slate-600 hover:text-blue-600"
                            >
                                Mijn Bedrijf
                            </Link>
                            <button className="text-sm text-slate-600 hover:text-red-600 flex items-center gap-1">
                                <LogOut className="w-4 h-4" />
                                Uitloggen
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-64 shrink-0">
                        <nav className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                            <Link
                                href={getLink("/dashboard")}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                <span className="font-medium">Overzicht</span>
                            </Link>
                            <Link
                                href={getLink("/dashboard/profile")}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <Store className="w-5 h-5" />
                                <span className="font-medium">Profiel Bewerken</span>
                            </Link>
                            <Link
                                href={getLink("/dashboard/reviews")}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-medium">Beoordelingen</span>
                            </Link>
                            <Link
                                href={getLink("/dashboard/seo")}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <TrendingUp className="w-5 h-5" />
                                <span className="font-medium">SEO Score</span>
                            </Link>

                            <div className="pt-4 border-t border-slate-200 mt-4">
                                <Link
                                    href={getLink("/dashboard/settings")}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="font-medium">Instellingen</span>
                                </Link>
                            </div>
                        </nav>

                        {/* Quick Stats Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-6 mt-6">
                            <h3 className="font-bold mb-2">💡 Tip</h3>
                            <p className="text-sm text-blue-100">
                                Bedrijven met 5+ beoordelingen krijgen 3x meer kliks!
                            </p>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
