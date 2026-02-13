import { Metadata } from "next";
import { Building2, Users, Heart, Target } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Over Ons | Utrecht Business Directory",
    description: "Lees meer over onze missie om ondernemers en bewoners in Utrecht met elkaar te verbinden.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Hero Section */}
            <section className="relative py-20 bg-indigo-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Wie zijn wij?</h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                        Wij bouwen de brug tussen lokale ondernemers en de inwoners van onze prachtige stad Utrecht.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 -mt-10 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Target}
                            title="Onze Missie"
                            description="Het creëren van een compleet, betrouwbaar en gebruiksvriendelijk platform waar elke Utrechtse ondernemer gezien wordt."
                        />
                        <FeatureCard
                            icon={Heart}
                            title="Lokaal Hart"
                            description="Wij geloven in de kracht van lokaal. Van de bakker op de hoek tot de start-up in het centrum."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Samen Groeien"
                            description="Door zichtbaarheid te vergroten helpen we bedrijven groeien en bewoners de pareltjes van de stad ontdekken."
                        />
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
                        <div className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1543423776-92f70b7410eb?q=80&w=1974&auto=format&fit=crop"
                                alt="Utrecht City Center"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                            <h2 className="text-3xl font-bold text-zinc-900">Het verhaal achter het platform</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                Het begon allemaal met een simpel idee: waarom is het zo lastig om echt goede, lokale specialisten te vinden in Utrecht? Grote zoekmachines tonen vaak alleen de grootste spelers.
                            </p>
                            <p className="text-zinc-600 leading-relaxed">
                                Utrecht Business Directory is gestart om daar verandering in te brengen. Wij bieden een podium voor <strong>iedere</strong> ondernemer in Utrecht, groot of klein. Met een focus op kwaliteit, duidelijke informatie en een prachtige presentatie zorgen we ervoor dat jouw bedrijf opvalt.
                            </p>
                            <div className="pt-4">
                                <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                                    Neem contact op
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">{title}</h3>
            <p className="text-zinc-500 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
