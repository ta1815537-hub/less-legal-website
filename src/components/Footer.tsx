import React from 'react';
import { PageRoute } from '../types';
import { 
  Users, 
  LayoutGrid, 
  Crown, 
  ShieldCheck, 
  Smartphone, 
  Layers, 
  Lock,
  BookOpen,
  Info,
  User
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
    <footer className="relative mt-12 overflow-hidden text-slate-600 dark:text-[#B8B3AF] transition-colors duration-300">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-600/5 via-cyan-500/5 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Floating Glassmorphic Footer Card */}
        <div className="bg-white/95 dark:bg-[#101420]/95 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.05)] space-y-8">
          
          {/* Top Multi-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Column 1: Brand & Taglines (Span 4 on Desktop) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                  <LTLogo className="w-10 h-10 sm:w-11 sm:h-11" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight leading-none">
                    <span className="text-slate-900 dark:text-white">Less </span>
                    <span className="text-blue-600 dark:text-blue-400">Creation</span>
                  </h2>
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 mt-1">
                    WHERE LAW MEETS TECHNOLOGY
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                {isHindi ? "डिजिटल सुरक्षा, व्यावहारिक ज्ञान और उपयोगी तकनीक - एक सुरक्षित डिजिटल भविष्य के लिए।" : "Technology, awareness and practical digital knowledge for a safer, more informed digital world."}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isHindi 
                  ? "लेस क्रिएशन एक टेक्नोलॉजी और डिजिटल जागरूकता ब्रांड है। हम लोगों को तकनीक समझने, डिजिटल जोखिमों को पहचानने और आत्मविश्वास के साथ डिजिटल दुनिया में नेविगेट करने में मदद करने के लिए व्यावहारिक डिजिटल उत्पाद और स्पष्ट, सुलभ ज्ञान साझा करते हैं।" 
                  : "Less Creation is a technology and digital awareness brand. We build practical digital products and share clear, accessible knowledge to help people understand technology, recognize digital risks and navigate the digital world with greater confidence."}
              </p>
            </div>


            {/* Links Columns: 2-Grid on Mobile & Tablet, 4-Grid on Desktop (Span 8 on Desktop) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-start">
              
              {/* Column 1: Products */}
              <div className="space-y-3.5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {isHindi ? 'उत्पाद' : 'Products'}
                  </h3>
                  <div className="w-6 h-0.5 bg-blue-600 rounded-full mt-1.5" />
                </div>
                 <ul className="space-y-2 text-xs font-semibold">
                  <li>
                    <button
                      onClick={() => onNavigate('tools')}
                      className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{isHindi ? 'लेस क्रिएशन टूल्स' : 'Less Creation Tools'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('premium')}
                      className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer text-left font-bold"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{isHindi ? 'लाइफटाइम पास (₹99)' : 'Lifetime Pass (₹99)'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('about')}
                      className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{isHindi ? 'हमारे बारे में' : 'About Us'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('founder')}
                      className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{isHindi ? 'संस्थापक' : 'Founder & Creator'}</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 2: Resources */}
              <div className="space-y-3.5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {isHindi ? 'संसाधन' : 'Resources'}
                  </h3>
                  <div className="w-6 h-0.5 bg-blue-600 rounded-full mt-1.5" />
                </div>
                <ul className="space-y-2 text-xs font-semibold">
                  <li>
                    <button
                      onClick={() => onNavigate('articles')}
                      className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{isHindi ? 'लेख एवं ब्लॉग' : 'Articles & Editorial'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('careers')}
                      className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      <span>{isHindi ? 'करियर अवसर' : 'Careers'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('contact')}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      {isHindi ? 'सहायता और संपर्क' : 'Help & Support'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: Legal */}
              <div className="space-y-3.5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {isHindi ? 'कानूनी नीतियां' : 'Legal'}
                  </h3>
                  <div className="w-6 h-0.5 bg-blue-600 rounded-full mt-1.5" />
                </div>
                <ul className="space-y-2 text-xs font-semibold">
                  <li>
                    <button
                      onClick={() => onNavigate('privacy')}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('terms')}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      {isHindi ? 'सेवा की शर्तें' : 'Terms of Service'}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('refund')}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      {isHindi ? 'रिफंड नीति' : 'Refund & Cancellation'}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('disclaimer')}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      {isHindi ? 'अस्वीकरण' : 'Legal Disclaimer'}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('app-privacy')}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      {isHindi ? 'ऐप गोपनीयता' : 'App Privacy Policy'}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('app-delete-account')}
                      className="text-red-500 hover:underline hover:text-red-600 transition-colors cursor-pointer text-left font-bold"
                    >
                      {isHindi ? 'खाता हटाएं' : 'Delete Account'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 4: Connect (With App Card Removed & Spacing Adjusted) */}
              <div className="space-y-3.5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {isHindi ? 'जुड़ें' : 'Connect'}
                  </h3>
                  <div className="w-6 h-0.5 bg-blue-600 rounded-full mt-1.5" />
                </div>
                
                {/* Social Media Channels */}
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/anurag-gurauli"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-full bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center hover:scale-110 hover:bg-[#0A66C2] hover:text-white transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>

                  {/* Telegram */}
                  <a
                    href="https://t.me/Anurag_Gurauli"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="w-8 h-8 rounded-full bg-[#229ED9]/10 dark:bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center hover:scale-110 hover:bg-[#229ED9] hover:text-white transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/share/1L93Tzk74K/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-[#1877F2]/10 dark:bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center hover:scale-110 hover:bg-[#1877F2] hover:text-white transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* Threads */}
                  <a
                    href="https://www.threads.net/@lesscreation"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Threads"
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center hover:scale-110 hover:bg-black hover:text-white transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.8 11.5c0 .85-.65 1.5-1.5 1.5s-1.5-.65-1.5-1.5.65-1.5 1.5-1.5 1.5.65 1.5 1.5zm1.5 0c0-1.8-1.5-3-3.3-3-2.1 0-3.7 1.6-3.7 3.7s1.6 3.7 3.7 3.7c1.1 0 2-.5 2.5-1.2h.1c.1.5.5.9.9.9s.8-.4.8-.9V12c0-3.3-2.6-6-6-6s-6 2.7-6 6 2.7 6 6 6c1.8 0 3.3-.8 4.2-2.1l-1.3-.8c-.6.9-1.7 1.4-2.9 1.4-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5v1.5c0 .3.2.5.5.5s.5-.2.5-.5V12.2c0-.1 0-.1 0 0z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/lesscreation?stkn=ZThjOTJ2dWpkcnN0"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-[#E1306C]/10 dark:bg-[#E1306C]/20 text-[#E1306C] flex items-center justify-center hover:scale-110 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                </div>

                {/* Quick Email Info */}
                <div className="pt-2 text-[11px] text-slate-500">
                  <span className="block font-semibold">{isHindi ? 'आधिकारिक सपोर्ट ईमेल:' : 'Support Email:'}</span>
                  <a href="mailto:support@lesscreation.com" className="text-blue-600 dark:text-blue-400 hover:underline break-all font-medium">
                    support@lesscreation.com
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Slogan with Admin Button & Trust Badge (Moved UP above the bottom bar) */}
          <div className="pt-6 border-t border-slate-200/60 dark:border-white/10 flex flex-col items-center justify-center gap-3 text-center">
            
            {/* BUILDING A SIMPLER, SMARTER AND MORE INFORMED INDIA with secret admin lock */}
            <div className="flex items-center justify-center gap-2">
              <p className="text-[10.5px] sm:text-[11.5px] font-bold text-blue-600/80 dark:text-blue-400/80 tracking-[0.18em] sm:tracking-[0.22em] uppercase select-none">
                BUILDING A SIMPLER, SMARTER AND MORE INFORMED INDIA ❤️
              </p>
              <button
                onClick={handleSecretLockClick}
                className="opacity-20 hover:opacity-70 transition-opacity p-1 text-slate-400 dark:text-slate-500 focus:outline-none cursor-pointer"
                aria-label="Admin Security"
              >
                <Lock className="w-2.5 h-2.5" />
              </button>
            </div>



          </div>

          {/* Very Bottom: Copyright Statement (Sabse Niche) */}
          <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 text-center">
            <p 
              onClick={handleSecretLockClick}
              className="text-xs font-bold select-none cursor-default text-slate-700 dark:text-slate-300 tracking-wide"
            >
              © 2026 Less Creation. All Rights Reserved.
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
};
