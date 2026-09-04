import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { ShieldCheck, Mail, Phone, MapPin, ArrowUpRight, Lock, Code } from 'lucide-react';
import { LTLogo } from './LTLogo';
import { ScrollReveal } from './MotionWrappers';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");
  const hasPhone = Boolean(SITE_CONFIG.supportPhone && SITE_CONFIG.supportPhone.trim() !== "");
  const hasAddress = Boolean(SITE_CONFIG.businessAddress && SITE_CONFIG.businessAddress.trim() !== "");

  // Secret 7-tap admin lock state (completely stealthy, no UI counter or text shown)
  const tapCountRef = React.useRef(0);
  const resetTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSecretLockClick = (e: React.MouseEvent) => {
    e.preventDefault();
    tapCountRef.current += 1;

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (tapCountRef.current >= 7) {
      tapCountRef.current = 0;
      onNavigate('admin');
      return;
    }

    // Reset stealth counter after 4 seconds of inactivity
    resetTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 4000);
  };

  return (
    <footer className="bg-slate-50 dark:bg-[#080808] text-slate-600 dark:text-[#B8B3AF] pt-16 pb-1 border-t border-slate-200 dark:border-white/10 relative overflow-hidden mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <ScrollReveal direction="up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-200 dark:border-white/10">
          
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <motion.a 
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 cursor-pointer inline-flex"
              href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
             style={{ display: 'inline-flex' }}>
              <LTLogo className="w-10 h-10" />
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-[#F5F2EE]">
                  {SITE_CONFIG.companyName || SITE_CONFIG.appName}
                </span>
              </div>
            </motion.a>

            <p className="text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed max-w-sm">
              {SITE_CONFIG.companyTagline || SITE_CONFIG.tagline}
            </p>
            <p className="text-xs text-slate-500 dark:text-[#77736F] leading-relaxed max-w-sm">
              {SITE_CONFIG.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/5 text-slate-700 dark:text-[#B8B3AF] border border-slate-200 dark:border-white/10 shadow-2xs">
                <Code className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E]" />
                <span>{t.footer.independentProducts}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/5 text-slate-700 dark:text-[#B8B3AF] border border-slate-200 dark:border-white/10 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8BD82]" />
                <span>{t.footer.privacyConscious}</span>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F2EE]">
              {t.footer.navHeader}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  id="footer-nav-home"
                  href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.nav.home}</span>
                </a>
              </li>
              <li>
                <a
                  id="footer-nav-about"
                  href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.aboutLessLegal}</span>
                </a>
              </li>
              <li>
                <a
                  id="footer-nav-founder"
                  href="/founder" onClick={(e) => { e.preventDefault(); onNavigate('founder'); }}
                  className="text-amber-800 dark:text-[#D8BD82] hover:text-[#C21F2F] dark:hover:text-[#F5F2EE] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.founderLabel}</span>
                </a>
              </li>
              <li>
                <a
                  id="footer-nav-features"
                  href="/features" onClick={(e) => { e.preventDefault(); onNavigate('features'); }}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.appFeatures}</span>
                </a>
              </li>
              <li>
                <a
                  id="footer-nav-premium"
                  href="/premium" onClick={(e) => { e.preventDefault(); onNavigate('premium'); }}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-amber-700 dark:hover:text-[#D8BD82] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.premiumPlans}</span>
                </a>
              </li>
              <li>
                <a
                  id="footer-nav-download"
                  href="/download" onClick={(e) => { e.preventDefault(); onNavigate('download'); }}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.downloadApp}</span>
                </a>
              </li>
              <li>
                <a
                  id="footer-nav-contact"
                  href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.contactSupport}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Website Legal Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-[#D8BD82]">
              {t.footer.websiteLegalHeader}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  id="footer-link-privacy"
                  href="/privacy-policy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">{t.footer.websitePrivacyPolicy}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  id="footer-link-terms"
                  href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">{t.footer.termsConditions}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  id="footer-link-refund"
                  href="/refund" onClick={(e) => { e.preventDefault(); onNavigate('refund'); }}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">{t.footer.refundCancellation}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  id="footer-link-disclaimer"
                  href="/disclaimer" onClick={(e) => { e.preventDefault(); onNavigate('disclaimer'); }}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">{t.footer.legalDisclaimer}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Less Legal App Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C21F2F] dark:text-[#E03A3E]">
              {t.footer.appLegalHeader}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  id="footer-link-app-privacy"
                  href="/less-legal/privacy-policy" onClick={(e) => { e.preventDefault(); onNavigate('app-privacy'); }}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">{t.footer.appPrivacyPolicy}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  id="footer-link-app-delete-account"
                  href="/less-legal/delete-account" onClick={(e) => { e.preventDefault(); onNavigate('app-delete-account'); }}
                  className="hover:text-red-700 dark:hover:text-red-400 transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline text-[#C21F2F] dark:text-[#E03A3E] font-bold">{t.footer.deleteAccount}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F2EE]">
              {t.footer.supportHeader}
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-[#B8B3AF]">
              <p>
                {t.footer.supportAvailable}
              </p>
              
              {hasEmail && (
                <div className="flex items-start gap-2 text-slate-900 dark:text-[#F5F2EE]">
                  <Mail className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] shrink-0 mt-0.5" />
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="hover:text-amber-700 dark:hover:text-[#D8BD82] transition-colors underline break-all">
                    {SITE_CONFIG.supportEmail}
                  </a>
                </div>
              )}

              {hasPhone && (
                <div className="flex items-start gap-2 text-slate-900 dark:text-[#F5F2EE]">
                  <Phone className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] shrink-0 mt-0.5" />
                  <a href={`tel:${SITE_CONFIG.supportPhone}`} className="hover:text-amber-700 dark:hover:text-[#D8BD82] transition-colors">
                    {SITE_CONFIG.supportPhone}
                  </a>
                </div>
              )}

              {hasAddress && (
                <div className="flex items-start gap-2 text-slate-900 dark:text-[#F5F2EE]">
                  <MapPin className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{SITE_CONFIG.businessAddress}</span>
                </div>
              )}

              <div className="pt-1">
                <a
                  id="footer-link-contact-page"
                  href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-200/60 dark:hover:bg-white/10 text-amber-800 dark:text-[#D8BD82] text-xs font-medium border border-amber-600/30 dark:border-[#D8BD82]/30 transition-colors cursor-pointer shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.footer.contactSupport}</span>
                </a>
              </div>
            </div>
          </div>

        </ScrollReveal>

        {/* Non-Governmental Declaration Banner */}
        <ScrollReveal direction="up" delay={0.06} className="py-6 border-b border-slate-200 dark:border-white/10">
          <div className="glass-panel rounded-xl p-4 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-[#B8B3AF]">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-[#D8BD82] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-[#F5F2EE]">{t.footer.disclaimerTitle}</strong> {t.footer.disclaimerText}
              </div>
            </div>
            <a
              href="/disclaimer" onClick={(e) => { e.preventDefault(); onNavigate('disclaimer'); }}
              className="text-[#C21F2F] dark:text-[#E03A3E] hover:text-slate-900 dark:hover:text-[#F5F2EE] whitespace-nowrap font-medium underline shrink-0 cursor-pointer"
            >
              {t.footer.readFullDisclaimer}
            </a>
          </div>
        </ScrollReveal>

        {/* Bottom copyright & details */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#77736F] overflow-hidden w-full">
          <div className="space-y-1 text-center md:text-left w-full overflow-hidden flex flex-col items-center md:items-start">
            <div className="w-full flex justify-center md:justify-start pb-1">
              <p className="whitespace-nowrap text-[clamp(6px,2.2vw,12px)] sm:text-xs tracking-tight text-center md:text-left">
                © 2026 Less Legal. All Rights Reserved. Founded &amp; Created by Anurag Tiwari {'{'}Gurauli{'}'}
              </p>
            </div>
            <div className="w-full flex justify-center md:justify-start">
              <p className="text-[clamp(8px,2.5vw,12px)] sm:text-xs font-bold text-amber-800 dark:text-[#D8BD82] tracking-wide whitespace-nowrap text-center md:text-left">
                अप्राप्यं नाम नेहास्ति धीरस्य व्यवसायिनः
              </p>
            </div>
          </div>

          {/* Verified Legal Reference Badge & Discreet Lock Icon below it */}
          <div className="flex flex-col items-center md:items-end gap-1 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/60 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-[11px] text-slate-700 dark:text-[#B8B3AF] font-medium whitespace-nowrap badge-one-line shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8BD82] shrink-0" />
              <span>
                {t.footer.trustedTool}
              </span>
            </div>

            {/* Secret discreet lock button directly under 'प्रत्येक भारतीय' - 7 taps required, stealth with no text or counter */}
            <button
              id="footer-secret-lock-btn"
              onClick={handleSecretLockClick}
              className="p-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer opacity-40 hover:opacity-100 active:scale-95"
              aria-label="Access"
            >
              <Lock className="w-3 h-3 text-slate-400 hover:text-[#C21F2F] dark:hover:text-[#E03A3E]" />
            </button>
          </div>
        </div>
      </div>
      
    </footer>
  );
};
