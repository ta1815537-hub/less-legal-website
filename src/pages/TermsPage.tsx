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
          <FileText className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span>{t.termsPage.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {t.termsPage.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-[#B8B3AF] pb-4 border-b border-slate-200 dark:border-white/10 font-medium">
          <span>{t.termsPage.effectiveDate}</span>
          <span>•</span>
          <span>{t.termsPage.lastUpdated}</span>
          <span>•</span>
          <span>{t.termsPage.appScope}</span>
        </div>
      </div>

      {/* Prominent Legal Advice Disclaimer in Terms */}
      <div className="rounded-3xl p-6 bg-red-500/10 dark:bg-[#C21F2F]/15 border border-[#C21F2F]/40 space-y-2 text-xs text-slate-700 dark:text-[#B8B3AF] relative z-10">
        <div className="font-bold text-sm text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span>{t.termsPage.disclaimerBannerTitle}</span>
        </div>
        <p className="leading-relaxed">
          {t.termsPage.disclaimerBannerText}
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-6 text-sm leading-relaxed relative z-10 text-slate-700 dark:text-[#B8B3AF]">
        
        {/* 1 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.termsPage.sec1Title}
          </h2>
          <p>
            {t.termsPage.sec1Text}
          </p>
        </section>

        {/* 2 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.termsPage.sec2Title}
          </h2>
          <p>
            {t.termsPage.sec2Text}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-800 dark:text-[#F5F2EE]">
            {t.termsPage.sec2Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 3 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.termsPage.sec3Title}
          </h2>
          <p>
            {t.termsPage.sec3Text}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-800 dark:text-[#F5F2EE]">
            {t.termsPage.sec3Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 4 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.termsPage.sec4Title}
          </h2>
          <p>
            {t.termsPage.sec4Text}
          </p>
        </section>

        {/* 5 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.termsPage.sec5Title}
          </h2>
          <p>
            {t.termsPage.sec5Text}
          </p>
        </section>

        {/* 6 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.termsPage.sec6Title}
          </h2>
          <p>
            {t.termsPage.sec6Text}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-800 dark:text-[#F5F2EE]">
            {t.termsPage.sec6Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 7 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.termsPage.sec7Title}
          </h2>
          <p>
            {t.termsPage.sec7Text}
          </p>
        </section>

        {/* 8 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.termsPage.sec8Title}
          </h2>
          <p>
            {t.termsPage.sec8Text}
          </p>
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('privacy')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {t.termsPage.readPrivacy}
        </button>
        <button
          onClick={() => onNavigate('refund')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {t.termsPage.readRefund}
        </button>
      </div>

    </div>
  );
};
