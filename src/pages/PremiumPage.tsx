import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Sparkles, CheckCircle2, ShieldCheck, 
  FileText, ArrowUpRight, ArrowLeft
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton
} from '../components/MotionWrappers';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface PremiumPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const features90Days = t.premiumPage.features90Days || SITE_CONFIG.premiumPlans[0].features;
  const features1Year = t.premiumPage.features1Year || SITE_CONFIG.premiumPlans[1].features;

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 space-y-8 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-700 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3 py-1 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-700 dark:text-[#D8BD82] text-xs font-bold shadow-xs cursor-default whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] animate-pulse shrink-0" />
          <span className="whitespace-nowrap">{t.premiumPage.badge}</span>
        </motion.div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {t.premiumPage.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
          {t.premiumPage.subtitle}
        </p>
      </ScrollReveal>

      {/* Critical Factual Billing Clarity Banner */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-[#F5F2EE] font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
            <span>{t.premiumPage.transparentNoticeTitle}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-[#B8B3AF]">
            <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
              <strong className="text-slate-900 dark:text-[#F5F2EE] block mb-1">{t.premiumPage.notice1Title}</strong>
              {t.premiumPage.notice1Text}
            </div>
            <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
              <strong className="text-slate-900 dark:text-[#F5F2EE] block mb-1">{t.premiumPage.notice2Title}</strong>
              {t.premiumPage.notice2Text}
            </div>
            <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
              <strong className="text-slate-900 dark:text-[#F5F2EE] block mb-1">{t.premiumPage.notice3Title}</strong>
              {t.premiumPage.notice3Text}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Pricing Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto relative z-10">
        
        {/* Plan 1: ₹59 / 3 Months */}
        <ScrollReveal direction="up" delay={0.1} className="h-full">
          <div className="glass-panel shine-sweep-overlay p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/12 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#77736F]">
                  {language === 'hi' ? 'तिमाही पास' : 'Quarterly Pass'}
                </span>
                <span className="text-xs font-bold text-amber-700 dark:text-[#D8BD82] bg-amber-500/10 dark:bg-[#D8BD82]/15 px-2.5 py-1 rounded-full border border-amber-600/30 dark:border-[#D8BD82]/30 whitespace-nowrap">
                  {t.premiumPage.plan90DaysValidity}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F5F2EE] mb-2">{t.premiumPage.plan90DaysTitle}</h2>
              
              <div className="flex items-baseline gap-1.5 my-4">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE]">{t.premiumPage.plan90DaysPrice}</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap">{t.premiumPage.oneTimePaymentLabel}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed mb-6">
                {t.premiumPage.plan90DaysTagline}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#77736F]">
                  {language === 'hi' ? 'शामिल लाभ' : 'Included Benefits'}
                </span>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-[#B8B3AF]">
                  {features90Days.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
              <div className="text-center text-[11px] text-slate-500 dark:text-[#77736F] font-medium">
                {language === 'hi' ? 'खरीदारी सीधे Less Legal एंड्रॉइड ऐप के भीतर करें' : 'Purchase directly inside the Less Legal Android App'}
              </div>
              <a
                href={SITE_CONFIG.playStoreUrl || '#'}
                target={SITE_CONFIG.playStoreUrl ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!SITE_CONFIG.playStoreUrl) {
                    e.preventDefault();
                    onNavigate('download');
                  }
                }}
                className="w-full block"
              >
                <GlowingButton variant="secondary" className="w-full py-3 text-xs font-bold whitespace-nowrap">
                  <span>{language === 'hi' ? 'खरीदने के लिए Less Legal ऐप खोलें' : 'Open Less Legal App to Purchase'}</span>
                </GlowingButton>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Plan 2: ₹179 / 1 Year (Best Value) */}
        <ScrollReveal direction="up" delay={0.16} className="h-full">
          <div className="relative h-full">
            <div className="glass-panel-crimson glow-crimson-gold shine-sweep-overlay p-6 sm:p-8 rounded-3xl border-2 flex flex-col justify-between h-full">

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C21F2F] dark:text-[#E03A3E]">
                  {language === 'hi' ? 'वार्षिक पास' : 'Annual Pass'}
                </span>
                <span className="text-xs font-bold text-amber-700 dark:text-[#D8BD82] bg-amber-500/20 dark:bg-[#D8BD82]/20 px-2.5 py-1 rounded-full border border-amber-600/40 dark:border-[#D8BD82]/40 whitespace-nowrap">
                  {t.premiumPage.plan1YearValidity}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F5F2EE] mb-2">{t.premiumPage.plan1YearTitle}</h2>
              
              <div className="flex items-baseline gap-1.5 my-4">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE]">{t.premiumPage.plan1YearPrice}</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-[#B8B3AF] whitespace-nowrap">{t.premiumPage.oneTimePaymentLabel}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed mb-6">
                {t.premiumPage.plan1YearTagline}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#77736F]">
                  {language === 'hi' ? 'शामिल लाभ' : 'Included Benefits'}
                </span>
                <ul className="space-y-2.5 text-xs text-slate-800 dark:text-[#F5F2EE]">
                  {features1Year.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
              <div className="text-center text-[11px] text-[#C21F2F] dark:text-[#E03A3E] font-semibold">
                {language === 'hi' ? 'दैनिक कानूनी उपयोगिता के लिए सर्वोत्तम बचत' : 'Best savings for long-term daily legal utility usage'}
              </div>
              <a
                href={SITE_CONFIG.playStoreUrl || '#'}
                target={SITE_CONFIG.playStoreUrl ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!SITE_CONFIG.playStoreUrl) {
                    e.preventDefault();
                    onNavigate('download');
                  }
                }}
                className="w-full block"
              >
                <GlowingButton
                  variant="primary"
                  className="w-full py-3 text-xs font-bold whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">{language === 'hi' ? 'खरीदने के लिए Less Legal ऐप खोलें' : 'Open Less Legal App to Purchase'}</span>
                </GlowingButton>
              </a>
            </div>
          </div>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5 }}
              className="absolute -top-3.5 right-8 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-[#D8BD82] dark:to-[#C7A96B] text-white dark:text-[#080808] text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap z-10"
            >
              {t.premiumPage.bestValueBadge}
            </motion.div>
          </div>
        </ScrollReveal>

      </div>

      {/* Mandatory PayU / Merchant Verification Compliance Links */}
      <ScrollReveal direction="up" delay={0.2} className="relative z-10">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E]" />
            <span>Policies & Terms for Premium Purchases</span>
          </h3>
          
          <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
            Please review the official policies governing pass purchases, validities, cancellations, and support before completing any transaction in the app:
          </p>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <StaggerItem>
              <button
                id="premium-btn-terms"
                onClick={() => onNavigate('terms')}
                className="w-full p-3.5 bg-slate-100/80 hover:bg-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:text-[#E03A3E] dark:group-hover:text-[#D8BD82] transition-colors whitespace-nowrap">
                    View Terms & Conditions
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#77736F]">Service terms & pass rules</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:text-[#E03A3E] dark:group-hover:text-[#D8BD82] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-refund"
                onClick={() => onNavigate('refund')}
                className="w-full p-3.5 bg-slate-100/80 hover:bg-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:text-[#E03A3E] dark:group-hover:text-[#D8BD82] transition-colors whitespace-nowrap">
                    Refund & Cancellation Policy
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#77736F]">Guidelines for ₹59 & ₹179 passes</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:text-[#E03A3E] dark:group-hover:text-[#D8BD82] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-contact"
                onClick={() => onNavigate('contact')}
                className="w-full p-3.5 bg-slate-100/80 hover:bg-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:text-[#E03A3E] dark:group-hover:text-[#D8BD82] transition-colors whitespace-nowrap">
                    Contact Support
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#77736F]">Assistance for active transactions</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:text-[#E03A3E] dark:group-hover:text-[#D8BD82] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </ScrollReveal>

    </div>
  );
};
