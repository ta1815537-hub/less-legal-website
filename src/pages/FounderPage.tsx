import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Scale, ShieldCheck, ArrowRight, ArrowLeft, Sparkles, 
  Lightbulb, AlertCircle, Layers, Award, Target, CheckCircle2,
  ExternalLink, UserCheck
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';

interface FounderPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const FounderPage: React.FC<FounderPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [isHoveredLessLegal, setIsHoveredLessLegal] = useState(false);

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 space-y-10 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />

      {/* Back Button */}
      <div className="relative z-10 text-center">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-700 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3.5 py-1.5 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span>{t.common.backToHome}</span>
        </motion.button>
      </div>

      {/* ================================================== */}
      {/* HERO SECTION — Desktop Left: Photo, Right: Info    */}
      {/* ================================================== */}
      <ScrollReveal direction="up" className="relative z-10">
        <div className="glass-panel p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-200 dark:border-white/12 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Red/Gold Gradient Background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#C21F2F]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#D8BD82]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* LEFT: Founder Photograph Container with Animated Running Color Border */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative group w-full max-w-sm"
              >
                {/* Outer Flowing Animated Rotating Gradient Border */}
                <div className="animated-founder-border shadow-2xl rounded-[24px] overflow-hidden p-1" style={{ transform: 'translateZ(0)' }}>
                  
                  <div className="relative rounded-[20px] overflow-hidden bg-white dark:bg-[#0D131F] border border-amber-600/30 dark:border-[#D8BD82]/40 shadow-xl" style={{ transform: 'translateZ(0)' }}>
                    
                    {!imgError ? (
                      <div className="relative overflow-hidden bg-slate-900 flex justify-center items-center">
                        <img 
                          src="/images/anurag_tiwari.jpg" 
                          alt="Anurag Tiwari — Founder of Less Creation" 
                          onError={() => setImgError(true)}
                          loading="eager"
                          className="w-full h-auto max-h-[480px] object-cover object-top transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                        />
                        {/* Light Sweep overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                    ) : (
                      /* Styled Fallback */
                      <div className="aspect-[4/5] bg-gradient-to-b from-slate-100 via-white to-amber-50 dark:from-[#0F172A] dark:via-[#080808] dark:to-[#1A0A0D] flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-amber-500/10 dark:bg-[#C21F2F]/20 border-2 border-amber-600 dark:border-[#D8BD82] flex items-center justify-center shadow-lg">
                          <Scale className="w-10 h-10 text-[#C21F2F] dark:text-[#E03A3E]" />
                        </div>
                        <div>
                          <div className="text-xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-wide whitespace-nowrap badge-one-line">{t.founder.name}</div>
                          <div className="text-xs font-semibold text-[#C21F2F] dark:text-[#E03A3E] uppercase tracking-wider mt-1 whitespace-nowrap badge-one-line">{t.founder.role}</div>
                          <div className="text-[11px] text-slate-600 dark:text-[#B8B3AF] mt-1 whitespace-nowrap badge-one-line">Allahabad High Court</div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-[10px] text-amber-800 dark:text-[#B8BD82] whitespace-nowrap badge-one-line">
                          Less Creation
                        </div>
                      </div>
                    )}

                    {/* Caption Bar */}
                    <div className="p-3.5 bg-slate-100/95 dark:bg-[#0A0A0C]/90 backdrop-blur-md border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-[#F5F2EE] whitespace-nowrap badge-one-line">{t.founder.name}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#D8BD82] font-extrabold text-[11px] whitespace-nowrap badge-one-line border border-amber-600/20 dark:border-[#D8BD82]/30">{t.founder.role}</span>
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Founder Details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="space-y-3">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-700 dark:text-[#D8BD82] text-xs font-bold shadow-xs cursor-default whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
                  <span className="whitespace-nowrap tracking-wider">{t.founder.badge}</span>
                </motion.div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
                  {t.founder.name}
                </h1>
                
                <p className="text-base sm:text-lg font-bold text-[#C21F2F] dark:text-[#E03A3E]">
                  {t.founder.subtitle}
                </p>

                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
                  <span>{t.founder.practice}</span>
                </p>
              </div>

              {/* Short Quote Banner */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 italic text-sm text-slate-700 dark:text-[#B8B3AF] leading-relaxed relative">
                <p>{t.founder.shortQuote}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <GlowingButton
                  variant="primary"
                  onClick={() => onNavigate('download')}
                  className="px-5 py-2.5 text-xs font-bold"
                >
                  <span>{t.nav.downloadApp}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </GlowingButton>
                
                <GlowingButton
                  variant="outline"
                  onClick={() => onNavigate('features')}
                  className="px-5 py-2.5 text-xs font-bold"
                >
                  <span>{t.common.exploreFeatures}</span>
                </GlowingButton>
              </div>

            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* FOUNDER STORY — The Person Behind Less Creation */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <div className="glass-card p-6 sm:p-10 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#C21F2F]/15 border border-[#C21F2F]/30 text-[#C21F2F] dark:text-[#E03A3E] flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F2EE]">
                {t.founder.storyTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#B8B3AF]">Advocate & Creator Perspective</p>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
            <p className="font-semibold text-slate-900 dark:text-[#F5F2EE]">{t.founder.storyP1}</p>
            <p>{t.founder.storyP2}</p>
            <p>{t.founder.storyP3}</p>
            <p className="font-semibold text-[#C21F2F] dark:text-[#E03A3E]">{t.founder.storyP4}</p>
          </div>
        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* WHY I CREATED LESS LEGAL                          */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.1} className="relative z-10">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/12 space-y-6">
          
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-600/30 text-amber-700 dark:text-[#D8BD82] flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F2EE]">
              {t.founder.whyTitle}
            </h2>
          </div>

          <div className="space-y-4 text-sm text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
            <p>{t.founder.whyP1}</p>
            <p className="font-medium text-slate-900 dark:text-[#F5F2EE]">{t.founder.whyP2}</p>
            
            {/* The 6 Core Bullets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-3">
              {t.founder.whyBullets.map((bullet, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-[#F5F2EE]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                  <span>{bullet}</span>
                </motion.div>
              ))}
            </div>

            <p>{t.founder.whyP3}</p>
            <p className="font-medium text-slate-900 dark:text-[#F5F2EE]">{t.founder.whyP4}</p>
          </div>

          {/* Factual Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 text-xs text-slate-600 dark:text-[#B8B3AF] flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0 mt-0.5" />
            <p>{t.founder.disclaimerNote}</p>
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* CONNECTED ECOSYSTEM FLOW — Visual Connection      */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.12} className="relative z-10">
        <div className="p-6 sm:p-10 glass-panel-gradient rounded-3xl border border-slate-200 dark:border-white/15 space-y-8 text-center">
          
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F2EE]">
              {t.founder.connectionTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#B8B3AF] mt-1">
              {t.founder.connectionSub}
            </p>
          </div>

          {/* Flow Diagram Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6 relative">
            
            {/* Step 1: Founder */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D131F] border border-slate-200 dark:border-white/10 shadow-lg w-full md:w-64 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-[#D8BD82] flex items-center justify-center mx-auto text-xs font-bold">1</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-[#B8B3AF] font-bold">{t.founder.founderLabel}</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-[#F5F2EE]">{t.founder.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-[#B8B3AF]">{t.founder.role}</div>
            </div>

            {/* Connecting Arrow 1 */}
            <div className="text-[#C21F2F] dark:text-[#E03A3E] font-bold flex md:block transform rotate-90 md:rotate-0">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>

            {/* Step 2: Parent Brand */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D131F] border border-slate-200 dark:border-white/10 shadow-lg w-full md:w-64 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#C21F2F]/20 text-[#C21F2F] dark:text-[#E03A3E] flex items-center justify-center mx-auto text-xs font-bold">2</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-[#B8B3AF] font-bold">{t.founder.parentBrandLabel}</div>
              <div className="text-base font-extrabold text-[#C21F2F] dark:text-[#E03A3E]">Less Creation</div>
              <div className="text-[11px] text-slate-500 dark:text-[#B8B3AF]">Digital Product Studio</div>
            </div>

            {/* Connecting Arrow 2 */}
            <div className="text-[#C21F2F] dark:text-[#E03A3E] font-bold flex md:block transform rotate-90 md:rotate-0">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>

            {/* Step 3: Flagship Product (Interactive Card) */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setIsHoveredLessLegal(true)}
              onHoverEnd={() => setIsHoveredLessLegal(false)}
              onClick={() => onNavigate('features')}
              className={`p-5 rounded-2xl bg-white dark:bg-[#0D131F] border cursor-pointer transition-all duration-300 w-full md:w-64 text-center space-y-2 relative overflow-hidden ${
                isHoveredLessLegal 
                  ? 'border-[#C21F2F] shadow-2xl shadow-[#C21F2F]/20' 
                  : 'border-slate-200 dark:border-white/10 shadow-lg'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-[#D8BD82] flex items-center justify-center mx-auto text-xs font-bold">3</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-[#B8B3AF] font-bold">{t.founder.flagshipProductLabel}</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-[#F5F2EE] flex items-center justify-center gap-1">
                <span>Less Legal</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E]" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-[#B8B3AF]">Legal Knowledge & Utilities</div>
            </motion.div>

          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* MY VISION — Step Progression (IDEA -> IMPACT)      */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.14} className="relative z-10">
        <div className="glass-card p-6 sm:p-10 rounded-3xl space-y-8">
          
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-600/30 text-amber-700 dark:text-[#D8BD82] flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F2EE]">
              {t.founder.visionTitle}
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
            <p>{t.founder.visionP1}</p>
            <p className="font-semibold text-slate-900 dark:text-[#F5F2EE]">{t.founder.visionP2}</p>
            <p>{t.founder.visionP3}</p>
            <p>{t.founder.visionP4}</p>
            <p className="font-semibold text-[#C21F2F] dark:text-[#E03A3E]">{t.founder.visionP5}</p>
          </div>

          {/* Animated Visual Progression Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="text-xs font-bold text-slate-500 dark:text-[#B8B3AF] mb-4 text-center uppercase tracking-wider">
              {language === 'hi' ? 'विकास की प्रक्रिया' : 'Product Evolution Philosophy'}
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { label: t.founder.visionSteps.idea, icon: Lightbulb, color: "text-amber-500" },
                { label: t.founder.visionSteps.problem, icon: AlertCircle, color: "text-[#C21F2F] dark:text-[#E03A3E]" },
                { label: t.founder.visionSteps.technology, icon: Layers, color: "text-blue-500" },
                { label: t.founder.visionSteps.product, icon: Scale, color: "text-[#C21F2F] dark:text-[#E03A3E]" },
                { label: t.founder.visionSteps.impact, icon: Award, color: "text-emerald-500" }
              ].map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <StaggerItem key={idx}>
                    <motion.div 
                      whileHover={{ scale: 1.04, y: -2 }}
                      className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center space-y-2 h-full flex flex-col items-center justify-center"
                    >
                      <IconComponent className={`w-5 h-5 ${step.color}`} />
                      <div className="text-[11px] font-extrabold text-slate-800 dark:text-[#F5F2EE] tracking-tight whitespace-nowrap">
                        {step.label}
                      </div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* FOUNDER JOURNEY TIMELINE — Practice to Innovation */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.16} className="relative z-10 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F5F2EE]">
            {t.founder.timelineTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#B8B3AF]">Minimal Progression Journey</p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {t.founder.timelineItems.map((item, idx) => (
            <StaggerItem key={idx}>
              <motion.div 
                whileHover={{ y: -4 }}
                className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 h-full flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="text-2xl font-black text-[#C21F2F] dark:text-[#E03A3E] opacity-80 mb-1">
                    {item.step}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollReveal>

      {/* ================================================== */}
      {/* FOUNDER MESSAGE — Quote Card                      */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.18} className="relative z-10">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="p-8 sm:p-12 rounded-3xl glass-panel-crimson border border-[#C21F2F]/40 shadow-2xl text-center space-y-6 max-w-3xl mx-auto relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/15 dark:bg-[#C21F2F]/20 text-amber-700 dark:text-[#D8BD82] border border-amber-600/30 dark:border-[#D8BD82]/40 flex items-center justify-center mx-auto text-xl font-serif shadow-xs">
            “
          </div>
          
          <h3 className="text-xs font-bold text-[#C21F2F] dark:text-[#E03A3E] uppercase tracking-wider">
            {t.founder.messageTitle}
          </h3>

          <blockquote className="text-lg sm:text-xl font-medium text-slate-900 dark:text-[#F5F2EE] italic leading-relaxed">
            “{t.founder.messageQuote}”
          </blockquote>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-xs font-bold text-[#C21F2F] dark:text-[#E03A3E]">
            {t.founder.messageAuthor}
          </div>
        </motion.div>
      </ScrollReveal>

    </div>
  );
};
