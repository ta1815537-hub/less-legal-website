import React, { useState, useEffect } from 'react';
import { 
  Bell, AlertTriangle, CheckCircle2, Info, Sparkles, 
  ExternalLink, ArrowRight, X, Megaphone, ShieldAlert
} from 'lucide-react';
import { adminStorage, CustomNoticeItem } from '../utils/adminStorage';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';

interface DynamicNoticeBoardProps {
  onNavigate?: (route: PageRoute) => void;
  className?: string;
  variant?: 'ticker' | 'cards' | 'floating';
}

export const DynamicNoticeBoard: React.FC<DynamicNoticeBoardProps> = ({
  onNavigate,
  className = "",
  variant = 'cards'
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [notices, setNotices] = useState<CustomNoticeItem[]>([]);
  const [dismissedNotices, setDismissedNotices] = useState<string[]>([]);

  useEffect(() => {
    adminStorage.fetchCustomNoticesFromCloud?.().catch(() => {});
    const unsub = adminStorage.subscribeToCustomNotices((updated) => {
      setNotices(updated.filter(n => n.isActive !== false));
    });
    return () => unsub();
  }, []);

  const visibleNotices = notices.filter(n => !dismissedNotices.includes(n.id));

  if (visibleNotices.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissedNotices(prev => [...prev, id]);
  };

  const getNoticeIcon = (type: CustomNoticeItem['type']) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'info':
      default:
        return <Megaphone className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  const getNoticeBorder = (type: CustomNoticeItem['type']) => {
    switch (type) {
      case 'alert':
        return 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20';
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20';
      case 'success':
        return 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20';
      case 'info':
      default:
        return 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20';
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {visibleNotices.map((notice) => (
        <div
          key={notice.id}
          className={`relative rounded-2xl p-3.5 sm:p-4 border backdrop-blur-md flex items-start justify-between gap-3 shadow-xs transition-all ${getNoticeBorder(notice.type)}`}
        >
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-xl bg-white dark:bg-white/10 shrink-0 shadow-2xs mt-0.5">
              {getNoticeIcon(notice.type)}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-black/5 dark:border-white/10 whitespace-nowrap">
                  {notice.tag}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  {notice.date}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {isHindi ? notice.titleHi : notice.titleEn}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isHindi ? notice.contentHi : notice.contentEn}
              </p>

              {notice.link && onNavigate && (
                <div className="pt-1">
                  <button
                    onClick={() => onNavigate(notice.link as PageRoute)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap"
                  >
                    <span className="whitespace-nowrap">{notice.linkText || (isHindi ? "आगे पढ़ें" : "Learn More")}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => handleDismiss(notice.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
