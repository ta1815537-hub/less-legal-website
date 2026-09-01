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
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 space-y-8 overflow-hidden bg-slate-50 dark:bg-[#080808]">
      <HeroAmbientGlow />
      
      {/* Page Header */}
      <ScrollReveal direction="up" className="space-y-3 text-center max-w-3xl mx-auto relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3 py-1 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/60 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-900 dark:text-[#D8BD82] text-xs font-bold shadow-xs cursor-default"
        >
          <Scale className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] animate-pulse" />
          <span>{t.about.badge}</span>
        </motion.div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {t.about.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
          {t.about.subtitle}
        </p>
      </ScrollReveal>

      {/* Non-Governmental Affiliation Declaration */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <div className="p-6 sm:p-8 glass-panel-crimson rounded-3xl border border-[#C21F2F]/40 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C21F2F] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE]">
              {t.about.declarationTitle}
            </h2>
          </div>
          <p className="text-sm text-slate-800 dark:text-[#F5F2EE] leading-relaxed font-semibold">
            {t.about.declarationP1}
          </p>
          <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
            {t.about.declarationP2}
          </p>
        </div>
      </ScrollReveal>

      {/* What Less Legal Does */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10">
        
        <ScrollReveal direction="left" delay={0.1} className="h-full">
          <div className="glass-card p-6 sm:p-8 flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C21F2F]/20 text-[#C21F2F] dark:text-[#E03A3E] border border-[#C21F2F]/40 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F5F2EE]">
                {t.about.whatIsTitle}
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                {t.about.whatIsDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2 text-xs text-slate-600 dark:text-[#B8B3AF]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                <span>{t.about.whatIsItem1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                <span>{t.about.whatIsItem2}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.14} className="h-full">
          <div className="glass-card p-6 sm:p-8 flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-[#D8BD82] border border-amber-600/40 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F5F2EE]">
                {t.about.privacyTitle}
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                {t.about.privacyDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2 text-xs text-slate-600 dark:text-[#B8B3AF]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                <span>{t.about.privacyItem1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                <span>{t.about.privacyItem2}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Core Principles */}
      <div className="space-y-6 relative z-10">
        <ScrollReveal direction="up" className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F5F2EE]">{t.about.principlesTitle}</h2>
          <p className="text-sm text-slate-600 dark:text-[#B8B3AF]">{t.about.principlesSub}</p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <StaggerItem>
            <div className="glass-card p-6 space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#C21F2F] dark:text-[#E03A3E] flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE]">{t.about.p1Title}</h3>
              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                {t.about.p1Desc}
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-card p-6 space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-amber-700 dark:text-[#D8BD82] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE]">{t.about.p2Title}</h3>
              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                {t.about.p2Desc}
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-card p-6 space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#C21F2F] dark:text-[#E03A3E] flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE]">{t.about.p3Title}</h3>
              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                {t.about.p3Desc}
              </p>
            </div>
          </StaggerItem>

        </StaggerContainer>
      </div>

      {/* Call to actions */}
      <ScrollReveal direction="up" className="p-8 glass-panel-gradient rounded-3xl text-center space-y-4 relative z-10 border border-slate-200 dark:border-white/15">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F2EE]">{t.common.exploreFeatures}</h2>
        <p className="text-sm text-slate-600 dark:text-[#B8B3AF] max-w-xl mx-auto">
          {language === 'hi' ? 'हमारे सत्यापित सुविधाओं के पूर्ण कैटलॉग की समीक्षा करें या एंड्रॉइड पर ऐप डाउनलोड करें।' : 'Review our complete catalog of verified features or download the app on Android.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <GlowingButton
            variant="primary"
            onClick={() => onNavigate('features')}
            className="px-6 py-3 text-xs"
          >
            <span>{t.common.exploreFeatures}</span>
          </GlowingButton>
          <GlowingButton
            variant="outline"
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 text-xs"
          >
            <span>{t.nav.contact}</span>
          </GlowingButton>
        </div>
      </ScrollReveal>

    </div>
  );
};

