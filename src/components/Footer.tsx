import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { ShieldCheck, Mail, Phone, MapPin, ArrowUpRight, Lock, Code } from 'lucide-react';
import { LTLogo } from './LTLogo';
import { ScrollReveal } from './MotionWrappers';
import { motion } from 'motion/react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 dark:bg-[#D8BD82]/15 text-amber-800 dark:text-[#D8BD82] border border-amber-600/30 dark:border-[#D8BD82]/30">
                  Product Studio
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
                <span>Independent Digital Products</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/5 text-slate-700 dark:text-[#B8B3AF] border border-slate-200 dark:border-white/10 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8BD82]" />
                <span>Privacy Conscious</span>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F2EE]">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about"
                  onClick={() => onNavigate('about')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>About Less Legal</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-features"
                  onClick={() => onNavigate('features')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>App Features</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-premium"
                  onClick={() => onNavigate('premium')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-amber-700 dark:hover:text-[#D8BD82] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Premium Plans</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-download"
                  onClick={() => onNavigate('download')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Download App</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  onClick={() => onNavigate('contact')}
                  className="text-slate-600 dark:text-[#B8B3AF] hover:text-[#C21F2F] dark:hover:text-[#E03A3E] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Contact</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Merchant Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-[#D8BD82]">
              Legal & Policies
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-link-privacy"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">Privacy Policy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-terms"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">Terms & Conditions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-refund"
                  onClick={() => onNavigate('refund')}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">Refund & Cancellation</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-disclaimer"
                  onClick={() => onNavigate('disclaimer')}
                  className="hover:text-slate-900 dark:hover:text-[#F5F2EE] transition-colors text-slate-600 dark:text-[#B8B3AF] font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">Legal Disclaimer</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F2EE]">
              Support & Contact
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-[#B8B3AF]">
              <p>
                Official support is available for all {SITE_CONFIG.companyName} products.
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
                  <span>Contact Support Page</span>
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
                <strong className="text-slate-900 dark:text-[#F5F2EE]">Independent Application Disclaimer:</strong> Less Legal is an independent software application and is not affiliated with, authorized, maintained, sponsored or endorsed by the Government of India, courts, or any state judicial department.
              </div>
            </div>
            <button
              onClick={() => onNavigate('disclaimer')}
              className="text-[#C21F2F] dark:text-[#E03A3E] hover:text-slate-900 dark:hover:text-[#F5F2EE] whitespace-nowrap font-medium underline shrink-0 cursor-pointer"
            >
              Read Full Disclaimer
            </button>
          </div>
        </ScrollReveal>

        {/* Bottom copyright & details */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#77736F]">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.companyName || SITE_CONFIG.appName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Platform: Web & Android</span>
            <span>•</span>
            <span>Continuously improving</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
