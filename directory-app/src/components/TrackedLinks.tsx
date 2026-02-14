'use client';

import { trackPhoneClick, trackWebsiteClick, trackBookingClick, trackEmailClick } from '@/lib/tracking';

interface TrackedLinksProps {
    businessId: string;
    phone?: string;
    website?: string;
    bookingUrl?: string;
    ctaType?: string;
    children: React.ReactNode;
}

export function TrackedLinks({
    businessId,
    phone,
    website,
    bookingUrl,
    ctaType,
    children
}: TrackedLinksProps) {
    const handlePhoneClick = () => {
        trackPhoneClick(businessId);
    };

    const handleWebsiteClick = () => {
        trackWebsiteClick(businessId);
    };

    const handleBookingClick = () => {
        trackBookingClick(businessId);
    };

    // Clone children and add onClick handlers
    return (
        <>
            {children}
        </>
    );
}

// Simple wrapper for individual tracked links
export function TrackedLink({
    businessId,
    type,
    href,
    children,
    className
}: {
    businessId: string;
    type: 'phone' | 'website' | 'booking' | 'email';
    href: string;
    children: React.ReactNode;
    className?: string;
}) {
    const handleClick = () => {
        switch (type) {
            case 'phone':
                trackPhoneClick(businessId);
                break;
            case 'website':
                trackWebsiteClick(businessId);
                break;
            case 'booking':
                trackBookingClick(businessId);
                break;
            case 'email':
                trackEmailClick(businessId);
                break;
        }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            target={type !== 'phone' && type !== 'email' ? '_blank' : undefined}
            rel={type !== 'phone' && type !== 'email' ? 'noopener noreferrer' : undefined}
            className={className}
        >
            {children}
        </a>
    );
}
