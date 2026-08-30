import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Sparkles, CheckCircle2, ShieldCheck, 
  FileText, ArrowUpRight
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton
} from '../components/MotionWrappers';
import { motion } from 'motion/react';

interface PremiumPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-900 dark:text-[#D8BD82] text-xs font-bold shadow-xs cursor-default whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8BD82] animate-pulse shrink-0" />
          <span className="whitespace-nowrap">Less Legal Premium Passes</span>
        </motion.div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          Ad-Free Productivity Passes
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
          Upgrade your Less Legal Android experience with a clean, uninterrupted ad-free interface. Simple one-time fixed validity passes with zero recurring debits.
        </p>
      </ScrollReveal>

      {/* Critical Factual Billing Clarity Banner */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-[#F5F2EE] font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-[#D8BD82] shrink-0" />
            <span>Transparent Billing Notice & Consumer Terms</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-[#B8B3AF]">
            <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
              <strong className="text-slate-900 dark:text-[#F5F2EE] block mb-1">Fixed Validity Period</strong>
              Premium passes grant ad-free access strictly for the duration purchased (90 days for ₹59 or 365 days for ₹179).
            </div>
            <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
              <strong className="text-slate-900 dark:text-[#F5F2EE] block mb-1">No Auto-Renewals</strong>
              We do NOT store payment cards or initiate auto-debit subscriptions. When your pass expires, it simply reverts to standard ad-supported access.
            </div>
            <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
              <strong className="text-slate-900 dark:text-[#F5F2EE] block mb-1">In-App Activation</strong>
              Purchases are initiated directly inside the Less Legal Android app via certified payment gateways (PayU / Play Store).
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Pricing Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto relative z-10">
        
        {/* Plan 1: ₹59 / 3 Months */}
        <ScrollReveal direction="up" delay={0.1} className="h-full">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/12 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#77736F]">
                  Quarterly Pass
                </span>
                <span className="text-xs font-bold text-amber-900 dark:text-[#D8BD82] bg-amber-500/10 dark:bg-[#D8BD82]/15 px-2.5 py-1 rounded-full border border-amber-600/30 dark:border-[#D8BD82]/30 whitespace-nowrap">
                  90 Days Validity
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F5F2EE] mb-2">3 Months Plan</h2>
              
              <div className="flex items-baseline gap-1.5 my-4">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE]">₹59</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap">/ one-time payment</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed mb-6">
                Provides an ad-free experience for the purchased 90-day validity period across all tools and utilities.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#77736F]">
                  Included Benefits
                </span>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-[#B8B3AF]">
                  {SITE_CONFIG.premiumPlans[0].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
              <div className="text-center text-[11px] text-slate-500 dark:text-[#77736F] font-medium">
                Purchase directly inside the Less Legal Android App
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
                <button className="w-full py-3 rounded-xl btn-glass font-bold text-xs whitespace-nowrap cursor-pointer">
                  <span>Open Less Legal App to Purchase</span>
                </button>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Plan 2: ₹179 / 1 Year (Best Value) */}
        <ScrollReveal direction="up" delay={0.16} className="h-full">
          <div className="glass-panel-crimson glow-crimson-gold p-6 sm:p-8 rounded-3xl border-2 relative flex flex-col justify-between h-full">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.5 }}
              className="absolute -top-3.5 right-8 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-[#D8BD82] dark:to-[#C7A96B] text-white dark:text-[#080808] text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap"
            >
              Best Value (365 Days)
            </motion.div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-[#D8BD82]">
                  Annual Pass
                </span>
                <span className="text-xs font-bold text-amber-900 dark:text-[#D8BD82] bg-amber-500/20 dark:bg-[#D8BD82]/20 px-2.5 py-1 rounded-full border border-amber-600/40 dark:border-[#D8BD82]/40 whitespace-nowrap">
                  365 Days Validity
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F5F2EE] mb-2">1 Year Plan</h2>
              
              <div className="flex items-baseline gap-1.5 my-4">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE]">₹179</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-[#B8B3AF] whitespace-nowrap">/ one-time payment</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed mb-6">
                Provides an ad-free experience for the purchased 365-day validity period across all tools and utilities.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#77736F]">
                  Included Benefits
                </span>
                <ul className="space-y-2.5 text-xs text-slate-800 dark:text-[#F5F2EE]">
                  {SITE_CONFIG.premiumPlans[1].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-[#D8BD82] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
              <div className="text-center text-[11px] text-amber-900 dark:text-[#D8BD82] font-semibold">
                Best savings for long-term daily legal utility usage
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
                  <span className="whitespace-nowrap">Open Less Legal App to Purchase</span>
                </GlowingButton>
              </a>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Mandatory PayU / Merchant Verification Compliance Links */}
      <ScrollReveal direction="up" delay={0.2} className="relative z-10">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600 dark:text-[#D8BD82]" />
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
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] transition-colors whitespace-nowrap">
                    View Terms & Conditions
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#77736F]">Service terms & pass rules</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-refund"
                onClick={() => onNavigate('refund')}
                className="w-full p-3.5 bg-slate-100/80 hover:bg-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] transition-colors whitespace-nowrap">
                    Refund & Cancellation Policy
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#77736F]">Guidelines for ₹59 & ₹179 passes</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-contact"
                onClick={() => onNavigate('contact')}
                className="w-full p-3.5 bg-slate-100/80 hover:bg-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] transition-colors whitespace-nowrap">
                    Contact Support
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#77736F]">Assistance for active transactions</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </ScrollReveal>

    </div>
  );
};
