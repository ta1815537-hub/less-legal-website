import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Layers, Sparkles, Moon, Sun, Globe, Search, Download,
  X, Home, Scale, BookOpen, Info, User, 
  MessageSquare, ChevronRight, ArrowRight, Smartphone
} from 'lucide-react';
import { LTLogo } from './LTLogo';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { EASING_SPRING } from './MotionWrappers';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage, SiteAppConfig } from '../utils/adminStorage';

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
    { label: isHindi ? 'लेस लीगल' : 'Less Legal', route: 'less-legal', badge: isHindi ? 'फ्लैगशिप' : 'Flagship' },
    { label: isHindi ? 'लेस क्रिएशन' : 'About', route: 'about' },
    { label: isHindi ? 'संस्थापक' : 'Founder', route: 'founder' },
    { label: isHindi ? 'संसाधन व टूल्स' : 'Resources', route: 'resources' },
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
            <div className="flex items-center gap-1 shrink min-w-0">
              <span className="text-xs text-amber-400 shrink-0">✨</span>
              <span className="text-[10px] sm:text-xs font-extrabold text-sky-300 dark:text-sky-200 tracking-wide uppercase whitespace-nowrap truncate max-w-[200px] sm:max-w-none">
                {language === 'hi' 
                  ? (siteConfig.announcementTextHindi || 'लेस लीगल लाइफटाइम पास • मात्र ₹99 एकमुश्त • कोई सब्सक्रिप्शन नहीं')
                  : (siteConfig.announcementTextEnglish || 'Less Legal Lifetime Pass • ₹99 One-Time Access • No Subscriptions')}
              </span>
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleNavClick((siteConfig.announcementButtonRoute as PageRoute) || 'premium')}
                className="gold-shimmer-button text-[9px] sm:text-[11px] px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider font-black cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 fill-amber-950 shrink-0" />
                <span>{siteConfig.announcementButtonText || (language === 'hi' ? 'ऑफ़र लें' : 'Get Pass')}</span>
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

      {/* Mobile Polished Navigation Panel (Restored & Ultra-Smooth) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Click-away backdrop overlay */}
            <div
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
              className="lg:hidden absolute top-full left-3 right-3 sm:left-4 sm:right-4 mt-2 p-4 rounded-[24px] bg-white dark:bg-[#0C101A] border border-slate-200/80 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.25)] space-y-3 z-50 overflow-hidden"
            >
              {/* Top brand gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-sky-500 to-amber-500" />

              {/* Navigation List */}
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/5">
                
                {/* 1. Home */}
                <button
                  id="mobile-nav-home"
                  onClick={() => handleNavClick('home')}
                  className={`py-2.5 px-3 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    currentRoute === 'home'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Home className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="whitespace-nowrap truncate">{isHindi ? 'होम' : 'Home'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* 2. Less Legal Flagship */}
                <button
                  id="mobile-nav-less-legal"
                  onClick={() => handleNavClick('less-legal')}
                  className={`py-2.5 px-3 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    currentRoute === 'less-legal' || currentRoute === 'less-legal-features'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="whitespace-nowrap font-extrabold text-slate-900 dark:text-white">Less Legal</span>
                    <span className="text-[9.5px] font-black px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wide shrink-0">
                      {isHindi ? 'फ्लैगशिप' : 'Flagship'}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* 3. Download App Direct Button */}
                <button
                  id="mobile-nav-download"
                  onClick={() => handleNavClick('download')}
                  className={`py-2.5 px-3 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    currentRoute === 'download'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="whitespace-nowrap truncate">{isHindi ? 'ऐप डाउनलोड करें' : 'Download App'}</span>
                    <span className="text-[9.5px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                      v8.7.5
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* 4. Products Accordion / Submenu */}
                <div className="py-1">
                  <button
                    id="mobile-nav-products-accordion"
                    onClick={() => setProductsSubmenuOpen(!productsSubmenuOpen)}
                    className="w-full py-2 px-3 rounded-xl text-left text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="whitespace-nowrap truncate">{isHindi ? 'उत्पाद व इकोसिस्टम' : 'All Products'}</span>
                      <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                        {SITE_CONFIG.products.length}
                      </span>
                    </div>
                    <span className={`text-slate-400 text-xs transition-transform duration-200 ${productsSubmenuOpen ? 'rotate-90' : ''}`}>
                      ›
                    </span>
                  </button>

                  {/* Products Submenu Items */}
                  <AnimatePresence>
                    {productsSubmenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.16 }}
                        className="pl-4 pr-1 py-1 space-y-1 overflow-hidden"
                      >
                        {/* Less Legal Flagship */}
                        <button
                          id="mobile-nav-sub-less-legal"
                          onClick={() => handleNavClick('less-legal')}
                          className="w-full py-2 px-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors border cursor-pointer bg-blue-500/5 dark:bg-blue-500/10 text-slate-800 dark:text-slate-100 hover:bg-blue-500/10 border-blue-500/15"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                            <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">Less Legal App</span>
                          </div>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold whitespace-nowrap">{isHindi ? 'पेज देखें' : 'View'} →</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. About Less Creation */}
                <button
                  id="mobile-nav-about"
                  onClick={() => handleNavClick('about')}
                  className={`py-2.5 px-3 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    currentRoute === 'about'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="whitespace-nowrap truncate">{isHindi ? 'लेस क्रिएशन के बारे में' : 'About Less Creation'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* 6. Founder */}
                <button
                  id="mobile-nav-founder"
                  onClick={() => handleNavClick('founder')}
                  className={`py-2.5 px-3 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    currentRoute === 'founder'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="whitespace-nowrap truncate">{isHindi ? 'संस्थापक (अनुराग गुरौली)' : 'Founder (Anurag Gurauli)'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* 7. Resources */}
                <button
                  id="mobile-nav-resources"
                  onClick={() => handleNavClick('resources')}
                  className={`py-2.5 px-3 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    currentRoute === 'resources'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="whitespace-nowrap truncate">{isHindi ? 'संसाधन और टूल्स' : 'Resources & Tools'}</span>
                    <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      Hub
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* 8. Premium */}
                <button
                  id="mobile-nav-premium-link"
                  onClick={() => handleNavClick('premium')}
                  className={`py-2.5 px-3 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    currentRoute === 'premium'
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/30'
                      : 'text-amber-700 dark:text-amber-300 hover:text-amber-800 hover:bg-amber-500/10'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="whitespace-nowrap truncate">{isHindi ? 'प्रीमियम पास' : 'Premium Lifetime'}</span>
                    <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 shrink-0">
                      ₹99
                    </span>
                  </div>
                  <span className="text-amber-600 dark:text-amber-400 text-xs font-bold">→</span>
                </button>

                {/* 9. Contact */}
                <button
                  id="mobile-nav-contact"
                  onClick={() => handleNavClick('contact')}
                  className={`py-2.5 px-3 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    currentRoute === 'contact'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="whitespace-nowrap truncate">{isHindi ? 'संपर्क सहायता' : 'Contact Support'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              </div>

              {/* Bottom Controls Row: Language, Theme, and Premium CTA */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Language Switch */}
                  <button
                    onClick={toggleLanguage}
                    className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="whitespace-nowrap">{language === 'hi' ? 'English' : 'हिन्दी'}</span>
                  </button>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
                  >
                    {globalIsDark ? <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Moon className="w-3.5 h-3.5 text-slate-700 shrink-0" />}
                    <span className="whitespace-nowrap">{globalIsDark ? 'Light' : 'Dark'}</span>
                  </button>
                </div>

                {/* Full-width Premium CTA */}
                <button
                  id="mobile-premium-bottom-cta"
                  onClick={() => handleNavClick('premium')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:brightness-110 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
                  <span className="whitespace-nowrap truncate">{isHindi ? 'लेस लीगल लाइफटाइम पास लें — ₹99' : 'Get Less Legal Lifetime Pass — ₹99'}</span>
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
