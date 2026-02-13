import { Business } from "@/lib/types";
import {
    Building2,
    Clock,
    Globe,
    Mail,
    MapPin,
    Phone,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    CreditCard,
    Wifi,
    Languages
} from "lucide-react";
import Link from "next/link";

interface BusinessInfoSidebarProps {
    business: Business;
}

export function BusinessInfoSidebar({ business }: BusinessInfoSidebarProps) {
    const currentDay = new Date().toLocaleDateString('nl-NL', { weekday: 'long' });

    return (
        <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-slate-900 border-b border-slate-100 pb-3">Contactgegevens</h3>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-slate-600">
                        <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900">Adres</p>
                            <p>{business.address.street}</p>
                            <p>{business.address.postalCode} {business.address.city}</p>
                        </div>
                    </li>

                    {/* Google Maps */}
                    <li>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address.street}, ${business.address.postalCode} ${business.address.city}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 transition-colors cursor-pointer group"
                        >
                            <div className="relative">
                                <iframe
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${business.address.street}, ${business.address.postalCode} ${business.address.city}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    width="100%"
                                    height="180"
                                    style={{ border: 0, pointerEvents: 'none' }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Locatie op kaart"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-blue-600">
                                        Openen in Google Maps
                                    </span>
                                </div>
                            </div>
                        </a>
                    </li>

                    <li className="flex items-start gap-3 text-slate-600">
                        <Phone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900">Telefoon</p>
                            <a href={`tel:${business.contact.phone}`} className="hover:text-blue-600 transition-colors">
                                {business.contact.phone}
                            </a>
                        </div>
                    </li>

                    <li className="flex items-start gap-3 text-slate-600">
                        <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900">Email</p>
                            <a href={`mailto:${business.contact.email}`} className="hover:text-blue-600 transition-colors break-all">
                                {business.contact.email}
                            </a>
                        </div>
                    </li>

                    <li className="flex items-start gap-3 text-slate-600">
                        <Globe className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900">Website</p>
                            <a href={business.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors break-all">
                                {business.contact.website.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    </li>


                </ul>

                {/* Socials */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                    {business.contact.socials.instagram && (
                        <a href={business.contact.socials.instagram} className="p-2 rounded-lg bg-slate-50 text-pink-600 hover:bg-pink-50 transition-colors" aria-label="Instagram">
                            <Instagram className="w-5 h-5" />
                        </a>
                    )}
                    {business.contact.socials.facebook && (
                        <a href={business.contact.socials.facebook} className="p-2 rounded-lg bg-slate-50 text-blue-600 hover:bg-blue-50 transition-colors" aria-label="Facebook">
                            <Facebook className="w-5 h-5" />
                        </a>
                    )}
                    {business.contact.socials.linkedin && (
                        <a href={business.contact.socials.linkedin} className="p-2 rounded-lg bg-slate-50 text-blue-700 hover:bg-blue-50 transition-colors" aria-label="LinkedIn">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    )}
                    {business.contact.socials.twitter && (
                        <a href={business.contact.socials.twitter} className="p-2 rounded-lg bg-slate-50 text-sky-500 hover:bg-sky-50 transition-colors" aria-label="Twitter">
                            <Twitter className="w-5 h-5" />
                        </a>
                    )}
                </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 font-semibold text-lg mb-4 text-slate-900 border-b border-slate-100 pb-3">
                    <Clock className="w-5 h-5 text-slate-500" />
                    Openingstijden
                </div>
                <ul className="space-y-2.5 text-sm">
                    {business.openingHours.map((hour) => {
                        const isToday = hour.day.toLowerCase() === currentDay.toLowerCase();
                        return (
                            <li key={hour.day} className={`flex justify-between ${isToday ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                <span className="w-24">{hour.day}</span>
                                {hour.closed ? (
                                    <span className="text-red-500">Gesloten</span>
                                ) : (
                                    <span>{hour.open} - {hour.close}</span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Attributes/Facilities */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-slate-900">Kenmerken</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> Betaalmethoden
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {business.paymentMethods.map(pm => (
                                <span key={pm} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded border border-slate-100">
                                    {pm}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1">
                            <Wifi className="w-3 h-3" /> Faciliteiten
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {business.amenities.map(item => (
                                <span key={item} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded border border-slate-100">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1">
                            <Languages className="w-3 h-3" /> Talen
                        </p>
                        <div className="text-sm text-slate-600">
                            {business.languages.join(', ')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
