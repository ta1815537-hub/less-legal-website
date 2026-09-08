/**
 * ANALYTICS ABSTRACTION SERVICE — LESS CREATION
 * Privacy-first, zero-cookie, zero-overhead analytics abstraction.
 * Easily pluggable with GA/Cloudflare Web Analytics or custom metrics
 * without tracking personal user data.
 */

export type AnalyticsEventType =
  | 'tool_opened'
  | 'tool_completed'
  | 'tool_category_viewed'
  | 'search_performed'
  | 'listing_viewed'
  | 'listing_contact_clicked'
  | 'upgrade_page_viewed'
  | 'purchase_initiated'
  | 'purchase_completed'
  | 'download_clicked';

export const analyticsService = {
  track(event: AnalyticsEventType, properties?: Record<string, any>): void {
    try {
      // Safe, non-blocking console log in development
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[Less Analytics] ${event}:`, properties);
      }

      // Check for window.gtag if configured
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, properties);
      }
    } catch {
      // Analytics must never throw or break app flow
    }
  }
};
