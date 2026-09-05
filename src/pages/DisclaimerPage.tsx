import React from 'react';
import { PageRoute } from '../types';
import { Scale, ArrowLeft, AlertTriangle } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface DisclaimerPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

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
            <Scale className="w-3.5 h-3.5 fill-current" />
            <span>{t.disclaimerPage.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.disclaimerPage.title}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200/80 dark:border-white/10 font-medium">
          <span>{t.disclaimerPage.scopeNotice}</span>
        </div>
      </div>

      {/* Non-Government Status Box */}
      <div className="rounded-[28px] p-6 sm:p-8 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-4 relative z-10 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {t.disclaimerPage.nonGovTitle}
          </h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          <p>
            <strong className="text-slate-900 dark:text-white font-bold">{t.disclaimerPage.nonGovP1}</strong>
          </p>
          <p>
            {t.disclaimerPage.nonGovP2}
          </p>
          <p className="font-bold text-amber-800 dark:text-amber-400">
            {t.disclaimerPage.nonGovP3}
          </p>
        </div>
      </div>

      {/* Main Disclaimer Points */}
      <div className="space-y-6 text-sm leading-relaxed relative z-10 text-slate-600 dark:text-slate-300">
        
        {/* Strict Liability Disclaimer */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {language === 'hi' ? 'डेटा और कानूनी दायित्व अस्वीकरण' : 'Data & Legal Liability Disclaimer'}
          </h2>
          <p className="font-semibold text-slate-900 dark:text-white leading-relaxed">
            {t.footer.strictLiabilityDisclaimer}
          </p>
        </section>

        {/* Point 2 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.disclaimerPage.sec2Title}
          </h2>
          <p className="font-medium">
            {t.disclaimerPage.sec2P1}
          </p>
          <p className="font-bold text-slate-900 dark:text-white">
            {t.disclaimerPage.sec2P2}
          </p>
        </section>

        {/* Point 3 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.disclaimerPage.sec3Title}
          </h2>
          <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <p className="font-bold text-slate-900 dark:text-white">
              {t.disclaimerPage.sec3Highlight}
            </p>
            <p>
              {t.disclaimerPage.sec3Sub}
            </p>
          </div>
          <p className="font-medium">
            {t.disclaimerPage.sec3P}
          </p>
        </section>

        {/* Point 4 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.disclaimerPage.sec4Title}
          </h2>
          <p className="font-medium">
            {t.disclaimerPage.sec4Text}
          </p>
        </section>

        {/* Point 5 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {t.disclaimerPage.sec5Title}
          </h2>
          <p className="font-medium">
            {t.disclaimerPage.sec5Text}
          </p>
        </section>

      </div>

      {/* Jurisdiction Clause (Red Banner) */}
      <div className="relative z-10 mt-10 rounded-[28px] overflow-hidden shadow-xl border border-red-500/30">
        <div className="bg-gradient-to-r from-[#B51F2E] via-[#E02636] to-[#B51F2E] p-6 sm:p-8 text-center text-white">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-3 max-w-3xl mx-auto">
              <p className="text-sm sm:text-base font-bold text-white tracking-wide leading-relaxed">
                {language === 'hi' ? 'अधिकार क्षेत्र: सभी विवाद माननीय उच्च न्यायालय इलाहाबाद के अनन्य क्षेत्राधिकार के अधीन होंगे।' : "JURISDICTION: All disputes shall be subject to the exclusive jurisdiction of the Hon'ble High Court of Judicature at Allahabad."}
              </p>
              <div className="w-16 h-px bg-white/30 mx-auto"></div>
              <p className="text-xs sm:text-sm font-medium text-white/90 tracking-wide leading-relaxed">
                {language === 'hi' ? "JURISDICTION: All disputes shall be subject to the exclusive jurisdiction of the Hon'ble High Court of Judicature at Allahabad." : 'अधिकार क्षेत्र: सभी विवाद माननीय उच्च न्यायालय इलाहाबाद के अनन्य क्षेत्राधिकार के अधीन होंगे।'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-8 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10 mt-8">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E02636] cursor-pointer transition-colors px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          {t.disclaimerPage.readTerms}
        </button>
        <button
          onClick={() => onNavigate('about')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E02636] cursor-pointer transition-colors px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          {t.disclaimerPage.aboutLessLegal}
        </button>
      </div>

    </div>
  );
};
