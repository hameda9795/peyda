"use client";

import Link from "next/link";
import { useState, useEffect, useSyncExternalStore } from "react";
import { Search, Bell, Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import LoginModal from "@/components/LoginModal";
import { BusinessRegistrationPrompt } from "@/components/BusinessRegistrationPrompt";
import { getCurrentUser } from "@/app/actions";

// Hook that safely gets pathname (returns '/' during SSR)
function usePathnameSafe() {
    return useSyncExternalStore(
        () => () => {}, // no-op subscribe
        () => {
            if (typeof window === 'undefined') return '/';
            return window.location.pathname;
        },
        () => '/' // SSR snapshot
    );
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    categories: any[];
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

// Mobile auth button component
function MobileAuthButton({ onClose }: { onClose: () => void }) {
    const [hasPublishedBusiness, setHasPublishedBusiness] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                setHasPublishedBusiness(user?.business?.publishStatus === 'PUBLISHED');
            } catch {
                setHasPublishedBusiness(false);
            }
        };
        checkAuth();
    }, []);

    if (hasPublishedBusiness) {
        return (
            <Link
                href="/dashboard"
                onClick={onClose}
                className="w-full mb-4 py-3.5 text-center text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-full transition-colors shadow-lg shadow-indigo-200 min-h-[48px] flex items-center justify-center gap-2"
            >
                <User className="h-5 w-5" />
                Profiel
            </Link>
        );
    }

    return (
        <button
            onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('show-login-modal'));
            }}
            className="w-full mb-4 py-3.5 text-center text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-full transition-colors shadow-lg shadow-indigo-200 min-h-[48px] flex items-center justify-center gap-2"
        >
            <User className="h-5 w-5" />
            Inloggen
        </button>
    );
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
                    <Link href="/" onClick={onClose}>
                        <span className="logo-text">peyda.nl</span>
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
                    {/* Login/Dashboard Button */}
                    <MobileAuthButton onClose={onClose} />

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
    const [hasPublishedBusiness, setHasPublishedBusiness] = useState(false);
    const [showBusinessPrompt, setShowBusinessPrompt] = useState(false);
    const pathname = usePathnameSafe();

    const isHomepage = pathname === "/";
    const isTransparent = isHomepage && !scrolled;

    // Check authentication status on mount and periodically
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                const isPublished = user?.business?.publishStatus === 'PUBLISHED';
                setHasPublishedBusiness(isPublished);
            } catch (error) {
                console.error('Auth check failed:', error);
                setHasPublishedBusiness(false);
            }
        };
        checkAuth();

        const handleAuthChange = () => checkAuth();
        window.addEventListener('auth-change', handleAuthChange);
        const handleShowLoginModal = () => setShowLoginModal(true);
        window.addEventListener('show-login-modal', handleShowLoginModal);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') checkAuth();
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        let checkCount = 0;
        const intervalId = setInterval(() => {
            checkAuth();
            checkCount++;
            if (checkCount >= 10) clearInterval(intervalId);
        }, 3000);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('show-login-modal', handleShowLoginModal);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(intervalId);
        };
    }, []);

    const handleLoginSuccess = async () => {
        const user = await getCurrentUser();
        if (redirectToRegister) {
            window.location.href = '/bedrijf-aanmelden';
        } else if (user?.business?.publishStatus === 'PUBLISHED') {
            window.location.href = '/dashboard';
        } else {
            setShowLoginModal(false);
            setShowBusinessPrompt(true);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-menu')) setShowUserMenu(false);
        };
        if (showUserMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showUserMenu]);

    return (
        <>
            <header className={`${isHomepage ? 'fixed' : 'sticky'} top-0 z-40 w-full transition-all duration-300 ${isTransparent ? 'bg-transparent border-b border-white/10' : 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-zinc-200/50'}`}>
                <div className="container px-4 h-16 flex items-center justify-between mx-auto relative">
                    {/* Left Section - Hamburger + Logo */}
                    <div className="flex items-center gap-2 lg:gap-8">
                        {/* Hamburger Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className={`lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors ${isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-zinc-100 text-zinc-700'}`}
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Logo - Always visible */}
                        <Link href="/" className="lg:static absolute left-1/2 lg:translate-x-0 -translate-x-1/2">
                            <span className={`logo-text ${isTransparent ? 'logo-text-transparent' : ''}`}>peyda.nl</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            <MegaMenu categories={categories} isTransparent={isTransparent} />
                            <Link
                                href="/steden"
                                className={`px-4 py-2 text-sm font-medium transition-colors min-h-[44px] flex items-center ${isTransparent ? 'text-white/90 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                            >
                                Steden
                            </Link>
                            <Link
                                href="/artikelen"
                                className={`px-4 py-2 text-sm font-medium transition-colors min-h-[44px] flex items-center ${isTransparent ? 'text-white/90 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                            >
                                Artikelen
                            </Link>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 lg:gap-3">
                        {/* Mobile Search Button */}
                        <Link
                            href="/search"
                            className={`lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
                            aria-label="Search"
                        >
                            <Search className="h-5 w-5" />
                        </Link>

                        {/* Notifications */}
                        <button className={`relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}>
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white" />
                        </button>

                        {/* User Button / Login - Desktop */}
                        <div className="relative user-menu hidden md:block">
                            {hasPublishedBusiness ? (
                                <Link
                                    href="/dashboard"
                                    className="flex px-4 py-2 text-sm font-medium text-white bg-[#0B2A3C] hover:bg-[#1C3D52] rounded-full transition-colors min-h-[44px] items-center gap-2 shadow-md"
                                >
                                    <User className="h-4 w-4" />
                                    Profiel
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors min-h-[44px] flex items-center ${isTransparent ? 'text-white/95 hover:bg-white/10' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}
                                >
                                    Inloggen
                                </button>
                            )}
                        </div>

                        {/* CTA Button - Desktop only */}
                        <button
                            onClick={() => {
                                setRedirectToRegister(true);
                                setShowLoginModal(true);
                            }}
                            className={`hidden lg:flex px-5 py-2.5 text-sm font-semibold rounded-full transition-colors shadow-lg min-h-[44px] items-center ${isTransparent ? 'bg-white text-zinc-900 hover:bg-zinc-100 shadow-white/10' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'}`}
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

            {/* Business Registration Prompt Modal */}
            <BusinessRegistrationPrompt
                isOpen={showBusinessPrompt}
                onClose={() => setShowBusinessPrompt(false)}
            />
        </>
    );
}
