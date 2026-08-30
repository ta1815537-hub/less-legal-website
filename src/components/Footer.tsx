import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Scale, ShieldCheck, Mail, Phone, MapPin, ExternalLink, ArrowUpRight, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");
  const hasPhone = Boolean(SITE_CONFIG.supportPhone && SITE_CONFIG.supportPhone.trim() !== "");
  const hasAddress = Boolean(SITE_CONFIG.businessAddress && SITE_CONFIG.businessAddress.trim() !== "");

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Tagline (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  {SITE_CONFIG.appName}
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                  Android Application
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>On-Device Document Processing</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Non-Renewing Passes</span>
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
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <span>About Less Legal</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-features"
                  onClick={() => onNavigate('features')}
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <span>App Features</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-premium"
                  onClick={() => onNavigate('premium')}
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <span>Premium Plans</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-download"
                  onClick={() => onNavigate('download')}
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <span>Download App</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
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
                  className="hover:text-white transition-colors text-slate-300 font-medium flex items-center justify-between w-full group"
                >
                  <span className="group-hover:underline">Privacy Policy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-terms"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors text-slate-300 font-medium flex items-center justify-between w-full group"
                >
                  <span className="group-hover:underline">Terms & Conditions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-refund"
                  onClick={() => onNavigate('refund')}
                  className="hover:text-white transition-colors text-slate-300 font-medium flex items-center justify-between w-full group"
                >
                  <span className="group-hover:underline">Refund & Cancellation</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                </button>
              </li>
              <li>
                <button
                  id="footer-link-disclaimer"
                  onClick={() => onNavigate('disclaimer')}
                  className="hover:text-white transition-colors text-slate-300 font-medium flex items-center justify-between w-full group"
                >
                  <span className="group-hover:underline">Legal Disclaimer</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
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
                Official support is available for Less Legal Android application users.
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium border border-slate-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Support Page</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Non-Governmental Declaration Banner */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Independent Application Disclaimer:</strong> Less Legal is an independent software application and is not affiliated with, authorized, maintained, sponsored or endorsed by the Government of India, courts, or any state judicial department.
              </div>
            </div>
            <button
              onClick={() => onNavigate('disclaimer')}
              className="text-indigo-400 hover:text-indigo-300 whitespace-nowrap font-medium underline shrink-0"
            >
              Read Full Disclaimer
            </button>
          </div>
        </div>

        {/* Bottom copyright & details */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.appName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Platform: Android</span>
            <span>•</span>
            <span>Version: {SITE_CONFIG.appVersion}</span>
            <span>•</span>
            <span>Pricing: Non-recurring one-time passes</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
