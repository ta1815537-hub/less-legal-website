import React from 'react';
import { PageRoute } from '../types';
import { FileText, ArrowLeft, AlertTriangle } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface TermsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-8 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Top Breadcrumb & Title */}
      <div className="space-y-4 relative z-10 text-center sm:text-left">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-blue-500" />
          <span>{t.common.backToHome}</span>
        </button>

        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs mb-3">
            <FileText className="w-3.5 h-3.5 fill-current" />
            <span>{t.termsPage.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.termsPage.title}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200/80 dark:border-white/10 font-medium">
          <span>{t.termsPage.effectiveDate}</span>
          <span>•</span>
          <span>{t.termsPage.lastUpdated}</span>
          <span>•</span>
          <span>{t.termsPage.appScope}</span>
        </div>
      </div>

      {/* Prominent Legal Advice Disclaimer in Terms */}
      <div className="rounded-[28px] p-6 sm:p-8 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 relative z-10 shadow-lg backdrop-blur-xl">
        <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#E02636]" />
          <span>{t.termsPage.disclaimerBannerTitle}</span>
        </div>
        <p className="leading-relaxed font-medium">
          {t.termsPage.disclaimerBannerText}
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-6 text-sm leading-relaxed relative z-10 text-slate-600 dark:text-slate-300">
        
        {/* 1 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.termsPage.sec1Title}
          </h2>
          <p className="font-medium">
            {t.termsPage.sec1Text}
          </p>
        </section>

        {/* 2 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.termsPage.sec2Title}
          </h2>
          <p className="font-medium">
            {t.termsPage.sec2Text}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-800 dark:text-slate-200">
            {t.termsPage.sec2Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 3 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.termsPage.sec3Title}
          </h2>
          <p className="font-medium">
            {t.termsPage.sec3Text}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-800 dark:text-slate-200 font-medium">
            {t.termsPage.sec3Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 4 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.termsPage.sec4Title}
          </h2>
          <p className="font-medium">
            {t.termsPage.sec4Text}
          </p>
        </section>

        {/* 5 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.termsPage.sec5Title}
          </h2>
          <p className="font-medium">
            {t.termsPage.sec5Text}
          </p>
        </section>

        {/* 6 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.termsPage.sec6Title}
          </h2>
          <p className="font-medium">
            {t.termsPage.sec6Text}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-800 dark:text-slate-200 font-medium">
            {t.termsPage.sec6Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 7 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.termsPage.sec7Title}
          </h2>
          <p className="font-medium">
            {t.termsPage.sec7Text}
          </p>
        </section>

        {/* 8 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.termsPage.sec8Title}
          </h2>
          <p className="font-medium">
            {t.termsPage.sec8Text}
          </p>
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('privacy')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E02636] cursor-pointer transition-colors px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          {t.termsPage.readPrivacy}
        </button>
        <button
          onClick={() => onNavigate('refund')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E02636] cursor-pointer transition-colors px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          {t.termsPage.readRefund}
        </button>
      </div>

    </div>
  );
};
