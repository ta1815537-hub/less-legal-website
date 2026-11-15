import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeaderAnnouncementTicker } from './components/HeaderAnnouncementTicker';
import { TouchGlassGlowEffect } from './components/TouchGlassGlowEffect';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import { HomePage } from './pages/HomePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { FounderPage } from './pages/FounderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CareersPage } from './pages/CareersPage';
import { PremiumPage } from './pages/PremiumPage';
import { DownloadPage } from './pages/DownloadPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AppPrivacyPolicyPage } from './pages/AppPrivacyPolicyPage';
import { AppDeleteAccountPage } from './pages/AppDeleteAccountPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const parseRouteFromPath = (rawPath: string): { route: PageRoute; params: any } => {
  const path = rawPath.replace(/^\//, '').toLowerCase();
  if (path.startsWith('articles/')) {
    return { route: 'article-detail', params: { slug: rawPath.replace(/^\//, '').slice('articles/'.length) } };
  }
  if (path.startsWith('author/')) {
    return { route: 'author', params: { authorSlug: rawPath.replace(/^\//, '').slice('author/'.length) } };
  }
  if (path === 'articles') return { route: 'articles', params: {} };
  if (path === 'tools') return { route: 'tools', params: {} };
  if (path === 'features') return { route: 'features', params: {} };
  if (path === 'founder') return { route: 'founder', params: {} };
  if (path === 'about') return { route: 'about', params: {} };
  if (path === 'contact') return { route: 'contact', params: {} };
  if (path === 'careers') return { route: 'careers', params: {} };
  if (path === 'premium') return { route: 'premium', params: {} };
  if (path === 'download') return { route: 'download', params: {} };
  if (path === 'privacy') return { route: 'privacy', params: {} };
  if (path === 'app-privacy') return { route: 'app-privacy', params: {} };
  if (path === 'app-delete-account' || path === 'app-delete') return { route: 'app-delete-account', params: {} };
  if (path === 'terms') return { route: 'terms', params: {} };
  if (path === 'refund') return { route: 'refund', params: {} };
  if (path === 'disclaimer') return { route: 'disclaimer', params: {} };
  if (path === 'admin') return { route: 'admin', params: {} };
  return { route: 'home', params: {} };
};

export const App: React.FC = () => {
  const initialParsed = parseRouteFromPath(window.location.pathname);
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(initialParsed.route);
  const [routeParams, setRouteParams] = useState<any>(initialParsed.params);

  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRouteFromPath(window.location.pathname);
      setCurrentRoute(parsed.route);
      setRouteParams(parsed.params);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: PageRoute, params?: any) => {
    setCurrentRoute(route);
    setRouteParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let targetPath = '/';
    if (route === 'article-detail' && params?.slug) {
      targetPath = `/articles/${params.slug}`;
    } else if (route === 'author' && params?.authorSlug) {
      targetPath = `/author/${params.authorSlug}`;
    } else if (route !== 'home') {
      targetPath = `/${route}`;
    }

    try {
      window.history.pushState({}, '', targetPath);
    } catch {}
  };

  const renderPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'articles':
        return <ArticlesPage onNavigate={handleNavigate} />;
      case 'article-detail':
        return <ArticleDetailPage onNavigate={handleNavigate} slug={routeParams?.slug} />;
      case 'author':
        return <AuthorDetailPage authorSlug={routeParams?.authorSlug || 'anurag-gurauli'} onNavigate={handleNavigate} />;
      case 'tools':
        return <ToolsDirectoryPage onNavigate={handleNavigate} />;
      case 'features':
        return <FeaturesPage onNavigate={handleNavigate} />;
      case 'founder':
        return <FounderPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'careers':
        return <CareersPage onNavigate={handleNavigate} />;
      case 'premium':
        return <PremiumPage onNavigate={handleNavigate} />;
      case 'download':
        return <DownloadPage onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case 'app-privacy':
        return <AppPrivacyPolicyPage onNavigate={handleNavigate} />;
      case 'app-delete-account':
      case 'app-delete':
        return <AppDeleteAccountPage onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsPage onNavigate={handleNavigate} />;
      case 'refund':
        return <RefundPolicyPage onNavigate={handleNavigate} />;
      case 'disclaimer':
        return <DisclaimerPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#070B12] text-white flex flex-col relative selection:bg-red-500 selection:text-white">
        
        {/* Interactive Finger Touch / Pointer Glowing Glass-Press Effect */}
        <TouchGlassGlowEffect />

        {/* Navigation Bar */}
        <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

        {/* Main Content Viewport */}
        <main className="flex-1 pt-[64px] sm:pt-[72px]">
          <HeaderAnnouncementTicker onNavigate={handleNavigate} />
          {renderPage()}
        </main>

        {/* Global Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* Animated Auto-hiding Go To Top Floating Button */}
        <ScrollToTopButton />
      </div>
    </LanguageProvider>
  );
};
