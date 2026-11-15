import React, { useState, useEffect } from 'react';
import { Smartphone, Download, ExternalLink, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';
import { adminStorage, CustomAppItem, getDirectCloudImageUrl } from '../utils/adminStorage';

interface DynamicAppsShowcaseProps {
  onNavigate?: (route: PageRoute, params?: any) => void;
}

export const DynamicAppsShowcase: React.FC<DynamicAppsShowcaseProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [apps, setApps] = useState<CustomAppItem[]>([]);

  useEffect(() => {
    adminStorage.fetchCustomAppsFromCloud().catch(() => {});
    const unsub = adminStorage.subscribeToCustomApps((list) => {
      setApps(list.filter(a => a.isActive !== false));
    });
    return () => unsub();
  }, []);

  if (apps.length === 0) {
    return (
      <div className="rounded-2xl bg-[#0D1220] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isHindi ? "ऑफलाइन मोबाइल ऐप सुइट" : "Offline Mobile App Suite"}
              </h3>
              <p className="text-xs text-stone-400">
                {isHindi ? "Android 8.0+ के लिए अनुकूलित • 100% ऑन-डिवाइस" : "Optimized for Android 8.0+ • 100% On-Device"}
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('download')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isHindi ? "डाउनलोड करें" : "Download APK"}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl bg-[#0D1220] border border-white/10 hover:border-red-500/40 p-5 space-y-4 transition-all shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {app.iconUrl ? (
                  <img
                    src={getDirectCloudImageUrl(app.iconUrl)}
                    alt={app.nameEn}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {isHindi ? (app.nameHi || app.nameEn) : app.nameEn}
                    </h3>
                    {app.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                        {app.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {isHindi ? (app.taglineHi || app.taglineEn) : app.taglineEn}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-stone-400 bg-white/5 px-2 py-1 rounded-lg border border-white/10 shrink-0">
                v{app.version || '1.0.0'}
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {isHindi ? (app.descriptionHi || app.descriptionEn) : app.descriptionEn}
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-white/10 flex-wrap">
              {app.downloadUrl && (
                <a
                  href={app.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHindi ? "APK डाउनलोड" : "Download APK"}</span>
                </a>
              )}
              {app.playStoreUrl && (
                <a
                  href={app.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Play</span>
                </a>
              )}
              {onNavigate && !app.downloadUrl && (
                <button
                  onClick={() => onNavigate('download')}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isHindi ? "विवरण देखें" : "View Details"}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
