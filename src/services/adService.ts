/**
 * ADVERTISEMENT ARCHITECTURE — LESS CREATION
 * Controlled, clean, non-intrusive ad slot abstraction.
 * Allows enabling Google AdSense / carbon ads / sponsor banners in future
 * without cluttering UI or creating ugly layout shifts.
 */

export interface AdSlotConfig {
  id: string;
  placement: 'home_mid' | 'tool_bottom' | 'catalog_sidebar' | 'article_inline';
  enabled: boolean;
  type: 'banner' | 'sponsor' | 'none';
  sponsorText?: string;
  sponsorLink?: string;
}

const DEFAULT_AD_CONFIG: Record<string, AdSlotConfig> = {
  home_mid: {
    id: 'home_mid',
    placement: 'home_mid',
    enabled: false, // Disabled by default for pristine clean UX; can be enabled in admin
    type: 'sponsor',
  },
  tool_bottom: {
    id: 'tool_bottom',
    placement: 'tool_bottom',
    enabled: false,
    type: 'banner',
  },
  catalog_sidebar: {
    id: 'catalog_sidebar',
    placement: 'catalog_sidebar',
    enabled: false,
    type: 'sponsor',
  }
};

export const adService = {
  isSlotEnabled(placement: string): boolean {
    return DEFAULT_AD_CONFIG[placement]?.enabled ?? false;
  },

  getSlotConfig(placement: string): AdSlotConfig | null {
    return DEFAULT_AD_CONFIG[placement] || null;
  }
};
