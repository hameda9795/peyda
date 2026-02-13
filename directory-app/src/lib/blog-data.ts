export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string; // Markdown or HTML string
    author: {
        name: string;
        avatar: string;
    };
    date: string;
    image: string;
    category: string;
    relatedBusinessIds?: string[];
}

export const MOCK_ARTICLES: Article[] = [
    {
        id: "1",
        title: "5 Verborgen Koffieparels in Utrecht",
        slug: "5-verborgen-koffieparels-utrecht",
        excerpt: "Ontdek de gezelligste koffietentjes buiten de gebaande paden. Van vintage vibes tot specialty coffee.",
        content: `
            <p className="mb-4">Utrecht stikt van de leuke koffietentjes, maar soms wil je net even wat anders dan de bekende plekken aan de Oudegracht. Wij zochten 5 unieke spots voor je uit.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. De Koffie Klub (Wittevrouwen)</h2>
            <p className="mb-4">Verscholen in de wijk Wittevrouwen vind je deze parel. De bonen worden lokaal gebrand en de appeltaart is er wereldberoemd in de buurt.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Black Brew</h2>
            <p className="mb-4">Voor de echte purist. Hier geen poespas, maar gewoon steengoede filterkoffie in een minimalistisch, Scandinavisch interieur.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Ontdek meer?</h2>
            <p className="mb-4">Wil je meer weten over de beste lunchplekken? Bekijk dan ook onze gids voor <a href="/utrecht/eten-drinken" className="text-indigo-600 underline">Eten & Drinken</a>.</p>
        `,
        author: {
            name: "Sophie de Vries",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
        },
        date: "22 Jan 2026",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop",
        category: "Eten & Drinken",
        relatedBusinessIds: ["1", "3"]
    },
    {
        id: "2",
        title: "Shoppen als een Local: De leukste boetiekjes",
        slug: "shoppen-als-een-local-utrecht",
        excerpt: "Sla de grote ketens over en steun lokale ondernemers. Dit zijn onze favoriete adresjes voor mode en design.",
        content: `
            <p className="mb-4">Wie goed zoekt, vindt in Utrecht prachtige boetiekjes met unieke items. Van duurzame mode tot handgemaakte sieraden.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Duurzaam & Vintage</h2>
            <p className="mb-4">De Voorstraat is the place to be voor vintage lovers. Maar vergeet ook de Twijnstraat niet, waar je prachtige concept stores vindt.</p>
        `,
        author: {
            name: "Mark Jansen",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
        },
        date: "18 Jan 2026",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        category: "Winkels",
        relatedBusinessIds: ["3", "7"]
    },
    {
        id: "3",
        title: "Fit het nieuwe jaar in: Sportscholen in Utrecht",
        slug: "fit-nieuwe-jaar-sportscholen-utrecht",
        excerpt: "Goede voornemens? Wij vergelijken de beste plekken om in shape te komen, van yoga tot crossfit.",
        content: `
            <p className="mb-4">Of je nu zoekt naar rust en balans of juist keihard wilt knallen, Utrecht heeft voor ieder wat wils.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Yoga & Mindfulness</h2>
            <p className="mb-4">Voor wie balans zoekt is Yoga Moves een aanrader. Ze bieden talloze stijlen aan op meerdere locaties in de stad.</p>
        `,
        author: {
            name: "Lisa Bakker",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
        },
        date: "05 Jan 2026",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
        category: "Sport & Gezondheid",
        relatedBusinessIds: ["6", "4"]
    }
];

export function getArticles() {
    return MOCK_ARTICLES;
}

export function getArticleBySlug(slug: string) {
    return MOCK_ARTICLES.find(a => a.slug === slug);
}
