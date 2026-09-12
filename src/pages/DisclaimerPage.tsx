import React from 'react';
import { PageRoute } from '../types';
import { Scale, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DisclaimerPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20 space-y-8 text-[#111016] dark:text-[#F5F2EE]">
      
      {/* Top Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-[#111016] dark:text-white tracking-tight">
          {t.disclaimerPage.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400 pb-4 border-b border-stone-200 dark:border-white/10 font-medium">
          <span>{t.disclaimerPage.scopeNotice}</span>
        </div>
      </div>

      {/* Non-Government Status Box */}
      <div className="py-2 space-y-3 border-b border-stone-200 dark:border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white">
            {t.disclaimerPage.nonGovTitle}
          </h2>
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
          <p>
            <strong className="text-[#111016] dark:text-white font-bold">{t.disclaimerPage.nonGovP1}</strong>
          </p>
          <p>
            {t.disclaimerPage.nonGovP2}
          </p>
          <p className="font-semibold text-[#16A34A] dark:text-[#22C55E]">
            {t.disclaimerPage.nonGovP3}
          </p>
        </div>
      </div>

      {/* Main Disclaimer Points */}
      <div className="space-y-6">
        
        {/* Strict Liability Disclaimer */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {language === 'hi' ? 'डेटा और कानूनी दायित्व अस्वीकरण' : 'Data & Legal Liability Disclaimer'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.footer.strictLiabilityDisclaimer}
          </p>
        </section>

        {/* Point 2 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.disclaimerPage.sec2Title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.disclaimerPage.sec2P1}
          </p>
          <p className="text-xs sm:text-sm font-bold text-[#111016] dark:text-white">
            {t.disclaimerPage.sec2P2}
          </p>
        </section>

        {/* Point 3 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.disclaimerPage.sec3Title}
          </h2>
          <div className="py-1 space-y-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            <p className="font-bold text-[#111016] dark:text-white">
              {t.disclaimerPage.sec3Highlight}
            </p>
            <p className="leading-relaxed font-normal">
              {t.disclaimerPage.sec3Sub}
            </p>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.disclaimerPage.sec3P}
          </p>
        </section>

        {/* Point 4 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.disclaimerPage.sec4Title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.disclaimerPage.sec4Text}
          </p>
        </section>

        {/* Point 5 */}
        <section className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white pb-1">
            {t.disclaimerPage.sec5Title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {t.disclaimerPage.sec5Text}
          </p>
        </section>

      </div>

      {/* Jurisdiction Clause (Editorial Background Section) */}
      <div className="py-4 border-b border-stone-200 dark:border-white/10 pb-6 space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
            {language === 'hi' ? 'अधिकार क्षेत्र' : 'JURISDICTION CLAUSE'}
          </h3>
        </div>
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-bold text-[#111016] dark:text-white leading-relaxed">
            {language === 'hi' 
              ? 'अधिकार क्षेत्र: सभी विवाद माननीय उच्च न्यायालय इलाहाबाद के अनन्य क्षेत्राधिकार के अधीन होंगे।' 
              : "JURISDICTION: All disputes shall be subject to the exclusive jurisdiction of the Hon'ble High Court of Judicature at Allahabad."}
          </p>
          <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-normal">
            {language === 'hi' 
              ? "JURISDICTION: All disputes shall be subject to the exclusive jurisdiction of the Hon'ble High Court of Judicature at Allahabad." 
              : 'अधिकार क्षेत्र: सभी विवाद माननीय उच्च न्यायालय इलाहाबाद के अनन्य क्षेत्राधिकार के अधीन होंगे।'}
          </p>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-8 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-stone-600 dark:text-stone-400">
        <button
          onClick={() => onNavigate('terms')}
          className="hover:text-[#16A34A] dark:hover:text-[#22C55E] cursor-pointer transition-colors hover:underline inline-flex items-center gap-1"
        >
          <span>{t.disclaimerPage.readTerms}</span>
          <span>→</span>
        </button>
        <button
          onClick={() => onNavigate('about')}
          className="hover:text-[#16A34A] dark:hover:text-[#22C55E] cursor-pointer transition-colors hover:underline inline-flex items-center gap-1"
        >
          <span>{t.disclaimerPage.aboutLessLegal}</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
};
