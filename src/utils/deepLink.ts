export const LESS_LEGAL_PACKAGE_ID = 'com.lesslegal.app';
export const DEFAULT_PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${LESS_LEGAL_PACKAGE_ID}`;

interface LaunchLessLegalOptions {
  playStoreUrl?: string;
  onAppNotInstalled?: (playStoreUrl: string) => void;
}

/**
 * Attempts to open the installed Less Legal Android app directly to the requested screen
 * (e.g., 'premium' or 'membership'). If the app is not installed on the user's phone,
 * invokes onAppNotInstalled so the UI can notify the user and redirect to Google Play Store.
 */
export const launchLessLegalApp = (
  targetScreen: string = 'premium',
  options?: LaunchLessLegalOptions
) => {
  const cleanScreen = (targetScreen || 'home').replace(/^\/+/, '');
  const playStoreUrl = options?.playStoreUrl?.trim() || DEFAULT_PLAY_STORE_URL;
  const schemeUrl = `lesslegal://${cleanScreen}`;

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isAndroid = /Android/i.test(ua);

  let appOpened = false;

  const markOpened = () => {
    appOpened = true;
    cleanup();
  };

  const handleVisibilityChange = () => {
    if (document.hidden) markOpened();
  };

  const cleanup = () => {
    window.removeEventListener('pagehide', markOpened);
    window.removeEventListener('blur', markOpened);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  window.addEventListener('pagehide', markOpened, { passive: true });
  window.addEventListener('blur', markOpened, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

  if (isAndroid) {
    // Android Intent URI automatically opens com.lesslegal.app on the requested screen,
    // or falls back to Google Play Store if not installed in supported Android browsers.
    const intentUrl = `intent://${cleanScreen}#Intent;scheme=lesslegal;package=${LESS_LEGAL_PACKAGE_ID};S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;
    try {
      window.location.href = intentUrl;
    } catch {
      window.location.href = schemeUrl;
    }
  } else {
    try {
      window.location.href = schemeUrl;
    } catch {
      // Fall through to fallback timer
    }
  }

  // Fallback check if browser stays active (app not installed or desktop browser)
  setTimeout(() => {
    cleanup();
    if (!appOpened && !document.hidden) {
      if (options?.onAppNotInstalled) {
        options.onAppNotInstalled(playStoreUrl);
      } else {
        try {
          window.location.assign(playStoreUrl);
        } catch {}
      }
    }
  }, 1500);
};
