import Script from "next/script";

const faqs = [
    {
        question: "Hoe helpt Peyda mijn lokale vindbaarheid?",
        answer: "We tonen een complete bedrijfspagina met categorie, locatie en contactgegevens. Dit helpt zoekmachines en bezoekers om je sneller te vinden in lokale zoekopdrachten."
    },
    {
        question: "Welke gegevens heb ik nodig om mijn bedrijf aan te melden?",
        answer: "Je vult basisinformatie in zoals bedrijfsnaam, categorie, adres, contactgegevens en een korte omschrijving. Foto's en openingstijden maken je profiel sterker."
    },
    {
        question: "Kunnen klanten mij direct bereiken via de pagina?",
        answer: "Ja. Op je bedrijfspagina staan duidelijke CTA's voor bellen, e-mailen of het bezoeken van je website."
    },
    {
        question: "Kan ik mijn servicegebied aangeven?",
        answer: "Je kunt aangeven in welke stad of regio je actief bent, zodat je zichtbaar wordt in de juiste lokale resultaten."
    },
    {
        question: "Is zoeken op Peyda gratis voor bezoekers?",
        answer: "Ja. Iedereen kan bedrijven zoeken, vergelijken en contact opnemen zonder account."
    }
];

export function FaqSection() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <section className="faq-section">
            <Script
                id="home-faq-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="section-header mb-8">
                    <h2>Veelgestelde vragen</h2>
                    <p>Antwoorden voor ondernemers en bezoekers die sneller willen starten.</p>
                </div>
                <div className="faq-grid">
                    {faqs.map((faq) => (
                        <details key={faq.question} className="faq-item">
                            <summary className="faq-summary">
                                {faq.question}
                                <span aria-hidden="true">+</span>
                            </summary>
                            <div className="faq-answer">{faq.answer}</div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
