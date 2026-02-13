/**
 * Client-side tracking utilities
 */

export type TrackingEventType =
    | 'view'
    | 'phone_click'
    | 'website_click'
    | 'directions_click'
    | 'email_click'
    | 'booking_click';

export async function trackEvent(businessId: string, type: TrackingEventType): Promise<void> {
    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                businessId,
                type,
            }),
        });
    } catch (error) {
        // Silent fail - don't interrupt user experience
        console.error('Tracking error:', error);
    }
}

/**
 * Track business profile view
 * Call this when a business page loads
 */
export function trackBusinessView(businessId: string): void {
    // Only track once per session
    const sessionKey = `viewed_${businessId}`;
    if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, 'true');
        trackEvent(businessId, 'view');
    }
}

/**
 * Create tracking wrapper for links
 * Usage: <a href="..." onClick={(e) => trackClick(businessId, 'phone_click', e)}>
 */
export function trackClick(
    businessId: string,
    type: TrackingEventType,
    event?: React.MouseEvent
): void {
    trackEvent(businessId, type);
    // Don't prevent default - let the link work normally
}
