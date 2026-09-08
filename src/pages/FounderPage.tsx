import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Scale, ShieldCheck, ArrowRight, ArrowLeft, Sparkles, 
  Lightbulb, AlertCircle, Layers, Award, Target, CheckCircle2,
  ExternalLink, UserCheck, Briefcase, BookOpen, HeartHandshake,
  Compass, ChevronRight, Mail, Lock, Code2
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';

interface FounderPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const FounderPage: React.FC<FounderPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const [imgError, setImgError] = useState(false);
  const [isHoveredLessLegal, setIsHoveredLessLegal] = useState(false);

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-32 sm:pb-40 space-y-12 sm:space-y-16 overflow-hidden">
      <HeroAmbientGlow />

      {/* Top Breadcrumb & Return Action */}
      <div className="relative z-10 flex items-center justify-between">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap bg-white/95 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-white/10 px-4 py-2 rounded-full shadow-sm hover:shadow-md backdrop-blur-xl shrink-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-[11px] font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap shrink-0">
          <Scale className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">{isHindi ? "संस्थापक प्रोफ़ाइल" : "Founder & Leadership"}</span>
        </div>
      </div>

      {/* ================================================== */}
      {/* 1. HERO SECTION — Modern Asymmetric Editorial Card */}
      {/* ================================================== */}
      <ScrollReveal direction="up" className="relative z-10">
        <motion.div 
          whileHover={{ y: -3 }} 
          transition={{ type: "spring", stiffness: 300, damping: 25 }} 
          className="animated-card relative p-6 sm:p-10 lg:p-12 rounded-[32px] bg-gradient-to-br from-white via-white/95 to-slate-50/90 dark:from-[#0E1526] dark:via-[#0D1424] dark:to-[#080D1A] border border-slate-200/90 dark:border-white/12 shadow-[0_25px_60px_rgba(37,99,235,0.12)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-2xl"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-gradient-to-bl from-blue-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-gradient-to-tr from-amber-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* LEFT: Founder Portrait with Premium Frame & Dynamic Badge */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative group w-full max-w-sm"
              >
                {/* Glow Halo */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/30 via-blue-600/30 to-cyan-400/30 rounded-[2.2rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <div className="relative rounded-[2rem] overflow-hidden bg-slate-950 border-2 border-slate-200/80 dark:border-white/20 shadow-2xl isolate">
                  
                  {!imgError ? (
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                      <img 
                        src="/images/anurag_tiwari.jpg" 
                        alt="Anurag Gurauli — Founder of Less Creation & Advocate" 
                        onError={() => setImgError(true)}
                        loading="eager"
                        className="w-full h-full object-cover object-top transform group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] bg-gradient-to-b from-slate-900 via-[#0F172A] to-[#070B14] flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
                        <Scale className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="text-xl font-black text-white">{t.founder.name}</div>
                        <div className="text-xs font-bold text-amber-400 mt-1 uppercase tracking-wider">{t.founder.role}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Allahabad High Court</div>
                      </div>
                    </div>
                  )}

                  {/* High Quality Bottom Identity Card */}
                  <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-amber-500/40 text-center shadow-2xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                      <Scale className="w-3 h-3 fill-slate-950 shrink-0" />
                      <span>FOUNDER & ADVOCATE</span>
                    </div>
                    <h4 className="text-sm font-black text-white tracking-wide uppercase mt-1 leading-tight">
                      {t.founder.name}
                    </h4>
                    <p className="text-[10.5px] text-amber-200/90 font-bold leading-tight mt-0.5">
                      Founder, Less Creation • Advocate, High Court
                    </p>
                  </div>

                </div>
              </motion.div>
            </div>

            {/* RIGHT: High-Impact Founder Headline & Credentials */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs mx-auto lg:mx-0">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{t.founder.badge}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {t.founder.name}
                </h1>
                
                <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                  {t.founder.subtitle}
                </p>

                <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t.founder.practice}</span>
                </div>
              </div>

              {/* Short Quote Banner with Glowing Edge */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 italic text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed relative text-left shadow-2xs">
                <div className="text-xl font-serif text-blue-500/50 leading-none mb-1">“</div>
                <p>{t.founder.shortQuote}</p>
                <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 not-italic mt-2">
                  — Anurag Gurauli • Allahabad High Court
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <button
                  onClick={() => onNavigate('download')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-black shadow-md shadow-blue-500/25 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">{t.nav.downloadApp}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                
                <button
                  onClick={() => onNavigate('features')}
                  className="px-6 py-3 rounded-xl bg-white/95 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-extrabold hover:bg-slate-100 dark:hover:bg-white/20 cursor-pointer transition-all shadow-xs hover:scale-[1.02] active:scale-95 whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">{t.common.exploreFeatures}</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 2. EXECUTIVE FOUNDER BIO & ARCHITECTURAL ETHOS      */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <div className="animated-card p-6 sm:p-10 md:p-12 rounded-[32px] bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-8 backdrop-blur-2xl">
          
          {/* Executive Header & Credentials */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/25 border border-white/20">
                <Scale className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10.5px] font-black uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>{isHindi ? "संस्थापक दृष्टिकोण एवं नेतृत्व" : "Executive Founder Profile & Leadership"}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t.founder.storyTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                  {isHindi 
                    ? 'अधिवक्ता, इलाहाबाद उच्च न्यायालय • संस्थापक एवं मुख्य वास्तुकार, लेस क्रिएशन' 
                    : 'Advocate, Allahabad High Court • Founder & Chief Architect, Less Creation'}
                </p>
              </div>
            </div>

            {/* Credential Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{isHindi ? "सक्रिय वकालत" : "Active Jurisprudence"}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{isHindi ? "ऑन-डिवाइस प्राइवेसी" : "Client-Side Privacy"}</span>
              </div>
            </div>
          </div>

          {/* Core Executive Narrative */}
          <div className="space-y-5 text-sm sm:text-base leading-relaxed">
            {/* Primary Thesis Block */}
            <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-transparent border-l-4 border-blue-600 dark:border-blue-400 font-semibold text-slate-900 dark:text-white shadow-xs">
              <p className="text-base sm:text-lg leading-relaxed">
                {t.founder.storyP1}
              </p>
            </div>

            {/* In-depth Institutional Observations */}
            <p className="text-slate-700 dark:text-slate-300">
              {t.founder.storyP2}
            </p>

            {/* Architectural Philosophy & Privacy Stance */}
            <p className="text-slate-700 dark:text-slate-300">
              {t.founder.storyP3}
            </p>

            {/* Flagship Product Conclusion */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/30 dark:via-teal-950/15 dark:to-transparent border-l-4 border-emerald-500 dark:border-emerald-400 font-bold text-slate-900 dark:text-white shadow-xs">
              <p className="text-sm sm:text-base leading-relaxed">
                {t.founder.storyP4}
              </p>
            </div>
          </div>

          {/* 4-Pillar Executive Competency Matrix */}
          <div className="pt-2">
            <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 text-center sm:text-left">
              {isHindi ? "संस्थापक के मुख्य स्तंभ एवं कार्यक्षेत्र" : "Core Executive Pillars & Domains of Impact"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pillar 1 */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2.5 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
                  <Scale className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {isHindi ? "न्यायालयीन विधिक अभ्यास" : "Active Jurisprudence"}
                </h3>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {isHindi 
                    ? "इलाहाबाद उच्च न्यायालय में सक्रिय वकालत; अदालती प्रक्रियाओं और फाइलों की यथार्थ समझ।" 
                    : "Active litigation before the Allahabad High Court; built from genuine procedural reality."}
                </p>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2.5 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-2xs">
                  <Code2 className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {isHindi ? "स्वतंत्र सिस्टम आर्किटेक्चर" : "Independent Architecture"}
                </h3>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {isHindi 
                    ? "बिना किसी कॉर्पोरेट निर्भरता के स्व-विकसित कोडबेस; उच्च गति एवं शून्य ब्लोटवेयर।" 
                    : "Zero external enterprise dependencies; engineered from first principles for peak velocity."}
                </p>
              </motion.div>

              {/* Pillar 3 */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2.5 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {isHindi ? "संपूर्ण डेटा संप्रभुता" : "Absolute Data Sovereignty"}
                </h3>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {isHindi 
                    ? "100% ऑन-डिवाइस निष्पादन; उपयोगकर्ता डेटा का शून्य संग्रह, शून्य ट्रैकिंग या मुद्रीकरण।" 
                    : "100% on-device computation; zero user data collection, zero telemetry, zero monetization."}
                </p>
              </motion.div>

              {/* Pillar 4 */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2.5 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {isHindi ? "सुलभ एकमुश्त अभिगम्यता" : "Democratic Lifetime Access"}
                </h3>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {isHindi 
                    ? "शोषक मासिक शुल्कों को नकारते हुए निष्पक्ष, पारदर्शी व आजीवन सुलभता मॉडल।" 
                    : "Rejecting aggressive recurring subscription traps in favor of clean, transparent value."}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Executive Direct Communication & Authenticity Seal */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white/10 text-amber-400 flex items-center justify-center font-serif text-base font-bold shadow-sm shrink-0">
                AG
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  Anurag Gurauli
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {isHindi ? "संस्थापक एवं अधिवक्ता, इलाहाबाद उच्च न्यायालय" : "Founder & Advocate, Allahabad High Court"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a 
                href="mailto:support@lesscreation.com" 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer shrink-0"
              >
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>support@lesscreation.com</span>
              </a>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 3. WHY I CREATED LESS LEGAL — 6 Core Pillars Card  */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.08} className="relative z-10">
        <div className="animated-card p-6 sm:p-10 md:p-12 rounded-[32px] bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-2xl">
          
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-white/10 pb-5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t.founder.whyTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                {isHindi ? "कानूनी प्रक्रियाओं को सरल और सुरक्षित बनाने का संकल्प" : "Commitment to Simplify and Secure Legal Workflows"}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>{t.founder.whyP1}</p>
            <p className="font-bold text-slate-900 dark:text-white">{t.founder.whyP2}</p>
            
            {/* The 6 Core Interactive Bullets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 py-2">
              {t.founder.whyBullets.map((bullet, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-start gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="leading-snug">{bullet}</span>
                </motion.div>
              ))}
            </div>

            <p>{t.founder.whyP3}</p>
            <p className="font-bold text-blue-600 dark:text-blue-400">{t.founder.whyP4}</p>
          </div>

          {/* Factual Independence Disclaimer Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-slate-700 dark:text-amber-200 flex items-start gap-3.5 shadow-2xs">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{t.founder.disclaimerNote}</p>
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 4. CONNECTED ECOSYSTEM FLOW — Visual 3D Connection */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.1} className="relative z-10">
        <div className="animated-card p-6 sm:p-10 md:p-12 rounded-[32px] bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-[#0E1526] dark:via-[#0F172A] dark:to-[#1E293B] border border-blue-200/70 dark:border-white/10 space-y-8 text-center backdrop-blur-2xl shadow-xl">
          
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>{isHindi ? "पारदर्शी संबंध संरचना" : "Clear Organizational Structure"}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.founder.connectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              {t.founder.connectionSub}
            </p>
          </div>

          {/* 3 Step Interactive Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            
            {/* Step 1: Founder */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-lg text-center space-y-3 relative group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-sm font-black">
                1
              </div>
              <div className="text-[10.5px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold">
                {t.founder.founderLabel}
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {t.founder.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {t.founder.role}
              </div>
              <div className="pt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {isHindi ? "संस्थापक एवं प्रेरणास्रोत" : "Creator & Visionary"}
              </div>
            </motion.div>

            {/* Step 2: Parent Studio */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-3xl bg-white dark:bg-[#111827] border-2 border-blue-500/40 dark:border-blue-500/30 shadow-lg text-center space-y-3 relative group"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-sm font-black">
                2
              </div>
              <div className="text-[10.5px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-extrabold">
                {t.founder.parentBrandLabel}
              </div>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                Less Creation
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isHindi ? 'डिजिटल सॉफ्टवेयर स्टूडियो' : 'Digital Software Studio'}
              </div>
              <div className="pt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                {isHindi ? "मूल निर्माता कंपनी" : "Parent Software Brand"}
              </div>
            </motion.div>

            {/* Step 3: Flagship Product */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              onHoverStart={() => setIsHoveredLessLegal(true)}
              onHoverEnd={() => setIsHoveredLessLegal(false)}
              onClick={() => onNavigate('features')}
              className={`p-6 rounded-3xl bg-white dark:bg-[#111827] border-2 cursor-pointer transition-all duration-300 text-center space-y-3 relative group shadow-lg ${
                isHoveredLessLegal 
                  ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20' 
                  : 'border-slate-200/80 dark:border-white/10'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-sm font-black">
                3
              </div>
              <div className="text-[10.5px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold">
                {t.founder.flagshipProductLabel}
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                <span>Less Legal</span>
                <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isHindi ? 'विधिक कार्यप्रणाली सूट' : 'Legal Utility & Research Suite'}
              </div>
              <div className="pt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {isHindi ? "फ्लैगशिप मोबाइल एप्लीकेशन" : "Flagship Mobile App"}
              </div>
            </motion.div>

          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* AUTHORITATIVE DESIGN & CREATION ATTRIBUTION CARD  */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.11} className="relative z-10">
        <div 
          id="about-less-creation-attribution" 
          className="animated-card p-6 sm:p-10 md:p-12 rounded-[32px] bg-white/95 dark:bg-[#121622] border-2 border-blue-500/30 dark:border-blue-400/25 shadow-lg space-y-6 relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                {isHindi ? 'सत्य व प्रामाणिक जानकारी' : 'Authoritative Facts'}
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                About Less Creation
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Exact English Factual content requested by the owner */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <h3 className="font-extrabold text-blue-600 dark:text-blue-400 text-sm border-b border-slate-200 dark:border-white/10 pb-1">English Statement (Official)</h3>
              
              <p className="font-bold">
                Less Creation is a technology and digital product initiative founded by Anurag Gurauli.
              </p>
              
              <p>
                The concept, visual direction, website structure, and design of Less Creation were personally created and directed by Anurag Gurauli. The website was developed using web development/design technologies and platforms selected for the project.
              </p>
              
              <p>
                AI tools, where used, should be considered supporting tools only and must not be described as the founder, creator, designer, or sole developer of Less Creation unless that statement is factually accurate.
              </p>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-black text-slate-900 dark:text-white">
                <div>
                  <span className="text-slate-500 block font-normal">Founder & Creator:</span>
                  <span>Anurag Gurauli</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-normal">Website & Design Direction:</span>
                  <span>Anurag Gurauli</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block font-normal">Brand:</span>
                  <span>Less Creation</span>
                </div>
              </div>
            </div>

            {/* Hindi Factual Translation for completeness */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <h3 className="font-extrabold text-blue-600 dark:text-blue-400 text-sm border-b border-slate-200 dark:border-white/10 pb-1">हिन्दी विवरण (आधिकारिक)</h3>
              
              <p className="font-bold">
                लेस क्रिएशन (Less Creation) अनुराग गुरौली द्वारा स्थापित एक तकनीकी और डिजिटल उत्पाद पहल है।
              </p>
              
              <p>
                लेस क्रिएशन की अवधारणा, दृश्य दिशा (visual direction), वेबसाइट की संरचना और समग्र डिज़ाइन व्यक्तिगत रूप से अनुराग गुरौली द्वारा बनाई और निर्देशित की गई थी। इस वेबसाइट को परियोजना के लिए चयनित वेब विकास/डिज़ाइन तकनीकों और प्लेटफार्मों का उपयोग करके विकसित किया गया था।
              </p>
              
              <p>
                एआई (AI) उपकरणों का जहां भी उपयोग किया गया है, उन्हें केवल सहायक उपकरण माना जाना चाहिए और उन्हें लेस क्रिएशन का संस्थापक, निर्माता, डिज़ाइनर या एकमात्र डेवलपर नहीं बताया जाना चाहिए, जब तक कि वह कथन तथ्यात्मक रूप से सटीक न हो।
              </p>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-black text-slate-900 dark:text-white">
                <div>
                  <span className="text-slate-500 block font-normal">संस्थापक और निर्माता:</span>
                  <span>अनुराग गुरौली</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-normal">वेबसाइट और डिज़ाइन दिशा:</span>
                  <span>अनुराग गुरौली</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block font-normal">ब्रांड:</span>
                  <span>लेस क्रिएशन</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 5. PRODUCT EVOLUTION PHILOSOPHY (IDEA -> IMPACT)   */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.12} className="relative z-10">
        <div className="animated-card p-6 sm:p-10 md:p-12 rounded-[32px] bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-8 backdrop-blur-2xl">
          
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-white/10 pb-5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t.founder.visionTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                {isHindi ? "विचार से वास्तविक प्रभाव तक की यात्रा" : "Journey from Ideation to Real Ground Impact"}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            <p>{t.founder.visionP1}</p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 font-bold text-slate-900 dark:text-white">
              {t.founder.visionP2}
            </div>
            <p>{t.founder.visionP3}</p>
            <p>{t.founder.visionP4}</p>
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 font-bold text-blue-600 dark:text-blue-400">
              {t.founder.visionP5}
            </div>
          </div>

          {/* 5-Step Animated Visual Progression Pipeline */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-4">
            <div className="text-xs font-black text-slate-500 dark:text-slate-400 text-center uppercase tracking-wider">
              {language === 'hi' ? 'विकास की प्रक्रिया (5 चरण)' : '5-Step Product Evolution Philosophy'}
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {[
                { step: "01", label: t.founder.visionSteps.idea, icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10 dark:bg-amber-500/15" },
                { step: "02", label: t.founder.visionSteps.problem, icon: AlertCircle, color: "text-red-500 dark:text-red-400", bg: "bg-red-500/10 dark:bg-red-500/15" },
                { step: "03", label: t.founder.visionSteps.technology, icon: Layers, color: "text-sky-500", bg: "bg-sky-500/10 dark:bg-sky-500/15" },
                { step: "04", label: t.founder.visionSteps.product, icon: Scale, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 dark:bg-blue-500/15" },
                { step: "05", label: t.founder.visionSteps.impact, icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10 dark:bg-emerald-500/15" }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <StaggerItem key={idx}>
                    <motion.div 
                      whileHover={{ scale: 1.04, y: -3 }}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center space-y-2 h-full flex flex-col items-center justify-between shadow-2xs hover:shadow-md transition-all"
                    >
                      <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider">
                        STEP {item.step}
                      </div>
                      <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center mx-auto shadow-2xs`}>
                        <IconComponent className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="text-xs font-black text-slate-800 dark:text-white tracking-tight">
                        {item.label}
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
      {/* 6. FOUNDER JOURNEY TIMELINE — Practice to Innovation */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.14} className="relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isHindi ? "प्रगति मील के पत्थर" : "Milestones & Evolution"}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.founder.timelineTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto">
            {language === 'hi' ? 'वकालत से लेकर डिजिटल सॉफ़्टवेयर नवाचार तक का सफ़र' : 'From active courtroom practice to independent software innovation'}
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {t.founder.timelineItems.map((item, idx) => (
            <StaggerItem key={idx}>
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className="animated-card p-5 rounded-3xl bg-white/95 dark:bg-[#111827]/95 border border-slate-200/80 dark:border-white/10 space-y-3 h-full flex flex-col justify-between shadow-sm hover:shadow-xl transition-all"
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white text-xs font-black flex items-center justify-center shadow-md">
                    {item.step}
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 7. FOUNDER PHILOSOPHY / CLOSING MASTER QUOTE CARD  */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.16} className="relative z-10">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="animated-card p-8 sm:p-12 md:p-14 rounded-[36px] bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 dark:from-[#0E1526] dark:via-[#11192C] dark:to-[#080D1A] border-2 border-blue-400/40 dark:border-blue-500/30 shadow-[0_20px_60px_rgba(37,99,235,0.15)] text-center space-y-6 max-w-3xl mx-auto relative overflow-hidden backdrop-blur-2xl"
        >
          {/* Top Elegant Quote Glyph */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white flex items-center justify-center mx-auto text-2xl font-serif shadow-lg shadow-blue-500/30 border border-white/20">
            “
          </div>
          
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
            {t.founder.messageTitle}
          </div>

          <blockquote className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white italic leading-relaxed">
            “{t.founder.messageQuote}”
          </blockquote>

          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-col items-center justify-center space-y-1">
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {t.founder.name}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
              {t.founder.messageAuthor}
            </span>
          </div>
        </motion.div>
      </ScrollReveal>

    </div>
  );
};
