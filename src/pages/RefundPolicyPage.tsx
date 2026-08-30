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
          <RefreshCw className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span>{t.refundPolicyPage.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {t.refundPolicyPage.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-[#B8B3AF] pb-4 border-b border-slate-200 dark:border-white/10 font-medium">
          <span>{t.refundPolicyPage.effectiveDate}</span>
          <span>•</span>
          <span>{t.refundPolicyPage.lastUpdated}</span>
          <span>•</span>
          <span>{t.refundPolicyPage.paymentGateways}</span>
        </div>
      </div>

      {/* Overview Notice */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-[#B8B3AF] relative z-10">
        <div className="font-bold text-sm text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-[#D8BD82]" />
          <span>{t.refundPolicyPage.summaryTitle}</span>
        </div>
        <p className="leading-relaxed">
          {t.refundPolicyPage.summaryText}
        </p>
      </div>

      {/* Refund Guidelines by Plan */}
      <div className="space-y-6 relative z-10 text-slate-700 dark:text-[#B8B3AF]">
        <h2 className="text-xl font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec1Title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Plan 1 */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-[#F5F2EE] text-sm">{t.refundPolicyPage.plan3mTitle}</h3>
              <span className="text-[11px] font-bold text-amber-900 dark:text-[#D8BD82] bg-amber-500/10 dark:bg-[#D8BD82]/15 px-2.5 py-0.5 rounded-full border border-amber-600/30 dark:border-[#D8BD82]/30">
                {t.refundPolicyPage.plan3mDuration}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
              {t.refundPolicyPage.plan3mText}
            </p>
          </div>

          {/* Plan 2 */}
          <div className="rounded-3xl p-5 bg-red-500/10 dark:bg-[#C21F2F]/15 border border-[#C21F2F]/40 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-[#F5F2EE] text-sm">{t.refundPolicyPage.plan1yTitle}</h3>
              <span className="text-[11px] font-bold text-amber-900 dark:text-[#D8BD82] bg-amber-500/20 dark:bg-[#D8BD82]/20 px-2.5 py-0.5 rounded-full border border-amber-600/40 dark:border-[#D8BD82]/40">
                {t.refundPolicyPage.plan1yDuration}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
              {t.refundPolicyPage.plan1yText}
            </p>
          </div>

        </div>
      </div>

      {/* Eligible Refund Scenarios */}
      <div className="space-y-4 relative z-10 text-slate-700 dark:text-[#B8B3AF]">
        <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec2Title}
        </h2>
        <p className="text-xs text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
          {t.refundPolicyPage.sec2Sub}
        </p>

        <div className="space-y-3 text-xs text-slate-700 dark:text-[#B8B3AF]">
          <div className="flex items-start gap-2.5 p-4 glass-panel rounded-2xl border border-slate-200 dark:border-white/10">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-[#D8BD82] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-[#F5F2EE] block mb-0.5">{t.refundPolicyPage.cond1Title}</strong>
              {t.refundPolicyPage.cond1Text}
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-4 glass-panel rounded-2xl border border-slate-200 dark:border-white/10">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-[#D8BD82] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-[#F5F2EE] block mb-0.5">{t.refundPolicyPage.cond2Title}</strong>
              {t.refundPolicyPage.cond2Text}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="space-y-4 relative z-10 text-slate-700 dark:text-[#B8B3AF]">
        <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec3Title}
        </h2>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-[#B8B3AF]">
          <p>
            {t.refundPolicyPage.sec3P1}
          </p>
          <p>
            {t.refundPolicyPage.sec3P2}
          </p>
        </div>
      </div>

      {/* How to Request Refund */}
      <div className="space-y-4 relative z-10 text-slate-700 dark:text-[#B8B3AF]">
        <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec4Title}
        </h2>
        <p className="text-xs text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
          {t.refundPolicyPage.sec4Sub}
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-800 dark:text-[#F5F2EE]">
          {t.refundPolicyPage.sec4Bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-3 rounded-xl btn-crimson text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            {t.refundPolicyPage.sec4Button}
          </button>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="space-y-3 relative z-10 text-slate-700 dark:text-[#B8B3AF]">
        <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-2">
          {t.refundPolicyPage.sec5Title}
        </h2>
        <p className="text-xs text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
          {t.refundPolicyPage.sec5Text}
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {t.refundPolicyPage.readTerms}
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {t.refundPolicyPage.contactSupport}
        </button>
      </div>

    </div>
  );
};
