import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center max-w-2xl mx-auto">
                <div className="relative mb-8 inline-block">
                    <div className="text-9xl font-black text-slate-200">404</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-slate-800 bg-slate-50 px-4">
                        Pagina niet gevonden
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Oeps! Je bent verdwaald
                </h1>

                <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto">
                    De pagina die je zoekt bestaat niet (meer) of is verhuisd. Geen zorgen, we helpen je weer op weg.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 hover:-translate-y-0.5 duration-200"
                    >
                        <Home className="h-5 w-5" />
                        Terug naar Home
                    </Link>

                    <a
                        href="/categorieen/eten-drinken"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors hover:border-slate-300"
                    >
                        <Search className="h-5 w-5 text-slate-400" />
                        Zoek bedrijven
                    </a>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200">
                    <p className="text-sm text-slate-400">
                        Populaire categorieën: {' '}
                        <Link href="/categorieen/eten-drinken" className="text-indigo-600 hover:underline">Eten & Drinken</Link>, {' '}
                        <Link href="/categorieen/winkels" className="text-indigo-600 hover:underline">Winkels</Link>, {' '}
                        <Link href="/categorieen/gezondheid" className="text-indigo-600 hover:underline">Gezondheid</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
