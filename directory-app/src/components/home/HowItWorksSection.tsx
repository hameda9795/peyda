import { Search, MousePointer, PhoneCall } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            number: 1,
            icon: <Search className="w-6 h-6" />,
            title: "Zoek & Ontdek",
            description: "Vind lokale bedrijven en diensten die aan je wensen voldoen via onze uitgebreide zoekmogelijkheden."
        },
        {
            number: 2,
            icon: <MousePointer className="w-6 h-6" />,
            title: "Vergelijk Opties",
            description: "Vergelijk bedrijven op basis van beoordelingen, prijzen en aanbod. Bekijk foto's en reviews."
        },
        {
            number: 3,
            icon: <PhoneCall className="w-6 h-6" />,
            title: "Neem Contact Op",
            description: "Direct contact opnemen of een afspraak maken bij je gekozen bedrijf. Snel en eenvoudig."
        }
    ];

    return (
        <section className="how-it-works-section py-10 px-3">
            <div className="container mx-auto max-w-5xl">
                {/* Section Header */}
                <div className="section-header mb-8">
                    <h2>Hoe het werkt</h2>
                    <p>In drie eenvoudige stappen vind je de perfecte lokale dienstverlener</p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
                    {steps.map((step, index) => (
                        <div key={step.number} className="step-card relative">
                            {/* Connector line (except last) */}
                            {index < steps.length - 1 && (
                                <div className="step-connector hidden md:block"></div>
                            )}

                            {/* Number Circle */}
                            <div className="step-number">
                                {step.number}
                            </div>

                            {/* Content */}
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
