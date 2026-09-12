import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { 
  Layers, Sparkles, Moon, Sun, Search,
  Home, BookOpen, Info, User, 
  ChevronRight, ArrowRight, Briefcase, Phone
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
  const [scrolled, setScrolled] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteAppConfig>(adminStorage.getSiteAppConfig());
  
  const { isDark: globalIsDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
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

  // Auto-close side panel when tapping anywhere on the screen outside drawer
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

  const desktopNavLinks: { label: string; route: PageRoute; badge?: string }[] = [
    { label: isHindi ? 'होम' : 'Home', route: 'home' },
    { label: isHindi ? 'लेख व गाइड' : 'Articles & Guides', route: 'articles', badge: 'New' },
    { label: isHindi ? 'टूल्स' : 'Tools', route: 'tools', badge: `${TOTAL_TOOLS_COUNT}` },
    { label: isHindi ? 'लेस क्रिएशन' : 'About', route: 'about' },
    { label: isHindi ? 'संस्थापक' : 'Founder', route: 'founder' },
    { label: isHindi ? 'संपर्क' : 'Contact', route: 'contact' },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="fixed left-0 right-0 top-0 h-0.5 z-[60] bg-[#16A34A] dark:bg-[#22C55E] transition-all duration-300"
      />

      {/* Editorial Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#F5F1EC]/90 dark:bg-[#0B1120]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-white/10 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            
            {/* LEFT: Brand Logo & Editorial Title */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
              {/* Mobile Hamburger Menu Trigger */}
              <button
                id="nav-mobile-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#111016] dark:text-[#F5F2EE] hover:bg-stone-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between items-center">
                  <span
                    className={`w-5 h-0.5 rounded-full bg-current transition-all duration-200 origin-left ${
                      mobileMenuOpen ? 'rotate-45 translate-x-0.5 -translate-y-0.5' : ''
                    }`}
                  />
                  <span
                    className={`w-5 h-0.5 rounded-full bg-current transition-all duration-150 ${
                      mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`w-5 h-0.5 rounded-full bg-current transition-all duration-200 origin-left ${
                      mobileMenuOpen ? '-rotate-45 translate-x-0.5 translate-y-0.5' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Brand Logo & Editorial Title */}
              <a 
                id="nav-brand-logo"
                href="/"
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer shrink-0"
              >
                <div className="shrink-0 flex items-center justify-center">
                  <LTLogo className="w-9 h-9 sm:w-11 sm:h-11" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1 leading-none">
                    <span className="text-base sm:text-xl font-black tracking-tight leading-none text-[#111016] dark:text-white">
                      Less Creation
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 whitespace-nowrap leading-tight mt-0.5">
                    WHERE LAW MEETS TECHNOLOGY
                  </p>
                </div>
              </a>
            </div>

            {/* CENTER: Desktop Editorial Nav Links */}
            <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
              {desktopNavLinks.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <a
                    key={item.route}
                    href={`/${item.route === 'home' ? '' : item.route}`}
                    id={`nav-link-${item.route}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.route); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap single-line-fit flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#111016] dark:text-white bg-black/5 dark:bg-white/10 font-bold'
                        : 'text-stone-600 dark:text-stone-300 hover:text-[#111016] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* RIGHT: Quick CTAs, Language & Theme Toggles */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-white/10 border border-stone-200/80 dark:border-white/10 transition-colors flex items-center justify-center cursor-pointer shadow-2xs shrink-0"
                aria-label="Toggle Theme"
              >
                {globalIsDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 bg-black/40 lg:hidden cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                id="mobile-nav-drawer"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="lg:hidden absolute top-full left-3 right-3 sm:left-6 sm:right-6 mt-2 p-4 rounded-2xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-xl space-y-3 z-50 overflow-hidden"
              >
                <div className="flex flex-col space-y-1">
                  {desktopNavLinks.map((link) => {
                    const isActive = currentRoute === link.route;
                    return (
                      <button
                        key={link.route}
                        onClick={() => handleNavClick(link.route)}
                        className={`w-full py-2.5 px-3 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-stone-100 dark:bg-white/10 text-[#111016] dark:text-white'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span>{link.label}</span>
                          {link.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
