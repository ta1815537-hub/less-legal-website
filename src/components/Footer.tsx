import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Home, 
  User, 
  Users, 
  LayoutGrid, 
  Crown, 
  Download, 
  Mail, 
  FileText, 
  ShieldCheck, 
  Trash2, 
  Headphones, 
  ArrowRight, 
  Smartphone, 
  Layers, 
  Lock 
} from 'lucide-react';
import { LTLogo } from './LTLogo';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Secret 10-tap admin lock state (stealthy)
  const tapCountRef = React.useRef(0);
  const resetTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSecretLockClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    tapCountRef.current += 1;

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (tapCountRef.current >= 10) {
      tapCountRef.current = 0;
      onNavigate('admin');
      return;
    }

    resetTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 4500);
  };

  return (
    <footer className="relative mt-20 overflow-hidden text-slate-600 dark:text-[#B8B3AF] transition-colors duration-300">
      {/* Ambient background glow & subtle wave curves */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/5 via-cyan-500/5 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-500/10 via-blue-500/5 to-transparent blur-2xl pointer-events-none" />
        {/* Soft SVG wave at bottom */}
        <svg 
          className="absolute bottom-0 left-0 right-0 w-full h-32 text-blue-500/[0.04] dark:text-blue-500/[0.06] preserve-3d" 
          viewBox="0 0 1440 200" 
          fill="currentColor"
        >
          <path d="M0,128L60,117.3C120,107,240,85,360,96C480,107,600,149,720,154.7C840,160,960,128,1080,112C1200,96,1320,96,1380,96L1440,96L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Floating Glassmorphic Footer Card */}
        <div className="bg-white/95 dark:bg-[#101420]/95 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-8">
          
          {/* Top 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
            
            {/* Column 1: Brand & Taglines (Span 4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-2 shadow-2xs flex items-center justify-center shrink-0">
                  <LTLogo className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight leading-none">
                    <span className="text-slate-900 dark:text-white">Less </span>
                    <span className="text-[#C21F2F]">Creation</span>
                  </h2>
                  <p className="text-xs sm:text-[13px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                    अप्राप्यं नाम नेहास्ति धीरस्य व्यवसायिनः
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                Technology, Utilities and Digital Products — Made for a Smarter Tomorrow.
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                At Less Creation, we build independent digital applications like Less Legal to make legal knowledge, document tools and everyday utilities simple and accessible for everyone.
              </p>

              {/* 4 Pills: Independent Digital Products | Privacy Conscious | User First Always | Made For India */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-[#C21F2F] shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                    Independent<br />Digital Products
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                    Privacy<br />Conscious
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                    User First<br />Always
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                    Proudly Made<br />For India
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Navigation (Span 3) */}
            <div className="lg:col-span-3 space-y-3 lg:pl-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick Navigation</h3>
                <div className="w-6 h-0.5 bg-[#C21F2F] rounded-full mt-1.5 mb-3" />
              </div>
              
              <ul className="space-y-2.5 text-xs font-medium">
                <li>
                  <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Home className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Home</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>About Less Legal</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('founder')}
                    className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Founder (Anurag Gurauli)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('features')}
                    className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <LayoutGrid className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>App Features</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('premium')}
                    className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Crown className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Premium Plans</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('download')}
                    className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Download className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Download App</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Contact</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Website Legal & Less Legal App (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Website Legal */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Website Legal</h3>
                  <div className="w-6 h-0.5 bg-[#C21F2F] rounded-full mt-1.5 mb-3" />
                </div>
                
                <ul className="space-y-2.5 text-xs font-medium">
                  <li>
                    <button
                      onClick={() => onNavigate('privacy')}
                      className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Website Privacy Policy</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('terms')}
                      className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Terms & Conditions</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('refund')}
                      className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Refund & Cancellation</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('disclaimer')}
                      className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Legal Disclaimer</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Less Legal App */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Less Legal App</h3>
                  <div className="w-6 h-0.5 bg-[#C21F2F] rounded-full mt-1.5 mb-3" />
                </div>

                <ul className="space-y-2.5 text-xs font-medium">
                  <li>
                    <button
                      onClick={() => onNavigate('app-privacy')}
                      className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#C21F2F] dark:hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>App Privacy Policy</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('app-delete-account')}
                      className="flex items-center gap-2 text-[#C21F2F] hover:text-red-700 dark:hover:text-red-400 font-bold transition-colors cursor-pointer text-left"
                    >
                      <Trash2 className="w-4 h-4 text-[#C21F2F] shrink-0" />
                      <span>Delete Account & Data</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Support & Contact (Span 3) */}
            <div className="lg:col-span-3 space-y-3.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Support & Contact</h3>
                <div className="w-6 h-0.5 bg-[#C21F2F] rounded-full mt-1.5 mb-3" />
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Headphones className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />
                <span className="leading-snug">Official support is available for all Less Creation products.</span>
              </div>

              {/* Email Card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 text-[#C21F2F] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <a 
                    href="mailto:lesslegalsupport@gmail.com" 
                    className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                  >
                    lesslegalsupport@gmail.com
                  </a>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    We usually reply within 24 hours.
                  </span>
                </div>
              </div>

              {/* Contact Support Button */}
              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:via-blue-600 hover:to-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 border border-white/10 hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Support</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {/* Get the App Container */}
              <div className="p-3.5 rounded-2xl bg-blue-50/40 dark:bg-white/5 border border-blue-100/80 dark:border-white/10 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Get the App</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">All legal & utility tools in one place</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  {/* Google Play */}
                  <a
                    href={SITE_CONFIG.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-black text-white hover:bg-slate-900 transition-colors shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.793 12 3.61 22.186c-.328-.328-.51-.78-.51-1.25V3.064c0-.47.182-.922.51-1.25zm11.314 11.314l2.127 2.127-11.83 6.76 9.703-8.887zm0-2.256L5.22 1.985l11.83 6.76-2.127 2.127zm1.13 1.128l3.655-2.09c.773-.442.773-1.162 0-1.604l-3.655-2.09-1.42 1.42 1.42 4.364z"/>
                    </svg>
                    <div className="text-left leading-none">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-medium">GET IT ON</span>
                      <span className="text-[10px] font-bold text-white block">Google Play</span>
                    </div>
                  </a>

                  {/* App Store (Coming Soon) */}
                  <div className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-black text-white cursor-default shadow-2xs">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.64-.78 1.08-1.86.96-2.95-1 .04-2.14.67-2.8 1.44-.58.67-1.1 1.76-.96 2.82 1.11.09 2.18-.57 2.8-1.31z"/>
                    </svg>
                    <div className="text-left leading-none">
                      <span className="text-[7.5px] tracking-tight text-slate-400 block font-medium whitespace-nowrap">Coming soon on</span>
                      <span className="text-[10px] font-bold text-white block whitespace-nowrap">App Store</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Bar inside the Card */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-center">
            
            {/* 1. Copyright & Sanskrit (Span 4) */}
            <div className="lg:col-span-4 space-y-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  © 2026 Less Legal. All Rights Reserved.
                </p>
                <button
                  id="admin-secret-lock-btn"
                  onClick={handleSecretLockClick}
                  className="opacity-20 hover:opacity-75 transition-opacity p-0.5 rounded text-slate-400 dark:text-slate-500 cursor-pointer focus:outline-none"
                  aria-label="Security Verification"
                >
                  <Lock className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Founded & Created by Anurag Gurauli. | Less Creation
              </p>
            </div>

            {/* 2. Follow Us Social Icons (Span 2) */}
            <div className="lg:col-span-2">
              <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">Follow Us</p>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="w-8 h-8 rounded-full bg-[#229ED9] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current ml-[-1px]" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* 3. Trusted Legal & Utilities Tool (Span 3) */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/15 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#C21F2F] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#C21F2F] dark:text-[#E03A3E]">
                    Trusted Legal & Utilities Tool
                  </p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    For Every Indian <span className="text-base leading-none">🇮🇳</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Scripts (Span 3) */}
            <div className="lg:col-span-3 flex items-center justify-start lg:justify-end gap-3">
              <div className="text-left lg:text-right">
                <p className="font-serif italic text-blue-900/60 dark:text-blue-300/60 text-base sm:text-lg tracking-wide leading-tight select-none whitespace-nowrap">
                  Knowledge Simplifies Life
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Centered Slogan & Safe Space for Mobile Devices */}
        <div className="pt-6 pb-6 text-center flex items-center justify-center gap-2">
          <p className="text-[11px] sm:text-xs font-bold text-[#C21F2F]/80 dark:text-[#E03A3E]/80 tracking-[0.2em] sm:tracking-[0.25em] uppercase select-none">
            BUILDING A SIMPLER, SMARTER AND MORE INFORMED INDIA ❤️
          </p>
          <button
            onClick={handleSecretLockClick}
            className="opacity-15 hover:opacity-60 transition-opacity p-1 text-slate-400 dark:text-slate-600 focus:outline-none cursor-pointer"
            aria-label="Admin Security"
            title=""
          >
            <Lock className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
