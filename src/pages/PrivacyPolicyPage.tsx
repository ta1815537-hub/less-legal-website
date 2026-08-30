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
          <Shield className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span>{t.privacyPolicyPage.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {t.privacyPolicyPage.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-[#B8B3AF] pb-4 border-b border-slate-200 dark:border-white/10 font-medium">
          <span>{t.privacyPolicyPage.effectiveDate}</span>
          <span>•</span>
          <span>{t.privacyPolicyPage.lastUpdated}</span>
          <span>•</span>
          <span>{t.privacyPolicyPage.appScope}</span>
        </div>
      </div>

      {/* Summary Highlight Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-[#B8B3AF] relative z-10">
        <div className="font-bold text-sm text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 dark:text-[#D8BD82]" />
          <span>{t.privacyPolicyPage.summaryTitle}</span>
        </div>
        <p className="leading-relaxed">
          {t.privacyPolicyPage.summaryText}
        </p>
      </div>

      {/* Policy Content Sections */}
      <div className="space-y-6 text-sm leading-relaxed relative z-10 text-slate-700 dark:text-[#B8B3AF]">
        
        {/* Section 1 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec1Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec1P1}
          </p>
          <p>
            {t.privacyPolicyPage.sec1P2}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec2Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec2P1}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-800 dark:text-[#F5F2EE]">
            {t.privacyPolicyPage.sec2Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec3Title}
          </h2>
          <div className="bg-amber-500/10 dark:bg-white/5 p-4 rounded-2xl border border-amber-600/30 dark:border-white/10 space-y-2">
            <div className="font-bold text-slate-900 dark:text-[#F5F2EE]">{t.privacyPolicyPage.sec3Highlight}</div>
            <p className="text-xs text-slate-700 dark:text-[#B8B3AF]">
              {t.privacyPolicyPage.sec3Text}
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec4Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec4Text}
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec5Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec5Text}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-800 dark:text-[#F5F2EE]">
            {t.privacyPolicyPage.sec5Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec6Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec6Text}
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec7Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec7Text}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-800 dark:text-[#F5F2EE]">
            {t.privacyPolicyPage.sec7Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec8Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec8Text}
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec9Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec9Text}
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec10Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec10Text}
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-3 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
            {t.privacyPolicyPage.sec11Title}
          </h2>
          <p>
            {t.privacyPolicyPage.sec11Text}
          </p>
          {hasEmail && (
            <p className="pt-2">
              <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-amber-800 dark:text-[#D8BD82] font-bold underline">
                {SITE_CONFIG.supportEmail}
              </a>
            </p>
          )}
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {t.privacyPolicyPage.readTerms}
        </button>
        <button
          onClick={() => onNavigate('refund')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {t.privacyPolicyPage.readRefund}
        </button>
      </div>

    </div>
  );
};
