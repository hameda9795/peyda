import { Metadata } from "next";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact | Peyda",
    description: "Neem contact op met het team van Peyda.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-zinc-50 py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-zinc-900 mb-4">Neem Contact Op</h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                        Heb je vragen, opmerkingen of wil je jouw bedrijf aanmelden?
                        We horen graag van je.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-zinc-100">
                    {/* Contact Info Side */}
                    <div className="bg-indigo-900 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900 rounded-full blur-3xl opacity-50 -ml-20 -mb-20"></div>

                        <div className="relative z-10 space-y-10">
                            <div>
                                <h3 className="text-2xl font-bold mb-6">Contactgegevens</h3>
                                <p className="text-indigo-200">
                                    Ons team staat klaar om je te helpen. Je kunt ons bereiken via de onderstaande kanalen.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg">Email</p>
                                        <p className="text-indigo-200">info@peyda.nl</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg">Telefoon</p>
                                        <p className="text-indigo-200">+31 (0)30 123 4567</p>
                                        <p className="text-xs text-indigo-300 mt-1">Ma-Vr, 09:00 - 17:00</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg">Kantoor</p>
                                        <p className="text-indigo-200">
                                            Oudegracht 123<br />
                                            3511 AA Utrecht<br />
                                            Nederland
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12">
                            <div className="flex gap-4">
                                {/* Social icons placeholders */}
                                <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Side */}
                    <div className="p-10 md:p-14">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-zinc-700">Voornaam</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                        placeholder="Jan"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-zinc-700">Achternaam</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                        placeholder="Jansen"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-zinc-700">Emailadres</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="jan@voorbeeld.nl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-zinc-700">Onderwerp</label>
                                <select
                                    id="subject"
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                >
                                    <option value="">Kies een onderwerp</option>
                                    <option value="general">Algemene vraag</option>
                                    <option value="business">Bedrijf aanmelden</option>
                                    <option value="support">Technische ondersteuning</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-zinc-700">Bericht</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                                    placeholder="Typ hier je bericht..."
                                ></textarea>
                            </div>

                            <button
                                type="button"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                            >
                                <Send className="h-5 w-5" />
                                Verstuur Bericht
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
