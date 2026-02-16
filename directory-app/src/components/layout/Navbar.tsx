"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Bell, Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import { SearchBar } from "./SearchBar";
import LoginModal from "@/components/LoginModal";
import { getCurrentUser } from "@/app/actions";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    categories: any[];
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

function MobileMenu({ isOpen, onClose, categories, onLoginClick, onRegisterClick }: MobileMenuProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const mainLinks = [
        { href: "/steden", label: "Steden" },
        { href: "/categorieen", label: "Categorieën" },
        { href: "/artikelen", label: "Artikelen" },
        { href: "/over-ons", label: "Over Ons" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            
            {/* Slide-in Menu */}
            <div className={`fixed top-0 left-0 w-[280px] h-full bg-white z-50 lg:hidden transition-transform duration-300 ease-out shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-200">
                    <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                            <span className="text-white font-bold text-sm">NL</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-zinc-900">
                            NL<span className="text-zinc-500 text-sm font-medium">Directory</span>
                        </span>
                    </Link>
                    <button 
                        onClick={onClose}
                        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="h-6 w-6 text-zinc-600" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-zinc-200">
                    <Link 
                        href="/search" 
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 bg-zinc-100 rounded-full min-h-[48px]"
                    >
                        <Search className="h-5 w-5 text-zinc-400" />
                        <span className="text-zinc-500 text-sm">Zoeken...</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 overflow-y-auto h-[calc(100%-230px)]">
                    {/* Login Button */}
                    <button
                        onClick={() => {
                            onClose();
                            onLoginClick();
                        }}
                        className="w-full mb-4 py-3.5 text-center text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-full transition-colors shadow-lg shadow-indigo-200 min-h-[48px] flex items-center justify-center gap-2"
                    >
                        <User className="h-5 w-5" />
                        Inloggen
                    </button>

                    <ul className="space-y-2">
                        {mainLinks.map((link) => (
                            <li key={link.href}>
                                <Link 
                                    href={link.href}
                                    onClick={onClose}
                                    className="block px-4 py-3 min-h-[44px] text-base font-medium text-zinc-700 hover:text-emerald-600 hover:bg-zinc-50 rounded-lg transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Categories Section */}
                    <div className="mt-6">
                        <h3 className="px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                            Categorieën
                        </h3>
                        <ul className="space-y-1">
                            {categories.slice(0, 8).map((category: any) => (
                                <li key={category.id}>
                                    <Link 
                                        href={`/categorieen/${category.slug}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between px-4 py-3 min-h-[44px] text-sm text-zinc-600 hover:text-emerald-600 hover:bg-zinc-50 rounded-lg transition-colors"
                                    >
                                        <span>{category.name}</span>
                                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 px-4">
                        <button
                            onClick={() => {
                                onClose();
                                onRegisterClick();
                            }}
                            className="block w-full py-3.5 text-center text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-full transition-colors shadow-lg shadow-emerald-200 min-h-[48px] flex items-center justify-center"
                        >
                            Bedrijf toevoegen
                        </button>
                    </div>
                </nav>
            </div>
        </>
    );
}

export function Navbar({ categories = [] }: { categories?: any[] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [redirectToRegister, setRedirectToRegister] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userBusinessId, setUserBusinessId] = useState<string | null>(null);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                setIsLoggedIn(!!user);
                setUserBusinessId(user?.businessId || null);
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsLoggedIn(false);
                setUserBusinessId(null);
            }
        };
        checkAuth();
    }, []);

    const handleLoginSuccess = () => {
        if (redirectToRegister) {
            window.location.href = '/bedrijf-aanmelden';
        } else {
            window.location.href = '/dashboard';
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-menu')) {
                setShowUserMenu(false);
            }
        };
        if (showUserMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showUserMenu]);

    return (
        <>
            <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-white/80 backdrop-blur-xl'}`}>
                <div className="container px-4 h-16 flex items-center justify-between mx-auto">
                    {/* Left Section - Hamburger + Logo */}
                    <div className="flex items-center gap-2 lg:gap-8">
                        {/* Hamburger Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6 text-zinc-700" />
                        </button>

                        {/* Logo - Always visible */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                                <span className="text-white font-bold text-sm">NL</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-zinc-900">
                                NL<span className="text-zinc-500 text-base font-medium ml-1">Directory</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            <MegaMenu categories={categories} />
                            <Link
                                href="/steden"
                                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors min-h-[44px] flex items-center"
                            >
                                Steden
                            </Link>
                            <Link
                                href="/artikelen"
                                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors min-h-[44px] flex items-center"
                            >
                                Artikelen
                            </Link>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 lg:gap-3">
                        {/* Search Bar - Desktop */}
                        <div className="hidden lg:block">
                            <SearchBar />
                        </div>

                        {/* Mobile Search Button - Improved */}
                        <Link
                            href="/search"
                            className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                            aria-label="Search"
                        >
                            <Search className="h-5 w-5" />
                        </Link>

                        {/* Notifications - Improved touch target */}
                        <button className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white" />
                        </button>

                        {/* User Button / Login */}
                        <div className="relative user-menu">
                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                                        aria-label="Menu"
                                    >
                                        <User className="h-5 w-5" />
                                    </button>

                                    {/* User Dropdown - Logged in */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-zinc-100 py-2 z-50">
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    window.location.href = '/dashboard';
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    setShowUserMenu(false);
                                                    await fetch('/api/auth/logout', { method: 'POST' });
                                                    setIsLoggedIn(false);
                                                    setUserBusinessId(null);
                                                    window.location.href = '/';
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Uitloggen
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors min-h-[44px] flex items-center"
                                >
                                    Inloggen
                                </button>
                            )}
                        </div>

                        {/* CTA Button - Improved */}
                        <button
                            onClick={() => {
                                setRedirectToRegister(true);
                                setShowLoginModal(true);
                            }}
                            className="hidden sm:flex px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-full transition-colors shadow-lg shadow-emerald-200 min-h-[44px] items-center"
                        >
                            Bedrijf toevoegen
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                categories={categories}
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => {
                    setRedirectToRegister(true);
                    setShowLoginModal(true);
                }}
            />

            {/* Login Modal */}
            <LoginModal isOpen={showLoginModal} onClose={() => { setShowLoginModal(false); setRedirectToRegister(false); }} onSuccess={handleLoginSuccess} isRegistration={redirectToRegister} />
        </>
    );
}
