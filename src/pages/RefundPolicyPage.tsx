import React from 'react';
import { PageRoute } from '../types';
import { ArrowLeft, CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface RefundPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const rp = translations[language].refundPolicyPage;

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
          <CreditCard className="w-3 h-3 shrink-0" />
          <span>{rp.badge}</span>
        </span>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
          {rp.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400 font-medium">
          <span>{rp.effectiveDate}</span>
          <span>•</span>
          <span>{rp.lastUpdated}</span>
          <span>•</span>
          <span className="text-[#C9A24B]">{rp.paymentGateways}</span>
        </div>
      </div>

      {/* Important Clarification: ₹99 Payment is strictly for Less Legal Android App, NOT Website Usage */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/50 via-[#0D1220] to-[#0D1220] border border-red-500/40 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            {isHindi
              ? 'महत्वपूर्ण स्पष्टीकरण: ₹99 भुगतान केवल Less Legal Android App के लिए है'
              : 'Important Payment Clarification: ₹99 Pass Is Strictly for the Less Legal Android App'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
          {isHindi
            ? 'कृपया ध्यान दें कि ₹99 का लाइफटाइम प्रीमियम पास भुगतान केवल "Less Legal" एंड्रॉइड मोबाइल ऐप के भीतर प्रीमियम व विज्ञापन-मुक्त (Ad-Free) सुविधाओं को अनलॉक करने के लिए होता है — यह इस वेबसाइट (lesscreation.com) के उपयोग के लिए नहीं है। वेबसाइट पर उपलब्ध सभी लेख, साइबर सुरक्षा गाइड और ऑन-डिवाइस टूल्स पूरी तरह से निःशुल्क हैं।'
            : 'Please note that the ₹99 one-time Lifetime Pass payment is strictly for unlocking ad-free & premium features inside the "Less Legal" Android mobile application (synced to your registered Email / UID). It is NOT a fee for using this website (lesscreation.com) — all guides and browser utilities on the website remain completely free.'}
        </p>
      </div>

      {/* Policy Summary */}
      <div className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
          <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0" />
          <span>{rp.summaryTitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {rp.summaryText}
        </p>
      </div>

      {/* 5 Sections Content */}
      <div className="space-y-5 text-xs sm:text-sm text-stone-300 leading-relaxed">
        {/* Section 1 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-white">{rp.sec1Title}</h2>
          <div className="p-4 rounded-xl bg-[#070B14] border border-red-500/25 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-white text-xs sm:text-sm">{rp.plan1yTitle}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-[10px] font-bold text-red-400 whitespace-nowrap">
                {rp.plan1yDuration}
              </span>
            </div>
            <p className="text-xs text-stone-400">{rp.plan1yText}</p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-white">{rp.sec2Title}</h2>
          <p>{rp.sec2Sub}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#070B14] border border-white/10 space-y-1.5">
              <div className="font-bold text-white text-xs sm:text-sm">{rp.cond1Title}</div>
              <p className="text-xs text-stone-400">{rp.cond1Text}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#070B14] border border-white/10 space-y-1.5">
              <div className="font-bold text-white text-xs sm:text-sm">{rp.cond2Title}</div>
              <p className="text-xs text-stone-400">{rp.cond2Text}</p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">{rp.sec3Title}</h2>
          <p>{rp.sec3P1}</p>
          <p className="text-stone-400">{rp.sec3P2}</p>
        </section>

        {/* Section 4 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-white">{rp.sec4Title}</h2>
          <p>{rp.sec4Sub}</p>
          <ul className="space-y-2">
            {rp.sec4Bullets.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#070B14] border border-white/5 text-xs text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="pt-1">
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>{rp.sec4Button}</span>
            </button>
          </div>
        </section>

        {/* Section 5 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white">{rp.sec5Title}</h2>
          <p>{rp.sec5Text}</p>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-semibold text-stone-200 hover:text-white cursor-pointer transition-colors bg-[#0D1220] border border-white/15 hover:border-red-500/40 px-4 py-2 rounded-full whitespace-nowrap"
        >
          {rp.readTerms}
        </button>

        <button
          onClick={() => onNavigate('contact')}
          className="text-xs font-bold text-white bg-red-600 hover:bg-red-500 cursor-pointer transition-colors px-4 py-2 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>{rp.contactSupport}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
