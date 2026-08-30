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
  const { t } = useLanguage();
  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");
  const hasPhone = Boolean(SITE_CONFIG.supportPhone && SITE_CONFIG.supportPhone.trim() !== "");
  const hasAddress = Boolean(SITE_CONFIG.businessAddress && SITE_CONFIG.businessAddress.trim() !== "");

  return (
    <footer className="bg-slate-100 dark:bg-[#0A0A0C] text-slate-600 dark:text-[#B8B3AF] pt-16 pb-12 border-t border-slate-200 dark:border-white/10 relative overflow-hidden mt-16 transition-colors duration-300">
      {/* Top Crimson & Gold Ambient Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-[#8B0000]/10 via-[#C21F2F]/10 to-[#D8BD82]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <ScrollReveal direction="up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-200 dark:border-white/10">
          
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div 
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 cursor-pointer inline-flex"
              onClick={() => onNavigate('home')}
            >
              <LTLogo className="w-10 h-10" />
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-[#F5F2EE]">
                  {SITE_CONFIG.companyName || SITE_CONFIG.appName}
                </span>
              </div>
            </motion.div>

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
                <button
                  id="footer-nav-home"
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.nav.home}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about"
                  onClick={() => onNavigate('about')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.aboutLessLegal}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-founder"
                  onClick={() => onNavigate('founder')}
                  className="text-amber-800 dark:text-[#D8BD82] hover:text-[#C21F2F] dark:hover:text-[#F5F2EE] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.founderLabel}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-features"
                  onClick={() => onNavigate('features')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.appFeatures}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-premium"
                  onClick={() => onNavigate('premium')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-amber-700 dark:hover:text-[#D8BD82] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.premiumPlans}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-download"
                  onClick={() => onNavigate('download')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.downloadApp}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  onClick={() => onNavigate('contact')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>{t.footer.contactSupport}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Merchant Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-[#D8BD82]">
              {t.footer.legalHeader}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-link-privacy"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">{t.footer.privacyPolicy}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-terms"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">{t.footer.termsConditions}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-refund"
                  onClick={() => onNavigate('refund')}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">{t.footer.refundCancellation}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-disclaimer"
                  onClick={() => onNavigate('disclaimer')}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">{t.footer.legalDisclaimer}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
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
                <button
                  id="footer-link-contact-page"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-200/60 dark:hover:bg-white/10 text-amber-800 dark:text-[#D8BD82] text-xs font-medium border border-amber-600/30 dark:border-[#D8BD82]/30 transition-colors cursor-pointer shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.footer.contactSupport}</span>
                </button>
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
            <button
              onClick={() => onNavigate('disclaimer')}
              className="text-[#C21F2F] dark:text-[#E03A3E] hover:text-slate-900 dark:hover:text-[#F5F2EE] whitespace-nowrap font-medium underline shrink-0 cursor-pointer"
            >
              {t.footer.readFullDisclaimer}
            </button>
          </div>
        </ScrollReveal>

        {/* Bottom copyright & details */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#77736F]">
          <div className="space-y-1 text-center md:text-left">
            <p className="whitespace-nowrap badge-one-line">
              © {new Date().getFullYear()} {SITE_CONFIG.companyName || SITE_CONFIG.appName}. {t.footer.rightsReserved}
            </p>
            <p className="text-[10px] sm:text-xs font-bold text-amber-800 dark:text-[#D8BD82] tracking-wide whitespace-nowrap badge-one-line">
              अप्राप्यं नाम नेहास्ति धीरस्य व्यवसायिनः
            </p>
          </div>
          
          {/* Security & Anti-Hacking Protection Shield Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold whitespace-nowrap badge-one-line">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>256-Bit SSL Encrypted • Anti-Hacking & XSS Shield Active</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] whitespace-nowrap badge-one-line">
            <span>{t.footer.platformInfo}</span>
            <span>•</span>
            <span>{t.footer.improvingInfo}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
