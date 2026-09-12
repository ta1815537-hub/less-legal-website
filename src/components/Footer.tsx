import React from 'react';
import { PageRoute } from '../types';
import { 
  Crown, 
  Layers, 
  Lock,
  BookOpen,
  Info,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';
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

  return (
    <footer className="bg-[#0B1120] text-stone-400 border-t border-white/10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-0 transition-colors w-full mt-auto shrink-0 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Grid */}
        <div className="py-10 sm:py-12">
          {/* Links Columns: 4 Columns (Full Width) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full">
            
            {/* Products */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {isHindi ? 'उत्पाद' : 'Products'}
              </h3>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <button
                    onClick={() => onNavigate('tools')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'लेस क्रिएशन टूल्स' : 'All Utilities'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'हमारे बारे में' : 'About Us'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('founder')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'संस्थापक (अनुराग गुरौली)' : 'Founder & Creator'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {isHindi ? 'संसाधन' : 'Resources'}
              </h3>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <button
                    onClick={() => onNavigate('articles')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'लेख एवं संपादकीय' : 'Articles & Editorial'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('careers')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'करियर अवसर' : 'Careers & Hiring'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'सहायता और संपर्क' : 'Help & Support'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {isHindi ? 'कानूनी नीतियां' : 'Legal'}
              </h3>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <button
                    onClick={() => onNavigate('privacy')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
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
                    {isHindi ? 'रिफंड नीति' : 'Refund & Cancellation'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('disclaimer')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'अस्वीकरण' : 'Legal Disclaimer'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('app-privacy')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'ऐप गोपनीयता' : 'App Privacy Policy'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('app-delete-account')}
                    className="text-red-400 hover:text-red-300 transition-colors cursor-pointer text-left"
                  >
                    {isHindi ? 'खाता हटाएं' : 'Delete Account'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {isHindi ? 'जुड़ें' : 'Connect'}
              </h3>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/anurag-gurauli"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
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
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/lesscreation?stkn=ZThjOTJ2dWpkcnN0"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>

              <div className="pt-2 text-[11px] text-stone-500">
                <span>support@lesscreation.com</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar with Admin Lock and Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-medium">
              © 2026 Less Creation. All rights reserved.
            </span>
            <button
              onClick={handleSecretLockClick}
              className="opacity-15 hover:opacity-70 transition-opacity p-1 text-stone-500 focus:outline-none cursor-pointer"
              aria-label="Admin Security"
            >
              <Lock className="w-2.5 h-2.5" />
            </button>
          </div>

          <p className="text-stone-500 text-[11px] tracking-wide uppercase font-semibold">
            BUILDING A SIMPLER, SMARTER & MORE INFORMED INDIA
          </p>
        </div>

      </div>
    </footer>
  );
};
