import React from 'react';
import { PageRoute } from '../types';
import { RefreshCw, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface RefundPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
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
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#E02636]" />
          <span>{t.common.backToHome}</span>
        </button>

        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/40 text-[#E02636] dark:text-red-400 text-xs font-black tracking-wider uppercase shadow-2xs mb-3">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.refundPolicyPage.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.refundPolicyPage.title}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200/80 dark:border-white/10 font-medium">
          <span>{t.refundPolicyPage.effectiveDate}</span>
          <span>•</span>
          <span>{t.refundPolicyPage.lastUpdated}</span>
          <span>•</span>
          <span>{t.refundPolicyPage.paymentGateways}</span>
        </div>
      </div>

      {/* Overview Notice */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 relative z-10 backdrop-blur-xl">
        <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#E02636]" />
          <span>{t.refundPolicyPage.summaryTitle}</span>
        </div>
        <p className="leading-relaxed font-medium">
          {t.refundPolicyPage.summaryText}
        </p>
      </div>

      {/* Refund Guidelines by Plan */}
      <div className="space-y-6 relative z-10 text-slate-600 dark:text-slate-300">
        <h2 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec1Title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Plan 1 */}
          <div className="p-6 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white text-base">{t.refundPolicyPage.plan3mTitle}</h3>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
                {t.refundPolicyPage.plan3mDuration}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {t.refundPolicyPage.plan3mText}
            </p>
          </div>

          {/* Plan 2 */}
          <div className="p-6 rounded-[28px] bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40 shadow-xl space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white text-base">{t.refundPolicyPage.plan1yTitle}</h3>
              <span className="text-[11px] font-bold text-[#E02636] dark:text-red-400 bg-red-100 dark:bg-red-950/50 px-3 py-1 rounded-full border border-red-200 dark:border-red-900">
                {t.refundPolicyPage.plan1yDuration}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {t.refundPolicyPage.plan1yText}
            </p>
          </div>

        </div>
      </div>

      {/* Eligible Refund Scenarios */}
      <div className="space-y-4 relative z-10 text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec2Title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {t.refundPolicyPage.sec2Sub}
        </p>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-sm backdrop-blur-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white font-bold block mb-1">{t.refundPolicyPage.cond1Title}</strong>
              <p className="font-medium text-xs leading-relaxed">{t.refundPolicyPage.cond1Text}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-sm backdrop-blur-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white font-bold block mb-1">{t.refundPolicyPage.cond2Title}</strong>
              <p className="font-medium text-xs leading-relaxed">{t.refundPolicyPage.cond2Text}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="space-y-4 relative z-10 text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec3Title}
        </h2>
        <div className="p-6 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 backdrop-blur-xl font-medium">
          <p>
            {t.refundPolicyPage.sec3P1}
          </p>
          <p>
            {t.refundPolicyPage.sec3P2}
          </p>
        </div>
      </div>

      {/* How to Request Refund */}
      <div className="space-y-4 relative z-10 text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec4Title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {t.refundPolicyPage.sec4Sub}
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
          {t.refundPolicyPage.sec4Bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-full bg-[#E02636] hover:bg-[#c91e2e] text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>{t.refundPolicyPage.sec4Button}</span>
          </button>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="space-y-3 relative z-10 text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec5Title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {t.refundPolicyPage.sec5Text}
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E02636] cursor-pointer transition-colors px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          {t.refundPolicyPage.readTerms}
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E02636] cursor-pointer transition-colors px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          {t.refundPolicyPage.contactSupport}
        </button>
      </div>

    </div>
  );
};
