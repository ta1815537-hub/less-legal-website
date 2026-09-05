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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#C21F2F]/5 via-amber-500/5 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-red-500/10 via-red-500/5 to-transparent blur-2xl pointer-events-none" />
        {/* Soft SVG wave at bottom */}
        <svg 
          className="absolute bottom-0 left-0 right-0 w-full h-32 text-red-500/[0.04] dark:text-red-500/[0.06] preserve-3d" 
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
                    अमाप्यं नाम नेहास्ति धीरस्य व्यवसायिनः
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                Technology, Utilities and Digital Products — Made for a Smarter Tomorrow.
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                At Less Creation, we build independent digital applications like Less Legal to make legal knowledge, document tools and everyday utilities simple and accessible for everyone.
              </p>

              {/* 3 Pills: Independent Digital Products | Privacy Conscious | User First Always */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
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
                    className="text-xs font-bold text-slate-900 dark:text-white hover:text-[#C21F2F] transition-colors truncate block"
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
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D92534] to-[#B81928] hover:from-[#C21F2F] hover:to-[#9E1220] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all cursor-pointer"
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

          {/* Middle Full-Width Banner: Independent Application Disclaimer */}
          <div className="rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 mt-0.5 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white font-bold">Independent Application Disclaimer:</strong> Less Legal is an independent software application and is not affiliated with, authorized, maintained, sponsored or endorsed by the Government of India, courts, or any state judicial department.
              </p>
            </div>

            <button
              onClick={() => onNavigate('disclaimer')}
              className="px-5 py-2.5 rounded-full border border-blue-600/30 hover:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>Read Full Disclaimer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
              <p 
                onClick={handleSecretLockClick}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 pt-0.5 cursor-default select-none"
              >
                अमाप्यं नाम नेहास्ति धीरस्य व्यवसायिनः
              </p>
            </div>

            {/* 2. Follow Us Social Icons (Span 2) */}
            <div className="lg:col-span-2">
              <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">Follow Us</p>
              <div className="flex items-center gap-2">
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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

                {/* WhatsApp */}
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.214 8.214 0 012.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.1l-.3-.17-3.12.82.83-3.04-.19-.31a8.19 8.19 0 01-1.26-4.44c0-4.54 3.69-8.24 8.24-8.24zm4.52 11.66c-.19-.09-1.11-.55-1.28-.61-.17-.07-.3-.09-.43.1-.12.19-.48.61-.59.73-.11.12-.22.14-.41.05-.19-.09-.81-.3-1.54-.95-.57-.51-.96-1.14-1.07-1.33-.11-.19-.01-.3.08-.39.09-.09.19-.22.28-.33.1-.11.13-.19.19-.31.06-.12.03-.23-.01-.33-.05-.09-.43-1.04-.59-1.43-.16-.38-.32-.33-.43-.33h-.37c-.12 0-.33.05-.51.24-.17.19-.66.65-.66 1.58 0 .93.68 1.83.77 1.96.1.12 1.34 2.05 3.25 2.87.45.2.81.31 1.09.4.46.15.88.13 1.21.08.37-.05 1.11-.45 1.27-.89.15-.43.15-.81.11-.89-.05-.08-.18-.13-.37-.22z"/>
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

            {/* 4. Scales of Justice & Script (Span 3) */}
            <div className="lg:col-span-3 flex items-center justify-start lg:justify-end gap-3">
              <div className="text-left lg:text-right">
                <p className="font-serif italic text-blue-900/60 dark:text-blue-300/60 text-base sm:text-lg tracking-wide leading-tight select-none">
                  Knowledge<br />Simplifies Life
                </p>
              </div>

              {/* Scales of Justice balanced on Books ("LAW", "JUSTICE", "KNOWLEDGE") SVG */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 relative select-none">
                <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="goldScales" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E5C158" />
                      <stop offset="50%" stopColor="#C59B27" />
                      <stop offset="100%" stopColor="#8C6810" />
                    </linearGradient>
                    <linearGradient id="bookCover1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C29B7F" />
                      <stop offset="100%" stopColor="#8C6647" />
                    </linearGradient>
                    <linearGradient id="bookCover2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D4B59D" />
                      <stop offset="100%" stopColor="#9C7755" />
                    </linearGradient>
                    <linearGradient id="bookCover3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EAD8C7" />
                      <stop offset="100%" stopColor="#B39373" />
                    </linearGradient>
                  </defs>

                  {/* STACK OF 3 BOOKS */}
                  {/* Book 3 (Bottom) - KNOWLEDGE */}
                  <g transform="translate(18, 125)">
                    <rect x="0" y="0" width="124" height="15" rx="3" fill="url(#bookCover1)" />
                    <rect x="2" y="2" width="120" height="11" rx="2" fill="#FAF6F0" opacity="0.9" />
                    <rect x="0" y="0" width="16" height="15" rx="3" fill="url(#bookCover1)" />
                    <text x="60" y="10.5" fill="#4A3525" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1.5" textAnchor="middle">KNOWLEDGE</text>
                  </g>

                  {/* Book 2 (Middle) - JUSTICE */}
                  <g transform="translate(26, 108)">
                    <rect x="0" y="0" width="108" height="15" rx="3" fill="url(#bookCover2)" />
                    <rect x="2" y="2" width="104" height="11" rx="2" fill="#FAF6F0" opacity="0.9" />
                    <rect x="0" y="0" width="15" height="15" rx="3" fill="url(#bookCover2)" />
                    <text x="52" y="10.5" fill="#4A3525" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1.5" textAnchor="middle">JUSTICE</text>
                  </g>

                  {/* Book 1 (Top) - LAW */}
                  <g transform="translate(35, 91)">
                    <rect x="0" y="0" width="90" height="15" rx="3" fill="url(#bookCover3)" />
                    <rect x="2" y="2" width="86" height="11" rx="2" fill="#FAF6F0" opacity="0.9" />
                    <rect x="0" y="0" width="14" height="15" rx="3" fill="url(#bookCover3)" />
                    <text x="44" y="10.5" fill="#4A3525" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1.5" textAnchor="middle">LAW</text>
                  </g>

                  {/* SCALES OF JUSTICE */}
                  {/* Stand Base on Book */}
                  <path d="M68 91 L92 91 L88 84 L72 84 Z" fill="url(#goldScales)" />
                  <ellipse cx="80" cy="84" rx="9" ry="3" fill="url(#goldScales)" />

                  {/* Vertical Column */}
                  <rect x="78" y="24" width="4" height="60" rx="2" fill="url(#goldScales)" />
                  {/* Ornaments on Column */}
                  <circle cx="80" cy="40" r="3.5" fill="url(#goldScales)" />
                  <circle cx="80" cy="20" r="4.5" fill="url(#goldScales)" />
                  <polygon points="80,12 77,19 83,19" fill="url(#goldScales)" />

                  {/* Horizontal Crossbar */}
                  <path d="M32 28 C55 26, 105 26, 128 28 C128 30, 105 28, 80 28 C55 28, 32 30, 32 28 Z" fill="url(#goldScales)" />
                  <circle cx="32" cy="28" r="2.5" fill="url(#goldScales)" />
                  <circle cx="128" cy="28" r="2.5" fill="url(#goldScales)" />

                  {/* Left Chains & Pan */}
                  <line x1="32" y1="28" x2="20" y2="54" stroke="#C59B27" strokeWidth="1" strokeDasharray="2 1" />
                  <line x1="32" y1="28" x2="44" y2="54" stroke="#C59B27" strokeWidth="1" strokeDasharray="2 1" />
                  <path d="M16 54 C16 64, 48 64, 48 54 Z" fill="url(#goldScales)" />
                  <ellipse cx="32" cy="54" rx="16" ry="3.5" fill="#FAF6F0" opacity="0.3" />

                  {/* Right Chains & Pan */}
                  <line x1="128" y1="28" x2="116" y2="54" stroke="#C59B27" strokeWidth="1" strokeDasharray="2 1" />
                  <line x1="128" y1="28" x2="140" y2="54" stroke="#C59B27" strokeWidth="1" strokeDasharray="2 1" />
                  <path d="M112 54 C112 64, 144 64, 144 54 Z" fill="url(#goldScales)" />
                  <ellipse cx="128" cy="54" rx="16" ry="3.5" fill="#FAF6F0" opacity="0.3" />
                </svg>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Centered Slogan & Safe Space for Mobile Devices */}
        <div className="pt-6 pb-12 sm:pb-16 text-center flex items-center justify-center gap-2">
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
