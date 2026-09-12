import React from 'react';
import { PageRoute } from '../types';
import { FileText, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TermsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20 space-y-8 text-[#111016] dark:text-[#F5F2EE]">
      
      {/* Top Breadcrumb & Header */}
      <div className="space-y-4">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-[#16A34A] dark:hover:text-[#22C55E] inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0 text-[#16A34A] dark:text-[#22C55E]" />
          <span>{t.common.backToHome}</span>
        </button>

        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111016] dark:text-white tracking-tight">
            {t.termsPage.title}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 pb-4 border-b border-stone-200 dark:border-white/10 font-medium">
          <span>{t.termsPage.effectiveDate}</span>
          <span>•</span>
          <span>{t.termsPage.lastUpdated}</span>
          <span>•</span>
          <span>{t.termsPage.appScope}</span>
        </div>
      </div>

      {/* Prominent Legal Advice Disclaimer */}
      <div className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6 text-xs sm:text-sm">
        <div className="font-bold text-sm sm:text-base text-[#111016] dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E]" />
          <span>{t.termsPage.disclaimerBannerTitle}</span>
        </div>
        <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
          {t.termsPage.disclaimerBannerText}
        </p>
      </div>

      {/* Terms Content Sections */}
      <div className="space-y-6 text-xs sm:text-sm">
        
        {/* 1 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.termsPage.sec1Title}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.termsPage.sec1Text}
          </p>
        </section>

        {/* 2 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.termsPage.sec2Title}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.termsPage.sec2Text}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700 dark:text-stone-300 pt-1 font-normal">
            {t.termsPage.sec2Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 3 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.termsPage.sec3Title}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.termsPage.sec3Text}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700 dark:text-stone-300 pt-1 font-normal">
            {t.termsPage.sec3Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 4 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.termsPage.sec4Title}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.termsPage.sec4Text}
          </p>
        </section>

        {/* 5 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.termsPage.sec5Title}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.termsPage.sec5Text}
          </p>
        </section>

        {/* 6 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.termsPage.sec6Title}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.termsPage.sec6Text}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700 dark:text-stone-300 pt-1 font-normal">
            {t.termsPage.sec6Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 7 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.termsPage.sec7Title}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.termsPage.sec7Text}
          </p>
        </section>

        {/* 8 */}
        <section className="py-2 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.termsPage.sec8Title}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.termsPage.sec8Text}
          </p>
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-8 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-stone-600 dark:text-stone-400">
        <button
          onClick={() => onNavigate('privacy')}
          className="hover:text-[#16A34A] dark:hover:text-[#22C55E] cursor-pointer transition-colors hover:underline inline-flex items-center gap-1"
        >
          <span>{t.termsPage.readPrivacy}</span>
          <span>→</span>
        </button>
        <button
          onClick={() => onNavigate('refund')}
          className="hover:text-[#16A34A] dark:hover:text-[#22C55E] cursor-pointer transition-colors hover:underline inline-flex items-center gap-1"
        >
          <span>{t.termsPage.readRefund}</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
};
