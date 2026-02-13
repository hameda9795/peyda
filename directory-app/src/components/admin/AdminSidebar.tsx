"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
    name: string;
    href: string;
    icon: any;
}

const sidebarItems: SidebarItem[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/categories", icon: Layers },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-white shadow-sm" suppressHydrationWarning>
            <div className="flex h-20 items-center justify-center border-b border-zinc-100 px-6 bg-gradient-to-r from-zinc-50 to-white" suppressHydrationWarning>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                        AdminPanel
                    </h1>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2" suppressHydrationWarning>
                <div className="px-3 mb-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Menu
                </div>
                <ul className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-zinc-400")} />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="mt-auto border-t border-zinc-100 p-6 bg-zinc-50/50" suppressHydrationWarning>
                <div className="flex items-center gap-4" suppressHydrationWarning>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold" suppressHydrationWarning>
                        A
                    </div>
                    <div className="flex-1 min-w-0" suppressHydrationWarning>
                        <p className="text-sm font-semibold text-zinc-900 truncate">Admin User</p>
                        <p className="text-xs text-zinc-500 truncate">admin@directory.nl</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
