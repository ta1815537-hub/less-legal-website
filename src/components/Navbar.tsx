import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Layers, Sparkles, Moon, Sun, Globe, Search, Download } from 'lucide-react';
import { LTLogo } from './LTLogo';
import { motion, AnimatePresence, useScroll } from 'motion/react';
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

  const { scrollYProgress } = useScroll();

  // Persistent Countdown Timer for FOMO
  const [timeLeft, setTimeLeft] = useState({ days: 28, hours: 23, minutes: 47, seconds: 12 });

  useEffect(() => {
    const STORAGE_KEY = 'less_legal_promo_target_v4_28d';
    let targetTime = localStorage.getItem(STORAGE_KEY);
    
    // 28 days, 23 hours, 47 minutes, 12 seconds
    const initialDuration = (28 * 24 * 3600 + 23 * 3600 + 47 * 60 + 12) * 1000;
    
    if (!targetTime) {
      const newTarget = Date.now() + initialDuration;
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
      targetTime = newTarget.toString();
    }

    const interval = setInterval(() => {
      const difference = parseInt(targetTime!) - Date.now();
      if (difference <= 0) {
        // Reset countdown to a new 28d 23h cycle if it finishes to maintain FOMO urgency
        const newTarget = Date.now() + initialDuration;
        localStorage.setItem(STORAGE_KEY, newTarget.toString());
      } else {
        const totalSecs = Math.floor(difference / 1000);
        const d = Math.floor(totalSecs / (24 * 3600));
        const remSecs = totalSecs % (24 * 3600);
        const h = Math.floor(remSecs / 3600);
        const m = Math.floor((remSecs % 3600) / 60);
        const s = remSecs % 60;
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    <>
      {/* Top Promotional FOMO Bar */}
      <div className="fixed top-0 left-0 right-0 h-10 sm:h-11 z-[65] bg-gradient-to-r from-slate-950 via-[#0D2447] to-slate-950 border-b border-blue-500/25 flex items-center justify-center px-1.5 sm:px-3 text-white overflow-hidden select-none">
        {/* Subtle royal blue shining line inside the banner */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.12),transparent)] bg-[length:200%_100%] animate-pulse pointer-events-none" />
        
        <div className="max-w-[1400px] w-full flex items-center justify-center gap-1.5 sm:gap-4 text-xs font-semibold">
          {/* Offer text */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] sm:text-xs animate-bounce shrink-0">🔥</span>
            <span className="text-[9.5px] sm:text-xs font-black text-sky-400 uppercase tracking-wider whitespace-nowrap">
              {language === 'hi' ? 'लाइफटाइम मेंबरशिप सिर्फ ₹99 में!' : 'Lifetime Membership just ₹99!'}
            </span>
          </div>

          {/* Countdown timer & Claim Button */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Timer Wrapper */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-black/40 border border-blue-500/20 px-1 sm:px-2.5 py-0.5 rounded-lg font-mono text-[9px] sm:text-xs font-black text-sky-300 shrink-0">
              <span className="text-slate-300 font-bold">{timeLeft.days}</span>
              <span className="text-amber-400 text-[8px] sm:text-[10px] font-bold mr-0.5">{language === 'hi' ? 'दिन' : 'd'}</span>
              
              <span className="text-slate-300 font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="text-amber-400 text-[8px] sm:text-[10px] font-bold mr-0.5">{language === 'hi' ? 'घंटे' : 'h'}</span>
              
              <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="animate-pulse text-slate-400">:</span>
              <span className="text-red-400">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>

            {/* Shine Button */}
            <button
              onClick={() => handleNavClick('premium')}
              className="gold-shimmer-button text-[9px] sm:text-xs px-2 sm:px-4 py-0.5 sm:py-1 rounded-full uppercase tracking-wider font-extrabold cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
            >
              {language === 'hi' ? 'ऑफ़र लें' : 'Claim Offer'}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="fixed top-10 sm:top-11 left-0 right-0 h-1 sm:h-1.5 z-[60] bg-gradient-to-r from-amber-400 via-[#E03A3E] to-[#8B0000] dark:from-[#D8BD82] dark:via-[#E03A3E] dark:to-[#C21F2F]"
      />
      <header className="fixed top-10 sm:top-11 z-50 w-full bg-white/30 dark:bg-[#080808]/30 backdrop-blur-xl border-b border-slate-200/30 dark:border-white/10 shadow-sm transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-4 xl:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-2 lg:gap-3">
          
          {/* LEFT GROUP: Mobile Hamburger Menu Trigger + Brand Logo & Shlok */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
            {/* Mobile Hamburger Menu Trigger */}
            <div className="flex lg:hidden items-center shrink-0">
              <button
                id="nav-mobile-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-800 dark:text-[#F5F2EE] hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 focus:outline-none transition-all cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between items-center">
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

            {/* Brand Logo & Studio Sub-label */}
            <a 
              id="nav-brand-logo"
              href="/"
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
              className="flex items-center gap-1.5 sm:gap-2.5 text-left group focus:outline-none cursor-pointer shrink-0"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: EASING_SPRING }}
                className="p-1 sm:p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs shrink-0"
              >
                <LTLogo className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10" />
              </motion.div>
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-sm sm:text-base md:text-xl tracking-tight text-slate-900 dark:text-[#F5F2EE] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
                    {SITE_CONFIG.companyName || 'Less Creation'}
                  </span>
                </div>
                <p className="text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-semibold text-amber-800 dark:text-[#D8BD82] whitespace-nowrap tracking-tight leading-tight">
                  अप्राप्यं नाम नेहास्ति धीरस्य व्यवसायिनः
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Integrated Navigation Bar (Visible only on lg:flex) */}
          <nav className="hidden lg:flex items-center gap-1 px-1.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 backdrop-blur-md shrink-0">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              const isPremium = item.route === 'premium';
              return (
                <a
                  key={item.route}
                  href={`/${item.route === 'home' ? '' : item.route}`}
                  id={`nav-link-${item.route}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.route); }}
                  className={`relative px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap single-line-fit flex items-center gap-1 ${
                    isActive
                      ? 'text-blue-600 bg-blue-500/10 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-500/25 dark:border-blue-500/30 shadow-2xs backdrop-blur-md'
                      : isPremium
                      ? 'text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-950/30'
                      : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-[#F5F2EE] hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  {isPremium && (
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                  )}
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* RIGHT SIDE: Combined desktop CTAs + Mobile useful buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-1.5 xl:gap-3.5 shrink-0">
            
            {/* Mobile-only controls (Theme, Features) (Visible only on lg:hidden) */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-[#D8BD82] border border-slate-200 dark:border-white/10 cursor-pointer shrink-0"
                aria-label="Toggle Theme"
              >
                {globalIsDark ? <Sun className="w-4 h-4 text-[#D8BD82]" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </motion.button>

              <motion.button
                id="nav-mobile-features-icon"
                onClick={() => handleNavClick('features')}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 dark:border-blue-500/30 cursor-pointer shrink-0 backdrop-blur-md"
                aria-label="Useful Features"
              >
                <Layers className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Desktop-only CTA Controls (Visible only on lg:flex) */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-3 shrink-0">
              {/* Theme Switcher Toggle Pill (Sun & Moon capsule) */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                className="px-2 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/90 dark:border-white/10 transition-colors flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
                aria-label="Toggle Theme"
                title={globalIsDark ? "Switch to White / Light Theme" : "Switch to Dark Glass Theme"}
              >
                <span className={`p-1 rounded-full transition-colors ${!globalIsDark ? 'bg-amber-100 text-amber-600 shadow-2xs' : 'text-slate-400'}`}>
                  <Sun className="w-3.5 h-3.5" />
                </span>
                <span className={`p-1 rounded-full transition-colors ${globalIsDark ? 'bg-blue-900/60 text-blue-400 shadow-2xs' : 'text-slate-400'}`}>
                  <Moon className="w-3.5 h-3.5" />
                </span>
              </motion.button>

              {/* Search Button */}
              <motion.button
                onClick={() => onNavigate('features')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                className="p-2 xl:p-2.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-white/10 transition-colors flex items-center justify-center cursor-pointer shadow-xs shrink-0"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {/* Language Switcher Pill */}
              <motion.button
                onClick={toggleLanguage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1.5 xl:px-3 xl:py-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 transition-colors flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
                title="Change Language / भाषा बदलें"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-extrabold">{language === 'hi' ? 'EN' : 'HI'}</span>
              </motion.button>

              {/* Premium Pass Button */}
              <motion.button
                onClick={() => onNavigate('premium')}
                whileHover={{ y: -1.5, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full text-xs xl:text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-[0_4px_18px_rgba(59,130,246,0.35)] transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse shrink-0" />
                <span>{language === 'hi' ? 'प्रीमियम' : 'Premium'}</span>
              </motion.button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Glass Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -15 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            style={{ willChange: "transform, opacity" }}
            className="lg:hidden absolute top-full left-4 right-4 mt-2 p-4.5 sm:p-5 rounded-[24px] bg-white/95 dark:bg-[#08080C]/95 backdrop-blur-3xl border border-white/45 dark:border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] space-y-4 z-40 overflow-hidden"
          >
            {/* Elegant glass accent line inside */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 dark:from-blue-400/20 dark:via-[#D8BD82]/20 dark:to-red-400/20" />

            <div className="flex flex-col space-y-1.5">
              {navLinks.map((item, idx) => {
                const isActive = currentRoute === item.route;
                return (
                  <motion.button
                    key={item.route}
                    id={`mobile-nav-${item.route}`}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03, type: "spring", stiffness: 350, damping: 25 }}
                    onClick={() => handleNavClick(item.route)}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                    className={`text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap badge-one-line flex items-center justify-between group ${
                      isActive
                        ? 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/35 shadow-[0_4px_24px_rgba(37,99,235,0.12)]'
                        : 'text-slate-700 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-[#F5F2EE] hover:bg-white/40 dark:hover:bg-white/5 border border-transparent hover:border-slate-200/50 dark:hover:border-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 dark:text-blue-400 transform translate-x-2 group-hover:translate-x-0 transition-transform font-bold text-base leading-none">
                      →
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 350, damping: 25 }}
              className="pt-3.5 border-t border-slate-200/60 dark:border-white/10 space-y-2.5"
            >
              {/* Language Switcher Card - Beautiful Glass design */}
              <button
                onClick={toggleLanguage}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-900 dark:text-[#F5F2EE] bg-white/45 dark:bg-white/5 border border-slate-200/65 dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
              >
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{language === 'hi' ? 'Switch to English' : 'हिन्दी (Hindi) में बदलें'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="mobile-premium-btn"
                  onClick={() => handleNavClick('premium')}
                  className="w-full py-3 px-3 rounded-xl text-xs font-black text-amber-800 dark:text-[#D8BD82] bg-amber-500/15 dark:bg-[#D8BD82]/15 border border-amber-600/35 dark:border-[#D8BD82]/35 text-center flex items-center justify-center gap-1.5 active:scale-[0.97] hover:bg-amber-500/25 transition-all cursor-pointer whitespace-nowrap badge-one-line"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-[#D8BD82] fill-amber-500/30 shrink-0" />
                  <span className="whitespace-nowrap leading-none">{t.nav.premium}</span>
                </button>
                <button
                  id="mobile-features-drawer-btn"
                  onClick={() => handleNavClick('features')}
                  className="w-full py-3 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-md shadow-blue-500/20 text-center flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all cursor-pointer whitespace-nowrap badge-one-line"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap leading-none">{language === 'en' ? 'Useful Features' : 'उपयोगी सुविधाएँ'}</span>
                </button>
              </div>
            </motion.div>

            <div className="pt-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#77736F]">
              Less Creation • {language === 'hi' ? 'सरलता के साथ निर्मित' : 'Built with Simplicity'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  );
};
