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
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Subtle top ambient glow for dark footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <ScrollReveal direction="up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Tagline (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div 
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 cursor-pointer inline-flex"
              onClick={() => onNavigate('home')}
            >
              <LTLogo className="w-10 h-10" />
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  {SITE_CONFIG.companyName || SITE_CONFIG.appName}
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                  Product Studio
                </span>
              </div>
            </motion.div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.companyTagline || SITE_CONFIG.tagline}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>Independent Digital Products</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy Conscious</span>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => onNavigate('home')}
                  className="link-animated text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about"
                  onClick={() => onNavigate('about')}
                  className="link-animated text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>About Less Legal</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-features"
                  onClick={() => onNavigate('features')}
                  className="link-animated text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>App Features</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-premium"
                  onClick={() => onNavigate('premium')}
                  className="link-animated text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Premium Plans</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-download"
                  onClick={() => onNavigate('download')}
                  className="link-animated text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Download App</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  onClick={() => onNavigate('contact')}
                  className="link-animated text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Contact</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Merchant Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Legal & Policies
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-link-privacy"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors text-slate-300 font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">Privacy Policy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-terms"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors text-slate-300 font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">Terms & Conditions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-refund"
                  onClick={() => onNavigate('refund')}
                  className="hover:text-white transition-colors text-slate-300 font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">Refund & Cancellation</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-disclaimer"
                  onClick={() => onNavigate('disclaimer')}
                  className="hover:text-white transition-colors text-slate-300 font-medium flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="group-hover:underline">Legal Disclaimer</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Support / Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Support & Contact
            </h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p>
                Official support is available for all {SITE_CONFIG.companyName} products.
              </p>
              
              {hasEmail && (
                <div className="flex items-start gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="hover:text-white transition-colors underline break-all">
                    {SITE_CONFIG.supportEmail}
                  </a>
                </div>
              )}

              {hasPhone && (
                <div className="flex items-start gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <a href={`tel:${SITE_CONFIG.supportPhone}`} className="hover:text-white transition-colors">
                    {SITE_CONFIG.supportPhone}
                  </a>
                </div>
              )}

              {hasAddress && (
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{SITE_CONFIG.businessAddress}</span>
                </div>
              )}

              <div>
                <button
                  id="footer-link-contact-page"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Support Page</span>
                </button>
              </div>
            </div>
          </div>

        </ScrollReveal>

        {/* Non-Governmental Declaration Banner */}
        <ScrollReveal direction="up" delay={0.06} className="py-6 border-b border-slate-800/80">
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Independent Application Disclaimer:</strong> Less Legal is an independent software application and is not affiliated with, authorized, maintained, sponsored or endorsed by the Government of India, courts, or any state judicial department.
              </div>
            </div>
            <button
              onClick={() => onNavigate('disclaimer')}
              className="text-indigo-400 hover:text-indigo-300 whitespace-nowrap font-medium underline shrink-0 cursor-pointer"
            >
              Read Full Disclaimer
            </button>
          </div>
        </ScrollReveal>

        {/* Bottom copyright & details */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
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

