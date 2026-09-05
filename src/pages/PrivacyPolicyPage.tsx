import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface PrivacyPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-8 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Top Breadcrumb & Title */}
      <div className="space-y-4 relative z-10 text-center sm:text-left">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#E02636]" />
          <span>{t.common.backToHome}</span>
        </button>

        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/40 text-[#E02636] dark:text-red-400 text-xs font-black tracking-wider uppercase shadow-2xs mb-3">
            <Shield className="w-3.5 h-3.5 fill-current" />
            <span>{t.privacyPolicyPage.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.privacyPolicyPage.title}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200/80 dark:border-white/10 font-medium">
          <span>{t.privacyPolicyPage.effectiveDate}</span>
          <span>•</span>
          <span>{t.privacyPolicyPage.lastUpdated}</span>
          <span>•</span>
          <span>{t.privacyPolicyPage.appScope}</span>
        </div>
      </div>

      {/* Summary Highlight Box */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 relative z-10 backdrop-blur-xl">
        <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#E02636]" />
          <span>{t.privacyPolicyPage.summaryTitle}</span>
        </div>
        <p className="leading-relaxed font-medium">
          {t.privacyPolicyPage.summaryText}
        </p>
      </div>

      {/* Policy Content Sections */}
      <div className="space-y-6 text-sm leading-relaxed relative z-10 text-slate-600 dark:text-slate-300">
        
        {/* Section 1 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec1Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec1P1}
          </p>
          <p className="font-medium">
            {t.privacyPolicyPage.sec1P2}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec2Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec2P1}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-800 dark:text-slate-200 font-medium">
            {t.privacyPolicyPage.sec2Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec3Title}
          </h2>
          <div className="bg-amber-50/80 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-800/40 space-y-2">
            <div className="font-black text-slate-900 dark:text-white text-sm">{t.privacyPolicyPage.sec3Highlight}</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {t.privacyPolicyPage.sec3Text}
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec4Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec4Text}
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec5Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec5Text}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-800 dark:text-slate-200 font-medium">
            {t.privacyPolicyPage.sec5Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec6Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec6Text}
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec7Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec7Text}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-800 dark:text-slate-200 font-medium">
            {t.privacyPolicyPage.sec7Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec8Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec8Text}
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec9Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec9Text}
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec10Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec10Text}
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec11Title}
          </h2>
          <p className="font-medium">
            {t.privacyPolicyPage.sec11Text}
          </p>
          {hasEmail && (
            <p className="pt-2">
              <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-[#E02636] font-bold hover:underline">
                {SITE_CONFIG.supportEmail}
              </a>
            </p>
          )}
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E02636] cursor-pointer transition-colors px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          {t.privacyPolicyPage.readTerms}
        </button>
        <button
          onClick={() => onNavigate('refund')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E02636] cursor-pointer transition-colors px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          {t.privacyPolicyPage.readRefund}
        </button>
      </div>

    </div>
  );
};
