import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 bg-background py-12 px-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-6 rounded-md bg-white flex items-center justify-center">
                            <span className="text-black font-bold text-sm">U</span>
                        </div>
                        <span className="text-md font-bold text-white">
                            Utrecht Directory
                        </span>
                    </div>
                    <p className="text-sm text-zinc-500">
                        De premium gids voor ondernemers en consumenten in Utrecht. Ontdek de beste plekjes van de stad.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Ontdekken</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li><Link href="/utrecht/eten-drinken" className="hover:text-white transition-colors">Eten & Drinken</Link></li>
                        <li><Link href="/utrecht/winkels" className="hover:text-white transition-colors">Winkels</Link></li>
                        <li><Link href="/utrecht/sport" className="hover:text-white transition-colors">Sport & Fitness</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Ondernemers</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li><Link href="/contact" className="hover:text-white transition-colors">Bedrijf aanmelden</Link></li>
                        <li><Link href="/contact?subject=support" className="hover:text-white transition-colors">Support</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Adverteren</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Over Ons</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li><Link href="/over-ons" className="hover:text-white transition-colors">Ons verhaaal</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy & Voorwaarden</Link></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto mt-12 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-600">
                &copy; {new Date().getFullYear()} Utrecht Directory. Alle rechten voorbehouden.
            </div>
        </footer>
    );
}
