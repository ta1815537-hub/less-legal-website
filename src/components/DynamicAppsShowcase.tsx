import React, { useState, useEffect } from 'react';
import { 
  Download, Smartphone, Star, Sparkles, ExternalLink, 
  Search, CheckCircle2, ShieldCheck, ArrowRight, Share2, 
  Info, Eye, Layers, Zap, X, Globe, Play
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
    // Initial fetch from cloud
    adminStorage.fetchCustomAppsFromCloud().then(res => {
      if (res && res.length > 0) setApps(res);
    });

    const unsubscribe = adminStorage.subscribeToCustomApps((updatedApps) => {
      setApps(updatedApps);
    });
    return () => unsubscribe();
  }, []);

  // Filter active apps
  const activeApps = apps.filter(a => a.isActive !== false);

  // If no custom apps created by admin yet, do not render empty section
  if (activeApps.length === 0) {
    return null;
  }

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(activeApps.map(a => a.category).filter(Boolean)))];

  // Filtered dataset
  const filteredApps = activeApps.filter(app => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = 
      app.nameHi.toLowerCase().includes(q) ||
      app.nameEn.toLowerCase().includes(q) ||
      app.taglineHi.toLowerCase().includes(q) ||
      app.taglineEn.toLowerCase().includes(q) ||
      app.descriptionHi.toLowerCase().includes(q) ||
      app.descriptionEn.toLowerCase().includes(q) ||
      (app.category && app.category.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
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
    <section className="relative w-full py-12 sm:py-16 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHindi ? "ऑफिशियल ऐप संग्रह" : "Official App Showcase"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {isHindi ? titleHi : titleEn}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {isHindi ? subtitleHi : subtitleEn}
            </p>
          </div>

          {showAllLink && onNavigate && (
            <button
              onClick={() => onNavigate('features')}
              className="self-start md:self-auto px-5 py-2.5 rounded-2xl bg-white/90 dark:bg-[#121622]/80 hover:bg-blue-50 dark:hover:bg-white/10 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm border border-blue-200/80 dark:border-white/10 transition-all cursor-pointer flex items-center gap-2 shadow-xs whitespace-nowrap"
            >
              <span>{isHindi ? "सभी ऐप्स देखें" : "View All Apps"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white/80 dark:bg-[#121622]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {cat === 'All' ? <Layers className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                <span>{cat === 'All' ? (isHindi ? "सभी ऐप्स" : "All Apps") : cat}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? "ऐप या टूल खोजें..." : "Search app or tool..."}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Apps Grid */}
        {displayedApps.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white/60 dark:bg-[#121622]/60 border border-dashed border-slate-300 dark:border-white/10 space-y-3">
            <Smartphone className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
              {isHindi ? "कोई ऐप नहीं मिला" : "No Apps Found"}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isHindi ? "आपके खोज मानदंडों से मेल खाता कोई ऐप नहीं है। कृपया अलग कीवर्ड का उपयोग करें।" : "No apps match your search criteria. Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {displayedApps.map((app) => {
              const iconSrc = getMediaDirectUrl(app.iconUrl);
              const bannerSrc = getMediaDirectUrl(app.bannerUrl || '');

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group relative rounded-3xl bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/40 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Ambient Glow on Hover */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

                  <div className="space-y-4">
                    {/* Top Row: App Icon + Title + Badges */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        {/* App Icon */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 p-0.5 shrink-0 shadow-md">
                          {iconSrc ? (
                            <img
                              src={iconSrc}
                              alt={app.nameEn}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                // Fallback icon on image load failure
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                              className="w-full h-full object-cover rounded-[14px] bg-slate-900"
                            />
                          ) : (
                            <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white">
                              <Smartphone className="w-7 h-7 text-blue-400" />
                            </div>
                          )}
                        </div>

                        {/* Title & Version */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
                              {app.badge || 'New'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 whitespace-nowrap">
                              v{app.version}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {isHindi ? app.nameHi : app.nameEn}
                          </h3>

                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                            {isHindi ? app.taglineHi : app.taglineEn}
                          </p>
                        </div>
                      </div>

                      {/* Price & Rating Badge */}
                      <div className="text-right shrink-0 space-y-1">
                        <span className="inline-block text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                          {app.priceTag || 'Free'}
                        </span>
                        {app.rating && (
                          <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <span>{app.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* App Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {isHindi ? app.descriptionHi : app.descriptionEn}
                    </p>

                    {/* Feature Highlights Pills */}
                    {app.features && app.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {app.features.slice(0, 3).map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 whitespace-nowrap"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate max-w-[180px]">{feat}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions Bar */}
                  <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-white/10 flex items-center justify-between gap-2 flex-wrap">
                    
                    {/* Secondary Actions (Info + Share) */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedAppModal(app)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                        title={isHindi ? "विवरण देखें" : "View Details"}
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isHindi ? "विवरण" : "Details"}</span>
                      </button>

                      <button
                        onClick={() => handleShareApp(app)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                        title={isHindi ? "शेयर करें" : "Share"}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {copiedId === app.id && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {isHindi ? "कॉपी हुआ!" : "Copied!"}
                        </span>
                      )}
                    </div>

                    {/* Primary Action Buttons (Download APK / Play Store) */}
                    <div className="flex items-center gap-2">
                      {app.playStoreUrl && (
                        <a
                          href={app.playStoreUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Google Play</span>
                        </a>
                      )}

                      {app.downloadUrl && (
                        <a
                          href={app.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isHindi ? "डाउनलोड APK" : "Download APK"}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* App Details & Preview Modal */}
      <AnimatePresence>
        {selectedAppModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 scrollbar-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAppModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shrink-0 shadow-lg">
                  {selectedAppModal.iconUrl ? (
                    <img
                      src={getMediaDirectUrl(selectedAppModal.iconUrl)}
                      alt={selectedAppModal.nameEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white">
                      <Smartphone className="w-8 h-8 text-blue-400" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 pr-8">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {selectedAppModal.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      v{selectedAppModal.version}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      • {selectedAppModal.priceTag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {isHindi ? selectedAppModal.nameHi : selectedAppModal.nameEn}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {isHindi ? selectedAppModal.taglineHi : selectedAppModal.taglineEn}
                  </p>
                </div>
              </div>

              {/* Banner / Screenshot Preview if available */}
              {selectedAppModal.bannerUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-64 bg-slate-950 shadow-inner">
                  <img
                    src={getMediaDirectUrl(selectedAppModal.bannerUrl)}
                    alt="App Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {isHindi ? "ऐप विवरण एवं उद्देश्य" : "App Overview & Purpose"}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {isHindi ? selectedAppModal.descriptionHi : selectedAppModal.descriptionEn}
                </p>
              </div>

              {/* Key Features List */}
              {selectedAppModal.features && selectedAppModal.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "मुख्य विशेषताएं" : "Key Highlights"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedAppModal.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-xs text-slate-800 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Download / Actions Bar */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareApp(selectedAppModal)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{isHindi ? "शेयर करें" : "Share App"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  {selectedAppModal.playStoreUrl && (
                    <a
                      href={selectedAppModal.playStoreUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white/10 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Google Play</span>
                    </a>
                  )}

                  {selectedAppModal.downloadUrl && (
                    <a
                      href={selectedAppModal.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isHindi ? "डाउनलोड APK" : "Download APK"}</span>
                    </a>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
