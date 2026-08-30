import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Download, Sparkles, Moon, Sun, Globe } from 'lucide-react';
import { LTLogo } from './LTLogo';
import { motion, AnimatePresence } from 'motion/react';
import { EASING_SPRING } from './MotionWrappers';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { isDark: globalIsDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: t.nav.home, route: 'home' },
    { label: t.nav.founder, route: 'founder' },
    { label: t.nav.about, route: 'about' },
    { label: t.nav.features, route: 'features' },
    { label: t.nav.premium, route: 'premium' },
    { label: t.nav.contact, route: 'contact' },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#080808]/95 backdrop-blur-xl border-b border-slate-200/85 dark:border-white/10 shadow-xs dark:shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Studio Sub-label */}
          <button 
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none cursor-pointer shrink-0"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: EASING_SPRING }}
              className="p-1 sm:p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs shrink-0"
            >
              <LTLogo className="w-8 h-8 sm:w-10 sm:h-10" />
            </motion.div>
            <div className="single-line-fit">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg md:text-xl tracking-tight text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:group-hover:text-[#E03A3E] transition-colors whitespace-nowrap">
                  {SITE_CONFIG.companyName || 'Less Technologies'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-amber-800 dark:text-[#D8BD82] whitespace-nowrap badge-one-line">
                अप्राप्यं नाम नेहास्ति धीरस्य व्यवसायिनः
              </p>
            </div>
          </button>

          {/* Desktop Integrated Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 backdrop-blur-md shrink-0">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.route}`}
                  onClick={() => handleNavClick(item.route)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap single-line-fit ${
                    isActive
                      ? 'text-slate-900 dark:text-[#F5F2EE] font-bold'
                      : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-[#F5F2EE] hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#C21F2F]/15 dark:from-[#C21F2F]/30 to-[#8B0000]/10 dark:to-[#8B0000]/20 border border-[#C21F2F]/30 dark:border-[#C21F2F]/50 shadow-xs dark:shadow-[0_0_12px_rgba(194,31,47,0.3)] -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* CTA Controls & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-2 md:gap-2.5 shrink-0">
            
            {/* Theme Switcher Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-800 dark:text-[#D8BD82] border border-slate-200/90 dark:border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              aria-label="Toggle Theme"
              title={globalIsDark ? "Switch to White / Light Theme" : "Switch to Dark Glass Theme"}
            >
              {globalIsDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#D8BD82]" />
                  <span className="text-xs font-bold text-[#D8BD82] whitespace-nowrap">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-xs font-bold text-slate-800 whitespace-nowrap">Dark</span>
                </>
              )}
            </motion.button>

            {/* Ad-Free Plans Gold Button */}
            <motion.button
              id="nav-premium-btn"
              onClick={() => handleNavClick('premium')}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl text-amber-900 dark:text-[#D8BD82] bg-amber-500/10 dark:bg-[#D8BD82]/10 hover:bg-amber-500/20 dark:hover:bg-[#D8BD82]/20 border border-amber-600/30 dark:border-[#D8BD82]/30 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8BD82] animate-pulse shrink-0" />
              <span className="whitespace-nowrap">{t.nav.premium}</span>
            </motion.button>

            {/* Download App Primary Crimson Button */}
            <motion.button
              id="nav-download-btn"
              onClick={() => handleNavClick('download')}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2, ease: EASING_SPRING }}
              className="relative group overflow-hidden px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold btn-crimson flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-y-0.5 transition-transform duration-200 shrink-0" />
              <span className="whitespace-nowrap">{t.nav.download}</span>
            </motion.button>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-[#D8BD82] border border-slate-200 dark:border-white/10 sm:hidden cursor-pointer shrink-0"
              aria-label="Toggle Theme"
            >
              {globalIsDark ? <Sun className="w-4 h-4 text-[#D8BD82]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </motion.button>

            <motion.button
              id="nav-mobile-download-icon"
              onClick={() => handleNavClick('download')}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-xl bg-[#C21F2F]/15 dark:bg-[#C21F2F]/20 text-[#C21F2F] dark:text-[#E03A3E] border border-[#C21F2F]/30 dark:border-[#C21F2F]/40 sm:hidden cursor-pointer shrink-0"
              aria-label="Download App"
            >
              <Download className="w-4 h-4" />
            </motion.button>

            <button
              id="nav-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 dark:text-[#F5F2EE] hover:bg-slate-100 dark:hover:bg-white/10 focus:outline-none transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              <div className="w-5 h-4.5 relative flex flex-col justify-between items-center">
                <span
                  className={`w-5 h-0.5 rounded-full bg-slate-800 dark:bg-[#F5F2EE] transition-all duration-300 transform origin-left ${
                    mobileMenuOpen ? 'rotate-45 translate-x-0.5 -translate-y-0.5' : ''
                  }`}
                />
                <span
                  className={`w-5 h-0.5 rounded-full bg-slate-800 dark:bg-[#F5F2EE] transition-all duration-200 ${
                    mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`w-5 h-0.5 rounded-full bg-slate-800 dark:bg-[#F5F2EE] transition-all duration-300 transform origin-left ${
                    mobileMenuOpen ? '-rotate-45 translate-x-0.5 translate-y-0.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Glass Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: EASING_SPRING }}
            style={{ willChange: "transform, opacity" }}
            className="lg:hidden absolute top-full left-4 right-4 mt-2 p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#0D0D0F]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 shadow-2xl space-y-4 z-40"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((item, idx) => {
                const isActive = currentRoute === item.route;
                return (
                  <motion.button
                    key={item.route}
                    id={`mobile-nav-${item.route}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    onClick={() => handleNavClick(item.route)}
                    className={`text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#C21F2F]/15 dark:bg-[#C21F2F]/20 text-[#C21F2F] dark:text-[#F5F2EE] font-bold border border-[#C21F2F]/30 dark:border-[#C21F2F]/40'
                        : 'text-slate-700 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-[#F5F2EE] hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.25 }}
              className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2"
            >
              <button
                onClick={toggleLanguage}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-900 dark:text-[#F5F2EE] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#C21F2F] dark:text-[#D8BD82]" />
                <span>Switch to {language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="mobile-premium-btn"
                  onClick={() => handleNavClick('premium')}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-amber-900 dark:text-[#D8BD82] bg-amber-500/10 dark:bg-[#D8BD82]/10 border border-amber-600/30 dark:border-[#D8BD82]/30 text-center flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8BD82] shrink-0" />
                  <span className="whitespace-nowrap">{t.nav.premium}</span>
                </button>
                <button
                  id="mobile-download-drawer-btn"
                  onClick={() => handleNavClick('download')}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white btn-crimson text-center flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{t.nav.download}</span>
                </button>
              </div>
            </motion.div>

            <div className="pt-2 text-center text-xs font-medium text-slate-500 dark:text-[#77736F]">
              Less Technologies • Built with Simplicity
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
