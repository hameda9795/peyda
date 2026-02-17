"use client";

import { Modal } from "@/components/ui/modal";
import { LayoutDashboard, Building2 } from "lucide-react";

interface BusinessRegistrationPromptProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BusinessRegistrationPrompt({ isOpen, onClose }: BusinessRegistrationPromptProps) {
    const handleRegister = () => {
        onClose();
        window.location.href = "/bedrijf-aanmelden";
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
            <div className="text-center py-6">
                {/* Icon */}
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6">
                    <Building2 className="w-8 h-8 text-emerald-600" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-zinc-900 mb-3">
                    Welkom terug!
                </h2>

                {/* Message */}
                <p className="text-base text-zinc-600 mb-8 leading-relaxed">
                    Je hebt nog geen bedrijf geregistreerd.
                    <br />
                    Registreer nu je bedrijf om toegang te krijgen tot je dashboard.
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleRegister}
                    className="w-full px-6 py-4 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 flex items-center justify-center gap-3 min-h-[56px]"
                >
                    <LayoutDashboard className="w-5 h-5" />
                    Bedrijf Aanmelden
                </button>

                {/* Secondary action */}
                <button
                    onClick={onClose}
                    className="mt-4 w-full px-6 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors min-h-[48px]"
                >
                    Misschien later
                </button>
            </div>
        </Modal>
    );
}
