import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Download, Sparkles, Moon, Sun } from 'lucide-react';
import { LTLogo } from './LTLogo';
import { motion, AnimatePresence } from 'motion/react';
import { EASING_SPRING } from './MotionWrappers';
import { useTheme } from '../hooks/useTheme';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { isDark: globalIsDark, toggleTheme } = useTheme();
  
  const isHomeRoute = currentRoute === 'home';
  const isDark = isHomeRoute || globalIsDark;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: 'Home', route: 'home' },
    { label: 'About', route: 'about' },
    { label: 'Features', route: 'features' },
    { label: 'Premium', route: 'premium' },
    { label: 'Contact', route: 'contact' },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isDark 
          ? scrolled 
            ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/5 shadow-lg' 
            : 'bg-transparent border-b border-transparent'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <button 
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2, ease: EASING_SPRING }}
            >
              <LTLogo className="w-10 h-10 sm:w-11 sm:h-11" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-xl tracking-tight transition-colors ${
                  isDark ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 dark:text-white group-hover:text-indigo-600'
                }`}>
                  {SITE_CONFIG.companyName || SITE_CONFIG.appName}
                </span>
              </div>
              <p className={`text-[11px] font-medium hidden md:block line-clamp-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
                Technology, Utilities & Digital Products
              </p>
            </div>
          </button>

          {/* Desktop Navigation with Animated Active Pill */}
          <nav className={`hidden md:flex items-center gap-1 lg:gap-1.5 p-1 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100/60 border-slate-200/50'
          }`}>
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.route}`}
                  onClick={() => handleNavClick(item.route)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? (isDark ? 'text-white font-bold' : 'text-indigo-700 font-bold')
                      : (isDark ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-white/50')
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className={`absolute inset-0 rounded-lg shadow-xs border -z-10 ${
                        isDark ? 'bg-white/10 border-white/20' : 'bg-white dark:bg-slate-900 border-indigo-100/80'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-xl transition-colors border ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 text-yellow-300 border-white/20' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200/50'
              }`}
              aria-label="Toggle Dark Mode"
            >
              {globalIsDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <motion.button
              id="nav-premium-btn"
              onClick={() => handleNavClick('premium')}
              whileHover={{ y: -1.5, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 transition-colors flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse-subtle" />
              <span>Ad-Free Plans</span>
            </motion.button>

            <motion.button
              id="nav-download-btn"
              onClick={() => handleNavClick('download')}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2, ease: EASING_SPRING }}
              className="relative group overflow-hidden px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 border border-indigo-500/40 flex items-center gap-2"
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
              <span>Download App</span>
            </motion.button>
          </div>

          {/* Mobile Hamburger / X Button with Smooth SVG Morph */}
          <div className="flex md:hidden items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.92 }}
              className={`p-2 rounded-lg shadow-xs sm:hidden ${
                isDark ? 'bg-white/10 text-yellow-300' : 'bg-slate-100 text-slate-700'
              }`}
              aria-label="Toggle Dark Mode"
            >
              {globalIsDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <motion.button
              id="nav-mobile-download-icon"
              onClick={() => handleNavClick('download')}
              whileTap={{ scale: 0.92 }}
              className={`p-2 rounded-lg shadow-xs sm:hidden ${
                isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-600 text-white'
              }`}
              aria-label="Download App"
            >
              <Download className="w-4 h-4" />
            </motion.button>

            <button
              id="nav-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl focus:outline-none transition-colors ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'
              }`}
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between items-center">
                <span
                  className={`w-6 h-0.5 rounded-full transition-all duration-300 transform origin-left ${
                    isDark ? 'bg-white dark:bg-slate-900' : 'bg-slate-700'
                  } ${
                    mobileMenuOpen ? 'rotate-45 translate-x-0.5 -translate-y-0.5' : ''
                  }`}
                />
                <span
                  className={`w-6 h-0.5 rounded-full transition-all duration-200 ${
                    isDark ? 'bg-white dark:bg-slate-900' : 'bg-slate-700'
                  } ${
                    mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`w-6 h-0.5 rounded-full transition-all duration-300 transform origin-left ${
                    isDark ? 'bg-white dark:bg-slate-900' : 'bg-slate-700'
                  } ${
                    mobileMenuOpen ? '-rotate-45 translate-x-0.5 translate-y-0.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer with AnimatePresence & Staggered Items */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: EASING_SPRING }}
            style={{ willChange: "transform, opacity" }}
            className={`md:hidden absolute top-full left-0 right-0 border-b shadow-xl px-4 pt-3 pb-6 space-y-3 overflow-hidden z-40 ${
              isDark ? 'bg-slate-950/95 backdrop-blur-xl border-white/10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80'
            }`}
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
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? (isDark ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100')
                        : (isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800')
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
              className={`pt-3 border-t grid grid-cols-2 gap-2 ${
                isDark ? 'border-white/10' : 'border-slate-100 dark:border-slate-700/50'
              }`}
            >
              <button
                id="mobile-premium-btn"
                onClick={() => handleNavClick('premium')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border text-center flex items-center justify-center gap-1.5 active:scale-95 transition-transform ${
                  isDark ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30' : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premium Passes</span>
              </button>
              <button
                id="mobile-download-drawer-btn"
                onClick={() => handleNavClick('download')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md text-center flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download App</span>
              </button>
            </motion.div>

            <div className={`pt-2 text-center text-xs font-medium ${isDark ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400'}`}>
              Less Technologies • Built with Simplicity
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

