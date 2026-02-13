"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { SidebarProvider } from "@/providers/SidebarProvider";

export function AppShell({ children, categories }: { children: React.ReactNode, categories?: any[] }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    const isRegister = pathname?.startsWith("/bedrijf-aanmelden");
    const isHomepage = pathname === "/";

    // Full-screen pages without navigation
    if (isAdmin || isRegister) {
        return <>{children}</>;
    }

    // Homepage has its own footer, no need for default layout wrapper
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
            </div>
        </SidebarProvider>
    );
}

