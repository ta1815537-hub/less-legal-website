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

// Helper to determine route from current window path, query param, or hash
function getRouteFromLocation(): PageRoute {
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.replace(/^#\/?/, '');
  const searchParams = new URLSearchParams(window.location.search);
  const pageParam = searchParams.get('page') || searchParams.get('route') || (searchParams.has('admin') ? 'admin' : '');

  const target = pageParam || hash || pathname;

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

  // Sync title, description, and canonical link for SEO based on route
  useEffect(() => {
    let title = 'Less Legal: All in One Smart App | Less Creation';
    let description = 'Download Less Legal, a trending smart app by Less Creation founded by Anurag Gurauli. Access legal tools, document scanner, Share it app, MS Word, and bare acts.';
    let path = '';

    switch (currentRoute) {
      case 'home': 
        title = 'Less Legal: All in One Smart App | Less Creation by Anurag Gurauli'; 
        description = 'Download Less Legal, a trending smart app by Less Creation founded by Anurag Gurauli. Access legal tools, document scanner, Share it app, MS Word, and bare acts.';
        path = ''; 
        break;
      case 'about': 
        title = 'About Less Legal & Less Creation | The Ultimate Legal App'; 
        description = 'Learn about Less Legal by Less Creation, a trending all in one app combining legal drafting, legal documents, law students tools, and everyday utilities.';
        path = 'about'; 
        break;
      case 'features': 
        title = 'Legal Tools & Features: PDF App, Document Scanner | Less Legal'; 
        description = 'Explore 46+ smart app features of Less Legal. Use the document scanner, legal calculator, RTI draft maker, MS Word alternative, and access legal information.';
        path = 'features'; 
        break;
      case 'founder': 
        title = 'Anurag Gurauli - Founder of Less Legal & Less Creation'; 
        description = 'Meet Anurag Gurauli, the founder of Less Legal and Less Creation. Discover the vision behind this trending new smart app for legal information and tools.';
        path = 'founder'; 
        break;
      case 'premium': 
        title = 'Premium Legal App Plans & Law Students Tools | Less Legal'; 
        description = 'Upgrade to Less Legal Premium for advanced legal tools, unlimited document scanner, legal drafting features, and ad-free access to bare acts and legal calculators.';
        path = 'premium'; 
        break;
      case 'contact': 
        title = 'Contact Less Legal Support | Less Creation'; 
        description = 'Get in touch with the Less Legal team. We support our smart app users with queries regarding legal tools, PDF app features, and premium plans.';
        path = 'contact'; 
        break;
      case 'privacy': 
        title = 'Website Privacy Policy | Less Legal App'; 
        description = 'Read the website privacy policy for Less Legal, the smart app by Less Creation.';
        path = 'privacy-policy'; 
        break;
      case 'app-privacy': 
        title = 'App Privacy Policy | Less Legal Legal Tools'; 
        description = 'Read the application privacy policy for Less Legal Android App by Less Creation.';
        path = 'less-legal/privacy-policy'; 
        break;
      case 'app-delete-account': 
        title = 'Delete Account & Data | Less Legal App'; 
        description = 'Instructions to delete your account and data on Less Legal smart app.';
        path = 'less-legal/delete-account'; 
        break;
      case 'terms': 
        title = 'Terms of Service | Less Legal App'; 
        description = 'Terms of service and user agreement for Less Legal all in one app.';
        path = 'terms'; 
        break;
      case 'refund': 
        title = 'Refund Policy | Less Legal App'; 
        description = 'Refund and cancellation policy for Less Legal premium legal tools and plans.';
        path = 'refund'; 
        break;
      case 'disclaimer': 
        title = 'Legal Disclaimer | Less Legal App'; 
        description = 'Legal disclaimer for information and tools provided on the Less Legal app.';
        path = 'disclaimer'; 
        break;
      case 'download': 
        title = 'Download Less Legal App: New Trending Smart App | Less Creation'; 
        description = 'Download Less Legal today. Experience the ultimate all in one app featuring a PDF app, Share it alternative, poster maker, and comprehensive legal information.';
        path = 'download'; 
        break;
      case 'admin': 
        title = 'Admin Dashboard - Less Legal'; 
        description = 'Admin portal for Less Legal.';
        path = 'admin'; 
        break;
    }

    document.title = title;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph tags dynamically
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://www.lesscreation.com/${path}`);
  }, [currentRoute]);

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
      <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-[#EBF2FA] via-[#F4F8FD] to-[#EDF3FA] dark:from-[#08080C] dark:via-[#0D0F14] dark:to-[#121620] text-slate-900 dark:text-[#F5F2EE] font-sans selection:bg-[#2563EB] selection:text-white transition-colors duration-300 overflow-x-hidden">
        
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

