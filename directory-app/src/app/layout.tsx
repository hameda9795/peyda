import type { Metadata, Viewport } from "next";
import { Sora, Fraunces } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { getCategories } from "@/lib/actions/categories";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/json-ld-schema";
import { AuthModalProvider } from "@/providers/AuthModalProvider";

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
        card: "summary",
        title: "Peyda - De Bedrijvengids van Nederland",
        description: "Vind lokale bedrijven in heel Nederland.",
    },
    alternates: {
        canonical: BASE_URL,
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-16.ico", sizes: "16x16", type: "image/x-icon" },
            { url: "/favicon-32.ico", sizes: "32x32", type: "image/x-icon" },
            { url: "/favicon-48.ico", sizes: "48x48", type: "image/x-icon" },
        ],
        shortcut: "/favicon-16.ico",
        apple: [
            { url: "/favicon-32.ico" },
            { url: "/favicon-48.ico", sizes: "48x48" },
        ],
    },
    category: "business",
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
        <html lang="nl" className={`${sora.variable} ${fraunces.variable} light`} suppressHydrationWarning>
            <body className={sora.className} suppressHydrationWarning>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: globalSchemas }}
                />
                <AuthModalProvider>
                    <AppShell categories={categories}>
                        {children}
                    </AppShell>
                </AuthModalProvider>
            </body>
        </html>
    );
}
