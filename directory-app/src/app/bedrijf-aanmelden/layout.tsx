import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bedrijf Aanmelden | Utrecht Directory",
    description: "Meld uw bedrijf gratis aan bij Utrecht Directory en krijg een professionele, SEO-geoptimaliseerde bedrijfspagina.",
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout removes the sidebar and navbar for a clean registration experience
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}
