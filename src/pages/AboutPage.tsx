import React from 'react';
import { PageRoute } from '../types';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Scale,
  CheckCircle2,
  ShieldAlert,
  BookOpen,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const ab = translations[language].about;
  const hm = translations[language].home;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-8 text-white">
      {/* Back Button */}
      <div className="flex items-center justify-start">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-300 hover:text-red-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>
      </div>

      {/* 1. Header */}
      <section className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
          {ab.badge}
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
          {ab.title}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {ab.subtitle}
        </p>
      </section>

      {/* 2. Official Independence & Non-Government Declaration */}
      <section className="p-6 sm:p-7 rounded-3xl bg-amber-500/10 border border-amber-500/25 space-y-3 shadow-lg">
        <div className="flex items-center gap-2.5 text-[#C9A24B]">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-white">
            {ab.declarationTitle}
          </h2>
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <p>{ab.declarationP1}</p>
          <p className="text-stone-400">{ab.declarationP2}</p>
        </div>
      </section>

      {/* 3. What is Less Legal & On-Device Privacy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#0D1220] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
            <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">{ab.whatIsTitle}</h2>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {ab.whatIsDesc}
          </p>

          <ul className="space-y-2 pt-1">
            <li className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070B14] border border-white/5 text-xs text-stone-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{ab.whatIsItem1}</span>
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070B14] border border-white/5 text-xs text-stone-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{ab.whatIsItem2}</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-[#0D1220] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#C9A24B]/15 border border-[#C9A24B]/30 text-[#C9A24B] flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">{ab.privacyTitle}</h2>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {ab.privacyDesc}
          </p>

          <ul className="space-y-2 pt-1">
            <li className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070B14] border border-white/5 text-xs text-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
              <span>{ab.privacyItem1}</span>
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070B14] border border-white/5 text-xs text-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
              <span>{ab.privacyItem2}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Our Core Principles */}
      <section className="space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {ab.principlesTitle}
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">{ab.principlesSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">{ab.p1Title}</h3>
            <p className="text-xs text-stone-400 leading-relaxed">{ab.p1Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#C9A24B]/15 border border-[#C9A24B]/30 text-[#C9A24B] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">{ab.p2Title}</h3>
            <p className="text-xs text-stone-400 leading-relaxed">{ab.p2Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">{ab.p3Title}</h3>
            <p className="text-xs text-stone-400 leading-relaxed">{ab.p3Desc}</p>
          </div>
        </div>
      </section>

      {/* 5. Why Less Creation (5 Brand Philosophy Pillars) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1220] border border-white/10 space-y-5 shadow-xl">
        <div className="space-y-1 border-b border-white/10 pb-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400">
            {hm.whyBadge}
          </span>
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {hm.whyTitle}
          </h2>
          <p className="text-xs text-stone-400">{hm.whySubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hm.whyPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#070B14] border border-white/10 space-y-1.5"
            >
              <div className="text-[10px] font-mono font-bold text-[#C9A24B]">
                {pillar.label}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                {pillar.title}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/30 to-[#070B14] border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-bold text-white">
              {hm.whyClosingTitle}
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {hm.whyClosingText}
            </p>
          </div>

          <button
            onClick={() => onNavigate('founder')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            <span>{isHindi ? 'संस्थापक विज़न पढ़ें' : 'Read Founder Vision'}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </section>
    </div>
  );
};
