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
import { CareersPage } from './pages/CareersPage';
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
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { LanguageProvider } from './context/LanguageContext';
import { FloatingSupportButton } from './components/FloatingSupportButton';
import { adminStorage } from './utils/adminStorage';

// Helper to determine route from current window path, query param, or hash
function getRouteFromLocation(): PageRoute {
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.replace(/^#\/?/, '');
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('tool')) {
    return 'tools';
  }
  const pageParam = searchParams.get('page') || searchParams.get('route') || (searchParams.has('admin') ? 'admin' : '');

  const target = pageParam || hash || pathname;

  if (target.toLowerCase().startsWith('tools') || target.toLowerCase().startsWith('tool/')) {
    return 'tools';
  }

  if (target.toLowerCase().startsWith('author/') || target.toLowerCase().startsWith('authors/')) {
    return 'author-detail';
  }

  if (target.toLowerCase().startsWith('articles/') && target.toLowerCase() !== 'articles' && target.toLowerCase() !== 'articles/') {
    return 'article-detail';
  }

  switch (target.toLowerCase()) {
    case 'articles':
    case 'article':
    case 'editorial':
    case 'blog': return 'articles';
    case 'about':
    case 'about-us':
    case 'about-less-creation': return 'about';
    case 'founder':
    case 'founder-and-creator': return 'founder';
    case 'careers':
    case 'career':
    case 'jobs':
    case 'hiring': return 'careers';
    case 'tools':
    case 'utilities': return 'tools';
    case 'less-legal':
    case 'lesslegal': return 'less-legal';
    case 'less-legal/features':
    case 'less-legal-features':
    case 'features': return 'less-legal-features';
    case 'resources':
    case 'resources-and-tools': return 'resources';
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

function getSlugFromLocation(): string | undefined {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/articles\/([^\/]+)$/i) || pathname.match(/^\/article\/([^\/]+)$/i);
  if (match) return decodeURIComponent(match[1]);

  const hash = window.location.hash;
  const hashMatch = hash.match(/^#\/?articles\/([^\/]+)$/i) || hash.match(/^#\/?article\/([^\/]+)$/i);
  if (hashMatch) return decodeURIComponent(hashMatch[1]);

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('slug')) return decodeURIComponent(searchParams.get('slug') || '');
  if (searchParams.has('article')) return decodeURIComponent(searchParams.get('article') || '');
  return undefined;
}

function getAuthorSlugFromLocation(): string | undefined {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/author(?:s)?\/([^\/]+)$/i);
  if (match) return decodeURIComponent(match[1]);

  const hash = window.location.hash;
  const hashMatch = hash.match(/^#\/?author(?:s)?\/([^\/]+)$/i);
  if (hashMatch) return decodeURIComponent(hashMatch[1]);

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('author')) return decodeURIComponent(searchParams.get('author') || '');
  return undefined;
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getRouteFromLocation);
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | undefined>(getSlugFromLocation);
  const [activeAuthorSlug, setActiveAuthorSlug] = useState<string | undefined>(getAuthorSlugFromLocation);
  const [siteConfig, setSiteConfig] = useState(adminStorage.getSiteAppConfig());

  useEffect(() => {
    const unsubscribe = adminStorage.subscribeToSiteAppConfig((updated) => {
      setSiteConfig(updated);
    });
    return () => unsubscribe();
  }, []);

  // Sync title, description, and canonical link for SEO based on route
  useEffect(() => {
    let title = 'Less Creation | Where Law Meets Technology.';
    let description = 'Less Creation is a technology and digital awareness brand founded by Anurag Gurauli, building useful products, publishing practical knowledge, and helping people navigate technology and cyber safety with confidence.';
    let path = '';

    switch (currentRoute) {
      case 'home': 
        title = 'Less Creation | Where Law Meets Technology.'; 
        description = 'Less Creation is a technology and digital awareness brand founded by Anurag Gurauli, building useful products, publishing practical knowledge, and helping people navigate technology and cyber safety with confidence.';
        path = ''; 
        break;
      case 'articles':
        title = 'Articles & Insights | Less Creation Technology & Legal Publication';
        description = 'Read high-impact articles, legal guides, software essays, and technology insights from Less Creation and Anurag Gurauli.';
        path = 'articles';
        break;
      case 'article-detail':
        title = activeArticleSlug ? `${activeArticleSlug.replace(/-/g, ' ')} | Less Creation` : 'Article | Less Creation';
        description = 'Read in-depth editorial analysis and legal tech insights on Less Creation.';
        path = activeArticleSlug ? `articles/${activeArticleSlug}` : 'articles';
        break;
      case 'author-detail':
        title = activeAuthorSlug ? `${activeAuthorSlug.replace(/-/g, ' ')} | Author Profile` : 'Author Profile | Less Creation';
        description = 'Explore articles and publications by author on Less Creation.';
        path = activeAuthorSlug ? `authors/${activeAuthorSlug}` : 'articles';
        break;
      case 'less-legal':
        title = 'Less Legal: All-in-One Smart Legal App | Less Creation Flagship';
        description = 'Explore Less Legal by Less Creation. Flagship smart legal app with Indian bare acts, case diary, document scanner, land converters, and 100% on-device privacy.';
        path = 'less-legal';
        break;
      case 'less-legal-features':
      case 'features':
        title = 'Less Legal Features & Smart Utilities Catalog | Less Creation';
        description = 'Browse integrated utilities in Less Legal. Document scanner, legal calculators, case diary, land converters, and bare acts.';
        path = 'less-legal/features';
        break;
      case 'about': 
        title = 'About Less Creation | Independent Technology & Software Studio'; 
        description = 'Learn about Less Creation, the independent technology studio founded by Anurag Gurauli, creator of Less Legal and everyday digital tools.';
        path = 'about'; 
        break;
      case 'founder': 
        title = 'Anurag Gurauli - Founder of Less Legal & Less Creation'; 
        description = 'Meet Anurag Gurauli, the founder of Less Legal and Less Creation. Discover the vision behind this trending new smart app for legal information and tools.';
        path = 'founder'; 
        break;
      case 'careers': 
        title = 'Careers & Hiring | Less Creation Technology Studio'; 
        description = 'Join Less Creation to build lightweight, purpose-driven digital products. Explore open roles in Android, React, UI/UX, and legal research.';
        path = 'careers'; 
        break;
      case 'resources':
        title = 'Resources & Legal Tools Hub | Less Creation';
        description = 'Practical legal guides, citizen rights explanations, land measurement converters, bare acts references, and educational materials by Less Creation.';
        path = 'resources';
        break;
      case 'tools':
        title = 'Everyday Work Tools & Utilities | Less Creation';
        description = 'Explore free, fast, browser-based everyday utilities. PDF tools, image compressors, word counter, EMI & GST calculators, QR generator by Less Creation.';
        path = 'tools';
        break;
      case 'premium': 
        title = 'Less Legal Permanent Lifetime Pass (₹99) | Less Creation'; 
        description = 'Upgrade to Less Legal Permanent Lifetime Access for ₹99 one-time. Unlimited document scanner, case diary workspace, and ad-free access with zero subscription fees.';
        path = 'premium'; 
        break;
      case 'contact': 
        title = 'Contact Support | Less Creation & Less Legal'; 
        description = 'Get in touch with the Less Creation team for technical support, inquiries, and assistance.';
        path = 'contact'; 
        break;
      case 'privacy': 
        title = 'Website Privacy Policy | Less Creation'; 
        description = 'Read the website privacy policy for Less Creation and its software products.';
        path = 'privacy-policy'; 
        break;
      case 'app-privacy': 
        title = 'App Privacy Policy | Less Legal Android App'; 
        description = 'Read the application privacy policy for Less Legal Android App by Less Creation.';
        path = 'less-legal/privacy-policy'; 
        break;
      case 'app-delete-account': 
        title = 'Delete Account & Data | Less Legal App'; 
        description = 'Instructions to delete your account and data on Less Legal smart app.';
        path = 'less-legal/delete-account'; 
        break;
      case 'terms': 
        title = 'Terms of Service | Less Creation'; 
        description = 'Terms of service and user agreement for Less Creation products and services.';
        path = 'terms'; 
        break;
      case 'refund': 
        title = 'Refund Policy | Less Creation'; 
        description = 'Refund and cancellation policy for Less Creation products and lifetime passes.';
        path = 'refund'; 
        break;
      case 'disclaimer': 
        title = 'Legal Disclaimer | Less Creation'; 
        description = 'Legal and regulatory disclaimer for tools and information provided by Less Creation.';
        path = 'disclaimer'; 
        break;
      case 'download': 
        title = 'Download Less Legal App: Smart Legal App | Less Creation'; 
        description = 'Download Less Legal today on Android. Experience the ultimate all-in-one app featuring legal references, document scanner, and case diary.';
        path = 'download'; 
        break;
      case 'admin': 
        title = 'Less Creation'; 
        description = 'Official website of Less Creation products and services.';
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
    canonical.setAttribute('href', path ? `https://lesscreation.com/${path}` : 'https://lesscreation.com/');
  }, [currentRoute]);

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const nextRoute = getRouteFromLocation();
      setCurrentRoute(nextRoute);
      if (nextRoute === 'article-detail') {
        const slug = getSlugFromLocation();
        if (slug) setActiveArticleSlug(slug);
      } else if (nextRoute === 'author-detail') {
        const author = getAuthorSlugFromLocation();
        if (author) setActiveAuthorSlug(author);
      }
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: PageRoute, param?: any) => {
    let slugParam = '';
    let authorSlugParam = '';
    if (typeof param === 'string') {
      slugParam = param.trim();
      authorSlugParam = param.trim();
    } else if (param && typeof param === 'object') {
      slugParam = (param.slug || param.id || '').toString().trim();
      authorSlugParam = (param.authorSlug || '').toString().trim();
    }

    if (route === 'article-detail' && slugParam) {
      setActiveArticleSlug(slugParam);
    } else if (route === 'author-detail' && authorSlugParam) {
      setActiveAuthorSlug(authorSlugParam);
    }

    setCurrentRoute(route);
    
    // Update path using history API for clean direct URLs
    let targetPath = '/';
    if (route === 'home') targetPath = '/';
    else if (route === 'articles') targetPath = '/articles';
    else if (route === 'article-detail' && slugParam) {
      targetPath = `/articles/${slugParam}`;
    } else if (route === 'author-detail' && authorSlugParam) {
      targetPath = `/authors/${authorSlugParam}`;
    }
    else if (route === 'tools') targetPath = '/tools';
    else if (route === 'less-legal') targetPath = '/less-legal';
    else if (route === 'less-legal-features' || route === 'features') targetPath = '/less-legal/features';
    else if (route === 'resources') targetPath = '/resources';
    else if (route === 'about') targetPath = '/about';
    else if (route === 'founder') targetPath = '/founder';
    else if (route === 'careers') targetPath = '/careers';
    else if (route === 'premium') targetPath = '/premium';
    else if (route === 'contact') targetPath = '/contact';
    else if (route === 'download') targetPath = '/download';
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
    
    try {
      window.scrollTo(0, 0);
    } catch {
      // Fallback
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col relative bg-[#0B1120] text-[#111016] dark:text-[#F5F2EE] font-sans selection:bg-[#16A34A] selection:text-white transition-colors duration-300 overflow-x-hidden">
        
        {/* Animated Smoke Background */}
        <SmokeBackground />
        
        {/* Navigation Header */}
        <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

        {/* Main Page Route Content with Smooth Transitions */}
        <main className="flex-1 flex flex-col bg-[#F5F1EC] dark:bg-[#0B1120] pt-16 sm:pt-20">
          <AnimatePresence mode="wait">
            <PageTransition routeKey={currentRoute}>
              {currentRoute === 'home' && <HomePage onNavigate={navigateTo} />}
              {currentRoute === 'articles' && <ArticlesPage onNavigate={navigateTo} />}
              {currentRoute === 'article-detail' && <ArticleDetailPage slug={activeArticleSlug} onNavigate={navigateTo} />}
              {currentRoute === 'author-detail' && <AuthorDetailPage authorSlug={activeAuthorSlug} onNavigate={navigateTo} />}
              {currentRoute === 'tools' && <ToolsDirectoryPage onNavigate={navigateTo} />}
              {(currentRoute === 'less-legal-features' || currentRoute === 'features') && <FeaturesPage onNavigate={navigateTo} />}
              {currentRoute === 'about' && <AboutPage onNavigate={navigateTo} />}
              {currentRoute === 'founder' && <FounderPage onNavigate={navigateTo} />}
              {currentRoute === 'careers' && <CareersPage onNavigate={navigateTo} />}
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

        {/* Footer with Mandatory Direct Policy Links (Hidden on Admin Dashboard for a clean dedicated console experience) */}
        {currentRoute !== 'admin' && <Footer onNavigate={navigateTo} />}

        {/* Floating Less Support Button (Elevated bottom-right, automatically hidden on Contact, Account Delete, Admin Dashboard, and Article Read pages) */}
        {currentRoute !== 'contact' && currentRoute !== 'app-delete-account' && currentRoute !== 'admin' && currentRoute !== 'article-detail' && (
          <FloatingSupportButton onNavigate={navigateTo} />
        )}

      </div>
    </LanguageProvider>
  );
}

