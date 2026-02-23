"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { PremiumFooter } from "./PremiumFooter";
import { SidebarProvider } from "@/providers/SidebarProvider";

interface ClientWrapperProps {
    children: React.ReactNode;
    categories?: any[];
}

// Client Component - handles pathname-dependent logic
export function ClientWrapper({ children, categories }: ClientWrapperProps) {
    const pathname = usePathname();
    
    const isAdmin = pathname?.startsWith("/admin");
    const isRegister = pathname?.startsWith("/bedrijf-aanmelden");
    const isDashboard = pathname?.startsWith("/dashboard");
    const isHomepage = pathname === "/";

    // Full-screen pages without navigation
    if (isAdmin || isRegister || isDashboard) {
        return <>{children}</>;
    }

    // Homepage has its own footer
    if (isHomepage) {
        return (
            <SidebarProvider>
                <div className="min-h-screen bg-white text-foreground flex flex-col">
                    <Navbar categories={categories} />
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        );
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar categories={categories} />
                <main className="flex-1 overflow-x-hidden bg-zinc-50">
                    {children}
                </main>
                <PremiumFooter />
            </div>
        </SidebarProvider>
    );
}
