import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacybeleid | Utrecht Business Directory",
    description: "Privacybeleid en algemene voorwaarden van Utrecht Business Directory.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <header className="mb-12 pb-8 border-b border-zinc-100">
                    <h1 className="text-4xl font-bold text-zinc-900 mb-4">Privacybeleid</h1>
                    <p className="text-zinc-500">
                        Laatst bijgewerkt: 22 januari 2026
                    </p>
                </header>

                <article className="prose prose-indigo prose-lg text-zinc-600">
                    <p className="lead">
                        Bij Utrecht Business Directory hechten we veel waarde aan jouw privacy. In dit privacybeleid leggen we uit hoe we omgaan met jouw persoonsgegevens.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-10 mb-4">1. Gegevens die we verzamelen</h2>
                    <p>
                        Wij verzamelen gegevens die je zelf aan ons verstrekt, bijvoorbeeld wanneer je contact opneemt via ons contactformulier of je aanmeldt voor onze nieuwsbrief. Deze gegevens kunnen bestaan uit:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                        <li>Naam</li>
                        <li>E-mailadres</li>
                        <li>Telefoonnummer</li>
                        <li>IP-adres (automatisch)</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-10 mb-4">2. Hoe we gegevens gebruiken</h2>
                    <p>
                        Wij gebruiken jouw gegevens uitsluitend voor de volgende doeleinden:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                        <li>Het verbeteren van onze website en diensten.</li>
                        <li>Het beantwoorden van vragen of contactverzoeken.</li>
                        <li>Het sturen van updates (indien je je hebt aangemeld).</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-10 mb-4">3. Delen met derden</h2>
                    <p>
                        Wij verkopen jouw gegevens nooit aan derden. Wij delen gegevens alleen indien dit wettelijk verplicht is of noodzakelijk voor de uitvoering van onze dienstverlening.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-10 mb-4">4. Cookies</h2>
                    <p>
                        Onze website maakt gebruik van functionele en analytische cookies om de gebruikerservaring te optimaliseren. Je kunt cookies beheren via de instellingen van je browser.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-10 mb-4">5. Jouw rechten</h2>
                    <p>
                        Je hebt het recht om jouw persoonsgegevens in te zien, te corrigeren of te laten verwijderen. Neem hiervoor contact op via info@utrechtdirectory.nl.
                    </p>

                    <div className="mt-12 p-6 bg-zinc-50 rounded-xl border border-zinc-100">
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Vragen?</h3>
                        <p>
                            Heb je vragen over ons privacybeleid? Neem gerust contact op via onze <a href="/contact" className="text-indigo-600 hover:text-indigo-700 font-medium">contactpagina</a>.
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}
