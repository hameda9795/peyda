import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center max-w-2xl mx-auto">
                <div className="text-9xl font-black text-slate-200 mb-4">404</div>
                
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Pagina niet gevonden
                </h1>

                <p className="text-lg text-slate-600 mb-8">
                    De pagina die je zoekt bestaat niet (meer) of is verhuisd.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                    Terug naar Home
                </Link>
            </div>
        </div>
    );
}
