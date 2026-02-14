/**
 * Client-side tracking utilities with unique visitor detection
 */

export type TrackingEventType =
    | 'view'
    | 'phone_click'
    | 'whatsapp_click'
    | 'website_click'
    | 'directions_click'
    | 'email_click'
    | 'booking_click';

// Generate or get a unique visitor ID
function getVisitorId(): string {
    if (typeof window === 'undefined') return 'server';

    const STORAGE_KEY = 'peyda_visitor_id';
    let visitorId = localStorage.getItem(STORAGE_KEY);

    if (!visitorId) {
        visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem(STORAGE_KEY, visitorId);
    }

    return visitorId;
}

// Check if this action has already been tracked for this visitor this month
function hasTrackedAction(businessId: string, type: TrackingEventType): boolean {
    if (typeof window === 'undefined') return false;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const storageKey = `tracked_${businessId}_${type}_${currentMonth}`;
    const tracked = localStorage.getItem(storageKey);

    return tracked === 'true';
}

// Mark action as tracked for this visitor this month
function markActionTracked(businessId: string, type: TrackingEventType): void {
    if (typeof window === 'undefined') return;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const storageKey = `tracked_${businessId}_${type}_${currentMonth}`;
    localStorage.setItem(storageKey, 'true');
}

export async function trackEvent(businessId: string, type: TrackingEventType): Promise<boolean> {
    try {
        // Check if already tracked this month for this visitor
        if (hasTrackedAction(businessId, type)) {
            console.log(`[Tracking] Already tracked ${type} for business ${businessId} this month`);
            return false;
        }

        const visitorId = getVisitorId();

        const response = await fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                businessId,
                type,
                visitorId,
            }),
        });

        if (response.ok) {
            // Mark as tracked
            markActionTracked(businessId, type);
            return true;
        }

        return false;
    } catch (error) {
        // Silent fail - don't interrupt user experience
        console.error('Tracking error:', error);
        return false;
    }
}

/**
 * Track business profile view
 * Only counts once per unique visitor per month
 */
export function trackBusinessView(businessId: string): void {
    if (typeof window !== 'undefined') {
        trackEvent(businessId, 'view');
    }
}

/**
 * Track phone click
 * Only counts once per unique visitor per month
 */
export function trackPhoneClick(businessId: string): void {
    trackEvent(businessId, 'phone_click');
}

/**
 * Track WhatsApp click
 * Only counts once per unique visitor per month
 */
export function trackWhatsAppClick(businessId: string): void {
    trackEvent(businessId, 'whatsapp_click');
}

/**
 * Track website click
 * Only counts once per unique visitor per month
 */
export function trackWebsiteClick(businessId: string): void {
    trackEvent(businessId, 'website_click');
}

/**
 * Track directions click
 * Only counts once per unique visitor per month
 */
export function trackDirectionsClick(businessId: string): void {
    trackEvent(businessId, 'directions_click');
}

/**
 * Track email click
 * Only counts once per unique visitor per month
 */
export function trackEmailClick(businessId: string): void {
    trackEvent(businessId, 'email_click');
}

/**
 * Track booking click
 * Only counts once per unique visitor per month
 */
export function trackBookingClick(businessId: string): void {
    trackEvent(businessId, 'booking_click');
}

/**
 * Create tracking wrapper for links
 * Usage: <a href="..." onClick={() => trackClick(businessId, 'phone_click')}>
 */
export function trackClick(
    businessId: string,
    type: TrackingEventType
): void {
    trackEvent(businessId, type);
    // Don't prevent default - let the link work normally
}

/**
 * Get tracking stats for display (optional - shows visitor what was tracked)
 */
export function getTrackingStats(businessId: string): {
    viewed: boolean;
    phoneClicked: boolean;
    whatsappClicked: boolean;
    websiteClicked: boolean;
    directionsClicked: boolean;
    emailClicked: boolean;
} {
    if (typeof window === 'undefined') {
        return {
            viewed: false,
            phoneClicked: false,
            whatsappClicked: false,
            websiteClicked: false,
            directionsClicked: false,
            emailClicked: false,
        };
    }

    const currentMonth = new Date().toISOString().slice(0, 7);

    return {
        viewed: localStorage.getItem(`tracked_${businessId}_view_${currentMonth}`) === 'true',
        phoneClicked: localStorage.getItem(`tracked_${businessId}_phone_click_${currentMonth}`) === 'true',
        whatsappClicked: localStorage.getItem(`tracked_${businessId}_whatsapp_click_${currentMonth}`) === 'true',
        websiteClicked: localStorage.getItem(`tracked_${businessId}_website_click_${currentMonth}`) === 'true',
        directionsClicked: localStorage.getItem(`tracked_${businessId}_directions_click_${currentMonth}`) === 'true',
        emailClicked: localStorage.getItem(`tracked_${businessId}_email_click_${currentMonth}`) === 'true',
    };
}
