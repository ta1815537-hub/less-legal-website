import React from 'react';
import { PageRoute } from '../types';
import { ArrowLeft, Scale, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface DisclaimerPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const dp = translations[language].disclaimerPage;

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
          <Scale className="w-3 h-3 shrink-0" />
          <span>{dp.badge}</span>
        </span>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
          {dp.title}
        </h1>

        <p className="text-xs text-stone-400">
          {dp.scopeNotice}
        </p>
      </div>

      {/* BCI Compliance Banner */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C9A24B]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{isHindi ? 'बार काउंसिल ऑफ इंडिया (BCI) अनुपालन सूचना' : 'Bar Council of India (BCI) Compliance Notice'}</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {isHindi
            ? 'बार काउंसिल ऑफ इंडिया के नियमों के अनुसार किसी भी अधिवक्ता द्वारा विज्ञापन या प्रचार की अनुमति नहीं है। यह वेबसाइट केवल आम नागरिकों में साइबर सुरक्षा, विधिक अधिकारों और डिजिटल साक्षरता के प्रसार हेतु एक स्वतंत्र शैक्षणिक व जन-जागरूकता पहल है।'
            : 'Under the rules of the Bar Council of India, advocates are prohibited from soliciting work or advertising. This platform is strictly an independent educational and public cyber-awareness initiative dedicated to digital safety and statutory literacy.'}
        </p>
      </div>

      {/* 5 Statutory Sections */}
      <div className="space-y-5 text-xs sm:text-sm text-stone-300 leading-relaxed">
        {/* Section 1: Non-Government Declaration */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm sm:text-base">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <h2 className="text-white">{dp.nonGovTitle}</h2>
          </div>
          <p>{dp.nonGovP1}</p>
          <p>{dp.nonGovP2}</p>
          <p className="text-stone-400">{dp.nonGovP3}</p>
        </section>

        {/* Section 2 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-white">{dp.sec2Title}</h2>
          <p>{dp.sec2P1}</p>
          <p className="text-stone-400">{dp.sec2P2}</p>
        </section>

        {/* Section 3 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-white">{dp.sec3Title}</h2>
          <div className="p-3.5 rounded-xl bg-[#070B14] border-l-2 border-red-500 text-white font-semibold text-xs sm:text-sm">
            {dp.sec3Highlight}
          </div>
          <p>{dp.sec3Sub}</p>
          <p className="text-stone-400">{dp.sec3P}</p>
        </section>

        {/* Section 4 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">{dp.sec4Title}</h2>
          <p>{dp.sec4Text}</p>
        </section>

        {/* Section 5 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">{dp.sec5Title}</h2>
          <p>{dp.sec5Text}</p>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-semibold text-stone-200 hover:text-white cursor-pointer transition-colors bg-[#0D1220] border border-white/15 hover:border-red-500/40 px-4 py-2 rounded-full whitespace-nowrap"
        >
          {dp.readTerms}
        </button>

        <button
          onClick={() => onNavigate('about')}
          className="text-xs font-bold text-white bg-red-600 hover:bg-red-500 cursor-pointer transition-colors px-4 py-2 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>{dp.aboutLessLegal}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
