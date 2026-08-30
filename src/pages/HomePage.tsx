import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { AppMockupPreview } from '../components/AppMockupPreview';
import { 
  Download, ArrowRight, ShieldCheck, Sparkles, 
  FileText, Calendar, Compass, Calculator, 
  Scale, Lock, CheckCircle2, 
  Smartphone, Check, Edit3, BookOpen, Wrench, ChevronRight, Layers, LayoutGrid
} from 'lucide-react';
import { LTLogo } from '../components/LTLogo';
import { 
  HeroAmbientGlow, ScrollReveal, StaggerContainer, 
  StaggerItem, GlowingButton, EASING_SPRING 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 sm:space-y-28 py-8 sm:py-12 overflow-hidden">
      
      {/* 1. FUTURISTIC HERO SECTION */}
      <section className="relative -mt-8 sm:-mt-12 bg-slate-950 text-white pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none transform-gpu" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none transform-gpu" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASING_SPRING }}
            className="flex justify-center mb-6"
          >
            <LTLogo className="w-20 h-20 drop-shadow-2xl text-indigo-400" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASING_SPRING }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {SITE_CONFIG.companyName}
            </h1>
            <p className="text-lg sm:text-2xl text-indigo-200/80 font-medium max-w-3xl mx-auto">
              {SITE_CONFIG.companyTagline}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASING_SPRING }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <GlowingButton
              onClick={() => {
                const el = document.getElementById('ecosystem-section');
                if(el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="primary"
              className="px-8 py-4 text-sm w-full sm:w-auto"
            >
              <span>Explore Ecosystem</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </GlowingButton>
            
            <GlowingButton
              onClick={() => onNavigate('download')}
              variant="dark"
              className="px-8 py-4 text-sm w-full sm:w-auto border border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-indigo-400" />
              <span>Get Less Legal</span>
            </GlowingButton>
          </motion.div>
        </div>
      </section>

      {/* 2. PRODUCT ECOSYSTEM SECTION */}
      <section id="ecosystem-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-4">
            <LayoutGrid className="w-3.5 h-3.5" />
            Product Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Productivity
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Discover our suite of independent, fast, and secure digital tools designed to simplify complex workflows.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_CONFIG.products.map((product, idx) => {
            const isFlagship = product.category === 'Flagship Product';
            const isAvailable = product.status === 'Available';
            
            const IconMap: Record<string, any> = {
              Scale: Scale,
              Edit3: Edit3,
              BookOpen: BookOpen,
              Tool: Wrench
            };
            const Icon = IconMap[product.iconName] || Layers;

            return (
              <StaggerItem key={product.id}>
                <div className={`group relative p-6 rounded-3xl border transition-all duration-300 h-full flex flex-col ${
                  isFlagship 
                    ? 'bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/30 text-white shadow-xl shadow-indigo-900/20 hover:border-indigo-400/50' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50'
                }`}>
                  
                  {isFlagship && (
                    <div className="absolute top-0 right-0 -mt-3 mr-4">
                      <span className="bg-indigo-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                        Flagship
                      </span>
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                    isFlagship ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xl font-bold ${isFlagship ? 'text-white' : 'text-slate-900'}`}>
                        {product.name}
                      </h3>
                      {!isAvailable && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed mb-6 ${isFlagship ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {product.description}
                    </p>
                  </div>

                  {isAvailable ? (
                    <button
                      onClick={() => product.downloadUrl && onNavigate('download')}
                      className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                        isFlagship 
                          ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-md' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>Get App</span>
                    </button>
                  ) : (
                    <button disabled className="w-full py-3 rounded-xl text-sm font-bold bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      <span>In Development</span>
                    </button>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* 3. FEATURED TOOLS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Verified Toolset
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              What You Get Inside Less Legal
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              All tools are built specifically for Android to deliver fast, responsive utility performance.
            </p>
          </div>

          <button
            onClick={() => onNavigate('features')}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 self-start md:self-auto group transition-colors"
          >
            <span className="link-animated">View all 46 features</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </ScrollReveal>

        {/* Feature Marquee */}
        <ScrollReveal direction="up" delay={0.1} className="overflow-hidden relative mb-12 py-4">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transform-gpu" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transform-gpu" />
          
          <div className="flex">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
              style={{ willChange: "transform" }}
              className="flex items-center gap-3 w-max"
            >
              {[...SITE_CONFIG.features.slice(0, 23), ...SITE_CONFIG.features.slice(0, 23)].map((feature, idx) => (
                <div key={`top-${idx}`} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-xl whitespace-nowrap transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">{feature.title}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex mt-4">
            <motion.div 
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
              style={{ willChange: "transform" }}
              className="flex items-center gap-3 w-max"
            >
              {[...SITE_CONFIG.features.slice(23, 46), ...SITE_CONFIG.features.slice(23, 46)].map((feature, idx) => (
                <div key={`bottom-${idx}`} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-100 rounded-xl whitespace-nowrap transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">{feature.title}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1: PDF Tools & Less Share */}
          <StaggerItem>
            <div className="card-interactive bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold icon-bounce">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    PDF & Files
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">PDF Tools & Less Share</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Merge documents, split large filings, password-protect confidential paperwork, and share files directly device-to-device.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Merge & Split PDFs securely on-device</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Fast PDF Reader with bookmarks & search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Less Share local direct device file transfer</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-indigo-600 font-semibold flex items-center justify-between">
                <span>On-device processing</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </StaggerItem>

          {/* Feature 2: Case Diary & Quick Notes */}
          <StaggerItem>
            <div className="card-interactive bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold icon-bounce">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                    Legal Utilities
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Case Diary & Schedule</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Personal daily planner to organize case stages, hearing dates, client notes, and quick legal memos.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Court hearing schedules & case stage notes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Quick Notes for instant memo drafting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Important official court and legal links</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-purple-600 font-semibold flex items-center justify-between">
                <span>Daily Practice Organizer</span>
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </StaggerItem>

          {/* Feature 3: Calculators & Bare Acts */}
          <StaggerItem>
            <div className="card-interactive bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold icon-bounce">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    Calculators & Laws
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Calculators & Knowledge</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Specialized converters for regional land area units, court fee estimates, Bare Acts library, and legal maxims glossary.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Land unit conversion (Bigha, Guntha, Acre, etc.)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Court fee calculations & interest math</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Statutory Bare Acts & Legal Glossary</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-blue-600 font-semibold flex items-center justify-between">
                <span>Instant Conversion</span>
                <Calculator className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </StaggerItem>

        </StaggerContainer>
      </section>

      {/* 4. TRANSPARENT PREMIUM PASSES PREVIEW */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none transform-gpu" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none transform-gpu" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          
          <ScrollReveal direction="up" className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Upgrade to Ad-Free Experience
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Enjoy uninterrupted access to all tools and resources with fixed-validity one-time passes. No auto-renewing subscriptions.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            
            {/* Plan 1: 3 Months */}
            <ScrollReveal direction="up" delay={0.05} className="h-full">
              <div className="bg-slate-800/90 hover:bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col justify-between h-full transition-all duration-300 hover:border-slate-600">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-300">3 Months Access</span>
                    <span className="text-xs text-indigo-300 font-semibold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      90 Days Pass
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-white">₹59</span>
                    <span className="text-xs text-slate-400">/ one-time payment</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">
                    Provides 100% ad-free experience across all utility tools for 3 full months.
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Ad-free tool navigation & PDF utilities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>One-time purchase (No auto-debit)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-700/80">
                  <GlowingButton
                    onClick={() => onNavigate('premium')}
                    variant="dark"
                    className="w-full py-3 text-xs"
                  >
                    <span>View Plan Details & Terms</span>
                  </GlowingButton>
                </div>
              </div>
            </ScrollReveal>

            {/* Plan 2: 1 Year (Best Value) */}
            <ScrollReveal direction="up" delay={0.12} className="h-full">
              <div className="bg-gradient-to-b from-indigo-950/70 to-slate-800/90 rounded-2xl p-6 border-2 border-indigo-500 glow-best-value shadow-2xl relative flex flex-col justify-between h-full">
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                  Best Value
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-indigo-200">1 Year Access</span>
                    <span className="text-xs text-emerald-300 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      365 Days Pass
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-white">₹179</span>
                    <span className="text-xs text-slate-400">/ one-time payment</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-6">
                    Provides 100% ad-free experience across all utility tools for 1 full year.
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Ad-free tool navigation & PDF utilities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>365 days uninterrupted validity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>One-time purchase (No auto-debit)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-700/80">
                  <GlowingButton
                    onClick={() => onNavigate('premium')}
                    variant="primary"
                    className="w-full py-3 text-xs"
                  >
                    <span>View Plan Details & Terms</span>
                  </GlowingButton>
                </div>
              </div>
            </ScrollReveal>

          </div>

          <div className="pt-2 text-xs text-slate-400">
            Purchases are made securely inside the Android application via certified payment gateway (PayU / Play Store).
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION & DOWNLOAD HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up">
          <div className="neo-box p-8 sm:p-12 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
            <motion.div 
              whileHover={{ scale: 1.08, rotate: -2 }}
              transition={{ duration: 0.3, ease: EASING_SPRING }}
              className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <Smartphone className="w-7 h-7" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Get Started with Less Legal
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Download the official Android application to access legal reference resources, PDF tools, and calculators.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <GlowingButton
                onClick={() => onNavigate('download')}
                variant="primary"
                className="w-full sm:w-auto px-8 py-3.5 text-sm"
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                <span>Download for Android</span>
              </GlowingButton>
              
              <GlowingButton
                onClick={() => onNavigate('about')}
                variant="secondary"
                className="w-full sm:w-auto px-8 py-3.5 text-sm"
              >
                <span>About Less Legal</span>
              </GlowingButton>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <span>Minimum: Android 7.0+</span>
              <span>•</span>
              <span>Target: Mobile & Tablet</span>
              <span>•</span>
              <span>Independent & Factual</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};

