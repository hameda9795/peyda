"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 bg-zinc-900 py-12 px-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">NL</span>
                        </div>
                        <span className="text-lg font-bold text-white">
                            NL Directory
                        </span>
                    </div>
                    <p className="text-sm text-zinc-400 mt-4">
                        De premium gids voor ondernemers en consumenten in Nederland. Ontdek de beste bedrijven in jouw stad of wijk.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Ontdekken</h4>
                    <ul className="space-y-3">
                        <li><Link href="/steden" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Steden</Link></li>
                        <li><Link href="/categorieen" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Categorieën</Link></li>
                        <li><Link href="/artikelen" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Artikelen</Link></li>
                        <li><Link href="/beste" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Beste Bedrijven</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Ondernemers</h4>
                    <ul className="space-y-3">
                        <li><Link href="/bedrijf-aanmelden" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Bedrijf aanmelden</Link></li>
                        <li><Link href="/dashboard" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Dashboard</Link></li>
                        <li><Link href="/contact" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Support</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Over Ons</h4>
                    <ul className="space-y-3">
                        <li><Link href="/over-ons" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Over Ons</Link></li>
                        <li><Link href="/contact" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Contact</Link></li>
                        <li><Link href="/privacy" className="text-zinc-300 hover:text-emerald-400 transition-colors block min-h-[44px] flex items-center">Privacy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} NL Directory. Alle rechten voorbehouden.
            </div>
        </footer>
    );
}
