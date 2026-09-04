import { SITE_CONFIG } from '../config';

/**
 * Attempts to launch Less Legal Android app directly if installed on device.
 * Opens the app directly to the Premium page (/premium).
 * Falls back to Google Play Store if the app is not installed.
 */
export const launchLessLegalApp = (path: string = 'premium') => {
  const isAndroid = /android/i.test(navigator.userAgent);
  const playStoreUrl = SITE_CONFIG.playStoreUrl || 'https://play.google.com/store/apps/details?id=com.lesslegal.app';

  if (isAndroid) {
    // Chrome Android Intent URL format with browser_fallback_url
    // Package: com.lesslegal.app
    // Target scheme/path: https://lesslegal.app/premium
    const encodedFallback = encodeURIComponent(playStoreUrl);
    const intentUrl = `intent://lesslegal.app/${path}#Intent;scheme=https;package=com.lesslegal.app;S.browser_fallback_url=${encodedFallback};end;`;

    // Trigger Android OS intent dispatch
    window.location.href = intentUrl;
  } else {
    // Non-Android / Desktop fallback
    window.open(playStoreUrl, '_blank', 'noopener,noreferrer');
  }
};
