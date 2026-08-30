import React from 'react';
import { PageRoute } from '../types';
import { Scale, ArrowLeft, AlertTriangle } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface DisclaimerPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 space-y-8 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />
      
      {/* Top Breadcrumb & Title */}
      <div className="space-y-4 relative z-10 text-center sm:text-left">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3 py-1 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span>{t.common.backToHome}</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-900 dark:text-[#D8BD82] text-xs font-bold">
          <Scale className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span>{t.disclaimerPage.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {t.disclaimerPage.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-[#B8B3AF] pb-4 border-b border-slate-200 dark:border-white/10 font-medium">
          <span>{t.disclaimerPage.scopeNotice}</span>
        </div>
      </div>

      {/* Non-Government Status Box */}
      <div className="rounded-3xl p-6 sm:p-8 bg-red-500/10 dark:bg-[#C21F2F]/15 border border-[#C21F2F]/40 space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C21F2F] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F5F2EE]">
            {t.disclaimerPage.nonGovTitle}
          </h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-[#F5F2EE]">{t.disclaimerPage.nonGovP1}</strong>
          </p>
          <p>
            {t.disclaimerPage.nonGovP2}
          </p>
          <p className="font-medium text-amber-900 dark:text-[#D8BD82]">
            {t.disclaimerPage.nonGovP3}
          </p>
        </div>
      </div>

      {/* Main Disclaimer Points */}
      <div className="space-y-6 text-sm leading-relaxed relative z-10 text-slate-700 dark:text-[#B8B3AF]">
        
        {/* Point 2 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.disclaimerPage.sec2Title}
          </h2>
          <p>
            {t.disclaimerPage.sec2P1}
          </p>
          <p className="font-medium text-slate-900 dark:text-[#F5F2EE]">
            {t.disclaimerPage.sec2P2}
          </p>
        </section>

        {/* Point 3 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.disclaimerPage.sec3Title}
          </h2>
          <div className="p-4 bg-amber-500/10 dark:bg-white/5 rounded-2xl border border-amber-600/30 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-[#B8B3AF]">
            <p className="font-semibold text-slate-900 dark:text-[#F5F2EE]">
              {t.disclaimerPage.sec3Highlight}
            </p>
            <p>
              {t.disclaimerPage.sec3Sub}
            </p>
          </div>
          <p>
            {t.disclaimerPage.sec3P}
          </p>
        </section>

        {/* Point 4 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.disclaimerPage.sec4Title}
          </h2>
          <p>
            {t.disclaimerPage.sec4Text}
          </p>
        </section>

        {/* Point 5 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.disclaimerPage.sec5Title}
          </h2>
          <p>
            {t.disclaimerPage.sec5Text}
          </p>
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {t.disclaimerPage.readTerms}
        </button>
        <button
          onClick={() => onNavigate('about')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {t.disclaimerPage.aboutLessLegal}
        </button>
      </div>

    </div>
  );
};
