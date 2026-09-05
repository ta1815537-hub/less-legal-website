import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Scale, ShieldCheck, FileCheck, Lock, Smartphone, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-10 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Page Header */}
      <ScrollReveal direction="up" className="space-y-4 text-center max-w-3xl mx-auto relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#E02636]" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/40 text-[#E02636] dark:text-red-400 text-xs font-black tracking-wider uppercase shadow-2xs cursor-default"
        >
          <Scale className="w-3.5 h-3.5 text-[#E02636]" />
          <span>{t.about.badge}</span>
        </motion.div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.about.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {t.about.subtitle}
        </p>
      </ScrollReveal>

      {/* Non-Governmental Affiliation Declaration */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }} className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-red-50/90 via-white/95 to-red-50/90 dark:from-red-950/20 dark:via-[#121622] dark:to-red-950/20 border border-red-200/80 dark:border-red-900/40 shadow-md space-y-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E02636] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {t.about.declarationTitle}
            </h2>
          </div>
          <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-semibold">
            {t.about.declarationP1}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.about.declarationP2}
          </p>
        </motion.div>
      </ScrollReveal>

      {/* What Less Legal Does */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch relative z-10">
        
        <ScrollReveal direction="left" delay={0.1} className="h-full">
          <div className="rounded-[24px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-md p-6 sm:p-8 flex flex-col justify-between h-full space-y-4 backdrop-blur-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-[#E02636] flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {t.about.whatIsTitle}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.about.whatIsDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.about.whatIsItem1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.about.whatIsItem2}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.14} className="h-full">
          <div className="rounded-[24px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-md p-6 sm:p-8 flex flex-col justify-between h-full space-y-4 backdrop-blur-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-[#2563EB] flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {t.about.privacyTitle}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.about.privacyDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.about.privacyItem1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.about.privacyItem2}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Core Principles */}
      <div className="space-y-6 relative z-10">
        <ScrollReveal direction="up" className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.about.principlesTitle}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t.about.principlesSub}</p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <StaggerItem>
            <div className="rounded-[24px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-md p-6 space-y-3 h-full backdrop-blur-xl">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-[#E02636] flex items-center justify-center font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">{t.about.p1Title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.about.p1Desc}
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="rounded-[24px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-md p-6 space-y-3 h-full backdrop-blur-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">{t.about.p2Title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.about.p2Desc}
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="rounded-[24px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-md p-6 space-y-3 h-full backdrop-blur-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-[#2563EB] flex items-center justify-center font-bold">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">{t.about.p3Title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.about.p3Desc}
              </p>
            </div>
          </StaggerItem>

        </StaggerContainer>
      </div>

      {/* Call to actions */}
      <ScrollReveal direction="up" className="p-8 sm:p-10 rounded-[28px] bg-gradient-to-r from-blue-50/80 via-white/95 to-blue-50/80 dark:from-slate-900 dark:via-[#121622] dark:to-slate-900 text-center space-y-4 relative z-10 border border-white/80 dark:border-white/15 shadow-lg backdrop-blur-xl">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t.common.exploreFeatures}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          {language === 'hi' ? 'हमारे सत्यापित सुविधाओं के पूर्ण कैटलॉग की समीक्षा करें या एंड्रॉइड पर ऐप डाउनलोड करें।' : 'Review our complete catalog of verified features or download the app on Android.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('features')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E02636] to-[#C21F2F] text-white text-xs font-black shadow-md hover:from-[#C21F2F] hover:to-[#9B111E] cursor-pointer transition-all"
          >
            <span>{t.common.exploreFeatures}</span>
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-full bg-white/90 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-extrabold hover:bg-slate-100 dark:hover:bg-white/20 cursor-pointer transition-all shadow-xs"
          >
            <span>{t.nav.contact}</span>
          </button>
        </div>
      </ScrollReveal>

    </div>
  );
};

