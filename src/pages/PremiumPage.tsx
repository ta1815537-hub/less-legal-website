import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Sparkles, CheckCircle2, ShieldCheck, 
  FileText, ArrowUpRight
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton, EASING_SPRING 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';

interface PremiumPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-xs cursor-default"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse-subtle" />
          <span>Less Legal Premium Passes</span>
        </motion.div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Ad-Free Productivity Passes
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Upgrade your Less Legal Android experience with a clean, uninterrupted ad-free interface. Simple one-time fixed validity passes with zero recurring debits.
        </p>
      </ScrollReveal>

      {/* Critical Factual Billing Clarity Banner */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <div className="bg-slate-100/90 backdrop-blur-xs rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>Transparent Billing Notice & Consumer Terms</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-indigo-200 transition-colors">
              <strong className="text-slate-900 block mb-1">Fixed Validity Period</strong>
              Premium passes grant ad-free access strictly for the duration purchased (90 days for ₹59 or 365 days for ₹179).
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-indigo-200 transition-colors">
              <strong className="text-slate-900 block mb-1">No Auto-Renewals</strong>
              We do NOT store payment cards or initiate auto-debit subscriptions. When your pass expires, it simply reverts to standard ad-supported access.
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-indigo-200 transition-colors">
              <strong className="text-slate-900 block mb-1">In-App Activation</strong>
              Purchases are initiated directly inside the Less Legal Android app via certified payment gateways (PayU / Play Store).
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Pricing Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto relative z-10">
        
        {/* Plan 1: ₹59 / 3 Months */}
        <ScrollReveal direction="up" delay={0.1} className="h-full">
          <div className="card-interactive neo-box p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quarterly Pass
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  90 Days Validity
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">3 Months Plan</h2>
              
              <div className="flex items-baseline gap-1.5 my-4">
                <span className="text-5xl font-extrabold text-slate-900">₹59</span>
                <span className="text-xs font-semibold text-slate-500">/ one-time payment</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Provides an ad-free experience for the purchased 90-day validity period across all tools and utilities.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Included Benefits
                </span>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {SITE_CONFIG.premiumPlans[0].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
              <div className="text-center text-[11px] text-slate-500 font-medium">
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
                className="w-full"
              >
                <GlowingButton
                  variant="dark"
                  className="w-full py-3 text-xs"
                >
                  <span>Open Less Legal App to Purchase</span>
                </GlowingButton>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Plan 2: ₹179 / 1 Year (Best Value) */}
        <ScrollReveal direction="up" delay={0.16} className="h-full">
          <div className="card-interactive neo-box p-6 sm:p-8 bg-white rounded-3xl border-2 border-indigo-600 glow-best-value shadow-lg relative flex flex-col justify-between h-full">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.5 }}
              className="absolute -top-3.5 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md"
            >
              Best Value (365 Days)
            </motion.div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Annual Pass
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  365 Days Validity
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">1 Year Plan</h2>
              
              <div className="flex items-baseline gap-1.5 my-4">
                <span className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">₹179</span>
                <span className="text-xs font-semibold text-slate-500">/ one-time payment</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Provides an ad-free experience for the purchased 365-day validity period across all tools and utilities.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Included Benefits
                </span>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {SITE_CONFIG.premiumPlans[1].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
              <div className="text-center text-[11px] text-indigo-700 font-medium">
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
                className="w-full"
              >
                <GlowingButton
                  variant="primary"
                  className="w-full py-3 text-xs"
                >
                  <span>Open Less Legal App to Purchase</span>
                </GlowingButton>
              </a>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Mandatory PayU / Merchant Verification Compliance Links */}
      <ScrollReveal direction="up" delay={0.2} className="relative z-10">
        <div className="neo-box p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Policies & Terms for Premium Purchases</span>
          </h3>
          
          <p className="text-xs text-slate-600 leading-relaxed">
            Please review the official policies governing pass purchases, validities, cancellations, and support before completing any transaction in the app:
          </p>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <StaggerItem>
              <button
                id="premium-btn-terms"
                onClick={() => onNavigate('terms')}
                className="w-full p-3.5 bg-slate-50 hover:bg-indigo-50/70 rounded-xl border border-slate-200 text-left transition-colors group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    View Terms & Conditions
                  </div>
                  <div className="text-[11px] text-slate-500">Service terms & pass rules</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-refund"
                onClick={() => onNavigate('refund')}
                className="w-full p-3.5 bg-slate-50 hover:bg-indigo-50/70 rounded-xl border border-slate-200 text-left transition-colors group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Refund & Cancellation Policy
                  </div>
                  <div className="text-[11px] text-slate-500">Guidelines for ₹59 & ₹179 passes</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-contact"
                onClick={() => onNavigate('contact')}
                className="w-full p-3.5 bg-slate-50 hover:bg-indigo-50/70 rounded-xl border border-slate-200 text-left transition-colors group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Contact Support
                  </div>
                  <div className="text-[11px] text-slate-500">Assistance for active transactions</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </ScrollReveal>

    </div>
  );
};

