import React, { useState, useEffect } from 'react';
import { 
  Download, Smartphone, Star, Sparkles, 
  Search, CheckCircle2, ArrowRight, Share2, 
  Info, Layers, X, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminStorage, CustomAppItem, convertCloudStorageUrl } from '../utils/adminStorage';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';

interface DynamicAppsShowcaseProps {
  onNavigate?: (route: PageRoute) => void;
  titleHi?: string;
  titleEn?: string;
  subtitleHi?: string;
  subtitleEn?: string;
  filterCategoryDefault?: string;
  limit?: number;
  showAllLink?: boolean;
}

export const DynamicAppsShowcase: React.FC<DynamicAppsShowcaseProps> = ({
  onNavigate,
  titleHi = "Less Creation ऐप एवं डिजिटल टूल्स इकोसिस्टम",
  titleEn = "Less Creation Apps & Digital Tools Ecosystem",
  subtitleHi = "कानूनी पेशेवरों, नागरिकों और छात्रों के लिए उच्च-सटीक, आधुनिक एवं शक्तिशाली मोबाइल और वेब एप्लिकेशन्स",
  subtitleEn = "High-precision, state-of-the-art legal suites, AI bare acts & productivity tools crafted for India",
  filterCategoryDefault = "All",
  limit,
  showAllLink = false
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [apps, setApps] = useState<CustomAppItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategoryDefault);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAppModal, setSelectedAppModal] = useState<CustomAppItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    adminStorage.fetchCustomAppsFromCloud().then(res => {
      if (res && res.length > 0) setApps(res);
    });

    const unsubscribe = adminStorage.subscribeToCustomApps((updatedApps) => {
      setApps(updatedApps);
    });
    return () => unsubscribe();
  }, []);

  const activeApps = apps.filter(a => a.isActive !== false);

  if (activeApps.length === 0) {
    return null;
  }

  const categories = ['All', ...Array.from(new Set(activeApps.map(a => a.category).filter(Boolean)))];

  const filteredApps = activeApps.filter(app => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    return (
      matchesCategory &&
      (app.nameHi.toLowerCase().includes(q) ||
        app.nameEn.toLowerCase().includes(q) ||
        app.taglineHi.toLowerCase().includes(q) ||
        app.taglineEn.toLowerCase().includes(q) ||
        app.descriptionHi.toLowerCase().includes(q) ||
        app.descriptionEn.toLowerCase().includes(q) ||
        (app.category && app.category.toLowerCase().includes(q)))
    );
  });

  const displayedApps = limit ? filteredApps.slice(0, limit) : filteredApps;

  const handleShareApp = (app: CustomAppItem) => {
    const shareUrl = app.playStoreUrl || app.downloadUrl || window.location.href;
    const shareText = `${isHindi ? app.nameHi : app.nameEn} - ${isHindi ? app.taglineHi : app.taglineEn}\nDownload: ${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: isHindi ? app.nameHi : app.nameEn,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedId(app.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getMediaDirectUrl = (url: string) => {
    if (!url) return '';
    return convertCloudStorageUrl(url).directUrl;
  };

  return (
    <div className="w-full space-y-6">
      {/* Category Pills and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#111016] text-white border-[#111016] dark:bg-white dark:text-[#111016] dark:border-white'
                  : 'bg-white dark:bg-[#151720] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-white/10 hover:border-stone-400'
              }`}
            >
              {cat === 'All' ? (isHindi ? "सभी ऐप्स" : "All Apps") : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? "ऐप खोजें..." : "Search apps..."}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 rounded-lg text-[#111016] dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#EA580C]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Apps Grid */}
      {displayedApps.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 space-y-2">
          <Smartphone className="w-8 h-8 text-stone-400 mx-auto opacity-50" />
          <h4 className="text-sm font-bold text-[#111016] dark:text-white">
            {isHindi ? "कोई ऐप नहीं मिला" : "No Apps Found"}
          </h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedApps.map((app) => {
            const iconSrc = getMediaDirectUrl(app.iconUrl);

            return (
              <div
                key={app.id}
                className="border border-stone-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#151720] p-6 hover:border-[#EA580C]/60 transition-colors flex flex-col justify-between shadow-2xs space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 shrink-0 flex items-center justify-center">
                        {iconSrc ? (
                          <img
                            src={iconSrc}
                            alt={app.nameEn}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Smartphone className="w-6 h-6 text-stone-400" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded bg-stone-100 dark:bg-white/10 text-stone-800 dark:text-stone-200">
                            {app.badge || 'New'}
                          </span>
                          {app.category && (
                            <span className="text-[10px] text-stone-500 font-medium">
                              {app.category}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-[#111016] dark:text-white mt-1 leading-snug">
                          {isHindi ? app.nameHi : app.nameEn}
                        </h3>

                        <p className="text-xs text-stone-500 line-clamp-1">
                          {isHindi ? app.taglineHi : app.taglineEn}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      {app.priceTag || 'Free'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                    {isHindi ? app.descriptionHi : app.descriptionEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAppModal(app)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-white/5 text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                      {isHindi ? "विवरण" : "Details"}
                    </button>
                    <button
                      onClick={() => handleShareApp(app)}
                      className="p-1.5 rounded-lg bg-stone-100 dark:bg-white/5 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors cursor-pointer"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {copiedId === app.id && (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        {isHindi ? "कॉपी हुआ!" : "Copied!"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {app.playStoreUrl && (
                      <a
                        href={app.playStoreUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/10 text-[#111016] dark:text-white font-bold transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play Store</span>
                      </a>
                    )}

                    {app.downloadUrl && (
                      <a
                        href={app.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isHindi ? "डाउनलोड APK" : "Download APK"}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* App Details Modal */}
      <AnimatePresence>
        {selectedAppModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-xl p-6 space-y-5"
            >
              <button
                onClick={() => setSelectedAppModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-stone-100 dark:bg-white/10 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 shrink-0 flex items-center justify-center">
                  {selectedAppModal.iconUrl ? (
                    <img
                      src={getMediaDirectUrl(selectedAppModal.iconUrl)}
                      alt={selectedAppModal.nameEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Smartphone className="w-7 h-7 text-stone-400" />
                  )}
                </div>

                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded bg-stone-100 dark:bg-white/10 text-stone-800 dark:text-stone-200">
                      {selectedAppModal.badge}
                    </span>
                    <span className="text-xs text-stone-500">v{selectedAppModal.version}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111016] dark:text-white">
                    {isHindi ? selectedAppModal.nameHi : selectedAppModal.nameEn}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {isHindi ? selectedAppModal.taglineHi : selectedAppModal.taglineEn}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {isHindi ? "विवरण" : "Overview"}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                  {isHindi ? selectedAppModal.descriptionHi : selectedAppModal.descriptionEn}
                </p>
              </div>

              {selectedAppModal.features && selectedAppModal.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {isHindi ? "मुख्य विशेषताएं" : "Key Highlights"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedAppModal.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/5 text-xs text-stone-700 dark:text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-stone-100 dark:border-white/10 flex items-center justify-end gap-2">
                {selectedAppModal.downloadUrl && (
                  <a
                    href={selectedAppModal.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isHindi ? "डाउनलोड APK" : "Download APK"}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
