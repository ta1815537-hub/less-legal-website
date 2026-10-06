import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { 
  Moon, Sun, ChevronRight, Globe, ShieldCheck, ArrowRight
} from 'lucide-react';
import { LTLogo } from './LTLogo';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage, SiteAppConfig } from '../utils/adminStorage';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteAppConfig>(adminStorage.getSiteAppConfig());
  
  const { language, toggleLanguage } = useLanguage();
  const isHindi = language === 'hi';

  const { isDark, toggleTheme } = useTheme();

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = adminStorage.subscribeToSiteAppConfig((updated) => {
      setSiteConfig(updated);
    });
    return () => unsubscribe();
  }, []);

  // Auto-close drawer on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleOutsideTap = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const drawer = document.getElementById('mobile-nav-drawer');
      const toggleBtn = document.getElementById('nav-mobile-toggle-btn');
      if (drawer && !drawer.contains(target) && toggleBtn && !toggleBtn.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handleOutsideTap, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleOutsideTap);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  // Pure, clean navigation links without subtitle clutter or badges
  const desktopNavLinks: { label: string; route: PageRoute }[] = [
    { label: isHindi ? 'होम' : 'Home', route: 'home' },
    { label: isHindi ? 'लेख' : 'Articles', route: 'articles' },
    { label: isHindi ? 'टूल्स' : 'Tools', route: 'tools' },
    { label: isHindi ? 'संस्थापक' : 'Founder', route: 'founder' },
    { label: isHindi ? 'परिचय' : 'About', route: 'about' },
    { label: isHindi ? 'संपर्क' : 'Contact', route: 'contact' },
  ];

  return (
    <>
      {/* Cyber Red Precision Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="fixed left-0 right-0 top-0 h-0.5 z-[70] bg-[#DC2626] transition-all duration-300"
      />

      {/* Floating Card Header Bar */}
      <header className="fixed top-2 sm:top-3.5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none">
        {/* Subtle Ambient Header Glow */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-12 bg-red-600/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl bg-[#0B111E]/85 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 px-3.5 sm:px-6 py-2.5 sm:py-3 pointer-events-auto transition-all">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            
            {/* BRAND ZONE: Wordmark Only */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Mobile Hamburger Button */}
              <button
                id="nav-mobile-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                <div className="w-4 h-3.5 relative flex flex-col justify-between items-center">
                  <span
                    className={`w-4 h-0.5 rounded-full bg-current transition-all duration-200 origin-left ${
                      mobileMenuOpen ? 'rotate-45 translate-x-0.5 -translate-y-0.5' : ''
                    }`}
                  />
                  <span
                    className={`w-4 h-0.5 rounded-full bg-current transition-all duration-150 ${
                      mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`w-4 h-0.5 rounded-full bg-current transition-all duration-200 origin-left ${
                      mobileMenuOpen ? '-rotate-45 translate-x-0.5 translate-y-0.5' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Single Wordmark Element */}
              <a 
                id="nav-brand-logo"
                href="/"
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer shrink-0"
              >
                <LTLogo className="w-8 h-8 sm:w-8.5 sm:h-8.5 shrink-0" />
                <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                  Less Creation
                </span>
              </a>
            </div>

            {/* NAV LINKS ZONE: Clean Single-Line Text Links */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              {desktopNavLinks.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <a
                    key={item.route}
                    href={`/${item.route === 'home' ? '' : item.route}`}
                    id={`nav-link-${item.route}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.route); }}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-white font-semibold bg-red-600/25 border border-red-500/40 text-red-300 shadow-sm shadow-red-950/40'
                        : 'text-stone-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* ACTIONS ZONE: Language Switcher Only */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-300 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap bg-white/5"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-red-400" />
                <span>{isHindi ? 'English' : 'हिन्दी'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer with Explicit Pointer Events */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden cursor-pointer pointer-events-auto"
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                id="mobile-nav-drawer"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="lg:hidden absolute top-full left-3 right-3 sm:left-6 sm:right-6 mt-2 p-4 rounded-2xl bg-[#0D1220] border border-white/15 shadow-2xl space-y-3 z-50 overflow-hidden pointer-events-auto"
              >
                <div className="flex flex-col space-y-1">
                  {desktopNavLinks.map((link) => {
                    const isActive = currentRoute === link.route;
                    return (
                      <button
                        key={link.route}
                        onClick={() => handleNavClick(link.route)}
                        className={`w-full py-2.5 px-3.5 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/30'
                            : 'text-stone-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/10 space-y-2">
                  {/* Language Switcher in Mobile Drawer */}
                  <button
                    onClick={toggleLanguage}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-red-400" />
                    <span>{isHindi ? 'English' : 'हिन्दी भाषा'}</span>
                  </button>

                  {/* Theme Switcher in Mobile Drawer */}
                  <button
                    onClick={toggleTheme}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isDark ? (
                      <Sun className="w-3.5 h-3.5 text-yellow-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                    <span>{isHindi ? (isDark ? 'लाइट मोड' : 'डार्क मोड') : (isDark ? 'Light Mode' : 'Dark Mode')}</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
