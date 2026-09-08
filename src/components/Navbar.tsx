import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Layers, Sparkles, Moon, Sun, Globe, Search, Download,
  X, Home, Scale, BookOpen, Info, User, 
  MessageSquare, ChevronRight, ArrowRight, Smartphone, Briefcase
} from 'lucide-react';
import { LTLogo } from './LTLogo';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { EASING_SPRING } from './MotionWrappers';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage, SiteAppConfig } from '../utils/adminStorage';
import { TOTAL_TOOLS_COUNT } from '../tools/toolRegistry';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteAppConfig>(adminStorage.getSiteAppConfig());
  
  const { isDark: globalIsDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const isHindi = language === 'hi';

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = adminStorage.subscribeToSiteAppConfig((updated) => {
      setSiteConfig(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const scrollToProducts = () => {
    onNavigate('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('product-ecosystem')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const desktopNavLinks: { label: string; route: PageRoute; badge?: string }[] = [
    { label: isHindi ? 'होम' : 'Home', route: 'home' },
    { label: isHindi ? 'लेख' : 'Articles', route: 'articles', badge: 'New' },
    { label: isHindi ? 'टूल्स' : 'Tools', route: 'tools', badge: `${TOTAL_TOOLS_COUNT}` },
    { label: isHindi ? 'लेस लीगल' : 'Less Legal', route: 'less-legal', badge: isHindi ? 'फ्लैगशिप' : 'Flagship' },
    { label: isHindi ? 'लेस क्रिएशन' : 'About', route: 'about' },
    { label: isHindi ? 'संस्थापक' : 'Founder', route: 'founder' },
    { label: isHindi ? 'संसाधन' : 'Resources', route: 'resources' },
    { label: isHindi ? 'प्रीमियम' : 'Premium', route: 'premium', badge: '₹99' },
    { label: isHindi ? 'संपर्क' : 'Contact', route: 'contact' },
  ];

  return (
    <>
      {/* Top Promotional Announcement Bar */}
      {siteConfig.announcementActive && (
        <div className="fixed top-0 left-0 right-0 h-9 sm:h-10 z-[65] bg-gradient-to-r from-slate-950 via-[#0D2447] to-slate-950 border-b border-blue-500/25 flex items-center justify-center px-2 sm:px-4 text-white overflow-hidden select-none">
          {/* Subtle royal blue shining line inside the banner */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.12),transparent)] bg-[length:200%_100%] animate-pulse pointer-events-none" />
          
          <div className="max-w-[1400px] w-full flex items-center justify-between sm:justify-center gap-1.5 sm:gap-6 text-xs font-semibold">
            {/* Offer text - Guaranteed single line on all mobile screens */}
            <div className="flex items-center gap-1.5 shrink min-w-0">
              <span className="text-xs text-amber-400 shrink-0">✨</span>
              <span className="text-[10px] sm:text-xs font-extrabold text-sky-300 dark:text-sky-200 tracking-wide uppercase whitespace-nowrap truncate max-w-[220px] sm:max-w-none">
                {language === 'hi' 
                  ? (siteConfig.announcementTextHi || siteConfig.announcementTextHindi || 'लेस लीगल लाइफटाइम पास • मात्र ₹99 एकमुश्त • कोई सब्सक्रिप्शन नहीं')
                  : (siteConfig.announcementTextEn || siteConfig.announcementTextEnglish || 'Less Legal Lifetime Pass • ₹99 One-Time Access • No Subscriptions')}
              </span>
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleNavClick((siteConfig.announcementLink as PageRoute) || (siteConfig.announcementButtonRoute as PageRoute) || 'premium')}
                className="red-shimmer-button text-[9px] sm:text-[11px] px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider font-black cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1 text-white"
              >
                <Sparkles className="w-3 h-3 fill-white text-white shrink-0" />
                <span>
                  {language === 'hi'
                    ? (siteConfig.announcementButtonTextHi || siteConfig.announcementButtonText || 'ऑफ़र लें')
                    : (siteConfig.announcementButtonTextEn || siteConfig.announcementButtonText || 'Get Pass')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="fixed top-9 sm:top-10 left-0 right-0 h-0.5 sm:h-1 z-[60] bg-gradient-to-r from-amber-400 via-blue-500 to-indigo-600 dark:from-[#D8BD82] dark:via-blue-500 dark:to-indigo-500"
      />
      <header className="fixed top-9 sm:top-10 z-50 w-full bg-white/40 dark:bg-[#090D1A]/60 backdrop-blur-xl border-b border-slate-200/40 dark:border-white/10 shadow-xs transition-all duration-300">
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
            {desktopNavLinks.map((item) => {
              const isActive = currentRoute === item.route;
              const isPremium = item.route === 'premium';
              return (
                <a
                  key={item.route}
                  href={`/${item.route === 'home' ? '' : item.route}`}
                  id={`nav-link-${item.route}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.route); }}
                  className={`relative px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap single-line-fit flex items-center gap-1.5 ${
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
                  {item.badge && !isPremium && (
                    <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {item.badge}
                    </span>
                  )}
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
                onClick={() => handleNavClick('resources')}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 dark:border-blue-500/30 cursor-pointer shrink-0 backdrop-blur-md"
                aria-label="Resources & Tools"
                title="Resources & Tools"
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

      {/* Mobile Polished Navigation Panel (Redesigned Ultra-Luxury Side Glass Sheet) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Click-away backdrop overlay with smooth blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="lg:hidden absolute top-full left-3 right-3 sm:left-4 sm:right-4 mt-2 p-3.5 sm:p-5 rounded-[26px] bg-gradient-to-b from-white/98 via-slate-50/95 to-white/98 dark:from-[#0E1322]/98 dark:via-[#090D18]/98 dark:to-[#060812]/98 backdrop-blur-3xl border border-slate-200/90 dark:border-white/12 shadow-[0_24px_64px_rgba(0,0,0,0.35),0_4px_16px_rgba(37,99,235,0.12)] space-y-3 z-50 overflow-hidden"
            >
              {/* Luxury Top Laser Edge */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-sky-400 via-amber-400 to-indigo-600" />

              {/* Navigation List - Ordered: Home -> Articles -> Tools -> Founder -> Careers -> About */}
              <div className="flex flex-col space-y-1.5 pt-1">
                
                {/* 1. Home */}
                <button
                  id="mobile-nav-home"
                  onClick={() => handleNavClick('home')}
                  className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 cursor-pointer group ${
                    currentRoute === 'home'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/18 border border-blue-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      currentRoute === 'home'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    }`}>
                      <Home className="w-4 h-4" />
                    </div>
                    <span className="whitespace-nowrap font-bold">{isHindi ? 'होम' : 'Home'}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${currentRoute === 'home' ? 'text-blue-500 translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                </button>

                {/* 2. Articles (लेख व संपादकीय) */}
                <button
                  id="mobile-nav-articles"
                  onClick={() => handleNavClick('articles')}
                  className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 cursor-pointer group ${
                    currentRoute === 'articles' || currentRoute === 'article-detail'
                      ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/18 border border-sky-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      currentRoute === 'articles' || currentRoute === 'article-detail'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                    }`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="whitespace-nowrap font-bold">{isHindi ? 'लेख व संपादकीय' : 'Articles & Insights'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 uppercase tracking-wide">
                      {isHindi ? 'नया' : 'New'}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${(currentRoute === 'articles' || currentRoute === 'article-detail') ? 'text-sky-500 translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                  </div>
                </button>

                {/* 3. Tools Ecosystem */}
                <button
                  id="mobile-nav-tools"
                  onClick={() => handleNavClick('tools')}
                  className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 cursor-pointer group ${
                    currentRoute === 'tools'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/18 border border-blue-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      currentRoute === 'tools'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    }`}>
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="whitespace-nowrap font-bold">{isHindi ? `${TOTAL_TOOLS_COUNT} स्मार्ट टूल्स` : `${TOTAL_TOOLS_COUNT} Utilities`}</span>
                  </div>
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 shrink-0 uppercase tracking-wide">
                    {TOTAL_TOOLS_COUNT} {isHindi ? 'टूल्स' : 'Tools'}
                  </span>
                </button>

                {/* 4. Founder */}
                <button
                  id="mobile-nav-founder"
                  onClick={() => handleNavClick('founder')}
                  className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 cursor-pointer group ${
                    currentRoute === 'founder'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/18 border border-indigo-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      currentRoute === 'founder'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="whitespace-nowrap font-bold">{isHindi ? 'संस्थापक' : 'Founder'}</span>
                      <span className="text-[10px] text-slate-400 font-semibold hidden xs:inline truncate">
                        (अनुराग गुरौली)
                      </span>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0 uppercase tracking-wide">
                    Creator
                  </span>
                </button>

                {/* 5. Careers & Hiring */}
                <button
                  id="mobile-nav-careers"
                  onClick={() => handleNavClick('careers')}
                  className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 cursor-pointer group ${
                    currentRoute === 'careers'
                      ? 'text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-500/18 border border-violet-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      currentRoute === 'careers'
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20'
                    }`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="whitespace-nowrap font-bold">{isHindi ? 'करियर व जॉब्स' : 'Careers & Jobs'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wide flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>{isHindi ? 'हायरिंग' : 'Hiring'}</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>

                {/* 6. About Less Creation */}
                <button
                  id="mobile-nav-about"
                  onClick={() => handleNavClick('about')}
                  className={`w-full py-2.5 px-3 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 cursor-pointer group ${
                    currentRoute === 'about'
                      ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/18 border border-sky-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      currentRoute === 'about'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                    }`}>
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="whitespace-nowrap font-bold">{isHindi ? 'लेस क्रिएशन के बारे में' : 'About Less Creation'}</span>
                  </div>
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0 uppercase tracking-wide">
                    Studio
                  </span>
                </button>
              </div>

              {/* Ultra-Modern Twin Utility Controls: Language & Theme */}
              <div className="pt-2.5 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 gap-2">
                {/* Language Switch */}
                <button
                  id="mobile-nav-lang-btn"
                  onClick={toggleLanguage}
                  className="py-2.5 px-3 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100/90 dark:bg-white/6 border border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-white/12 transition-all active:scale-98 shadow-xs"
                >
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="whitespace-nowrap font-extrabold">{language === 'hi' ? 'English (EN)' : 'हिन्दी (HI)'}</span>
                </button>

                {/* Theme Switch */}
                <button
                  id="mobile-nav-theme-btn"
                  onClick={toggleTheme}
                  className="py-2.5 px-3 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100/90 dark:bg-white/6 border border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-white/12 transition-all active:scale-98 shadow-xs"
                >
                  {globalIsDark ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="whitespace-nowrap font-extrabold text-amber-300">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="whitespace-nowrap font-extrabold text-slate-700">Dark Mode</span>
                    </>
                  )}
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
