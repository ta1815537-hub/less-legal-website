import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { ChevronRight, Globe, Lock } from 'lucide-react';
import { LTLogo } from './LTLogo';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const isHindi = language === 'hi';
  const { scrollYProgress } = useScroll();

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
    return () => window.removeEventListener('pointerdown', handleOutsideTap);
  }, [mobileMenuOpen]);

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

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
      {/* Cyber Red Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="fixed left-0 right-0 top-0 h-0.5 z-[70] bg-[#DC2626] transition-all duration-300"
      />

      {/* Obsidian Black & Crimson Floating Header Bar */}
      <header className="fixed top-2 sm:top-3 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none">
        <div className="max-w-7xl mx-auto relative rounded-xl sm:rounded-2xl bg-[#030509]/95 bg-gradient-to-r from-[#160509]/95 via-[#030509]/95 to-[#160509]/95 backdrop-blur-xl border border-red-500/25 shadow-[0_14px_40px_rgba(0,0,0,0.85)] px-3.5 sm:px-5 py-2 pointer-events-auto transition-all overflow-hidden">
          {/* Top Precision Crimson Edge Hairline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
          />

          <div className="flex items-center justify-between gap-3 relative z-10">
            {/* BRAND ZONE with 3-Line Menu Trigger */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                id="nav-mobile-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-red-600/15 border border-transparent hover:border-red-500/30 transition-colors cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                <div className="w-4 h-3.5 relative flex flex-col justify-between items-center">
                  <span className={`w-4 h-0.5 rounded-full bg-current transition-all duration-200 origin-left ${mobileMenuOpen ? 'rotate-45 translate-x-0.5 -translate-y-0.5' : ''}`} />
                  <span className={`w-4 h-0.5 rounded-full bg-current transition-all duration-150 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                  <span className={`w-4 h-0.5 rounded-full bg-current transition-all duration-200 origin-left ${mobileMenuOpen ? '-rotate-45 translate-x-0.5 translate-y-0.5' : ''}`} />
                </div>
              </button>

              <a
                href="/"
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer shrink-0"
              >
                <LTLogo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                <span className="text-sm sm:text-base font-bold tracking-tight text-white leading-none whitespace-nowrap">
                  Less Creation
                </span>
              </a>
            </div>

            {/* DESKTOP NAV LINKS */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              {desktopNavLinks.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <a
                    key={item.route}
                    href={`/${item.route === 'home' ? '' : item.route}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.route); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'font-semibold bg-red-600/20 border border-red-500/40 text-red-300'
                        : 'text-stone-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* ACTIONS: Language Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-200 hover:bg-red-600/15 border border-white/15 hover:border-red-500/35 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap bg-[#070B12]"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{isHindi ? 'English' : 'हिन्दी'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-Line Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs cursor-pointer pointer-events-auto"
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                id="mobile-nav-drawer"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-full left-3 right-3 sm:left-6 sm:right-auto sm:w-80 mt-2 p-4 rounded-xl sm:rounded-2xl bg-[#030509] border border-red-500/25 shadow-[0_24px_60px_rgba(0,0,0,0.9)] space-y-3 z-50 overflow-hidden pointer-events-auto"
              >
                <div className="flex flex-col space-y-1">
                  {desktopNavLinks.map((link) => {
                    const isActive = currentRoute === link.route;
                    return (
                      <button
                        key={link.route}
                        onClick={() => handleNavClick(link.route)}
                        className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/35'
                            : 'text-stone-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/10 space-y-2">
                  <button
                    onClick={toggleLanguage}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-red-600/15 border border-white/10 hover:border-red-500/30 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{isHindi ? 'English' : 'हिन्दी'}</span>
                  </button>

                  {/* Subtle bottom row with discreet secret Admin Lock Icon */}
                  <div className="pt-1 flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono text-stone-600 select-none">
                      Less Creation
                    </span>
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="opacity-20 hover:opacity-80 transition-opacity p-1.5 rounded-lg text-stone-400 hover:text-red-400 focus:outline-none cursor-pointer"
                      aria-label="System Lock"
                      title=""
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
