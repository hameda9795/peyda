import type { Metadata, Viewport } from "next";
import { Sora, Fraunces, Rubik_Glitch } from "next/font/google";
import "./globals.css";
import { getCategories } from "@/lib/actions/categories";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/json-ld-schema";
import { AuthModalProvider } from "@/providers/AuthModalProvider";
import { ClientWrapper } from "@/components/layout/ClientWrapper";

// Fallback font for logo (if Ransom font is not available)
const rubikGlitch = Rubik_Glitch({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-rubik-glitch",
    display: "swap",
});

// ISR: Revalidate every 60 seconds for static generation with fresh data
export const revalidate = 60;

const sora = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
});

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peyda.nl';

// JSON-LD schemas for the entire site
const globalSchemas = JSON.stringify([
    generateOrganizationSchema(),
    generateWebSiteSchema()
]);

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "Peyda - De Bedrijvengids van Nederland",
        template: "%s | Peyda",
    },
    description: "De meest complete bedrijvengids voor heel Nederland. Vind lokale bedrijven, restaurants, kappers, loodgieters en meer in jouw stad of wijk met Peyda.",
    keywords: [
        "bedrijvengids",
        "lokale bedrijven",
        "Nederland",
        "bedrijven zoeken",
        "restaurants",
        "diensten",
        "winkels",
        "professionals",
        "ambachtslieden",
    ],
    authors: [{ name: "Peyda" }],
    creator: "Peyda",
    publisher: "Peyda",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "nl_NL",
        url: BASE_URL,
        siteName: "Peyda",
        title: "Peyda - De Bedrijvengids van Nederland",
        description: "Vind lokale bedrijven in heel Nederland. Van restaurants tot loodgieters - ontdek de beste professionals in jouw buurt met Peyda.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Peyda - De Bedrijvengids van Nederland",
        description: "Vind lokale bedrijven in heel Nederland.",
        creator: "@peyda_nl",
    },
    alternates: {
        canonical: BASE_URL,
    },
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        shortcut: "/favicon.svg",
        apple: [
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
    },
    category: "directory",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const categories: any = await getCategories();
    return (
        <html lang="nl" className={`${sora.variable} ${fraunces.variable} ${rubikGlitch.variable} light`} suppressHydrationWarning>
            <body className={sora.className} suppressHydrationWarning>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: globalSchemas }}
                />
                <AuthModalProvider>
                    <ClientWrapper categories={categories}>
                        {children}
                    </ClientWrapper>
                </AuthModalProvider>
            </body>
        </html>
    );
}
