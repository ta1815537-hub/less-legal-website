import React from 'react';
import { PageRoute } from '../types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RefundPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20 space-y-8 text-[#111016] dark:text-[#F5F2EE]">
      
      {/* Top Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-[#111016] dark:text-white tracking-tight">
          {t.refundPolicyPage.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 pb-4 border-b border-stone-200 dark:border-white/10 font-medium">
          <span>{t.refundPolicyPage.effectiveDate}</span>
          <span>•</span>
          <span>{t.refundPolicyPage.lastUpdated}</span>
          <span>•</span>
          <span>{t.refundPolicyPage.paymentGateways}</span>
        </div>
      </div>

      {/* Overview Notice */}
      <div className="py-2 space-y-2 text-xs sm:text-sm border-b border-stone-200 dark:border-white/10 pb-6">
        <div className="font-bold text-sm sm:text-base text-[#111016] dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E]" />
          <span>{t.refundPolicyPage.summaryTitle}</span>
        </div>
        <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
          {t.refundPolicyPage.summaryText}
        </p>
      </div>

      {/* Refund Guidelines by Plan */}
      <div className="py-2 space-y-3 border-b border-stone-200 dark:border-white/10 pb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#111016] dark:text-white pb-1">
          {t.refundPolicyPage.sec1Title}
        </h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#111016] dark:text-white text-base">{t.refundPolicyPage.plan1yTitle}</h3>
            <span className="text-[11px] font-bold text-[#16A34A] dark:text-[#22C55E]">
              {t.refundPolicyPage.plan1yDuration}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.refundPolicyPage.plan1yText}
          </p>
        </div>
      </div>

      {/* Eligible Refund Scenarios */}
      <div className="py-2 space-y-3 border-b border-stone-200 dark:border-white/10 pb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#111016] dark:text-white pb-1">
          {t.refundPolicyPage.sec2Title}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          {t.refundPolicyPage.sec2Sub}
        </p>

        <div className="space-y-3 text-xs sm:text-sm pt-1">
          <div className="flex items-start gap-3 py-1">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#111016] dark:text-white font-bold block mb-0.5">{t.refundPolicyPage.cond1Title}</strong>
              <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed font-normal">{t.refundPolicyPage.cond1Text}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-1">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#111016] dark:text-white font-bold block mb-0.5">{t.refundPolicyPage.cond2Title}</strong>
              <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed font-normal">{t.refundPolicyPage.cond2Text}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="py-2 space-y-3 border-b border-stone-200 dark:border-white/10 pb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#111016] dark:text-white pb-1">
          {t.refundPolicyPage.sec3Title}
        </h2>
        <div className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
          <p>{t.refundPolicyPage.sec3P1}</p>
          <p>{t.refundPolicyPage.sec3P2}</p>
        </div>
      </div>

      {/* How to Request Refund */}
      <div className="py-2 space-y-3 border-b border-stone-200 dark:border-white/10 pb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#111016] dark:text-white pb-1">
          {t.refundPolicyPage.sec4Title}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          {t.refundPolicyPage.sec4Sub}
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-normal">
          {t.refundPolicyPage.sec4Bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-2.5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>{t.refundPolicyPage.sec4Button}</span>
          </button>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="py-2 space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[#111016] dark:text-white pb-1">
          {t.refundPolicyPage.sec5Title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
          {t.refundPolicyPage.sec5Text}
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-stone-600 dark:text-stone-400">
        <button
          onClick={() => onNavigate('terms')}
          className="hover:text-[#16A34A] dark:hover:text-[#22C55E] cursor-pointer transition-colors hover:underline inline-flex items-center gap-1"
        >
          <span>{t.refundPolicyPage.readTerms}</span>
          <span>→</span>
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className="hover:text-[#16A34A] dark:hover:text-[#22C55E] cursor-pointer transition-colors hover:underline inline-flex items-center gap-1"
        >
          <span>{t.refundPolicyPage.contactSupport}</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
};
