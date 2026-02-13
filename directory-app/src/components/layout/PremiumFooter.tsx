import Link from "next/link";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowUpRight
} from "lucide-react";

export function PremiumFooter() {
    const popularProvinces = NETHERLANDS_PROVINCES.slice(0, 6);

    const categories = [
        { name: "Restaurants", slug: "eten-drinken" },
        { name: "Beauty & Kappers", slug: "beauty" },
        { name: "Klussen", slug: "klussen" },
        { name: "IT & Tech", slug: "it-tech" },
        { name: "Gezondheid", slug: "gezondheid" },
        { name: "Winkels", slug: "winkels" },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                NL
                            </div>
                            <div>
                                <span className="text-xl font-bold">NL Directory</span>
                                <span className="block text-sm text-gray-400">Nederland's #1 bedrijvengids</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
                            De premium gids voor ondernemers en consumenten in heel Nederland.
                            Ontdek de beste lokale bedrijven bij jou in de buurt.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Linkedin, href: "#" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Provincies */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                            Provincies
                        </h4>
                        <ul className="space-y-3">
                            {popularProvinces.map((province) => (
                                <li key={province.slug}>
                                    <Link
                                        href={`/provincies/${province.slug}`}
                                        className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        <span>{province.icon}</span>
                                        {province.name}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                            Populaire Categorieën
                        </h4>
                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li key={category.slug}>
                                    <Link
                                        href={`/categorieen/${category.slug}`}
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Resources */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                            Contact & Hulp
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/bedrijf-aanmelden" className="text-gray-300 hover:text-white transition-colors">
                                    Bedrijf aanmelden
                                </Link>
                            </li>
                            <li>
                                <Link href="/over-ons" className="text-gray-300 hover:text-white transition-colors">
                                    Over ons
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/voorwaarden" className="text-gray-300 hover:text-white transition-colors">
                                    Algemene Voorwaarden
                                </Link>
                            </li>
                        </ul>

                        {/* Contact Info */}
                        <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
                            <a href="mailto:info@nldirectory.nl" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                                <Mail className="w-4 h-4" />
                                info@nldirectory.nl
                            </a>
                            <a href="tel:+31201234567" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                                <Phone className="w-4 h-4" />
                                +31 20 123 4567
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} NL Directory. Alle rechten voorbehouden.
                        </p>

                        {/* Language Selector */}
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                <span className="text-lg">🇳🇱</span>
                                Nederlands
                            </button>
                            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                <span className="text-lg">🇬🇧</span>
                                English
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
