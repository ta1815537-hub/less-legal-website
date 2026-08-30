import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from './components/MotionWrappers';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PremiumPage } from './pages/PremiumPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { DownloadPage } from './pages/DownloadPage';

// Helper to determine route from current window path or hash
function getRouteFromLocation(): PageRoute {
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.replace(/^#\/?/, '');
  
  const target = hash || pathname;

  switch (target) {
    case 'about': return 'about';
    case 'features': return 'features';
    case 'premium': return 'premium';
    case 'contact': return 'contact';
    case 'privacy':
    case 'privacy-policy': return 'privacy';
    case 'terms':
    case 'terms-and-conditions': return 'terms';
    case 'refund':
    case 'refund-policy': return 'refund';
    case 'disclaimer':
    case 'legal-disclaimer': return 'disclaimer';
    case 'download':
    case 'download-app': return 'download';
    case '':
    case 'home':
    default:
      return 'home';
  }
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getRouteFromLocation);

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getRouteFromLocation());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    
    // Update path using history API for clean direct URLs (e.g. /privacy)
    const targetPath = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== targetPath) {
      try {
        window.history.pushState({}, '', targetPath);
      } catch {
        // Fallback to hash if pushState is restricted
        window.location.hash = `#/${route}`;
      }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

      {/* Main Page Route Content with Smooth Transitions */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <PageTransition routeKey={currentRoute}>
            {currentRoute === 'home' && <HomePage onNavigate={navigateTo} />}
            {currentRoute === 'about' && <AboutPage onNavigate={navigateTo} />}
            {currentRoute === 'features' && <FeaturesPage onNavigate={navigateTo} />}
            {currentRoute === 'premium' && <PremiumPage onNavigate={navigateTo} />}
            {currentRoute === 'contact' && <ContactPage onNavigate={navigateTo} />}
            {currentRoute === 'privacy' && <PrivacyPolicyPage onNavigate={navigateTo} />}
            {currentRoute === 'terms' && <TermsPage onNavigate={navigateTo} />}
            {currentRoute === 'refund' && <RefundPolicyPage onNavigate={navigateTo} />}
            {currentRoute === 'disclaimer' && <DisclaimerPage onNavigate={navigateTo} />}
            {currentRoute === 'download' && <DownloadPage onNavigate={navigateTo} />}
          </PageTransition>
        </AnimatePresence>
      </main>

      {/* Footer with Mandatory Direct Policy Links */}
      <Footer onNavigate={navigateTo} />

    </div>
  );
}

