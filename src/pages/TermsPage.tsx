import React from 'react';
import { PageRoute } from '../types';
import { ArrowLeft, ShieldAlert, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface TermsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const tp = translations[language].termsPage;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-7 text-white">
      {/* Back Button */}
      <div className="flex items-center justify-start">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-300 hover:text-red-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{isHindi ? 'होमपेज पर लौटें' : 'Back to Home'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-3 border-b border-white/10 pb-5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
          <FileText className="w-3 h-3 shrink-0" />
          <span>{tp.badge}</span>
        </span>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
          {tp.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400 font-medium">
          <span>{tp.effectiveDate}</span>
          <span>•</span>
          <span>{tp.lastUpdated}</span>
          <span>•</span>
          <span className="text-[#C9A24B]">{tp.appScope}</span>
        </div>
      </div>

      {/* Informational & No Legal Advice Banner */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C9A24B]">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{tp.disclaimerBannerTitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {tp.disclaimerBannerText}
        </p>
      </div>

      {/* 8 Sections Content */}
      <div className="space-y-5 text-xs sm:text-sm text-stone-300 leading-relaxed">
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">{tp.sec1Title}</h2>
          <p>{tp.sec1Text}</p>
        </section>

        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-white">{tp.sec2Title}</h2>
          <p>{tp.sec2Text}</p>
          <ul className="space-y-2">
            {tp.sec2Bullets.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#070B14] border border-white/5 text-xs text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-white">{tp.sec3Title}</h2>
          <p>{tp.sec3Text}</p>
          <ul className="space-y-2">
            {tp.sec3Bullets.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#070B14] border border-white/5 text-xs text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">{tp.sec4Title}</h2>
          <p>{tp.sec4Text}</p>
        </section>

        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">{tp.sec5Title}</h2>
          <p>{tp.sec5Text}</p>
        </section>

        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-white">{tp.sec6Title}</h2>
          <p>{tp.sec6Text}</p>
          <ul className="space-y-2">
            {tp.sec6Bullets.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#070B14] border border-white/5 text-xs text-stone-300">
                <span className="text-red-400 font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">{tp.sec7Title}</h2>
          <p>{tp.sec7Text}</p>
        </section>

        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">{tp.sec8Title}</h2>
          <p>{tp.sec8Text}</p>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('privacy')}
          className="text-xs font-semibold text-stone-200 hover:text-white cursor-pointer transition-colors bg-[#0D1220] border border-white/15 hover:border-red-500/40 px-4 py-2 rounded-full whitespace-nowrap"
        >
          {tp.readPrivacy}
        </button>

        <button
          onClick={() => onNavigate('refund')}
          className="text-xs font-bold text-white bg-red-600 hover:bg-red-500 cursor-pointer transition-colors px-4 py-2 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>{tp.readRefund}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
