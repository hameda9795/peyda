"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, children, title, maxWidth = "md" }: ModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative bg-white rounded-2xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full animate-in zoom-in-95 fade-in duration-200`}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
                        <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5 text-zinc-500" />
                        </button>
                    </div>
                )}

                {/* Close button without title */}
                {!title && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors z-10"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5 text-zinc-500" />
                    </button>
                )}

                {/* Body */}
                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
}
