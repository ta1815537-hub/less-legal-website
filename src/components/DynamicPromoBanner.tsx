import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Play, ExternalLink } from 'lucide-react';
import { adminStorage, SiteAppConfig, convertCloudStorageUrl } from '../utils/adminStorage';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DynamicPromoBannerProps {
  onNavigate?: (route: PageRoute) => void;
  className?: string;
}

export const DynamicPromoBanner: React.FC<DynamicPromoBannerProps> = ({
  onNavigate,
  className = ""
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [config, setConfig] = useState<SiteAppConfig>(adminStorage.getSiteAppConfig());
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    adminStorage.fetchSiteAppConfigFromCloud().then(res => {
      if (res) setConfig(res);
    });

    const unsub = adminStorage.subscribeToSiteAppConfig((updated) => {
      setConfig(updated);
    });
    return () => unsub();
  }, []);

  if (!config.bannerActive || dismissed) return null;

  const handleActionClick = () => {
    if (!onNavigate) return;
    const targetLink = config.bannerLink || 'features';
    if (targetLink.startsWith('http://') || targetLink.startsWith('https://')) {
      window.open(targetLink, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate(targetLink as PageRoute);
    }
  };

  const convertedImg = config.bannerImageUrl ? convertCloudStorageUrl(config.bannerImageUrl).directUrl : '';
  const convertedVideo = config.bannerVideoUrl ? convertCloudStorageUrl(config.bannerVideoUrl).embedUrl : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
        className={`w-full ${className}`}
      >
        <div className="relative overflow-hidden rounded-[22px] sm:rounded-[26px] bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white shadow-xl border border-blue-500/30 p-4 sm:p-7">
          {/* Subtle Ambient Light Effect */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 sm:gap-8">
            {/* Media side (Image or Video) */}
            {(convertedImg || convertedVideo) && (
              <div className="w-full md:w-5/12 max-w-sm rounded-xl overflow-hidden bg-black/40 border border-white/15 shrink-0 shadow-lg">
                {convertedVideo ? (
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={convertedVideo}
                      title="Promotional Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <img
                    src={convertedImg}
                    alt={config.bannerTitle || "Promotional Banner"}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 sm:h-52 object-cover object-center transform hover:scale-102 transition-transform duration-500"
                    onError={(e) => {
                      // Gracefully hide broken image
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
            )}

            {/* Content side */}
            <div className="flex-1 text-center md:text-left space-y-2.5 sm:space-y-3 min-w-0">
              {config.bannerTag && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/25 border border-blue-400/40 text-blue-300 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="whitespace-nowrap">{config.bannerTag}</span>
                </div>
              )}

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                {config.bannerTitle || (isHindi ? "विशेष अपडेट एवं घोषणा" : "Special Announcement")}
              </h3>

              {config.bannerSubtitle && (
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-xl">
                  {config.bannerSubtitle}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={handleActionClick}
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-102"
                >
                  <span>{isHindi ? "विस्तार से देखें" : "Explore Now"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
