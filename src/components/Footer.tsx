import React from 'react';
import { PageRoute } from '../types';
import { Lock, ArrowUp } from 'lucide-react';
import { LTLogo } from './LTLogo';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Secret 10-tap admin lock state
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070B12] text-stone-400 border-t border-white/10 pb-8 pt-10 sm:pt-14 transition-colors w-full mt-auto shrink-0 select-none relative overflow-hidden">
      {/* Soft Ambient Background Accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Brand Row (No Subtitle Text) */}
        <div className="pb-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <LTLogo className="w-10 h-10 shrink-0" />
            <div className="text-xl font-extrabold text-white tracking-tight leading-none">
              Less Creation
            </div>
          </div>
        </div>

        {/* Directory Links Grid: 4 Columns */}
        <div className="py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          
          {/* Products */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{isHindi ? 'उत्पाद व टूल्स' : 'Utilities'}</span>
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onNavigate('tools')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'संपूर्ण 29 टूल्स डायरेक्टरी' : 'All 29+ Local Tools'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('premium')}
                  className="text-stone-400 hover:text-[#C9A24B] transition-colors cursor-pointer text-left font-bold"
                >
                  {isHindi ? 'लाइफटाइम पास (₹99)' : 'Lifetime Pass (₹99)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('download')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'एंड्रॉयड ऐप डाउनलोड' : 'Android App Download'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'हमारे बारे में' : 'About Less Creation'}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
              <span>{isHindi ? 'विधिक संसाधन' : 'Resources'}</span>
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onNavigate('articles')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'लेख व साइबर सुरक्षा गाइड' : 'Cyber Safety Guides'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('founder')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'संस्थापक विवरण' : 'Founder Dossier'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'सहायता और संपर्क' : 'Contact & Support'}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {isHindi ? 'कानूनी नीतियां' : 'Legal Policies'}
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'गोपनीयता नीति' : 'Website Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'सेवा की शर्तें' : 'Terms of Service'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('refund')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'रिफंड व रद्दीकरण' : 'Refund Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disclaimer')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'विधिक अस्वीकरण' : 'Legal Disclaimer'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('app-privacy')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isHindi ? 'मोबाइल ऐप गोपनीयता' : 'App Privacy Policy'}
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Social Channels */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {isHindi ? 'संपर्क व सोशल' : 'Connect'}
            </h3>
            
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://facebook.com/lesscreation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400 border border-white/10 flex items-center justify-center transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>

              <a
                href="https://x.com/lesscreation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C9A24B]/20 text-stone-300 hover:text-[#C9A24B] border border-white/10 flex items-center justify-center transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@LessLegalOfficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500/20 text-stone-300 hover:text-rose-400 border border-white/10 flex items-center justify-center transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Lock, Copyright, and Support Email */}
        <div className="pt-6 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px]">
          <div className="flex items-center gap-3 order-2 sm:order-1">
            {/* Compact Red Support Email - Moved to far left and shrunk */}
            <a
              href="mailto:support@lesscreation.com"
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 text-red-500/60 font-mono text-[8px] font-semibold transition-all cursor-pointer"
              title="Support"
            >
              <span className="truncate uppercase tracking-tighter">support@lesscreation.com</span>
            </a>

            <span className="text-stone-600 font-medium whitespace-nowrap">
              © 2026 Less Creation.
            </span>
          </div>

          <button
            onClick={handleSecretLockClick}
            className="opacity-15 hover:opacity-75 transition-opacity p-1.5 text-stone-400 focus:outline-none cursor-pointer rounded-full order-1 sm:order-2"
            aria-label="Admin Security"
            title="System Security"
          >
            <Lock className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
};
