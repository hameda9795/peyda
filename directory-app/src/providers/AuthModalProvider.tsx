"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import LoginModal from "@/components/LoginModal";

interface AuthModalContextType {
    openLoginModal: () => void;
    openRegisterModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);

    const openLoginModal = () => {
        setIsRegistration(false);
        setShowLoginModal(true);
    };

    const openRegisterModal = () => {
        setIsRegistration(true);
        setShowLoginModal(true);
    };

    const handleClose = () => {
        setShowLoginModal(false);
        setIsRegistration(false);
    };

    const handleSuccess = () => {
        // After successful login/registration, reload to update UI
        window.location.reload();
    };

    return (
        <AuthModalContext.Provider value={{ openLoginModal, openRegisterModal }}>
            {children}
            <LoginModal
                isOpen={showLoginModal}
                onClose={handleClose}
                onSuccess={handleSuccess}
                isRegistration={isRegistration}
            />
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error("useAuthModal must be used within AuthModalProvider");
    }
    return context;
}
