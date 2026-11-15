import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import {
  ShieldCheck,
  ArrowLeft,
  Scale,
  ArrowRight,
  CheckCircle2,
  Quote,
  Sparkles,
  Compass,
  Layers,
  Info,
  BookOpen
} from 'lucide-react';
import founderPortrait from '../assets/images/founder_portrait.jpg';

interface FounderPageProps {
  onNavigate: (route: PageRoute) => void;
}

const FALLBACK_IMAGES = [
  founderPortrait,
  '/Founder1.jpg',
  '/images/anurag_tiwari.jpg',
  '/images/founder.jpg'
];

export const FounderPage: React.FC<FounderPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const f = translations[language].founder;
  const [imgIndex, setImgIndex] = useState(0);

  const handleImageError = () => {
    setImgIndex((prev) => (prev + 1 < FALLBACK_IMAGES.length ? prev + 1 : prev));
  };

  const visionFlow = [
    { step: '01', label: f.visionSteps.idea },
    { step: '02', label: f.visionSteps.problem },
    { step: '03', label: f.visionSteps.technology },
    { step: '04', label: f.visionSteps.product },
    { step: '05', label: f.visionSteps.impact }
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-8 text-white">
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

      {/* 1. HERO FOUNDER DOSSIER CARD */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#0D1220] border border-white/10 shadow-2xl overflow-hidden relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/10 blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs rounded-2xl overflow-hidden bg-[#070B14] border border-white/15 shadow-2xl min-h-[320px]">
              <img
                src={FALLBACK_IMAGES[imgIndex]}
                onError={handleImageError}
                alt={`${f.name} — ${f.role}`}
                loading="eager"
                decoding="async"
                className="w-full aspect-[4/5] object-cover object-top block"
              />
              <div className="absolute bottom-2 inset-x-2 p-2.5 rounded-xl bg-[#070B14]/92 backdrop-blur-md border border-white/10 text-center">
                <h2 className="text-xs sm:text-sm font-bold text-white">{f.name}</h2>
                <p className="text-[10px] text-stone-300 mt-0.5">{f.role}</p>
              </div>
            </div>
          </div>

          {/* Executive Summary & Quote */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="inline-block px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
              {f.badge}
            </span>

            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
                {f.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#C9A24B]">
                {f.subtitle}
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">
                {f.practice}
              </p>
            </div>

            {/* Founder Quote Callout */}
            <blockquote className="p-4 rounded-2xl bg-[#070B14]/90 border border-white/10 border-l-2 border-l-red-500 space-y-2">
              <Quote className="w-4 h-4 text-red-400" />
              <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                {f.shortQuote}
              </p>
            </blockquote>

            {/* Action Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('articles')}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md whitespace-nowrap transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>{isHindi ? 'संस्थापक के लेख पढ़ें' : 'Read Cyber Defense Guides'}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => onNavigate('tools')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                <span>{isHindi ? 'निजी टूल्स देखें' : 'Explore On-Device Tools'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE FOUNDER BIO & VISION (Full 4-Paragraph Story) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1220] border border-white/10 space-y-5 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {f.storyTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <div className="space-y-4">
            <p className="p-4 rounded-2xl bg-[#070B14]/70 border border-white/5">
              {f.storyP1}
            </p>
            <p className="p-4 rounded-2xl bg-[#070B14]/70 border border-white/5">
              {f.storyP2}
            </p>
          </div>

          <div className="space-y-4">
            <p className="p-4 rounded-2xl bg-[#070B14]/70 border border-white/5">
              {f.storyP3}
            </p>
            <p className="p-4 rounded-2xl bg-[#070B14]/70 border border-white/5 border-l-2 border-l-[#C9A24B]">
              {f.storyP4}
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY I CREATED LESS LEGAL + MY VISION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Why Less Legal */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-[#0D1220] border border-white/10 space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {f.whyTitle}
              </h2>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>{f.whyP1}</p>
              <p>{f.whyP2}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {f.whyBullets.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070B14]/80 border border-white/10 text-xs text-stone-200 font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-stone-400 leading-relaxed pt-1">
              <p>{f.whyP3}</p>
              <p>{f.whyP4}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-[11px] text-amber-200/90 leading-relaxed">
            <Info className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
            <span>{f.disclaimerNote}</span>
          </div>
        </div>

        {/* Right: My Vision & 5-Stage Framework */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-[#0D1220] border border-white/10 space-y-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <div className="w-8 h-8 rounded-xl bg-[#C9A24B]/15 border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B] shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {f.visionTitle}
              </h2>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>{f.visionP1}</p>
              <p className="font-semibold text-white">{f.visionP2}</p>
              <p>{f.visionP3}</p>
              <div className="pt-1 border-t border-white/10 space-y-1">
                <p className="text-stone-400">{f.visionP4}</p>
                <p className="text-[#C9A24B] font-semibold">{f.visionP5}</p>
              </div>
            </div>
          </div>

          {/* 5-Stage Vision Pipeline */}
          <div className="space-y-2.5 pt-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">
              {isHindi ? 'दृष्टिकोण की कार्यप्रणाली' : 'FOUNDER EXECUTION PIPELINE'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {visionFlow.map((node) => (
                <div
                  key={node.step}
                  className="p-2.5 rounded-xl bg-[#070B14] border border-white/10 hover:border-red-500/40 transition-colors text-center space-y-1"
                >
                  <div className="text-[10px] font-mono font-bold text-red-400">
                    {node.step}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                    {node.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. A MESSAGE FROM THE FOUNDER */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0D1220] via-[#101628] to-[#160D14] border border-red-500/25 shadow-xl text-center space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider text-red-400 whitespace-nowrap">
          {f.messageTitle}
        </span>

        <blockquote className="max-w-3xl mx-auto text-sm sm:text-lg font-medium text-white leading-relaxed">
          “{f.messageQuote}”
        </blockquote>

        <div className="text-xs font-semibold text-[#C9A24B]">
          — {f.messageAuthor}
        </div>
      </section>

      {/* 5. JOURNEY TIMELINE: FROM LEGAL PRACTICE TO DIGITAL INNOVATION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1220] border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {f.timelineTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {f.timelineItems.map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-2xl bg-[#070B14]/85 border border-white/10 hover:border-red-500/35 transition-colors flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRODUCT ECOSYSTEM CONNECTION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1220] border border-white/10 space-y-5 shadow-xl">
        <div className="text-center space-y-1">
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {f.connectionTitle}
          </h2>
          <p className="text-xs text-stone-400">{f.connectionSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <div className="p-5 rounded-2xl bg-[#070B14] border border-white/10 text-center space-y-1.5 flex flex-col justify-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              {f.founderLabel}
            </span>
            <div className="text-sm sm:text-base font-bold text-white">
              {f.name}
            </div>
            <div className="text-[11px] text-[#C9A24B]">
              {isHindi ? 'इलाहाबाद उच्च न्यायालय' : 'Allahabad High Court'}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#070B14] border border-red-500/30 text-center space-y-1.5 flex flex-col justify-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-400">
              {f.parentBrandLabel}
            </span>
            <div className="text-sm sm:text-base font-bold text-white">
              Less Creation
            </div>
            <div className="text-[11px] text-stone-400">
              {isHindi ? 'साइबर सुरक्षा व विधिक मंच' : 'Cyber Defense & Legal Ecosystem'}
            </div>
          </div>

          <div
            onClick={() => onNavigate('features')}
            className="p-5 rounded-2xl bg-[#070B14] border border-white/10 hover:border-[#C9A24B]/50 transition-colors text-center space-y-1.5 flex flex-col justify-center cursor-pointer"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B]">
              {f.flagshipProductLabel}
            </span>
            <div className="text-sm sm:text-base font-bold text-white inline-flex items-center justify-center gap-1.5">
              <span>Less Legal</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-[11px] text-stone-400">
              {isHindi ? 'ऑफलाइन विधिक व 29+ टूल्स सूट' : 'Offline Legal & 29+ Privacy Utilities'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
