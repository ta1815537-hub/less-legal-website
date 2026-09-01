import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { AnimatePresence } from 'motion/react';
import { PageTransition, SmokeBackground } from './components/MotionWrappers';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { FounderPage } from './pages/FounderPage';
import { PremiumPage } from './pages/PremiumPage';
import { ContactPage } from './pages/ContactPage';
import { WebsitePrivacyPage } from './pages/WebsitePrivacyPage';
import { AppPrivacyPolicyPage } from './pages/AppPrivacyPolicyPage';
import { AppDeleteAccountPage } from './pages/AppDeleteAccountPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { DownloadPage } from './pages/DownloadPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LanguageProvider } from './context/LanguageContext';
import { FloatingLanguageButton } from './components/FloatingLanguageButton';

// Helper to determine route from current window path or hash
function getRouteFromLocation(): PageRoute {
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.replace(/^#\/?/, '');
  
  const target = hash || pathname;

  switch (target.toLowerCase()) {
    case 'about': return 'about';
    case 'founder':
    case 'founder-and-creator': return 'founder';
    case 'features': return 'features';
    case 'premium': return 'premium';
    case 'contact': return 'contact';
    case 'privacy':
    case 'privacy-policy': return 'privacy';
    case 'less-legal/privacy-policy':
    case 'less-legal/privacy':
    case 'less-legal-privacy':
    case 'app-privacy': return 'app-privacy';
    case 'less-legal/delete-account':
    case 'less-legal/delete':
    case 'less-legal-delete-account':
    case 'delete-account':
    case 'app-delete-account': return 'app-delete-account';
    case 'terms':
    case 'terms-and-conditions': return 'terms';
    case 'refund':
    case 'refund-policy': return 'refund';
    case 'disclaimer':
    case 'legal-disclaimer': return 'disclaimer';
    case 'download':
    case 'download-app': return 'download';
    case 'admin':
    case 'admin-dashboard':
    case 'portal': return 'admin';
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
    
    // Update path using history API for clean direct URLs
    let targetPath = '/';
    if (route === 'home') targetPath = '/';
    else if (route === 'privacy') targetPath = '/privacy-policy';
    else if (route === 'app-privacy') targetPath = '/less-legal/privacy-policy';
    else if (route === 'app-delete-account') targetPath = '/less-legal/delete-account';
    else targetPath = `/${route}`;

    if (window.location.pathname !== targetPath) {
      try {
        window.history.pushState({}, '', targetPath);
      } catch {
        // Fallback to hash if pushState is restricted
        window.location.hash = `#/${targetPath.replace(/^\/+/, '')}`;
      }
    }
    
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col relative bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-[#F5F2EE] font-sans selection:bg-[#C21F2F] selection:text-white transition-colors duration-300 overflow-x-hidden">
        
        {/* Animated Smoke Background */}
        <SmokeBackground />
        
        {/* Navigation Header */}
        <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

        {/* Main Page Route Content with Smooth Transitions */}
        <main className="flex-1 flex flex-col pt-16 sm:pt-20">
          <AnimatePresence mode="wait">
            <PageTransition routeKey={currentRoute}>
              {currentRoute === 'home' && <HomePage onNavigate={navigateTo} />}
              {currentRoute === 'about' && <AboutPage onNavigate={navigateTo} />}
              {currentRoute === 'founder' && <FounderPage onNavigate={navigateTo} />}
              {currentRoute === 'features' && <FeaturesPage onNavigate={navigateTo} />}
              {currentRoute === 'premium' && <PremiumPage onNavigate={navigateTo} />}
              {currentRoute === 'contact' && <ContactPage onNavigate={navigateTo} />}
              {currentRoute === 'privacy' && <WebsitePrivacyPage onNavigate={navigateTo} />}
              {currentRoute === 'app-privacy' && <AppPrivacyPolicyPage onNavigate={navigateTo} />}
              {currentRoute === 'app-delete-account' && <AppDeleteAccountPage onNavigate={navigateTo} />}
              {currentRoute === 'terms' && <TermsPage onNavigate={navigateTo} />}
              {currentRoute === 'refund' && <RefundPolicyPage onNavigate={navigateTo} />}
              {currentRoute === 'disclaimer' && <DisclaimerPage onNavigate={navigateTo} />}
              {currentRoute === 'download' && <DownloadPage onNavigate={navigateTo} />}
              {currentRoute === 'admin' && <AdminDashboardPage onNavigate={navigateTo} />}
            </PageTransition>
          </AnimatePresence>
        </main>

        {/* Footer with Mandatory Direct Policy Links */}
        <Footer onNavigate={navigateTo} />

        {/* Floating Language Switcher Button (Bottom Right) */}
        <FloatingLanguageButton />

      </div>
    </LanguageProvider>
  );
}

