import React, { useState, useEffect } from 'react';
import { ArrowRight, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';
import { adminStorage, SiteAppConfig } from '../utils/adminStorage';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';

interface HeaderAnnouncementTickerProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

export const HeaderAnnouncementTicker: React.FC<HeaderAnnouncementTickerProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [config, setConfig] = useState<SiteAppConfig>(() => adminStorage.getSiteAppConfig());

  useEffect(() => {
    adminStorage.fetchSiteAppConfigFromCloud(false).then((res) => {
      if (res) setConfig(res);
    }).catch(() => {});

    const unsub = adminStorage.subscribeToSiteAppConfig((updated) => {
      setConfig(updated);
    });

    return () => unsub();
  }, []);

  if (!config.announcementActive) return null;

  const text = (isHindi ? config.announcementTextHi : config.announcementTextEn)?.trim()
    || config.announcementTextEn?.trim()
    || config.announcementTextHi?.trim();

  if (!text) return null;

  const badge = (isHindi ? config.announcementBadgeHi : config.announcementBadgeEn)?.trim()
    || (isHindi ? 'सूचना' : 'NOTICE');

  const btnText = (isHindi ? config.announcementButtonTextHi : config.announcementButtonTextEn)?.trim();

  const handleLinkClick = () => {
    const raw = (config.announcementLink || 'articles').trim();
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      window.open(raw, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate(raw as PageRoute);
    }
  };

  return (
    <div
      role="region"
      aria-label={isHindi ? 'ताज़ा घोषणा टिकर' : 'Live Announcement Ticker'}
      className="sticky top-[62px] sm:top-[70px] z-40 w-full px-3 sm:px-6 lg:px-8 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto relative rounded-xl sm:rounded-2xl bg-[#030509]/95 bg-gradient-to-r from-[#160509]/95 via-[#030509]/95 to-[#160509]/95 backdrop-blur-xl border border-red-500/25 shadow-[0_12px_36px_rgba(0,0,0,0.8)] px-3.5 sm:px-5 py-1.5 sm:py-2 overflow-hidden pointer-events-auto">
        {/* Top Precision Crimson Edge Hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/45 to-transparent"
        />

        <div className="flex items-center justify-between gap-2.5 relative z-10">
          {/* Crimson-Black Notice Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">
            <Megaphone className="w-3 h-3 shrink-0" />
            <span>{badge}</span>
          </span>

          {/* Smooth Scrolling Ticker Window */}
          <div
            onClick={handleLinkClick}
            className="flex-1 min-w-0 overflow-hidden cursor-pointer relative group"
            title={text}
          >
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className="flex items-center w-max will-change-transform"
            >
              {[0, 1].map((halfIdx) => (
                <div key={halfIdx} aria-hidden={halfIdx === 1} className="flex items-center gap-8 pr-8 shrink-0">
                  <span className="text-[11px] sm:text-xs font-medium text-stone-100 whitespace-nowrap group-hover:text-white">
                    {text}
                  </span>
                  <span aria-hidden="true" className="text-red-500/60 text-xs">
                    •
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-stone-100 whitespace-nowrap group-hover:text-white">
                    {text}
                  </span>
                  <span aria-hidden="true" className="text-red-500/60 text-xs">
                    •
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Action Button (No dismiss/cut button) */}
          {btnText && (
            <button
              onClick={handleLinkClick}
              className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0 bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-600/25"
            >
              <span>{btnText}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
